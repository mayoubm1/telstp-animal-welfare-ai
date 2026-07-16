import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar, Clock, MapPin, User, Phone, Loader2 } from "lucide-react";

interface Appointment {
  id: string;
  petName: string;
  vetName: string;
  clinicName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  reason: string;
}

export const AppointmentScheduling = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [activeTab, setActiveTab] = useState<"book" | "history">("book");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    vetName: "",
    clinicName: "",
    date: "",
    time: "",
    reason: "",
    phone: "",
  });

  const appointments: Appointment[] = [
    {
      id: "1",
      petName: "Buddy",
      vetName: "Dr. Ahmed",
      clinicName: "Happy Paws Clinic",
      date: "2026-07-20",
      time: "10:00 AM",
      status: "confirmed",
      reason: "Regular Checkup",
    },
    {
      id: "2",
      petName: "Whiskers",
      vetName: "Dr. Fatima",
      clinicName: "Pet Care Center",
      date: "2026-07-22",
      time: "2:00 PM",
      status: "pending",
      reason: "Vaccination",
    },
    {
      id: "3",
      petName: "Max",
      vetName: "Dr. Mohamed",
      clinicName: "Veterinary Plus",
      date: "2026-07-15",
      time: "11:30 AM",
      status: "completed",
      reason: "Dental Cleaning",
    },
  ];

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        language === "ar"
          ? "تم حجز الموعد بنجاح!"
          : "Appointment booked successfully!"
      );
      setFormData({
        petName: "",
        vetName: "",
        clinicName: "",
        date: "",
        time: "",
        reason: "",
        phone: "",
      });
      setIsLoading(false);
    }, 1500);
  };

  const statusColors = {
    confirmed: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-blue-500/20 text-blue-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  const statusLabels = {
    confirmed: { en: "Confirmed", ar: "مؤكد" },
    pending: { en: "Pending", ar: "قيد الانتظار" },
    completed: { en: "Completed", ar: "مكتمل" },
    cancelled: { en: "Cancelled", ar: "ملغى" },
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
        className="max-w-6xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600 mb-2">
            📅 {language === "ar" ? "حجز المواعيد" : "Appointment Scheduling"}
          </h1>
          <p className="text-gray-400">
            {language === "ar"
              ? "احجز موعداً مع الطبيب البيطري"
              : "Schedule an appointment with a veterinarian"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("book")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "book"
                ? "text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {language === "ar" ? "حجز جديد" : "Book New"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "history"
                ? "text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {language === "ar" ? "السجل" : "History"}
          </button>
        </div>

        {/* Book Tab */}
        {activeTab === "book" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {language === "ar" ? "تفاصيل الموعد" : "Appointment Details"}
                </h2>

                <form onSubmit={handleBookAppointment} className="space-y-4">
                  {/* Pet Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "اسم الحيوان الأليف" : "Pet Name"}
                    </label>
                    <Input
                      type="text"
                      value={formData.petName}
                      onChange={(e) =>
                        setFormData({ ...formData, petName: e.target.value })
                      }
                      placeholder={language === "ar" ? "أدخل اسم الحيوان الأليف" : "Enter pet name"}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  {/* Vet Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "اسم الطبيب البيطري" : "Veterinarian Name"}
                    </label>
                    <select
                      value={formData.vetName}
                      onChange={(e) =>
                        setFormData({ ...formData, vetName: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg"
                      required
                    >
                      <option value="">
                        {language === "ar" ? "اختر طبيباً بيطرياً" : "Select a vet"}
                      </option>
                      <option value="Dr. Ahmed">Dr. Ahmed</option>
                      <option value="Dr. Fatima">Dr. Fatima</option>
                      <option value="Dr. Mohamed">Dr. Mohamed</option>
                    </select>
                  </div>

                  {/* Clinic Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "اسم العيادة" : "Clinic Name"}
                    </label>
                    <select
                      value={formData.clinicName}
                      onChange={(e) =>
                        setFormData({ ...formData, clinicName: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg"
                      required
                    >
                      <option value="">
                        {language === "ar" ? "اختر عيادة" : "Select a clinic"}
                      </option>
                      <option value="Happy Paws Clinic">Happy Paws Clinic</option>
                      <option value="Pet Care Center">Pet Care Center</option>
                      <option value="Veterinary Plus">Veterinary Plus</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "التاريخ" : "Date"}
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "الوقت" : "Time"}
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "سبب الزيارة" : "Reason for Visit"}
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder={language === "ar" ? "أدخل سبب الزيارة" : "Enter reason for visit"}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {language === "ar" ? "جاري الحجز..." : "Booking..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>
                          {language === "ar" ? "احجز الموعد" : "Book Appointment"}
                        </span>
                      </>
                    )}
                  </Button>
                </form>
              </Card>

              {/* Info Section */}
              <div className="space-y-6">
                {/* Available Clinics */}
                <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{language === "ar" ? "العيادات المتاحة" : "Available Clinics"}</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "Happy Paws Clinic", location: "Cairo", distance: "2 km" },
                      { name: "Pet Care Center", location: "Giza", distance: "5 km" },
                      { name: "Veterinary Plus", location: "Helwan", distance: "8 km" },
                    ].map((clinic, idx) => (
                      <div key={idx} className="bg-blue-800/30 p-3 rounded-lg">
                        <p className="text-white font-semibold">{clinic.name}</p>
                        <p className="text-gray-300 text-sm">
                          {clinic.location} • {clinic.distance}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tips */}
                <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {language === "ar" ? "نصائح" : "Tips"}
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>
                      • {language === "ar"
                        ? "احجز الموعد قبل الزيارة بـ 24 ساعة على الأقل"
                        : "Book at least 24 hours in advance"}
                    </li>
                    <li>
                      • {language === "ar"
                        ? "أحضر سجل التطعيمات الخاص بحيوانك الأليف"
                        : "Bring your pet's vaccination records"}
                    </li>
                    <li>
                      • {language === "ar"
                        ? "وصل مبكراً بـ 10 دقائق"
                        : "Arrive 10 minutes early"}
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {appointments.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Info */}
                    <div className="space-y-2">
                      <p className="text-white font-bold text-lg">{apt.petName}</p>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{apt.vetName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{apt.clinicName}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{apt.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{apt.time}</span>
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {language === "ar" ? "السبب" : "Reason"}: {apt.reason}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <span
                        className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                          statusColors[apt.status]
                        }`}
                      >
                        {statusLabels[apt.status][language]}
                      </span>
                      <div className="flex space-x-2">
                        {apt.status === "confirmed" && (
                          <>
                            <Button variant="outline" className="text-sm">
                              {language === "ar" ? "تعديل" : "Reschedule"}
                            </Button>
                            <Button variant="outline" className="text-sm text-red-400">
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
