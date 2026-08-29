import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { virtualPetAvatars, avatarConversations, avatarAchievements, pets } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";

export const virtualPetAvatarRouter = router({
  createAvatar: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        name: z.string().min(1).max(255),
        nameAr: z.string().optional(),
        personality: z.string().optional(),
        personalityAr: z.string().optional(),
        colorTheme: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet.length || pet[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to create an avatar for this pet",
        });
      }

      const existing = await db.select().from(virtualPetAvatars).where(eq(virtualPetAvatars.petId, input.petId)).limit(1);
      if (existing.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This pet already has an avatar",
        });
      }

      const result = await db.insert(virtualPetAvatars).values({
        petId: input.petId,
        userId: ctx.user.id,
        name: input.name,
        nameAr: input.nameAr,
        personality: input.personality || "Friendly",
        personalityAr: input.personalityAr || "ودود",
        colorTheme: input.colorTheme || "golden",
        conversationStyle: "warm_and_supportive",
        conversationStyleAr: "دافئ وداعم",
        traits: JSON.stringify(["intelligent", "caring", "playful"]),
        traitsAr: JSON.stringify(["ذكي", "رعاية", "مرح"]),
        specialAbilities: JSON.stringify(["training_guidance", "health_monitoring", "behavior_analysis"]),
        specialAbilitiesAr: JSON.stringify(["إرشادات التدريب", "مراقبة الصحة", "تحليل السلوك"]),
        knowledgeBase: JSON.stringify(["pet_care", "training", "nutrition", "health"]),
        learningProgress: JSON.stringify({ initialized: true, learningPhase: 1 }),
      });

      return result;
    }),

  getAvatarByPet: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .select()
        .from(virtualPetAvatars)
        .where(and(eq(virtualPetAvatars.petId, input.petId), eq(virtualPetAvatars.userId, ctx.user.id)))
        .limit(1);

      return result.length ? result[0] : null;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        avatarId: z.number(),
        message: z.string().min(1),
        messageType: z.enum(["question", "command", "chat", "training", "health_check"]).default("chat"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const avatarResult = await db
        .select()
        .from(virtualPetAvatars)
        .where(and(eq(virtualPetAvatars.id, input.avatarId), eq(virtualPetAvatars.userId, ctx.user.id)))
        .limit(1);

      if (!avatarResult.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Avatar not found",
        });
      }

      const avatar = avatarResult[0];
      const petResult = await db.select().from(pets).where(eq(pets.id, avatar.petId)).limit(1);
      const pet = petResult.length ? petResult[0] : null;

      const systemPrompt = `You are ${avatar.name}, a virtual pet companion and AI guide. 
Your personality: ${avatar.personality}
Your role: Help the pet owner with training, health advice, and emotional support for their pet.
Pet details: ${pet?.name} (${pet?.species} - ${pet?.breed})
Respond warmly and supportively. Keep responses concise and actionable.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.message },
        ],
      });

      const avatarResponse = typeof response.choices[0]?.message?.content === 'string' 
        ? response.choices[0].message.content 
        : "I'm here to help!";

      await db.insert(avatarConversations).values({
        avatarId: input.avatarId,
        userId: ctx.user.id,
        petId: avatar.petId,
        userMessage: input.message,
        avatarResponse: avatarResponse,
        messageType: input.messageType,
        context: JSON.stringify({
          petName: pet?.name,
          petSpecies: pet?.species,
          petBreed: pet?.breed,
          avatarPersonality: avatar.personality,
        }),
      });

      await db
        .update(virtualPetAvatars)
        .set({
          totalInteractions: (avatar.totalInteractions || 0) + 1,
          lastInteractionAt: new Date(),
        })
        .where(eq(virtualPetAvatars.id, input.avatarId));

      return {
        userMessage: input.message,
        avatarResponse: avatarResponse,
        timestamp: new Date(),
      };
    }),

  getConversationHistory: protectedProcedure
    .input(
      z.object({
        avatarId: z.number(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const avatarResult = await db
        .select()
        .from(virtualPetAvatars)
        .where(and(eq(virtualPetAvatars.id, input.avatarId), eq(virtualPetAvatars.userId, ctx.user.id)))
        .limit(1);

      if (!avatarResult.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Avatar not found",
        });
      }

      const conversations = await db
        .select()
        .from(avatarConversations)
        .where(eq(avatarConversations.avatarId, input.avatarId))
        .limit(input.limit);

      return conversations;
    }),

  getMyAvatars: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const avatars = await db.select().from(virtualPetAvatars).where(eq(virtualPetAvatars.userId, ctx.user.id));

    return avatars;
  }),
});
