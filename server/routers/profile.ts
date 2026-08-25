import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const ownerProfileInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(32).optional(),
  location: z.string().trim().max(255).optional(),
  language: z.enum(["en", "ar"]),
});

const optionalText = (value?: string) => value?.trim() || null;

export const profileRouter = router({
  update: protectedProcedure.input(ownerProfileInput).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    await db
      .update(users)
      .set({
        name: input.name,
        phone: optionalText(input.phone),
        location: optionalText(input.location),
        language: input.language,
      })
      .where(eq(users.id, ctx.user.id));

    const updated = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!updated[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });

    return updated[0];
  }),
});
