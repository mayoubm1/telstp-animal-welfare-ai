import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface PetState {
  happiness: number;
  energy: number;
  health: number;
  hunger: number;
  lastFed: Date;
  lastPlayed: Date;
  lastTrained: Date;
  level: number;
  experience: number;
}

interface PetEmoji {
  happy: string;
  sad: string;
  tired: string;
  hungry: string;
  playing: string;
  training: string;
}

const petEmojis: Record<string, PetEmoji> = {
  dog: {
    happy: "🐕😊",
    sad: "🐕😢",
    tired: "🐕😴",
    hungry: "🐕🍖",
    playing: "🐕🎾",
    training: "🐕📚",
  },
  cat: {
    happy: "🐈😺",
    sad: "🐈😿",
    tired: "🐈😴",
    hungry: "🐈🍖",
    playing: "🐈🧶",
    training: "🐈📚",
  },
  rabbit: {
    happy: "🐰😊",
    sad: "🐰😢",
    tired: "🐰😴",
    hungry: "🐰🥕",
    playing: "🐰🎾",
    training: "🐰📚",
  },
};

export default function VirtualPetCompanion() {
  const [location, setLocation] = useLocation();
  const [petState, setPetState] = useState<PetState>({
    happiness: 80,
    energy: 70,
    health: 90,
    hunger: 30,
    lastFed: new Date(),
    lastPlayed: new Date(),
    lastTrained: new Date(),
    level: 1,
    experience: 0,
  });

  const [selectedPet, setSelectedPet] = useState<string>("dog");
  const [petAnimation, setPetAnimation] = useState<string>("happy");
  const [showAction, setShowAction] = useState<string | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const petsQuery = trpc.pets.list.useQuery();
  const updatePetMutation = trpc.pets.update.useMutation();

  // Simulate pet state decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 2),
        energy: Math.max(0, prev.energy - 1),
        happiness: Math.max(0, prev.happiness - 1),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Determine pet animation based on state
  useEffect(() => {
    if (petState.energy < 20) {
      setPetAnimation("tired");
    } else if (petState.hunger > 70) {
      setPetAnimation("hungry");
    } else if (petState.happiness < 30) {
      setPetAnimation("sad");
    } else {
      setPetAnimation("happy");
    }
  }, [petState.energy, petState.hunger, petState.happiness]);

  const handleAction = async (action: string) => {
    setShowAction(action);

    let newState = { ...petState };

    switch (action) {
      case "feed":
        newState.hunger = Math.max(0, newState.hunger - 30);
        newState.health = Math.min(100, newState.health + 5);
        newState.lastFed = new Date();
        setPetAnimation("happy");
        break;

      case "play":
        if (newState.energy < 30) {
          setShowAction("tired");
          setTimeout(() => setShowAction(null), 2000);
          return;
        }
        newState.happiness = Math.min(100, newState.happiness + 20);
        newState.energy = Math.max(0, newState.energy - 20);
        newState.hunger = Math.min(100, newState.hunger + 10);
        newState.lastPlayed = new Date();
        setPetAnimation("playing");
        break;

      case "train":
        if (newState.energy < 40) {
          setShowAction("tired");
          setTimeout(() => setShowAction(null), 2000);
          return;
        }
        newState.experience = newState.experience + 10;
        newState.energy = Math.max(0, newState.energy - 30);
        newState.happiness = Math.min(100, newState.happiness + 10);
        if (newState.experience >= 100) {
          newState.level = newState.level + 1;
          newState.experience = 0;
        }
        newState.lastTrained = new Date();
        setPetAnimation("training");
        break;

      case "sleep":
        newState.energy = 100;
        newState.hunger = Math.min(100, newState.hunger + 5);
        setPetAnimation("tired");
        break;

      case "heal":
        newState.health = 100;
        newState.happiness = Math.min(100, newState.happiness + 10);
        break;
    }

    setPetState(newState);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      setShowAction(null);
      setPetAnimation("happy");
    }, 2000);
  };

  const petEmoji = petEmojis[selectedPet] || petEmojis.dog;
  const currentEmoji = petEmoji[petAnimation as keyof PetEmoji] || petEmoji.happy;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-2">
            Virtual Pet Companion
          </h1>
          <p className="text-yellow-200">Level {petState.level} • Experience {petState.experience}/100</p>
        </div>

        {/* Main pet display */}
        <div className="mb-12 p-8 bg-slate-800/60 border-2 border-yellow-400/40 rounded-3xl backdrop-blur-sm">
          {/* Pet animation */}
          <div className="text-9xl mb-6 text-center animate-bounce" style={{ animationDuration: "1s" }}>
            {currentEmoji}
          </div>

          {/* Action feedback */}
          {showAction && (
            <div className="text-center mb-4 text-2xl font-bold text-yellow-300 animate-fade-in">
              {showAction === "feed" && "😋 Yum yum!"}
              {showAction === "play" && "🎾 Wheee!"}
              {showAction === "train" && "📚 Learning!"}
              {showAction === "sleep" && "😴 Zzzzz..."}
              {showAction === "heal" && "💚 All better!"}
              {showAction === "tired" && "😴 Too tired..."}
            </div>
          )}

          {/* Pet name */}
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-200 mb-4">
              {petsQuery.data?.[0]?.name || "Your Companion"}
            </p>
          </div>
        </div>

        {/* Stats display */}
        <div className="w-full max-w-2xl mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Happiness", value: petState.happiness, icon: "😊" },
            { label: "Energy", value: petState.energy, icon: "⚡" },
            { label: "Health", value: petState.health, icon: "❤️" },
            { label: "Hunger", value: petState.hunger, icon: "🍖" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-sm text-yellow-200 mb-2">{stat.label}</div>
              <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, stat.value))}%` }}
                ></div>
              </div>
              <div className="text-xs text-yellow-100/60 mt-2">{Math.round(stat.value)}%</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-2xl mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { action: "feed", label: "🍖 Feed", color: "from-orange-500 to-orange-600" },
              { action: "play", label: "🎾 Play", color: "from-blue-500 to-blue-600" },
              { action: "train", label: "📚 Train", color: "from-purple-500 to-purple-600" },
              { action: "sleep", label: "😴 Sleep", color: "from-indigo-500 to-indigo-600" },
              { action: "heal", label: "💚 Heal", color: "from-green-500 to-green-600" },
            ].map((btn) => (
              <Button
                key={btn.action}
                onClick={() => handleAction(btn.action)}
                className={`bg-gradient-to-r ${btn.color} text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Pet selector */}
        <div className="w-full max-w-2xl mb-8">
          <p className="text-yellow-200 font-semibold mb-3">Select Pet:</p>
          <div className="flex gap-3 justify-center">
            {["dog", "cat", "rabbit"].map((pet) => (
              <button
                key={pet}
                onClick={() => setSelectedPet(pet)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedPet === pet
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg"
                    : "bg-slate-700/50 text-yellow-200 hover:bg-slate-600/70 border border-yellow-400/30"
                }`}
              >
                {pet === "dog" && "🐕 Dog"}
                {pet === "cat" && "🐈 Cat"}
                {pet === "rabbit" && "🐰 Rabbit"}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements section */}
        <div className="w-full max-w-2xl bg-slate-700/50 border border-yellow-400/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-200 mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🎯", name: "First Play", unlocked: petState.lastPlayed !== null },
              { icon: "📚", name: "Trainer", unlocked: petState.level > 1 },
              { icon: "❤️", name: "Healer", unlocked: petState.health === 100 },
            ].map((achievement) => (
              <div
                key={achievement.name}
                className={`text-center p-3 rounded-lg transition-all ${
                  achievement.unlocked
                    ? "bg-yellow-400/20 border border-yellow-400/50"
                    : "bg-slate-600/50 border border-slate-500/30 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs text-yellow-200">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
