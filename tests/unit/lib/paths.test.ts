import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import { mean, variance } from '../../../src/lib/stats/index.ts';
import {
  DEFAULT_PROCESS_PARAMETERS,
  marginalAt,
  PROCESS_IDS,
  simulatePaths,
  type ProcessParameters,
} from '../../../src/lib/stochastic/paths.ts';

const HORIZON = 2;
const STEPS = 40;
const COUNT = 6000;

describe('simulated paths match their marginal distributions', () => {
  const parameters: ProcessParameters = {
    ...DEFAULT_PROCESS_PARAMETERS,
    x0: 1,
    mu: 0.3,
    sigma: 0.6,
    theta: 1.5,
    p: 0.6,
    lambda: 3,
  };

  for (const process of PROCESS_IDS) {
    it(process, () => {
      const paths = simulatePaths(
        process,
        parameters,
        process === 'caminata' ? STEPS : HORIZON,
        STEPS,
        COUNT,
        new Random(11),
      );
      const index = STEPS / 2;
      const t = process === 'caminata' ? index : (HORIZON * index) / STEPS;
      const values = paths.map((path) => path[index] ?? 0);
      const marginal = marginalAt(process, parameters, t, process === 'caminata' ? STEPS : HORIZON);
      expect(marginal).not.toBeNull();
      if (!marginal) return;
      const { distribution } = marginal;
      const standardError = Math.sqrt(distribution.variance / COUNT);
      expect(Math.abs(mean(values) - distribution.mean)).toBeLessThan(5 * standardError);
      expect(variance(values) / distribution.variance).toBeGreaterThan(0.9);
      // Log-normal sample variances converge slowly, so their band is wider.
      expect(variance(values) / distribution.variance).toBeLessThan(
        process === 'browniano-geometrico' ? 1.25 : 1.1,
      );
    });
  }

  it('pins the Brownian bridge at both ends', () => {
    const [path] = simulatePaths('puente-browniano', parameters, HORIZON, STEPS, 1, new Random(3));
    expect(path?.[0]).toBe(0);
    expect(Math.abs(path?.[STEPS] ?? 1)).toBeLessThan(1e-12);
  });
});
