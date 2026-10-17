import { describe, expect, it } from 'vitest';
import {
  meanSquaredError,
  PROBLEMS,
  relativeEfficiency,
  summarizeEstimates,
} from '../../../src/lib/inference/estimators.ts';
import { Random } from '../../../src/lib/random/index.ts';

describe('estimator properties', () => {
  it('decomposes the mean squared error exactly', () => {
    const s = summarizeEstimates([1, 2, 3, 6], 2);
    expect(s.mean).toBeCloseTo(3, 12);
    expect(s.bias).toBeCloseTo(1, 12);
    expect(s.mse).toBeCloseTo(s.variance + s.bias ** 2, 12);
    expect(meanSquaredError(1, 2)).toBe(3);
    expect(relativeEfficiency(1, 2)).toBe(2);
  });

  it('matches the closed-form bias and variance by simulation', () => {
    const random = new Random(11);
    const n = 6;
    for (const problem of Object.values(PROBLEMS)) {
      const theta = problem.id === 'media-normal' ? 3 : 2;
      const population = problem.population(theta);
      const samples = Array.from({ length: 20000 }, () =>
        Array.from({ length: n }, () => population.sample(random)),
      );
      for (const estimator of problem.estimators) {
        if (!estimator.bias || !estimator.variance) continue;
        const summary = summarizeEstimates(
          samples.map((s) => estimator.compute(s)),
          theta,
        );
        const v = estimator.variance(n, theta);
        expect(summary.bias).toBeCloseTo(estimator.bias(n, theta), 1);
        expect(Math.abs(summary.variance - v) / v).toBeLessThan(0.05);
      }
    }
  });

  it('the divisor n + 1 has the smallest mean squared error for a normal variance', () => {
    const p = PROBLEMS['varianza-normal'];
    const mse = p.estimators.map((e) =>
      meanSquaredError(e.bias?.(10, 1) ?? 0, e.variance?.(10, 1) ?? 0),
    );
    expect(mse[2]).toBeLessThan(mse[1] ?? 0);
    expect(mse[1]).toBeLessThan(mse[0] ?? 0);
  });
});
