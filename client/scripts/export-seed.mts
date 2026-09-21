/**
 * Exports the client mock seed to JSON files consumed by the server's
 * Prisma seed (server/prisma/seed.ts), so both data sources stay in sync.
 *
 *   npm run seed:export   (from /client, Node >= 22.6)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applications,
  buildPayments,
  favorites,
  leases,
  managers,
  properties,
  tenants,
} from "../src/mock/seed.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../server/prisma/seedData");
mkdirSync(outDir, { recursive: true });

const files: Record<string, unknown> = {
  managers,
  tenants,
  favorites,
  properties,
  leases,
  payments: buildPayments(),
  applications,
};

for (const [name, data] of Object.entries(files)) {
  const file = resolve(outDir, `${name}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${name}.json (${Array.isArray(data) ? data.length : Object.keys(data as object).length} records)`);
}
