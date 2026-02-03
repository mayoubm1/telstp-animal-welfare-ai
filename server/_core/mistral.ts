/**
 * Mistral AI Integration Module
 * Provides advanced language model capabilities for veterinary diagnosis and analysis
 */

import { ENV } from "./env";

export interface MistralMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DiagnosisRequest {
  species: "cat" | "dog";
  symptoms: string[];
  age?: number;
  weight?: number;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

export interface DiagnosisResult {
  primaryDiagnosis: string;
  differentialDiagnosis: string[];
  confidence: number;
  urgency: "critical" | "urgent" | "routine" | "minor";
  recommendations: string[];
  whenToSeeVet: string;
  homeCareTips?: string[];
}

/**
 * Call Mistral AI API for chat completions
 */
export async function invokeMistral(
  messages: MistralMessage[],
  model: string = "mistral-large-latest",
  temperature: number = 0.7,
  maxTokens: number = 1024
): Promise<MistralResponse> {
  if (!ENV.mistralApiKey) {
    throw new Error("MISTRAL_API_KEY is not configured");
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.mistralApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mistral API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as MistralResponse;
    return data;
  } catch (error) {
    console.error("[Mistral] API call failed:", error);
    throw error;
  }
}

/**
 * Generate veterinary diagnosis using Mistral AI
 */
export async function generateVeterinaryDiagnosis(
  request: DiagnosisRequest
): Promise<DiagnosisResult> {
  const speciesContext = request.species === "cat" ? "feline" : "canine";
  const ageContext = request.age ? ` (${request.age} years old)` : "";
  const weightContext = request.weight ? ` (${request.weight} kg)` : "";

  const systemPrompt = `You are an expert veterinary AI assistant specializing in ${speciesContext} medicine. 
You provide preliminary diagnostic assessments based on reported symptoms, but always emphasize that a licensed veterinarian should confirm any diagnosis.
Your responses should be evidence-based, referencing common conditions and their typical presentations.
Always prioritize animal welfare and safety in your recommendations.`;

  const symptomsText = request.symptoms.join(", ");
  const medicalHistoryContext = request.medicalHistory
    ? `\nMedical history: ${request.medicalHistory}`
    : "";
  const allergiesContext = request.allergies ? `\nKnown allergies: ${request.allergies}` : "";
  const medicationsContext = request.currentMedications
    ? `\nCurrent medications: ${request.currentMedications}`
    : "";

  const userPrompt = `Please analyze the following ${speciesContext} patient case and provide a diagnostic assessment:

Species: ${request.species}
Age: ${request.age || "Unknown"}${ageContext}
Weight: ${request.weight || "Unknown"}${weightContext}
Symptoms: ${symptomsText}${medicalHistoryContext}${allergiesContext}${medicationsContext}

Please provide your response in the following JSON format:
{
  "primaryDiagnosis": "Most likely diagnosis based on symptoms",
  "differentialDiagnosis": ["Alternative diagnosis 1", "Alternative diagnosis 2", "Alternative diagnosis 3"],
  "confidence": 0.0-1.0 (confidence level as decimal),
  "urgency": "critical|urgent|routine|minor",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "whenToSeeVet": "Clear guidance on timing for veterinary consultation",
  "homeCareTips": ["Tip 1", "Tip 2", "Tip 3"]
}

IMPORTANT: Always include a disclaimer that this is preliminary assessment and a licensed veterinarian must confirm any diagnosis.`;

  try {
    const response = await invokeMistral(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      "mistral-large-latest",
      0.5,
      1500
    );

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error("Empty response from Mistral API");
    }

    // Extract JSON from response (Mistral might include extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Mistral response");
    }

    const diagnosis = JSON.parse(jsonMatch[0]) as DiagnosisResult;

    // Validate response structure
    if (
      !diagnosis.primaryDiagnosis ||
      !diagnosis.urgency ||
      !diagnosis.recommendations
    ) {
      throw new Error("Invalid diagnosis response structure");
    }

    return diagnosis;
  } catch (error) {
    console.error("[Mistral] Diagnosis generation failed:", error);
    throw error;
  }
}

/**
 * Analyze case notes and extract structured information
 */
export async function analyzeCaseNotes(caseNotes: string): Promise<{
  symptoms: string[];
  severity: string;
  timeline: string;
  keyFindings: string[];
  suggestedTests: string[];
}> {
  const systemPrompt = `You are a veterinary medical records analyst. Extract and structure key information from case notes.`;

  const userPrompt = `Analyze these veterinary case notes and extract structured information:

${caseNotes}

Provide response in JSON format:
{
  "symptoms": ["symptom1", "symptom2"],
  "severity": "mild|moderate|severe",
  "timeline": "Description of symptom progression",
  "keyFindings": ["Finding 1", "Finding 2"],
  "suggestedTests": ["Test 1", "Test 2"]
}`;

  try {
    const response = await invokeMistral(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      "mistral-medium-latest",
      0.3,
      800
    );

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error("Empty response from Mistral API");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Mistral] Case analysis failed:", error);
    throw error;
  }
}

/**
 * Generate educational content about a condition
 */
export async function generateEducationalContent(
  condition: string,
  species: "cat" | "dog"
): Promise<{
  overview: string;
  symptoms: string[];
  causes: string[];
  transmission: string | null;
  treatment: string[];
  prevention: string[];
  whenToSeeVet: string;
}> {
  const systemPrompt = `You are a veterinary educator creating accurate, accessible educational content for pet owners.
Focus on evidence-based information while maintaining clarity for non-medical audiences.`;

  const userPrompt = `Create educational content about ${condition} in ${species}s:

{
  "overview": "Brief explanation of the condition",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": ["Cause 1", "Cause 2"],
  "transmission": "How it spreads (null if not applicable)",
  "treatment": ["Treatment option 1", "Treatment option 2"],
  "prevention": ["Prevention measure 1", "Prevention measure 2"],
  "whenToSeeVet": "Guidance on urgency"
}`;

  try {
    const response = await invokeMistral(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      "mistral-medium-latest",
      0.5,
      1000
    );

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error("Empty response from Mistral API");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Mistral] Educational content generation failed:", error);
    throw error;
  }
}

/**
 * Analyze medication interactions
 */
export async function analyzeMedicationInteractions(
  medications: string[]
): Promise<{
  interactions: Array<{
    drug1: string;
    drug2: string;
    severity: "mild" | "moderate" | "severe";
    description: string;
  }>;
  recommendations: string[];
}> {
  const systemPrompt = `You are a veterinary pharmacist expert in drug interactions.`;

  const medicationsList = medications.join(", ");
  const userPrompt = `Analyze potential interactions between these medications: ${medicationsList}

Provide JSON response:
{
  "interactions": [
    {
      "drug1": "Drug name",
      "drug2": "Drug name",
      "severity": "mild|moderate|severe",
      "description": "Description of interaction"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  try {
    const response = await invokeMistral(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      "mistral-medium-latest",
      0.3,
      800
    );

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error("Empty response from Mistral API");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Mistral] Medication interaction analysis failed:", error);
    throw error;
  }
}
