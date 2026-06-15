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


/**
 * Virtual Pet Avatars - AI-powered personalized companion for each pet
 */
export const virtualPetAvatars = mysqlTable("virtualPetAvatars", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  personality: varchar("personality", { length: 255 }), // e.g., "Playful", "Wise", "Energetic"
  personalityAr: varchar("personalityAr", { length: 255 }),
  avatarImageUrl: varchar("avatarImageUrl", { length: 512 }), // Avatar character image
  bio: longtext("bio"), // Avatar's biography/background
  bioAr: longtext("bioAr"),
  traits: json("traits"), // Array of personality traits
  traitsAr: json("traitsAr"),
  specialAbilities: json("specialAbilities"), // Array of special features
  specialAbilitiesAr: json("specialAbilitiesAr"),
  
  // AI Personality & Learning
  conversationStyle: varchar("conversationStyle", { length: 255 }), // How the avatar communicates
  conversationStyleAr: varchar("conversationStyleAr", { length: 255 }),
  knowledgeBase: json("knowledgeBase"), // Topics the avatar specializes in
  learningProgress: json("learningProgress"), // Tracks what the avatar has learned about the pet
  
  // Interaction Stats
  totalInteractions: int("totalInteractions").default(0),
  lastInteractionAt: timestamp("lastInteractionAt"),
  favoriteActivities: json("favoriteActivities"), // Activities the avatar prefers
  
  // Customization
  colorTheme: varchar("colorTheme", { length: 50 }), // e.g., "golden", "silver", "emerald"
  voicePreference: varchar("voicePreference", { length: 50 }), // e.g., "friendly", "wise", "playful"
  
  // Status
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VirtualPetAvatar = typeof virtualPetAvatars.$inferSelect;
export type InsertVirtualPetAvatar = typeof virtualPetAvatars.$inferInsert;

/**
 * Avatar Conversation History - Tracks all interactions with the avatar
 */
export const avatarConversations = mysqlTable("avatarConversations", {
  id: int("id").autoincrement().primaryKey(),
  avatarId: int("avatarId").notNull().references(() => virtualPetAvatars.id),
  userId: int("userId").notNull().references(() => users.id),
  petId: int("petId").notNull().references(() => pets.id),
  
  // Message Content
  userMessage: longtext("userMessage").notNull(),
  avatarResponse: longtext("avatarResponse").notNull(),
  messageType: mysqlEnum("messageType", ["question", "command", "chat", "training", "health_check"]).default("chat"),
  
  // AI Context
  context: json("context"), // Context data used for the response
  sentiment: varchar("sentiment", { length: 50 }), // Detected sentiment
  
  // Feedback
  userFeedback: mysqlEnum("userFeedback", ["helpful", "not_helpful", "neutral"]),
  rating: int("rating"), // 1-5 star rating
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvatarConversation = typeof avatarConversations.$inferSelect;
export type InsertAvatarConversation = typeof avatarConversations.$inferInsert;

/**
 * Avatar Achievements - Track milestones and achievements with the avatar
 */
export const avatarAchievements = mysqlTable("avatarAchievements", {
  id: int("id").autoincrement().primaryKey(),
  avatarId: int("avatarId").notNull().references(() => virtualPetAvatars.id),
  userId: int("userId").notNull().references(() => users.id),
  
  achievementType: varchar("achievementType", { length: 255 }).notNull(), // e.g., "First Training", "100 Interactions"
  achievementTypeAr: varchar("achievementTypeAr", { length: 255 }),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  badge: varchar("badge", { length: 255 }), // Badge image URL
  
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvatarAchievement = typeof avatarAchievements.$inferSelect;
export type InsertAvatarAchievement = typeof avatarAchievements.$inferInsert;

/**
 * Veterinarian Profiles - Extended vet information with ratings
 */
export const veterinarianProfiles = mysqlTable("veterinarianProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  licenseNumber: varchar("licenseNumber", { length: 255 }).notNull().unique(),
  licenseImageUrl: varchar("licenseImageUrl", { length: 512 }),
  specializations: json("specializations"), // Array of specializations
  specializationsAr: json("specializationsAr"),
  bio: longtext("bio"),
  bioAr: longtext("bioAr"),
  profileImageUrl: varchar("profileImageUrl", { length: 512 }),
  clinicId: int("clinicId"), // For clinic-linked vets (null for freelance)
  isFreelance: boolean("isFreelance").default(true),
  registrationFeeStatus: mysqlEnum("registrationFeeStatus", ["pending", "paid", "free"]).default("free"),
  registrationFeePaidAt: timestamp("registrationFeePaidAt"),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verifiedAt"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: int("totalReviews").default(0),
  responseTime: int("responseTime"), // Average response time in minutes
  yearsOfExperience: int("yearsOfExperience"),
  languages: json("languages"), // Array of languages spoken
  consultationFee: decimal("consultationFee", { precision: 10, scale: 2 }), // In EGP
  availability: json("availability"), // Weekly availability schedule
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VeterinarianProfile = typeof veterinarianProfiles.$inferSelect;
export type InsertVeterinarianProfile = typeof veterinarianProfiles.$inferInsert;

/**
 * Clinic Profiles - Enhanced clinic information with ownership and ratings
 */
export const clinicProfiles = mysqlTable("clinicProfiles", {
  id: int("id").autoincrement().primaryKey(),
  clinicId: int("clinicId").notNull().unique(),
  ownerId: int("ownerId").notNull(), // User ID of clinic owner
  registrationFeeStatus: mysqlEnum("registrationFeeStatus", ["pending", "paid"]).default("pending"),
  registrationFeePaidAt: timestamp("registrationFeePaidAt"),
  registrationFeeAmount: decimal("registrationFeeAmount", { precision: 10, scale: 2 }), // In EGP
  licenseNumber: varchar("licenseNumber", { length: 255 }),
  licenseImageUrl: varchar("licenseImageUrl", { length: 512 }),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verifiedAt"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: int("totalReviews").default(0),
  services: json("services"), // Array of services offered
  servicesAr: json("servicesAr"),
  staffCount: int("staffCount"),
  yearEstablished: int("yearEstablished"),
  bankAccount: varchar("bankAccount", { length: 255 }), // For payouts
  bankName: varchar("bankName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClinicProfile = typeof clinicProfiles.$inferSelect;
export type InsertClinicProfile = typeof clinicProfiles.$inferInsert;

/**
 * Clinic-Veterinarian Relationship - Many-to-many junction table
 */
export const clinicVets = mysqlTable("clinicVets", {
  id: int("id").autoincrement().primaryKey(),
  clinicId: int("clinicId").notNull(),
  veterinarianId: int("veterinarianId").notNull(),
  position: varchar("position", { length: 255 }), // e.g., "Head Vet", "Associate"
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClinicVet = typeof clinicVets.$inferSelect;
export type InsertClinicVet = typeof clinicVets.$inferInsert;

/**
 * Ratings and Reviews - For vets, clinics, and products
 */
export const ratingsReviews = mysqlTable("ratingsReviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewerId: int("reviewerId").notNull(), // User who wrote the review
  targetType: mysqlEnum("targetType", ["vet", "clinic", "product"]).notNull(),
  targetId: int("targetId").notNull(), // ID of vet, clinic, or product
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }),
  comment: longtext("comment"),
  verifiedBooking: boolean("verifiedBooking").default(false), // Only verified bookings can review
  bookingId: int("bookingId"), // Reference to booking if applicable
  helpful: int("helpful").default(0), // Count of helpful votes
  unhelpful: int("unhelpful").default(0),
  response: longtext("response"), // Vet/clinic response to review
  responseAt: timestamp("responseAt"),
  respondedBy: int("respondedBy"), // User ID who responded
  imageUrls: json("imageUrls"), // Array of review images
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RatingReview = typeof ratingsReviews.$inferSelect;
export type InsertRatingReview = typeof ratingsReviews.$inferInsert;

/**
 * Bookings - Service reservations with payment tracking
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  petOwnerId: int("petOwnerId").notNull(),
  petId: int("petId").notNull(),
  veterinarianId: int("veterinarianId"),
  clinicId: int("clinicId"),
  serviceType: mysqlEnum("serviceType", ["consultation", "examination", "surgery", "grooming", "vaccination", "other"]).notNull(),
  bookingDate: timestamp("bookingDate").notNull(),
  duration: int("duration"), // Duration in minutes
  status: mysqlEnum("status", ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).default("pending"),
  notes: longtext("notes"),
  consultationFee: decimal("consultationFee", { precision: 10, scale: 2 }), // In EGP
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }).default("20"), // Platform commission %
  platformCommission: decimal("platformCommission", { precision: 10, scale: 2 }), // Calculated commission
  vetEarnings: decimal("vetEarnings", { precision: 10, scale: 2 }), // Vet's earnings after commission
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "refunded"]).default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 255 }), // e.g., "credit_card", "wallet", "bank_transfer"
  transactionId: varchar("transactionId", { length: 255 }), // Payment gateway transaction ID
  cancellationReason: varchar("cancellationReason", { length: 255 }),
  cancelledBy: mysqlEnum("cancelledBy", ["pet_owner", "vet", "clinic", "admin"]),
  cancelledAt: timestamp("cancelledAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Shopping Cart - Products added to cart
 */
export const shoppingCart = mysqlTable("shoppingCart", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(), // Reference to naturalAlternatives
  quantity: int("quantity").notNull().default(1),
  priceAtAddTime: decimal("priceAtAddTime", { precision: 10, scale: 2 }), // Price in EGP at time of adding
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShoppingCart = typeof shoppingCart.$inferSelect;
export type InsertShoppingCart = typeof shoppingCart.$inferInsert;

/**
 * Invoices - Order records with line items
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNumber: varchar("invoiceNumber", { length: 255 }).notNull().unique(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId"), // Vendor/shop owner (null for service bookings)
  invoiceType: mysqlEnum("invoiceType", ["product_order", "service_booking"]).notNull(),
  bookingId: int("bookingId"), // For service bookings
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(), // In EGP
  taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).default("0"),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
  platformCommission: decimal("platformCommission", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 255 }),
  transactionId: varchar("transactionId", { length: 255 }),
  shippingAddress: longtext("shippingAddress"),
  shippingStatus: mysqlEnum("shippingStatus", ["pending", "shipped", "delivered", "cancelled"]).default("pending"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  notes: longtext("notes"),
  lineItems: json("lineItems"), // Array of {productId, quantity, price, total}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Wallets - Financial accounts for vets, clinics, and vendors
 */
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  walletType: mysqlEnum("walletType", ["vet", "clinic", "vendor", "pet_owner"]).notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0"), // In EGP
  totalEarnings: decimal("totalEarnings", { precision: 15, scale: 2 }).default("0"),
  totalWithdrawals: decimal("totalWithdrawals", { precision: 15, scale: 2 }).default("0"),
  totalCommissions: decimal("totalCommissions", { precision: 15, scale: 2 }).default("0"),
  bankAccount: varchar("bankAccount", { length: 255 }),
  bankName: varchar("bankName", { length: 255 }),
  accountHolder: varchar("accountHolder", { length: 255 }),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "pending", "verified"]).default("unverified"),
  verifiedAt: timestamp("verifiedAt"),
  lastWithdrawalAt: timestamp("lastWithdrawalAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

/**
 * Transactions - Financial transaction records
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  walletId: int("walletId").notNull(),
  transactionType: mysqlEnum("transactionType", [
    "booking_payment",
    "product_sale",
    "commission_deduction",
    "withdrawal",
    "refund",
    "bonus",
    "registration_fee"
  ]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(), // In EGP
  description: varchar("description", { length: 512 }),
  relatedBookingId: int("relatedBookingId"),
  relatedInvoiceId: int("relatedInvoiceId"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 255 }),
  externalTransactionId: varchar("externalTransactionId", { length: 255 }), // From payment gateway
  notes: longtext("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Vendor Profiles - Product sellers
 */
export const vendorProfiles = mysqlTable("vendorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessNameAr: varchar("businessNameAr", { length: 255 }),
  description: longtext("description"),
  descriptionAr: longtext("descriptionAr"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  businessLicense: varchar("businessLicense", { length: 255 }),
  businessLicenseImageUrl: varchar("businessLicenseImageUrl", { length: 512 }),
  category: mysqlEnum("category", [
    "organic_food",
    "natural_treats",
    "eco_supplies",
    "toys_enrichment",
    "grooming",
    "training_tools",
    "supplements",
    "bedding",
    "other"
  ]).notNull(),
  website: varchar("website", { length: 512 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: varchar("address", { length: 512 }),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: int("totalReviews").default(0),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verifiedAt"),
  totalProducts: int("totalProducts").default(0),
  totalSales: int("totalSales").default(0),
  responseTime: int("responseTime"), // Average response time in hours
  returnPolicy: longtext("returnPolicy"),
  shippingInfo: longtext("shippingInfo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VendorProfile = typeof vendorProfiles.$inferSelect;
export type InsertVendorProfile = typeof vendorProfiles.$inferInsert;
