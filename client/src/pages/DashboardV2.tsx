import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  Heart,
  Activity,
  AlertCircle,
  TrendingUp,
  Zap,
  Calendar,
  Award,
  Smile,
} from "lucide-react";
import { useState } from "react";

// Animated Pet Card Component
function PetCard({ pet, onAction }: { pet: any; onAction: (action: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  const getHealthColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case "excellent":
        return "from-green-400 to-emerald-500";
      case "good":
        return "from-blue-400 to-cyan-500";
      case "fair":
        return "from-yellow-400 to-orange-500";
      case "poor":
        return "from-red-400 to-pink-500";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  return (
    <Card
      className="relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-slate-200 hover:border-purple-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getHealthColor(pet.health)} opacity-10 transition-opacity duration-300`} />

      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{pet.name} 🐾</CardTitle>
            <CardDescription className="text-sm">
              {pet.species} • {pet.age} years old
            </CardDescription>
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getHealthColor(pet.health)} flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
            {pet.health === "Excellent" ? "😊" : pet.health === "Good" ? "😌" : pet.health === "Fair" ? "😐" : "😟"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Health Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/50 backdrop-blur rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Heart className="w-4 h-4 text-red-500" />
              Health
            </div>
            <div className="text-lg font-bold text-slate-900">{pet.health || "Good"}</div>
          </div>
          <div className="bg-white/50 backdrop-blur rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Activity className="w-4 h-4 text-blue-500" />
              Activity
            </div>
            <div className="text-lg font-bold text-slate-900">{pet.activity || "Active"}</div>
          </div>
        </div>

        {/* Last Checkup */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Last Checkup</span>
            </div>
            <span className="text-sm font-bold text-purple-600">{pet.lastCheckup || "Never"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            onClick={() => onAction("diagnosis")}
          >
            <Zap className="w-4 h-4 mr-1" />
            Diagnose
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300"
            onClick={() => onAction("history")}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            History
          </Button>
        </div>
      </CardContent>

      {/* Hover indicator */}
      {isHovered && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full animate-pulse" />
      )}
    </Card>
  );
}

// Health Score Widget
function HealthScoreWidget({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}%</span>
        <span className="text-xs font-medium text-slate-600">Health</span>
      </div>
    </div>
  );
}

export default function DashboardV2() {
  const { user } = useAuth();
  const petsQuery = trpc.pets.list.useQuery();
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const pets = Array.isArray(petsQuery.data) ? petsQuery.data : [];
  const averageHealth = pets.length > 0 ? 85 : 0;

  const handlePetAction = (action: string) => {
    if (action === "diagnosis") {
      window.location.href = "/ai-diagnosis";
    } else if (action === "history") {
      window.location.href = "/case-history";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-slate-600 mt-1">Let's keep your pets healthy and happy</p>
            </div>
            <Link href="/register-pet">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 gap-2">
                <Plus className="w-5 h-5" />
                Add Pet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur border-2 border-slate-200 hover:border-blue-500 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Total Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{pets.length}</div>
              <p className="text-xs text-slate-500 mt-2">All registered</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-2 border-slate-200 hover:border-green-500 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{averageHealth}%</div>
              <p className="text-xs text-slate-500 mt-2">Average</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-2 border-slate-200 hover:border-purple-500 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">5</div>
              <p className="text-xs text-slate-500 mt-2">Available</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-2 border-slate-200 hover:border-yellow-500 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">3</div>
              <p className="text-xs text-slate-500 mt-2">Unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Pets Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Smile className="w-6 h-6 text-pink-500" />
              Your Pets
            </h2>

            {pets.length === 0 ? (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-slate-300">
                <CardContent className="py-12 text-center space-y-4">
                  <div className="text-4xl">🐾</div>
                  <h3 className="text-xl font-bold text-slate-900">No pets yet!</h3>
                  <p className="text-slate-600">Add your first pet to get started with AI-powered health monitoring</p>
                  <Link href="/register-pet">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Pet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} onAction={handlePetAction} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/ai-diagnosis">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-purple-500 hover:bg-purple-50 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                >
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-slate-900">AI Diagnosis</span>
                </Button>
              </Link>
              <Link href="/emergency-triage">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-red-500 hover:bg-red-50 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                >
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="font-semibold text-slate-900">Emergency</span>
                </Button>
              </Link>
              <Link href="/clinic-locator">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-blue-500 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                >
                  <Heart className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-slate-900">Find Vet</span>
                </Button>
              </Link>
              <Link href="/case-history">
                <Button
                  variant="outline"
                  className="w-full h-24 border-2 border-green-500 hover:bg-green-50 transition-all duration-300 flex flex-col items-center justify-center gap-2"
                >
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-slate-900">History</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
