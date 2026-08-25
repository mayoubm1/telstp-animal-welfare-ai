import { describe, expect, it } from "vitest";
import type { TrpcContext } from "../_core/context";
import { appRouter } from "../routers";
import { consultationRequestInput } from "./consultations";
import { ownerProfileInput } from "./profile";

const unauthenticatedContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("persisted owner care workflows", () => {
  it("accepts a bounded, UTC-based consultation request payload", () => {
    const parsed = consultationRequestInput.parse({
      clinicId: "b662ad7f-0365-41fd-84a9-8914c9fe0527",
      petName: "Luna",
      requestedAt: "2026-08-25T09:30:00.000Z",
      reason: "Reduced appetite since yesterday morning.",
      contactPhone: "+201000000000",
    });

    expect(parsed.petName).toBe("Luna");
    expect(parsed.requestedAt).toBe("2026-08-25T09:30:00.000Z");
  });

  it("rejects an unstructured consultation timestamp and insufficient reason", () => {
    expect(() => consultationRequestInput.parse({
      clinicId: "clinic-1",
      petName: "Luna",
      requestedAt: "2026-08-25 09:30",
      reason: "ill",
      contactPhone: "+201000000000",
    })).toThrow();
  });

  it("normalizes the editable profile contract to the allowed owner fields", () => {
    const parsed = ownerProfileInput.parse({ name: "  Mohamed  ", phone: "  +201000000000 ", location: " Cairo ", language: "en" });
    expect(parsed).toEqual({ name: "Mohamed", phone: "+201000000000", location: "Cairo", language: "en" });
  });

  it("requires authentication before an owner profile or saved care request can be accessed", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);
    await expect(caller.profile.update({ name: "Mohamed", language: "en" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.consultations.listMine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
