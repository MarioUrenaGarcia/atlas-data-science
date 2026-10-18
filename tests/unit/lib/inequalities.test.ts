import { describe, expect, it } from 'vitest';
import {
  bernoulliKl,
  bernsteinBound,
  binomialTwoSidedTail,
  binomialUpperTail,
  birthdayCollision,
  cantelliBound,
  chebyshevBound,
  chernoffBound,
  hoeffdingBound,
  markovBound,
  mcdiarmidBound,
  unionBound,
} from '../../../src/lib/probability/inequalities.ts';

describe('moment tail bounds', () => {
  it('gives the textbook values', () => {
    expect(markovBound(2, 8)).toBeCloseTo(0.25, 12);
    expect(chebyshevBound(2)).toBeCloseTo(0.25, 12);
    expect(cantelliBound(1, 2)).toBeCloseTo(0.2, 12);
    expect(markovBound(5, 1)).toBe(1);
  });

  it('bounds the exponential tail from above', () => {
    // X ~ Exp(1): P(X >= a) = e^{-a} <= 1/a.
    for (const a of [0.5, 1, 2, 5, 10]) expect(Math.exp(-a)).toBeLessThanOrEqual(markovBound(1, a));
  });
});

describe('concentration of binomial averages', () => {
  it('computes exact binomial tails', () => {
    // Four fair coins: P(mean - 0.5 >= 0.25) = P(S >= 3) = 5/16.
    expect(binomialUpperTail(4, 0.5, 0.25)).toBeCloseTo(5 / 16, 12);
    expect(binomialTwoSidedTail(4, 0.5, 0.5)).toBeCloseTo(2 / 16, 12);
  });

  it('keeps every bound above the exact tail', () => {
    for (const n of [10, 50, 200]) {
      for (const t of [0.05, 0.1, 0.2]) {
        const p = 0.3;
        const exact = binomialUpperTail(n, p, t);
        expect(exact).toBeLessThanOrEqual(hoeffdingBound(n, t) + 1e-12);
        expect(exact).toBeLessThanOrEqual(chernoffBound(n, p, t) + 1e-12);
        expect(exact).toBeLessThanOrEqual(bernsteinBound(n, t, p * (1 - p), 0.7) + 1e-12);
        expect(exact).toBeLessThanOrEqual(Math.min(1, (p * (1 - p)) / (n * t * t)) + 1e-12);
      }
    }
  });

  it('makes Chernoff at least as tight as Hoeffding', () => {
    expect(chernoffBound(100, 0.5, 0.1)).toBeLessThanOrEqual(hoeffdingBound(100, 0.1));
    expect(bernoulliKl(0.5, 0.5)).toBe(0);
  });
});

describe('union and bounded differences', () => {
  it('caps the union bound at one', () => {
    expect(unionBound([0.2, 0.3])).toBeCloseTo(0.5, 12);
    expect(unionBound([0.7, 0.6])).toBe(1);
  });

  it('solves the birthday problem', () => {
    const { exact, bound } = birthdayCollision(23);
    expect(exact).toBeCloseTo(0.5073, 4);
    expect(bound).toBeCloseTo(253 / 365, 12);
    expect(exact).toBeLessThanOrEqual(bound);
  });

  it('gives the McDiarmid exponent', () => {
    expect(mcdiarmidBound(5, 50)).toBeCloseTo(Math.exp(-1), 12);
  });
});
