/**
 * Seed data for the in-browser mock API.
 *
 * Everything here is plain data (no app imports) so it can also be exported
 * to JSON for the server's Prisma seed.
 */

import type {
  Amenity,
  Application,
  Highlight,
  Lease,
  Manager,
  Payment,
  PropertyType,
  Tenant,
} from "@/types/models";

export const DEMO_PASSWORD = "demo1234";

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export const managers: Manager[] = [
  {
    id: 1,
    cognitoId: "mgr-rahim-chowdhury",
    name: "Md. Rahim Chowdhury",
    email: "rahim@rentiful.bd",
    phoneNumber: "+880 1711-234567",
  },
  {
    id: 2,
    cognitoId: "mgr-farhana-islam",
    name: "Farhana Islam",
    email: "farhana@rentiful.bd",
    phoneNumber: "+880 1812-345678",
  },
  {
    id: 3,
    cognitoId: "mgr-tanvir-ahmed",
    name: "Tanvir Ahmed",
    email: "tanvir@rentiful.bd",
    phoneNumber: "+880 1913-456789",
  },
  {
    id: 4,
    cognitoId: "mgr-nusrat-jahan",
    name: "Nusrat Jahan",
    email: "nusrat@rentiful.bd",
    phoneNumber: "+880 1614-567890",
  },
];

export const tenants: Omit<Tenant, "favorites">[] = [
  {
    id: 1,
    cognitoId: "tnt-sadia-rahman",
    name: "Sadia Rahman",
    email: "sadia@rentiful.bd",
    phoneNumber: "+880 1715-678901",
  },
  {
    id: 2,
    cognitoId: "tnt-mahmud-hasan",
    name: "Mahmud Hasan",
    email: "mahmud@rentiful.bd",
    phoneNumber: "+880 1816-789012",
  },
  {
    id: 3,
    cognitoId: "tnt-tasnim-akther",
    name: "Tasnim Akther",
    email: "tasnim@rentiful.bd",
    phoneNumber: "+880 1917-890123",
  },
  {
    id: 4,
    cognitoId: "tnt-arif-hossain",
    name: "Arif Hossain",
    email: "arif@rentiful.bd",
    phoneNumber: "+880 1618-901234",
  },
  {
    id: 5,
    cognitoId: "tnt-nabila-sultana",
    name: "Nabila Sultana",
    email: "nabila@rentiful.bd",
    phoneNumber: "+880 1719-012345",
  },
  {
    id: 6,
    cognitoId: "tnt-rifat-karim",
    name: "Rifat Karim",
    email: "rifat@rentiful.bd",
    phoneNumber: "+880 1820-123456",
  },
];

/** Tenant favourites: tenant cognitoId -> property ids */
export const favorites: Record<string, number[]> = {
  "tnt-sadia-rahman": [1, 5, 9, 14, 21],
  "tnt-mahmud-hasan": [2, 3],
  "tnt-tasnim-akther": [4],
  "tnt-arif-hossain": [4, 5, 6],
  "tnt-nabila-sultana": [1, 6, 8],
  "tnt-rifat-karim": [],
};

/* ------------------------------------------------------------------ */
/* Properties                                                          */
/* ------------------------------------------------------------------ */

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export interface SeedProperty {
  id: number;
  name: string;
  description: string;
  pricePerMonth: number;
  securityDeposit: number;
  applicationFee: number;
  photoUrls: string[];
  amenities: Amenity[];
  highlights: Highlight[];
  isPetsAllowed: boolean;
  isParkingIncluded: boolean;
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: PropertyType;
  postedDate: string;
  averageRating: number;
  numberOfReviews: number;
  managerCognitoId: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    longitude: number;
    latitude: number;
  };
}

const sourceProperties: SeedProperty[] = [
  /* ---------------- John Smith — Los Angeles ---------------- */
  {
    id: 1,
    name: "Silver Lake Modern Loft",
    description:
      "Light-filled corner loft with 14-foot ceilings, polished concrete floors and a wall of west-facing windows overlooking the reservoir. Chef's kitchen with quartz counters and a walk-in pantry. Two blocks from Sunset Junction cafés and the weekend farmers market.",
    pricePerMonth: 3450,
    securityDeposit: 3450,
    applicationFee: 45,
    photoUrls: [
      u("photo-1502672260266-1c1ef2d93688"),
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1484154218962-a197022b5858"),
      u("photo-1616594039964-ae9021a400a0"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Parking"],
    highlights: ["GreatView", "RecentlyRenovated", "CloseToTransit", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 2,
    baths: 2,
    squareFeet: 1240,
    propertyType: "Apartment",
    postedDate: "2026-08-28T10:00:00.000Z",
    averageRating: 4.8,
    numberOfReviews: 42,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "2412 Griffith Park Blvd",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90039",
      longitude: -118.2707,
      latitude: 34.0969,
    },
  },
  {
    id: 2,
    name: "Venice Canals Bungalow",
    description:
      "A 1920s craftsman bungalow on the historic Venice canals, fully restored with original fir floors, a wraparound porch and a private paddle-board dock. Walk to Abbot Kinney in five minutes and the beach in ten.",
    pricePerMonth: 6200,
    securityDeposit: 6200,
    applicationFee: 50,
    photoUrls: [
      u("photo-1568605114967-8130f3a36994"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600607687939-ce8a6c25118c"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HardwoodFloors", "Refrigerator", "PetsAllowed", "WiFi"],
    highlights: ["GreatView", "QuietNeighborhood", "SprinklerSystem", "TubShower"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 3,
    baths: 2,
    squareFeet: 1780,
    propertyType: "Cottage",
    postedDate: "2026-09-02T14:30:00.000Z",
    averageRating: 4.9,
    numberOfReviews: 18,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "418 Sherman Canal",
      city: "Venice",
      state: "CA",
      country: "United States",
      postalCode: "90291",
      longitude: -118.4695,
      latitude: 33.9836,
    },
  },
  {
    id: 3,
    name: "The Broadway Residences · 1804",
    description:
      "High-floor one bedroom in a converted 1927 bank building in the Historic Core. Restored terrazzo lobby, rooftop pool with skyline views, 24-hour concierge and an on-site fitness club. Steps from Grand Central Market and the Metro.",
    pricePerMonth: 2780,
    securityDeposit: 2500,
    applicationFee: 40,
    photoUrls: [
      u("photo-1536376072261-38c75010e6c9"),
      u("photo-1560448204-e02f11c3d0e2"),
      u("photo-1615874959474-d609969a20ed"),
      u("photo-1600573472592-401b489a3cdc"),
    ],
    amenities: ["AirConditioning", "Dishwasher", "HighSpeedInternet", "Gym", "Pool", "Microwave", "Refrigerator"],
    highlights: ["GreatView", "CloseToTransit", "Intercom", "CableReady", "HighSpeedInternetAccess"],
    isPetsAllowed: false,
    isParkingIncluded: true,
    beds: 1,
    baths: 1,
    squareFeet: 760,
    propertyType: "Apartment",
    postedDate: "2026-07-12T09:00:00.000Z",
    averageRating: 4.5,
    numberOfReviews: 127,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "650 S Spring St",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90014",
      longitude: -118.2516,
      latitude: 34.0451,
    },
  },
  {
    id: 4,
    name: "Los Feliz Hillside Villa",
    description:
      "Mid-century post-and-beam home tucked into the hills below Griffith Observatory. Floor-to-ceiling glass, a heated saltwater pool, outdoor kitchen and a detached studio that works as an office or guest suite. Fully fenced garden with citrus trees.",
    pricePerMonth: 9800,
    securityDeposit: 9800,
    applicationFee: 60,
    photoUrls: [
      u("photo-1613490493576-7fde63acd811"),
      u("photo-1512917774080-9991f1c4c750"),
      u("photo-1600566753086-00f18fb6b3ea"),
      u("photo-1616594039964-ae9021a400a0"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "WalkInClosets", "Pool", "Parking", "PetsAllowed"],
    highlights: ["GreatView", "QuietNeighborhood", "DoubleVanities", "RecentlyRenovated", "SprinklerSystem"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 4,
    baths: 3.5,
    squareFeet: 3120,
    propertyType: "Villa",
    postedDate: "2026-09-10T16:00:00.000Z",
    averageRating: 5,
    numberOfReviews: 7,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "2635 N Vermont Canyon Rd",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90027",
      longitude: -118.2913,
      latitude: 34.1136,
    },
  },
  {
    id: 5,
    name: "Ocean Avenue Studio",
    description:
      "Bright studio one block from Palisades Park with a peek of the Pacific from the Juliet balcony. Murphy bed, built-in desk, in-unit laundry and a secure bike room. Ride the Expo line downtown or bike the beach path to Venice.",
    pricePerMonth: 2350,
    securityDeposit: 2000,
    applicationFee: 40,
    photoUrls: [
      u("photo-1493809842364-78817add7ffb"),
      u("photo-1598928506311-c55ded91a20c"),
      u("photo-1552321554-5fefe8c9ef14"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "HighSpeedInternet", "Microwave", "Refrigerator", "WiFi"],
    highlights: ["GreatView", "CloseToTransit", "SmokeFree", "Intercom"],
    isPetsAllowed: false,
    isParkingIncluded: false,
    beds: 0,
    baths: 1,
    squareFeet: 480,
    propertyType: "Rooms",
    postedDate: "2026-09-15T11:00:00.000Z",
    averageRating: 4.3,
    numberOfReviews: 31,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "1327 Ocean Ave",
      city: "Santa Monica",
      state: "CA",
      country: "United States",
      postalCode: "90401",
      longitude: -118.4949,
      latitude: 34.0161,
    },
  },
  {
    id: 6,
    name: "Echo Park Craftsman Duplex",
    description:
      "Upper unit of a lovingly kept 1912 craftsman duplex with a sunroom, built-in bookcases and a claw-foot tub. Shared backyard with a fire pit and vegetable beds. Two minutes to Echo Park Lake and the Sunset Blvd bus lines.",
    pricePerMonth: 2950,
    securityDeposit: 2950,
    applicationFee: 40,
    photoUrls: [
      u("photo-1564013799919-ab600027ffc6"),
      u("photo-1554995207-c18c203602cb"),
      u("photo-1540518614846-7eded433c457"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HardwoodFloors", "Refrigerator", "PetsAllowed", "Parking"],
    highlights: ["QuietNeighborhood", "TubShower", "CloseToTransit", "RecentlyRenovated"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 2,
    baths: 1,
    squareFeet: 1050,
    propertyType: "Townhouse",
    postedDate: "2026-08-05T08:00:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 22,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "1519 Echo Park Ave",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90026",
      longitude: -118.2596,
      latitude: 34.0791,
    },
  },
  {
    id: 7,
    name: "Culver City Garden Flat",
    description:
      "Ground-floor two bedroom with a private patio in a quiet 8-unit courtyard building. New stainless appliances, central air and assigned covered parking. Ten minute walk to the Culver City Arts District and the E Line.",
    pricePerMonth: 3100,
    securityDeposit: 3100,
    applicationFee: 45,
    photoUrls: [
      u("photo-1560185007-c5ca9d2c014d"),
      u("photo-1556912172-45b7abe8b7e1"),
      u("photo-1585129777188-94600bc7b4b3"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "Microwave", "Refrigerator", "Parking", "WalkInClosets"],
    highlights: ["QuietNeighborhood", "CloseToTransit", "SmokeFree", "CableReady"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 2,
    baths: 2,
    squareFeet: 980,
    propertyType: "Apartment",
    postedDate: "2026-09-08T12:00:00.000Z",
    averageRating: 4.4,
    numberOfReviews: 15,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "3826 Bentley Ave",
      city: "Culver City",
      state: "CA",
      country: "United States",
      postalCode: "90232",
      longitude: -118.3965,
      latitude: 34.0211,
    },
  },
  {
    id: 8,
    name: "Pasadena Arroyo Cottage",
    description:
      "Storybook cottage at the edge of the Arroyo Seco with a stone fireplace, a reading nook under the eaves and a shaded brick patio. Mature oaks, a detached one-car garage and trailhead access at the end of the street.",
    pricePerMonth: 3600,
    securityDeposit: 3600,
    applicationFee: 45,
    photoUrls: [
      u("photo-1518780664697-55e3ad937233"),
      u("photo-1523217582562-09d0def993a6"),
      u("photo-1524758631624-e2822e304c36"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HardwoodFloors", "Refrigerator", "Parking", "PetsAllowed"],
    highlights: ["QuietNeighborhood", "GreatView", "SprinklerSystem", "TubShower"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 2,
    baths: 1.5,
    squareFeet: 1180,
    propertyType: "Cottage",
    postedDate: "2026-06-21T10:00:00.000Z",
    averageRating: 4.9,
    numberOfReviews: 11,
    managerCognitoId: "mgr-john-smith",
    location: {
      address: "245 S Arroyo Blvd",
      city: "Pasadena",
      state: "CA",
      country: "United States",
      postalCode: "91105",
      longitude: -118.1636,
      latitude: 34.1394,
    },
  },

  /* ---------------- Elena Vasquez — LA + Bay Area ---------------- */
  {
    id: 9,
    name: "Long Beach Harbor Townhome",
    description:
      "Three-story townhome in Naples with a rooftop deck facing the Alamitos Bay marina. Two-car garage, elevator-ready shaft, a wet bar on the roof level and a ground floor flex room. Paddle-boards launch from the end of the block.",
    pricePerMonth: 4700,
    securityDeposit: 4700,
    applicationFee: 50,
    photoUrls: [
      u("photo-1505873242700-f289a29e1e0f"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1560184897-ae75f418493e"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "WalkInClosets", "Parking"],
    highlights: ["GreatView", "DoubleVanities", "RecentlyRenovated", "Intercom"],
    isPetsAllowed: false,
    isParkingIncluded: true,
    beds: 3,
    baths: 2.5,
    squareFeet: 1920,
    propertyType: "Townhouse",
    postedDate: "2026-08-19T15:00:00.000Z",
    averageRating: 4.6,
    numberOfReviews: 9,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "5507 E Naples Plaza",
      city: "Long Beach",
      state: "CA",
      country: "United States",
      postalCode: "90803",
      longitude: -118.1206,
      latitude: 33.7583,
    },
  },
  {
    id: 10,
    name: "Highland Park Tiny House",
    description:
      "Architect-designed 320 sq ft tiny house on a private lot with a sleeping loft, full kitchen, composting garden and a deck under a pepper tree. Utilities and fiber internet included. Walk to York Blvd bars and the Gold Line.",
    pricePerMonth: 1650,
    securityDeposit: 1200,
    applicationFee: 30,
    photoUrls: [
      u("photo-1587061949409-02df41d5e562"),
      u("photo-1510798831971-661eb04b3739"),
      u("photo-1513694203232-719a280e022f"),
    ],
    amenities: ["AirConditioning", "HighSpeedInternet", "Microwave", "Refrigerator", "WiFi", "PetsAllowed"],
    highlights: ["QuietNeighborhood", "CloseToTransit", "RecentlyRenovated", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 1,
    baths: 1,
    squareFeet: 320,
    propertyType: "Tinyhouse",
    postedDate: "2026-09-12T09:30:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 26,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "5921 Aldama St",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90042",
      longitude: -118.1932,
      latitude: 34.1103,
    },
  },
  {
    id: 11,
    name: "Mission District Victorian Flat",
    description:
      "Top floor of a painted-lady Victorian on a sunny Mission block with bay windows, 11-foot ceilings and original redwood trim. Renovated kitchen, in-unit laundry and a shared roof deck with Twin Peaks views. Half a block to Dolores Park.",
    pricePerMonth: 4850,
    securityDeposit: 4850,
    applicationFee: 55,
    photoUrls: [
      u("photo-1449844908441-8829872d2607"),
      u("photo-1512918728675-ed5a9ecdebfd"),
      u("photo-1523755231516-e43fd2e8dca5"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Refrigerator"],
    highlights: ["GreatView", "CloseToTransit", "RecentlyRenovated", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 2,
    baths: 1,
    squareFeet: 1100,
    propertyType: "Apartment",
    postedDate: "2026-09-01T10:00:00.000Z",
    averageRating: 4.8,
    numberOfReviews: 34,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "3742 20th St",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postalCode: "94110",
      longitude: -122.4256,
      latitude: 37.7586,
    },
  },
  {
    id: 12,
    name: "Hayes Valley Penthouse",
    description:
      "Corner penthouse in a 2019 glass-and-steel building with a private 600 sq ft terrace, Gaggenau kitchen, radiant floors and a dedicated EV parking space. Concierge, package room and a resident lounge. Patricia's Green is at your doorstep.",
    pricePerMonth: 8900,
    securityDeposit: 8900,
    applicationFee: 60,
    photoUrls: [
      u("photo-1502005229762-cf1b2da7c5d6"),
      u("photo-1600121848594-d8644e57abab"),
      u("photo-1586023492125-27b2c045efd7"),
      u("photo-1571508601891-ca5e7a713859"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "WalkInClosets", "Gym", "Parking"],
    highlights: ["GreatView", "DoubleVanities", "Intercom", "RecentlyRenovated", "SmokeFree"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 3,
    squareFeet: 2050,
    propertyType: "Apartment",
    postedDate: "2026-07-30T13:00:00.000Z",
    averageRating: 4.9,
    numberOfReviews: 12,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "450 Hayes St",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postalCode: "94102",
      longitude: -122.4241,
      latitude: 37.7764,
    },
  },
  {
    id: 13,
    name: "Noe Valley Family Home",
    description:
      "Detached Edwardian on a tree-lined Noe Valley street with a south-facing garden, a remodelled kitchen that opens onto a deck, and a finished lower level with a second living room. Attached garage and a Whole Foods around the corner.",
    pricePerMonth: 7400,
    securityDeposit: 7400,
    applicationFee: 55,
    photoUrls: [
      u("photo-1570129477492-45c003edd2be"),
      u("photo-1600585154526-990dced4db0d"),
      u("photo-1565182999561-18d7dc61c393"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HardwoodFloors", "Refrigerator", "Parking", "PetsAllowed", "WalkInClosets"],
    highlights: ["QuietNeighborhood", "SprinklerSystem", "TubShower", "CableReady"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 4,
    baths: 2.5,
    squareFeet: 2400,
    propertyType: "Villa",
    postedDate: "2026-08-14T09:00:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 8,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "1288 Sanchez St",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postalCode: "94114",
      longitude: -122.4302,
      latitude: 37.7511,
    },
  },
  {
    id: 14,
    name: "Temescal Warehouse Loft",
    description:
      "Authentic brick-and-timber loft in a converted Oakland cannery with 16-foot ceilings, a mezzanine bedroom and skylights running the length of the unit. Gated parking, a shared woodshop and Temescal Alley coffee a block away.",
    pricePerMonth: 3250,
    securityDeposit: 3250,
    applicationFee: 45,
    photoUrls: [
      u("photo-1484101403633-562f891dc89a"),
      u("photo-1505691938895-1758d7feb511"),
      u("photo-1560185127-6ed189bf02f4"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Parking", "PetsAllowed"],
    highlights: ["RecentlyRenovated", "CloseToTransit", "Intercom", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 1,
    baths: 1,
    squareFeet: 1350,
    propertyType: "Apartment",
    postedDate: "2026-09-16T17:00:00.000Z",
    averageRating: 4.6,
    numberOfReviews: 19,
    managerCognitoId: "mgr-elena-vasquez",
    location: {
      address: "4801 Shattuck Ave",
      city: "Oakland",
      state: "CA",
      country: "United States",
      postalCode: "94609",
      longitude: -122.2653,
      latitude: 37.8353,
    },
  },

  /* ---------------- Marcus Chen — East Coast + Chicago ---------------- */
  {
    id: 15,
    name: "Williamsburg Waterfront Two-Bed",
    description:
      "Two bedroom in a full-service tower on the East River with a 40th-floor sky lounge, indoor pool and direct ferry access. Floor-to-ceiling windows frame the Manhattan skyline; the second bedroom fits a queen and a desk. Bedford Ave L train in four minutes.",
    pricePerMonth: 6750,
    securityDeposit: 6750,
    applicationFee: 20,
    photoUrls: [
      u("photo-1560448204-e02f11c3d0e2"),
      u("photo-1502672260266-1c1ef2d93688"),
      u("photo-1615874959474-d609969a20ed"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "Gym", "Pool", "WalkInClosets"],
    highlights: ["GreatView", "CloseToTransit", "Intercom", "DoubleVanities", "SmokeFree"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 2,
    baths: 2,
    squareFeet: 1080,
    propertyType: "Apartment",
    postedDate: "2026-09-05T10:00:00.000Z",
    averageRating: 4.6,
    numberOfReviews: 88,
    managerCognitoId: "mgr-marcus-chen",
    location: {
      address: "1 N 4th Pl",
      city: "Brooklyn",
      state: "NY",
      country: "United States",
      postalCode: "11249",
      longitude: -73.9645,
      latitude: 40.7166,
    },
  },
  {
    id: 16,
    name: "Astoria Garden Apartment",
    description:
      "Sunny garden-level one bedroom in a well-kept brick two-family with a private backyard patio, a renovated bath and a laundry room in the basement. Astoria Park and the Hell Gate footpath are three blocks away; the N/W is a seven minute walk.",
    pricePerMonth: 2650,
    securityDeposit: 2650,
    applicationFee: 20,
    photoUrls: [
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1598928506311-c55ded91a20c"),
      u("photo-1552321554-5fefe8c9ef14"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Refrigerator", "Microwave", "HardwoodFloors"],
    highlights: ["QuietNeighborhood", "CloseToTransit", "TubShower", "CableReady"],
    isPetsAllowed: false,
    isParkingIncluded: false,
    beds: 1,
    baths: 1,
    squareFeet: 720,
    propertyType: "Apartment",
    postedDate: "2026-08-22T11:00:00.000Z",
    averageRating: 4.4,
    numberOfReviews: 23,
    managerCognitoId: "mgr-marcus-chen",
    location: {
      address: "22-15 33rd St",
      city: "Astoria",
      state: "NY",
      country: "United States",
      postalCode: "11105",
      longitude: -73.9161,
      latitude: 40.7757,
    },
  },
  {
    id: 17,
    name: "Upper West Side Classic Six",
    description:
      "A true classic six in a pre-war doorman building off Riverside Park: formal dining room, two full baths, a windowed kitchen and a maid's room that works as a nursery or study. Herringbone floors, crown mouldings and a wood-burning fireplace.",
    pricePerMonth: 11500,
    securityDeposit: 11500,
    applicationFee: 20,
    photoUrls: [
      u("photo-1600566753086-00f18fb6b3ea"),
      u("photo-1512918728675-ed5a9ecdebfd"),
      u("photo-1600121848594-d8644e57abab"),
      u("photo-1523755231516-e43fd2e8dca5"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HardwoodFloors", "WalkInClosets", "Refrigerator"],
    highlights: ["QuietNeighborhood", "Intercom", "DoubleVanities", "TubShower", "CloseToTransit"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 3,
    baths: 2,
    squareFeet: 1850,
    propertyType: "Apartment",
    postedDate: "2026-07-25T09:00:00.000Z",
    averageRating: 4.8,
    numberOfReviews: 14,
    managerCognitoId: "mgr-marcus-chen",
    location: {
      address: "310 W 86th St",
      city: "New York",
      state: "NY",
      country: "United States",
      postalCode: "10024",
      longitude: -73.9789,
      latitude: 40.7887,
    },
  },
  {
    id: 18,
    name: "Cambridge Porter Square Townhouse",
    description:
      "End-unit brick townhouse steps from Porter Square with three floors of living space, a finished basement gym, a fenced garden and off-street parking for two. Ten minutes on the Red Line to Harvard and MIT.",
    pricePerMonth: 5200,
    securityDeposit: 5200,
    applicationFee: 35,
    photoUrls: [
      u("photo-1494526585095-c41746248156"),
      u("photo-1554995207-c18c203602cb"),
      u("photo-1540518614846-7eded433c457"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Parking", "Gym"],
    highlights: ["QuietNeighborhood", "CloseToTransit", "Heating", "RecentlyRenovated"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 2.5,
    squareFeet: 2100,
    propertyType: "Townhouse",
    postedDate: "2026-09-03T14:00:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 10,
    managerCognitoId: "mgr-marcus-chen",
    location: {
      address: "48 Upland Rd",
      city: "Cambridge",
      state: "MA",
      country: "United States",
      postalCode: "02140",
      longitude: -71.1189,
      latitude: 42.3888,
    },
  },
  {
    id: 19,
    name: "Wicker Park Greystone Flat",
    description:
      "Second-floor flat in a restored 1890s greystone with 12-foot ceilings, a decorative marble fireplace, a chef's kitchen and a private rear deck over the garden. Radiant-heat baths and a stacked laundry closet. The Blue Line Damen stop is two blocks away.",
    pricePerMonth: 3050,
    securityDeposit: 3050,
    applicationFee: 40,
    photoUrls: [
      u("photo-1416331108676-a22ccb276e35"),
      u("photo-1560185007-c5ca9d2c014d"),
      u("photo-1585129777188-94600bc7b4b3"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HardwoodFloors", "Refrigerator", "HighSpeedInternet"],
    highlights: ["RecentlyRenovated", "CloseToTransit", "Heating", "TubShower", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 2,
    baths: 2,
    squareFeet: 1300,
    propertyType: "Apartment",
    postedDate: "2026-08-30T10:00:00.000Z",
    averageRating: 4.5,
    numberOfReviews: 29,
    managerCognitoId: "mgr-marcus-chen",
    location: {
      address: "1932 W Evergreen Ave",
      city: "Chicago",
      state: "IL",
      country: "United States",
      postalCode: "60622",
      longitude: -87.6762,
      latitude: 41.9061,
    },
  },

  /* ---------------- Priya Natarajan — Sunbelt + Pacific NW ---------------- */
  {
    id: 20,
    name: "East Austin Modern Farmhouse",
    description:
      "New-build modern farmhouse on a corner lot in East Cesar Chavez with a standing-seam roof, white oak floors, a screened porch and a plunge pool. Detached garage with EV charging. Walk to Cisco's, Lady Bird Lake and the Plaza Saltillo rail stop.",
    pricePerMonth: 4400,
    securityDeposit: 4400,
    applicationFee: 50,
    photoUrls: [
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600607687939-ce8a6c25118c"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Pool", "Parking", "PetsAllowed"],
    highlights: ["RecentlyRenovated", "QuietNeighborhood", "SprinklerSystem", "DoubleVanities"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 2.5,
    squareFeet: 1960,
    propertyType: "Villa",
    postedDate: "2026-09-11T09:00:00.000Z",
    averageRating: 4.9,
    numberOfReviews: 6,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "1706 Willow St",
      city: "Austin",
      state: "TX",
      country: "United States",
      postalCode: "78702",
      longitude: -97.7211,
      latitude: 30.2586,
    },
  },
  {
    id: 21,
    name: "South Congress Bungalow",
    description:
      "Charming 1940s bungalow one block off South Congress with a deep front porch, a remodelled kitchen and a backyard casita with its own bath. Original longleaf pine floors, central air and alley-access parking. Live music, tacos and the Continental Club at the corner.",
    pricePerMonth: 3300,
    securityDeposit: 3300,
    applicationFee: 45,
    photoUrls: [
      u("photo-1499793983690-e29da59ef1c2"),
      u("photo-1524758631624-e2822e304c36"),
      u("photo-1560184897-ae75f418493e"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HardwoodFloors", "Refrigerator", "Parking", "PetsAllowed"],
    highlights: ["QuietNeighborhood", "CloseToTransit", "TubShower", "RecentlyRenovated"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 2,
    baths: 2,
    squareFeet: 1240,
    propertyType: "Cottage",
    postedDate: "2026-08-08T12:00:00.000Z",
    averageRating: 4.8,
    numberOfReviews: 17,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "1505 Newning Ave",
      city: "Austin",
      state: "TX",
      country: "United States",
      postalCode: "78704",
      longitude: -97.7488,
      latitude: 30.2464,
    },
  },
  {
    id: 22,
    name: "Capitol Hill Corner Apartment",
    description:
      "Corner two bedroom on the 9th floor of a 2021 mass-timber building with exposed CLT ceilings, a Bosch kitchen and views to the Space Needle and the Olympics. Rooftop dog run, bike workshop and a co-working lounge. Cal Anderson Park across the street.",
    pricePerMonth: 3850,
    securityDeposit: 3850,
    applicationFee: 45,
    photoUrls: [
      u("photo-1536376072261-38c75010e6c9"),
      u("photo-1616594039964-ae9021a400a0"),
      u("photo-1600573472592-401b489a3cdc"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "Gym", "WalkInClosets", "PetsAllowed"],
    highlights: ["GreatView", "CloseToTransit", "Intercom", "RecentlyRenovated", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 2,
    baths: 2,
    squareFeet: 1010,
    propertyType: "Apartment",
    postedDate: "2026-09-14T08:00:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 41,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "1520 11th Ave",
      city: "Seattle",
      state: "WA",
      country: "United States",
      postalCode: "98122",
      longitude: -122.3175,
      latitude: 47.6149,
    },
  },
  {
    id: 23,
    name: "Fremont Canal-Side Craftsman",
    description:
      "Classic Seattle craftsman a block from the Ship Canal trail with a covered porch, a light-filled kitchen addition and a basement studio with a separate entrance. Fenced yard with a cedar hot tub. Ten minutes by bike to Google Fremont and the Burke-Gilman.",
    pricePerMonth: 4150,
    securityDeposit: 4150,
    applicationFee: 45,
    photoUrls: [
      u("photo-1575517111478-7f6afd0973db"),
      u("photo-1565182999561-18d7dc61c393"),
      u("photo-1505691938895-1758d7feb511"),
    ],
    amenities: ["WasherDryer", "Dishwasher", "HardwoodFloors", "Refrigerator", "Parking", "PetsAllowed", "HighSpeedInternet"],
    highlights: ["QuietNeighborhood", "GreatView", "Heating", "TubShower"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 2,
    squareFeet: 1740,
    propertyType: "Cottage",
    postedDate: "2026-08-26T10:00:00.000Z",
    averageRating: 4.6,
    numberOfReviews: 13,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "3610 Phinney Ave N",
      city: "Seattle",
      state: "WA",
      country: "United States",
      postalCode: "98103",
      longitude: -122.3541,
      latitude: 47.6515,
    },
  },
  {
    id: 24,
    name: "Wynwood Art Walk Loft",
    description:
      "Double-height loft in a former print shop in the heart of Wynwood with a 30-foot mural wall, polished terrazzo, a floating steel staircase and a private rooftop deck. Impact windows, a gated courtyard and reserved parking. Galleries and cafés out the front door.",
    pricePerMonth: 4200,
    securityDeposit: 4200,
    applicationFee: 50,
    photoUrls: [
      u("photo-1484101403633-562f891dc89a"),
      u("photo-1586023492125-27b2c045efd7"),
      u("photo-1571508601891-ca5e7a713859"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "Parking", "PetsAllowed", "Gym"],
    highlights: ["RecentlyRenovated", "Intercom", "SmokeFree", "CableReady"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 1,
    baths: 1.5,
    squareFeet: 1400,
    propertyType: "Apartment",
    postedDate: "2026-09-07T13:00:00.000Z",
    averageRating: 4.5,
    numberOfReviews: 20,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "2520 NW 2nd Ave",
      city: "Miami",
      state: "FL",
      country: "United States",
      postalCode: "33127",
      longitude: -80.1995,
      latitude: 25.8005,
    },
  },
  {
    id: 25,
    name: "Brickell Bay Tower · 3102",
    description:
      "Thirty-first floor two bedroom with wraparound Biscayne Bay views, a 60-foot balcony, Italian kitchen and a spa bath. The building offers two pools, a marina, a tennis court and a full spa. Valet parking and Brickell City Centre a short walk away.",
    pricePerMonth: 5900,
    securityDeposit: 5900,
    applicationFee: 75,
    photoUrls: [
      u("photo-1512917774080-9991f1c4c750"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1615874959474-d609969a20ed"),
      u("photo-1600573472592-401b489a3cdc"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "Gym", "Pool", "WalkInClosets", "Parking"],
    highlights: ["GreatView", "DoubleVanities", "Intercom", "SprinklerSystem", "SmokeFree"],
    isPetsAllowed: false,
    isParkingIncluded: true,
    beds: 2,
    baths: 2.5,
    squareFeet: 1560,
    propertyType: "Apartment",
    postedDate: "2026-08-12T10:00:00.000Z",
    averageRating: 4.7,
    numberOfReviews: 56,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "1541 Brickell Ave",
      city: "Miami",
      state: "FL",
      country: "United States",
      postalCode: "33129",
      longitude: -80.1922,
      latitude: 25.7576,
    },
  },
  {
    id: 26,
    name: "RiNo Rowhouse",
    description:
      "Three-level modern rowhouse in River North with a rooftop deck facing the Front Range, a two-car garage and a main-floor office with a Murphy bed. Wide-plank oak floors and a gas fireplace. Breweries, the 38th & Blake A-Line stop and the South Platte trail nearby.",
    pricePerMonth: 3700,
    securityDeposit: 3700,
    applicationFee: 45,
    photoUrls: [
      u("photo-1448630360428-65456885c650"),
      u("photo-1560185127-6ed189bf02f4"),
      u("photo-1523755231516-e43fd2e8dca5"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Parking", "PetsAllowed"],
    highlights: ["GreatView", "CloseToTransit", "Heating", "RecentlyRenovated"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 3,
    squareFeet: 1880,
    propertyType: "Townhouse",
    postedDate: "2026-09-09T15:00:00.000Z",
    averageRating: 4.6,
    numberOfReviews: 11,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "3300 Walnut St",
      city: "Denver",
      state: "CO",
      country: "United States",
      postalCode: "80205",
      longitude: -104.9798,
      latitude: 39.7663,
    },
  },
  {
    id: 27,
    name: "Pearl District Brick Loft",
    description:
      "Corner loft in a 1908 warehouse conversion with exposed brick, old-growth timber beams and 12-foot windows onto Jamison Square. Updated kitchen, walk-in shower and a deeded parking space. The streetcar stops outside; Powell's is a five minute walk.",
    pricePerMonth: 2950,
    securityDeposit: 2950,
    applicationFee: 40,
    photoUrls: [
      u("photo-1502672260266-1c1ef2d93688"),
      u("photo-1554995207-c18c203602cb"),
      u("photo-1552321554-5fefe8c9ef14"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "HighSpeedInternet", "HardwoodFloors", "Parking"],
    highlights: ["CloseToTransit", "GreatView", "Intercom", "HighSpeedInternetAccess"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 1,
    baths: 1,
    squareFeet: 890,
    propertyType: "Apartment",
    postedDate: "2026-08-17T09:00:00.000Z",
    averageRating: 4.5,
    numberOfReviews: 33,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "1130 NW 10th Ave",
      city: "Portland",
      state: "OR",
      country: "United States",
      postalCode: "97209",
      longitude: -122.6817,
      latitude: 45.5283,
    },
  },
  {
    id: 28,
    name: "North Park Spanish Casita",
    description:
      "Detached 1928 Spanish casita with a barrel-tile roof, arched doorways, saltillo floors and a private walled courtyard with a lemon tree. Updated kitchen and bath, mini-split AC and a covered carport. Three blocks to 30th Street's restaurants and Balboa Park.",
    pricePerMonth: 2850,
    securityDeposit: 2850,
    applicationFee: 40,
    photoUrls: [
      u("photo-1583608205776-bfd35f0d9f83"),
      u("photo-1545324418-cc1a3fa10c00"),
      u("photo-1513694203232-719a280e022f"),
    ],
    amenities: ["WasherDryer", "AirConditioning", "Dishwasher", "Refrigerator", "Parking", "PetsAllowed", "WiFi"],
    highlights: ["QuietNeighborhood", "RecentlyRenovated", "SprinklerSystem", "TubShower"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 1,
    baths: 1,
    squareFeet: 680,
    propertyType: "Cottage",
    postedDate: "2026-09-13T11:00:00.000Z",
    averageRating: 4.8,
    numberOfReviews: 24,
    managerCognitoId: "mgr-priya-natarajan",
    location: {
      address: "3025 Granada Ave",
      city: "San Diego",
      state: "CA",
      country: "United States",
      postalCode: "92104",
      longitude: -117.1312,
      latitude: 32.7405,
    },
  },
];

const bangladeshLocations = [
  ["Dhanmondi Lake View Apartment", "House 12, Road 4A", "Dhanmondi", "Dhaka", "1209", 90.3742, 23.7465],
  ["Gulshan Family Residence", "House 38, Road 90", "Gulshan", "Dhaka", "1212", 90.4167, 23.7925],
  ["Uttara Modern Flat", "Sector 7, Road 12", "Uttara", "Dhaka", "1230", 90.3978, 23.8759],
  ["Bashundhara R/A Sunny Home", "Block C, Road 8", "Bashundhara", "Dhaka", "1229", 90.4269, 23.8155],
  ["Banani Executive Studio", "Road 11, House 22", "Banani", "Dhaka", "1213", 90.4043, 23.7937],
  ["Mohammadpur Garden Flat", "Iqbal Road, House 17", "Mohammadpur", "Dhaka", "1207", 90.3588, 23.7601],
  ["Mirpur Family Apartment", "Section 10, Road 6", "Mirpur", "Dhaka", "1216", 90.3664, 23.8067],
  ["Lalmatia Quiet Residence", "Block D, Road 2", "Lalmatia", "Dhaka", "1207", 90.3715, 23.7532],
  ["Baridhara Diplomatic Flat", "Park Road, House 9", "Baridhara", "Dhaka", "1212", 90.4184, 23.8041],
  ["Tejgaon Contemporary Apartment", "Nabisco Road, House 33", "Tejgaon", "Dhaka", "1215", 90.3992, 23.7617],
  ["Chattogram Bay View Flat", "Khulshi, Road 3", "Khulshi", "Chattogram", "4225", 91.8123, 22.3696],
  ["Agrabad City Apartment", "CDA Avenue, House 14", "Agrabad", "Chattogram", "4100", 91.8135, 22.3266],
  ["Panchlaish Family Home", "O.R. Nizam Road, House 28", "Panchlaish", "Chattogram", "4203", 91.8159, 22.3617],
  ["Nasirabad Premium Flat", "Housing Society Road 5", "Nasirabad", "Chattogram", "4000", 91.8061, 22.3579],
  ["Sylhet Zindabazar Apartment", "Jail Road, House 18", "Zindabazar", "Sylhet", "3100", 91.8716, 24.8949],
  ["Shahjalal Upashahar Home", "Block B, Road 7", "Upashahar", "Sylhet", "3100", 91.8798, 24.8992],
  ["Rajshahi Padma View Flat", "Shaheb Bazar, Road 4", "Boalia", "Rajshahi", "6000", 88.6042, 24.3745],
  ["Kazla University Area Flat", "Kazla Road, House 6", "Kazla", "Rajshahi", "6204", 88.6402, 24.3689],
  ["Khulna Sonadanga Residence", "Main Road, House 31", "Sonadanga", "Khulna", "9100", 89.5481, 22.8291],
  ["Nirala Riverside Apartment", "Nirala Residential Area", "Nirala", "Khulna", "9100", 89.5457, 22.8172],
  ["Rangpur Modern Family Flat", "Jahaj Company Mor, Road 2", "Rangpur", "Rangpur", "5400", 89.2442, 25.7439],
  ["Mymensingh Town Apartment", "Charpara, House 16", "Mymensingh", "Mymensingh", "2200", 90.3988, 24.7471],
  ["Cox's Bazar Beachside Home", "Kolatoli Road, House 7", "Kolatoli", "Cox's Bazar", "4700", 91.9737, 21.4272],
  ["Cumilla Kandirpar Apartment", "Tomsom Bridge Road", "Kandirpar", "Cumilla", "3500", 91.1809, 23.4619],
  ["Savar Green Living Flat", "Nabinagar Road, House 21", "Savar", "Dhaka", "1340", 90.2563, 23.8583],
  ["Narayanganj Riverside Flat", "Bangabandhu Road, House 12", "Narayanganj", "Dhaka", "1400", 90.5002, 23.6238],
  ["Jashore Central Apartment", "Mujib Sarak, House 19", "Jashore", "Jashore", "7400", 89.2086, 23.1664],
  ["Pabna Comfortable Family Home", "Shalgaria Road, House 5", "Pabna", "Pabna", "6600", 89.2372, 24.0064],
] as const;

const bdt = (value: number) => Math.round((value * 18) / 500) * 500;
const managerIds: Record<string, string> = {
  "mgr-john-smith": "mgr-rahim-chowdhury",
  "mgr-elena-vasquez": "mgr-farhana-islam",
  "mgr-marcus-chen": "mgr-tanvir-ahmed",
  "mgr-priya-natarajan": "mgr-nusrat-jahan",
};
const tenantIds: Record<string, string> = {
  "tnt-carol-white": "tnt-sadia-rahman",
  "tnt-ahmed-hassan": "tnt-mahmud-hasan",
  "tnt-sofia-rossi": "tnt-tasnim-akther",
  "tnt-liam-oconnor": "tnt-arif-hossain",
  "tnt-mei-tanaka": "tnt-nabila-sultana",
  "tnt-jonas-berg": "tnt-rifat-karim",
};

export const properties: SeedProperty[] = sourceProperties.map((property, index) => {
  const [name, address, city, state, postalCode, longitude, latitude] = bangladeshLocations[index]!;
  return {
    ...property,
    name,
    description: `Well-maintained ${property.beds === 0 ? "studio" : `${property.beds}-bedroom`} home in ${city}, ${state}. Bright living spaces, practical finishes and convenient access to neighbourhood shops, schools, transport and everyday services.`,
    pricePerMonth: bdt(property.pricePerMonth),
    securityDeposit: bdt(property.securityDeposit),
    applicationFee: Math.max(500, bdt(property.applicationFee)),
    managerCognitoId: managerIds[property.managerCognitoId]!,
    location: { address, city, state, country: "Bangladesh", postalCode, longitude, latitude },
  };
});

/* ------------------------------------------------------------------ */
/* Leases, payments, applications                                      */
/* ------------------------------------------------------------------ */

export type SeedLease = Omit<Lease, "property" | "tenant" | "nextPaymentDate">;

const sourceLeases: SeedLease[] = [
  {
    id: 1,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T00:00:00.000Z",
    rent: 2780,
    deposit: 2500,
    propertyId: 3,
    tenantCognitoId: "tnt-carol-white",
  },
  {
    id: 2,
    startDate: "2025-11-15T00:00:00.000Z",
    endDate: "2026-11-14T00:00:00.000Z",
    rent: 3450,
    deposit: 3450,
    propertyId: 1,
    tenantCognitoId: "tnt-ahmed-hassan",
  },
  {
    id: 3,
    startDate: "2026-03-01T00:00:00.000Z",
    endDate: "2027-02-28T00:00:00.000Z",
    rent: 6200,
    deposit: 6200,
    propertyId: 2,
    tenantCognitoId: "tnt-sofia-rossi",
  },
  {
    id: 4,
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2027-05-31T00:00:00.000Z",
    rent: 2950,
    deposit: 2950,
    propertyId: 6,
    tenantCognitoId: "tnt-mei-tanaka",
  },
  {
    id: 5,
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2027-03-31T00:00:00.000Z",
    rent: 4850,
    deposit: 4850,
    propertyId: 11,
    tenantCognitoId: "tnt-jonas-berg",
  },
];

export const leases: SeedLease[] = sourceLeases.map((lease) => ({
  ...lease,
  rent: bdt(lease.rent),
  deposit: bdt(lease.deposit),
  tenantCognitoId: tenantIds[lease.tenantCognitoId]!,
}));

/**
 * Generate a monthly payment history for each lease up to `now`.
 * The most recent month is left Pending; one lease gets an Overdue month so
 * the dashboards have something interesting to show.
 */
export function buildPayments(now = new Date("2026-09-20T00:00:00.000Z")): Payment[] {
  const payments: Payment[] = [];
  let id = 1;

  for (const lease of leases) {
    const start = new Date(lease.startDate);
    const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    while (cursor <= currentMonth) {
      const dueDate = new Date(cursor);
      dueDate.setUTCDate(1);
      const isCurrent = cursor.getTime() === currentMonth.getTime();

      let paymentStatus: Payment["paymentStatus"] = "Paid";
      let amountPaid = lease.rent;
      let paymentDate = new Date(dueDate);
      paymentDate.setUTCDate(1 + ((id * 7) % 4)); // paid within the first days

      if (isCurrent) {
        // Carol has paid this month; Ahmed is pending; Sofia is overdue.
        if (lease.id === 1) {
          paymentStatus = "Paid";
        } else if (lease.id === 3) {
          paymentStatus = "Overdue";
          amountPaid = 0;
          paymentDate = dueDate;
        } else {
          paymentStatus = "Pending";
          amountPaid = 0;
          paymentDate = dueDate;
        }
      } else if (lease.id === 2 && cursor.getUTCMonth() === 4) {
        // Ahmed was short one month in May.
        paymentStatus = "PartiallyPaid";
        amountPaid = Math.round(lease.rent * 0.6);
      }

      payments.push({
        id: id++,
        amountDue: lease.rent,
        amountPaid,
        dueDate: dueDate.toISOString(),
        paymentDate: paymentDate.toISOString(),
        paymentStatus,
        leaseId: lease.id,
      });

      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
  }

  return payments;
}

export type SeedApplication = Omit<
  Application,
  "property" | "tenant" | "manager" | "lease"
>;

const sourceApplications: SeedApplication[] = [
  {
    id: 1,
    applicationDate: "2025-12-18T15:20:00.000Z",
    status: "Approved",
    propertyId: 3,
    tenantCognitoId: "tnt-carol-white",
    name: "Carol White",
    email: "carol@rentiful.dev",
    phoneNumber: "(323) 555-0119",
    message: "I work downtown and would love to walk to the office. Non-smoker, no pets.",
    leaseId: 1,
  },
  {
    id: 2,
    applicationDate: "2026-09-14T18:05:00.000Z",
    status: "Pending",
    propertyId: 7,
    tenantCognitoId: "tnt-carol-white",
    name: "Carol White",
    email: "carol@rentiful.dev",
    phoneNumber: "(323) 555-0119",
    message: "My lease downtown ends in December and I'm looking for something with a patio. Happy to provide references.",
    leaseId: null,
  },
  {
    id: 3,
    applicationDate: "2026-08-02T10:40:00.000Z",
    status: "Denied",
    propertyId: 12,
    tenantCognitoId: "tnt-carol-white",
    name: "Carol White",
    email: "carol@rentiful.dev",
    phoneNumber: "(323) 555-0119",
    message: "Relocating to SF for a new role in October.",
    leaseId: null,
  },
  {
    id: 4,
    applicationDate: "2025-11-01T09:00:00.000Z",
    status: "Approved",
    propertyId: 1,
    tenantCognitoId: "tnt-ahmed-hassan",
    name: "Ahmed Hassan",
    email: "ahmed@rentiful.dev",
    phoneNumber: "(424) 555-0164",
    message: "Software engineer, remote. Looking for a long-term lease.",
    leaseId: 2,
  },
  {
    id: 5,
    applicationDate: "2026-02-14T12:30:00.000Z",
    status: "Approved",
    propertyId: 2,
    tenantCognitoId: "tnt-sofia-rossi",
    name: "Sofia Rossi",
    email: "sofia@rentiful.dev",
    phoneNumber: "(213) 555-0151",
    message: "Family of three with a small dog. We adore the canals.",
    leaseId: 3,
  },
  {
    id: 6,
    applicationDate: "2026-09-17T08:15:00.000Z",
    status: "Pending",
    propertyId: 4,
    tenantCognitoId: "tnt-liam-oconnor",
    name: "Liam O'Connor",
    email: "liam@rentiful.dev",
    phoneNumber: "(818) 555-0187",
    message: "Would like a 2-year lease if possible. Can move in November.",
    leaseId: null,
  },
  {
    id: 7,
    applicationDate: "2026-09-18T16:45:00.000Z",
    status: "Pending",
    propertyId: 1,
    tenantCognitoId: "tnt-mei-tanaka",
    name: "Mei Tanaka",
    email: "mei@rentiful.dev",
    phoneNumber: "(626) 555-0122",
    message: "Interested if the unit becomes available when the current lease ends.",
    leaseId: null,
  },
  {
    id: 8,
    applicationDate: "2026-07-10T11:00:00.000Z",
    status: "Denied",
    propertyId: 2,
    tenantCognitoId: "tnt-jonas-berg",
    name: "Jonas Berg",
    email: "jonas@rentiful.dev",
    phoneNumber: "(310) 555-0106",
    message: null,
    leaseId: null,
  },
  {
    id: 9,
    applicationDate: "2026-09-19T09:30:00.000Z",
    status: "Pending",
    propertyId: 5,
    tenantCognitoId: "tnt-liam-oconnor",
    name: "Liam O'Connor",
    email: "liam@rentiful.dev",
    phoneNumber: "(818) 555-0187",
    message: "Backup option — I bike everywhere so no parking needed.",
    leaseId: null,
  },
  {
    id: 10,
    applicationDate: "2026-05-20T14:00:00.000Z",
    status: "Approved",
    propertyId: 6,
    tenantCognitoId: "tnt-mei-tanaka",
    name: "Mei Tanaka",
    email: "mei@rentiful.dev",
    phoneNumber: "(626) 555-0122",
    message: "Grad student at USC, quiet and tidy.",
    leaseId: 4,
  },
  {
    id: 11,
    applicationDate: "2026-03-22T10:00:00.000Z",
    status: "Approved",
    propertyId: 11,
    tenantCognitoId: "tnt-jonas-berg",
    name: "Jonas Berg",
    email: "jonas@rentiful.dev",
    phoneNumber: "(310) 555-0106",
    message: "Moving up from LA for work.",
    leaseId: 5,
  },
];

export const applications: SeedApplication[] = sourceApplications.map((application) => {
  const tenant = tenants.find((item) => item.cognitoId === tenantIds[application.tenantCognitoId]);
  return {
    ...application,
    tenantCognitoId: tenantIds[application.tenantCognitoId]!,
    name: tenant!.name,
    email: tenant!.email,
    phoneNumber: tenant!.phoneNumber,
    message: application.message
      ? "I am interested in this home and can provide the required references and documents. I am looking for a comfortable long-term rental in this neighbourhood."
      : null,
  };
});
