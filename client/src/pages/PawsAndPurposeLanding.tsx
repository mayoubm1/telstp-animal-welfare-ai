import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Shelf {
  id: string;
  title: string;
  subtitle: string;
  position: "top-left" | "top-right" | "middle-left" | "middle-right" | "bottom-left" | "bottom-right" | "bottom-center-left" | "bottom-center-right";
  route: string;
  bgColor: string;
}

const shelves: Shelf[] = [
  {
    id: "food",
    title: "Organic Food & Treats",
    subtitle: "Natural nutrition",
    position: "top-left",
    route: "/shopping-cart?category=food",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "grooming",
    title: "Grooming & Wellness",
    subtitle: "Pure, gentle, effective",
    position: "top-right",
    route: "/shopping-cart?category=grooming",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "toys",
    title: "Eco-Friendly Toys",
    subtitle: "Play naturally",
    position: "middle-left",
    route: "/shopping-cart?category=toys",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "supplements",
    title: "Natural Health & Supplements",
    subtitle: "Support, balance, thrive",
    position: "middle-right",
    route: "/shopping-cart?category=supplements",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "bedding",
    title: "Natural Bedding",
    subtitle: "Comfortable rest",
    position: "bottom-left",
    route: "/shopping-cart?category=bedding",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "sustainable",
    title: "Sustainable Living",
    subtitle: "Good for pets & planet",
    position: "bottom-right",
    route: "/shopping-cart?category=sustainable",
    bgColor: "from-amber-900 to-amber-800",
  },
  {
    id: "nature",
    title: "Back to Nature",
    subtitle: "Natural alternatives",
    position: "bottom-center-left",
    route: "/natural-alternatives",
    bgColor: "from-green-900 to-green-800",
  },
  {
    id: "magic",
    title: "Back to Magic",
    subtitle: "Virtual Pet Companion",
    position: "bottom-center-right",
    route: "/pet-companion",
    bgColor: "from-purple-900 to-purple-800",
  },
];

export default function PawsAndPurposeLanding() {
  const [, navigate] = useLocation();
  const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getShelfPosition = (position: Shelf["position"]) => {
    const positions: Record<Shelf["position"], string> = {
      "top-left": "top-12 left-8 md:top-16 md:left-12",
      "top-right": "top-12 right-8 md:top-16 md:right-12",
      "middle-left": "top-1/3 left-8 md:left-12",
      "middle-right": "top-1/3 right-8 md:right-12",
      "bottom-left": "bottom-32 left-8 md:bottom-40 md:left-12",
      "bottom-right": "bottom-32 right-8 md:bottom-40 md:right-12",
      "bottom-center-left": "bottom-12 left-1/4 md:bottom-16",
      "bottom-center-right": "bottom-12 right-1/4 md:bottom-16",
    };
    return positions[position];
  };

  const handleShelfClick = (shelf: Shelf) => {
    setTimeout(() => navigate(shelf.route), 300);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Atmospheric background with subtle gradients */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-600 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl opacity-10" />
      </div>

      {/* Animated stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Main Title - Ornate style */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="text-2xl md:text-4xl font-bold text-yellow-600 drop-shadow-2xl mb-1 tracking-widest">
          🐾 Paws & Purpose
        </div>
        <div className="text-xs md:text-sm text-yellow-500 drop-shadow-lg font-serif tracking-wider">
          NATURAL PET ESSENTIALS
        </div>
        <div className="text-xs md:text-sm text-yellow-400 mt-1 drop-shadow-md font-light">
          Nourish • Play • Care • Love
        </div>
      </div>

      {/* Central Portal - Epic and Mystical */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {/* Outer glow layers */}
        <div className="absolute inset-0 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute inset-4 w-72 h-72 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 opacity-15 blur-2xl" />

        {/* Main Portal Ring - Ornate */}
        <div className="relative w-64 h-64 rounded-full border-8 border-yellow-600 flex items-center justify-center bg-gradient-to-b from-yellow-900 via-amber-900 to-yellow-950 shadow-2xl">
          {/* Inner decorative rings */}
          <div className="absolute inset-2 rounded-full border-2 border-yellow-500 opacity-60" />
          <div className="absolute inset-6 rounded-full border-1 border-yellow-400 opacity-40" />

          {/* Portal center - Mountain landscape */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-b from-blue-200 via-amber-100 to-green-100 overflow-hidden flex items-center justify-center shadow-inner">
            <div className="text-5xl drop-shadow-lg">🏔️</div>
          </div>

          {/* Mystical pets - Realistic positioning */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-12 z-20">
            {/* Dog - Golden and majestic */}
            <div
              onClick={() => navigate("/pet-selection/dog")}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            >
              <div className="text-7xl drop-shadow-lg">🐕</div>
              <div className="text-xs text-yellow-300 text-center mt-2 font-serif">Dog</div>
            </div>

            {/* Cat - Golden and mysterious */}
            <div
              onClick={() => navigate("/pet-selection/cat")}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            >
              <div className="text-7xl drop-shadow-lg">🐈</div>
              <div className="text-xs text-yellow-300 text-center mt-2 font-serif">Cat</div>
            </div>

            {/* Rabbit - Golden and adventurous */}
            <div
              onClick={() => navigate("/pet-selection/rabbit")}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            >
              <div className="text-7xl drop-shadow-lg">🐰</div>
              <div className="text-xs text-yellow-300 text-center mt-2 font-serif">Rabbit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Shelves - Ornate wooden style */}
      {shelves.map((shelf) => (
        <div
          key={shelf.id}
          className={`absolute ${getShelfPosition(shelf.position)} transform transition-all duration-300 ${
            hoveredShelf === shelf.id ? "scale-105 -rotate-1 shadow-2xl" : "hover:scale-103 hover:-rotate-0.5"
          } cursor-pointer`}
          onMouseEnter={() => setHoveredShelf(shelf.id)}
          onMouseLeave={() => setHoveredShelf(null)}
          onClick={() => handleShelfClick(shelf)}
        >
          {/* Shelf container */}
          <div className={`bg-gradient-to-b ${shelf.bgColor} rounded-lg p-4 md:p-5 shadow-2xl border-2 border-yellow-700 hover:border-yellow-500 transition-all backdrop-blur-sm`}>
            {/* Shelf label - Ornate */}
            <div className="text-center">
              <div className="text-xs md:text-sm font-bold text-yellow-300 drop-shadow-lg tracking-wider uppercase">
                {shelf.title}
              </div>
              <div className="text-xs text-yellow-200 drop-shadow-md mt-0.5 font-light">
                {shelf.subtitle}
              </div>
            </div>
          </div>

          {/* Wooden shelf bottom */}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-900 via-amber-800 to-yellow-900 rounded-full shadow-lg" />
        </div>
      ))}

      {/* Bottom Navigation - Elegant buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-6">
        <Button
          onClick={() => navigate("/pet-selection/dog")}
          className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all border-2 border-yellow-700"
        >
          🐾 Select Pet
        </Button>
        <Button
          onClick={() => navigate("/pet-companion")}
          className="bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all border-2 border-purple-600"
        >
          ✨ My Companion
        </Button>
      </div>

      {/* Instruction text */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center text-yellow-300 text-xs md:text-sm drop-shadow-lg font-light">
        Hover over shelves or click to explore • Select a pet to begin your journey
      </div>
    </div>
  );
}
