import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

/**
 * Knowledge Base Router
 * Provides comprehensive information on supplements, vaccines, nutrition, and medications
 * for cats and dogs
 */

export const knowledgeBaseRouter = router({
  // ============ VACCINATION PROTOCOLS ============
  vaccinations: router({
    getSchedule: publicProcedure
      .input(
        z.object({
          species: z.enum(["cat", "dog"]),
          age: z.number().optional(), // in weeks
        })
      )
      .query(async ({ input }) => {
        const vaccinationSchedules: Record<string, any> = {
          cat: {
            title: "Feline Vaccination Schedule",
            schedule: [
              {
                age: "6-8 weeks",
                vaccines: ["FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)"],
                notes: "First dose of core vaccines",
              },
              {
                age: "10-12 weeks",
                vaccines: ["FVRCP (2nd dose)", "FeLV (Feline Leukemia) - optional"],
                notes: "Booster for core vaccines",
              },
              {
                age: "14-16 weeks",
                vaccines: ["FVRCP (3rd dose)", "FeLV (2nd dose) - if given"],
                notes: "Final kitten series",
              },
              {
                age: "1 year",
                vaccines: ["FVRCP booster", "FeLV booster - if given"],
                notes: "Annual booster after kitten series",
              },
              {
                age: "Every 1-3 years",
                vaccines: ["FVRCP", "FeLV - if at risk"],
                notes: "Maintenance boosters (frequency depends on vaccine type)",
              },
            ],
            coreVaccines: ["FVRCP"],
            nonCoreVaccines: ["FeLV (Feline Leukemia)", "FIV (Feline Immunodeficiency Virus)"],
            considerations: [
              "Indoor cats may not need FeLV vaccine",
              "FIV vaccine availability varies by region",
              "Rabies vaccination may be required by law in some areas",
              "Discuss lifestyle with veterinarian to determine appropriate vaccines",
            ],
          },
          dog: {
            title: "Canine Vaccination Schedule",
            schedule: [
              {
                age: "6-8 weeks",
                vaccines: ["DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)"],
                notes: "First dose of core vaccines",
              },
              {
                age: "10-12 weeks",
                vaccines: ["DHPP (2nd dose)"],
                notes: "Booster for core vaccines",
              },
              {
                age: "14-16 weeks",
                vaccines: ["DHPP (3rd dose)", "Rabies"],
                notes: "Final puppy series and rabies vaccination",
              },
              {
                age: "1 year",
                vaccines: ["DHPP booster", "Rabies booster"],
                notes: "Annual booster after puppy series",
              },
              {
                age: "Every 1-3 years",
                vaccines: ["DHPP", "Rabies"],
                notes: "Maintenance boosters (frequency depends on vaccine type)",
              },
            ],
            coreVaccines: ["DHPP", "Rabies"],
            nonCoreVaccines: ["Leptospirosis", "Bordetella (Kennel Cough)", "Lyme Disease"],
            considerations: [
              "Rabies vaccination is required by law in most jurisdictions",
              "Leptospirosis vaccine recommended for dogs with outdoor exposure",
              "Bordetella vaccine for dogs in boarding or group settings",
              "Lyme disease vaccine for dogs in endemic areas",
              "Discuss lifestyle and risk factors with veterinarian",
            ],
          },
        };

        return vaccinationSchedules[input.species] || { error: "Species not found" };
      }),

    getVaccineInfo: publicProcedure
      .input(
        z.object({
          vaccineName: z.string(),
          species: z.enum(["cat", "dog"]),
        })
      )
      .query(async ({ input }) => {
        const vaccineDatabase: Record<string, Record<string, any>> = {
          cat: {
            FVRCP: {
              name: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia",
              type: "Core vaccine",
              protectsAgainst: [
                "Feline Viral Rhinotracheitis (FVR)",
                "Feline Calicivirus (FCV)",
                "Feline Panleukopenia (FPV)",
              ],
              sideEffects: [
                "Mild fever",
                "Lethargy",
                "Decreased appetite",
                "Local swelling at injection site",
              ],
              seriousSideEffects: ["Allergic reactions (rare)", "Vaccine-associated sarcoma (very rare)"],
              duration: "1-3 years depending on vaccine type",
              notes: "Most important vaccine for all cats",
            },
            FeLV: {
              name: "Feline Leukemia Virus",
              type: "Non-core vaccine",
              protectsAgainst: ["Feline Leukemia Virus"],
              sideEffects: ["Mild fever", "Lethargy", "Swelling at injection site"],
              seriousSideEffects: ["Allergic reactions (rare)", "Vaccine-associated sarcoma (rare)"],
              duration: "1 year",
              recommendations: [
                "Recommended for outdoor cats",
                "Recommended for indoor cats with outdoor access",
                "Not recommended for strictly indoor cats without risk",
              ],
              notes: "Test for FeLV before vaccination",
            },
          },
          dog: {
            DHPP: {
              name: "Distemper, Hepatitis, Parvo, Parainfluenza",
              type: "Core vaccine",
              protectsAgainst: [
                "Canine Distemper",
                "Canine Hepatitis",
                "Canine Parvovirus",
                "Canine Parainfluenza",
              ],
              sideEffects: [
                "Mild fever",
                "Lethargy",
                "Decreased appetite",
                "Swelling at injection site",
              ],
              seriousSideEffects: ["Allergic reactions (rare)", "Autoimmune reactions (very rare)"],
              duration: "1-3 years depending on vaccine type",
              notes: "Essential vaccine for all dogs",
            },
            Rabies: {
              name: "Rabies",
              type: "Core vaccine",
              protectsAgainst: ["Rabies virus"],
              sideEffects: ["Mild fever", "Lethargy", "Swelling at injection site"],
              seriousSideEffects: ["Allergic reactions (rare)"],
              duration: "1-3 years depending on vaccine type",
              legal: "Required by law in most jurisdictions",
              notes: "Critical for public health and pet safety",
            },
          },
        };

        return vaccineDatabase[input.species]?.[input.vaccineName] || {
          error: "Vaccine information not found",
        };
      }),
  }),

  // ============ DIETARY SUPPLEMENTS & NUTRACEUTICALS ============
  supplements: router({
    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          species: z.enum(["cat", "dog"]).optional(),
          condition: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const supplementDatabase: Record<string, any> = {
          "omega-3": {
            name: "Omega-3 Fatty Acids",
            type: "Supplement",
            sources: ["Fish oil", "Flaxseed", "Algae-based"],
            benefits: [
              "Supports skin and coat health",
              "Reduces inflammation",
              "Supports joint health",
              "Supports cognitive function",
              "May help with allergies",
            ],
            dosage: {
              cat: "250-500 mg EPA+DHA daily",
              dog: "500-1000 mg EPA+DHA daily (varies by weight)",
            },
            sideEffects: ["Mild GI upset", "Fish odor on breath"],
            interactions: ["May increase bleeding risk with anticoagulants"],
            quality: "Look for products with AAFCO certification",
            notes: "Choose products tested for mercury and contaminants",
          },
          glucosamine: {
            name: "Glucosamine",
            type: "Joint Support Supplement",
            sources: ["Shellfish", "Synthetic"],
            benefits: [
              "Supports joint cartilage",
              "May reduce joint pain",
              "Supports mobility in senior pets",
              "May slow arthritis progression",
            ],
            dosage: {
              cat: "250 mg daily",
              dog: "500-2000 mg daily (depends on weight)",
            },
            sideEffects: ["Mild GI upset", "Allergic reactions (shellfish source)"],
            interactions: ["Generally safe with other supplements"],
            effectiveness: "Evidence is mixed; some pets respond well",
            notes: "Often combined with chondroitin for better results",
          },
          probiotics: {
            name: "Probiotics",
            type: "Digestive Health Supplement",
            sources: ["Fermented foods", "Supplements"],
            benefits: [
              "Supports digestive health",
              "May improve immune function",
              "May help with diarrhea",
              "Supports nutrient absorption",
            ],
            dosage: {
              cat: "1-5 billion CFU daily",
              dog: "5-10 billion CFU daily",
            },
            sideEffects: ["Temporary gas or bloating", "Mild diarrhea"],
            interactions: ["Should not be given with antibiotics simultaneously"],
            quality: "Choose products with multiple strains and high CFU count",
            notes: "Refrigerate after opening to maintain potency",
          },
          turmeric: {
            name: "Turmeric (Curcumin)",
            type: "Anti-inflammatory Supplement",
            sources: ["Turmeric root", "Standardized extract"],
            benefits: [
              "Anti-inflammatory properties",
              "May support joint health",
              "Antioxidant properties",
              "May support cognitive function",
            ],
            dosage: {
              cat: "50-100 mg daily",
              dog: "100-500 mg daily (depends on weight)",
            },
            sideEffects: ["Mild GI upset", "Staining of teeth/gums (yellow)"],
            interactions: ["May interact with blood thinners", "May affect iron absorption"],
            warnings: ["Not recommended for pregnant pets", "Use with caution in pets with liver disease"],
            notes: "Absorption improved when combined with black pepper (piperine)",
          },
        };

        const results = Object.values(supplementDatabase).filter(
          (s: any) =>
            s.name.toLowerCase().includes(input.query.toLowerCase()) ||
            s.benefits.some((b: string) => b.toLowerCase().includes(input.query.toLowerCase()))
        );

        return {
          query: input.query,
          results,
          totalFound: results.length,
        };
      }),

    getByCondition: publicProcedure
      .input(
        z.object({
          condition: z.string(),
          species: z.enum(["cat", "dog"]),
        })
      )
      .query(async ({ input }) => {
        const conditionSupplements: Record<string, Record<string, any[]>> = {
          arthritis: {
            cat: [
              { name: "Glucosamine", dosage: "250 mg daily" },
              { name: "Omega-3 Fatty Acids", dosage: "250-500 mg daily" },
              { name: "Turmeric", dosage: "50-100 mg daily" },
            ],
            dog: [
              { name: "Glucosamine", dosage: "500-2000 mg daily" },
              { name: "Chondroitin", dosage: "500-2000 mg daily" },
              { name: "Omega-3 Fatty Acids", dosage: "500-1000 mg daily" },
              { name: "Turmeric", dosage: "100-500 mg daily" },
            ],
          },
          "skin allergies": {
            cat: [
              { name: "Omega-3 Fatty Acids", dosage: "250-500 mg daily" },
              { name: "Probiotics", dosage: "1-5 billion CFU daily" },
            ],
            dog: [
              { name: "Omega-3 Fatty Acids", dosage: "500-1000 mg daily" },
              { name: "Probiotics", dosage: "5-10 billion CFU daily" },
              { name: "Quercetin", dosage: "varies" },
            ],
          },
          "digestive issues": {
            cat: [
              { name: "Probiotics", dosage: "1-5 billion CFU daily" },
              { name: "Digestive Enzymes", dosage: "varies" },
            ],
            dog: [
              { name: "Probiotics", dosage: "5-10 billion CFU daily" },
              { name: "Digestive Enzymes", dosage: "varies" },
              { name: "Slippery Elm", dosage: "1-2 grams daily" },
            ],
          },
        };

        return (
          conditionSupplements[input.condition.toLowerCase()]?.[input.species] || {
            message: "No supplements found for this condition",
          }
        );
      }),
  }),

  // ============ NUTRITION & PET FOOD ============
  nutrition: router({
    getFoodRecommendations: publicProcedure
      .input(
        z.object({
          species: z.enum(["cat", "dog"]),
          age: z.enum(["kitten/puppy", "adult", "senior"]),
          condition: z.string().optional(),
          dietaryRestrictions: z.array(z.string()).optional(),
        })
      )
      .query(async ({ input }) => {
        const nutritionGuidelines: Record<string, Record<string, any>> = {
          cat: {
            "kitten/puppy": {
              title: "Kitten Nutrition (0-12 months)",
              requirements: {
                protein: "30-40% (higher than adults)",
                fat: "9-15%",
                calcium: "0.8-1.6%",
                phosphorus: "0.6-0.9%",
                calories: "Higher than adults - growing",
              },
              recommendations: [
                "Feed 3-4 times daily until 6 months, then 2 times daily",
                "Choose kitten-specific formulas",
                "Ensure adequate taurine (essential amino acid)",
                "High-quality protein sources",
              ],
              avoidFoods: ["Onions", "Garlic", "Chocolate", "Grapes", "Xylitol"],
            },
            adult: {
              title: "Adult Cat Nutrition (1-7 years)",
              requirements: {
                protein: "26-30%",
                fat: "9-15%",
                calories: "Maintenance level",
              },
              recommendations: [
                "Feed 1-2 times daily",
                "Maintain healthy weight",
                "Ensure adequate hydration",
                "Quality protein sources",
              ],
              avoidFoods: ["Onions", "Garlic", "Chocolate", "Grapes", "Xylitol"],
            },
            senior: {
              title: "Senior Cat Nutrition (7+ years)",
              requirements: {
                protein: "26-30% (maintain muscle)",
                fat: "9-15%",
                calories: "May need fewer calories",
              },
              recommendations: [
                "Monitor weight closely",
                "Easier-to-digest proteins",
                "Increased fiber may help",
                "Consider joint support supplements",
                "Regular veterinary check-ups",
              ],
              avoidFoods: ["Onions", "Garlic", "Chocolate", "Grapes", "Xylitol"],
            },
          },
          dog: {
            "kitten/puppy": {
              title: "Puppy Nutrition (0-12 months)",
              requirements: {
                protein: "22-32% (higher than adults)",
                fat: "8-15%",
                calcium: "0.8-1.8%",
                phosphorus: "0.6-1.6%",
                calories: "Higher than adults - growing",
              },
              recommendations: [
                "Feed 3-4 times daily until 6 months, then 2 times daily",
                "Choose puppy-specific formulas",
                "Proper calcium-phosphorus ratio for bone development",
                "High-quality protein sources",
              ],
              avoidFoods: [
                "Chocolate",
                "Grapes",
                "Raisins",
                "Onions",
                "Garlic",
                "Xylitol",
                "Macadamia nuts",
              ],
            },
            adult: {
              title: "Adult Dog Nutrition (1-7 years)",
              requirements: {
                protein: "18-25%",
                fat: "5-15%",
                calories: "Maintenance level",
              },
              recommendations: [
                "Feed 1-2 times daily",
                "Maintain healthy weight",
                "Balanced nutrition",
                "Quality protein sources",
              ],
              avoidFoods: [
                "Chocolate",
                "Grapes",
                "Raisins",
                "Onions",
                "Garlic",
                "Xylitol",
                "Macadamia nuts",
              ],
            },
            senior: {
              title: "Senior Dog Nutrition (7+ years)",
              requirements: {
                protein: "18-25% (maintain muscle)",
                fat: "5-15%",
                calories: "May need fewer calories",
              },
              recommendations: [
                "Monitor weight closely",
                "Joint support supplements",
                "Easier-to-digest proteins",
                "Increased fiber may help",
                "Regular veterinary check-ups",
              ],
              avoidFoods: [
                "Chocolate",
                "Grapes",
                "Raisins",
                "Onions",
                "Garlic",
                "Xylitol",
                "Macadamia nuts",
              ],
            },
          },
        };

        return nutritionGuidelines[input.species]?.[input.age] || {
          error: "Nutrition guidelines not found",
        };
      }),

    getTopBrands: publicProcedure
      .input(
        z.object({
          species: z.enum(["cat", "dog"]),
          quality: z.enum(["premium", "standard", "budget"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const petFoodBrands: Record<string, Record<string, any[]>> = {
          cat: {
            premium: [
              {
                name: "Royal Canin",
                type: "Prescription & Premium",
                specialties: ["Breed-specific", "Condition-specific", "Prescription diets"],
              },
              {
                name: "Hill's Science Diet",
                type: "Premium",
                specialties: ["Therapeutic diets", "Weight management", "Digestive care"],
              },
              {
                name: "Purina Pro Plan",
                type: "Premium",
                specialties: ["Veterinary formulas", "Specialized nutrition"],
              },
              {
                name: "Orijen",
                type: "Premium",
                specialties: ["High protein", "Grain-free"],
              },
            ],
            standard: [
              {
                name: "Iams",
                type: "Standard",
                specialties: ["Balanced nutrition", "Various life stages"],
              },
              {
                name: "Purina Pro Plan Focus",
                type: "Standard",
                specialties: ["Affordable premium", "Multiple formulas"],
              },
            ],
            budget: [
              {
                name: "Friskies",
                type: "Budget",
                specialties: ["Affordable", "Variety of flavors"],
              },
              {
                name: "Fancy Feast",
                type: "Budget",
                specialties: ["Wet food", "Variety"],
              },
            ],
          },
          dog: {
            premium: [
              {
                name: "Royal Canin",
                type: "Prescription & Premium",
                specialties: ["Breed-specific", "Condition-specific", "Prescription diets"],
              },
              {
                name: "Hill's Science Diet",
                type: "Premium",
                specialties: ["Therapeutic diets", "Weight management"],
              },
              {
                name: "Purina Pro Plan",
                type: "Premium",
                specialties: ["Veterinary formulas", "Specialized nutrition"],
              },
              {
                name: "Orijen",
                type: "Premium",
                specialties: ["High protein", "Grain-free"],
              },
            ],
            standard: [
              {
                name: "Iams",
                type: "Standard",
                specialties: ["Balanced nutrition", "Various life stages"],
              },
              {
                name: "Purina ONE",
                type: "Standard",
                specialties: ["Natural ingredients", "Multiple formulas"],
              },
            ],
            budget: [
              {
                name: "Pedigree",
                type: "Budget",
                specialties: ["Affordable", "Widely available"],
              },
              {
                name: "Purina Dog Chow",
                type: "Budget",
                specialties: ["Budget-friendly", "Various formulas"],
              },
            ],
          },
        };

        const quality = input.quality || "premium";
        return petFoodBrands[input.species]?.[quality] || [];
      }),
  }),

  // ============ MEDICATIONS & PRESCRIPTIONS ============
  medications: router({
    search: publicProcedure
      .input(
        z.object({
          medicationName: z.string(),
          species: z.enum(["cat", "dog"]),
        })
      )
      .query(async ({ input }) => {
        const medicationDatabase: Record<string, Record<string, any>> = {
          cat: {
            amoxicillin: {
              name: "Amoxicillin",
              type: "Antibiotic (Penicillin-based)",
              usedFor: ["Bacterial infections", "Respiratory infections", "Skin infections"],
              dosage: "11-22 mg/kg every 8-12 hours",
              sideEffects: ["Vomiting", "Diarrhea", "Loss of appetite"],
              seriousSideEffects: ["Allergic reactions", "Severe diarrhea"],
              interactions: ["May reduce effectiveness of oral contraceptives"],
              contraindications: ["Penicillin allergy"],
              notes: "Complete full course even if symptoms improve",
            },
            doxycycline: {
              name: "Doxycycline",
              type: "Antibiotic (Tetracycline-based)",
              usedFor: ["Respiratory infections", "Urinary tract infections", "Tick-borne diseases"],
              dosage: "5-10 mg/kg once daily",
              sideEffects: ["Nausea", "Vomiting", "Esophageal irritation"],
              seriousSideEffects: ["Photosensitivity", "Allergic reactions"],
              interactions: ["Avoid with dairy products", "Avoid with antacids"],
              contraindications: ["Pregnancy", "Severe liver disease"],
              notes: "Give with food to reduce GI upset",
            },
            fluconazole: {
              name: "Fluconazole",
              type: "Antifungal",
              usedFor: ["Fungal infections", "Cryptococcosis", "Candidiasis"],
              dosage: "5-10 mg/kg once daily",
              sideEffects: ["Nausea", "Vomiting", "Anorexia"],
              seriousSideEffects: ["Liver toxicity", "Hepatitis"],
              interactions: ["May interact with other medications"],
              monitoring: "Monitor liver enzymes during treatment",
              notes: "May take several weeks for effect",
            },
          },
          dog: {
            amoxicillin: {
              name: "Amoxicillin",
              type: "Antibiotic (Penicillin-based)",
              usedFor: ["Bacterial infections", "Respiratory infections", "Skin infections"],
              dosage: "11-22 mg/kg every 8-12 hours",
              sideEffects: ["Vomiting", "Diarrhea", "Loss of appetite"],
              seriousSideEffects: ["Allergic reactions", "Severe diarrhea"],
              interactions: ["May reduce effectiveness of oral contraceptives"],
              contraindications: ["Penicillin allergy"],
              notes: "Complete full course even if symptoms improve",
            },
            carprofen: {
              name: "Carprofen (Rimadyl)",
              type: "NSAID (Pain & Inflammation)",
              usedFor: ["Arthritis", "Post-surgical pain", "Chronic pain"],
              dosage: "2 mg/kg twice daily or 4 mg/kg once daily",
              sideEffects: ["Vomiting", "Diarrhea", "Decreased appetite"],
              seriousSideEffects: ["GI ulceration", "Liver toxicity", "Kidney damage"],
              interactions: ["Avoid with other NSAIDs", "Use caution with corticosteroids"],
              monitoring: "Monitor liver and kidney function",
              notes: "Give with food to reduce GI upset",
            },
            metronidazole: {
              name: "Metronidazole",
              type: "Antibiotic/Antiprotozoal",
              usedFor: ["Diarrhea", "Giardiasis", "Anaerobic infections"],
              dosage: "10-25 mg/kg twice daily",
              sideEffects: ["Nausea", "Vomiting", "Metallic taste"],
              seriousSideEffects: ["Neurological effects", "Hepatotoxicity"],
              interactions: ["Avoid with alcohol"],
              monitoring: "Monitor for neurological signs",
              notes: "Bitter taste - may need pill pockets or coating",
            },
          },
        };

        return (
          medicationDatabase[input.species]?.[input.medicationName.toLowerCase()] || {
            error: "Medication information not found",
          }
        );
      }),

    getPrescriptionProtocol: publicProcedure
      .input(
        z.object({
          condition: z.string(),
          species: z.enum(["cat", "dog"]),
        })
      )
      .query(async ({ input }) => {
        const prescriptionProtocols: Record<string, Record<string, any>> = {
          cat: {
            "urinary tract infection": {
              condition: "Feline Urinary Tract Infection",
              firstLine: ["Amoxicillin", "Doxycycline"],
              alternatives: ["Fluoroquinolones", "Cephalosporins"],
              duration: "7-14 days",
              followUp: "Urinalysis after treatment",
              supportiveCare: ["Increased water intake", "Dietary modification"],
            },
            "respiratory infection": {
              condition: "Feline Respiratory Infection",
              firstLine: ["Doxycycline", "Amoxicillin"],
              alternatives: ["Fluoroquinolones"],
              duration: "7-14 days",
              supportiveCare: ["Humidifier", "Supportive care", "Appetite stimulants if needed"],
            },
          },
          dog: {
            "ear infection": {
              condition: "Canine Otitis Externa",
              firstLine: ["Topical antibiotics", "Antifungals", "Corticosteroids"],
              oral: ["Amoxicillin", "Fluoroquinolones"],
              duration: "7-14 days",
              supportiveCare: ["Ear cleaning", "Identify underlying cause"],
            },
            arthritis: {
              condition: "Canine Osteoarthritis",
              firstLine: ["Carprofen", "Meloxicam"],
              alternatives: ["Firocoxib", "Tramadol"],
              supplements: ["Glucosamine", "Chondroitin", "Omega-3"],
              duration: "Long-term management",
              supportiveCare: ["Weight management", "Exercise modification", "Physical therapy"],
            },
          },
        };

        return (
          prescriptionProtocols[input.species]?.[input.condition.toLowerCase()] || {
            message: "Prescription protocol not found - consult veterinarian",
          }
        );
      }),
  }),
});

export type KnowledgeBaseRouter = typeof knowledgeBaseRouter;
