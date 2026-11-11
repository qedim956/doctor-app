import { LAB_UNITS } from './labs.js';

export type Sex = 'male' | 'female';

const COEFFICIENTS: Record<Sex, { kappa: number; alpha: number; factor: number }> = {
  female: { kappa: 0.7, alpha: -0.241, factor: 1.012 },
  male: { kappa: 0.9, alpha: -0.302, factor: 1 },
};

export function calcEgfrCkdEpi2021(input: {
  creatinineUmolL: number;
  age: number;
  sex: Sex;
}): number {
  const { creatinineUmolL, age, sex } = input;

  if (!Number.isFinite(creatinineUmolL) || creatinineUmolL <= 0) {
    throw new RangeError(`Invalid creatinine: ${creatinineUmolL}. Must be positive.`);
  }
  if (!Number.isFinite(age) || age < 18) {
    throw new RangeError(`Invalid age: ${age}. Formula is for adults (18+).`);
  }

  const mgDlFactor = LAB_UNITS.creatinine.factors['mg/dL'];
  if (mgDlFactor === undefined) throw new Error('Creatinine mg/dL factor is not configured');
  const scr = creatinineUmolL / mgDlFactor;

  const { kappa, alpha, factor } = COEFFICIENTS[sex];
  const ratio = scr / kappa;

  return 142 * Math.min(ratio, 1) ** alpha * Math.max(ratio, 1) ** -1.2 * 0.9938 ** age * factor;
}