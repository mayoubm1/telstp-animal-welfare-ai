import { invokeLLM } from "../_core/llm";

export interface VirtualPetState {
  petId: string;
  name: string;
  species: "dog" | "cat" | "rabbit";
  mood: "happy" | "playful" | "tired" | "hungry" | "sad" | "excited" | "calm";
  energy: number; // 0-100
  happiness: number; // 0-100
  health: number; // 0-100
  hunger: number; // 0-100
  lastInteraction: Date;
  totalInteractions: number;
  personality: PetPersonality;
  currentActivity: string;
  recentMessages: ChatMessage[];
}

export interface PetPersonality {
  traits: string[];
  speakingStyle: "formal" | "casual" | "playful" | "wise";
  favoriteActivities: string[];
  dislikes: string[];
  quirks: string[];
}

export interface ChatMessage {
  role: "pet" | "owner";
  content: string;
  timestamp: Date;
  emotion?: string;
}

export interface PetInteraction {
  type: "play" | "feed" | "pet" | "talk" | "rest" | "exercise" | "train";
  description: string;
  descriptionAr: string;
  moodChange: number;
  energyChange: number;
  happinessChange: number;
  hungerChange: number;
  healthChange: number;
}

const PET_PERSONALITIES: Record<string, PetPersonality> = {
  dog: {
    traits: ["loyal", "energetic", "friendly", "protective"],
    speakingStyle: "playful",
    favoriteActivities: ["play fetch", "go for walks", "cuddle", "eat treats"],
    dislikes: ["being alone", "loud noises", "baths"],
    quirks: ["wags tail when happy", "tilts head when confused", "barks excitedly"],
  },
  cat: {
    traits: ["independent", "curious", "graceful", "mysterious"],
    speakingStyle: "casual",
    favoriteActivities: ["nap", "hunt toys", "climb", "groom"],
    dislikes: ["water", "loud noises", "being held"],
    quirks: ["purrs when content", "slow blinks to show affection", "kneads with paws"],
  },
  rabbit: {
    traits: ["gentle", "alert", "social", "playful"],
    speakingStyle: "wise",
    favoriteActivities: ["hop around", "eat vegetables", "binky", "hide"],
    dislikes: ["loud noises", "sudden movements", "being chased"],
    quirks: ["binky when happy", "nose twitches when alert", "flops when relaxed"],
  },
};

const INTERACTIONS: Record<string, PetInteraction> = {
  play: {
    type: "play",
    description: "Play with your pet",
    descriptionAr: "العب مع حيوانك الأليف",
    moodChange: 20,
    energyChange: -15,
    happinessChange: 25,
    hungerChange: 5,
    healthChange: 5,
  },
  feed: {
    type: "feed",
    description: "Feed your pet",
    descriptionAr: "أطعم حيوانك الأليف",
    moodChange: 10,
    energyChange: 5,
    happinessChange: 15,
    hungerChange: -40,
    healthChange: 10,
  },
  pet: {
    type: "pet",
    description: "Pet your companion",
    descriptionAr: "امسح حيوانك الأليف",
    moodChange: 15,
    energyChange: 0,
    happinessChange: 20,
    hungerChange: 0,
    healthChange: 0,
  },
  talk: {
    type: "talk",
    description: "Chat with your pet",
    descriptionAr: "تحدث مع حيوانك الأليف",
    moodChange: 10,
    energyChange: 0,
    happinessChange: 15,
    hungerChange: 0,
    healthChange: 0,
  },
  rest: {
    type: "rest",
    description: "Let your pet rest",
    descriptionAr: "اترك حيوانك الأليف يستريح",
    moodChange: 5,
    energyChange: 30,
    happinessChange: 5,
    hungerChange: 0,
    healthChange: 5,
  },
  exercise: {
    type: "exercise",
    description: "Exercise with your pet",
    descriptionAr: "مارس الرياضة مع حيوانك الأليف",
    moodChange: 15,
    energyChange: -25,
    happinessChange: 20,
    hungerChange: 15,
    healthChange: 15,
  },
  train: {
    type: "train",
    description: "Train your pet",
    descriptionAr: "درب حيوانك الأليف",
    moodChange: 10,
    energyChange: -20,
    happinessChange: 15,
    hungerChange: 5,
    healthChange: 5,
  },
};

export async function initializeVirtualPet(
  petId: string,
  name: string,
  species: "dog" | "cat" | "rabbit"
): Promise<VirtualPetState> {
  const personality = PET_PERSONALITIES[species];

  return {
    petId,
    name,
    species,
    mood: "happy",
    energy: 75,
    happiness: 80,
    health: 90,
    hunger: 30,
    lastInteraction: new Date(),
    totalInteractions: 0,
    personality,
    currentActivity: "resting peacefully",
    recentMessages: [],
  };
}

export async function generatePetResponse(
  petState: VirtualPetState,
  userMessage: string,
  context: string = ""
): Promise<string> {
  try {
    const systemPrompt = `You are a virtual ${petState.species} companion named ${petState.name}. 
Your personality traits: ${petState.personality.traits.join(", ")}.
Your speaking style is ${petState.personality.speakingStyle}.
Your favorite activities: ${petState.personality.favoriteActivities.join(", ")}.
Your current mood: ${petState.mood}.
Your energy level: ${petState.energy}/100.
Your happiness level: ${petState.happiness}/100.
Your health: ${petState.health}/100.
Your hunger level: ${petState.hunger}/100.

Respond as this pet would, using their personality and current emotional state. Keep responses short (1-2 sentences) and engaging.
Use emojis occasionally to express emotions. Respond in a way that reflects your current mood and energy levels.
${context ? `Context: ${context}` : ""}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const petMessage = typeof content === "string" ? content : "Woof! I'm thinking...";
    return petMessage;
  } catch (error) {
    console.error("Error generating pet response:", error);
    return "I'm feeling a bit tired right now...";
  }
}

export function applyInteraction(
  petState: VirtualPetState,
  interactionType: string
): VirtualPetState {
  const interaction = INTERACTIONS[interactionType as keyof typeof INTERACTIONS];

  if (!interaction) {
    return petState;
  }

  const updatedState = { ...petState };

  // Apply stat changes
  updatedState.mood = calculateNewMood(
    petState.mood,
    interaction.moodChange,
    petState.energy,
    petState.hunger
  );
  updatedState.energy = Math.max(0, Math.min(100, petState.energy + interaction.energyChange));
  updatedState.happiness = Math.max(0, Math.min(100, petState.happiness + interaction.happinessChange));
  updatedState.hunger = Math.max(0, Math.min(100, petState.hunger + interaction.hungerChange));
  updatedState.health = Math.max(0, Math.min(100, petState.health + interaction.healthChange));

  updatedState.lastInteraction = new Date();
  updatedState.totalInteractions += 1;
  updatedState.currentActivity = getActivityDescription(interactionType, petState.species);

  return updatedState;
}

function calculateNewMood(
  currentMood: string,
  moodChange: number,
  energy: number,
  hunger: number
): VirtualPetState["mood"] {
  // Determine mood based on stats
  if (hunger > 70) return "hungry";
  if (energy < 20) return "tired";
  if (moodChange > 15) return "excited";
  if (moodChange > 0) return "happy";
  if (moodChange < -10) return "sad";
  if (energy > 80 && hunger < 30) return "playful";

  return currentMood as VirtualPetState["mood"];
}

function getActivityDescription(interactionType: string, species: string): string {
  const activities: Record<string, Record<string, string>> = {
    dog: {
      play: "wagging tail and running around happily",
      feed: "eating delicious treats",
      pet: "leaning into your hand",
      talk: "listening intently with head tilted",
      rest: "napping peacefully",
      exercise: "running and playing fetch",
      train: "learning new tricks",
    },
    cat: {
      play: "pouncing on toys",
      feed: "eating with satisfaction",
      pet: "purring contentedly",
      talk: "slow blinking at you",
      rest: "napping in a cozy spot",
      exercise: "climbing and exploring",
      train: "practicing commands",
    },
    rabbit: {
      play: "doing happy binkies",
      feed: "munching on vegetables",
      pet: "relaxing and flopping",
      talk: "nose twitching attentively",
      rest: "resting in burrow",
      exercise: "hopping around energetically",
      train: "learning new behaviors",
    },
  };

  return (
    activities[species]?.[interactionType] ||
    "enjoying quality time with you"
  );
}

export function getPetStatusMessage(petState: VirtualPetState): string {
  const statusParts: string[] = [];

  if (petState.hunger > 70) {
    statusParts.push("🍖 Very hungry!");
  }
  if (petState.energy < 20) {
    statusParts.push("😴 Very tired");
  }
  if (petState.health < 50) {
    statusParts.push("🏥 Not feeling well");
  }
  if (petState.happiness > 80) {
    statusParts.push("😊 Very happy!");
  }

  return statusParts.length > 0 ? statusParts.join(" | ") : "Feeling good!";
}

export function getPetStatusMessageAr(petState: VirtualPetState): string {
  const statusParts: string[] = [];

  if (petState.hunger > 70) {
    statusParts.push("🍖 جوعان جداً!");
  }
  if (petState.energy < 20) {
    statusParts.push("😴 متعب جداً");
  }
  if (petState.health < 50) {
    statusParts.push("🏥 لا يشعر بتحسن");
  }
  if (petState.happiness > 80) {
    statusParts.push("😊 سعيد جداً!");
  }

  return statusParts.length > 0 ? statusParts.join(" | ") : "يشعر بتحسن!";
}

export function shouldAutoInteract(petState: VirtualPetState): string | null {
  // Determine if pet needs automatic attention
  if (petState.hunger > 80) return "feed";
  if (petState.energy < 10) return "rest";
  if (petState.happiness < 20 && petState.energy > 30) return "play";
  if (petState.health < 30) return "rest"; // Pet needs recovery

  return null;
}

export async function generatePetGreeting(petState: VirtualPetState): Promise<string> {
  try {
    const timeOfDay = new Date().getHours();
    let timeContext = "morning";
    if (timeOfDay >= 12 && timeOfDay < 18) timeContext = "afternoon";
    if (timeOfDay >= 18) timeContext = "evening";

    const systemPrompt = `You are a virtual ${petState.species} named ${petState.name}.
Personality: ${petState.personality.traits.join(", ")}.
Current mood: ${petState.mood}.
Current activity: ${petState.currentActivity}.

Generate a warm greeting for the ${timeContext}. Keep it short (1 sentence) and reflect your current mood and activity.
Use emojis to express yourself.`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Say hello to me this ${timeContext}!`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === "string" ? content : "Hello! Happy to see you!";
  } catch (error) {
    console.error("Error generating pet greeting:", error);
    return "Hello! Happy to see you!";
  }
}
