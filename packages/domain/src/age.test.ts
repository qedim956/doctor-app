import { describe, it, expect } from 'vitest';
import { calcAge } from './age.js';

const d = (s: string) => new Date(s);

describe('calcAge', () => {
  it('birthday already passed this year', () => {
    expect(calcAge(d('1970-05-01'), d('2026-10-19'))).toBe(99);
  });

  it('birthday not yet this year', () => {
    expect(calcAge(d('1970-12-10'), d('2026-10-19'))).toBe(55);
  });

  it('today is the birthday', () => {
    expect(calcAge(d('1970-10-19'), d('2026-10-19'))).toBe(56);
  });

  it('one day before birthday', () => {
    expect(calcAge(d('1940-01-04'), d('2026-01-03'))).toBe(85);
  });

  it('born on Feb 29', () => {
    expect(calcAge(d('2000-02-29'), d('2026-02-28'))).toBe(25);
  });

  it('rejects a future birth date', () => {
    expect(() => calcAge(d('2030-01-01'), d('2026-10-19'))).toThrow(RangeError);
  });
});