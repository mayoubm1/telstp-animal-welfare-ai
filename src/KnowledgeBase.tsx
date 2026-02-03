import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { ArrowLeft, BookOpen, Pill, Syringe, Apple, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function KnowledgeBase() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"vaccines" | "supplements" | "nutrition" | "medications">("vaccines");
  const [species, setSpecies] = useState<"cat" | "dog">("cat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "vaccines", label: "Vaccination Schedules", icon: Syringe },
    { id: "supplements", label: "Supplements", icon: Apple },
    { id: "nutrition", label: "Nutrition Guides", icon: Apple },
    { id: "medications", label: "Medications", icon: Pill },
  ];

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
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Species Selector */}
        <div className="mb-8 flex gap-4">
          {["cat", "dog"].map((s) => (
            <button
              key={s}
              onClick={() => setSpecies(s as "cat" | "dog")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                species === s
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-200 text-slate-900 hover:border-slate-300"
              }`}
            >
              {s === "cat" ? "🐱 Cats" : "🐶 Dogs"}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "vaccines" && (
              <VaccinationContent species={species} />
            )}
            {activeTab === "supplements" && (
              <SupplementsContent species={species} />
            )}
            {activeTab === "nutrition" && (
              <NutritionContent species={species} />
            )}
            {activeTab === "medications" && (
              <MedicationsContent species={species} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">Always Consult a Vet</p>
                  <p className="text-slate-600">
                    This information is educational. Always consult with a veterinarian for diagnosis and treatment.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Emergency Care</p>
                  <p className="text-slate-600">
                    If your pet shows signs of distress, seek immediate veterinary attention.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Record Keeping</p>
                  <p className="text-slate-600">
                    Keep detailed records of vaccinations, medications, and health events.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function VaccinationContent({ species }: { species: "cat" | "dog" }) {
  const scheduleQuery = trpc.knowledgeBase.vaccinations.getSchedule.useQuery({
    species,
  });

  if (scheduleQuery.isLoading) {
    return <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const schedule = scheduleQuery.data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{schedule?.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedule?.schedule?.map((item: any, idx: number) => (
            <div key={idx} className="border-l-4 border-emerald-600 pl-4 py-2">
              <p className="font-semibold text-slate-900">{item.age}</p>
              <ul className="mt-2 space-y-1">
                {item.vaccines?.map((vaccine: string, vidx: number) => (
                  <li key={vidx} className="text-sm text-slate-600">• {vaccine}</li>
                ))}
              </ul>
              {item.notes && <p className="text-xs text-slate-500 mt-2 italic">{item.notes}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {schedule?.coreVaccines && (
        <Card>
          <CardHeader>
            <CardTitle>Core Vaccines</CardTitle>
            <CardDescription>Essential for all pets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {schedule.coreVaccines.map((vaccine: string, idx: number) => (
                <div key={idx} className="text-sm">✓ {vaccine}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {schedule?.considerations && (
        <Card>
          <CardHeader>
            <CardTitle>Important Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {schedule.considerations.map((item: string, idx: number) => (
                <li key={idx} className="text-sm flex gap-2">
                  <span className="text-emerald-600">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SupplementsContent({ species }: { species: "cat" | "dog" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const supplementsQuery = trpc.knowledgeBase.supplements.search.useQuery({
    query: searchQuery || "omega",
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search supplements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {supplementsQuery.isLoading ? (
        <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {supplementsQuery.data?.results?.map((supplement: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{supplement.name}</CardTitle>
                <CardDescription>{supplement.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-2">Benefits:</p>
                  <ul className="space-y-1">
                    {supplement.benefits?.slice(0, 3).map((benefit: string, bidx: number) => (
                      <li key={bidx} className="text-sm text-slate-600">• {benefit}</li>
                    ))}
                  </ul>
                </div>
                {supplement.dosage && (
                  <div>
                    <p className="font-semibold text-sm mb-1">Dosage:</p>
                    <p className="text-sm text-slate-600">{supplement.dosage}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NutritionContent({ species }: { species: "cat" | "dog" }) {
  const [lifeStage, setLifeStage] = useState<"kitten/puppy" | "adult" | "senior">("adult");
  const nutritionQuery = trpc.knowledgeBase.nutrition.getFoodRecommendations.useQuery({
    species,
    age: lifeStage,
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {["kitten/puppy", "adult", "senior"].map((stage) => (
          <button
            key={stage}
            onClick={() => setLifeStage(stage as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              lifeStage === stage
                ? "bg-emerald-600 text-white"
                : "bg-white border border-slate-200"
            }`}
          >
            {stage === "kitten/puppy" ? "Kitten/Puppy" : stage === "adult" ? "Adult" : "Senior"}
          </button>
        ))}
      </div>

      {nutritionQuery.isLoading ? (
        <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{nutritionQuery.data?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nutritionQuery.data?.requirements && (
                <div>
                  <p className="font-semibold mb-2">Nutritional Requirements:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(nutritionQuery.data.requirements).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-slate-50 p-2 rounded">
                        <p className="text-slate-600 capitalize">{key}:</p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function MedicationsContent({ species }: { species: "cat" | "dog" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const medicationsQuery = trpc.knowledgeBase.medications.search.useQuery({
    medicationName: searchQuery || "amoxicillin",
    species,
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {medicationsQuery.isLoading ? (
        <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : medicationsQuery.data?.error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600">Medication not found. Try searching for another medication.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{medicationsQuery.data?.name}</CardTitle>
            <CardDescription>{medicationsQuery.data?.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicationsQuery.data?.usedFor && (
              <div>
                <p className="font-semibold text-sm mb-2">Used For:</p>
                <ul className="space-y-1">
                  {medicationsQuery.data.usedFor.map((use: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-600">• {use}</li>
                  ))}
                </ul>
              </div>
            )}
            {medicationsQuery.data?.dosage && (
              <div>
                <p className="font-semibold text-sm">Dosage:</p>
                <p className="text-sm text-slate-600">{medicationsQuery.data.dosage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
