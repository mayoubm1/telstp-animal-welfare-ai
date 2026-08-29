import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  users,
  veterinarianProfiles,
  clinicProfiles,
  vendorProfiles,
  wallets,
  clinicVets,
} from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Registration Router - Handles user registration for different roles
 * Supports: Pet Owners (free), Freelance Vets (free), Clinic-Linked Vets (paid), Clinic Owners (paid), Vendors (free/paid)
 */
export const registrationRouter = router({
  /**
   * Register as Pet Owner
   */
  registerPetOwner: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        location: z.string().optional(),
        language: z.enum(["en", "ar"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: false,
            error: "Email already registered",
          };
        }

        // Create user
        const result = await db.insert(users).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          location: input.location,
          language: input.language as "en" | "ar",
          userType: "pet_owner",
          role: "user",
          openId: `pet_owner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
        });

        // Create wallet for pet owner
        const userId = (result as any).insertId || 0;
        await db.insert(wallets).values({
          userId: userId,
          walletType: "pet_owner",
          
          
          
          
          verificationStatus: "unverified",
        });

        return {
          success: true,
          userId: userId,
          message: "Pet owner registration successful",
        };
      } catch (error) {
        console.error("Pet owner registration error:", error);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    }),

  /**
   * Register as Freelance Veterinarian (FREE)
   */
  registerFreelanceVet: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string(),
        licenseNumber: z.string().min(5, "Invalid license number"),
        specializations: z.array(z.string()).optional(),
        yearsOfExperience: z.number().min(0).optional(),
        bio: z.string().optional(),
        consultationFee: z.number().positive("Consultation fee must be positive"),
        languages: z.array(z.string()).optional(),
        location: z.string().optional(),
        language: z.enum(["en", "ar"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        // Check if email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: false,
            error: "Email already registered",
          };
        }

        // Check if license number already exists
        const existingLicense = await db
          .select()
          .from(veterinarianProfiles)
          .where(eq(veterinarianProfiles.licenseNumber, input.licenseNumber))
          .limit(1);

        if (existingLicense.length > 0) {
          return {
            success: false,
            error: "License number already registered",
          };
        }

        // Create user
        const userResult = await db.insert(users).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          location: input.location,
          language: input.language as "en" | "ar",
          userType: "veterinarian",
          role: "veterinarian",
          openId: `vet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
        });

        const userId = (userResult as any).insertId || 0;

        // Create veterinarian profile
        await db.insert(veterinarianProfiles).values({
          userId: userId,
          licenseNumber: input.licenseNumber,
          specializations: input.specializations ? JSON.stringify(input.specializations) : JSON.stringify([]),
          yearsOfExperience: input.yearsOfExperience,
          bio: input.bio,
          consultationFee: String(input.consultationFee),
          languages: input.languages ? JSON.stringify(input.languages) : JSON.stringify([]),
          isFreelance: true,
          registrationFeeStatus: "free",
          verified: false,
        });

        // Create wallet for vet
        await db.insert(wallets).values({
          userId: userId,
          walletType: "vet",
          
          
          
          
          verificationStatus: "unverified",
        });

        return {
          success: true,
          userId: userId,
          message: "Freelance veterinarian registration successful (FREE)",
        };
      } catch (error) {
        console.error("Freelance vet registration error:", error);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    }),

  /**
   * Register as Clinic-Linked Veterinarian (PAID)
   */
  registerClinicVet: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string(),
        licenseNumber: z.string().min(5, "Invalid license number"),
        clinicId: z.number().positive("Invalid clinic ID"),
        position: z.string().optional(),
        specializations: z.array(z.string()).optional(),
        yearsOfExperience: z.number().min(0).optional(),
        bio: z.string().optional(),
        consultationFee: z.number().positive("Consultation fee must be positive"),
        languages: z.array(z.string()).optional(),
        language: z.enum(["en", "ar"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        // Check if email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: false,
            error: "Email already registered",
          };
        }

        // Check if license number already exists
        const existingLicense = await db
          .select()
          .from(veterinarianProfiles)
          .where(eq(veterinarianProfiles.licenseNumber, input.licenseNumber))
          .limit(1);

        if (existingLicense.length > 0) {
          return {
            success: false,
            error: "License number already registered",
          };
        }

        // Create user
        const userResult = await db.insert(users).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          language: input.language as "en" | "ar",
          userType: "veterinarian",
          role: "veterinarian",
          openId: `vet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
        });

        const userId = (userResult as any).insertId || 0;

        // Create veterinarian profile (clinic-linked, paid)
        await db.insert(veterinarianProfiles).values({
          userId: userId,
          licenseNumber: input.licenseNumber,
          clinicId: input.clinicId,
          specializations: input.specializations ? JSON.stringify(input.specializations) : JSON.stringify([]),
          yearsOfExperience: input.yearsOfExperience,
          bio: input.bio,
          consultationFee: String(input.consultationFee),
          languages: input.languages ? JSON.stringify(input.languages) : JSON.stringify([]),
          isFreelance: false,
          registrationFeeStatus: "pending", // Clinic will pay
          verified: false,
        });

        // Link vet to clinic
        await db.insert(clinicVets).values({
          clinicId: input.clinicId,
          veterinarianId: userId,
          position: input.position,
        });

        // Create wallet for vet
        await db.insert(wallets).values({
          userId: userId,
          walletType: "vet",
          
          
          
          
          verificationStatus: "unverified",
        });

        return {
          success: true,
          userId: userId,
          message: "Clinic-linked veterinarian registration successful (awaiting clinic approval)",
        };
      } catch (error) {
        console.error("Clinic vet registration error:", error);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    }),

  /**
   * Register as Clinic Owner (PAID)
   */
  registerClinicOwner: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string(),
        clinicName: z.string().min(3, "Clinic name must be at least 3 characters"),
        clinicAddress: z.string(),
        clinicCity: z.string(),
        clinicCountry: z.string().default("Egypt"),
        licenseNumber: z.string().optional(),
        bankAccount: z.string().optional(),
        bankName: z.string().optional(),
        registrationFeeAmount: z.number().positive("Registration fee must be positive"),
        language: z.enum(["en", "ar"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        // Check if email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: false,
            error: "Email already registered",
          };
        }

        // Create user
        const userResult = await db.insert(users).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          language: input.language as "en" | "ar",
          userType: "clinic",
          role: "user",
          openId: `clinic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
        });

        const userId = (userResult as any).insertId || 0;

        // Create clinic profile (paid registration)
        await db.insert(clinicProfiles).values({
          clinicId: userId, // Use userId as clinicId for now
          ownerId: userId,
          registrationFeeStatus: "pending", // Awaiting payment
          registrationFeeAmount: String(input.registrationFeeAmount),
          licenseNumber: input.licenseNumber,
          verified: false,
          bankAccount: input.bankAccount,
          bankName: input.bankName,
        });

        // Create wallet for clinic
        await db.insert(wallets).values({
          userId: userId,
          walletType: "clinic",
          
          
          
          
          verificationStatus: "unverified",
        });

        return {
          success: true,
          userId: userId,
          registrationFeeAmount: input.registrationFeeAmount,
          message: "Clinic registration initiated (awaiting payment)",
        };
      } catch (error) {
        console.error("Clinic owner registration error:", error);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    }),

  /**
   * Register as Vendor/Shop Owner
   */
  registerVendor: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string(),
        businessName: z.string().min(3, "Business name must be at least 3 characters"),
        businessLicense: z.string().optional(),
        category: z.enum([
          "organic_food",
          "natural_treats",
          "eco_supplies",
          "toys_enrichment",
          "grooming",
          "training_tools",
          "supplements",
          "bedding",
          "other",
        ]),
        website: z.string().url().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().default("Egypt"),
        bankAccount: z.string().optional(),
        bankName: z.string().optional(),
        language: z.enum(["en", "ar"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        // Check if email already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: false,
            error: "Email already registered",
          };
        }

        // Create user
        const userResult = await db.insert(users).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          language: input.language as "en" | "ar",
          userType: "pet_owner", // Vendor is treated as pet_owner with vendor profile
          role: "user",
          openId: `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          loginMethod: "email",
        });

        const userId = (userResult as any).insertId || 0;

        // Create vendor profile
        await db.insert(vendorProfiles).values({
          userId: userId,
          businessName: input.businessName,
          category: input.category as any,
          businessLicense: input.businessLicense,
          website: input.website,
          phone: input.phone,
          email: input.email,
          address: input.address,
          city: input.city,
          country: input.country,
          verified: false,
        });

        // Create wallet for vendor
        await db.insert(wallets).values({
          userId: userId,
          walletType: "vendor",
          
          
          
          
          verificationStatus: "unverified",
        });

        return {
          success: true,
          userId: userId,
          message: "Vendor registration successful",
        };
      } catch (error) {
        console.error("Vendor registration error:", error);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    }),

  /**
   * Get user profile by ID
   */
  getUserProfile: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1);

        if (user.length === 0) {
          return { success: false, error: "User not found" };
        }

        const userRecord = user[0];

        // Get role-specific profile
        let profile = null;
        if (userRecord.userType === "veterinarian") {
          const vetProfile = await db
            .select()
            .from(veterinarianProfiles)
            .where(eq(veterinarianProfiles.userId, input.userId))
            .limit(1);
          profile = vetProfile[0] || null;
        } else if (userRecord.userType === "clinic") {
          const clinicProfile = await db
            .select()
            .from(clinicProfiles)
            .where(eq(clinicProfiles.ownerId, input.userId))
            .limit(1);
          profile = clinicProfile[0] || null;
        }

        // Get wallet
        const wallet = await db
          .select()
          .from(wallets)
          .where(eq(wallets.userId, input.userId))
          .limit(1);

        return {
          success: true,
          user: userRecord,
          profile: profile,
          wallet: wallet[0] || null,
        };
      } catch (error) {
        console.error("Get user profile error:", error);
        return {
          success: false,
          error: "Failed to fetch profile",
        };
      }
    }),

  /**
   * Update veterinarian profile
   */
  updateVetProfile: protectedProcedure
    .input(
      z.object({
        specializations: z.array(z.string()).optional(),
        bio: z.string().optional(),
        consultationFee: z.number().optional(),
        languages: z.array(z.string()).optional(),
        yearsOfExperience: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        await db
          .update(veterinarianProfiles)
          .set({
            specializations: input.specializations ? JSON.stringify(input.specializations) : undefined,
            bio: input.bio,
            consultationFee: String(input.consultationFee),
            languages: input.languages ? JSON.stringify(input.languages) : undefined,
            yearsOfExperience: input.yearsOfExperience,
          })
          .where(eq(veterinarianProfiles.userId, ctx.user.id));

        return {
          success: true,
          message: "Veterinarian profile updated successfully",
        };
      } catch (error) {
        console.error("Update vet profile error:", error);
        return {
          success: false,
          error: "Failed to update profile",
        };
      }
    }),

  /**
   * Update clinic profile
   */
  updateClinicProfile: protectedProcedure
    .input(
      z.object({
        services: z.array(z.string()).optional(),
        staffCount: z.number().optional(),
        yearEstablished: z.number().optional(),
        bankAccount: z.string().optional(),
        bankName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        await db
          .update(clinicProfiles)
          .set({
            services: input.services ? JSON.stringify(input.services) : undefined,
            staffCount: input.staffCount,
            yearEstablished: input.yearEstablished,
            bankAccount: input.bankAccount,
            bankName: input.bankName,
          })
          .where(eq(clinicProfiles.ownerId, ctx.user.id));

        return {
          success: true,
          message: "Clinic profile updated successfully",
        };
      } catch (error) {
        console.error("Update clinic profile error:", error);
        return {
          success: false,
          error: "Failed to update profile",
        };
      }
    }),

  /**
   * Update vendor profile
   */
  updateVendorProfile: protectedProcedure
    .input(
      z.object({
        businessName: z.string().optional(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        returnPolicy: z.string().optional(),
        shippingInfo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          return {
            success: false,
            error: "Database connection failed",
          };
        }

        await db
          .update(vendorProfiles)
          .set({
            businessName: input.businessName,
            description: input.description,
            website: input.website,
            address: input.address,
            city: input.city,
            returnPolicy: input.returnPolicy,
            shippingInfo: input.shippingInfo,
          })
          .where(eq(vendorProfiles.userId, ctx.user.id));

        return {
          success: true,
          message: "Vendor profile updated successfully",
        };
      } catch (error) {
        console.error("Update vendor profile error:", error);
        return {
          success: false,
          error: "Failed to update profile",
        };
      }
    }),
});
