import { eq, and, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  pets,
  InsertPet,
  caseHistory,
  InsertCaseHistory,
  diseases,
  InsertDisease,
  educationalContent,
  InsertEducationalContent,
  veterinarians,
  InsertVeterinarian,
  consultations,
  InsertConsultation,
  vetClinics,
  InsertVetClinic,
  notifications,
  InsertNotification,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "location"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (user.language !== undefined) {
      values.language = user.language;
      updateSet.language = user.language;
    }

    if (user.userType !== undefined) {
      values.userType = user.userType;
      updateSet.userType = user.userType;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PET OPERATIONS ============

export async function createPet(pet: InsertPet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(pets).values(pet);
  return result;
}

export async function getPetsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(pets).where(eq(pets.userId, userId));
}

export async function getPetById(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(pets).where(eq(pets.id, petId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePet(petId: number, updates: Partial<InsertPet>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(pets).set(updates).where(eq(pets.id, petId));
}

// ============ CASE HISTORY OPERATIONS ============

export async function createCaseHistory(caseData: InsertCaseHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(caseHistory).values(caseData);
  return result;
}

export async function getCaseHistoryByPetId(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(caseHistory)
    .where(eq(caseHistory.petId, petId))
    .orderBy(desc(caseHistory.createdAt));
}

export async function getCaseHistoryById(caseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(caseHistory)
    .where(eq(caseHistory.id, caseId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCaseHistory(caseId: number, updates: Partial<InsertCaseHistory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(caseHistory).set(updates).where(eq(caseHistory.id, caseId));
}

export async function getCriticalCases() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(caseHistory)
    .where(eq(caseHistory.triageLevel, "emergency"))
    .orderBy(desc(caseHistory.createdAt));
}

// ============ DISEASE OPERATIONS ============

export async function createDisease(disease: InsertDisease) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(diseases).values(disease);
  return result;
}

export async function getDiseaseById(diseaseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(diseases).where(eq(diseases.id, diseaseId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function searchDiseases(query: string, category?: string, species?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions = [];
  if (query) {
    conditions.push(like(diseases.name, `%${query}%`));
  }
  if (category) {
    conditions.push(eq(diseases.category, category as any));
  }
  if (species) {
    conditions.push(eq(diseases.affectedSpecies, species as any));
  }

  return await db
    .select()
    .from(diseases)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(50);
}

export async function getDiseasesByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(diseases).where(eq(diseases.category, category as any));
}

// ============ EDUCATIONAL CONTENT OPERATIONS ============

export async function createEducationalContent(content: InsertEducationalContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(educationalContent).values(content);
  return result;
}

export async function getEducationalContentByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(educationalContent)
    .where(eq(educationalContent.category, category as any));
}

export async function searchEducationalContent(query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(educationalContent)
    .where(like(educationalContent.title, `%${query}%`))
    .limit(50);
}

// ============ VETERINARIAN OPERATIONS ============

export async function createVeterinarian(vet: InsertVeterinarian) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(veterinarians).values(vet);
  return result;
}

export async function getVeterinarianByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(veterinarians)
    .where(eq(veterinarians.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getVeterinarianById(vetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(veterinarians)
    .where(eq(veterinarians.id, vetId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ CONSULTATION OPERATIONS ============

export async function createConsultation(consultation: InsertConsultation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(consultations).values(consultation);
  return result;
}

export async function getConsultationsByVeterinarian(vetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(consultations)
    .where(eq(consultations.veterinarianId, vetId))
    .orderBy(desc(consultations.requestedAt));
}

export async function getConsultationById(consultationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(consultations)
    .where(eq(consultations.id, consultationId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateConsultation(consultationId: number, updates: Partial<InsertConsultation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(consultations).set(updates).where(eq(consultations.id, consultationId));
}

// ============ VET CLINIC OPERATIONS ============

export async function createVetClinic(clinic: InsertVetClinic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(vetClinics).values(clinic);
  return result;
}

export async function getVetClinicById(clinicId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(vetClinics).where(eq(vetClinics.id, clinicId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function searchVetClinics(city: string, clinicType?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let conditions = [eq(vetClinics.city, city)];
  if (clinicType) {
    conditions.push(eq(vetClinics.clinicType, clinicType as any));
  }

  return await db
    .select()
    .from(vetClinics)
    .where(and(...conditions))
    .limit(50);
}

// ============ NOTIFICATION OPERATIONS ============

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(notifications)
    .set({ read: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
}
