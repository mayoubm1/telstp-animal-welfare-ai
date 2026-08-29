import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  customizeTrainingPlan,
  customizeNutritionPlan,
  type PetProfile,
} from "../services/ai-customization";
import {
  filterNaturalProducts,
  compareProducts,
  getBestValueProducts,
  type FilterOptions,
} from "../services/natural-alternatives";

export const aiRouter = router({
  // Natural Alternatives
  naturalAlternatives: router({
    search: publicProcedure
      .input(
        z.object({
          query: z.string().optional(),
          filters: z
            .object({
              categories: z.array(z.string()).optional(),
              certifications: z.array(z.string()).optional(),
              maxPrice: z.number().optional(),
              minPrice: z.number().optional(),
              maxDeliveryDays: z.number().optional(),
              quality: z.array(z.string()).optional(),
              availability: z.array(z.string()).optional(),
              sortBy: z
                .enum(["price-asc", "price-desc", "rating", "delivery", "newest"])
                .optional(),
            })
            .optional(),
        })
      )
      .query(({ input }) => {
        return filterNaturalProducts(input.query, input.filters);
      }),

    compare: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => {
        return compareProducts(input.category);
      }),

    bestValue: publicProcedure.query(() => {
      return getBestValueProducts(5);
    }),

    categories: publicProcedure.query(() => {
      return [
        { value: "food", labelEn: "Food", labelAr: "الطعام" },
        { value: "supplement", labelEn: "Supplements", labelAr: "المكملات" },
        { value: "treat", labelEn: "Treats", labelAr: "العلاجات" },
        { value: "accessory", labelEn: "Accessories", labelAr: "الملحقات" },
        { value: "toy", labelEn: "Toys", labelAr: "الألعاب" },
      ];
    }),

    certifications: publicProcedure.query(() => {
      return [
        { value: "organic", labelEn: "Organic", labelAr: "عضوي" },
        { value: "non-gmo", labelEn: "Non-GMO", labelAr: "خالي من الكائنات المعدلة" },
        { value: "eco-friendly", labelEn: "Eco-Friendly", labelAr: "صديق للبيئة" },
        { value: "grain-free", labelEn: "Grain-Free", labelAr: "خالي من الحبوب" },
        { value: "no-additives", labelEn: "No Additives", labelAr: "بدون إضافات" },
      ];
    }),
  }),

  // AI Customization
  aiCustomization: router({
    trainingPlan: protectedProcedure
      .input(
        z.object({
          petName: z.string(),
          species: z.enum(["dog", "cat"]),
          breed: z.string().optional(),
          ageMonths: z.number(),
          weight: z.number().optional(),
          medicalHistory: z.string().optional(),
          allergies: z.array(z.string()).optional(),
          trainingType: z.enum(["basic-obedience", "advanced-tricks", "agility"]),
        })
      )
      .mutation(async ({ input }) => {
        const petProfile: PetProfile = {
          name: input.petName,
          species: input.species,
          breed: input.breed,
          age: input.ageMonths,
          weight: input.weight,
          medicalHistory: input.medicalHistory,
          allergies: input.allergies,
        };

        return customizeTrainingPlan(petProfile, input.trainingType);
      }),

    nutritionPlan: protectedProcedure
      .input(
        z.object({
          petName: z.string(),
          species: z.enum(["dog", "cat"]),
          breed: z.string().optional(),
          ageMonths: z.number(),
          weight: z.number().optional(),
          medicalHistory: z.string().optional(),
          allergies: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const petProfile: PetProfile = {
          name: input.petName,
          species: input.species,
          breed: input.breed,
          age: input.ageMonths,
          weight: input.weight,
          medicalHistory: input.medicalHistory,
          allergies: input.allergies,
        };

        return customizeNutritionPlan(petProfile);
      }),
  }),
});
