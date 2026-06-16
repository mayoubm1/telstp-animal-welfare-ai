import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Shelf {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: "top-left" | "top-right" | "middle-left" | "middle-right" | "bottom-left" | "bottom-right" | "bottom-center-left" | "bottom-center-right";
  route: string;
}

const shelves: Shelf[] = [
  {
    id: "food",
    title: "Organic Food & Treats",
    description: "Natural nutrition for your pets",
    icon: "🥗",
    color: "from-amber-600 to-amber-700",
    position: "top-left",
    route: "/shopping-cart?category=food",
  },
  {
    id: "grooming",
    title: "Grooming & Wellness",
    description: "Pure and gentle care",
    icon: "🧴",
    color: "from-blue-600 to-blue-700",
    position: "top-right",
    route: "/shopping-cart?category=grooming",
  },
  {
    id: "toys",
    title: "Eco-Friendly Toys",
    description: "Play naturally",
    icon: "🎾",
    color: "from-green-600 to-green-700",
    position: "middle-left",
    route: "/shopping-cart?category=toys",
  },
  {
    id: "supplements",
    title: "Natural Health & Supplements",
    description: "Support, balance, thrive",
    icon: "💊",
    color: "from-red-600 to-red-700",
    position: "middle-right",
    route: "/shopping-cart?category=supplements",
  },
  {
    id: "bedding",
    title: "Natural Bedding",
    description: "Comfortable rest",
    icon: "🛏️",
    color: "from-yellow-600 to-yellow-700",
    position: "bottom-left",
    route: "/shopping-cart?category=bedding",
  },
  {
    id: "sustainable",
    title: "Sustainable Living",
    description: "Good for pets & planet",
    icon: "♻️",
    color: "from-teal-600 to-teal-700",
    position: "bottom-right",
    route: "/shopping-cart?category=sustainable",
  },
  {
    id: "nature",
    title: "Back to Nature",
    description: "Natural alternatives",
    icon: "🌿",
    color: "from-emerald-600 to-emerald-700",
    position: "bottom-center-left",
    route: "/natural-alternatives",
  },
  {
    id: "magic",
    title: "Back to Magic",
    description: "Virtual Pet Companion",
    icon: "✨",
    color: "from-purple-600 to-purple-700",
    position: "bottom-center-right",
    route: "/pet-companion",
  },
];

export default function PawsAndPurposeLanding() {
  const [, navigate] = useLocation();
  const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPet, setSelectedPet] = useState<"dog" | "cat" | "rabbit" | null>(null);
  const [petPosition, setPetPosition] = useState({ x: 50, y: 50 });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });

        // Move pet towards cursor
        if (selectedPet) {
          setPetPosition({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [selectedPet]);

  const handleShelfHover = (shelfId: string) => {
    setHoveredShelf(shelfId);
    playSound("hover");
  };

  const handleShelfClick = (shelf: Shelf) => {
    playSound("click");
    setTimeout(() => navigate(shelf.route), 300);
  };

  const handlePetSelect = (pet: "dog" | "cat" | "rabbit") => {
    setSelectedPet(pet);
    playSound(pet);
  };

  const playSound = (type: string) => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "dog") {
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === "cat") {
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === "rabbit") {
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === "hover") {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === "click") {
      oscillator.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const getShelfPosition = (position: Shelf["position"]) => {
    const positions: Record<Shelf["position"], string> = {
      "top-left": "top-16 left-8",
      "top-right": "top-16 right-8",
      "middle-left": "top-1/3 left-8",
      "middle-right": "top-1/3 right-8",
      "bottom-left": "bottom-24 left-8",
      "bottom-right": "bottom-24 right-8",
      "bottom-center-left": "bottom-8 left-1/4",
      "bottom-center-right": "bottom-8 right-1/4",
    };
    return positions[position];
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800"
    >
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="text-5xl font-bold text-yellow-400 drop-shadow-lg mb-2">
          🐾 Paws & Purpose
        </div>
        <div className="text-xl text-yellow-300 drop-shadow-md">
          Natural Pet Essentials
        </div>
        <div className="text-sm text-yellow-200 mt-1">
          Nourish • Play • Care • Love
        </div>
      </div>

      {/* Central Portal with Pets */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {/* Golden Portal Glow */}
        <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 opacity-30 blur-3xl animate-pulse" />
        
        {/* Portal Ring */}
        <div className="relative w-64 h-64 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-gradient-to-b from-amber-900 to-yellow-900 shadow-2xl">
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full border-2 border-yellow-300 opacity-50" />
          
          {/* Portal center - mountain landscape */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-b from-blue-300 via-amber-100 to-green-200 overflow-hidden flex items-center justify-center">
            <div className="text-6xl">🏔️</div>
          </div>

          {/* Pets around portal */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8 z-20">
            {/* Dog */}
            <div
              onClick={() => handlePetSelect("dog")}
              className={`cursor-pointer transform transition-all duration-300 ${
                selectedPet === "dog" ? "scale-125" : "hover:scale-110"
              }`}
            >
              <div className="text-6xl">🐕</div>
              <div className="text-xs text-yellow-300 text-center mt-1">Dog</div>
            </div>

            {/* Cat */}
            <div
              onClick={() => handlePetSelect("cat")}
              className={`cursor-pointer transform transition-all duration-300 ${
                selectedPet === "cat" ? "scale-125" : "hover:scale-110"
              }`}
            >
              <div className="text-6xl">🐈</div>
              <div className="text-xs text-yellow-300 text-center mt-1">Cat</div>
            </div>

            {/* Rabbit */}
            <div
              onClick={() => handlePetSelect("rabbit")}
              className={`cursor-pointer transform transition-all duration-300 ${
                selectedPet === "rabbit" ? "scale-125" : "hover:scale-110"
              }`}
            >
              <div className="text-6xl">🐰</div>
              <div className="text-xs text-yellow-300 text-center mt-1">Rabbit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Shelves */}
      {shelves.map((shelf) => (
        <div
          key={shelf.id}
          className={`absolute ${getShelfPosition(shelf.position)} transform transition-all duration-300 ${
            hoveredShelf === shelf.id ? "scale-110 -rotate-2" : "hover:scale-105 hover:-rotate-1"
          }`}
          onMouseEnter={() => handleShelfHover(shelf.id)}
          onMouseLeave={() => setHoveredShelf(null)}
          onClick={() => handleShelfClick(shelf)}
        >
          {/* Shelf */}
          <div className={`bg-gradient-to-r ${shelf.color} rounded-lg p-4 shadow-2xl cursor-pointer border-4 border-yellow-600 hover:border-yellow-300 transition-all`}>
            <div className="text-4xl mb-2">{shelf.icon}</div>
            <div className="text-sm font-bold text-white drop-shadow-lg">{shelf.title}</div>
            <div className="text-xs text-yellow-100 drop-shadow-md">{shelf.description}</div>
          </div>

          {/* Shelf wood effect */}
          <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-yellow-900 to-amber-900 rounded-full shadow-lg" />
        </div>
      ))}

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        <Button
          onClick={() => navigate("/pet-selection/dog")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          🐾 Select Pet
        </Button>
        <Button
          onClick={() => navigate("/pet-companion")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
        >
          ✨ My Companion
        </Button>
      </div>

      {/* Instruction text */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center text-yellow-300 text-sm drop-shadow-lg">
        Hover over shelves or click to explore • Select a pet to begin your journey
      </div>
    </div>
  );
}
