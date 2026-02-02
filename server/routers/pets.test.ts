import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("pets router", () => {
  describe("getBreeds", () => {
    it("should return cat breeds", async () => {
      const caller = appRouter.createCaller(createAuthContext().ctx);
      const breeds = await caller.pets.getBreeds({ species: "cat" });

      expect(Array.isArray(breeds)).toBe(true);
      expect(breeds.length).toBeGreaterThan(0);
      expect(breeds).toContain("Persian");
      expect(breeds).toContain("Maine Coon");
      expect(breeds).toContain("Siamese");
    });

    it("should return dog breeds", async () => {
      const caller = appRouter.createCaller(createAuthContext().ctx);
      const breeds = await caller.pets.getBreeds({ species: "dog" });

      expect(Array.isArray(breeds)).toBe(true);
      expect(breeds.length).toBeGreaterThan(0);
      expect(breeds).toContain("Labrador Retriever");
      expect(breeds).toContain("German Shepherd");
      expect(breeds).toContain("Golden Retriever");
    });

    it("should have mixed/domestic option for both species", async () => {
      const caller = appRouter.createCaller(createAuthContext().ctx);
      const catBreeds = await caller.pets.getBreeds({ species: "cat" });
      const dogBreeds = await caller.pets.getBreeds({ species: "dog" });

      expect(catBreeds).toContain("Mixed/Domestic Shorthair");
      expect(dogBreeds).toContain("Mixed/Domestic Shorthair");
    });
  });

  describe("list", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.list();
        expect.fail("Should throw UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return empty list for user with no pets", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const pets = await caller.pets.list();
      expect(Array.isArray(pets)).toBe(true);
      expect(pets.length).toBe(0);
    });
  });

  describe("create", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.create({
          name: "Max",
          species: "dog",
          breed: "Labrador Retriever",
          age: 24,
          weight: "30.5",
        });
        expect.fail("Should throw UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should validate required fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.create({
          name: "",
          species: "dog",
          breed: "Labrador",
          age: 24,
          weight: "30",
        });
        expect.fail("Should throw validation error for empty name");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should validate age is non-negative", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.create({
          name: "Max",
          species: "dog",
          breed: "Labrador",
          age: -5,
          weight: "30",
        });
        expect.fail("Should throw validation error for negative age");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should accept valid pet creation input", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador Retriever",
        age: 24,
        weight: "30.5",
        color: "Black",
        vaccinationStatus: "up_to_date",
        allergies: "None",
        currentMedications: "None",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe("Max");
      expect(result.species).toBe("dog");
      expect(result.breed).toBe("Labrador Retriever");
    });

    it("should accept optional fields", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.pets.create({
        name: "Luna",
        species: "cat",
        breed: "Persian",
        age: 12,
        weight: "4.5",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe("Luna");
    });
  });

  describe("getById", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.getById({ petId: 1 });
        expect.fail("Should throw UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return 404 for non-existent pet", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.getById({ petId: 99999 });
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should prevent access to other user's pets", async () => {
      const { ctx: ctx1 } = createAuthContext(1);
      const { ctx: ctx2 } = createAuthContext(2);
      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Create pet for user 1
      const pet = await caller1.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador",
        age: 24,
        weight: "30",
      });

      const petId = typeof pet.id === 'string' ? parseInt(pet.id) : pet.id;
      // Try to access as user 2
      try {
        await caller2.pets.getById({ petId });
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("update", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.update({
          petId: 1,
          name: "Updated Name",
        });
        expect.fail("Should throw UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should prevent updating other user's pets", async () => {
      const { ctx: ctx1 } = createAuthContext(1);
      const { ctx: ctx2 } = createAuthContext(2);
      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Create pet for user 1
      const pet = await caller1.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador",
        age: 24,
        weight: "30",
      });

      const petId = typeof pet.id === 'string' ? parseInt(pet.id) : pet.id;
      // Try to update as user 2
      try {
        await caller2.pets.update({
          petId,
          name: "Hacked",
        });
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow partial updates", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const pet = await caller.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador",
        age: 24,
        weight: "30",
      });

      const petId = typeof pet.id === 'string' ? parseInt(pet.id) : pet.id;
      const result = await caller.pets.update({
        petId,
        name: "Maxwell",
        age: 25,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("delete", () => {
    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.pets.delete({ petId: 1 });
        expect.fail("Should throw UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should prevent deleting other user's pets", async () => {
      const { ctx: ctx1 } = createAuthContext(1);
      const { ctx: ctx2 } = createAuthContext(2);
      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // Create pet for user 1
      const pet = await caller1.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador",
        age: 24,
        weight: "30",
      });

      const petId = typeof pet.id === 'string' ? parseInt(pet.id) : pet.id;
      // Try to delete as user 2
      try {
        await caller2.pets.delete({ petId });
        expect.fail("Should throw FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow user to delete their own pet", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const pet = await caller.pets.create({
        name: "Max",
        species: "dog",
        breed: "Labrador",
        age: 24,
        weight: "30",
      });

      const petId = typeof pet.id === 'string' ? parseInt(pet.id) : pet.id;
      const result = await caller.pets.delete({ petId });
      expect(result.success).toBe(true);

      // Verify pet is deleted
      try {
        await caller.pets.getById({ petId });
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});
