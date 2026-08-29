import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface VirtualPetCharacterProps {
  species: "dog" | "cat" | "rabbit";
  name: string;
  mood: string;
  energy: number;
  isInteracting?: boolean;
  onInteractionComplete?: () => void;
}

export const VirtualPetCharacter: React.FC<VirtualPetCharacterProps> = ({
  species,
  name,
  mood,
  energy,
  isInteracting = false,
  onInteractionComplete,
}) => {
  const [animation, setAnimation] = useState<string>("idle");

  useEffect(() => {
    if (isInteracting) {
      setAnimation("interact");
      const timer = setTimeout(() => {
        setAnimation("idle");
        onInteractionComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Determine animation based on mood and energy
    if (energy < 20) {
      setAnimation("tired");
    } else if (mood === "playful" || mood === "excited") {
      setAnimation("playful");
    } else if (mood === "happy") {
      setAnimation("happy");
    } else if (mood === "hungry") {
      setAnimation("hungry");
    } else {
      setAnimation("idle");
    }
  }, [mood, energy, isInteracting, onInteractionComplete]);

  const petEmojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐱",
    rabbit: "🐰",
  };

  const animations = {
    idle: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity },
    },
    playful: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    happy: {
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, repeat: Infinity },
    },
    tired: {
      y: [0, -5, 0],
      opacity: [1, 0.7, 1],
      transition: { duration: 4, repeat: Infinity },
    },
    hungry: {
      y: [0, -15, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    interact: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.6 },
    },
  };

  const moodEmojis: Record<string, string> = {
    happy: "😊",
    playful: "🤩",
    tired: "😴",
    hungry: "😋",
    sad: "😢",
    excited: "🤗",
    calm: "😌",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Pet Character */}
      <motion.div
        className="text-9xl cursor-pointer"
        animate={animations[animation as keyof typeof animations] || animations.idle}
        whileHover={{ scale: 1.1 }}
      >
        {petEmojis[species]}
      </motion.div>

      {/* Pet Name */}
      <h2 className="text-2xl font-bold text-white">{name}</h2>

      {/* Mood Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-3xl">{moodEmojis[mood] || "😐"}</span>
        <span className="text-lg text-gray-300 capitalize">{mood}</span>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-xs space-y-2">
        {/* Energy */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>⚡ Energy</span>
            <span>{energy}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-yellow-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Pet Species Badge */}
      <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold text-white capitalize">
        {species}
      </div>
    </div>
  );
};
