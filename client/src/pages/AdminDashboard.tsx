import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, AlertCircle } from "lucide-react";

interface KPIMetric {
  label: string;
  labelAr: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export const AdminDashboard = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("month");

  const kpis: KPIMetric[] = [
    {
      label: "Total Users",
      labelAr: "إجمالي المستخدمين",
      value: 210,
      change: 12.5,
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Orders",
      labelAr: "إجمالي الطلبات",
      value: 342,
      change: 8.3,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Revenue",
      labelAr: "الإيرادات",
      value: "45,200 EGP",
      change: 15.7,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Active Clinics",
      labelAr: "العيادات النشطة",
      value: 32,
      change: 5.2,
      icon: <Activity className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const chartData = [
    { day: "Mon", revenue: 3200, orders: 25 },
    { day: "Tue", revenue: 3800, orders: 28 },
    { day: "Wed", revenue: 2900, orders: 22 },
    { day: "Thu", revenue: 4100, orders: 31 },
    { day: "Fri", revenue: 5200, orders: 38 },
    { day: "Sat", revenue: 4800, orders: 35 },
    { day: "Sun", revenue: 3900, orders: 29 },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            {language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}
          </h1>
          <p className="text-gray-400">
            {language === "ar" ? "مراقبة أداء النظام والإحصائيات" : "Monitor system performance and analytics"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="day">{language === "ar" ? "يوم" : "Day"}</option>
            <option value="week">{language === "ar" ? "أسبوع" : "Week"}</option>
            <option value="month">{language === "ar" ? "شهر" : "Month"}</option>
          </select>

          <Button
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
            className="text-sm"
          >
            EN
          </Button>
          <Button
            variant={language === "ar" ? "default" : "outline"}
            onClick={() => setLanguage("ar")}
            className="text-sm"
          >
            AR
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`bg-gradient-to-br ${kpi.color} bg-opacity-10 border-0 p-6`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`text-${kpi.color.split("-")[1]}-400`}>{kpi.icon}</div>
                <div
                  className={`text-sm font-semibold ${
                    kpi.change > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {kpi.change > 0 ? "+" : ""}{kpi.change}%
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">
                {language === "ar" ? kpi.labelAr : kpi.label}
              </p>
              <p className="text-white text-2xl font-bold">{kpi.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              {language === "ar" ? "الإيرادات اليومية" : "Daily Revenue"}
            </h3>
            <div className="space-y-4">
              {chartData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">{data.day}</span>
                    <span className="text-white font-semibold">{data.revenue} EGP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              {language === "ar" ? "الطلبات اليومية" : "Daily Orders"}
            </h3>
            <div className="space-y-4">
              {chartData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">{data.day}</span>
                    <span className="text-white font-semibold">{data.orders} {language === "ar" ? "طلب" : "orders"}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.orders / 40) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>{language === "ar" ? "صحة النظام" : "System Health"}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Uptime", labelAr: "وقت التشغيل", value: "99.98%", status: "good" },
              { label: "API Response", labelAr: "استجابة API", value: "145ms", status: "good" },
              { label: "Database", labelAr: "قاعدة البيانات", value: "Healthy", status: "good" },
              { label: "Storage", labelAr: "التخزين", value: "65%", status: "warning" },
            ].map((metric, idx) => (
              <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {language === "ar" ? metric.labelAr : metric.label}
                </p>
                <p className="text-white font-bold text-lg mb-2">{metric.value}</p>
                <div
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    metric.status === "good"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {metric.status === "good"
                    ? language === "ar"
                      ? "جيد"
                      : "Good"
                    : language === "ar"
                    ? "تحذير"
                    : "Warning"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-700/50 p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">
                {language === "ar" ? "تنبيهات" : "Alerts"}
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  • {language === "ar"
                    ? "استخدام التخزين 65% - يُنصح بتنظيف البيانات القديمة"
                    : "Storage usage at 65% - consider archiving old data"}
                </li>
                <li>
                  • {language === "ar"
                    ? "3 طلبات معلقة تحتاج إلى معالجة يدوية"
                    : "3 pending orders require manual processing"}
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
