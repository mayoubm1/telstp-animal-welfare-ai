import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Pet {
  id: string;
  name: string;
  emoji: string;
  sound: string;
  description: string;
  descriptionAr: string;
  color: string;
}

interface PetPosition {
  x: number;
  y: number;
}

const pets: Pet[] = [
  {
    id: "dog",
    name: "Dog",
    emoji: "🐕",
    sound: "🐕 Woof! Woof!",
    description: "Loyal and playful companion",
    descriptionAr: "رفيق مخلص ومرح",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "cat",
    name: "Cat",
    emoji: "🐈",
    sound: "🐈 Meow! Meow!",
    description: "Independent and graceful",
    descriptionAr: "مستقل وأنيق",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "rabbit",
    name: "Rabbit",
    emoji: "🐰",
    sound: "🐰 Hop! Hop!",
    description: "Gentle and curious explorer",
    descriptionAr: "مستكشف لطيف وفضولي",
    color: "from-pink-500 to-rose-600",
  },
];

export default function PetSelectionLanding() {
  const [location, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [petPositions, setPetPositions] = useState<Record<string, PetPosition>>({
    dog: { x: 20, y: 50 },
    cat: { x: 50, y: 50 },
    rabbit: { x: 80, y: 50 },
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [hoveredPet, setHoveredPet] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const soundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate pet movement when hovering over a section
  const handlePetHover = (petId: string) => {
    setHoveredPet(petId);

    // Play sound
    setSoundPlaying(petId);
    if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    soundTimeoutRef.current = setTimeout(() => setSoundPlaying(null), 1000) as unknown as NodeJS.Timeout;

    // Move pet towards mouse position with smooth animation
    setPetPositions((prev) => ({
      ...prev,
      [petId]: {
        x: Math.max(10, Math.min(90, mousePos.x)),
        y: Math.max(10, Math.min(90, mousePos.y)),
      },
    }));
  };

  // Handle pet selection
  const handlePetSelect = (petId: string) => {
    setSelectedPet(petId);
    handlePetHover(petId);

    // Navigate to pet profile creation after animation
    setTimeout(() => {
      navigate(`/pet-selection/${petId}/create`);
    }, 1500);
  };

  // Reset pet position when mouse leaves
  const handleMouseLeave = () => {
    setHoveredPet(null);
    // Reset pets to original positions
    setPetPositions({
      dog: { x: 20, y: 50 },
      cat: { x: 50, y: 50 },
      rabbit: { x: 80, y: 50 },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Glowing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-50 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 mb-4 drop-shadow-lg">
            Paws & Purpose
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-200 font-semibold mb-2">
            Choose Your Virtual Pet Companion
          </p>
          <p className="text-lg text-yellow-100 opacity-80">
            Hover over or click on a pet to meet them. They'll come to you! 🐾
          </p>
        </div>

        {/* Pet selection area with interactive pets */}
        <div className="relative w-full max-w-4xl h-80 mb-12 bg-gradient-to-b from-slate-800/40 to-slate-900/60 rounded-3xl border-2 border-yellow-400/30 backdrop-blur-sm p-8 overflow-hidden">
          {/* Pet cards with hover zones */}
          <div className="absolute inset-0 flex items-center justify-between px-8">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group"
                onMouseEnter={() => handlePetHover(pet.id)}
                onClick={() => handlePetSelect(pet.id)}
              >
                {/* Hover zone indicator */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-2xl"></div>

                {/* Pet name and description */}
                <div className="relative z-20 text-center mb-4">
                  <h3 className="text-xl font-bold text-yellow-200 group-hover:text-yellow-100 transition-colors">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-yellow-100/60 group-hover:text-yellow-100/80">
                    {pet.description}
                  </p>
                </div>

                {/* Interactive pet emoji */}
                <div
                  className={`relative z-30 text-8xl transform transition-all duration-500 ease-out ${
                    selectedPet === pet.id ? "scale-150" : "group-hover:scale-125"
                  }`}
                  style={{
                    transform:
                      hoveredPet === pet.id
                        ? `translate(${petPositions[pet.id].x - 50}px, ${petPositions[pet.id].y - 50}px) scale(${selectedPet === pet.id ? 1.5 : 1.25})`
                        : "translate(0, 0) scale(1)",
                    transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {pet.emoji}
                </div>

                {/* Sound indicator */}
                {soundPlaying === pet.id && (
                  <div className="absolute z-40 mt-20 text-center animate-bounce">
                    <div className="text-sm font-bold text-yellow-300 bg-slate-800/80 px-4 py-2 rounded-full border border-yellow-400/50">
                      {pet.sound}
                    </div>
                  </div>
                )}

                {/* Glow effect on hover */}
                {hoveredPet === pet.id && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Decorative portal in center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-spin" style={{ animationDuration: "20s" }}></div>
              <div className="absolute inset-2 rounded-full border border-yellow-300/20 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }}></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/20 to-yellow-500/10 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-yellow-200 text-lg mb-4">
            {selectedPet
              ? `You selected ${selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1)}! 🎉`
              : "Hover over a pet to hear them, or click to select!"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => navigate("/auth/register")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Create Account
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-2 border-yellow-400 text-yellow-200 font-bold px-8 py-3 rounded-full hover:bg-yellow-400/10 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Button>
        </div>

        {/* Pet stats display */}
        {selectedPet && (
          <div className="mt-12 p-6 bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl backdrop-blur-sm animate-fade-in">
            <h3 className="text-xl font-bold text-yellow-200 mb-4">
              {pets.find((p) => p.id === selectedPet)?.name} Stats
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">100</div>
                <div className="text-sm text-yellow-100/60">Happiness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">100</div>
                <div className="text-sm text-yellow-100/60">Energy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">100</div>
                <div className="text-sm text-yellow-100/60">Health</div>
              </div>
            </div>
          </div>
        )}
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
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
