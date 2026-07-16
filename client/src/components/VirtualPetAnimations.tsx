/**
 * Virtual Pet Animations System
 * Advanced sprite animations with emotional states and interactions
 */

import React, { useState, useEffect } from "react";

export type PetMood = "happy" | "sad" | "tired" | "playful" | "hungry" | "sick" | "neutral";
export type PetAnimation = "idle" | "play" | "eat" | "sleep" | "jump" | "spin" | "wag";

interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

interface AnimationSequence {
  frames: AnimationFrame[];
  loop: boolean;
  speed: number;
}

const ANIMATION_SEQUENCES: Record<PetAnimation, AnimationSequence> = {
  idle: {
    frames: [
      { x: 0, y: 0, width: 100, height: 100, duration: 300 },
      { x: 100, y: 0, width: 100, height: 100, duration: 300 },
      { x: 200, y: 0, width: 100, height: 100, duration: 300 },
      { x: 100, y: 0, width: 100, height: 100, duration: 300 },
    ],
    loop: true,
    speed: 1,
  },
  play: {
    frames: [
      { x: 0, y: 100, width: 100, height: 100, duration: 150 },
      { x: 100, y: 100, width: 100, height: 100, duration: 150 },
      { x: 200, y: 100, width: 100, height: 100, duration: 150 },
      { x: 300, y: 100, width: 100, height: 100, duration: 150 },
    ],
    loop: true,
    speed: 1.5,
  },
  eat: {
    frames: [
      { x: 0, y: 200, width: 100, height: 100, duration: 200 },
      { x: 100, y: 200, width: 100, height: 100, duration: 200 },
      { x: 200, y: 200, width: 100, height: 100, duration: 200 },
    ],
    loop: true,
    speed: 1,
  },
  sleep: {
    frames: [
      { x: 0, y: 300, width: 100, height: 100, duration: 400 },
      { x: 100, y: 300, width: 100, height: 100, duration: 400 },
    ],
    loop: true,
    speed: 0.5,
  },
  jump: {
    frames: [
      { x: 0, y: 400, width: 100, height: 100, duration: 100 },
      { x: 100, y: 400, width: 100, height: 100, duration: 100 },
      { x: 200, y: 400, width: 100, height: 100, duration: 100 },
      { x: 100, y: 400, width: 100, height: 100, duration: 100 },
      { x: 0, y: 400, width: 100, height: 100, duration: 100 },
    ],
    loop: false,
    speed: 1,
  },
  spin: {
    frames: [
      { x: 0, y: 500, width: 100, height: 100, duration: 100 },
      { x: 100, y: 500, width: 100, height: 100, duration: 100 },
      { x: 200, y: 500, width: 100, height: 100, duration: 100 },
      { x: 300, y: 500, width: 100, height: 100, duration: 100 },
    ],
    loop: false,
    speed: 1,
  },
  wag: {
    frames: [
      { x: 0, y: 600, width: 100, height: 100, duration: 150 },
      { x: 100, y: 600, width: 100, height: 100, duration: 150 },
      { x: 200, y: 600, width: 100, height: 100, duration: 150 },
      { x: 100, y: 600, width: 100, height: 100, duration: 150 },
    ],
    loop: true,
    speed: 1.2,
  },
};

const MOOD_COLORS: Record<PetMood, string> = {
  happy: "from-yellow-400 to-orange-400",
  sad: "from-blue-400 to-indigo-400",
  tired: "from-gray-400 to-gray-500",
  playful: "from-pink-400 to-red-400",
  hungry: "from-orange-500 to-yellow-500",
  sick: "from-green-400 to-teal-400",
  neutral: "from-purple-400 to-blue-400",
};

const MOOD_EMOJIS: Record<PetMood, string> = {
  happy: "😊",
  sad: "😢",
  tired: "😴",
  playful: "🎉",
  hungry: "🍖",
  sick: "🤒",
  neutral: "🐾",
};

interface VirtualPetAnimationsProps {
  mood: PetMood;
  currentAnimation: PetAnimation;
  onAnimationComplete?: () => void;
  scale?: number;
  interactive?: boolean;
}

export const VirtualPetAnimations: React.FC<VirtualPetAnimationsProps> = ({
  mood,
  currentAnimation,
  onAnimationComplete,
  scale = 1,
  interactive = true,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; emoji: string }>>([]);

  const sequence = ANIMATION_SEQUENCES[currentAnimation];
  const currentFrame = sequence.frames[frameIndex];

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      setFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= sequence.frames.length) {
          if (sequence.loop) {
            return 0;
          } else {
            setIsAnimating(false);
            onAnimationComplete?.();
            return prev;
          }
        }
        return next;
      });
    }, currentFrame.duration / sequence.speed);

    return () => clearTimeout(timer);
  }, [frameIndex, isAnimating, sequence, currentFrame.duration, onAnimationComplete]);

  // Generate particles for mood effects
  const generateParticles = () => {
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      emoji: MOOD_EMOJIS[mood],
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.slice(5));
    }, 1000);
  };

  useEffect(() => {
    if (interactive && Math.random() > 0.7) {
      generateParticles();
    }
  }, [frameIndex, interactive, mood]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pet Animation Canvas */}
      <div
        className={`relative w-32 h-32 bg-gradient-to-br ${MOOD_COLORS[mood]} rounded-full shadow-2xl flex items-center justify-center transform transition-transform duration-300`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* Sprite Animation */}
        <div className="relative w-24 h-24 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
          <div
            className="absolute transition-all duration-100"
            style={{
              backgroundPosition: `-${currentFrame.x}px -${currentFrame.y}px`,
              width: `${currentFrame.width}px`,
              height: `${currentFrame.height}px`,
              backgroundSize: "800px 700px",
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 700"><circle cx="50" cy="50" r="40" fill="%23FFD700"/></svg>')`,
            }}
          />
        </div>

        {/* Mood Indicator */}
        <div className="absolute top-2 right-2 text-2xl animate-bounce">{MOOD_EMOJIS[mood]}</div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl animate-ping"
            style={{
              left: `calc(50% + ${particle.x}px)`,
              top: `calc(50% + ${particle.y}px)`,
              animation: "float-up 1s ease-out forwards",
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Floating Text */}
      <div className="absolute -top-12 text-center">
        <div className="text-sm font-semibold text-gray-700 capitalize">{mood}</div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default VirtualPetAnimations;
