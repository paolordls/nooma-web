import Database, { type Database as DatabaseType } from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { resolve } from "path";

// Get the database path - shared with MCP server
// Use absolute path to ensure it works in all environments
const dbPath = process.env.NOOMA_DB_PATH || resolve(process.cwd(), "../data/nooma.db");

// Create SQLite connection
const sqlite: DatabaseType = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for convenience
export { schema };
