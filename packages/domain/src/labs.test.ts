import { describe, it, expect } from 'vitest';
import { LAB_TYPES, LAB_UNITS, toCanonical } from './labs.js';

describe('toCanonical', () => {
  // 1. Düzgün çevrilmələr: hər sətir bir test
  it.each([
    { type: 'creatinine', value: 1, unit: 'mg/dL', expected: 88.4 },
    { type: 'creatinine', value: 150, unit: 'umol/L', expected: 150 },
    { type: 'albumin', value: 3.8, unit: 'g/dL', expected: 38 },
    { type: 'albumin', value: 38, unit: 'g/L', expected: 38 },
    { type: 'phosphorus', value: 3.1, unit: 'mg/dL', expected: 1.001 },
    { type: 'potassium', value: 4.9, unit: 'mmol/L', expected: 4.9 },
  ] as const)('$type: $value $unit → $expected', ({ type, value, unit, expected }) => {
    expect(toCanonical(type, value, unit)).toBeCloseTo(expected, 3);
  });

  // 2. Qəbul olunmayan vahid
  it('rejects a unit that is not allowed for the lab type', () => {
    expect(() => toCanonical('potassium', 4.9, 'mg/dL')).toThrow(RangeError);
  });

  it('rejects an unknown unit', () => {
    expect(() => toCanonical('creatinine', 1, 'kg')).toThrow(RangeError);
  });

  // 3. Səhv dəyərlər
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid value %s', (value) => {
    expect(() => toCanonical('creatinine', value, 'mg/dL')).toThrow(RangeError);
  });
});

// 4. Cədvəlin özünün sağlamlığı
describe('LAB_UNITS', () => {
  it.each(LAB_TYPES)('%s: canonical unit has factor 1', (type) => {
    const { canonical, factors } = LAB_UNITS[type];
    expect(factors[canonical]).toBe(1);
  });
});