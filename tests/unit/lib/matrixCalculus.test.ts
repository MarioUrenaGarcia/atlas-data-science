import { describe, expect, it } from 'vitest';
import {
  QUADRATIC_CASES,
  QUADRATIC_CASE_IDS,
  quadraticGradient,
  quadraticMinimum,
  quadraticValue,
} from '../../../src/lib/multivariable/matrixCalculus.ts';

const H = 1e-6;

describe('quadratic cases', () => {
  it('have gradients Ax - b that match numerical derivatives', () => {
    for (const id of QUADRATIC_CASE_IDS) {
      const q = QUADRATIC_CASES[id];
      if (!q) throw new Error(id);
      const p: [number, number] = [0.7, -0.4];
      const [gx, gy] = quadraticGradient(q, p);
      expect((quadraticValue(q, [p[0] + H, p[1]]) - quadraticValue(q, [p[0] - H, p[1]])) / (2 * H)).toBeCloseTo(gx, 5);
      expect((quadraticValue(q, [p[0], p[1] + H]) - quadraticValue(q, [p[0], p[1] - H])) / (2 * H)).toBeCloseTo(gy, 5);
    }
  });

  it('has zero gradient at the minimum', () => {
    for (const id of QUADRATIC_CASE_IDS) {
      const q = QUADRATIC_CASES[id];
      if (!q) throw new Error(id);
      const [gx, gy] = quadraticGradient(q, quadraticMinimum(q));
      expect(gx).toBeCloseTo(0, 10);
      expect(gy).toBeCloseTo(0, 10);
    }
  });

  it('recovers the least-squares line through the five data points', () => {
    const q = QUADRATIC_CASES['minimos-cuadrados'];
    if (!q) throw new Error('missing');
    // For centered hours t = -2..2 and y = 3, 4, 6, 6, 8: intercept 5.4, the mean score, and slope 1.2.
    const [b0, b1] = quadraticMinimum(q);
    expect(b0).toBeCloseTo(5.4, 10);
    expect(b1).toBeCloseTo(1.2, 10);
    // The minimum value is the residual sum of squares, 0.8 for this line.
    expect(quadraticValue(q, [b0, b1])).toBeCloseTo(0.8, 10);
  });
});
