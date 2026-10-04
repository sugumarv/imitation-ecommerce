import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Lazy Postgres client. Set DATABASE_URL before calling getDb() in server code.
 * Homepage currently uses featured mock data so local UI works without a DB.
 */
let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local before querying the database.",
    );
  }

  if (!client) {
    client = postgres(connectionString, { prepare: false });
  }

  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof getDb>;
