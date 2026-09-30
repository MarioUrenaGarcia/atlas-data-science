import { describe, expect, it } from 'vitest';
import { CALC_FUNCTIONS, sampleSegments } from '../../../src/lib/calculus/catalog.ts';
import { derivative } from '../../../src/lib/calculus/index.ts';

// Points inside every domain and away from the singularities at 0 of 1/x and H(x).
const POINTS = [0.35, 0.8, 1.3, 1.9];

describe('calculus catalog', () => {
  for (const fn of Object.values(CALC_FUNCTIONS)) {
    it(`${fn.id}: derivatives and antiderivative agree with numerical differentiation`, () => {
      for (const x of POINTS) {
        expect(fn.df(x)).toBeCloseTo(derivative(fn.f, x), 4);
        expect(fn.d2f(x)).toBeCloseTo(derivative(fn.df, x), 3);
        if (fn.antiderivative) expect(derivative(fn.antiderivative, x)).toBeCloseTo(fn.f(x), 5);
      }
    });
  }

  it('breaks the plot of 1/x at the pole and of H(x) at the jump', () => {
    const reciprocal = CALC_FUNCTIONS.reciproca;
    const step = CALC_FUNCTIONS.escalon;
    expect(reciprocal && sampleSegments(reciprocal.f, -2, 2, 400, 5).length).toBe(2);
    expect(step && sampleSegments(step.f, -2, 2, 401, 0.5).length).toBe(2);
  });
});

describe('findRoots', () => {
  it('finds the critical points of x^3 - 3x and ignores sign-free touches', async () => {
    const { findRoots } = await import('../../../src/lib/calculus/index.ts');
    const roots = findRoots((x) => 3 * x * x - 3, -2.5, 2.5);
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeCloseTo(-1, 8);
    expect(roots[1]).toBeCloseTo(1, 8);
    expect(findRoots((x) => Math.sin(x), 0.5, 10)).toHaveLength(3);
  });
});
