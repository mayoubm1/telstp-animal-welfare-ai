import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Sparkles, Heart, BookOpen, MapPin, Stethoscope, Brain, Leaf, Dumbbell, Award } from 'lucide-react';

export default function HomeV3() {
  const { language, t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const isArabic = language === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-amber-950 to-slate-900 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              TELSTP
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero Section with Cinematic Background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-slate-900/50" />
        
        {/* Golden glow effect */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
            {/* Left: Text Content */}
            <div className={`space-y-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-1000`}>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                    {isArabic ? 'رحلة الشفاء' : 'Journey to Healing'}
                  </span>
                </h1>
                <p className="text-xl text-amber-100/80 leading-relaxed">
                  {isArabic 
                    ? 'اكتشف قوة الذكاء الاصطناعي والحكمة البيطرية لرعاية حيوانك الأليف بحب وعناية'
                    : 'Discover the power of AI and veterinary wisdom to care for your beloved pet'}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/dashboard">
                  <button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all duration-300">
                    {isArabic ? 'ابدأ الآن' : 'Get Started'}
                  </button>
                </Link>
                <Link href="/education">
                  <button className="px-8 py-3 border-2 border-amber-400 text-amber-200 font-bold rounded-lg hover:bg-amber-400/10 transition-all duration-300">
                    {isArabic ? 'تعلم المزيد' : 'Learn More'}
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Cinematic Image */}
            <div className={`relative h-96 md:h-full flex items-center justify-center ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-1000 delay-300`}>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-600/20 rounded-2xl blur-2xl" />
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663088192530/bwEVh3xKPYZhJbxfrT7JDG/golden-dog-mystical-FVJkiXvaqu5qT5LvCJgHnM.webp"
                alt="Golden Dog Mystical"
                className="relative w-full h-full object-cover rounded-2xl shadow-2xl shadow-amber-400/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mystical Pet Characters Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              {isArabic ? 'شخصياتنا السحرية' : 'Our Mystical Guardians'}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Golden Dog */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-64 h-64 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-3xl" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663088192530/bwEVh3xKPYZhJbxfrT7JDG/golden-dog-mystical-FVJkiXvaqu5qT5LvCJgHnM.webp"
                  alt="Golden Dog Guardian"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl shadow-amber-400/50"
                />
              </div>
              <h3 className="text-2xl font-bold text-amber-200 mb-2">{isArabic ? 'الكلب الذهبي' : 'The Golden Guardian'}</h3>
              <p className="text-amber-100/60 max-w-xs">{isArabic ? 'حامي صحة حيوانك الأليف بالحكمة والحب' : 'Protector of your pet\'s health with wisdom and love'}</p>
            </div>

            {/* Golden Cat */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-64 h-64 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-3xl" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663088192530/bwEVh3xKPYZhJbxfrT7JDG/golden-cat-mystical-GxmavPGov8MLTQgNvWHDnT.webp"
                  alt="Golden Cat Guardian"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl shadow-amber-400/50"
                />
              </div>
              <h3 className="text-2xl font-bold text-amber-200 mb-2">{isArabic ? 'القطة الذهبية' : 'The Mystical Sage'}</h3>
              <p className="text-amber-100/60 max-w-xs">{isArabic ? 'دليلك الروحي في رحلة الشفاء' : 'Your spiritual guide in the healing journey'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section - First Row */}
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              {isArabic ? 'الميزات السحرية' : 'Magical Features'}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Natural Alternatives */}
            <Link href="/natural-alternatives">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <Leaf className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'البدائل الطبيعية' : 'Natural Alternatives'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'منتجات طبيعية وآمنة لحيوانك' : 'Natural & safe products for your pet'}</p>
                </div>
              </div>
            </Link>

            {/* Feature 2: Training Programs */}
            <Link href="/training-programs">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <Dumbbell className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'برامج التدريب' : 'Training Programs'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'تدريب متقدم وأنشطة يومية' : 'Advanced training & daily activities'}</p>
                </div>
              </div>
            </Link>

            {/* Feature 3: Best Practices */}
            <Link href="/best-practices">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <Award className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'أفضل الممارسات' : 'Best Practices'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'نصائح خبراء عالمية معتمدة' : 'Expert global guidelines & tips'}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Features Section - Second Row */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 4: AI Diagnosis */}
            <Link href="/ai-diagnosis">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <Brain className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'التشخيص الذكي' : 'AI Diagnosis'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'تحليل ذكي للأعراض مع الصور والصوت' : 'Smart symptom analysis with photos and audio'}</p>
                </div>
              </div>
            </Link>

            {/* Feature 5: Clinic Locator */}
            <Link href="/clinic-locator">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <MapPin className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'محدد العيادات' : 'Clinic Locator'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'ابحث عن أقرب عيادة بيطرية' : 'Find nearest veterinary clinics'}</p>
                </div>
              </div>
            </Link>

            {/* Feature 6: Education Hub */}
            <Link href="/education">
              <div className="group relative p-8 bg-gradient-to-br from-amber-900/20 to-slate-900/40 rounded-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-400/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:via-amber-400/5 group-hover:to-amber-400/10 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <BookOpen className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">{isArabic ? 'مركز التعليم' : 'Education Hub'}</h3>
                  <p className="text-amber-100/60">{isArabic ? 'تعلم عن صحة حيوانك الأليف' : 'Learn pet health & care tips'}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-amber-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-amber-100/60">
          <p>{isArabic ? '© 2026 تلستب - رعاية الحيوانات الأليفة بالحب والحكمة' : '© 2026 TELSTP - Pet Care with Love & Wisdom'}</p>
        </div>
      </footer>
    </div>
  );
}
