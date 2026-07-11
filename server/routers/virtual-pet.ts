import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  initializeVirtualPet,
  generatePetResponse,
  applyInteraction,
  getPetStatusMessage,
  getPetStatusMessageAr,
  shouldAutoInteract,
  generatePetGreeting,
  type VirtualPetState,
} from "../services/virtual-pet-companion";

export const virtualPetRouter = router({
  // Initialize a new virtual pet
  initializePet: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        name: z.string(),
        species: z.enum(["dog", "cat", "rabbit"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const petState = await initializeVirtualPet(input.petId, input.name, input.species);
        return {
          success: true,
          pet: petState,
          message: `${input.name} has joined your life! 🐾`,
          messageAr: `${input.name} انضم إلى حياتك! 🐾`,
        };
      } catch (error) {
        console.error("Error initializing pet:", error);
        throw new Error("Failed to initialize virtual pet");
      }
    }),

  // Get pet greeting
  getGreeting: publicProcedure
    .input(
      z.object({
        petState: z.any(),
      })
    )
    .query(async ({ input }) => {
      try {
        const greeting = await generatePetGreeting(input.petState);
        return {
          greeting,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error generating greeting:", error);
        return {
          greeting: "Hello! Happy to see you!",
          timestamp: new Date(),
        };
      }
    }),

  // Chat with pet
  chat: publicProcedure
    .input(
      z.object({
        petState: z.any(),
        message: z.string(),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const petResponse = await generatePetResponse(
          input.petState,
          input.message,
          input.context
        );

        return {
          success: true,
          response: petResponse,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error in pet chat:", error);
        return {
          success: false,
          response: "I'm thinking about that...",
          timestamp: new Date(),
        };
      }
    }),

  // Apply interaction
  interact: publicProcedure
    .input(
      z.object({
        petState: z.any(),
        interactionType: z.enum(["play", "feed", "pet", "talk", "rest", "exercise", "train"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const updatedPet = applyInteraction(input.petState, input.interactionType);

        // Generate pet reaction
        const reactions: Record<string, string> = {
          play: "Yay! Let's have fun! 🎾",
          feed: "Nom nom! Delicious! 😋",
          pet: "That feels nice... 😊",
          talk: "I'm listening... 👂",
          rest: "Zzzzz... 😴",
          exercise: "Let's go! 🏃",
          train: "I'll do my best! 💪",
        };

        const reactionsAr: Record<string, string> = {
          play: "يالا! لنستمتع! 🎾",
          feed: "يم يم! لذيذ! 😋",
          pet: "هذا شعور جميل... 😊",
          talk: "أنا أستمع... 👂",
          rest: "zzzzz... 😴",
          exercise: "لنذهب! 🏃",
          train: "سأبذل قصارى جهدي! 💪",
        };

        return {
          success: true,
          petState: updatedPet,
          reaction: reactions[input.interactionType] || "Thanks for that!",
          reactionAr: reactionsAr[input.interactionType] || "شكراً لذلك!",
          statusMessage: getPetStatusMessage(updatedPet),
          statusMessageAr: getPetStatusMessageAr(updatedPet),
        };
      } catch (error) {
        console.error("Error applying interaction:", error);
        throw new Error("Failed to apply interaction");
      }
    }),

  // Get pet status
  getStatus: publicProcedure
    .input(z.object({ petState: z.any() }))
    .query(({ input }) => {
      return {
        mood: input.petState.mood,
        energy: input.petState.energy,
        happiness: input.petState.happiness,
        health: input.petState.health,
        hunger: input.petState.hunger,
        statusMessage: getPetStatusMessage(input.petState),
        statusMessageAr: getPetStatusMessageAr(input.petState),
        currentActivity: input.petState.currentActivity,
        totalInteractions: input.petState.totalInteractions,
        needsAttention: shouldAutoInteract(input.petState),
      };
    }),

  // Get pet info
  getPetInfo: publicProcedure
    .input(z.object({ petState: z.any() }))
    .query(({ input }) => {
      return {
        name: input.petState.name,
        species: input.petState.species,
        personality: input.petState.personality,
        mood: input.petState.mood,
        energy: input.petState.energy,
        happiness: input.petState.happiness,
        health: input.petState.health,
        hunger: input.petState.hunger,
        totalInteractions: input.petState.totalInteractions,
        lastInteraction: input.petState.lastInteraction,
      };
    }),

  // Get recommended action
  getRecommendedAction: publicProcedure
    .input(z.object({ petState: z.any() }))
    .query(({ input }) => {
      const action = shouldAutoInteract(input.petState);

      const actionMessages: Record<string, { message: string; messageAr: string }> = {
        feed: {
          message: "Your pet is hungry! Time to feed them 🍖",
          messageAr: "حيوانك الأليف جوعان! حان وقت إطعامهم 🍖",
        },
        rest: {
          message: "Your pet is tired! Let them rest 😴",
          messageAr: "حيوانك الأليف متعب! دعهم يستريحون 😴",
        },
        play: {
          message: "Your pet is sad! Let's play together 🎾",
          messageAr: "حيوانك الأليف حزين! لنلعب معاً 🎾",
        },
      };

      return {
        recommendedAction: action,
        message: action ? actionMessages[action]?.message : "Your pet is happy and content!",
        messageAr: action
          ? actionMessages[action]?.messageAr
          : "حيوانك الأليف سعيد ومرتاح!",
      };
    }),
});
