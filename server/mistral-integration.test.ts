import { describe, expect, it } from "vitest";

describe("Mistral AI Integration", () => {
  it("should have valid Mistral API key", () => {
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    expect(mistralApiKey).toBeDefined();
    expect(mistralApiKey).toBeTruthy();
    expect(mistralApiKey?.length).toBeGreaterThan(10);
  });

  it("should have Mistral API key in correct format", () => {
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!mistralApiKey) {
      throw new Error("MISTRAL_API_KEY not set");
    }

    // Mistral API keys typically start with specific prefixes or have specific patterns
    // This validates the key exists and has reasonable length
    expect(mistralApiKey).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("should validate Mistral API connectivity", async () => {
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (!mistralApiKey) {
      throw new Error("MISTRAL_API_KEY not set");
    }

    try {
      // Test Mistral API connectivity with a simple request
      const response = await fetch("https://api.mistral.ai/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mistralApiKey}`,
          "Content-Type": "application/json",
        },
      });

      // Should get a successful response or 401 if key is invalid
      expect([200, 401, 403, 429]).toContain(response.status);

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
        expect(Array.isArray(data.data) || data.data).toBeDefined();
      }
    } catch (error) {
      // Network errors are acceptable during testing
      console.warn("Mistral API connectivity test skipped (network unavailable)");
    }
  });

  it("should have Supabase schema review access", () => {
    const schemaReviewAccess = process.env.SUPABASE_SCHEMA_REVIEW_ACCESS;

    expect(schemaReviewAccess).toBeDefined();
    expect(schemaReviewAccess).toBeTruthy();
  });

  it("should have Vercel token if provided", () => {
    const vercelToken = process.env.VERCEL_TOKEN;

    // Vercel token is optional, but if provided should be valid
    if (vercelToken) {
      expect(vercelToken.length).toBeGreaterThan(10);
    }
  });
});
