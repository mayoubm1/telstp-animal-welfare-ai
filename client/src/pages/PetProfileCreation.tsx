import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const petSpecies = {
  dog: {
    name: "Dog",
    emoji: "🐕",
    breeds: ["Labrador", "German Shepherd", "Golden Retriever", "Bulldog", "Poodle", "Other"],
  },
  cat: {
    name: "Cat",
    emoji: "🐈",
    breeds: ["Persian", "Siamese", "Maine Coon", "Bengal", "British Shorthair", "Other"],
  },
  rabbit: {
    name: "Rabbit",
    emoji: "🐰",
    breeds: ["Lop", "Holland Lop", "Angora", "Lionhead", "Rex", "Other"],
  },
};

export default function PetProfileCreation() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/pet-selection/:species");
  const species = (params?.species as keyof typeof petSpecies) || "dog";
  const petType = petSpecies[species] || petSpecies.dog;

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    color: "",
    microchipId: "",
    medicalHistory: "",
  });

  const [step, setStep] = useState(1);
  const createPetMutation = trpc.pets.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.name || !formData.breed) {
        alert("Please fill in all required fields");
        return;
      }
      setStep(2);
      return;
    }

    // Create pet
    try {
      await createPetMutation.mutateAsync({
        name: formData.name,
        species: species as "cat" | "dog",
        breed: formData.breed,
        age: formData.age ? parseInt(formData.age) : 0,
        weight: formData.weight || "",
        color: formData.color || "",
        microchipId: formData.microchipId || "",
        medicalHistory: formData.medicalHistory || "",
      })

      // Navigate to pet dashboard
      setLocation("/virtual-pet-avatar");
    } catch (error) {
      console.error("Error creating pet:", error);
      alert("Error creating pet. Please try again.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{petType.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-2">
            Create Your {petType.name}'s Profile
          </h1>
          <p className="text-yellow-200 text-lg">
            Step {step} of 2
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-2xl bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Step 1: Basic Info */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Pet Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your pet's name"
                    className="bg-slate-700/50 border-yellow-400/30 text-yellow-100 placeholder-yellow-200/50"
                  />
                </div>

                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Breed *
                  </label>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
                  >
                    <option value="">Select a breed</option>
                    {petType.breeds.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">
                      Age (years)
                    </label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="bg-slate-700/50 border-yellow-400/30 text-yellow-100"
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0"
                      step="0.1"
                      className="bg-slate-700/50 border-yellow-400/30 text-yellow-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Color/Markings
                  </label>
                  <Input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Brown with white spots"
                    className="bg-slate-700/50 border-yellow-400/30 text-yellow-100 placeholder-yellow-200/50"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Medical Info */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Microchip ID
                  </label>
                  <Input
                    type="text"
                    name="microchipId"
                    value={formData.microchipId}
                    onChange={handleInputChange}
                    placeholder="Optional microchip number"
                    className="bg-slate-700/50 border-yellow-400/30 text-yellow-100 placeholder-yellow-200/50"
                  />
                </div>

                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Any allergies, medications, or health conditions..."
                    rows={4}
                    className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2 placeholder-yellow-200/50"
                  />
                </div>

                {/* Summary */}
                <div className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-yellow-200 font-semibold mb-3">Profile Summary</h3>
                  <div className="space-y-2 text-sm text-yellow-100/80">
                    <p><span className="font-semibold">Name:</span> {formData.name}</p>
                    <p><span className="font-semibold">Species:</span> {petType.name}</p>
                    <p><span className="font-semibold">Breed:</span> {formData.breed}</p>
                    {formData.age && <p><span className="font-semibold">Age:</span> {formData.age} years</p>}
                    {formData.weight && <p><span className="font-semibold">Weight:</span> {formData.weight} kg</p>}
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-between pt-6">
              <Button
                type="button"
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                  } else {
                    setLocation("/pet-selection");
                  }
                }}
                variant="outline"
                className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full hover:bg-yellow-400/10"
              >
                {step === 1 ? "Back" : "Previous"}
              </Button>

              <Button
                type="submit"
                disabled={createPetMutation.isPending}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-8 py-2 rounded-full hover:shadow-lg hover:shadow-yellow-500/50"
              >
                {step === 1 ? "Next" : "Create Pet"}
              </Button>
            </div>
          </form>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex gap-2">
          <div className={`h-2 w-12 rounded-full transition-colors ${step >= 1 ? "bg-yellow-400" : "bg-slate-600"}`}></div>
          <div className={`h-2 w-12 rounded-full transition-colors ${step >= 2 ? "bg-yellow-400" : "bg-slate-600"}`}></div>
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
