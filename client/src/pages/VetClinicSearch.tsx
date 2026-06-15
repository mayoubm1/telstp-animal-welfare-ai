import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface VetClinic {
  id: string;
  name: string;
  type: "vet" | "clinic";
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  specializations: string[];
  isOpen: boolean;
  consultationFee?: number;
  image: string;
  verified: boolean;
  responseTime: string;
}

const mockVetsAndClinics: VetClinic[] = [
  {
    id: "1",
    name: "Dr. Ahmed Veterinary Clinic",
    type: "clinic",
    rating: 4.9,
    reviews: 156,
    location: "Zamalek, Cairo",
    distance: 2.3,
    specializations: ["Dogs", "Cats", "Emergency Care"],
    isOpen: true,
    consultationFee: 250,
    image: "🏥",
    verified: true,
    responseTime: "< 5 min",
  },
  {
    id: "2",
    name: "Dr. Fatima - Freelance Vet",
    type: "vet",
    rating: 4.7,
    reviews: 89,
    location: "Heliopolis, Cairo",
    distance: 3.5,
    specializations: ["Dogs", "Cats", "Rabbits"],
    isOpen: true,
    consultationFee: 150,
    image: "👨‍⚕️",
    verified: true,
    responseTime: "< 10 min",
  },
  {
    id: "3",
    name: "Pet Care Center",
    type: "clinic",
    rating: 4.6,
    reviews: 203,
    location: "New Cairo",
    distance: 5.2,
    specializations: ["Dogs", "Cats", "Birds", "Exotic Pets"],
    isOpen: true,
    consultationFee: 300,
    image: "🏥",
    verified: true,
    responseTime: "< 15 min",
  },
  {
    id: "4",
    name: "Dr. Mohamed - Exotic Specialist",
    type: "vet",
    rating: 4.8,
    reviews: 67,
    location: "Maadi, Cairo",
    distance: 4.1,
    specializations: ["Exotic Pets", "Birds", "Reptiles"],
    isOpen: false,
    consultationFee: 200,
    image: "👨‍⚕️",
    verified: true,
    responseTime: "< 20 min",
  },
  {
    id: "5",
    name: "Emergency Vet Services",
    type: "clinic",
    rating: 4.5,
    reviews: 312,
    location: "Downtown Cairo",
    distance: 1.8,
    specializations: ["Emergency", "Surgery", "ICU"],
    isOpen: true,
    consultationFee: 400,
    image: "🏥",
    verified: true,
    responseTime: "< 2 min",
  },
];

export default function VetClinicSearch() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "vet" | "clinic">("all");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "fee">("rating");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const allSpecializations = Array.from(
    new Set(mockVetsAndClinics.flatMap((v) => v.specializations))
  );

  const filteredResults = mockVetsAndClinics
    .filter((v) => {
      const matchesQuery =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || v.type === filterType;
      const matchesSpec = !selectedSpecialization || v.specializations.includes(selectedSpecialization);
      return matchesQuery && matchesType && matchesSpec;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance") return a.distance - b.distance;
      if (sortBy === "fee") return (a.consultationFee || 0) - (b.consultationFee || 0);
      return 0;
    });

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-4">
            Find Veterinarians & Clinics
          </h1>
          <p className="text-yellow-200">Discover trusted pet care providers near you</p>
        </div>

        {/* Search and filters */}
        <div className="max-w-4xl mx-auto w-full mb-8 space-y-4">
          {/* Search bar */}
          <div>
            <Input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700/50 border-yellow-400/30 text-yellow-100 placeholder-yellow-200/50 py-3"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Vets", value: "vet" },
                { label: "Clinics", value: "clinic" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value as typeof filterType)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    filterType === opt.value
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                      : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { label: "Top Rated", value: "rating" },
                { label: "Nearest", value: "distance" },
                { label: "Lowest Fee", value: "fee" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value as typeof sortBy)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    sortBy === opt.value
                      ? "bg-gradient-to-r from-purple-400 to-purple-500 text-slate-900"
                      : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specialization filter */}
          <div>
            <p className="text-yellow-200 font-semibold mb-2">Specializations:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSpecialization(null)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedSpecialization === null
                    ? "bg-yellow-400 text-slate-900"
                    : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30"
                }`}
              >
                All
              </button>
              {allSpecializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedSpecialization === spec
                      ? "bg-yellow-400 text-slate-900"
                      : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto w-full">
          <p className="text-yellow-200 font-semibold mb-4">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
          </p>

          <div className="space-y-4">
            {filteredResults.map((vetClinic) => (
              <div
                key={vetClinic.id}
                className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6 hover:border-yellow-400/60 transition-all cursor-pointer"
                onClick={() => setLocation(`/vet-clinic/${vetClinic.id}`)}
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="text-6xl flex-shrink-0">{vetClinic.image}</div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-yellow-200">
                          {vetClinic.name}
                          {vetClinic.verified && <span className="text-green-400 ml-2">✓</span>}
                        </h3>
                        <p className="text-yellow-100/60">
                          {vetClinic.type === "vet" ? "Freelance Veterinarian" : "Veterinary Clinic"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-300">⭐ {vetClinic.rating}</div>
                        <p className="text-sm text-yellow-100/60">({vetClinic.reviews} reviews)</p>
                      </div>
                    </div>

                    {/* Location and distance */}
                    <div className="flex gap-4 mb-3 text-yellow-100/80">
                      <span>📍 {vetClinic.location}</span>
                      <span>🚗 {vetClinic.distance} km</span>
                      <span>{vetClinic.isOpen ? "🟢 Open" : "🔴 Closed"}</span>
                      <span>⏱️ {vetClinic.responseTime}</span>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {vetClinic.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="bg-yellow-400/20 text-yellow-200 px-3 py-1 rounded-full text-sm border border-yellow-400/40"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Fee and action */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-yellow-300">
                        {vetClinic.consultationFee} EGP
                      </div>
                      <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-6 py-2 rounded-full">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-yellow-200 text-lg">No results found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Back button */}
        <div className="max-w-4xl mx-auto w-full mt-8">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full"
          >
            ← Back to Home
          </Button>
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

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
