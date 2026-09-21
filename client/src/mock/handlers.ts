/**
 * Route handlers for the mock API. These mirror the Express server's routes
 * and response shapes one-to-one so the RTK Query layer is identical in
 * both modes.
 */

import type {
  Application,
  ApplicationStatus,
  Lease,
  Manager,
  Payment,
  Property,
  Tenant,
  UserRole,
} from "@/types/models";
import { getDb, nextId, persist, type MockDb } from "./db";

export interface MockRequest {
  url: string;
  method: string;
  body?: unknown;
  params?: Record<string, unknown>;
  session?: { userId: string; role: UserRole } | null;
}

export type MockResponse =
  | { data: unknown; status?: number }
  | { error: { status: number; data: { message: string } } };

const ok = (data: unknown, status = 200): MockResponse => ({ data, status });
const fail = (status: number, message: string): MockResponse => ({
  error: { status, data: { message } },
});

/** Search radius used for the lat/lng filter (km). */
export const SEARCH_RADIUS_KM = 80;

/* ------------------------------------------------------------------ */
/* Hydration helpers                                                   */
/* ------------------------------------------------------------------ */

function findManager(db: MockDb, cognitoId: string): Manager | undefined {
  return db.managers.find((m) => m.cognitoId === cognitoId);
}

function findTenant(db: MockDb, cognitoId: string): Tenant | undefined {
  const t = db.tenants.find((t) => t.cognitoId === cognitoId);
  if (!t) return undefined;
  const favIds = db.favorites[cognitoId] ?? [];
  return {
    ...t,
    favorites: favIds
      .map((id) => db.properties.find((p) => p.id === id))
      .filter((p): p is Property => !!p)
      .map((p) => hydrateProperty(db, p)),
  };
}

function hydrateProperty(db: MockDb, p: Property): Property {
  return { ...p, manager: findManager(db, p.managerCognitoId) };
}

function nextPaymentDate(startDate: string, now = new Date()): string {
  const next = new Date(startDate);
  while (next <= now) next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}

function hydrateLease(
  db: MockDb,
  lease: MockDb["leases"][number],
  opts: { payments?: boolean } = {},
): Lease & { payments?: Payment[] } {
  const property = db.properties.find((p) => p.id === lease.propertyId);
  const tenant = db.tenants.find((t) => t.cognitoId === lease.tenantCognitoId);
  return {
    ...lease,
    property: property ? hydrateProperty(db, property) : undefined,
    tenant: tenant ? { ...tenant } : undefined,
    nextPaymentDate: nextPaymentDate(lease.startDate),
    ...(opts.payments
      ? { payments: db.payments.filter((p) => p.leaseId === lease.id) }
      : {}),
  };
}

function hydrateApplication(
  db: MockDb,
  app: MockDb["applications"][number],
): Application | null {
  const property = db.properties.find((p) => p.id === app.propertyId);
  const tenant = db.tenants.find((t) => t.cognitoId === app.tenantCognitoId);
  if (!property || !tenant) return null;

  const lease =
    db.leases
      .filter(
        (l) =>
          l.tenantCognitoId === app.tenantCognitoId &&
          l.propertyId === app.propertyId,
      )
      .sort((a, b) => b.startDate.localeCompare(a.startDate))[0] ?? null;

  return {
    ...app,
    property: hydrateProperty(db, property),
    tenant: { ...tenant },
    manager: findManager(db, property.managerCognitoId),
    lease: lease ? hydrateLease(db, lease) : null,
  };
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* ------------------------------------------------------------------ */
/* Properties                                                          */
/* ------------------------------------------------------------------ */

function listProperties(db: MockDb, q: URLSearchParams): Property[] {
  const num = (key: string) => {
    const v = q.get(key);
    if (v === null || v === "" || v === "any") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const favoriteIds = q.get("favoriteIds")?.split(",").map(Number).filter(Boolean);
  const priceMin = num("priceMin");
  const priceMax = num("priceMax");
  const beds = num("beds");
  const baths = num("baths");
  const squareFeetMin = num("squareFeetMin");
  const squareFeetMax = num("squareFeetMax");
  const propertyType = q.get("propertyType");
  const amenities = q.get("amenities")?.split(",").filter(Boolean) ?? [];
  const availableFrom = q.get("availableFrom");
  const lat = num("latitude");
  const lng = num("longitude");

  return db.properties
    .filter((p) => {
      if (favoriteIds?.length && !favoriteIds.includes(p.id)) return false;
      if (priceMin !== undefined && p.pricePerMonth < priceMin) return false;
      if (priceMax !== undefined && p.pricePerMonth > priceMax) return false;
      if (beds !== undefined && p.beds < beds) return false;
      if (baths !== undefined && p.baths < baths) return false;
      if (squareFeetMin !== undefined && p.squareFeet < squareFeetMin) return false;
      if (squareFeetMax !== undefined && p.squareFeet > squareFeetMax) return false;
      if (propertyType && propertyType !== "any" && p.propertyType !== propertyType)
        return false;
      if (amenities.length && !amenities.every((a) => p.amenities.includes(a as never)))
        return false;
      if (availableFrom && availableFrom !== "any") {
        const date = new Date(availableFrom);
        if (!Number.isNaN(date.getTime())) {
          const occupied = db.leases.some(
            (l) =>
              l.propertyId === p.id &&
              new Date(l.startDate) <= date &&
              new Date(l.endDate) >= date,
          );
          if (occupied) return false;
        }
      }
      if (lat !== undefined && lng !== undefined && !favoriteIds?.length) {
        const d = haversineKm(
          lat,
          lng,
          p.location.coordinates.latitude,
          p.location.coordinates.longitude,
        );
        if (d > SEARCH_RADIUS_KM) return false;
      }
      return true;
    })
    .map((p) => hydrateProperty(db, p));
}

async function fileToDataUrl(file: File, maxWidth = 1400): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

async function createProperty(
  db: MockDb,
  body: FormData,
  session: MockRequest["session"],
): Promise<MockResponse> {
  if (!session || session.role !== "manager") return fail(403, "Access Denied");

  const get = (k: string) => String(body.get(k) ?? "");
  const files = body.getAll("photos").filter((f): f is File => f instanceof File);

  const photoUrls: string[] = [];
  for (const file of files) {
    try {
      photoUrls.push(await fileToDataUrl(file));
    } catch {
      photoUrls.push("/placeholder.svg");
    }
  }
  if (photoUrls.length === 0) photoUrls.push("/placeholder.svg");

  const parseList = (k: string) =>
    get(k)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const locationId = nextId("location");
  const id = nextId("property");

  const property: Property = {
    id,
    name: get("name"),
    description: get("description"),
    pricePerMonth: Number(get("pricePerMonth")) || 0,
    securityDeposit: Number(get("securityDeposit")) || 0,
    applicationFee: Number(get("applicationFee")) || 0,
    photoUrls,
    amenities: parseList("amenities") as Property["amenities"],
    highlights: parseList("highlights") as Property["highlights"],
    isPetsAllowed: get("isPetsAllowed") === "true",
    isParkingIncluded: get("isParkingIncluded") === "true",
    beds: Number(get("beds")) || 0,
    baths: Number(get("baths")) || 0,
    squareFeet: Number(get("squareFeet")) || 0,
    propertyType: (get("propertyType") || "Apartment") as Property["propertyType"],
    postedDate: new Date().toISOString(),
    averageRating: 0,
    numberOfReviews: 0,
    locationId,
    managerCognitoId: get("managerCognitoId") || session.userId,
    location: {
      id: locationId,
      address: get("address"),
      city: get("city"),
      state: get("state"),
      country: get("country"),
      postalCode: get("postalCode"),
      coordinates: {
        longitude: Number(get("longitude")) || 0,
        latitude: Number(get("latitude")) || 0,
      },
    },
  };

  db.properties.unshift(property);
  persist();
  return ok(hydrateProperty(db, property), 201);
}

/* ------------------------------------------------------------------ */
/* Applications                                                        */
/* ------------------------------------------------------------------ */

function updateApplicationStatus(
  db: MockDb,
  id: number,
  status: ApplicationStatus,
): MockResponse {
  const app = db.applications.find((a) => a.id === id);
  if (!app) return fail(404, "Application not found.");
  const property = db.properties.find((p) => p.id === app.propertyId);
  if (!property) return fail(404, "Property not found.");

  if (status === "Approved" && app.status !== "Approved") {
    const start = new Date();
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    const lease = {
      id: nextId("lease"),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      rent: property.pricePerMonth,
      deposit: property.securityDeposit,
      propertyId: property.id,
      tenantCognitoId: app.tenantCognitoId,
    };
    db.leases.push(lease);
    app.leaseId = lease.id;

    // First month's rent is due at lease start.
    db.payments.push({
      id: nextId("payment"),
      amountDue: lease.rent,
      amountPaid: 0,
      dueDate: lease.startDate,
      paymentDate: lease.startDate,
      paymentStatus: "Pending",
      leaseId: lease.id,
    });
  }

  app.status = status;
  persist();
  return ok(hydrateApplication(db, app));
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

type Handler = (
  ctx: {
    db: MockDb;
    params: Record<string, string>;
    query: URLSearchParams;
    body: unknown;
    session: MockRequest["session"];
  },
) => MockResponse | Promise<MockResponse>;

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
}

const routes: Route[] = [];

function route(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" +
      path.replace(/:([a-zA-Z]+)/g, (_, key) => {
        keys.push(key);
        return "([^/]+)";
      }) +
      "/?$",
  );
  routes.push({ method, pattern, keys, handler });
}

/* --- tenants --- */
route("GET", "/tenants/:cognitoId", ({ db, params }) => {
  const tenant = findTenant(db, params.cognitoId);
  return tenant ? ok(tenant) : fail(404, "Tenant not found");
});

route("POST", "/tenants", ({ db, body }) => {
  const b = body as Partial<Tenant>;
  if (!b.cognitoId) return fail(400, "cognitoId is required");
  const existing = findTenant(db, b.cognitoId);
  if (existing) return ok(existing, 201);
  const tenant = {
    id: nextId("tenant"),
    cognitoId: b.cognitoId,
    name: b.name ?? "",
    email: b.email ?? "",
    phoneNumber: b.phoneNumber ?? "",
  };
  db.tenants.push(tenant);
  db.favorites[tenant.cognitoId] = [];
  persist();
  return ok(findTenant(db, tenant.cognitoId), 201);
});

route("PUT", "/tenants/:cognitoId", ({ db, params, body }) => {
  const tenant = db.tenants.find((t) => t.cognitoId === params.cognitoId);
  if (!tenant) return fail(404, "Tenant not found");
  const b = body as Partial<Tenant>;
  Object.assign(tenant, {
    name: b.name ?? tenant.name,
    email: b.email ?? tenant.email,
    phoneNumber: b.phoneNumber ?? tenant.phoneNumber,
  });
  persist();
  return ok(findTenant(db, tenant.cognitoId));
});

route("GET", "/tenants/:cognitoId/current-residences", ({ db, params }) => {
  const now = new Date();
  const propertyIds = new Set(
    db.leases
      .filter(
        (l) =>
          l.tenantCognitoId === params.cognitoId &&
          new Date(l.endDate) >= now,
      )
      .map((l) => l.propertyId),
  );
  return ok(
    db.properties
      .filter((p) => propertyIds.has(p.id))
      .map((p) => hydrateProperty(db, p)),
  );
});

route("POST", "/tenants/:cognitoId/favorites/:propertyId", ({ db, params }) => {
  const tenant = db.tenants.find((t) => t.cognitoId === params.cognitoId);
  if (!tenant) return fail(404, "Tenant not found");
  const propertyId = Number(params.propertyId);
  const favs = (db.favorites[tenant.cognitoId] ??= []);
  if (favs.includes(propertyId))
    return fail(409, "Property already added as favorite");
  favs.push(propertyId);
  persist();
  return ok(findTenant(db, tenant.cognitoId));
});

route("DELETE", "/tenants/:cognitoId/favorites/:propertyId", ({ db, params }) => {
  const tenant = db.tenants.find((t) => t.cognitoId === params.cognitoId);
  if (!tenant) return fail(404, "Tenant not found");
  const propertyId = Number(params.propertyId);
  db.favorites[tenant.cognitoId] = (db.favorites[tenant.cognitoId] ?? []).filter(
    (id) => id !== propertyId,
  );
  persist();
  return ok(findTenant(db, tenant.cognitoId));
});

/* --- managers --- */
route("GET", "/managers/:cognitoId", ({ db, params }) => {
  const manager = findManager(db, params.cognitoId);
  return manager ? ok(manager) : fail(404, "Manager not found");
});

route("POST", "/managers", ({ db, body }) => {
  const b = body as Partial<Manager>;
  if (!b.cognitoId) return fail(400, "cognitoId is required");
  const existing = findManager(db, b.cognitoId);
  if (existing) return ok(existing, 201);
  const manager: Manager = {
    id: nextId("manager"),
    cognitoId: b.cognitoId,
    name: b.name ?? "",
    email: b.email ?? "",
    phoneNumber: b.phoneNumber ?? "",
  };
  db.managers.push(manager);
  persist();
  return ok(manager, 201);
});

route("PUT", "/managers/:cognitoId", ({ db, params, body }) => {
  const manager = findManager(db, params.cognitoId);
  if (!manager) return fail(404, "Manager not found");
  const b = body as Partial<Manager>;
  Object.assign(manager, {
    name: b.name ?? manager.name,
    email: b.email ?? manager.email,
    phoneNumber: b.phoneNumber ?? manager.phoneNumber,
  });
  persist();
  return ok(manager);
});

route("GET", "/managers/:cognitoId/properties", ({ db, params }) =>
  ok(
    db.properties
      .filter((p) => p.managerCognitoId === params.cognitoId)
      .map((p) => hydrateProperty(db, p)),
  ),
);

/* --- properties --- */
route("GET", "/properties", ({ db, query }) => ok(listProperties(db, query)));

route("GET", "/properties/:id", ({ db, params }) => {
  const property = db.properties.find((p) => p.id === Number(params.id));
  return property
    ? ok(hydrateProperty(db, property))
    : fail(404, "Property not found");
});

route("GET", "/properties/:id/leases", ({ db, params }) =>
  ok(
    db.leases
      .filter((l) => l.propertyId === Number(params.id))
      .map((l) => hydrateLease(db, l, { payments: true })),
  ),
);

route("POST", "/properties", ({ db, body, session }) => {
  if (!(body instanceof FormData)) return fail(400, "Expected multipart form");
  return createProperty(db, body, session);
});

/* --- leases --- */
route("GET", "/leases", ({ db, session }) => {
  if (!session) return fail(401, "Unauthorized");
  const mine =
    session.role === "tenant"
      ? db.leases.filter((l) => l.tenantCognitoId === session.userId)
      : db.leases.filter((l) => {
          const p = db.properties.find((p) => p.id === l.propertyId);
          return p?.managerCognitoId === session.userId;
        });
  return ok(mine.map((l) => hydrateLease(db, l)));
});

route("GET", "/leases/:id/payments", ({ db, params }) =>
  ok(db.payments.filter((p) => p.leaseId === Number(params.id))),
);

/* --- applications --- */
route("GET", "/applications", ({ db, query }) => {
  const userId = query.get("userId");
  const userType = query.get("userType");
  let apps = db.applications;
  if (userId && userType === "tenant") {
    apps = apps.filter((a) => a.tenantCognitoId === userId);
  } else if (userId && userType === "manager") {
    const ownedIds = new Set(
      db.properties.filter((p) => p.managerCognitoId === userId).map((p) => p.id),
    );
    apps = apps.filter((a) => ownedIds.has(a.propertyId));
  }
  return ok(
    apps
      .map((a) => hydrateApplication(db, a))
      .filter((a): a is Application => !!a)
      .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate)),
  );
});

route("POST", "/applications", ({ db, body, session }) => {
  if (!session || session.role !== "tenant") return fail(403, "Access Denied");
  const b = body as Partial<Application>;
  const property = db.properties.find((p) => p.id === Number(b.propertyId));
  if (!property) return fail(404, "Property not found");

  const app = {
    id: nextId("application"),
    applicationDate: b.applicationDate ?? new Date().toISOString(),
    status: "Pending" as const,
    propertyId: property.id,
    tenantCognitoId: b.tenantCognitoId ?? session.userId,
    name: b.name ?? "",
    email: b.email ?? "",
    phoneNumber: b.phoneNumber ?? "",
    message: b.message ?? null,
    leaseId: null,
  };
  db.applications.push(app);
  persist();
  return ok(hydrateApplication(db, app), 201);
});

route("PUT", "/applications/:id/status", ({ db, params, body, session }) => {
  if (!session || session.role !== "manager") return fail(403, "Access Denied");
  const { status } = body as { status: ApplicationStatus };
  return updateApplicationStatus(db, Number(params.id), status);
});

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export async function handleRequest(req: MockRequest): Promise<MockResponse> {
  const url = new URL(req.url.replace(/^\/?/, "/"), "http://mock.local");
  const query = url.searchParams;
  if (req.params) {
    for (const [k, v] of Object.entries(req.params)) {
      if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
    }
  }

  const method = req.method.toUpperCase();
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = url.pathname.match(r.pattern);
    if (!m) continue;
    const params: Record<string, string> = {};
    r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
    return r.handler({ db: getDb(), params, query, body: req.body, session: req.session });
  }

  return fail(404, `No mock route for ${method} ${url.pathname}`);
}
