export const LAB_TYPES = ['creatinine', 'potassium', 'phosphorus', 'albumin'] as const;
export type LabType = (typeof LAB_TYPES)[number];

type UnitConfig = {
  canonical: string;                  // standart vahid (DB-də hesablama üçün)
  factors: Record<string, number>;    // vahid → standarta vurma əmsalı
};

export const LAB_UNITS: Record<LabType, UnitConfig> = {
  creatinine: { canonical: 'umol/L', factors: { 'umol/L': 1, 'mg/dL': 88.4 } },
  potassium:  { canonical: 'mmol/L', factors: { 'mmol/L': 1 } },
  phosphorus: { canonical: 'mmol/L', factors: { 'mmol/L': 1, 'mg/dL': 0.3229 } },
  albumin:    { canonical: 'g/L',    factors: { 'g/L': 1, 'g/dL': 10 } },
};

export function toCanonical(type: LabType, value: number, unit: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`Invalid value: ${value}. Value must be positive and finite.`);
  }

  const factor = LAB_UNITS[type].factors[unit];
  if (factor === undefined) {
    throw new RangeError(
      `Invalid unit: ${unit}. Accepted units are: ${Object.keys(LAB_UNITS[type].factors).join(', ')}`,
    );
  }
  return value * factor;
}