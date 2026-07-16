import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, Camera, Loader2, AlertCircle } from "lucide-react";

interface DentalDetectionResult {
  condition: string;
  confidence: number;
  description: string;
  descriptionAr: string;
  severity: "mild" | "moderate" | "severe";
  teethCount: number;
  overallHealth: number;
  recommendations: string[];
  recommendationsAr: string[];
}

export const DentalDetectionUI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DentalDetectionResult | null>(null);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        analyzeDental(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDental = async (imageData: string) => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        condition: "Tartar Buildup",
        confidence: 0.92,
        description: "Significant tartar accumulation detected on teeth. Professional cleaning recommended.",
        descriptionAr: "تم اكتشاف تراكم كبير للجير على الأسنان. يُنصح بالتنظيف المهني.",
        severity: "moderate",
        teethCount: 42,
        overallHealth: 65,
        recommendations: [
          "Schedule professional dental cleaning",
          "Daily tooth brushing recommended",
          "Use dental chews for maintenance",
          "Regular veterinary check-ups",
        ],
        recommendationsAr: [
          "حدد موعد تنظيف أسنان احترافي",
          "يُنصح بتنظيف الأسنان يومياً",
          "استخدم علكات الأسنان للصيانة",
          "فحوصات بيطرية منتظمة",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const severityColors = {
    mild: "bg-green-500",
    moderate: "bg-yellow-500",
    severe: "bg-red-500",
  };

  const severityLabels = {
    mild: { en: "Mild", ar: "خفيف" },
    moderate: { en: "Moderate", ar: "متوسط" },
    severe: { en: "Severe", ar: "شديد" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={() => setLanguage("en")}
          className="text-sm"
        >
          English
        </Button>
        <Button
          variant={language === "ar" ? "default" : "outline"}
          onClick={() => setLanguage("ar")}
          className="text-sm"
        >
          العربية
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 mb-2">
            🦷 {language === "ar" ? "كشف حالات الأسنان" : "Dental Condition Detection"}
          </h1>
          <p className="text-gray-400">
            {language === "ar"
              ? "قم بتحميل صورة لأسنان حيوانك الأليف للتحليل"
              : "Upload an image of your pet's teeth for analysis"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            className="bg-gradient-to-br from-pink-900 to-rose-900 rounded-lg p-8"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === "ar" ? "تحميل الصورة" : "Upload Image"}
            </h2>

            {/* Image Preview */}
            {selectedImage ? (
              <div className="mb-6">
                <img
                  src={selectedImage}
                  alt="Dental preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="mb-6 w-full h-64 bg-pink-800/30 border-2 border-dashed border-pink-400 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                  <p className="text-gray-300">
                    {language === "ar" ? "لا توجد صورة محددة" : "No image selected"}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>{language === "ar" ? "اختر صورة" : "Choose Image"}</span>
                </Button>
              </label>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>{language === "ar" ? "التقط صورة" : "Take Photo"}</span>
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="bg-gradient-to-br from-rose-900 to-pink-900 rounded-lg p-8"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === "ar" ? "النتائج" : "Analysis Results"}
            </h2>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-pink-400" />
                <p className="text-gray-300">
                  {language === "ar" ? "جاري التحليل..." : "Analyzing..."}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Severity Badge */}
                <div className={`${severityColors[result.severity]} text-white px-4 py-2 rounded-lg font-semibold`}>
                  {severityLabels[result.severity][language]}
                </div>

                {/* Condition */}
                <div>
                  <p className="text-gray-400 text-sm">
                    {language === "ar" ? "الحالة" : "Condition"}
                  </p>
                  <p className="text-white font-semibold text-lg">{result.condition}</p>
                </div>

                {/* Confidence */}
                <div>
                  <p className="text-gray-400 text-sm">
                    {language === "ar" ? "مستوى الثقة" : "Confidence"}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-white font-semibold mt-1">
                    {(result.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                {/* Teeth Count */}
                <div>
                  <p className="text-gray-400 text-sm">
                    {language === "ar" ? "عدد الأسنان" : "Teeth Count"}
                  </p>
                  <p className="text-white font-semibold">{result.teethCount}</p>
                </div>

                {/* Overall Health */}
                <div>
                  <p className="text-gray-400 text-sm">
                    {language === "ar" ? "الصحة العامة" : "Overall Health"}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${result.overallHealth}%` }}
                    />
                  </div>
                  <p className="text-white font-semibold mt-1">{result.overallHealth}%</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-400 text-sm">
                    {language === "ar" ? "الوصف" : "Description"}
                  </p>
                  <p className="text-white mt-1">
                    {language === "ar" ? result.descriptionAr : result.description}
                  </p>
                </div>

                {/* Recommendations */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">
                    {language === "ar" ? "التوصيات" : "Recommendations"}
                  </p>
                  <ul className="space-y-1">
                    {(language === "ar" ? result.recommendationsAr : result.recommendations).map(
                      (rec, idx) => (
                        <li key={idx} className="text-white flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {language === "ar" ? "حجز موعد بيطري" : "Book Vet Appointment"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {language === "ar" ? "حفظ النتيجة" : "Save Result"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500" />
                <p className="text-gray-400">
                  {language === "ar"
                    ? "قم بتحميل صورة لبدء التحليل"
                    : "Upload an image to start analysis"}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {language === "ar" ? "حالات الأسنان الشائعة" : "Common Dental Conditions"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Tartar", nameAr: "الجير", icon: "🟤" },
              { name: "Gingivitis", nameAr: "التهاب اللثة", icon: "🔴" },
              { name: "Tooth Loss", nameAr: "فقدان الأسنان", icon: "⚪" },
            ].map((condition, idx) => (
              <Card key={idx} className="bg-gray-700/50 border-gray-600 p-4">
                <div className="text-3xl mb-2">{condition.icon}</div>
                <p className="text-white font-semibold">
                  {language === "ar" ? condition.nameAr : condition.name}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
