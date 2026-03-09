import { z } from "zod";
import { getDb } from "../db";
import { vetClinics } from "../../drizzle/schema";
import { like, eq } from "drizzle-orm";
import { router, publicProcedure } from "../_core/trpc";

export const clinicsRouter = router({
  /**
   * Search clinics by city and type
   */
  search: publicProcedure
    .input(
      z.object({
        city: z.string().min(1, "City is required"),
        clinicType: z.enum(["general", "emergency", "specialty", "hospital"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        let conditions: any[] = [like(vetClinics.city, `%${input.city}%`)];
        if (input.clinicType) {
          conditions.push(eq(vetClinics.clinicType, input.clinicType));
        }
        const clinics = await db.select().from(vetClinics).where(conditions[0]);

        // const clinics = await query.limit(50);
        return clinics.map((clinic) => ({
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
          city: clinic.city,
          phone: clinic.phone,
          clinicType: clinic.clinicType,
          emergencyServices: clinic.emergencyServices,
          rating: clinic.rating ? parseFloat(clinic.rating.toString()) : null,
          latitude: parseFloat(clinic.latitude.toString()),
          longitude: parseFloat(clinic.longitude.toString()),
          website: clinic.website,
          email: clinic.email,
          operatingHours: clinic.operatingHours,
          specialties: clinic.specialties,
          surgeryCapable: clinic.surgeryCapable,
          imagingServices: clinic.imagingServices,
          labServices: clinic.labServices,
          description: clinic.description,
        }));
      } catch (error) {
        console.error("Clinic search error:", error);
        return [];
      }
    }),

  /**
   * Get nearby clinics based on coordinates
   */
  getNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(10),
        clinicType: z.enum(["general", "emergency", "specialty", "hospital"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        const allClinics = await db.select().from(vetClinics).limit(100);

        // Calculate distance using Haversine formula
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Earth's radius in km
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

        const nearby = allClinics
          .map((clinic: any) => ({
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            city: clinic.city,
            phone: clinic.phone,
            clinicType: clinic.clinicType,
            emergencyServices: clinic.emergencyServices,
            rating: clinic.rating ? parseFloat(clinic.rating.toString()) : null,
            latitude: parseFloat(clinic.latitude.toString()),
            longitude: parseFloat(clinic.longitude.toString()),
            website: clinic.website,
            email: clinic.email,
            operatingHours: clinic.operatingHours,
            specialties: clinic.specialties,
            surgeryCapable: clinic.surgeryCapable,
            imagingServices: clinic.imagingServices,
            labServices: clinic.labServices,
            description: clinic.description,
            distance: calculateDistance(
              input.latitude,
              input.longitude,
              parseFloat(clinic.latitude.toString()),
              parseFloat(clinic.longitude.toString())
            ),
          }))
          .filter((clinic: any) => clinic.distance <= input.radiusKm)
          .sort((a: any, b: any) => a.distance - b.distance);

        return nearby;
      } catch (error) {
        console.error("Nearby clinics error:", error);
        return [];
      }
    }),

  /**
   * Get clinic details by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;
        const clinic = await db.select().from(vetClinics).where(eq(vetClinics.id, input.id)).limit(1);

        if (!clinic.length) return null;

        const c = clinic[0];
        return {
          id: c.id,
          name: c.name,
          address: c.address,
          city: c.city,
          phone: c.phone,
          clinicType: c.clinicType,
          emergencyServices: c.emergencyServices,
          rating: c.rating ? parseFloat(c.rating.toString()) : null,
          latitude: parseFloat(c.latitude.toString()),
          longitude: parseFloat(c.longitude.toString()),
          website: c.website,
          email: c.email,
          operatingHours: c.operatingHours,
          specialties: c.specialties,
          surgeryCapable: c.surgeryCapable,
          imagingServices: c.imagingServices,
          labServices: c.labServices,
          description: c.description,
          totalReviews: c.totalReviews,
          verified: c.verified,
        };
      } catch (error) {
        console.error("Get clinic error:", error);
        return null;
      }
    }),

  /**
   * Get emergency clinics
   */
  getEmergency: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        radiusKm: z.number().default(15),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        const emergencyClinics = await db
          .select()
          .from(vetClinics)
          .where(eq(vetClinics.emergencyServices, true))
          .limit(50);

        if (!input.latitude || !input.longitude) {
          return emergencyClinics.map((clinic: any) => ({
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            city: clinic.city,
            phone: clinic.phone,
            clinicType: clinic.clinicType,
            emergencyServices: clinic.emergencyServices,
            rating: clinic.rating ? parseFloat(clinic.rating.toString()) : null,
            latitude: parseFloat(clinic.latitude.toString()),
            longitude: parseFloat(clinic.longitude.toString()),
            website: clinic.website,
            email: clinic.email,
          }));
        }

        // Calculate distance if coordinates provided
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

        return emergencyClinics
          .map((clinic: any) => ({
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            city: clinic.city,
            phone: clinic.phone,
            clinicType: clinic.clinicType,
            emergencyServices: clinic.emergencyServices,
            rating: clinic.rating ? parseFloat(clinic.rating.toString()) : null,
            latitude: parseFloat(clinic.latitude.toString()),
            longitude: parseFloat(clinic.longitude.toString()),
            website: clinic.website,
            email: clinic.email,
            distance: calculateDistance(
              input.latitude!,
              input.longitude!,
              parseFloat(clinic.latitude.toString()),
              parseFloat(clinic.longitude.toString())
            ),
          }))
          .filter((clinic: any) => clinic.distance <= input.radiusKm)
          .sort((a: any, b: any) => a.distance - b.distance);
      } catch (error) {
        console.error("Emergency clinics error:", error);
        return [];
      }
    }),
});
