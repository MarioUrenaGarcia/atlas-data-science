import { standardNormalCdf } from '../distributions/special.ts';
import type { Random } from '../random/index.ts';

/**
 * Independent summands that are not identically distributed, for the
 * Lyapunov and Lindeberg-Feller versions of the central limit theorem. Every
 * summand is centered, so the sum has mean zero.
 */
export type Summand =
  | { kind: 'uniforme'; halfWidth: number }
  | { kind: 'bernoulli'; p: number }
  | { kind: 'normal'; sd: number };

export const SCENARIO_IDS = [
  'uniformes-crecientes',
  'bernoulli-raiz',
  'uniformes-geometricas',
  'bernoulli-cuadraticas',
  'normales-geometricas',
] as const;
export type ScenarioId = (typeof SCENARIO_IDS)[number];

export interface Scenario {
  label: string;
  /** Law of the i-th summand in LaTeX. */
  latex: string;
  summand: (i: number) => Summand;
  /** Whether the standardized sums converge to N(0, 1). */
  normalLimit: boolean;
  /** Whether Lindeberg's condition holds. */
  lindeberg: boolean;
}

const GEOMETRIC_RATIO = 1.6;

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  'uniformes-crecientes': {
    label: 'Uniformes con anchos que crecen como √i',
    latex: 'X_i \\sim U(-\\sqrt{i},\\ \\sqrt{i})',
    summand: (i) => ({ kind: 'uniforme', halfWidth: Math.sqrt(i) }),
    normalLimit: true,
    lindeberg: true,
  },
  'bernoulli-raiz': {
    label: 'Bernoulli con pᵢ = 1/√(i + 1)',
    latex:
      'X_i \\sim \\operatorname{Bernoulli}\\big(\\tfrac{1}{\\sqrt{i+1}}\\big) - \\tfrac{1}{\\sqrt{i+1}}',
    summand: (i) => ({ kind: 'bernoulli', p: 1 / Math.sqrt(i + 1) }),
    normalLimit: true,
    lindeberg: true,
  },
  'uniformes-geometricas': {
    label: `Uniformes con anchos que crecen como ${GEOMETRIC_RATIO}ⁱ`,
    latex: `X_i \\sim U(-${GEOMETRIC_RATIO}^{i},\\ ${GEOMETRIC_RATIO}^{i})`,
    summand: (i) => ({ kind: 'uniforme', halfWidth: GEOMETRIC_RATIO ** i }),
    normalLimit: false,
    lindeberg: false,
  },
  'bernoulli-cuadraticas': {
    label: 'Bernoulli con pᵢ = 1/(i + 1)²',
    latex:
      'X_i \\sim \\operatorname{Bernoulli}\\big(\\tfrac{1}{(i+1)^2}\\big) - \\tfrac{1}{(i+1)^2}',
    summand: (i) => ({ kind: 'bernoulli', p: 1 / (i + 1) ** 2 }),
    normalLimit: false,
    lindeberg: false,
  },
  'normales-geometricas': {
    label: 'Normales con varianzas 2ⁱ',
    latex: 'X_i \\sim \\mathcal{N}(0,\\ 2^{i})',
    summand: (i) => ({ kind: 'normal', sd: Math.sqrt(2 ** i) }),
    normalLimit: true,
    lindeberg: false,
  },
};

export function summandVariance(summand: Summand): number {
  switch (summand.kind) {
    case 'uniforme':
      return summand.halfWidth ** 2 / 3;
    case 'bernoulli':
      return summand.p * (1 - summand.p);
    case 'normal':
      return summand.sd ** 2;
  }
}

/** E|X - mu|^3 of a summand. */
export function summandAbsoluteThird(summand: Summand): number {
  switch (summand.kind) {
    case 'uniforme':
      return summand.halfWidth ** 3 / 4;
    case 'bernoulli': {
      const { p } = summand;
      return p * (1 - p) * (p * p + (1 - p) * (1 - p));
    }
    case 'normal':
      return 2 * Math.sqrt(2 / Math.PI) * summand.sd ** 3;
  }
}

/** E[(X - mu)^2 1{|X - mu| > c}], the part of the variance beyond c. */
export function summandTailVariance(summand: Summand, c: number): number {
  switch (summand.kind) {
    case 'uniforme': {
      const a = summand.halfWidth;
      return c >= a ? 0 : (a ** 3 - Math.max(0, c) ** 3) / (3 * a);
    }
    case 'bernoulli': {
      const { p } = summand;
      let total = 0;
      if (1 - p > c) total += p * (1 - p) ** 2;
      if (p > c) total += (1 - p) * p * p;
      return total;
    }
    case 'normal': {
      const u = Math.max(0, c) / summand.sd;
      const phi = Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
      return summand.sd ** 2 * 2 * (u * phi + 1 - standardNormalCdf(u));
    }
  }
}

export function sampleSummand(summand: Summand, random: Random): number {
  switch (summand.kind) {
    case 'uniforme':
      return random.uniform(-summand.halfWidth, summand.halfWidth);
    case 'bernoulli':
      return (random.bernoulli(summand.p) ? 1 : 0) - summand.p;
    case 'normal':
      return random.normal(0, summand.sd);
  }
}

export interface TriangularDiagnostics {
  /** s_n^2, the variance of the sum. */
  variance: number;
  /** Lyapunov ratio with delta = 1: sum E|X_i|^3 / s_n^3. */
  lyapunov: number;
  /** Lindeberg sum (1/s_n^2) sum E[X_i^2 1{|X_i| > eps s_n}]. */
  lindeberg: number;
  /** max_i Var(X_i) / s_n^2, Feller's negligibility quantity. */
  maxShare: number;
  /** Var(X_i) / s_n^2 for each summand. */
  shares: number[];
  /** Tail part of each share, beyond eps s_n. */
  tailShares: number[];
}

export function diagnostics(scenario: Scenario, n: number, eps: number): TriangularDiagnostics {
  const summands = Array.from({ length: n }, (_, i) => scenario.summand(i + 1));
  const variances = summands.map(summandVariance);
  const variance = variances.reduce((total, v) => total + v, 0);
  const sn = Math.sqrt(variance);
  const third = summands.reduce((total, s) => total + summandAbsoluteThird(s), 0);
  const tails = summands.map((s) => summandTailVariance(s, eps * sn) / variance);
  const shares = variances.map((v) => v / variance);
  return {
    variance,
    lyapunov: third / sn ** 3,
    lindeberg: tails.reduce((total, t) => total + t, 0),
    maxShare: Math.max(...shares),
    shares,
    tailShares: tails,
  };
}

/** Standardized sum S_n / s_n of one simulated row of the triangular array. */
export function sampleStandardizedSum(
  scenario: Scenario,
  n: number,
  sn: number,
  random: Random,
): number {
  let total = 0;
  for (let i = 1; i <= n; i += 1) total += sampleSummand(scenario.summand(i), random);
  return total / sn;
}
