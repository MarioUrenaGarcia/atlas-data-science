import { lognormal, normal, poisson, type Distribution } from '../distributions/index.ts';
import type { Random } from '../random/index.ts';

export const PROCESS_IDS = [
  'caminata',
  'browniano',
  'browniano-geometrico',
  'ornstein-uhlenbeck',
  'poisson',
  'puente-browniano',
] as const;

export type ProcessId = (typeof PROCESS_IDS)[number];

export interface ProcessParameters {
  /** Initial value. */
  x0: number;
  /** Drift of Brownian processes, long-run mean of Ornstein-Uhlenbeck. */
  mu: number;
  /** Volatility or diffusion coefficient. */
  sigma: number;
  /** Mean-reversion speed of Ornstein-Uhlenbeck. */
  theta: number;
  /** Up-step probability of the random walk. */
  p: number;
  /** Rate of the Poisson process. */
  lambda: number;
}

export const DEFAULT_PROCESS_PARAMETERS: ProcessParameters = {
  x0: 0,
  mu: 0,
  sigma: 1,
  theta: 1,
  p: 0.5,
  lambda: 2,
};

/**
 * Simulates `count` trajectories on a grid of `steps` intervals over [0, T].
 * Each path is exact on the grid: Brownian increments are normal, the
 * geometric process uses the log-normal solution and Ornstein-Uhlenbeck its
 * exact Gaussian transition, so there is no discretization error.
 */
export function simulatePaths(
  process: ProcessId,
  parameters: ProcessParameters,
  horizon: number,
  steps: number,
  count: number,
  random: Random,
): Float64Array[] {
  const dt = horizon / steps;
  const sqrtDt = Math.sqrt(dt);
  const paths: Float64Array[] = [];
  for (let k = 0; k < count; k += 1) {
    const path = new Float64Array(steps + 1);
    // Counting processes and bridges start at zero regardless of x0.
    path[0] = process === 'puente-browniano' || process === 'poisson' ? 0 : parameters.x0;
    let w = 0;
    const brownian: number[] = process === 'puente-browniano' ? [0] : [];
    for (let i = 1; i <= steps; i += 1) {
      const previous = path[i - 1] ?? 0;
      switch (process) {
        case 'caminata':
          path[i] = previous + (random.bernoulli(parameters.p) ? 1 : -1);
          break;
        case 'browniano':
          path[i] = previous + parameters.mu * dt + parameters.sigma * sqrtDt * random.normal();
          break;
        case 'browniano-geometrico':
          path[i] =
            previous *
            Math.exp(
              (parameters.mu - (parameters.sigma * parameters.sigma) / 2) * dt +
                parameters.sigma * sqrtDt * random.normal(),
            );
          break;
        case 'ornstein-uhlenbeck': {
          const decay = Math.exp(-parameters.theta * dt);
          const sd = parameters.sigma * Math.sqrt((1 - decay * decay) / (2 * parameters.theta));
          path[i] = parameters.mu + (previous - parameters.mu) * decay + sd * random.normal();
          break;
        }
        case 'poisson':
          path[i] = previous + random.poisson(parameters.lambda * dt);
          break;
        case 'puente-browniano':
          w += parameters.sigma * sqrtDt * random.normal();
          brownian.push(w);
          break;
      }
    }
    if (process === 'puente-browniano') {
      // B_t - (t / T) B_T pins the path to zero at both ends.
      const end = brownian[steps] ?? 0;
      for (let i = 0; i <= steps; i += 1) path[i] = (brownian[i] ?? 0) - (i / steps) * end;
    }
    paths.push(path);
  }
  return paths;
}

export interface Marginal {
  distribution: Distribution;
  exact: boolean;
}

/** Distribution of X(t), exact where known and normal otherwise. */
export function marginalAt(
  process: ProcessId,
  parameters: ProcessParameters,
  t: number,
  horizon: number,
): Marginal | null {
  if (t <= 0) return null;
  const { x0, mu, sigma, theta, p, lambda } = parameters;
  switch (process) {
    case 'caminata': {
      const variance = 4 * t * p * (1 - p);
      return variance > 0
        ? { distribution: normal(x0 + t * (2 * p - 1), Math.sqrt(variance)), exact: false }
        : null;
    }
    case 'browniano':
      return { distribution: normal(x0 + mu * t, sigma * Math.sqrt(t)), exact: true };
    case 'browniano-geometrico':
      return x0 > 0
        ? {
            distribution: lognormal(
              Math.log(x0) + (mu - (sigma * sigma) / 2) * t,
              sigma * Math.sqrt(t),
            ),
            exact: true,
          }
        : null;
    case 'ornstein-uhlenbeck': {
      const decay = Math.exp(-theta * t);
      const variance = (sigma * sigma * (1 - decay * decay)) / (2 * theta);
      return { distribution: normal(mu + (x0 - mu) * decay, Math.sqrt(variance)), exact: true };
    }
    case 'poisson':
      return lambda * t > 0 ? { distribution: poisson(lambda * t), exact: true } : null;
    case 'puente-browniano': {
      if (t >= horizon) return null;
      return {
        distribution: normal(0, sigma * Math.sqrt((t * (horizon - t)) / horizon)),
        exact: true,
      };
    }
  }
}
