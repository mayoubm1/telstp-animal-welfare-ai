import { describe, expect, it } from "vitest";
import { getStorageProxyKey } from "./_core/storageProxy";

describe("storage proxy key extraction", () => {
  it("accepts a non-empty Express wildcard path", () => {
    expect(getStorageProxyKey({ 0: "paws-purpose-gateway_c5b4e99a.jpg" })).toBe("paws-purpose-gateway_c5b4e99a.jpg");
  });

  it("rejects absent or empty wildcard values", () => {
    expect(getStorageProxyKey({})).toBeUndefined();
    expect(getStorageProxyKey({ 0: "" })).toBeUndefined();
    expect(getStorageProxyKey(undefined)).toBeUndefined();
  });
});
