const MGDL_TO_UMOLL = 88.4;

export type CreatinineUnit = "mg/dL" | "umol/L";

export function creatinineToUmolL(value: number, unit: CreatinineUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`Invalid creatinine value: ${value}`);
  }
  return unit === "umol/L" ? value : value * MGDL_TO_UMOLL;
}