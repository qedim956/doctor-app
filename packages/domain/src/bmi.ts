export function calcBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new RangeError("Weight and height must be positive");
  }
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}