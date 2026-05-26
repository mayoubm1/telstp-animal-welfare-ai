import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  BookOpen,
  Pill,
  Apple,
  Heart,
  AlertCircle,
  Search,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";

// Educational Category Card
function CategoryCard({
  icon: Icon,
  title,
  description,
  color,
  topics,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  topics: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`bg-white border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 ${
        isExpanded ? `border-${color}-500` : "border-slate-200"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100`}
          >
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <ChevronRight
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3 border-t border-slate-200 pt-4">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
              <span className="text-sm font-medium text-slate-700">{topic}</span>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

// Medication Card with affordability info
function MedicationCard({
  name,
  generic,
  brand,
  cost,
  savings,
  use_case,
}: {
  name: string;
  generic: string;
  brand: string;
  cost: string;
  savings: string;
  use_case: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription className="text-xs mt-1">{use_case}</CardDescription>
          </div>
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Save {savings}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Generic:</span>
          <span className="font-semibold text-slate-900">{generic}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Brand:</span>
          <span className="font-semibold text-slate-900">{brand}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-green-200">
          <span className="text-slate-600">Avg Cost:</span>
          <span className="font-bold text-green-600">{cost}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Nutrition Tip Card
function NutritionTipCard({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
}) {
  return (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border-l-4 border-${color}-500`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 text-${color}-600 flex-shrink-0 mt-1`} />
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-700 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function EducationHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const educationCategories = [
    {
      icon: Heart,
      title: "Pet Health Basics",
      description: "Essential health information for cats and dogs",
      color: "red",
      topics: [
        "Common diseases and symptoms",
        "Preventive care checklist",
        "Vaccination schedules",
        "Parasite prevention",
        "Dental health",
        "Weight management",
      ],
    },
    {
      icon: Apple,
      title: "Nutrition & Diet",
      description: "Proper feeding for optimal health",
      color: "green",
      topics: [
        "Age-appropriate nutrition",
        "Breed-specific diets",
        "Homemade food recipes",
        "Supplements and vitamins",
        "Food allergies",
        "Hydration tips",
      ],
    },
    {
      icon: Pill,
      title: "Medication Guide",
      description: "Understanding pet medications safely",
      color: "blue",
      topics: [
        "Common medications explained",
        "Dosage guidelines",
        "Side effects to watch for",
        "Drug interactions",
        "Storage instructions",
        "Affordable alternatives",
      ],
    },
    {
      icon: AlertCircle,
      title: "First Aid & Emergencies",
      description: "Quick response guide for urgent situations",
      color: "orange",
      topics: [
        "CPR and choking",
        "Wound care",
        "Poisoning response",
        "Heat stroke treatment",
        "Fracture handling",
        "When to call emergency",
      ],
    },
  ];

  const affordableMedications = [
    {
      name: "Antibiotic for Infections",
      generic: "Amoxicillin (generic)",
      brand: "Amoxicillin-Clavulanate",
      cost: "$15-25",
      savings: "40%",
      use_case: "Bacterial infections, wounds",
    },
    {
      name: "Pain Relief",
      generic: "Meloxicam (generic)",
      brand: "Metacam",
      cost: "$20-35",
      savings: "35%",
      use_case: "Arthritis, inflammation",
    },
    {
      name: "Allergy Relief",
      generic: "Cetirizine (generic)",
      brand: "Apoquel",
      cost: "$10-18",
      savings: "50%",
      use_case: "Itching, allergies",
    },
    {
      name: "Flea Prevention",
      generic: "Fipronil (generic)",
      brand: "Frontline",
      cost: "$8-15",
      savings: "45%",
      use_case: "Flea and tick control",
    },
    {
      name: "Thyroid Support",
      generic: "Levothyroxine (generic)",
      brand: "Soloxine",
      cost: "$12-22",
      savings: "40%",
      use_case: "Hypothyroidism",
    },
    {
      name: "Digestive Aid",
      generic: "Probiotics (generic)",
      brand: "FortiFlora",
      cost: "$15-28",
      savings: "35%",
      use_case: "Digestive issues, diarrhea",
    },
  ];

  const nutritionTips = [
    {
      title: "Age-Appropriate Feeding",
      description: "Puppies/kittens need more calories and protein. Senior pets need lower calories and joint support.",
      icon: Apple,
      color: "green",
    },
    {
      title: "Portion Control",
      description: "Overfeeding is a leading cause of obesity. Follow feeding guidelines based on weight and activity.",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Hydration",
      description: "Always provide fresh water. Cats especially need encouragement to drink more water.",
      icon: Heart,
      color: "blue",
    },
    {
      title: "Human Foods to Avoid",
      description: "Chocolate, grapes, onions, garlic, xylitol, and avocado are toxic to pets.",
      icon: AlertCircle,
      color: "red",
    },
  ];

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
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900">Pet Education Hub</h1>
          </div>
          <p className="text-slate-600">Learn everything you need to know about pet health, nutrition, and care</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search health topics, medications, nutrition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "medications", label: "Affordable Medications", icon: Pill },
            { id: "nutrition", label: "Nutrition Guide", icon: Apple },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 border-b-2 ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationCategories.map((category, idx) => (
                <CategoryCard key={idx} {...category} />
              ))}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6" />
                Quick Health Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">For Dogs</h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>✓ Exercise 30-60 min daily</li>
                    <li>✓ Dental care 3x weekly</li>
                    <li>✓ Vet checkup annually</li>
                    <li>✓ Vaccinations on schedule</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Cats</h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>✓ Playtime 15-30 min daily</li>
                    <li>✓ Litter box maintenance</li>
                    <li>✓ Vet checkup annually</li>
                    <li>✓ Parasite prevention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === "medications" && (
          <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Money-Saving Tips</h3>
              <p className="text-sm text-blue-800">
                Always ask your veterinarian about generic alternatives. Most generic medications are just as effective as brand names but cost significantly less. Compare prices at different pharmacies and online pet pharmacies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {affordableMedications.map((med, idx) => (
                <MedicationCard key={idx} {...med} />
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Average Savings with Generic Medications</h3>
              <p className="mb-4">By choosing generic alternatives, pet owners save an average of 40% on medications annually.</p>
              <Button variant="secondary" className="gap-2">
                Find Generic Options <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === "nutrition" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionTips.map((tip, idx) => (
                <NutritionTipCard key={idx} {...tip} />
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Feeding Guidelines by Age</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    age: "Puppies/Kittens (0-1 year)",
                    calories: "2-3x adult amount",
                    meals: "3-4 meals per day",
                    focus: "High protein, DHA for brain development",
                  },
                  {
                    age: "Adult (1-7 years)",
                    calories: "Standard amount",
                    meals: "2 meals per day",
                    focus: "Balanced nutrition, weight management",
                  },
                  {
                    age: "Senior (7+ years)",
                    calories: "10-25% less",
                    meals: "2-3 smaller meals",
                    focus: "Joint support, digestive health",
                  },
                ].map((guide, idx) => (
                  <Card key={idx} className="bg-white border-2 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{guide.age}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Calories:</span>
                        <p className="text-slate-600">{guide.calories}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Meals:</span>
                        <p className="text-slate-600">{guide.meals}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Focus:</span>
                        <p className="text-slate-600">{guide.focus}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center space-y-4">
          <h3 className="text-2xl font-bold">Still Have Questions?</h3>
          <p>Connect with a veterinarian for personalized advice about your pet's health</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/clinic-locator">
              <Button variant="secondary" className="gap-2">
                Find a Veterinarian <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ai-diagnosis">
              <Button variant="secondary" className="gap-2">
                Get AI Diagnosis <Zap className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
