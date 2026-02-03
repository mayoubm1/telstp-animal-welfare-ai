import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { AlertCircle, Loader2, PawPrint, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SymptomChecker() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [species, setSpecies] = useState<"cat" | "dog" | "">("");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "">("moderate");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!species || !symptoms || !severity) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/trpc/triage.assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            species: species as "cat" | "dog",
            symptoms,
            severity: severity as "mild" | "moderate" | "severe",
          },
        }),
      });
      const data = await response.json();
      if (data.result?.data) {
        setResult(data.result.data);
      } else {
        toast.error("Failed to get diagnosis");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Symptom Checker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Pet's Symptoms</CardTitle>
              <CardDescription>
                Provide details about your pet's health concerns for AI-powered diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Species Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Pet Type *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSpecies("cat")}
                      className={`p-4 border-2 rounded-lg transition ${
                        species === "cat"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">🐱</div>
                      <div className="font-semibold">Cat</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecies("dog")}
                      className={`p-4 border-2 rounded-lg transition ${
                        species === "dog"
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">🐶</div>
                      <div className="font-semibold">Dog</div>
                    </button>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <Label htmlFor="symptoms" className="text-base font-semibold mb-2 block">
                    Describe Symptoms *
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="e.g., Vomiting, loss of appetite, lethargy for 2 days..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                {/* Severity */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Severity Level *</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {["mild", "moderate", "severe"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level as "mild" | "moderate" | "severe")}
                        className={`p-3 border-2 rounded-lg transition capitalize font-medium ${
                          severity === level
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !species || !symptoms || !severity}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Check Symptoms"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-emerald-600" />
                  Diagnosis Results
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Triage Level */}
            {result.triageLevel && (
              <Card>
                <CardHeader>
                  <CardTitle>Urgency Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    result.triageLevel === "emergency"
                      ? "bg-red-50 border border-red-200"
                      : result.triageLevel === "urgent"
                      ? "bg-orange-50 border border-orange-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}>
                    <p className="font-semibold mb-2 capitalize">
                      {result.triageLevel} - {result.reasoning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Immediate Actions */}
            {result.immediateActions && result.immediateActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.immediateActions.map((action: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* When to Seek Help */}
            {result.whenToSeekHelp && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">When to Seek Veterinary Care</CardTitle>
                </CardHeader>
                <CardContent className="text-red-900">
                  <p>{result.whenToSeekHelp}</p>
                </CardContent>
              </Card>
            )}

            {/* Potential Conditions */}
            {result.potentialConditions && result.potentialConditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Possible Conditions</CardTitle>
                  <CardDescription>
                    These conditions may match the described symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.potentialConditions.map((condition: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">{condition.name}</p>
                        <p className="text-sm text-slate-600">{condition.description}</p>
                        {condition.likelihood && (
                          <p className="text-xs text-slate-500 mt-1">
                            Likelihood: {condition.likelihood}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setSymptoms("");
                  setDuration("");
                  setSeverity("moderate");
                  setSpecies("");
                }}
              >
                New Diagnosis
              </Button>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
