import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { veterinarians, users } from "../../drizzle/schema";

export const veterinariansRouter = router({
  // Register a new veterinarian
  register: protectedProcedure
    .input(
      z.object({
        licenseNumber: z.string().min(5, "License number is required"),
        specializations: z.array(z.string()).optional(),
        clinicName: z.string().min(2, "Clinic name is required"),
        clinicAddress: z.string().min(5, "Clinic address is required"),
        clinicPhone: z.string().min(7, "Valid phone number is required"),
        clinicEmail: z.string().email("Valid email is required"),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        bio: z.string().optional(),
        consultationFee: z.number().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // Check if veterinarian already exists for this user
        const existing = await db
          .select()
          .from(veterinarians)
          .where(eq(veterinarians.userId, ctx.user.id))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Veterinarian profile already exists for this user",
          });
        }

        // Create veterinarian profile
        const result = await db.insert(veterinarians).values({
          userId: ctx.user.id,
          licenseNumber: input.licenseNumber,
          specializations: input.specializations ? JSON.stringify(input.specializations) : null,
          clinicName: input.clinicName,
          clinicAddress: input.clinicAddress,
          clinicPhone: input.clinicPhone,
          clinicEmail: input.clinicEmail,
          latitude: input.latitude ? String(input.latitude) : null,
          longitude: input.longitude ? String(input.longitude) : null,
          bio: input.bio,
          consultationFee: input.consultationFee ? String(input.consultationFee) : null,
          verified: false,
        });

        // Update user role to veterinarian
        await db
          .update(users)
          .set({
            role: "veterinarian",
            userType: "veterinarian",
          })
          .where(eq(users.id, ctx.user.id));

        return {
          success: true,
          veterinarianId: (result as any).insertId,
          message: "Veterinarian profile created successfully. Pending verification.",
        };
      } catch (error) {
        console.error("[Veterinarians] Error registering veterinarian:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register veterinarian profile",
        });
      }
    }),

  // Get current user's veterinarian profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    try {
      const result = await db
        .select()
        .from(veterinarians)
        .where(eq(veterinarians.userId, ctx.user.id))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const vet = result[0];
      return {
        ...vet,
        specializations: vet.specializations ? JSON.parse(String(vet.specializations)) : [],
        latitude: vet.latitude ? parseFloat(String(vet.latitude)) : null,
        longitude: vet.longitude ? parseFloat(String(vet.longitude)) : null,
        consultationFee: vet.consultationFee ? parseFloat(String(vet.consultationFee)) : null,
      };
    } catch (error) {
      console.error("[Veterinarians] Error fetching veterinarian profile:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch veterinarian profile",
      });
    }
  }),

  // Update veterinarian profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        specializations: z.array(z.string()).optional(),
        clinicName: z.string().optional(),
        clinicAddress: z.string().optional(),
        clinicPhone: z.string().optional(),
        clinicEmail: z.string().email().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        bio: z.string().optional(),
        consultationFee: z.number().positive().optional(),
        profileImageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const updates: any = {};

        if (input.specializations !== undefined) {
          updates.specializations = JSON.stringify(input.specializations);
        }
        if (input.clinicName !== undefined) updates.clinicName = input.clinicName;
        if (input.clinicAddress !== undefined) updates.clinicAddress = input.clinicAddress;
        if (input.clinicPhone !== undefined) updates.clinicPhone = input.clinicPhone;
        if (input.clinicEmail !== undefined) updates.clinicEmail = input.clinicEmail;
        if (input.latitude !== undefined) updates.latitude = String(input.latitude);
        if (input.longitude !== undefined) updates.longitude = String(input.longitude);
        if (input.bio !== undefined) updates.bio = input.bio;
        if (input.consultationFee !== undefined) updates.consultationFee = String(input.consultationFee);
        if (input.profileImageUrl !== undefined) updates.profileImageUrl = input.profileImageUrl;

        await db
          .update(veterinarians)
          .set(updates)
          .where(eq(veterinarians.userId, ctx.user.id));

        return {
          success: true,
          message: "Veterinarian profile updated successfully",
        };
      } catch (error) {
        console.error("[Veterinarians] Error updating veterinarian profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update veterinarian profile",
        });
      }
    }),

  // Get veterinarian by ID (public)
  getById: publicProcedure
    .input(z.object({ veterinarianId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const result = await db
          .select()
          .from(veterinarians)
          .where(eq(veterinarians.id, input.veterinarianId))
          .limit(1);

        if (result.length === 0) {
          return null;
        }

        const vet = result[0];
        return {
          ...vet,
          specializations: vet.specializations ? JSON.parse(String(vet.specializations)) : [],
          latitude: vet.latitude ? parseFloat(String(vet.latitude)) : null,
          longitude: vet.longitude ? parseFloat(String(vet.longitude)) : null,
          consultationFee: vet.consultationFee ? parseFloat(String(vet.consultationFee)) : null,
        };
      } catch (error) {
        console.error("[Veterinarians] Error fetching veterinarian:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch veterinarian",
        });
      }
    }),

  // List all verified veterinarians (public)
  listVerified: publicProcedure
    .input(
      z.object({
        specialization: z.string().optional(),
        city: z.string().optional(),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        // For now, return all verified veterinarians
        // In production, would filter by specialization and city
        let query = db.select().from(veterinarians).where(eq(veterinarians.verified, true));

        const results = await query.limit(input.limit);

        return results.map((vet) => ({
          ...vet,
          specializations: vet.specializations ? JSON.parse(String(vet.specializations)) : [],
          latitude: vet.latitude ? parseFloat(String(vet.latitude)) : null,
          longitude: vet.longitude ? parseFloat(String(vet.longitude)) : null,
          consultationFee: vet.consultationFee ? parseFloat(String(vet.consultationFee)) : null,
        }));
      } catch (error) {
        console.error("[Veterinarians] Error listing veterinarians:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list veterinarians",
        });
      }
    }),

  // Check if user is a verified veterinarian
  isVerified: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    try {
      const result = await db
        .select()
        .from(veterinarians)
        .where(eq(veterinarians.userId, ctx.user.id))
        .limit(1);

      if (result.length === 0) {
        return { isVeterinarian: false, verified: false };
      }

      return {
        isVeterinarian: true,
        verified: result[0].verified,
      };
    } catch (error) {
      console.error("[Veterinarians] Error checking veterinarian status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check veterinarian status",
      });
    }
  }),
});
