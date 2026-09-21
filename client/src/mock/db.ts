/**
 * In-browser mock database.
 *
 * State is seeded from `./seed` and persisted to localStorage so that
 * favourites, applications and settings survive a reload. Bump
 * `DB_VERSION` whenever the seed shape changes to force a reset.
 */

import type {
  Application,
  Lease,
  Manager,
  Payment,
  Property,
  Tenant,
  UserRole,
} from "@/types/models";
import {
  applications as seedApplications,
  buildPayments,
  DEMO_PASSWORD,
  favorites as seedFavorites,
  leases as seedLeases,
  managers as seedManagers,
  properties as seedProperties,
  tenants as seedTenants,
} from "./seed";

const DB_VERSION = 4;
const STORAGE_KEY = `rentiful.mockdb.v${DB_VERSION}`;

export interface Credential {
  email: string;
  password: string;
  cognitoId: string;
  role: UserRole;
  username: string;
}

export interface MockDb {
  version: number;
  managers: Manager[];
  tenants: Omit<Tenant, "favorites">[];
  favorites: Record<string, number[]>;
  properties: Property[];
  leases: Omit<Lease, "property" | "tenant" | "nextPaymentDate">[];
  payments: Payment[];
  applications: Omit<Application, "property" | "tenant" | "manager" | "lease">[];
  credentials: Credential[];
  counters: Record<string, number>;
}

function createSeedDb(): MockDb {
  const properties: Property[] = seedProperties.map((p, index) => {
    const { location, ...rest } = p;
    const locationId = index + 1;
    return {
      ...rest,
      locationId,
      location: {
        id: locationId,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        postalCode: location.postalCode,
        coordinates: {
          longitude: location.longitude,
          latitude: location.latitude,
        },
      },
    };
  });

  const credentials: Credential[] = [
    ...seedTenants.map((t) => ({
      email: t.email,
      password: DEMO_PASSWORD,
      cognitoId: t.cognitoId,
      role: "tenant" as const,
      username: t.name,
    })),
    ...seedManagers.map((m) => ({
      email: m.email,
      password: DEMO_PASSWORD,
      cognitoId: m.cognitoId,
      role: "manager" as const,
      username: m.name,
    })),
  ];

  const payments = buildPayments();

  return {
    version: DB_VERSION,
    managers: structuredClone(seedManagers),
    tenants: structuredClone(seedTenants),
    favorites: structuredClone(seedFavorites),
    properties,
    leases: structuredClone(seedLeases),
    payments,
    applications: structuredClone(seedApplications),
    credentials,
    counters: {
      property: properties.length,
      location: properties.length,
      lease: seedLeases.length,
      payment: payments.length,
      application: seedApplications.length,
      tenant: seedTenants.length,
      manager: seedManagers.length,
    },
  };
}

let db: MockDb | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function load(): MockDb {
  if (canUseStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MockDb;
        if (parsed.version === DB_VERSION) return parsed;
      }
    } catch {
      /* fall through to seed */
    }
  }
  return createSeedDb();
}

export function getDb(): MockDb {
  if (!db) db = load();
  return db;
}

export function persist() {
  if (!db || !canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage full / private mode — ignore */
  }
}

export function resetDb() {
  db = createSeedDb();
  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  persist();
  return db;
}

export function nextId(counter: keyof MockDb["counters"] | string): number {
  const d = getDb();
  d.counters[counter] = (d.counters[counter] ?? 0) + 1;
  return d.counters[counter];
}
