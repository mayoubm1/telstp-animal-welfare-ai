import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Knowledge Base Router", () => {
  describe("Vaccinations", () => {
    it("should return feline vaccination schedule", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.vaccinations.getSchedule({
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.title).toContain("Feline");
      expect(result.schedule).toBeDefined();
      expect(result.schedule.length).toBeGreaterThan(0);
      expect(result.coreVaccines).toContain("FVRCP");
    });

    it("should return canine vaccination schedule", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.vaccinations.getSchedule({
        species: "dog",
      });

      expect(result).toBeDefined();
      expect(result.title).toContain("Canine");
      expect(result.schedule).toBeDefined();
      expect(result.coreVaccines).toContain("DHPP");
      expect(result.coreVaccines).toContain("Rabies");
    });

    it("should return vaccine information for cats", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.vaccinations.getVaccineInfo({
        vaccineName: "FVRCP",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.protectsAgainst).toBeDefined();
      expect(result.sideEffects).toBeDefined();
    });

    it("should return vaccine information for dogs", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.vaccinations.getVaccineInfo({
        vaccineName: "Rabies",
        species: "dog",
      });

      expect(result).toBeDefined();
      expect(result.legal).toBeDefined();
      expect(result.legal).toContain("law");
    });
  });

  describe("Supplements", () => {
    it("should search for supplements by name", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.supplements.search({
        query: "omega",
      });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].name).toContain("Omega");
    });

    it("should return supplements for specific conditions", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.supplements.getByCondition({
        condition: "arthritis",
        species: "dog",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBeDefined();
    });

    it("should return supplements for cat arthritis", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.supplements.getByCondition({
        condition: "arthritis",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.some((s: any) => s.name === "Glucosamine")).toBe(true);
    });
  });

  describe("Nutrition", () => {
    it("should return feline kitten nutrition guidelines", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.nutrition.getFoodRecommendations({
        species: "cat",
        age: "kitten/puppy",
      });

      expect(result).toBeDefined();
      expect(result.title).toContain("Kitten");
      expect(result.requirements).toBeDefined();
      expect(result.requirements.protein).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it("should return canine adult nutrition guidelines", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.nutrition.getFoodRecommendations({
        species: "dog",
        age: "adult",
      });

      expect(result).toBeDefined();
      expect(result.title).toContain("Adult");
      expect(result.requirements).toBeDefined();
      expect(result.avoidFoods).toContain("Chocolate");
    });

    it("should return top pet food brands", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.nutrition.getTopBrands({
        species: "cat",
        quality: "premium",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBeDefined();
      expect(result[0].specialties).toBeDefined();
    });

    it("should return dog food brands", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.nutrition.getTopBrands({
        species: "dog",
        quality: "standard",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("Medications", () => {
    it("should return medication information for cats", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.medications.search({
        medicationName: "amoxicillin",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Amoxicillin");
      expect(result.type).toContain("Antibiotic");
      expect(result.usedFor).toBeDefined();
      expect(result.dosage).toBeDefined();
      expect(result.sideEffects).toBeDefined();
    });

    it("should return medication information for dogs", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.medications.search({
        medicationName: "carprofen",
        species: "dog",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Carprofen (Rimadyl)");
      expect(result.type).toContain("NSAID");
      expect(result.monitoring).toBeDefined();
    });

    it("should return prescription protocol for conditions", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.medications.getPrescriptionProtocol({
        condition: "urinary tract infection",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.condition).toBeDefined();
      expect(result.firstLine).toBeDefined();
      expect(result.duration).toBeDefined();
    });

    it("should return prescription protocol for dog arthritis", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.medications.getPrescriptionProtocol({
        condition: "arthritis",
        species: "dog",
      });

      expect(result).toBeDefined();
      expect(result.firstLine).toContain("Carprofen");
      expect(result.supplements).toBeDefined();
      expect(result.supportiveCare).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid vaccine names gracefully", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.vaccinations.getVaccineInfo({
        vaccineName: "InvalidVaccine",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.error).toBeDefined();
    });

    it("should handle invalid conditions gracefully", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.supplements.getByCondition({
        condition: "nonexistent_condition",
        species: "cat",
      });

      expect(result).toBeDefined();
      expect(result.message || result.error).toBeDefined();
    });

    it("should return empty results for non-matching supplement searches", async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.knowledgeBase.supplements.search({
        query: "xyznonexistent",
      });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results.length).toBe(0);
    });
  });
});
