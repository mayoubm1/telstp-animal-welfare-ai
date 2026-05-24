import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { supabase, handleSupabaseError } from "../_core/supabase";

export const clinicsRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        clinicType: z.enum(["general", "emergency", "specialty", "hospital"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        let q = supabase.from("vet_clinics").select("*");

        if (input.query) {
          q = q.or(`name.ilike.%${input.query}%,address.ilike.%${input.query}%`);
        }

        if (input.clinicType) {
          q = q.eq("clinic_type", input.clinicType);
        }

        const { data, error } = await q.limit(input.limit);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Clinic search error:", error);
        throw new Error(handleSupabaseError(error));
      }
    }),

  getNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(10),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase.from("vet_clinics").select("*");

        if (error) throw error;

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const nearby = (data || [])
          .map((clinic: any) => ({
            ...clinic,
            distance: calculateDistance(
              input.latitude,
              input.longitude,
              clinic.latitude,
              clinic.longitude
            ),
          }))
          .filter((clinic: any) => clinic.distance <= input.radiusKm)
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, input.limit);

        return nearby;
      } catch (error) {
        console.error("Nearby clinics error:", error);
        throw new Error(handleSupabaseError(error));
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase
          .from("vet_clinics")
          .select("*")
          .eq("id", input.id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Get clinic error:", error);
        throw new Error(handleSupabaseError(error));
      }
    }),

  getEmergency: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        limit: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase
          .from("vet_clinics")
          .select("*")
          .eq("emergency_services", true);

        if (error) throw error;

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        return (data || [])
          .map((clinic: any) => ({
            ...clinic,
            distance: calculateDistance(
              input.latitude,
              input.longitude,
              clinic.latitude,
              clinic.longitude
            ),
          }))
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, input.limit);
      } catch (error) {
        console.error("Emergency clinics error:", error);
        throw new Error(handleSupabaseError(error));
      }
    }),

  getAll: publicProcedure.query(async () => {
    try {
      const { data, error } = await supabase
        .from("vet_clinics")
        .select("*")
        .eq("verified", true)
        .order("city");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get all clinics error:", error);
      throw new Error(handleSupabaseError(error));
    }
  }),

  findNearest: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        maxDistance: z.number().default(10),
        clinicType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase.rpc(
          "find_nearest_emergency_clinics",
          {
            user_lat: input.latitude,
            user_lon: input.longitude,
            max_distance_km: input.maxDistance,
          }
        );

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Find nearest clinics error:", error);
        const { data, error: fetchError } = await supabase
          .from("vet_clinics")
          .select("*")
          .eq("clinic_type", "emergency")
          .eq("verified", true);

        if (fetchError) throw fetchError;

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        return (data || [])
          .map((clinic: any) => ({
            ...clinic,
            distance_km: calculateDistance(
              input.latitude,
              input.longitude,
              clinic.latitude,
              clinic.longitude
            ),
          }))
          .filter((clinic: any) => clinic.distance_km <= input.maxDistance)
          .sort((a: any, b: any) => a.distance_km - b.distance_km)
          .slice(0, 5);
      }
    }),
});
