import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Zap,
  ArrowRight,
  Heart,
  Sparkles,
  Smile,
  Volume2,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

// Animated Pet Mascot Component
function AnimatedPetMascot() {
  const [bounce, setBounce] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Cat SVG with animation */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{
          transform: `translateY(${bounce * -8}px)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {/* Cat body */}
        <ellipse cx="100" cy="120" rx="45" ry="50" fill="#FF6B9D" />
        {/* Cat head */}
        <circle cx="100" cy="70" r="35" fill="#FF6B9D" />
        {/* Left ear */}
        <polygon points="75,35 65,10 80,25" fill="#FF6B9D" />
        {/* Right ear */}
        <polygon points="125,35 135,10 120,25" fill="#FF6B9D" />
        {/* Eyes */}
        <circle cx="90" cy="65" r="5" fill="#000" />
        <circle cx="110" cy="65" r="5" fill="#000" />
        {/* Pupils with shine */}
        <circle cx="91" cy="64" r="2" fill="#FFF" />
        <circle cx="111" cy="64" r="2" fill="#FFF" />
        {/* Smile */}
        <path d="M 100 75 Q 95 80 90 78" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 100 75 Q 105 80 110 78" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <polygon points="100,72 98,76 102,76" fill="#FFB6C1" />
        {/* Front paws */}
        <rect x="80" y="160" width="12" height="25" rx="6" fill="#FF6B9D" />
        <rect x="108" y="160" width="12" height="25" rx="6" fill="#FF6B9D" />
        {/* Tail */}
        <path
          d="M 140 120 Q 160 100 155 70"
          stroke="#FF6B9D"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          style={{
            animation: "tailWag 1s ease-in-out infinite",
          }}
        />
        {/* Heart above head */}
        <g
          style={{
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <path
            d="M 100 20 L 110 10 Q 115 5 120 10 L 110 20 Q 105 25 100 20 M 100 20 L 90 10 Q 85 5 80 10 L 90 20 Q 95 25 100 20"
            fill="#FFD700"
          />
        </g>
      </svg>

      <style>{`
        @keyframes tailWag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

// Feature Card with hover animation
function AnimatedFeatureCard({
  icon: Icon,
  title,
  description,
  items,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  items: string[];
  color: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`bg-white border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl ${
        isHovered ? `border-${color}-500` : "border-slate-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            isHovered ? `bg-${color}-100` : "bg-slate-100"
          }`}
        >
          <Icon className={`w-6 h-6 ${isHovered ? `text-${color}-600` : "text-slate-600"}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function HomeV2() {
  const { isAuthenticated, user } = useAuth();
  const { t, isArabic } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              PetCare AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">Welcome, {user?.name}! 👋</span>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  {t('nav.signin')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ✨ AI-Powered Pet Care
                </span>
              </div>
              <h2 className="text-6xl font-bold text-slate-900 leading-tight">
                {t('home.title')}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t('home.subtitle')}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {isAuthenticated ? (
                <>
                  <Link href="/ai-diagnosis">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 gap-2 text-lg px-8"
                    >
                      {t('diagnosis.title')} <Zap className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/clinic-locator">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 gap-2 text-lg px-8"
                    >
                      {t('clinic.title')} <Smile className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/education">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-green-500 text-green-600 hover:bg-green-50 gap-2 text-lg px-8"
                    >
                      {t('education.title')} <BookOpen className="w-5 h-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 gap-2 text-lg px-8"
                    >
                      Get Started <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>
                  <a href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 gap-2 text-lg px-8"
                    >
                      Learn More
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="text-sm font-medium text-slate-700">50+ Verified Clinics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <span className="text-sm font-medium text-slate-700">Instant Results</span>
              </div>
            </div>
          </div>

          {/* Animated Pet Mascot */}
          <div className="relative">
            <AnimatedPetMascot />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 -z-10" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-5xl font-bold text-slate-900">
            {t('home.features')}
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('home.featuresDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedFeatureCard
            icon={Zap}
            title="AI Diagnosis"
            description="Smart symptom analysis"
            items={["Photo & video analysis", "Audio transcription", "Instant recommendations"]}
            color="yellow"
          />
          <AnimatedFeatureCard
            icon={Volume2}
            title="Emergency Triage"
            description="When every second counts"
            items={["Urgent assessment", "Immediate guidance", "Clinic directions"]}
            color="red"
          />
          <AnimatedFeatureCard
            icon={Heart}
            title="Clinic Locator"
            description="Find nearby vets instantly"
            items={["50+ verified clinics", "Real-time distance", "24/7 emergency"]}
            color="pink"
          />
          <AnimatedFeatureCard
            icon={BookOpen}
            title="Education Hub"
            description="Learn pet health & care"
            items={["Pet health guides", "Affordable medications", "Nutrition tips"]}
            color="green"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-12 text-center text-white space-y-6 shadow-2xl">
          <h3 className="text-4xl font-bold">Ready to Care for Your Pet? 🎉</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of pet lovers who trust PetCare AI with their furry friends
          </p>
          {isAuthenticated ? (
            <Link href="/ai-diagnosis">
              <Button size="lg" variant="secondary" className="gap-2 text-lg">
                Start Diagnosis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="gap-2 text-lg">
                Sign In to Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">PetCare AI</h4>
              <p className="text-sm">AI-powered veterinary care for every pet</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">AI Diagnosis</a></li>
                <li><a href="#" className="hover:text-white transition">Emergency Help</a></li>
                <li><a href="#" className="hover:text-white transition">Clinic Finder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 PetCare AI. Made with ❤️ for pets everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
