/**
 * Dual Database Adapter
 * Supports both MySQL (local development) and Supabase PostgreSQL (production)
 * Automatically selects the appropriate database based on environment
 */

import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { drizzle as pgDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "./_core/env";

// Type for database instance
type DbInstance = any;

let _db: any = null;
let _dbType: "mysql" | "postgresql" = "mysql";

/**
 * Get the appropriate database instance
 * Uses Supabase PostgreSQL if SUPABASE_URL is set, otherwise uses MySQL
 */
export async function getDb() {
  if (_db) {
    return _db;
  }

  try {
    // Check if Supabase is configured
    if (ENV.supabaseUrl && ENV.supabaseServiceRoleKey) {
      console.log("[Database] Initializing Supabase PostgreSQL connection");
      
      // Create PostgreSQL connection via Supabase
      const sql = postgres(ENV.supabaseUrl);

      _db = pgDrizzle(sql as any);
      _dbType = "postgresql";
      console.log("[Database] Supabase PostgreSQL connection established");
    } else if (process.env.DATABASE_URL) {
      console.log("[Database] Initializing MySQL connection");
      
      // Fallback to MySQL
      _db = mysqlDrizzle(process.env.DATABASE_URL);
      _dbType = "mysql";
      console.log("[Database] MySQL connection established");
    } else {
      console.warn("[Database] No database connection configured");
      return null;
    }

    return _db;
  } catch (error) {
    console.error("[Database] Failed to initialize database:", error);
    return null;
  }
}

/**
 * Get the current database type
 */
export function getDbType(): "mysql" | "postgresql" {
  return _dbType;
}

/**
 * Check if using Supabase
 */
export function isSupabase(): boolean {
  return _dbType === "postgresql";
}

/**
 * Check if using MySQL
 */
export function isMysql(): boolean {
  return _dbType === "mysql";
}

/**
 * Reset database connection (useful for testing)
 */
export function resetDb() {
  _db = null;
  _dbType = "mysql";
}
