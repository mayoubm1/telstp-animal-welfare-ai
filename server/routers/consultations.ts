import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { consultationRequests, consultations, veterinarians } from "../../drizzle/schema";
import { getDb } from "../db";
import { supabase } from "../_core/supabase";
import { protectedProcedure, router } from "../_core/trpc";

export const consultationRequestInput = z.object({
  clinicId: z.string().trim().min(1).max(64),
  petName: z.string().trim().min(1, "Pet name is required").max(255),
  requestedAt: z.string().datetime({ offset: true }),
  reason: z.string().trim().min(5, "Please add a brief reason for the visit").max(4000),
  contactPhone: z.string().trim().min(3, "Contact phone is required").max(32),
});

async function getVerifiedClinic(clinicId: string) {
  const { data, error } = await supabase
    .from("vet_clinics")
    .select("id,name,phone")
    .eq("id", clinicId)
    .eq("verified", true)
    .single();

  if (error || !data) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Selected clinic is not available" });
  }

  return data as { id: string; name: string; phone: string };
}

export const consultationsRouter = router({
  getByVeterinarian: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const veterinarian = await db.select().from(veterinarians).where(eq(veterinarians.userId, ctx.user.id)).limit(1);
    if (!veterinarian[0]) return [];

    return db
      .select()
      .from(consultations)
      .where(eq(consultations.veterinarianId, veterinarian[0].id))
      .orderBy(desc(consultations.requestedAt));
  }),

  respond: protectedProcedure
    .input(z.object({ consultationId: z.number().int().positive(), response: z.string().trim().min(1).max(8000), recommendation: z.string().trim().max(8000).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const veterinarian = await db.select().from(veterinarians).where(eq(veterinarians.userId, ctx.user.id)).limit(1);
      if (!veterinarian[0]) throw new TRPCError({ code: "FORBIDDEN", message: "Veterinarian access is required" });

      const existing = await db
        .select()
        .from(consultations)
        .where(and(eq(consultations.id, input.consultationId), eq(consultations.veterinarianId, veterinarian[0].id)))
        .limit(1);
      if (!existing[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Consultation not found" });

      await db
        .update(consultations)
        .set({ status: "in_progress", veterinarianNotes: input.response, recommendation: input.recommendation || input.response })
        .where(eq(consultations.id, input.consultationId));

      return { success: true, consultationId: input.consultationId, respondedAt: new Date() };
    }),

  createRequest: protectedProcedure.input(consultationRequestInput).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const clinic = await getVerifiedClinic(input.clinicId);
    const result = await db.insert(consultationRequests).values({
      ownerId: ctx.user.id,
      clinicId: clinic.id,
      clinicName: clinic.name,
      clinicPhone: clinic.phone,
      petName: input.petName,
      requestedAt: new Date(input.requestedAt),
      reason: input.reason,
      contactPhone: input.contactPhone,
      status: "saved",
    });

    const id = Number((result as { insertId?: number | string }).insertId);
    const created = await db.select().from(consultationRequests).where(eq(consultationRequests.id, id)).limit(1);
    if (!created[0]) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not retrieve saved consultation" });

    return created[0];
  }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    return db
      .select()
      .from(consultationRequests)
      .where(eq(consultationRequests.ownerId, ctx.user.id))
      .orderBy(desc(consultationRequests.createdAt));
  }),

  markClinicContacted: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(consultationRequests)
        .set({ status: "clinic_contacted" })
        .where(and(eq(consultationRequests.id, input.id), eq(consultationRequests.ownerId, ctx.user.id)));

      const updated = await db
        .select()
        .from(consultationRequests)
        .where(and(eq(consultationRequests.id, input.id), eq(consultationRequests.ownerId, ctx.user.id)))
        .limit(1);

      if (!updated[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Consultation request not found" });
      return updated[0];
    }),
});
