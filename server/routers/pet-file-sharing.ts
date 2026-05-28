import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { petFileShares, petFileAudit, pets } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

export const petFileSharingRouter = router({
  /**
   * Create a share link for pet file
   */
  createShare: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        sharedWithId: z.number().optional(),
        sharedWithType: z.enum(["veterinarian", "clinic", "trainer"]),
        accessLevel: z.enum(["view_only", "edit", "full_access"]).default("view_only"),
        expiresInDays: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify pet ownership
      const pet = await db
        .select()
        .from(pets)
        .where(eq(pets.id, input.petId))
        .limit(1);

      if (!pet.length || pet[0].userId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Pet not found or not owned by user" });
      }

      // Generate share token
      const shareToken = crypto.randomBytes(32).toString("hex");

      // Calculate expiration date
      const expiresAt = input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : null;

      const result = await db.insert(petFileShares).values({
        petId: input.petId,
        ownerId: ctx.user!.id,
        sharedWithId: input.sharedWithId,
        sharedWithType: input.sharedWithType,
        shareToken,
        accessLevel: input.accessLevel,
        expiresAt,
      });

      // Log the share action
      await db.insert(petFileAudit).values({
        petId: input.petId,
        userId: ctx.user!.id,
        action: "share",
        details: `Shared with ${input.sharedWithType}`,
      });

      return { shareToken, expiresAt };
    }),

  /**
   * Get all shares for a pet
   */
  getShares: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify pet ownership
      const pet = await db
        .select()
        .from(pets)
        .where(eq(pets.id, input.petId))
        .limit(1);

      if (!pet.length || pet[0].userId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Pet not found or not owned by user" });
      }

      const shares = await db
        .select()
        .from(petFileShares)
        .where(eq(petFileShares.petId, input.petId));

      return shares;
    }),

  /**
   * Verify and access shared pet file
   */
  accessWithToken: publicProcedure
    .input(z.object({ shareToken: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const share = await db
        .select()
        .from(petFileShares)
        .where(eq(petFileShares.shareToken, input.shareToken))
        .limit(1);

      if (!share.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid share token" });
      }

      const shareRecord = share[0];

      // Check if share has expired
      if (shareRecord.expiresAt && new Date() > shareRecord.expiresAt) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Share link has expired" });
      }

      // Update last accessed time
      await db
        .update(petFileShares)
        .set({ lastAccessedAt: new Date() })
        .where(eq(petFileShares.id, shareRecord.id));

      // Get pet data
      const petData = await db
        .select()
        .from(pets)
        .where(eq(pets.id, shareRecord.petId))
        .limit(1);

      return {
        pet: petData[0] || null,
        accessLevel: shareRecord.accessLevel,
      };
    }),

  /**
   * Revoke a share
   */
  revokeShare: protectedProcedure
    .input(z.object({ shareId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get the share record
      const share = await db
        .select()
        .from(petFileShares)
        .where(eq(petFileShares.id, input.shareId))
        .limit(1);

      if (!share.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share not found" });
      }

      // Verify ownership
      if (share[0].ownerId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot revoke share" });
      }

      // Delete the share
      const result = await db
        .delete(petFileShares)
        .where(eq(petFileShares.id, input.shareId));

      // Log the action
      await db.insert(petFileAudit).values({
        petId: share[0].petId,
        userId: ctx.user!.id,
        action: "delete",
        details: "Revoked share",
      });

      return result;
    }),

  /**
   * Update share access level
   */
  updateAccessLevel: protectedProcedure
    .input(
      z.object({
        shareId: z.number(),
        accessLevel: z.enum(["view_only", "edit", "full_access"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get the share record
      const share = await db
        .select()
        .from(petFileShares)
        .where(eq(petFileShares.id, input.shareId))
        .limit(1);

      if (!share.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share not found" });
      }

      // Verify ownership
      if (share[0].ownerId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot update share" });
      }

      const result = await db
        .update(petFileShares)
        .set({ accessLevel: input.accessLevel })
        .where(eq(petFileShares.id, input.shareId));

      return result;
    }),

  /**
   * Get audit trail for pet file
   */
  getAuditTrail: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify pet ownership
      const pet = await db
        .select()
        .from(pets)
        .where(eq(pets.id, input.petId))
        .limit(1);

      if (!pet.length || pet[0].userId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Pet not found or not owned by user" });
      }

      const audit = await db
        .select()
        .from(petFileAudit)
        .where(eq(petFileAudit.petId, input.petId));

      return audit;
    }),

  /**
   * Log file access (internal)
   */
  logAccess: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        action: z.enum(["view", "edit", "download", "share", "delete"]),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db.insert(petFileAudit).values({
        petId: input.petId,
        userId: ctx.user!.id,
        action: input.action,
        details: input.details,
      });

      return result;
    }),

  /**
   * Get shares received by user (as veterinarian/clinic/trainer)
   */
  getReceivedShares: protectedProcedure
    .input(
      z.object({
        sharedWithType: z.enum(["veterinarian", "clinic", "trainer"]),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const shares = await db
        .select()
        .from(petFileShares)
        .where(
          and(
            eq(petFileShares.sharedWithId, ctx.user!.id),
            eq(petFileShares.sharedWithType, input.sharedWithType)
          )
        );

      // Filter out expired shares
      return shares.filter((share) => {
        if (!share.expiresAt) return true;
        return new Date() <= share.expiresAt;
      });
    }),

  /**
   * Export pet file as PDF (placeholder)
   */
  exportPDF: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify pet ownership
      const pet = await db
        .select()
        .from(pets)
        .where(eq(pets.id, input.petId))
        .limit(1);

      if (!pet.length || pet[0].userId !== ctx.user!.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Pet not found or not owned by user" });
      }

      // Log the download action
      await db.insert(petFileAudit).values({
        petId: input.petId,
        userId: ctx.user!.id,
        action: "download",
        details: "Exported as PDF",
      });

      return {
        success: true,
        message: "PDF export initiated",
        petId: input.petId,
      };
    }),
});
