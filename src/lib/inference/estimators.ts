import {
  exponential,
  normal,
  uniform,
  type ContinuousDistribution,
} from '../distributions/index.ts';
import { mean, median, sum, trimmedMean } from '../stats/index.ts';

export type ProblemId =
  'media-normal' | 'varianza-normal' | 'maximo-uniforme' | 'media-exponencial';

export interface Estimator {
  id: string;
  /** Short name shown in legends and readouts. */
  name: string;
  /** LaTeX formula of the estimator. */
  tex: string;
  compute(sample: readonly number[]): number;
  /** Exact bias and variance for sample size n when known in closed form. */
  bias?(n: number, theta: number): number;
  variance?(n: number, theta: number): number;
}

export interface Problem {
  id: ProblemId;
  /** Parameter being estimated, in LaTeX. */
  parameter: string;
  /** Population with parameter theta. */
  population(theta: number): ContinuousDistribution;
  estimators: Estimator[];
}

const sumSquares = (sample: readonly number[]) => {
  const m = mean(sample);
  return sum(sample.map((x) => (x - m) ** 2));
};

/** Standard deviation used by the normal problems. */
export const NORMAL_SD = 1;

/**
 * Estimation problems with several competing estimators each. Closed-form
 * bias and variance are given where they are classical results; for the
 * median and trimmed mean only simulation is available.
 */
export const PROBLEMS: Record<ProblemId, Problem> = {
  'media-normal': {
    id: 'media-normal',
    parameter: '\\mu',
    population: (theta) => normal(theta, NORMAL_SD),
    estimators: [
      {
        id: 'media',
        name: 'Media muestral',
        tex: '\\bar{X}',
        compute: (s) => mean(s),
        bias: () => 0,
        variance: (n) => NORMAL_SD ** 2 / n,
      },
      {
        id: 'mediana',
        name: 'Mediana muestral',
        tex: '\\tilde{X}',
        compute: (s) => median(s),
      },
      {
        id: 'recortada',
        name: 'Media recortada al 20 %',
        tex: '\\bar{X}_{0.2}',
        compute: (s) => trimmedMean(s, 0.2),
      },
      {
        id: 'primero',
        name: 'Primer dato',
        tex: 'X_1',
        compute: (s) => s[0] ?? Number.NaN,
        bias: () => 0,
        variance: () => NORMAL_SD ** 2,
      },
      {
        id: 'contraida',
        name: 'Media contraída hacia 0',
        tex: '0.8\\,\\bar{X}',
        compute: (s) => 0.8 * mean(s),
        bias: (_, theta) => -0.2 * theta,
        variance: (n) => (0.64 * NORMAL_SD ** 2) / n,
      },
    ],
  },
  'varianza-normal': {
    id: 'varianza-normal',
    parameter: '\\sigma^2',
    population: (theta) => normal(0, Math.sqrt(theta)),
    estimators: [
      {
        id: 's2',
        name: 'Divisor n - 1',
        tex: 'S^2 = \\frac{1}{n-1}\\sum (X_i - \\bar{X})^2',
        compute: (s) => sumSquares(s) / (s.length - 1),
        bias: () => 0,
        variance: (n, theta) => (2 * theta ** 2) / (n - 1),
      },
      {
        id: 'mle',
        name: 'Divisor n',
        tex: '\\hat{\\sigma}^2 = \\frac{1}{n}\\sum (X_i - \\bar{X})^2',
        compute: (s) => sumSquares(s) / s.length,
        bias: (n, theta) => -theta / n,
        variance: (n, theta) => (2 * (n - 1) * theta ** 2) / n ** 2,
      },
      {
        id: 'n1',
        name: 'Divisor n + 1',
        tex: '\\frac{1}{n+1}\\sum (X_i - \\bar{X})^2',
        compute: (s) => sumSquares(s) / (s.length + 1),
        bias: (n, theta) => (-2 * theta) / (n + 1),
        variance: (n, theta) => (2 * (n - 1) * theta ** 2) / (n + 1) ** 2,
      },
    ],
  },
  'maximo-uniforme': {
    id: 'maximo-uniforme',
    parameter: '\\theta',
    population: (theta) => uniform(0, theta),
    estimators: [
      {
        id: 'momentos',
        name: 'Dos veces la media',
        tex: '2\\bar{X}',
        compute: (s) => 2 * mean(s),
        bias: () => 0,
        variance: (n, theta) => theta ** 2 / (3 * n),
      },
      {
        id: 'maximo',
        name: 'Máximo',
        tex: 'X_{(n)}',
        compute: (s) => Math.max(...s),
        bias: (n, theta) => -theta / (n + 1),
        variance: (n, theta) => (n * theta ** 2) / ((n + 1) ** 2 * (n + 2)),
      },
      {
        id: 'maximo-corregido',
        name: 'Máximo corregido',
        tex: '\\frac{n+1}{n}X_{(n)}',
        compute: (s) => ((s.length + 1) / s.length) * Math.max(...s),
        bias: () => 0,
        variance: (n, theta) => theta ** 2 / (n * (n + 2)),
      },
    ],
  },
  'media-exponencial': {
    id: 'media-exponencial',
    parameter: '\\theta',
    population: (theta) => exponential(1 / theta),
    estimators: [
      {
        id: 'media',
        name: 'Media muestral',
        tex: '\\bar{X}',
        compute: (s) => mean(s),
        bias: () => 0,
        variance: (n, theta) => theta ** 2 / n,
      },
      {
        id: 'minimo',
        name: 'n veces el mínimo',
        tex: 'n\\,X_{(1)}',
        compute: (s) => s.length * Math.min(...s),
        bias: () => 0,
        variance: (_, theta) => theta ** 2,
      },
      {
        id: 'mediana',
        name: 'Mediana entre log 2',
        tex: '\\tilde{X}/\\log 2',
        compute: (s) => median(s) / Math.LN2,
      },
    ],
  },
};

/** Mean squared error from bias and variance: MSE = variance + bias^2. */
export function meanSquaredError(bias: number, variance: number): number {
  return variance + bias * bias;
}

export interface EmpiricalSummary {
  mean: number;
  bias: number;
  variance: number;
  mse: number;
}

/** Bias, variance and mean squared error of simulated estimates around the true value. */
export function summarizeEstimates(estimates: readonly number[], theta: number): EmpiricalSummary {
  const m = mean(estimates);
  const variance =
    estimates.length > 1 ? sum(estimates.map((e) => (e - m) ** 2)) / estimates.length : 0;
  const mse = mean(estimates.map((e) => (e - theta) ** 2));
  return { mean: m, bias: m - theta, variance, mse };
}

/** Relative efficiency of A with respect to B: MSE(B) / MSE(A); above 1 means A is better. */
export function relativeEfficiency(mseA: number, mseB: number): number {
  return mseB / mseA;
}
