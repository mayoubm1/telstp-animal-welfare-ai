import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface InteractionButtonProps {
  type: "play" | "feed" | "pet" | "talk" | "rest" | "exercise" | "train";
  label: string;
  labelAr: string;
  emoji: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  language?: "en" | "ar";
}

const InteractionButton: React.FC<InteractionButtonProps> = ({
  type,
  label,
  labelAr,
  emoji,
  onClick,
  isLoading = false,
  disabled = false,
  language = "en",
}) => {
  const displayLabel = language === "ar" ? labelAr : label;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200"
      >
        <span className="text-3xl">{emoji}</span>
        <span className="text-sm">{displayLabel}</span>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      </Button>
    </motion.div>
  );
};

interface VirtualPetInteractionsProps {
  onInteract: (type: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  language?: "en" | "ar";
}

export const VirtualPetInteractions: React.FC<VirtualPetInteractionsProps> = ({
  onInteract,
  isLoading = false,
  disabled = false,
  language = "en",
}) => {
  const interactions: InteractionButtonProps[] = [
    {
      type: "play",
      label: "Play",
      labelAr: "العب",
      emoji: "🎾",
      onClick: () => onInteract("play"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "feed",
      label: "Feed",
      labelAr: "أطعم",
      emoji: "🍖",
      onClick: () => onInteract("feed"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "pet",
      label: "Pet",
      labelAr: "امسح",
      emoji: "🤚",
      onClick: () => onInteract("pet"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "talk",
      label: "Talk",
      labelAr: "تحدث",
      emoji: "💬",
      onClick: () => onInteract("talk"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "rest",
      label: "Rest",
      labelAr: "استريح",
      emoji: "😴",
      onClick: () => onInteract("rest"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "exercise",
      label: "Exercise",
      labelAr: "تمرين",
      emoji: "🏃",
      onClick: () => onInteract("exercise"),
      isLoading,
      disabled,
      language,
    },
    {
      type: "train",
      label: "Train",
      labelAr: "درب",
      emoji: "🎓",
      onClick: () => onInteract("train"),
      isLoading,
      disabled,
      language,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white text-center">
        {language === "ar" ? "كيف تريد أن تتفاعل؟" : "How do you want to interact?"}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {interactions.map((interaction) => (
          <InteractionButton
            key={interaction.type}
            {...interaction}
          />
        ))}
      </div>
    </div>
  );
};
