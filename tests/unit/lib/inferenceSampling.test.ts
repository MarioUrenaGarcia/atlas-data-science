import { describe, expect, it } from 'vitest';
import {
  chiSquarePivot,
  finitePopulationCorrection,
  proportionStandardError,
  standardError,
  sumOfSquares,
  tPivot,
} from '../../../src/lib/inference/sampling.ts';

describe('sampling distributions', () => {
  it('computes standard errors', () => {
    expect(standardError(10, 25)).toBeCloseTo(2, 12);
    expect(proportionStandardError(0.5, 100)).toBeCloseTo(0.05, 12);
    expect(finitePopulationCorrection(100, 1)).toBeCloseTo(1, 12);
    expect(finitePopulationCorrection(100, 100)).toBeCloseTo(0, 12);
  });

  it('computes the t and chi-square pivots', () => {
    const sample = [4, 6, 8];
    // xbar = 6, s^2 = 4, s / sqrt(3) = 2 / sqrt(3).
    expect(tPivot(sample, 5)).toBeCloseTo(Math.sqrt(3) / 2, 12);
    expect(chiSquarePivot(sample, 2)).toBeCloseTo(4, 12);
  });

  it('decomposes the sum of squares about the true mean', () => {
    const sample = [3, 7, 8, 2];
    const s = sumOfSquares(sample, 4);
    expect(s.total).toBeCloseTo(1 + 9 + 16 + 4, 12);
    expect(s.total).toBeCloseTo(s.within + s.mean, 12);
    expect(s.mean).toBeCloseTo(4 * 1, 12);
  });
});
