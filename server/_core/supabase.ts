import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://vrfyjirddfdnwuffzqhb.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "missing-supabase-anon-key";
export const isSupabaseConfigured = Boolean(process.env.SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get Supabase client with service role key (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Type definitions for Supabase tables
export interface VetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  hours?: string;
  services?: string[];
  rating?: number;
  emergency_services: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  pet_id: string;
  description: string;
  status: "pending" | "accepted" | "completed" | "rejected";
  veterinarian_id?: string;
  response?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyTriageCase {
  id: string;
  user_id: string;
  pet_id: string;
  symptoms: string[];
  severity: string;
  triage_level: "urgent" | "critical" | "life_threatening";
  nearest_clinic_id?: string;
  status: "pending" | "assigned" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Veterinarian {
  id: string;
  user_id: string;
  license_number: string;
  specializations?: string[];
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (!isSupabaseConfigured) {
    return "The clinic directory is temporarily unavailable because its data connection is not configured.";
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred while accessing the database";
}
