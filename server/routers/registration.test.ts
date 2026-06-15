import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { users, veterinarianProfiles, clinicProfiles, vendorProfiles, wallets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Registration Router", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }
  });

  it("should create a pet owner user", async () => {
    const result = await db.insert(users).values({
      name: "Pet Owner Test",
      email: `pet-owner-${Date.now()}@example.com`,
      phone: "+1234567890",
      location: "Cairo, Egypt",
      language: "en",
      userType: "pet_owner",
      role: "user",
      openId: `pet_owner_${Date.now()}`,
      loginMethod: "email",
    });

    expect(result).toBeDefined();
    expect((result as any).insertId).toBeGreaterThan(0);
  });

  it("should create a wallet for a user", async () => {
    const userResult = await db.insert(users).values({
      name: "Wallet Test User",
      email: `wallet-${Date.now()}@example.com`,
      phone: "+1234567890",
      language: "en",
      userType: "pet_owner",
      role: "user",
      openId: `pet_owner_${Date.now()}`,
      loginMethod: "email",
    });

    const userId = (userResult as any).insertId;

    const walletResult = await db.insert(wallets).values({
      userId: userId,
      walletType: "pet_owner",
      verificationStatus: "unverified",
    });

    expect(walletResult).toBeDefined();
    expect((walletResult as any).insertId).toBeGreaterThan(0);
  });

  it("should create a veterinarian profile", async () => {
    const userResult = await db.insert(users).values({
      name: "Dr. Test Vet",
      email: `vet-${Date.now()}@example.com`,
      phone: "+1234567890",
      language: "en",
      userType: "vet",
      role: "veterinarian",
      openId: `vet_${Date.now()}`,
      loginMethod: "email",
    });

    const userId = (userResult as any).insertId;

    const vetResult = await db.insert(veterinarianProfiles).values({
      userId: userId,
      licenseNumber: `LIC-${Date.now()}`,
      specializations: JSON.stringify(["Surgery", "Dentistry"]),
      yearsOfExperience: 5,
      bio: "Experienced veterinarian",
      consultationFee: "500",
      languages: JSON.stringify(["English", "Arabic"]),
      isFreelance: true,
      registrationFeeStatus: "free",
      verified: false,
    });

    expect(vetResult).toBeDefined();
    expect((vetResult as any).insertId).toBeGreaterThan(0);
  });

  it("should create a clinic profile", async () => {
    const userResult = await db.insert(users).values({
      name: "Clinic Owner",
      email: `clinic-${Date.now()}@example.com`,
      phone: "+1234567890",
      language: "en",
      userType: "clinic",
      role: "user",
      openId: `clinic_${Date.now()}`,
      loginMethod: "email",
    });

    const userId = (userResult as any).insertId;

    const clinicResult = await db.insert(clinicProfiles).values({
      clinicId: userId,
      ownerId: userId,
      registrationFeeStatus: "pending",
      registrationFeeAmount: "5000",
      licenseNumber: "CLINIC-LIC-001",
      verified: false,
      bankAccount: "123456789",
      bankName: "National Bank",
    });

    expect(clinicResult).toBeDefined();
    expect((clinicResult as any).insertId).toBeGreaterThan(0);
  });

  it("should create a vendor profile", async () => {
    const userResult = await db.insert(users).values({
      name: "Vendor User",
      email: `vendor-${Date.now()}@example.com`,
      phone: "+1234567890",
      language: "en",
      userType: "pet_owner",
      role: "user",
      openId: `vendor_${Date.now()}`,
      loginMethod: "email",
    });

    const userId = (userResult as any).insertId;

    const vendorResult = await db.insert(vendorProfiles).values({
      userId: userId,
      businessName: "Pet Essentials Shop",
      category: "organic_food",
      businessLicense: "BUS-LIC-001",
      website: "https://example.com",
      phone: "+1234567890",
      email: `vendor-${Date.now()}@example.com`,
      address: "123 Pet Street",
      city: "Cairo",
      country: "Egypt",
      verified: false,
    });

    expect(vendorResult).toBeDefined();
    expect((vendorResult as any).insertId).toBeGreaterThan(0);
  });

  it("should create multiple users with different roles", async () => {
    const petOwnerResult = await db.insert(users).values({
      name: "Pet Owner",
      email: `pet-${Date.now()}@example.com`,
      language: "en",
      userType: "pet_owner",
      role: "user",
      openId: `pet_owner_${Date.now()}`,
      loginMethod: "email",
    });

    const vetResult = await db.insert(users).values({
      name: "Veterinarian",
      email: `vet-${Date.now()}@example.com`,
      language: "en",
      userType: "vet",
      role: "veterinarian",
      openId: `vet_${Date.now()}`,
      loginMethod: "email",
    });

    expect((petOwnerResult as any).insertId).toBeGreaterThan(0);
    expect((vetResult as any).insertId).toBeGreaterThan(0);
    expect((petOwnerResult as any).insertId).not.toBe((vetResult as any).insertId);
  });
});
