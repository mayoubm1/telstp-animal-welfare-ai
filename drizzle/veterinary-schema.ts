/**
 * Veterinary Platform Schema - Drizzle ORM Definitions
 * Integrates with existing TELSTP database (77 tables)
 * Uses UUID primary keys and references auth.users
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  index,
  uniqueIndex,
  foreignKey,
  check,
  pgEnum,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const speciesEnum = pgEnum("species", ["cat", "dog"]);
export const severityEnum = pgEnum("severity", ["mild", "moderate", "severe", "critical"]);
export const caseStatusEnum = pgEnum("case_status", ["open", "closed", "pending_vet"]);
export const consultationStatusEnum = pgEnum("consultation_status", ["pending", "completed", "declined"]);
export const attachmentTypeEnum = pgEnum("attachment_type", ["image", "video", "audio"]);
export const lifeStageEnum = pgEnum("life_stage", ["kitten/puppy", "adult", "senior"]);

// ============================================================================
// VETERINARY PROFILES
// ============================================================================

export const veterinaryProfiles = pgTable(
  "veterinary_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique(),
    licenseNumber: text("license_number").unique(),
    specializations: text("specializations").array(),
    clinicId: integer("clinic_id"),
    bio: text("bio"),
    verified: boolean("verified").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_veterinary_profiles_user_id").on(table.userId),
    clinicIdIdx: index("idx_veterinary_profiles_clinic_id").on(table.clinicId),
  })
);

export type VeterinaryProfile = typeof veterinaryProfiles.$inferSelect;
export type InsertVeterinaryProfile = typeof veterinaryProfiles.$inferInsert;

// ============================================================================
// PETS
// ============================================================================

export const pets = pgTable(
  "pets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    species: speciesEnum("species").notNull(),
    breed: text("breed"),
    ageYears: integer("age_years"),
    ageMonths: integer("age_months"),
    weight: decimal("weight", { precision: 8, scale: 2 }),
    microchipId: text("microchip_id").unique(),
    medicalHistory: text("medical_history"),
    allergies: text("allergies"),
    currentMedications: text("current_medications"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    speciesIdx: index("idx_pets_species").on(table.species),
    microchipIdx: index("idx_pets_microchip_id").on(table.microchipId),
  })
);

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

// ============================================================================
// PET OWNERS (Junction Table)
// ============================================================================

export const petOwners = pgTable(
  "pet_owners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    petId: uuid("pet_id")
      .notNull()
      .references(() => pets.id, { onDelete: "cascade" }),
    relationship: text("relationship").default("owner"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_pet_owners_user_id").on(table.userId),
    petIdIdx: index("idx_pet_owners_pet_id").on(table.petId),
    uniqueConstraint: uniqueIndex("pet_owners_user_pet_unique").on(table.userId, table.petId),
  })
);

export type PetOwner = typeof petOwners.$inferSelect;
export type InsertPetOwner = typeof petOwners.$inferInsert;

// ============================================================================
// PET CASES
// ============================================================================

export const petCases = pgTable(
  "pet_cases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    petId: uuid("pet_id")
      .notNull()
      .references(() => pets.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id").notNull(),
    symptoms: text("symptoms").notNull(),
    severity: severityEnum("severity"),
    triageLevel: text("triage_level"),
    diagnosisNotes: text("diagnosis_notes"),
    recommendedActions: text("recommended_actions"),
    vetConsultationRequested: boolean("vet_consultation_requested").default(false),
    assignedVeterinarianId: uuid("assigned_veterinarian_id").references(() => veterinaryProfiles.id),
    caseStatus: caseStatusEnum("case_status").default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    petIdIdx: index("idx_pet_cases_pet_id").on(table.petId),
    ownerIdIdx: index("idx_pet_cases_owner_id").on(table.ownerId),
    vetIdIdx: index("idx_pet_cases_vet_id").on(table.assignedVeterinarianId),
    statusIdx: index("idx_pet_cases_status").on(table.caseStatus),
  })
);

export type PetCase = typeof petCases.$inferSelect;
export type InsertPetCase = typeof petCases.$inferInsert;

// ============================================================================
// VETERINARY CONSULTATIONS
// ============================================================================

export const vetConsultations = pgTable(
  "vet_consultations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => petCases.id, { onDelete: "cascade" }),
    veterinarianId: uuid("veterinarian_id")
      .notNull()
      .references(() => veterinaryProfiles.id),
    ownerId: uuid("owner_id").notNull(),
    consultationDate: timestamp("consultation_date", { withTimezone: true }),
    diagnosis: text("diagnosis"),
    treatmentPlan: text("treatment_plan"),
    prescription: text("prescription"),
    notes: text("notes"),
    status: consultationStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    caseIdIdx: index("idx_vet_consultations_case_id").on(table.caseId),
    vetIdIdx: index("idx_vet_consultations_vet_id").on(table.veterinarianId),
    ownerIdIdx: index("idx_vet_consultations_owner_id").on(table.ownerId),
  })
);

export type VetConsultation = typeof vetConsultations.$inferSelect;
export type InsertVetConsultation = typeof vetConsultations.$inferInsert;

// ============================================================================
// CASE ATTACHMENTS
// ============================================================================

export const caseAttachments = pgTable(
  "case_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => petCases.id, { onDelete: "cascade" }),
    attachmentType: attachmentTypeEnum("attachment_type"),
    fileUrl: text("file_url").notNull(),
    fileKey: text("file_key"),
    mimeType: text("mime_type"),
    analysisResult: jsonb("analysis_result"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    caseIdIdx: index("idx_case_attachments_case_id").on(table.caseId),
  })
);

export type CaseAttachment = typeof caseAttachments.$inferSelect;
export type InsertCaseAttachment = typeof caseAttachments.$inferInsert;

// ============================================================================
// VACCINATION RECORDS
// ============================================================================

export const vaccinationRecords = pgTable(
  "vaccination_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    petId: uuid("pet_id")
      .notNull()
      .references(() => pets.id, { onDelete: "cascade" }),
    vaccineName: text("vaccine_name").notNull(),
    administeredDate: timestamp("administered_date", { withTimezone: true }).notNull(),
    nextDueDate: timestamp("next_due_date", { withTimezone: true }),
    veterinarian: text("veterinarian"),
    clinic: text("clinic"),
    batchNumber: text("batch_number"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    petIdIdx: index("idx_vaccination_records_pet_id").on(table.petId),
    nextDueIdx: index("idx_vaccination_records_next_due").on(table.nextDueDate),
  })
);

export type VaccinationRecord = typeof vaccinationRecords.$inferSelect;
export type InsertVaccinationRecord = typeof vaccinationRecords.$inferInsert;

// ============================================================================
// VETERINARY KNOWLEDGE
// ============================================================================

export const veterinaryKnowledge = pgTable(
  "veterinary_knowledge",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    content: text("content").notNull(),
    species: speciesEnum("species"),
    medicalCategory: text("medical_category"),
    symptoms: text("symptoms").array(),
    treatmentProtocols: text("treatment_protocols"),
    preventionMeasures: text("prevention_measures"),
    confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    speciesIdx: index("idx_veterinary_knowledge_species").on(table.species),
    categoryIdx: index("idx_veterinary_knowledge_category").on(table.category),
  })
);

export type VeterinaryKnowledge = typeof veterinaryKnowledge.$inferSelect;
export type InsertVeterinaryKnowledge = typeof veterinaryKnowledge.$inferInsert;

// ============================================================================
// VACCINATION PROTOCOLS
// ============================================================================

export const vaccinationProtocols = pgTable(
  "vaccination_protocols",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    species: speciesEnum("species").notNull(),
    vaccineName: text("vaccine_name").notNull(),
    ageWeeks: integer("age_weeks"),
    ageMonths: integer("age_months"),
    ageYears: integer("age_years"),
    doseNumber: integer("dose_number"),
    boosterFrequency: text("booster_frequency"),
    sideEffects: text("side_effects"),
    contraindications: text("contraindications"),
    coreVaccine: boolean("core_vaccine").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    speciesIdx: index("idx_vaccination_protocols_species").on(table.species),
  })
);

export type VaccinationProtocol = typeof vaccinationProtocols.$inferSelect;
export type InsertVaccinationProtocol = typeof vaccinationProtocols.$inferInsert;

// ============================================================================
// DIETARY SUPPLEMENTS
// ============================================================================

export const dietarySupplements = pgTable(
  "dietary_supplements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type"),
    species: speciesEnum("species"),
    description: text("description"),
    benefits: text("benefits"),
    dosage: text("dosage"),
    sideEffects: text("side_effects"),
    interactions: text("interactions"),
    indicatedFor: text("indicated_for"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);

export type DietarySupplement = typeof dietarySupplements.$inferSelect;
export type InsertDietarySupplement = typeof dietarySupplements.$inferInsert;

// ============================================================================
// PET FOODS
// ============================================================================

export const petFoods = pgTable(
  "pet_foods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    brand: text("brand"),
    species: speciesEnum("species").notNull(),
    lifeStage: lifeStageEnum("life_stage"),
    foodType: text("food_type"),
    protein: decimal("protein", { precision: 5, scale: 2 }),
    fat: decimal("fat", { precision: 5, scale: 2 }),
    fiber: decimal("fiber", { precision: 5, scale: 2 }),
    calcium: decimal("calcium", { precision: 5, scale: 2 }),
    phosphorus: decimal("phosphorus", { precision: 5, scale: 2 }),
    ingredients: text("ingredients"),
    specialFeatures: text("special_features"),
    price: decimal("price", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);

export type PetFood = typeof petFoods.$inferSelect;
export type InsertPetFood = typeof petFoods.$inferInsert;

// ============================================================================
// MEDICATIONS
// ============================================================================

export const medications = pgTable(
  "medications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type"),
    species: speciesEnum("species"),
    description: text("description"),
    usedFor: text("used_for"),
    dosage: text("dosage"),
    administrationRoute: text("administration_route"),
    sideEffects: text("side_effects"),
    interactions: text("interactions"),
    contraindications: text("contraindications"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

// ============================================================================
// PET OWNER NOTIFICATIONS
// ============================================================================

export const petOwnerNotifications = pgTable(
  "pet_owner_notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    type: text("type"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index("idx_pet_owner_notifications_owner_id").on(table.ownerId),
  })
);

export type PetOwnerNotification = typeof petOwnerNotifications.$inferSelect;
export type InsertPetOwnerNotification = typeof petOwnerNotifications.$inferInsert;
