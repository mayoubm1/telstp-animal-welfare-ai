/**
 * Enhanced Virtual Pet Companion Page
 * Features: Interactive animations, personalized health tips, pet stats tracking
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VirtualPetAnimations, type PetMood, type PetAnimation } from "@/components/VirtualPetAnimations";

interface PetStats {
  energy: number;
  happiness: number;
  health: number;
  hunger: number;
  cleanliness: number;
}

interface HealthTip {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  priority: string;
  actionItems: string[];
  emoji: string;
}

export default function VirtualPetCompanionEnhanced() {
  const [petStats, setPetStats] = useState<PetStats>({
    energy: 75,
    happiness: 80,
    health: 85,
    hunger: 40,
    cleanliness: 70,
  });

  const [currentMood, setCurrentMood] = useState<PetMood>("happy");
  const [currentAnimation, setCurrentAnimation] = useState<PetAnimation>("idle");
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar">("en");
  const [showHealthTips, setShowHealthTips] = useState(false);

  // Fetch personalized health tips (mock data for now)
  // const { data: tips } = trpc.virtualPet.getRecommendations.useQuery(
  //   { petId: user?.id || "" },
  //   { enabled: !!user?.id }
  // );

  // Mock health tips
  useEffect(() => {
    setHealthTips([
      {
        id: "tip-1",
        title: "Regular Exercise",
        titleAr: "التمارين المنتظمة",
        description: "Your pet needs daily exercise to stay healthy and happy.",
        descriptionAr: "يحتاج حيوانك الأليف إلى تمارين يومية للبقاء بصحة وسعادة.",
        category: "exercise",
        priority: "high",
        actionItems: ["Daily walks", "Interactive play"],
        emoji: "🏃",
      },
      {
        id: "tip-2",
        title: "Balanced Nutrition",
        titleAr: "التغذية المتوازنة",
        description: "Ensure your pet receives proper nutrition for optimal health.",
        descriptionAr: "تأكد من حصول حيوانك الأليف على التغذية المناسبة للصحة المثلى.",
        category: "nutrition",
        priority: "high",
        actionItems: ["Quality food", "Proper portions"],
        emoji: "🥗",
      },
    ]);
  }, []);

  // Update mood based on stats
  useEffect(() => {
    if (petStats.health < 30) {
      setCurrentMood("sick");
    } else if (petStats.hunger > 80) {
      setCurrentMood("hungry");
    } else if (petStats.energy < 20) {
      setCurrentMood("tired");
    } else if (petStats.happiness > 85) {
      setCurrentMood("playful");
    } else if (petStats.happiness < 40) {
      setCurrentMood("sad");
    } else {
      setCurrentMood("happy");
    }
  }, [petStats]);

  // Simulate stat decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPetStats((prev) => ({
        energy: Math.max(0, prev.energy - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        health: Math.max(0, prev.health - 0.2),
        hunger: Math.min(100, prev.hunger + 1),
        cleanliness: Math.max(0, prev.cleanliness - 0.3),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Pet interaction handlers
  const handleFeed = () => {
    setCurrentAnimation("eat");
    setPetStats((prev) => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - 30),
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.max(0, prev.energy - 5),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 1500);
  };

  const handlePlay = () => {
    setCurrentAnimation("play");
    setPetStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 20),
      hunger: Math.min(100, prev.hunger + 15),
      cleanliness: Math.max(0, prev.cleanliness - 10),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 2000);
  };

  const handleRest = () => {
    setCurrentAnimation("sleep");
    setPetStats((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10),
      happiness: Math.min(100, prev.happiness + 5),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 2500);
  };

  const handleBathe = () => {
    setCurrentAnimation("spin");
    setPetStats((prev) => ({
      ...prev,
      cleanliness: 100,
      happiness: Math.min(100, prev.happiness + 5),
      energy: Math.max(0, prev.energy - 10),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 1500);
  };

  const handlePet = () => {
    setCurrentAnimation("wag");
    setPetStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 1500);
  };

  const handleJump = () => {
    setCurrentAnimation("jump");
    setPetStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 15),
    }));
    setTimeout(() => setCurrentAnimation("idle"), 1000);
  };

  const getStatColor = (value: number) => {
    if (value > 75) return "bg-green-500";
    if (value > 50) return "bg-yellow-500";
    if (value > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatLabel = (key: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      energy: { en: "Energy", ar: "الطاقة" },
      happiness: { en: "Happiness", ar: "السعادة" },
      health: { en: "Health", ar: "الصحة" },
      hunger: { en: "Hunger", ar: "الجوع" },
      cleanliness: { en: "Cleanliness", ar: "النظافة" },
    };
    return labels[key]?.[selectedLanguage] || key;
  };

  return (
    <div className={`min-h-screen ${selectedLanguage === "ar" ? "rtl" : "ltr"} bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">{selectedLanguage === "en" ? "Virtual Pet Companion" : "رفيقك الحيوان الأليف الافتراضي"}</h1>
            <button
                    onClick={() => setSelectedLanguage(selectedLanguage === "en" ? "ar" : "en")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    {selectedLanguage === "en" ? "العربية" : "English"}
                  </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Pet Display */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-purple-800 to-blue-800 border-2 border-yellow-400 p-8">
              <div className="flex flex-col items-center">
                {/* Pet Animation */}
                <div className="w-full h-64 mb-6">
                  <VirtualPetAnimations
                    mood={currentMood}
                    currentAnimation={currentAnimation}
                    scale={1.5}
                    interactive={true}
                  />
                </div>

                {/* Pet Status Text */}
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-white mb-2">
                    {selectedLanguage === "en" ? "Your Pet is " : "حيوانك الأليف "} <span className="text-yellow-400 capitalize">{currentMood}</span>
                  </p>
                  <p className="text-gray-300">
                    {selectedLanguage === "en"
                      ? "Interact with your pet to keep it happy and healthy!"
                      : "تفاعل مع حيوانك الأليف لإبقاءه سعيداً وصحياً!"}
                  </p>
                </div>

                {/* Interaction Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                  <button
                    onClick={handleFeed}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    🍖 {selectedLanguage === "en" ? "Feed" : "إطعام"}
                  </button>
                  <button
                    onClick={handlePlay}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    🎾 {selectedLanguage === "en" ? "Play" : "العب"}
                  </button>
                  <button
                    onClick={handleRest}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    😴 {selectedLanguage === "en" ? "Rest" : "استرح"}
                  </button>
                  <button
                    onClick={handleBathe}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    🛁 {selectedLanguage === "en" ? "Bathe" : "استحم"}
                  </button>
                  <button
                    onClick={handlePet}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    🤚 {selectedLanguage === "en" ? "Pet" : "امسح"}
                  </button>
                  <button
                    onClick={handleJump}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    🎉 {selectedLanguage === "en" ? "Jump" : "قفز"}
                  </button>
                </div>
              </div>
            </Card>

            {/* Stats Display */}
            <Card className="bg-gray-800 border-2 border-yellow-400 p-6 mt-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedLanguage === "en" ? "Pet Stats" : "إحصائيات الحيوان الأليف"}
              </h2>
              <div className="space-y-4">
                {Object.entries(petStats).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold">{getStatLabel(key)}</span>
                      <span className="text-yellow-400 font-bold">{Math.round(value)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full ${getStatColor(value)} transition-all duration-500 rounded-full`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Health Tips Sidebar */}
          <div>
            <Card className="bg-gray-800 border-2 border-yellow-400 p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedLanguage === "en" ? "Health Tips" : "نصائح صحية"}
                </h2>
                <button
                    onClick={() => setShowHealthTips(!showHealthTips)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold"
                  >
                    {showHealthTips ? "−" : "+"}
                  </button>
              </div>

              {showHealthTips && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {healthTips.length > 0 ? (
                    healthTips.map((tip) => (
                      <div
                        key={tip.id}
                        className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-lg p-4 border-l-4 border-yellow-400"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">{tip.emoji}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-white">
                              {selectedLanguage === "en" ? tip.title : tip.titleAr}
                            </h3>
                            <p className="text-sm text-gray-200 mt-1">
                              {selectedLanguage === "en" ? tip.description : tip.descriptionAr}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(selectedLanguage === "en" ? tip.actionItems : tip.actionItems).slice(0, 2).map((action, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded"
                                >
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      {selectedLanguage === "en" ? "No tips available yet" : "لا توجد نصائح متاحة حالياً"}
                    </p>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">
                  {selectedLanguage === "en" ? "Quick Tips" : "نصائح سريعة"}
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {selectedLanguage === "en"
                      ? "Feed your pet when hunger > 60%"
                      : "أطعم حيوانك الأليف عندما يكون الجوع > 60٪"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {selectedLanguage === "en"
                      ? "Play regularly to boost happiness"
                      : "العب بانتظام لزيادة السعادة"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {selectedLanguage === "en"
                      ? "Rest when energy < 30%"
                      : "استرح عندما تكون الطاقة < 30٪"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {selectedLanguage === "en"
                      ? "Bathe regularly for cleanliness"
                      : "استحم بانتظام للنظافة"}
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
