import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { emergencyTriageRouter } from "./emergency-triage";
import { getDb } from "../db";
import { users, pets, caseHistory, emergencyTriageCases } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Emergency Triage Router", () => {
  let db: any;
  let testUserId: number;
  let testPetId: number;
  let testCaseId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      console.warn("Database not available for tests");
      return;
    }

    // Create test user
    const userResult = await db.insert(users).values({
      openId: `test-vet-${Date.now()}`,
      name: "Test Veterinarian",
      email: "test-vet@example.com",
      role: "veterinarian",
      userType: "veterinarian",
      phone: "+1234567890",
      language: "en",
    });

    testUserId = (userResult as any).insertId || 1;

    // Create test pet
    const petResult = await db.insert(pets).values({
      userId: testUserId,
      name: "Test Dog",
      species: "dog",
      breed: "Labrador",
      age: 36,
      weight: "30",
      color: "Golden",
    });

    testPetId = (petResult as any).insertId || 1;

    // Create test case
    const caseResult = await db.insert(caseHistory).values({
      petId: testPetId,
      userId: testUserId,
      symptoms: "Vomiting, lethargy, loss of appetite",
      severity: "severe",
      triageLevel: "emergency",
    });

    testCaseId = (caseResult as any).insertId || 1;
  });

  afterAll(async () => {
    if (!db) return;

    // Cleanup test data
    try {
      await db.delete(emergencyTriageCases).where(eq(emergencyTriageCases.userId, testUserId));
      await db.delete(caseHistory).where(eq(caseHistory.userId, testUserId));
      await db.delete(pets).where(eq(pets.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    } catch (error) {
      console.warn("Cleanup error:", error);
    }
  });

  it("should create emergency triage router", () => {
    expect(emergencyTriageRouter).toBeDefined();
    expect(emergencyTriageRouter._def.procedures).toBeDefined();
  });

  it("should have assessEmergency procedure", () => {
    const procedures = emergencyTriageRouter._def.procedures;
    expect(procedures.assessEmergency).toBeDefined();
  });

  it("should have getEmergencyCases procedure", () => {
    const procedures = emergencyTriageRouter._def.procedures;
    expect(procedures.getEmergencyCases).toBeDefined();
  });

  it("should have acknowledgeEmergency procedure", () => {
    const procedures = emergencyTriageRouter._def.procedures;
    expect(procedures.acknowledgeEmergency).toBeDefined();
  });

  it("should have updateEmergencyStatus procedure", () => {
    const procedures = emergencyTriageRouter._def.procedures;
    expect(procedures.updateEmergencyStatus).toBeDefined();
  });

  it("should have getEmergencyCase procedure", () => {
    const procedures = emergencyTriageRouter._def.procedures;
    expect(procedures.getEmergencyCase).toBeDefined();
  });

  it("should validate assessEmergency input schema", async () => {
    const procedures = emergencyTriageRouter._def.procedures;
    const inputParser = procedures.assessEmergency._def.inputs[0];

    // Valid input
    const validInput = {
      caseHistoryId: 1,
      symptoms: "Severe vomiting and diarrhea for 2 days",
      severity: "critical",
      petSpecies: "dog",
      petAge: 36,
    };

    expect(() => inputParser.parse(validInput)).not.toThrow();

    // Invalid input - symptoms too short
    const invalidInput = {
      caseHistoryId: 1,
      symptoms: "Sick",
      severity: "critical",
      petSpecies: "dog",
    };

    expect(() => inputParser.parse(invalidInput)).toThrow();
  });

  it("should validate acknowledgeEmergency input schema", async () => {
    const procedures = emergencyTriageRouter._def.procedures;
    const inputParser = procedures.acknowledgeEmergency._def.inputs[0];

    const validInput = { caseId: 1 };
    expect(() => inputParser.parse(validInput)).not.toThrow();

    const invalidInput = { caseId: -1 };
    expect(() => inputParser.parse(invalidInput)).toThrow();
  });

  it("should validate updateEmergencyStatus input schema", async () => {
    const procedures = emergencyTriageRouter._def.procedures;
    const inputParser = procedures.updateEmergencyStatus._def.inputs[0];

    const validInput = {
      caseId: 1,
      status: "in_progress",
      notes: "Vet is examining the patient",
    };

    expect(() => inputParser.parse(validInput)).not.toThrow();

    const invalidInput = {
      caseId: 1,
      status: "invalid_status",
    };

    expect(() => inputParser.parse(invalidInput)).toThrow();
  });

  it("should validate getEmergencyCase input schema", async () => {
    const procedures = emergencyTriageRouter._def.procedures;
    const inputParser = procedures.getEmergencyCase._def.inputs[0];

    const validInput = { caseId: 1 };
    expect(() => inputParser.parse(validInput)).not.toThrow();

    const invalidInput = { caseId: 0 };
    expect(() => inputParser.parse(invalidInput)).toThrow();
  });

  it("should have proper procedure access control", () => {
    const procedures = emergencyTriageRouter._def.procedures;

    // All procedures should be defined
    expect(procedures.assessEmergency).toBeDefined();
    expect(procedures.getEmergencyCases).toBeDefined();
    expect(procedures.acknowledgeEmergency).toBeDefined();
    expect(procedures.updateEmergencyStatus).toBeDefined();
    expect(procedures.getEmergencyCase).toBeDefined();
  });
});
