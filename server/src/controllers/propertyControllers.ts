import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Location } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

/** Search radius for the lat/lng filter, in kilometres. */
const SEARCH_RADIUS_KM = 80;

export const getProperties = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    const whereConditions: Prisma.Sql[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string)
        .split(",")
        .map(Number)
        .filter((n) => Number.isFinite(n));
      if (favoriteIdsArray.length) {
        whereConditions.push(
          Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`,
        );
      }
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`,
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`,
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`,
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`,
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`,
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",").filter(Boolean);
      if (amenitiesArray.length) {
        whereConditions.push(
          Prisma.sql`p.amenities @> ${amenitiesArray}::"Amenity"[]`,
        );
      }
    }

    // Only homes with no lease covering the requested move-in date.
    if (availableFrom && availableFrom !== "any") {
      const date = new Date(String(availableFrom));
      if (!isNaN(date.getTime())) {
        whereConditions.push(
          Prisma.sql`NOT EXISTS (
            SELECT 1 FROM "Lease" l2
            WHERE l2."propertyId" = p.id
            AND l2."startDate" <= ${date}
            AND l2."endDate" >= ${date}
          )`,
        );
      }
    }

    // Skip the geo filter when fetching an explicit favourites list.
    if (latitude && longitude && !favoriteIds) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        whereConditions.push(
          Prisma.sql`ST_DWithin(
            l.coordinates,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
            ${SEARCH_RADIUS_KM * 1000}
          )`,
        );
      }
    }

    const completeQuery = Prisma.sql`
      SELECT
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location,
        json_build_object(
          'id', m.id,
          'cognitoId', m."cognitoId",
          'name', m.name,
          'email', m.email,
          'phoneNumber', m."phoneNumber"
        ) as manager
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      JOIN "Manager" m ON p."managerCognitoId" = m."cognitoId"
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
      ORDER BY p."postedDate" DESC
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
        manager: true,
      },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const coordinates: { coordinates: string }[] =
      await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

    const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
    const longitude = geoJSON.coordinates[0];
    const latitude = geoJSON.coordinates[1];

    res.json({
      ...property,
      location: {
        ...property.location,
        coordinates: { longitude, latitude },
      },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const getPropertyLeases = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const leases = await prisma.lease.findMany({
      where: { propertyId: Number(id) },
      include: { tenant: true, payments: true },
      orderBy: { startDate: "desc" },
    });
    res.json(leases);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property leases: ${err.message}` });
  }
};

export const createProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      latitude: latitudeInput,
      longitude: longitudeInput,
      ...propertyData
    } = req.body;

    const uploadedPhotoUrls = await Promise.all(
      files.map(async (file) => {
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: `properties/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const uploadResult = await new Upload({
          client: s3Client,
          params: uploadParams,
        }).done();

        return uploadResult.Location;
      }),
    );
    const photoUrls = uploadedPhotoUrls.filter(
      (url): url is string => typeof url === "string",
    );

    // Prefer coordinates supplied by the client; otherwise geocode the address.
    let longitude = parseFloat(longitudeInput);
    let latitude = parseFloat(latitudeInput);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || (longitude === 0 && latitude === 0)) {
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
        {
          street: address,
          city,
          country,
          postalcode: postalCode,
          format: "json",
          limit: "1",
        },
      ).toString()}`;
      const geocodingResponse = await axios.get(geocodingUrl, {
        headers: {
          "User-Agent": "RentifulApp (contact@rentiful.dev)",
        },
      });
      const hit = geocodingResponse.data[0];
      longitude = hit?.lon ? parseFloat(hit.lon) : 0;
      latitude = hit?.lat ? parseFloat(hit.lat) : 0;
    }

    // create location
    const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    const toList = (value: unknown) =>
      typeof value === "string"
        ? value.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    // create property
    const newProperty = await prisma.property.create({
      data: {
        name: propertyData.name,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        photoUrls,
        locationId: location.id,
        managerCognitoId,
        amenities: toList(propertyData.amenities) as any,
        highlights: toList(propertyData.highlights) as any,
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: {
        location: true,
        manager: true,
      },
    });

    const propertyWithRelations = newProperty as typeof newProperty & {
      location: { address: string; city: string; state: string; country: string; postalCode: string };
    };

    res.status(201).json({
      ...newProperty,
      location: {
        ...propertyWithRelations.location,
        coordinates: { longitude, latitude },
      },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};
