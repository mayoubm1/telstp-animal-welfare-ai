import { describe, expect, it } from "vitest";
import { frameworkCardMotionClasses, toggleFrameworkPrinciple } from "../client/src/lib/frameworkInteraction";

describe("TELSTP Life Science Framework card interaction", () => {
  it("opens a selected principle and closes it when the same keyboard-accessible control is activated again", () => {
    const opened = toggleFrameworkPrinciple(null, "Care begins with attention");
    expect(opened).toBe("Care begins with attention");
    expect(toggleFrameworkPrinciple(opened, "Care begins with attention")).toBeNull();
  });

  it("switches directly between principles", () => {
    expect(toggleFrameworkPrinciple("Care begins with attention", "Technology serves the greater good")).toBe("Technology serves the greater good");
  });

  it("uses motion-safe transitions and explicit reduced-motion transform fallbacks", () => {
    expect(frameworkCardMotionClasses).toContain("motion-safe:transition");
    expect(frameworkCardMotionClasses).toContain("motion-reduce:hover:transform-none");
    expect(frameworkCardMotionClasses).toContain("motion-reduce:focus-visible:transform-none");
  });
});
