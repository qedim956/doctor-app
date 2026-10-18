import { describe, it, expect } from "vitest";
import { creatinineToUmolL } from "./units.js";

describe("creatinineToUmolL", () => {
  it("converts mg/dL to umol/L", () => {
    expect(creatinineToUmolL(1, "mg/dL")).toBeCloseTo(88.4);
  });
  it("keeps umol/L as is", () => {
    expect(creatinineToUmolL(150, "umol/L")).toBe(150);
  });
  it("rejects invalid values", () => {
    expect(() => creatinineToUmolL(0, "mg/dL")).toThrow(RangeError);
  });
});