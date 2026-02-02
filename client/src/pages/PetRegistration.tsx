import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function PetRegistration() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [species, setSpecies] = useState<"cat" | "dog">("cat");
  const [breed, setBreed] = useState("");
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    color: "",
    microchipId: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
  });

  const createPetMutation = trpc.pets.create.useMutation();
  const breedsQuery = trpc.pets.getBreeds.useQuery({ species });

  const handleSpeciesChange = (value: "cat" | "dog") => {
    setSpecies(value);
    setBreed("");
    setFormData({ ...formData, breed: "" });
  };

  const handleBreedChange = (value: string) => {
    setBreed(value);
    setFormData({ ...formData, breed: value });
    setShowBreedSuggestions(false);
  };

  const handleBreedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBreed(value);
    setFormData({ ...formData, breed: value });

    if (value && breedsQuery.data) {
      const filtered = breedsQuery.data.filter((b) =>
        b.toLowerCase().includes(value.toLowerCase())
      );
      setBreedSuggestions(filtered);
      setShowBreedSuggestions(true);
    } else {
      setShowBreedSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Pet name is required");
      return;
    }

    if (!formData.breed.trim()) {
      toast.error("Breed is required");
      return;
    }

    if (!formData.age) {
      toast.error("Age is required");
      return;
    }

    if (!formData.weight) {
      toast.error("Weight is required");
      return;
    }

    try {
      await createPetMutation.mutateAsync({
        name: formData.name,
        species,
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: formData.weight,
        color: formData.color || undefined,
        microchipId: formData.microchipId || undefined,
        vaccinationStatus: "unknown",
        medicalHistory: formData.medicalHistory || undefined,
        allergies: formData.allergies || undefined,
        currentMedications: formData.currentMedications || undefined,
      });

      toast.success("Pet registered successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to register pet");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to register a pet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register Your Pet</CardTitle>
            <CardDescription>
              Add your cat or dog to get started with personalized veterinary care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Max, Luna"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Species */}
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select value={species} onValueChange={handleSpeciesChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="dog">Dog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Breed */}
              <div className="space-y-2 relative">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  placeholder="Start typing to see suggestions"
                  value={breed}
                  onChange={handleBreedInputChange}
                  required
                />
                {showBreedSuggestions && breedSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {breedSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors"
                        onClick={() => handleBreedChange(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Age and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (months) *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    placeholder="e.g., 24"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 5.5"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Color/Markings</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="e.g., Black and white, Tabby"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>

              {/* Microchip ID */}
              <div className="space-y-2">
                <Label htmlFor="microchipId">Microchip ID</Label>
                <Input
                  id="microchipId"
                  name="microchipId"
                  placeholder="Optional microchip number"
                  value={formData.microchipId}
                  onChange={handleInputChange}
                />
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="Previous surgeries, chronic conditions, etc."
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  placeholder="Food allergies, medication allergies, environmental allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              {/* Current Medications */}
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  name="currentMedications"
                  placeholder="List any current medications and dosages"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={createPetMutation.isPending}
                  className="flex-1"
                >
                  {createPetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Pet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={createPetMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
