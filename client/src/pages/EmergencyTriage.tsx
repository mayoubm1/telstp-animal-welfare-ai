import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, MapPin, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function EmergencyTriage() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "critical">("severe");
  const [petSpecies, setPetSpecies] = useState<"cat" | "dog">("cat");
  const [petAge, setPetAge] = useState<number>(12);
  const [caseHistoryId, setCaseHistoryId] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessEmergency = trpc.emergencyTriage.assessEmergency.useMutation({
    onSuccess: () => {
      setSymptoms("");
      setSeverity("severe");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || !caseHistoryId) return;

    setIsSubmitting(true);
    try {
      await assessEmergency.mutateAsync({
        caseHistoryId,
        symptoms,
        severity,
        petSpecies,
        petAge,
      });
    } catch (error) {
      console.error("Emergency assessment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-red-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold text-red-900">Emergency Triage</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Form */}
          <div className="lg:col-span-2">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-900">Quick Assessment</CardTitle>
                <CardDescription>
                  Describe your pet's emergency symptoms for immediate evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Symptoms Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Describe the emergency symptoms *
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., Severe difficulty breathing, unconscious, severe bleeding, seizures..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Pet Species */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pet Species *
                    </label>
                    <select
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value as "cat" | "dog")}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                    </select>
                  </div>

                  {/* Pet Age */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pet Age (months)
                    </label>
                    <input
                      type="number"
                      value={petAge}
                      onChange={(e) => setPetAge(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      min="0"
                    />
                  </div>

                  {/* Severity Level */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Severity Level
                    </label>
                    <div className="space-y-2">
                      {(["mild", "moderate", "severe", "critical"] as const).map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="severity"
                            value={level}
                            checked={severity === level}
                            onChange={(e) => setSeverity(e.target.value as typeof severity)}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !symptoms.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? "Assessing..." : "Get Emergency Assessment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Info Sidebar */}
          <div className="space-y-4">
            {/* Critical Signs Card */}
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 text-lg">Critical Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-red-900">Seek immediate help if:</p>
                  <ul className="space-y-1 text-red-800">
                    <li>• Difficulty breathing or choking</li>
                    <li>• Loss of consciousness</li>
                    <li>• Severe bleeding</li>
                    <li>• Seizures or convulsions</li>
                    <li>• Severe trauma or injury</li>
                    <li>• Inability to urinate/defecate</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">24/7 Vet Hotline</p>
                    <p className="text-slate-600">Call nearest emergency clinic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">Find Nearby Clinic</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      View clinic locator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Veterinarians will review your case within <strong>5 minutes</strong> for critical cases
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
