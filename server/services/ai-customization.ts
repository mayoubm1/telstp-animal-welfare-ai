import { invokeLLM } from "../_core/llm";
import { veterinaryKB } from "../knowledge-bases/veterinary-kb";

export interface PetProfile {
  name: string;
  species: "dog" | "cat";
  breed?: string;
  age: number;
  weight?: number;
  medicalHistory?: string;
  allergies?: string[];
  currentMedications?: string[];
}

export interface CustomizedTrainingPlan {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  recommendedProducts: string[];
  customTips: Array<{
    tipAr: string;
    tipEn: string;
  }>;
  precautions: Array<{
    precautionAr: string;
    precautionEn: string;
  }>;
  estimatedDuration: number;
}

export async function customizeTrainingPlan(
  petProfile: PetProfile,
  trainingType: "basic-obedience" | "advanced-tricks" | "agility"
): Promise<CustomizedTrainingPlan> {
  const trainingData = veterinaryKB.training[
    trainingType === "basic-obedience"
      ? "basicObedience"
      : trainingType === "advanced-tricks"
        ? "advancedTricks"
        : "agility"
  ];

  const prompt = `
You are a veterinary training expert. Customize this training plan for a specific pet:

Pet Profile:
- Name: ${petProfile.name}
- Species: ${petProfile.species}
- Breed: ${petProfile.breed || "Unknown"}
- Age: ${petProfile.age} months
- Weight: ${petProfile.weight || "Unknown"} kg
- Medical History: ${petProfile.medicalHistory || "None"}
- Allergies: ${petProfile.allergies?.join(", ") || "None"}
- Current Medications: ${petProfile.currentMedications?.join(", ") || "None"}

Training Type: ${trainingType}
Base Duration: ${trainingData.durationWeeks} weeks
Frequency: ${trainingData.frequencyPerWeek} times per week

Please provide:
1. Customized training tips specific to this pet's age, breed, and health status
2. Any precautions or modifications needed
3. Estimated adjusted duration based on the pet's profile
4. Recommended products to support this training

Format your response as JSON with the following structure:
{
  "customTips": [
    { "tipEn": "...", "tipAr": "..." }
  ],
  "precautions": [
    { "precautionEn": "...", "precautionAr": "..." }
  ],
  "estimatedDurationWeeks": number,
  "recommendedProducts": ["product-handle-1", "product-handle-2"]
}
`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a veterinary training expert. Provide customized training recommendations in JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "customized_training_plan",
        strict: true,
        schema: {
          type: "object",
          properties: {
            customTips: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tipEn: { type: "string" },
                  tipAr: { type: "string" },
                },
                required: ["tipEn", "tipAr"],
              },
            },
            precautions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  precautionEn: { type: "string" },
                  precautionAr: { type: "string" },
                },
                required: ["precautionEn", "precautionAr"],
              },
            },
            estimatedDurationWeeks: { type: "number" },
            recommendedProducts: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "customTips",
            "precautions",
            "estimatedDurationWeeks",
            "recommendedProducts",
          ],
        },
      },
    },
  });

  const content =
    typeof response.choices?.[0]?.message?.content === "string"
      ? response.choices[0].message.content
      : JSON.stringify(response);

  const parsed = JSON.parse(content);

  return {
    titleAr: trainingData.titleAr,
    titleEn: trainingData.titleEn,
    descriptionAr: `تم تخصيص هذا البرنامج لـ ${petProfile.name}`,
    descriptionEn: `Customized for ${petProfile.name}`,
    recommendedProducts: parsed.recommendedProducts || [],
    customTips: parsed.customTips || [],
    precautions: parsed.precautions || [],
    estimatedDuration: parsed.estimatedDurationWeeks || trainingData.durationWeeks,
  };
}

export async function customizeNutritionPlan(
  petProfile: PetProfile
): Promise<{
  titleAr: string;
  titleEn: string;
  recommendations: Array<{
    nameAr: string;
    nameEn: string;
    recommendedValue: string;
    reasonAr: string;
    reasonEn: string;
  }>;
  recommendedProducts: string[];
}> {
  const ageGroup =
    petProfile.age < 12 ? "puppies" : petProfile.age > 84 ? "seniors" : "adults";
  const nutritionData = veterinaryKB.nutrition[ageGroup];

  const prompt = `
You are a veterinary nutritionist. Customize a nutrition plan for this pet:

Pet Profile:
- Name: ${petProfile.name}
- Species: ${petProfile.species}
- Breed: ${petProfile.breed || "Unknown"}
- Age: ${petProfile.age} months (${ageGroup})
- Weight: ${petProfile.weight || "Unknown"} kg
- Medical History: ${petProfile.medicalHistory || "None"}
- Allergies: ${petProfile.allergies?.join(", ") || "None"}

Base Recommendations for ${ageGroup}:
${JSON.stringify(nutritionData.recommendations, null, 2)}

Please provide specific nutrition recommendations considering this pet's profile.
Format as JSON with nutritional adjustments and reasons.
`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a veterinary nutritionist. Provide customized nutrition recommendations in JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // For MVP, return base recommendations
  return {
    titleAr: nutritionData.titleAr,
    titleEn: nutritionData.titleEn,
    recommendations: nutritionData.recommendations.map((rec: any) => ({
      nameAr: rec.nameAr,
      nameEn: rec.nameEn,
      recommendedValue: rec.minPercentage
        ? `${rec.minPercentage}%`
        : rec.ratio || "As recommended",
      reasonAr: rec.descriptionAr,
      reasonEn: rec.descriptionEn,
    })),
    recommendedProducts: nutritionData.products,
  };
}
