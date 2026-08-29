import { afterEach, describe, expect, it, vi } from "vitest";

const originalSupabaseKey = process.env.SUPABASE_ANON_KEY;

afterEach(() => {
  if (originalSupabaseKey === undefined) delete process.env.SUPABASE_ANON_KEY;
  else process.env.SUPABASE_ANON_KEY = originalSupabaseKey;
  vi.resetModules();
});

describe("Supabase server bootstrap", () => {
  it("does not crash unrelated serverless functions when the optional directory credential is absent", async () => {
    delete process.env.SUPABASE_ANON_KEY;
    vi.resetModules();

    const integration = await import("./_core/supabase");

    expect(integration.isSupabaseConfigured).toBe(false);
    expect(integration.supabase).toBeDefined();
    expect(integration.handleSupabaseError(new Error("invalid API key"))).toContain("temporarily unavailable");
  });
});
