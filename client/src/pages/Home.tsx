import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Stethoscope,
  ImageIcon,
  BookOpen,
  Users,
  AlertCircle,
  Pill,
  Zap,
  ArrowRight,
  PawPrint,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">VetAI Care</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">Welcome, {user?.name}</span>
                <Link href="/dashboard">
                  <Button variant="default">Dashboard</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Powered Veterinary Care at Your Fingertips
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Comprehensive pet health diagnostics, emergency triage, and expert guidance for cat and dog owners worldwide. Powered by advanced AI and veterinary expertise.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/symptom-checker">
                    <Button size="lg" className="gap-2">
                      Start Diagnosis <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/case-history">
                    <Button size="lg" variant="outline">
                      My Cases
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>
                  <a href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Stethoscope className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Professional Veterinary Diagnostics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Comprehensive Pet Health Platform</h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to keep your cats and dogs healthy and thriving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Symptom Checker */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <Zap className="w-8 h-8 text-emerald-400 mb-2" />
                <CardTitle className="text-white">AI Symptom Checker</CardTitle>
                <CardDescription className="text-slate-400">
                  Describe symptoms and get instant AI-powered assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Real-time symptom analysis</li>
                  <li>✓ Disease differential diagnosis</li>
                  <li>✓ Emergency triage assessment</li>
                  <li>✓ Treatment recommendations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Image Analysis */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <ImageIcon className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Visual Diagnosis</CardTitle>
                <CardDescription className="text-slate-400">
                  Upload photos for AI-powered condition detection
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Skin condition analysis</li>
                  <li>✓ Eye problem detection</li>
                  <li>✓ Dental issue identification</li>
                  <li>✓ Multi-angle assessment</li>
                </ul>
              </CardContent>
            </Card>

            {/* Knowledge Base */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Knowledge Base</CardTitle>
                <CardDescription className="text-slate-400">
                  Expert information on health, nutrition, and care
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Vaccination schedules</li>
                  <li>✓ Nutrition guides</li>
                  <li>✓ Supplements & medications</li>
                  <li>✓ Preventive care</li>
                </ul>
              </CardContent>
            </Card>

            {/* Emergency Triage */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                <CardTitle className="text-white">Emergency Triage</CardTitle>
                <CardDescription className="text-slate-400">
                  Urgent assessment and immediate guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Urgency level assessment</li>
                  <li>✓ Immediate action steps</li>
                  <li>✓ When to seek emergency care</li>
                  <li>✓ First aid guidance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Case History */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <PawPrint className="w-8 h-8 text-amber-400 mb-2" />
                <CardTitle className="text-white">Case History</CardTitle>
                <CardDescription className="text-slate-400">
                  Track your pet's health journey over time
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Symptom logging</li>
                  <li>✓ Treatment tracking</li>
                  <li>✓ Progress monitoring</li>
                  <li>✓ Vet consultation history</li>
                </ul>
              </CardContent>
            </Card>

            {/* Vet Connection */}
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition">
              <CardHeader>
                <Users className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Vet Connection</CardTitle>
                <CardDescription className="text-slate-400">
                  Consult with licensed veterinarians
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-300">
                <ul className="space-y-2 text-sm">
                  <li>✓ Request consultations</li>
                  <li>✓ Share diagnostic data</li>
                  <li>✓ Get professional feedback</li>
                  <li>✓ Find nearby clinics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Care for Your Pet?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of pet owners using AI-powered diagnostics for better pet health outcomes
          </p>
          {isAuthenticated ? (
            <Link href="/symptom-checker">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Diagnosis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="gap-2">
                Sign In to Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">VetAI Care</h4>
              <p className="text-sm">AI-powered veterinary diagnostics for cats and dogs worldwide</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Symptom Checker</a></li>
                <li><a href="#features" className="hover:text-white transition">Visual Diagnosis</a></li>
                <li><a href="#features" className="hover:text-white transition">Knowledge Base</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@vetai.care</li>
                <li>Emergency: 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 VetAI Care. All rights reserved. | Part of TELSTP Initiative</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
