import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isArabic: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.diagnosis': 'AI Diagnosis',
    'nav.emergency': 'Emergency',
    'nav.clinics': 'Find Vets',
    'nav.education': 'Learn',
    'nav.caseHistory': 'Case History',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',

    // Home Page
    'home.title': 'Your Pet\'s Best Friend is Here! 🐾',
    'home.subtitle': 'Instant diagnosis, emergency guidance, and expert advice for your beloved cats and dogs. Powered by AI that cares as much as you do.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    'home.features': 'Everything Your Pet Needs 💚',
    'home.featuresDesc': 'From quick check-ups to emergency guidance, we\'ve got your furry friend covered',
    'home.aiDiagnosis': 'AI Diagnosis',
    'home.aiDiagnosisDesc': 'Smart symptom analysis',
    'home.emergency': 'Emergency Triage',
    'home.emergencyDesc': 'When every second counts',
    'home.clinicLocator': 'Clinic Locator',
    'home.clinicLocatorDesc': 'Find nearby vets instantly',
    'home.education': 'Education Hub',
    'home.educationDesc': 'Learn pet health & care',
    'home.ready': 'Ready to Care for Your Pet? 🎉',
    'home.readyDesc': 'Join thousands of pet lovers who trust PetCare AI with their furry friends',

    // Dashboard
    'dashboard.title': 'Your Pet\'s Health Dashboard',
    'dashboard.addPet': 'Add Pet',
    'dashboard.noPets': 'No pets yet. Add your first pet to get started!',
    'dashboard.petHealth': 'Pet Health',
    'dashboard.lastCheckup': 'Last Checkup',
    'dashboard.nextVaccine': 'Next Vaccine',
    'dashboard.viewDetails': 'View Details',

    // AI Diagnosis
    'diagnosis.title': 'AI Visual Diagnosis',
    'diagnosis.subtitle': 'Upload photos, videos, or describe symptoms for instant AI analysis',
    'diagnosis.uploadPhoto': 'Upload Photo',
    'diagnosis.uploadVideo': 'Upload Video',
    'diagnosis.recordAudio': 'Record Audio',
    'diagnosis.symptoms': 'Describe Symptoms',
    'diagnosis.analyze': 'Analyze',
    'diagnosis.analyzing': 'Analyzing...',
    'diagnosis.results': 'Diagnosis Results',
    'diagnosis.confidence': 'Confidence',
    'diagnosis.recommendation': 'Recommendation',
    'diagnosis.findVet': 'Find Nearby Vet',

    // Emergency Triage
    'emergency.title': 'Emergency Triage',
    'emergency.subtitle': 'Describe your pet\'s emergency symptoms for immediate evaluation',
    'emergency.quickAssessment': 'Quick Assessment',
    'emergency.criticalSigns': 'Critical Signs',
    'emergency.getAssessment': 'Get Emergency Assessment',
    'emergency.contacts': 'Emergency Contacts',
    'emergency.hotline': '24/7 Vet Hotline',
    'emergency.findClinic': 'Find Nearby Clinic',
    'emergency.responseTime': 'Response Time',
    'emergency.minutes': 'minutes for critical cases',

    // Clinic Locator
    'clinic.title': 'Find Nearby Veterinary Clinics',
    'clinic.search': 'Search clinics...',
    'clinic.filterType': 'Filter by type',
    'clinic.distance': 'Distance',
    'clinic.call': 'Call',
    'clinic.directions': 'Directions',
    'clinic.emergencyOnly': 'Emergency Clinics Only',
    'clinic.general': 'General',
    'clinic.emergency': 'Emergency',
    'clinic.specialty': 'Specialty',
    'clinic.hospital': 'Hospital',

    // Education Hub
    'education.title': 'Pet Health Education Hub',
    'education.overview': 'Overview',
    'education.medications': 'Medications',
    'education.nutrition': 'Nutrition',
    'education.search': 'Search topics...',
    'education.healthBasics': 'Pet Health Basics',
    'education.commonDiseases': 'Common Diseases',
    'education.prevention': 'Prevention & Wellness',
    'education.vaccination': 'Vaccination Schedule',
    'education.dentalCare': 'Dental Care',
    'education.affordableMeds': 'Affordable Medications',
    'education.genericAlternatives': 'Generic Alternatives',
    'education.savings': 'Save up to 40%',
    'education.nutritionGuides': 'Nutrition Guides',
    'education.feedingGuidelines': 'Feeding Guidelines',
    'education.byAge': 'By Age',
    'education.byBreed': 'By Breed',

    // Case History
    'caseHistory.title': 'Case History',
    'caseHistory.subtitle': 'View and manage your pet\'s medical records',
    'caseHistory.downloadReport': 'Download Report',
    'caseHistory.shareWithVet': 'Share with Vet',
    'caseHistory.symptoms': 'Symptoms',
    'caseHistory.severity': 'Severity',
    'caseHistory.diagnosis': 'Diagnosis',
    'caseHistory.treatment': 'Treatment',
    'caseHistory.status': 'Status',
    'caseHistory.resolved': 'Resolved',
    'caseHistory.inProgress': 'In Progress',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.diagnosis': 'التشخيص بالذكاء الاصطناعي',
    'nav.emergency': 'الطوارئ',
    'nav.clinics': 'ابحث عن الأطباء',
    'nav.education': 'التعليم',
    'nav.caseHistory': 'السجل الطبي',
    'nav.signin': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',

    // Home Page
    'home.title': 'أفضل صديق لحيوانك الأليف هنا! 🐾',
    'home.subtitle': 'تشخيص فوري، إرشادات الطوارئ، والنصائح الخبيرة لحيوانك الأليف المحبوب. مدعوم بالذكاء الاصطناعي الذي يهتم بقدر اهتمامك.',
    'home.getStarted': 'ابدأ الآن',
    'home.learnMore': 'تعرف على المزيد',
    'home.features': 'كل ما يحتاجه حيوانك الأليف 💚',
    'home.featuresDesc': 'من الفحوصات السريعة إلى إرشادات الطوارئ، نحن هنا لحيوانك الأليف',
    'home.aiDiagnosis': 'التشخيص بالذكاء الاصطناعي',
    'home.aiDiagnosisDesc': 'تحليل ذكي للأعراض',
    'home.emergency': 'فحص الطوارئ',
    'home.emergencyDesc': 'عندما تكون كل ثانية مهمة',
    'home.clinicLocator': 'موقع العيادة',
    'home.clinicLocatorDesc': 'ابحث عن الأطباء بالقرب منك',
    'home.education': 'مركز التعليم',
    'home.educationDesc': 'تعلم صحة الحيوانات الأليفة والعناية',
    'home.ready': 'هل أنت مستعد للعناية بحيوانك الأليف؟ 🎉',
    'home.readyDesc': 'انضم إلى آلاف محبي الحيوانات الأليفة الذين يثقون بـ PetCare AI',

    // Dashboard
    'dashboard.title': 'لوحة تحكم صحة حيوانك الأليف',
    'dashboard.addPet': 'إضافة حيوان أليف',
    'dashboard.noPets': 'لا توجد حيوانات أليفة حتى الآن. أضف حيوانك الأول للبدء!',
    'dashboard.petHealth': 'صحة الحيوان الأليف',
    'dashboard.lastCheckup': 'آخر فحص',
    'dashboard.nextVaccine': 'التطعيم التالي',
    'dashboard.viewDetails': 'عرض التفاصيل',

    // AI Diagnosis
    'diagnosis.title': 'التشخيص البصري بالذكاء الاصطناعي',
    'diagnosis.subtitle': 'حمّل الصور أو الفيديوهات أو صف الأعراض للحصول على تحليل فوري',
    'diagnosis.uploadPhoto': 'حمّل صورة',
    'diagnosis.uploadVideo': 'حمّل فيديو',
    'diagnosis.recordAudio': 'سجل صوت',
    'diagnosis.symptoms': 'صف الأعراض',
    'diagnosis.analyze': 'حلل',
    'diagnosis.analyzing': 'جاري التحليل...',
    'diagnosis.results': 'نتائج التشخيص',
    'diagnosis.confidence': 'الثقة',
    'diagnosis.recommendation': 'التوصية',
    'diagnosis.findVet': 'ابحث عن طبيب قريب',

    // Emergency Triage
    'emergency.title': 'فحص الطوارئ',
    'emergency.subtitle': 'صف أعراض طوارئ حيوانك الأليف للحصول على تقييم فوري',
    'emergency.quickAssessment': 'التقييم السريع',
    'emergency.criticalSigns': 'العلامات الحرجة',
    'emergency.getAssessment': 'احصل على تقييم الطوارئ',
    'emergency.contacts': 'جهات الاتصال في الطوارئ',
    'emergency.hotline': 'خط ساخن للأطباء 24/7',
    'emergency.findClinic': 'ابحث عن عيادة قريبة',
    'emergency.responseTime': 'وقت الاستجابة',
    'emergency.minutes': 'دقائق للحالات الحرجة',

    // Clinic Locator
    'clinic.title': 'ابحث عن عيادات بيطرية قريبة',
    'clinic.search': 'ابحث عن عيادات...',
    'clinic.filterType': 'فلتر حسب النوع',
    'clinic.distance': 'المسافة',
    'clinic.call': 'اتصل',
    'clinic.directions': 'الاتجاهات',
    'clinic.emergencyOnly': 'عيادات الطوارئ فقط',
    'clinic.general': 'عام',
    'clinic.emergency': 'طوارئ',
    'clinic.specialty': 'متخصص',
    'clinic.hospital': 'مستشفى',

    // Education Hub
    'education.title': 'مركز تعليم صحة الحيوانات الأليفة',
    'education.overview': 'نظرة عامة',
    'education.medications': 'الأدوية',
    'education.nutrition': 'التغذية',
    'education.search': 'ابحث عن المواضيع...',
    'education.healthBasics': 'أساسيات صحة الحيوانات الأليفة',
    'education.commonDiseases': 'الأمراض الشائعة',
    'education.prevention': 'الوقاية والعافية',
    'education.vaccination': 'جدول التطعيمات',
    'education.dentalCare': 'العناية بالأسنان',
    'education.affordableMeds': 'الأدوية بأسعار معقولة',
    'education.genericAlternatives': 'البدائل العامة',
    'education.savings': 'وفر حتى 40%',
    'education.nutritionGuides': 'أدلة التغذية',
    'education.feedingGuidelines': 'إرشادات التغذية',
    'education.byAge': 'حسب العمر',
    'education.byBreed': 'حسب السلالة',

    // Case History
    'caseHistory.title': 'السجل الطبي',
    'caseHistory.subtitle': 'عرض وإدارة السجلات الطبية لحيوانك الأليف',
    'caseHistory.downloadReport': 'تحميل التقرير',
    'caseHistory.shareWithVet': 'شارك مع الطبيب',
    'caseHistory.symptoms': 'الأعراض',
    'caseHistory.severity': 'الشدة',
    'caseHistory.diagnosis': 'التشخيص',
    'caseHistory.treatment': 'العلاج',
    'caseHistory.status': 'الحالة',
    'caseHistory.resolved': 'تم حلها',
    'caseHistory.inProgress': 'قيد التقدم',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.close': 'إغلاق',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isArabic: language === 'ar', t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
