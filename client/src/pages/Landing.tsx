import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  icon: string;
  color: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  route: string;
}

const sections: Section[] = [
  {
    id: "food",
    title: "Organic Food & Treats",
    titleAr: "الطعام العضوي والمعاملات",
    subtitle: "Nourish naturally",
    subtitleAr: "تغذية طبيعية",
    icon: "🌾",
    color: "from-amber-500 to-yellow-600",
    position: "top-left",
    route: "/shop/food",
  },
  {
    id: "grooming",
    title: "Grooming & Wellness",
    titleAr: "العناية والعافية",
    subtitle: "Pure, gentle, effective",
    subtitleAr: "نقي، لطيف، فعال",
    icon: "💆",
    color: "from-emerald-500 to-teal-600",
    position: "top-right",
    route: "/shop/grooming",
  },
  {
    id: "toys",
    title: "Eco-Friendly Toys",
    titleAr: "ألعاب صديقة للبيئة",
    subtitle: "Play naturally",
    subtitleAr: "العب بطبيعية",
    icon: "🎾",
    color: "from-orange-500 to-red-600",
    position: "bottom-left",
    route: "/shop/toys",
  },
  {
    id: "supplements",
    title: "Natural Health & Supplements",
    titleAr: "الصحة الطبيعية والمكملات",
    subtitle: "Support, balance, thrive",
    subtitleAr: "دعم، توازن، ازدهار",
    icon: "💊",
    color: "from-blue-500 to-indigo-600",
    position: "bottom-right",
    route: "/shop/supplements",
  },
  {
    id: "bedding",
    title: "Natural Bedding",
    titleAr: "الفراش الطبيعي",
    subtitle: "Comfort & care",
    subtitleAr: "الراحة والعناية",
    icon: "🛏️",
    color: "from-purple-500 to-pink-600",
    position: "bottom-left",
    route: "/shop/bedding",
  },
  {
    id: "sustainable",
    title: "Sustainable Living",
    titleAr: "العيش المستدام",
    subtitle: "Good for pets, people, planet",
    subtitleAr: "جيد للحيوانات والناس والكوكب",
    icon: "🌍",
    color: "from-green-500 to-emerald-600",
    position: "bottom-right",
    route: "/shop/sustainable",
  },
];

const petTypes = [
  { name: "Dogs", emoji: "🐕", route: "/pets/dogs" },
  { name: "Cats", emoji: "🐈", route: "/pets/cats" },
  { name: "Rabbits", emoji: "🐰", route: "/pets/rabbits" },
  { name: "Birds", emoji: "🦜", route: "/pets/birds" },
  { name: "Exotic", emoji: "🦎", route: "/pets/exotic" },
];

export default function Landing() {
  const [, navigate] = useLocation();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSectionClick = (route: string) => {
    navigate(route);
  };

  const handlePetTypeClick = (route: string) => {
    navigate(route);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Glowing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-50 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-4">
        {/* Header with title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 mb-2 drop-shadow-lg">
            Paws & Purpose
          </h1>
          <p className="text-xl md:text-2xl text-yellow-200 font-semibold mb-2">
            Natural Pet Essentials
          </p>
          <p className="text-lg text-yellow-100 opacity-80">
            Nourish • Play • Care • Love
          </p>
        </div>

        {/* Pet type selector */}
        <div className="mb-12 flex gap-4 justify-center flex-wrap">
          {petTypes.map((pet) => (
            <button
              key={pet.name}
              onClick={() => {
                setSelectedPetType(pet.name);
                handlePetTypeClick(pet.route);
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 ${
                selectedPetType === pet.name
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/50"
                  : "bg-slate-700/50 text-yellow-200 hover:bg-slate-600/70 border border-yellow-400/30"
              }`}
            >
              <span className="mr-2">{pet.emoji}</span>
              {pet.name}
            </button>
          ))}
        </div>

        {/* Central portal with sections arranged around it */}
        <div className="relative w-full max-w-6xl h-96 mb-8">
          {/* Central glowing portal */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Outer glow rings */}
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-spin" style={{ animationDuration: "20s" }}></div>
              <div className="absolute inset-4 rounded-full border-2 border-yellow-300/30 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }}></div>
              <div className="absolute inset-8 rounded-full border-2 border-yellow-200/20 animate-pulse"></div>

              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/40 to-yellow-500/20 blur-2xl"></div>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🐾</div>
                  <p className="text-yellow-100 font-semibold text-sm">Back to Nature</p>
                  <p className="text-yellow-200/70 text-xs">Back to Magic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive sections positioned around portal */}
          <div className="absolute inset-0">
            {sections.map((section) => {
              const isHovered = hoveredSection === section.id;
              let positionClasses = "";

              switch (section.position) {
                case "top-left":
                  positionClasses = "top-0 left-0";
                  break;
                case "top-right":
                  positionClasses = "top-0 right-0";
                  break;
                case "bottom-left":
                  positionClasses = "bottom-0 left-0";
                  break;
                case "bottom-right":
                  positionClasses = "bottom-0 right-0";
                  break;
              }

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.route)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`absolute ${positionClasses} w-32 h-32 md:w-40 md:h-40 group cursor-pointer transform transition-all duration-300 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                >
                  {/* Section card background */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl`}
                  ></div>

                  {/* Section card */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-slate-800/80 backdrop-blur-sm border-2 border-yellow-400/30 group-hover:border-yellow-300/60 transition-all duration-300 p-4 flex flex-col items-center justify-center overflow-hidden`}
                  >
                    {/* Hover glow effect */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                        {section.icon}
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-yellow-200 group-hover:text-yellow-100 transition-colors duration-300 line-clamp-2">
                        {section.title}
                      </h3>
                      <p className="text-xs text-yellow-100/60 group-hover:text-yellow-100/80 transition-colors duration-300 mt-1">
                        {section.subtitle}
                      </p>
                    </div>

                    {/* Animated border */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-yellow-400/50 via-yellow-300/50 to-yellow-400/50 bg-clip-padding pointer-events-none animate-pulse"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <Button
            onClick={() => navigate("/auth/register")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
          <Button
            onClick={() => navigate("/shop")}
            variant="outline"
            className="border-2 border-yellow-400 text-yellow-200 font-bold px-8 py-3 rounded-full hover:bg-yellow-400/10 transition-all duration-300 transform hover:scale-105"
          >
            Explore Shop
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-yellow-300 text-2xl">↓</div>
      </div>

      {/* Styles for animations */}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
