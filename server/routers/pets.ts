import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { pets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const petsRouter = router({
  // Get all pets for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    try {
      const userPets = await db
        .select()
        .from(pets)
        .where(eq(pets.userId, ctx.user.id));

      return userPets;
    } catch (error) {
      console.error("[Pets] Failed to list pets:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch pets" });
    }
  }),

  // Get single pet by ID
  getById: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const pet = await db
          .select()
          .from(pets)
          .where(eq(pets.id, input.petId))
          .limit(1);

        if (pet.length === 0 || pet[0]?.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
        }

        return pet[0];
      } catch (error) {
        console.error("[Pets] Failed to get pet:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch pet" });
      }
    }),

  // Create new pet
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Pet name is required"),
        species: z.enum(["cat", "dog"]),
        breed: z.string().min(1, "Breed is required"),
        age: z.number().min(0, "Age must be positive"),
        weight: z.string(),
        color: z.string().optional(),
        microchipId: z.string().optional(),
        vaccinationStatus: z.enum(["up_to_date", "overdue", "unknown"]).default("unknown"),
        medicalHistory: z.string().optional(),
        allergies: z.string().optional(),
        currentMedications: z.string().optional(),
        profileImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const result = await db.insert(pets).values({
          userId: ctx.user.id,
          name: input.name,
          species: input.species,
          breed: input.breed,
          age: input.age,
          weight: input.weight,
          color: input.color || null,
          microchipId: input.microchipId || null,
          vaccinationStatus: input.vaccinationStatus,
          medicalHistory: input.medicalHistory || null,
          allergies: input.allergies || null,
          currentMedications: input.currentMedications || null,
          profileImageUrl: input.profileImageUrl || null,
        });

        const petId = (result as any).insertId;
        const createdPet = await db
          .select()
          .from(pets)
          .where(eq(pets.id, petId))
          .limit(1);
        
        if (createdPet.length === 0) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve created pet" });
        }
        
        return createdPet[0]!;
      } catch (error) {
        console.error("[Pets] Failed to create pet:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create pet" });
      }
    }),

  // Update pet
  update: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        name: z.string().optional(),
        breed: z.string().optional(),
        age: z.number().optional(),
        weight: z.string().optional(),
        color: z.string().optional(),
        microchipId: z.string().optional(),
        vaccinationStatus: z.enum(["up_to_date", "overdue", "unknown"]).optional(),
        medicalHistory: z.string().optional(),
        allergies: z.string().optional(),
        currentMedications: z.string().optional(),
        profileImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const pet = await db
          .select()
          .from(pets)
          .where(eq(pets.id, input.petId))
          .limit(1);

        if (pet.length === 0 || pet[0]?.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to update this pet" });
        }

        const updateData: Record<string, any> = { updatedAt: new Date() };
        if (input.name !== undefined) updateData.name = input.name;
        if (input.breed !== undefined) updateData.breed = input.breed;
        if (input.age !== undefined) updateData.age = input.age;
        if (input.weight !== undefined) updateData.weight = input.weight;
        if (input.color !== undefined) updateData.color = input.color;
        if (input.microchipId !== undefined) updateData.microchipId = input.microchipId;
        if (input.vaccinationStatus !== undefined) updateData.vaccinationStatus = input.vaccinationStatus;
        if (input.medicalHistory !== undefined) updateData.medicalHistory = input.medicalHistory;
        if (input.allergies !== undefined) updateData.allergies = input.allergies;
        if (input.currentMedications !== undefined) updateData.currentMedications = input.currentMedications;
        if (input.profileImageUrl !== undefined) updateData.profileImageUrl = input.profileImageUrl;

        await db.update(pets).set(updateData).where(eq(pets.id, input.petId));

        return { success: true };
      } catch (error) {
        console.error("[Pets] Failed to update pet:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update pet" });
      }
    }),

  // Delete pet
  delete: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        const pet = await db
          .select()
          .from(pets)
          .where(eq(pets.id, input.petId))
          .limit(1);

        if (pet.length === 0 || pet[0]?.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to delete this pet" });
        }

        await db.delete(pets).where(eq(pets.id, input.petId));

        return { success: true };
      } catch (error) {
        console.error("[Pets] Failed to delete pet:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete pet" });
      }
    }),

  // Get breed suggestions for species
  getBreeds: publicProcedure
    .input(z.object({ species: z.enum(["cat", "dog"]) }))
    .query(({ input }) => {
      const breeds = {
        cat: [
          "Persian", "Maine Coon", "British Shorthair", "Siamese", "Ragdoll", "Bengal", "Sphynx",
          "Scottish Fold", "American Shorthair", "Abyssinian", "Birman", "Bombay", "Burmese",
          "Cornish Rex", "Devon Rex", "Egyptian Mau", "Japanese Bobtail", "Korat", "Manx",
          "Norwegian Forest Cat", "Ocicat", "Oriental", "Russian Blue", "Somali", "Tonkinese",
          "Turkish Angora", "Turkish Van", "Mixed/Domestic Shorthair",
        ],
        dog: [
          "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog",
          "Poodle", "Beagle", "Dachshund", "Rottweiler", "Yorkshire Terrier", "Boxer", "Husky",
          "German Shorthaired Pointer", "Doberman Pinscher", "Great Dane", "Chihuahua", "Shih Tzu",
          "Pug", "Cocker Spaniel", "Siberian Husky", "Schnauzer", "Maltese", "Pomeranian",
          "Cavalier King Charles Spaniel", "Bernese Mountain Dog", "Australian Shepherd", "Border Collie",
          "Shiba Inu", "Akita", "Dalmatian", "Samoyed", "Chow Chow", "Shar Pei", "Basset Hound",
          "Bloodhound", "Saint Bernard", "Newfoundland", "Mastiff", "Greyhound", "Whippet",
          "Jack Russell Terrier", "Mixed/Domestic Shorthair",
        ],
      };

      return breeds[input.species] || [];
    }),
});
