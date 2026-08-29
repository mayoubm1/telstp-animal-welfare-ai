import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  userGrowth: GrowthMetric[];
  revenueGrowth: GrowthMetric[];
  clinicMetrics: ClinicMetric[];
  systemHealth: SystemHealth;
}

export interface TopProduct {
  name: string;
  nameAr: string;
  sales: number;
  revenue: number;
  trend: "up" | "down" | "stable";
}

export interface GrowthMetric {
  date: string;
  value: number;
  percentChange: number;
}

export interface ClinicMetric {
  clinicId: string;
  clinicName: string;
  appointmentsThisMonth: number;
  averageRating: number;
  totalReviews: number;
  revenue: number;
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  errorRate: number;
  avgResponseTime: number;
  activeConnections: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Get user count
    const db = await getDb();
    if (!db) throw new Error("Database not initialized");
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const totalUsers = userCount[0]?.count || 0;

    // Mock order metrics
    const totalOrders = 342;
    const totalRevenue = 45200;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Mock top products
    const topProducts: TopProduct[] = [
      {
        name: "Premium Dog Food",
        nameAr: "طعام الكلاب المميز",
        sales: 156,
        revenue: 7164.44,
        trend: "up",
      },
      {
        name: "Training Leash",
        nameAr: "حبل التدريب",
        sales: 89,
        revenue: 2669.11,
        trend: "stable",
      },
      {
        name: "Omega-3 Fish Oil",
        nameAr: "زيت السمك أوميغا 3",
        sales: 124,
        revenue: 4340,
        trend: "up",
      },
    ];

    // Mock growth metrics
    const userGrowth: GrowthMetric[] = [
      { date: "2026-01-01", value: 150, percentChange: 5.2 },
      { date: "2026-01-08", value: 158, percentChange: 5.3 },
      { date: "2026-01-15", value: 172, percentChange: 8.9 },
      { date: "2026-01-22", value: 189, percentChange: 9.9 },
      { date: "2026-01-29", value: 210, percentChange: 11.1 },
    ];

    const revenueGrowth: GrowthMetric[] = [
      { date: "2026-01-01", value: 2500, percentChange: 8.5 },
      { date: "2026-01-08", value: 2850, percentChange: 14 },
      { date: "2026-01-15", value: 3200, percentChange: 12.3 },
      { date: "2026-01-22", value: 3750, percentChange: 17.2 },
      { date: "2026-01-29", value: 4200, percentChange: 12 },
    ];

    // Mock clinic metrics
    const clinicMetrics: ClinicMetric[] = [
      {
        clinicId: "1",
        clinicName: "Cairo Vet Clinic",
        appointmentsThisMonth: 87,
        averageRating: 4.8,
        totalReviews: 156,
        revenue: 45000,
      },
      {
        clinicId: "2",
        clinicName: "Alexandria Animal Hospital",
        appointmentsThisMonth: 62,
        averageRating: 4.6,
        totalReviews: 98,
        revenue: 32000,
      },
      {
        clinicId: "3",
        clinicName: "Giza Pet Care",
        appointmentsThisMonth: 45,
        averageRating: 4.5,
        totalReviews: 67,
        revenue: 28000,
      },
    ];

    // System health
    const systemHealth: SystemHealth = {
      status: "healthy",
      uptime: 99.98,
      errorRate: 0.02,
      avgResponseTime: 145,
      activeConnections: 234,
    };

    return {
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.65),
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topProducts,
      userGrowth,
      revenueGrowth,
      clinicMetrics,
      systemHealth,
    };
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    throw error;
  }
}

export async function getRevenueAnalytics(days: number = 30) {
  try {
    const analytics = {
      period: `Last ${days} days`,
      periodAr: `آخر ${days} يوم`,
      totalRevenue: 45200,
      totalOrders: 342,
      averageOrderValue: 132.16,
      topPaymentMethod: "Credit Card",
      topPaymentMethodAr: "بطاقة ائتمان",
      conversionRate: 3.2,
      customerAcquisitionCost: 25.5,
      customerLifetimeValue: 850,
      returnRate: 2.1,
      profitMargin: 35.5,
      dailyBreakdown: generateDailyBreakdown(days),
    };

    return analytics;
  } catch (error) {
    console.error("Error getting revenue analytics:", error);
    throw error;
  }
}

export async function getUserAnalytics() {
  try {
    const analytics = {
      totalUsers: 210,
      newUsersThisMonth: 45,
      activeUsersThisMonth: 156,
      churnRate: 2.1,
      engagementRate: 68.5,
      averageSessionDuration: 12.5,
      bounceRate: 15.2,
      topCountries: [
        { country: "Egypt", countryAr: "مصر", users: 180, percentage: 85.7 },
        { country: "UAE", countryAr: "الإمارات", users: 20, percentage: 9.5 },
        { country: "Saudi Arabia", countryAr: "السعودية", users: 10, percentage: 4.8 },
      ],
      userSegments: [
        {
          segment: "Pet Owners",
          segmentAr: "أصحاب الحيوانات الأليفة",
          count: 150,
          percentage: 71.4,
        },
        { segment: "Veterinarians", segmentAr: "الأطباء البيطريين", count: 40, percentage: 19 },
        { segment: "Clinics", segmentAr: "العيادات", count: 20, percentage: 9.5 },
      ],
    };

    return analytics;
  } catch (error) {
    console.error("Error getting user analytics:", error);
    throw error;
  }
}

export async function getProductAnalytics() {
  try {
    const analytics = {
      totalProducts: 89,
      activeProducts: 76,
      outOfStockProducts: 5,
      topSellingCategories: [
        {
          category: "Natural Alternatives",
          categoryAr: "البدائل الطبيعية",
          sales: 245,
          revenue: 8500,
        },
        { category: "Supplements", categoryAr: "المكملات", sales: 189, revenue: 6200 },
        {
          category: "Training Equipment",
          categoryAr: "معدات التدريب",
          sales: 156,
          revenue: 4800,
        },
      ],
      lowStockProducts: [
        { name: "Premium Dog Food", stock: 5, reorderLevel: 20 },
        { name: "Training Leash", stock: 8, reorderLevel: 15 },
      ],
      productPerformance: [
        {
          name: "Premium Dog Food",
          nameAr: "طعام الكلاب المميز",
          rating: 4.8,
          reviews: 156,
          sales: 245,
        },
        {
          name: "Omega-3 Fish Oil",
          nameAr: "زيت السمك أوميغا 3",
          rating: 4.6,
          reviews: 89,
          sales: 124,
        },
        {
          name: "Training Leash",
          nameAr: "حبل التدريب",
          rating: 4.5,
          reviews: 67,
          sales: 89,
        },
      ],
    };

    return analytics;
  } catch (error) {
    console.error("Error getting product analytics:", error);
    throw error;
  }
}

function generateDailyBreakdown(days: number) {
  const breakdown = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    breakdown.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.random() * 2000 + 1000,
      orders: Math.floor(Math.random() * 20) + 5,
      users: Math.floor(Math.random() * 50) + 10,
    });
  }
  return breakdown.reverse();
}
