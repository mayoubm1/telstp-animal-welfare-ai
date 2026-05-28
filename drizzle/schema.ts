import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with veterinary-specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "veterinarian"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["pet_owner", "veterinarian", "clinic"]).default("pet_owner").notNull(),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  language: mysqlEnum("language", ["en", "ar"]).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pet profiles for pet owners
 */
export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  species: mysqlEnum("species", ["cat", "dog"]).notNull(),
  breed: varchar("breed", { length: 255 }),
  age: int("age"), // in months
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  color: varchar("color", { length: 255 }),
  microchipId: varchar("microchipId", { length: 255 }),
  vaccinationStatus: mysqlEnum("vaccinationStatus", ["up_to_date", "overdue", "unknown"]).default("unknown"),
  lastVaccinationDate: timestamp("lastVaccinationDate"),
  medicalHistory: longtext("medicalHistory"),
  allergies: longtext("allergies"),
  currentMedications: longtext("currentMedications"),
  profileImageUrl: varchar("profileImageUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

/**
 * Case history - tracks symptoms, diagnoses, and treatments for each pet
 */
export const caseHistory = mysqlTable("caseHistory", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  userId: int("userId").notNull(),
  symptoms: longtext("symptoms").notNull(),
  symptomOnsetDate: timestamp("symptomOnsetDate"),
  severity: mysqlEnum("severity", ["mild", "moderate", "severe", "critical"]).notNull(),
  triageLevel: mysqlEnum("triageLevel", ["home_care", "urgent_vet", "emergency"]),
  aiDiagnosis: longtext("aiDiagnosis"),
  veterinarianDiagnosis: longtext("veterinarianDiagnosis"),
  treatment: longtext("treatment"),
  outcome: mysqlEnum("outcome", ["resolved", "ongoing", "referred", "hospitalized", "unknown"]),
  veterinarianId: int("veterinarianId"),
  consultationRequested: boolean("consultationRequested").default(false),
  imageUrls: json("imageUrls"), // Array of image URLs for visual diagnosis
  voiceTranscription: longtext("voiceTranscription"),
  notes: longtext("notes"),
  followUpDate: timestamp("followUpDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaseHistory = typeof caseHistory.$inferSelect;
export type InsertCaseHistory = typeof caseHistory.$inferInsert;

/**
 * Disease database - comprehensive reference for conditions
 */
export const diseases = mysqlTable("diseases", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  category: mysqlEnum("category", [
    "respiratory",
    "gastrointestinal",
    "infectious",
    "dermatological",
    "neurological",
    "cardiovascular",
    "renal",
    "hepatic",
    "behavioral",
    "parasitic",
    "neoplastic",
    "other"
  ]).notNull(),
  affectedSpecies: mysqlEnum("affectedSpecies", ["cat", "dog", "both"]).notNull(),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  symptoms: longtext("symptoms"), // JSON array of common symptoms
  symptomsAr: longtext("symptomsAr"),
  diagnosticTests: longtext("diagnosticTests"), // Recommended diagnostic procedures
  treatmentProtocol: longtext("treatmentProtocol"),
  medications: longtext("medications"), // JSON array of medications with dosages
  prognosis: longtext("prognosis"),
  zoonotic: boolean("zoonotic").default(false),
  zoonoticRisk: text("zoonoticRisk"), // Description of zoonotic transmission
  preventionMeasures: longtext("preventionMeasures"),
  referenceImages: json("referenceImages"), // Array of image URLs
  referenceVideos: json("referenceVideos"), // Array of video URLs
  sources: longtext("sources"), // Academic sources and references
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Disease = typeof diseases.$inferSelect;
export type InsertDisease = typeof diseases.$inferInsert;

/**
 * Educational content library
 */
export const educationalContent = mysqlTable("educationalContent", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  category: mysqlEnum("category", [
    "preventive_care",
    "vaccination",
    "nutrition",
    "behavior",
    "emergency_care",
    "zoonotic_diseases",
    "breed_specific",
    "life_stage"
  ]).notNull(),
  content: longtext("content"),
  contentAr: longtext("contentAr"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  videoUrl: varchar("videoUrl", { length: 512 }),
  author: varchar("author", { length: 255 }),
  sources: longtext("sources"),
  targetAudience: mysqlEnum("targetAudience", ["pet_owner", "veterinarian", "both"]).default("pet_owner"),
  relatedDiseaseIds: json("relatedDiseaseIds"), // Array of disease IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = typeof educationalContent.$inferInsert;

/**
 * Veterinarian profiles
 */
export const veterinarians = mysqlTable("veterinarians", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  licenseNumber: varchar("licenseNumber", { length: 255 }).notNull().unique(),
  specializations: json("specializations"), // Array of specializations
  clinicName: varchar("clinicName", { length: 255 }),
  clinicAddress: varchar("clinicAddress", { length: 512 }),
  clinicPhone: varchar("clinicPhone", { length: 20 }),
  clinicEmail: varchar("clinicEmail", { length: 320 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  availability: json("availability"), // JSON object with availability schedule
  consultationFee: decimal("consultationFee", { precision: 8, scale: 2 }),
  bio: longtext("bio"),
  bioAr: longtext("bioAr"),
  profileImageUrl: varchar("profileImageUrl", { length: 512 }),
  verified: boolean("verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  totalConsultations: int("totalConsultations").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Veterinarian = typeof veterinarians.$inferSelect;
export type InsertVeterinarian = typeof veterinarians.$inferInsert;

/**
 * Consultation requests from pet owners to veterinarians
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  caseHistoryId: int("caseHistoryId").notNull(),
  petOwnerId: int("petOwnerId").notNull(),
  veterinarianId: int("veterinarianId"),
  status: mysqlEnum("status", ["pending", "accepted", "in_progress", "completed", "declined"]).default("pending"),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
  completedAt: timestamp("completedAt"),
  veterinarianNotes: longtext("veterinarianNotes"),
  recommendation: longtext("recommendation"),
  followUpRequired: boolean("followUpRequired").default(false),
  followUpDate: timestamp("followUpDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * Emergency triage cases - tracks critical and urgent cases
 */
export const emergencyTriageCases = mysqlTable("emergencyTriageCases", {
  id: int("id").autoincrement().primaryKey(),
  caseHistoryId: int("caseHistoryId").notNull(),
  petId: int("petId").notNull(),
  userId: int("userId").notNull(),
  triageLevel: mysqlEnum("triageLevel", ["urgent", "critical", "life_threatening"]).notNull(),
  reason: longtext("reason").notNull(),
  symptoms: longtext("symptoms"),
  estimatedSeverity: decimal("estimatedSeverity", { precision: 3, scale: 2 }),
  recommendedAction: mysqlEnum("recommendedAction", [
    "immediate_vet_visit",
    "emergency_clinic",
    "call_vet_first",
    "monitor_closely"
  ]).notNull(),
  nearestClinicId: int("nearestClinicId"),
  nearestClinicDistance: decimal("nearestClinicDistance", { precision: 8, scale: 2 }),
  alertSentToVets: boolean("alertSentToVets").default(false),
  alertSentAt: timestamp("alertSentAt"),
  assignedVeterinarianId: int("assignedVeterinarianId"),
  status: mysqlEnum("status", ["pending", "acknowledged", "in_progress", "resolved", "escalated"]).default("pending"),
  notes: longtext("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmergencyTriageCase = typeof emergencyTriageCases.$inferSelect;
export type InsertEmergencyTriageCase = typeof emergencyTriageCases.$inferInsert;

/**
 * Veterinary clinics and hospitals directory
 */
export const vetClinics = mysqlTable("vetClinics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  address: varchar("address", { length: 512 }).notNull(),
  addressAr: varchar("addressAr", { length: 512 }),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  clinicType: mysqlEnum("clinicType", ["general", "emergency", "specialty", "hospital"]).default("general"),
  specialties: json("specialties"), // Array of specialties
  operatingHours: json("operatingHours"), // JSON object with hours
  emergencyServices: boolean("emergencyServices").default(false),
  surgeryCapable: boolean("surgeryCapable").default(false),
  imagingServices: boolean("imagingServices").default(false),
  labServices: boolean("labServices").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  totalReviews: int("totalReviews").default(0),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VetClinic = typeof vetClinics.$inferSelect;
export type InsertVetClinic = typeof vetClinics.$inferInsert;

/**
 * System notifications for critical cases and feedback
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["critical_case", "consultation_request", "feedback", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content"),
  relatedCaseId: int("relatedCaseId"),
  relatedConsultationId: int("relatedConsultationId"),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Diagnostic images for reference and training
 */
export const diagnosticImages = mysqlTable("diagnosticImages", {
  id: int("id").autoincrement().primaryKey(),
  diseaseId: int("diseaseId"),
  condition: varchar("condition", { length: 255 }).notNull(),
  conditionAr: varchar("conditionAr", { length: 255 }),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  species: mysqlEnum("species", ["cat", "dog", "both"]).notNull(),
  imageType: mysqlEnum("imageType", ["clinical", "histopathology", "radiograph", "ultrasound", "endoscopy"]),
  source: varchar("source", { length: 255 }),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiagnosticImage = typeof diagnosticImages.$inferSelect;
export type InsertDiagnosticImage = typeof diagnosticImages.$inferInsert;

/**
 * Natural alternatives marketplace - organic food, supplies, activities
 */
export const naturalAlternatives = mysqlTable("naturalAlternatives", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  category: mysqlEnum("category", [
    "organic_food",
    "natural_treats",
    "eco_supplies",
    "toys_enrichment",
    "grooming",
    "training_tools",
    "supplements",
    "bedding"
  ]).notNull(),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  benefits: json("benefits"), // Array of benefits
  benefitsAr: json("benefitsAr"),
  ingredients: longtext("ingredients"), // For food items
  ingredientsAr: longtext("ingredientsAr"),
  suitableFor: json("suitableFor"), // Array of species/breeds
  price: decimal("price", { precision: 10, scale: 2 }),
  supplier: varchar("supplier", { length: 255 }),
  supplierUrl: varchar("supplierUrl", { length: 512 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  verified: boolean("verified").default(false),
  certifications: json("certifications"), // Organic, eco-friendly, etc.
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NaturalAlternative = typeof naturalAlternatives.$inferSelect;
export type InsertNaturalAlternative = typeof naturalAlternatives.$inferInsert;

/**
 * Training programs and activity modules
 */
export const trainingPrograms = mysqlTable("trainingPrograms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  category: mysqlEnum("category", [
    "bathroom_training",
    "obedience",
    "socialization",
    "play_enrichment",
    "behavioral_modification",
    "agility",
    "tricks"
  ]).notNull(),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]),
  ageRange: varchar("ageRange", { length: 100 }), // e.g., "8 weeks - 6 months"
  duration: int("duration"), // in days
  steps: json("steps"), // Array of training steps
  stepsAr: json("stepsAr"),
  videoUrl: varchar("videoUrl", { length: 512 }),
  tips: json("tips"),
  tipsAr: json("tipsAr"),
  successIndicators: json("successIndicators"),
  successIndicatorsAr: json("successIndicatorsAr"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingProgram = typeof trainingPrograms.$inferInsert;

/**
 * Pet owner training progress tracking
 */
export const trainingProgress = mysqlTable("trainingProgress", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  userId: int("userId").notNull(),
  programId: int("programId").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  currentStep: int("currentStep").default(0),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "paused"]).default("not_started"),
  dailyLogs: json("dailyLogs"), // Array of daily progress entries
  notes: longtext("notes"),
  completionDate: timestamp("completionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrainingProgress = typeof trainingProgress.$inferSelect;
export type InsertTrainingProgress = typeof trainingProgress.$inferInsert;

/**
 * Global best practices and expert guidelines
 */
export const bestPractices = mysqlTable("bestPractices", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  category: mysqlEnum("category", [
    "nutrition",
    "behavior",
    "health",
    "grooming",
    "training",
    "enrichment",
    "socialization",
    "emergency_care"
  ]).notNull(),
  content: longtext("content").notNull(),
  contentAr: longtext("contentAr"),
  keyPoints: json("keyPoints"), // Array of key takeaways
  keyPointsAr: json("keyPointsAr"),
  species: json("species"), // ["cat", "dog", "both"]
  breedSpecific: varchar("breedSpecific", { length: 255 }), // Optional breed
  source: varchar("source", { length: 255 }), // WHO, AAFCO, FEDIAF, etc.
  expertReview: boolean("expertReview").default(false),
  reviewedBy: varchar("reviewedBy", { length: 255 }),
  references: json("references"), // Array of reference URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BestPractice = typeof bestPractices.$inferSelect;
export type InsertBestPractice = typeof bestPractices.$inferInsert;

/**
 * Pet file sharing and access control
 */
export const petFileShares = mysqlTable("petFileShares", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  ownerId: int("ownerId").notNull(),
  sharedWithId: int("sharedWithId"), // Veterinarian or clinic ID
  sharedWithType: mysqlEnum("sharedWithType", ["veterinarian", "clinic", "trainer"]),
  shareToken: varchar("shareToken", { length: 255 }).unique(),
  accessLevel: mysqlEnum("accessLevel", ["view_only", "edit", "full_access"]).default("view_only"),
  expiresAt: timestamp("expiresAt"),
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
  lastAccessedAt: timestamp("lastAccessedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PetFileShare = typeof petFileShares.$inferSelect;
export type InsertPetFileShare = typeof petFileShares.$inferInsert;

/**
 * Audit trail for pet file access
 */
export const petFileAudit = mysqlTable("petFileAudit", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  userId: int("userId").notNull(),
  action: mysqlEnum("action", ["view", "edit", "download", "share", "delete"]).notNull(),
  details: longtext("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PetFileAudit = typeof petFileAudit.$inferSelect;
export type InsertPetFileAudit = typeof petFileAudit.$inferInsert;
