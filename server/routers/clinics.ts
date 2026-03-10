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
});
