import { describe, expect, it } from 'vitest';
import {
  diagonalComplement,
  gcd,
  integerAt,
  positionOfInteger,
  zigzagFractions,
} from '../../../src/lib/sets/enumeration.ts';

describe('countable enumerations', () => {
  it('lists the integers without gaps or repeats', () => {
    const first = Array.from({ length: 7 }, (_, n) => integerAt(n));
    expect(first).toEqual([0, 1, -1, 2, -2, 3, -3]);
    for (let z = -20; z <= 20; z += 1) expect(integerAt(positionOfInteger(z))).toBe(z);
  });

  it('counts each positive rational exactly once along the zigzag', () => {
    expect(gcd(12, 18)).toBe(6);
    const steps = zigzagFractions(60);
    const counted = steps
      .filter((step) => step.counted)
      .map((step) => step.numerator / step.denominator);
    expect(new Set(counted).size).toBe(counted.length);
    expect(steps[0]).toEqual({ numerator: 1, denominator: 1, counted: true });
    expect(steps.find((step) => step.numerator === 2 && step.denominator === 2)?.counted).toBe(
      false,
    );
  });

  it('builds a sequence absent from the list', () => {
    const rows = [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const d = diagonalComplement(rows);
    expect(d).toEqual([1, 0, 1]);
    rows.forEach((row, index) => expect(row[index]).not.toBe(d[index]));
  });
});
