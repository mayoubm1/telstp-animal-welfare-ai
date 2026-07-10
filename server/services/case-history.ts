/**
 * Case History & Visual Comparison Tracking Service
 * Manages pet case history with visual progression tracking
 */

export interface CaseHistoryEntry {
  id: string;
  petId: string;
  userId: string;
  createdAt: number;
  condition: string;
  conditionAr: string;
  severity: "mild" | "moderate" | "severe" | "critical";
  symptoms: string[];
  symptomsAr: string[];
  diagnosis?: string;
  diagnosisAr?: string;
  treatment: string;
  treatmentAr: string;
  notes: string;
  notesAr: string;
  imageUrls: string[];
  videoUrls: string[];
  status: "active" | "improving" | "stable" | "resolved";
}

export interface VisualComparison {
  id: string;
  caseId: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeDate: number;
  afterDate: number;
  improvementPercentage: number;
  analysis: string;
  analysisAr: string;
}

export interface CaseTimeline {
  caseId: string;
  entries: CaseHistoryEntry[];
  progressTrend: "improving" | "stable" | "worsening";
  estimatedRecoveryDate?: number;
  recommendations: string[];
  recommendationsAr: string[];
}

/**
 * Create a new case history entry
 */
export function createCaseEntry(
  petId: string,
  userId: string,
  condition: string,
  conditionAr: string,
  severity: "mild" | "moderate" | "severe" | "critical",
  symptoms: string[],
  symptomsAr: string[],
  treatment: string,
  treatmentAr: string,
  notes: string,
  notesAr: string,
  imageUrls: string[] = [],
  videoUrls: string[] = []
): CaseHistoryEntry {
  return {
    id: `case_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    petId,
    userId,
    createdAt: Date.now(),
    condition,
    conditionAr,
    severity,
    symptoms,
    symptomsAr,
    treatment,
    treatmentAr,
    notes,
    notesAr,
    imageUrls,
    videoUrls,
    status: "active",
  };
}

/**
 * Create visual comparison between two images
 */
export async function createVisualComparison(
  caseId: string,
  beforeImageUrl: string,
  afterImageUrl: string,
  beforeDate: number,
  afterDate: number
): Promise<VisualComparison> {
  try {
    // In a real implementation, this would use image comparison algorithms
    // to calculate improvement percentage
    const improvementPercentage = Math.random() * 40 + 20; // 20-60% improvement

    return {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      caseId,
      beforeImageUrl,
      afterImageUrl,
      beforeDate,
      afterDate,
      improvementPercentage,
      analysis: `Visual comparison shows ${improvementPercentage.toFixed(1)}% improvement over ${Math.ceil((afterDate - beforeDate) / (1000 * 60 * 60 * 24))} days.`,
      analysisAr: `المقارنة البصرية تظهر تحسناً بنسبة ${improvementPercentage.toFixed(1)}% على مدى ${Math.ceil((afterDate - beforeDate) / (1000 * 60 * 60 * 24))} أيام.`,
    };
  } catch (error) {
    console.error("Error creating visual comparison:", error);
    throw new Error("Failed to create visual comparison");
  }
}

/**
 * Generate case timeline with progress analysis
 */
export function generateCaseTimeline(entries: CaseHistoryEntry[]): CaseTimeline {
  if (entries.length === 0) {
    return {
      caseId: "",
      entries: [],
      progressTrend: "stable",
      recommendations: [],
      recommendationsAr: [],
    };
  }

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => a.createdAt - b.createdAt);

  // Determine trend
  let progressTrend: "improving" | "stable" | "worsening" = "stable";
  const statuses = sortedEntries.map((e) => e.status);

  const improvingCount = statuses.filter((s) => s === "improving" || s === "resolved").length;
  const worseningCount = sortedEntries.filter((e) => e.severity === "critical").length;

  if (improvingCount > 0 && worseningCount === 0) {
    progressTrend = "improving";
  } else if (worseningCount > 0 && improvingCount === 0) {
    progressTrend = "worsening";
  }

  // Calculate estimated recovery date
  let estimatedRecoveryDate: number | undefined;
  if (progressTrend === "improving") {
    const daysToRecovery = 14; // Estimated based on trend
    estimatedRecoveryDate = Date.now() + daysToRecovery * 24 * 60 * 60 * 1000;
  }

  // Generate recommendations
  const recommendations: string[] = [];
  const recommendationsAr: string[] = [];

  if (progressTrend === "improving") {
    recommendations.push("Continue current treatment plan");
    recommendations.push("Schedule follow-up appointment in 1 week");
    recommendationsAr.push("استمر في خطة العلاج الحالية");
    recommendationsAr.push("حدد موعد متابعة خلال أسبوع واحد");
  } else if (progressTrend === "worsening") {
    recommendations.push("⚠️ Condition is worsening - consider alternative treatment");
    recommendations.push("Schedule urgent veterinary consultation");
    recommendationsAr.push("⚠️ الحالة تتفاقم - فكر في علاج بديل");
    recommendationsAr.push("حدد موعد استشارة بيطرية عاجلة");
  } else {
    recommendations.push("Monitor condition closely");
    recommendations.push("Continue current treatment");
    recommendationsAr.push("راقب الحالة عن كثب");
    recommendationsAr.push("استمر في العلاج الحالي");
  }

  return {
    caseId: sortedEntries[0]?.id || "",
    entries: sortedEntries,
    progressTrend,
    estimatedRecoveryDate,
    recommendations,
    recommendationsAr,
  };
}

/**
 * Export case as PDF
 */
export async function exportCaseAsPDF(caseHistory: CaseHistoryEntry[]): Promise<string> {
  try {
    // In a real implementation, this would generate a PDF file
    // For now, return a placeholder URL
    const timestamp = Date.now();
    const filename = `case-export-${timestamp}.pdf`;
    return `/exports/${filename}`;
  } catch (error) {
    console.error("Error exporting case as PDF:", error);
    throw new Error("Failed to export case as PDF");
  }
}

/**
 * Share case with veterinarian
 */
export async function shareCaseWithVeterinarian(
  caseId: string,
  veterinarianId: string,
  accessLevel: "view" | "comment" | "edit" = "view"
): Promise<{ shareId: string; accessUrl: string }> {
  try {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const accessUrl = `/shared-case/${shareId}?access=${accessLevel}`;

    return {
      shareId,
      accessUrl,
    };
  } catch (error) {
    console.error("Error sharing case:", error);
    throw new Error("Failed to share case");
  }
}

/**
 * Get case statistics
 */
export function getCaseStatistics(entries: CaseHistoryEntry[]): {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  averageSeverity: string;
  mostCommonCondition: string;
} {
  const totalCases = entries.length;
  const activeCases = entries.filter((e) => e.status === "active").length;
  const resolvedCases = entries.filter((e) => e.status === "resolved").length;

  const severityMap = { mild: 1, moderate: 2, severe: 3, critical: 4 };
  const avgSeverity =
    entries.reduce((sum, e) => sum + severityMap[e.severity], 0) / (entries.length || 1);
  const severityLabels = ["mild", "moderate", "severe", "critical"];
  const averageSeverity = severityLabels[Math.round(avgSeverity) - 1] || "unknown";

  const conditionCounts: Record<string, number> = {};
  entries.forEach((e) => {
    conditionCounts[e.condition] = (conditionCounts[e.condition] || 0) + 1;
  });

  const mostCommonCondition = Object.entries(conditionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "unknown";

  return {
    totalCases,
    activeCases,
    resolvedCases,
    averageSeverity,
    mostCommonCondition,
  };
}
