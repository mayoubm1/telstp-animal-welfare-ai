import { describe, expect, it } from "vitest";

describe("Supabase Connection", () => {
  it("should have valid Supabase environment variables", () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Validate URL format
    expect(supabaseUrl).toBeDefined();
    expect(supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/);

    // Validate anon key format (JWT token)
    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseAnonKey).toMatch(/^eyJ/); // JWT tokens start with eyJ

    // Validate service role key format (JWT token)
    expect(supabaseServiceRoleKey).toBeDefined();
    expect(supabaseServiceRoleKey).toMatch(/^eyJ/);
  });

  it("should be able to parse Supabase JWT tokens", () => {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!anonKey) {
      throw new Error("SUPABASE_ANON_KEY not set");
    }

    // JWT format: header.payload.signature
    const parts = anonKey.split(".");
    expect(parts).toHaveLength(3);

    // Decode payload (second part)
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    const decoded = JSON.parse(payload);

    // Validate JWT claims
    expect(decoded.iss).toBe("supabase");
    expect(decoded.ref).toBeDefined();
    expect(decoded.role).toBe("anon");
  });

  it("should have correct Supabase project reference", () => {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    if (!anonKey || !supabaseUrl) {
      throw new Error("Supabase credentials not set");
    }

    // Extract project reference from URL
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    expect(urlMatch).toBeDefined();
    const projectRef = urlMatch?.[1];

    // Extract project reference from JWT
    const parts = anonKey.split(".");
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    const decoded = JSON.parse(payload);

    // Verify they match
    expect(decoded.ref).toBe(projectRef);
  });

  it("should have valid service role key with elevated permissions", () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
    }

    const parts = serviceRoleKey.split(".");
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    const decoded = JSON.parse(payload);

    // Service role key should have elevated permissions
    expect(decoded.role).toBe("service_role");
    expect(decoded.iss).toBe("supabase");
  });
});
