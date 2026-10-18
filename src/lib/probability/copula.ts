/**
 * Bivariate copulas: joint distributions on the unit square with uniform
 * marginals. Sampling for the independence, Gaussian, Clayton, Gumbel and
 * Frank families, their distribution functions, Kendall's tau and the
 * coefficients of tail dependence.
 */
import { standardNormalCdf } from '../distributions/special.ts';
import type { Random } from '../random/index.ts';

export const COPULA_IDS = ['independiente', 'gaussiana', 'clayton', 'gumbel', 'frank'] as const;
export type CopulaId = (typeof COPULA_IDS)[number];

export interface CopulaInfo {
  /** Spanish name. */
  label: string;
  /** Parameter symbol in LaTeX. */
  symbol: string;
  /** Allowed range of the parameter and a sensible default. */
  min: number;
  max: number;
  default: number;
}

export const COPULA_INFO: Record<CopulaId, CopulaInfo> = {
  independiente: { label: 'Independiente', symbol: '', min: 0, max: 0, default: 0 },
  gaussiana: { label: 'Gaussiana', symbol: '\\rho', min: -0.95, max: 0.95, default: 0.7 },
  clayton: { label: 'Clayton', symbol: '\\theta', min: 0.1, max: 10, default: 2 },
  gumbel: { label: 'Gumbel', symbol: '\\theta', min: 1, max: 10, default: 2 },
  frank: { label: 'Frank', symbol: '\\theta', min: -15, max: 15, default: 5 },
};

/** Keeps the parameter inside the family's admissible range. */
export function clampCopulaParameter(id: CopulaId, theta: number): number {
  const info = COPULA_INFO[id];
  return Math.min(info.max, Math.max(info.min, theta));
}

/**
 * Positive stable variable with Laplace transform exp(-s^alpha), 0 < alpha < 1,
 * by Kanter's representation; it is the frailty behind the Gumbel copula.
 */
function positiveStable(alpha: number, random: Random): number {
  const u = Math.PI * random.uniform(1e-12, 1 - 1e-12);
  const e = random.exponential(1);
  const a = Math.sin(alpha * u) / Math.sin(u) ** (1 / alpha);
  const b = (Math.sin((1 - alpha) * u) / e) ** ((1 - alpha) / alpha);
  return a * b;
}

/** One draw (u, v) from the copula. */
export function sampleCopula(id: CopulaId, theta: number, random: Random): [number, number] {
  const t = clampCopulaParameter(id, theta);
  switch (id) {
    case 'independiente':
      return [random.uniform(), random.uniform()];
    case 'gaussiana': {
      const z1 = random.normal();
      const z2 = t * z1 + Math.sqrt(1 - t * t) * random.normal();
      return [standardNormalCdf(z1), standardNormalCdf(z2)];
    }
    case 'clayton': {
      // Conditional inversion: V given U = u has an explicit inverse distribution function.
      const u = random.uniform(1e-12, 1);
      const w = random.uniform(1e-12, 1);
      const v = (u ** -t * (w ** (-t / (1 + t)) - 1) + 1) ** (-1 / t);
      return [u, v];
    }
    case 'gumbel': {
      if (t === 1) return [random.uniform(), random.uniform()];
      // Marshall and Olkin: a common stable frailty S makes both coordinates large together.
      const alpha = 1 / t;
      const s = positiveStable(alpha, random);
      const e1 = random.exponential(1);
      const e2 = random.exponential(1);
      return [Math.exp(-((e1 / s) ** alpha)), Math.exp(-((e2 / s) ** alpha))];
    }
    case 'frank': {
      if (Math.abs(t) < 1e-9) return [random.uniform(), random.uniform()];
      const u = random.uniform();
      const w = random.uniform(1e-12, 1 - 1e-12);
      const a = Math.exp(-t * u);
      const v = (-1 / t) * Math.log(1 + (w * (Math.exp(-t) - 1)) / (w + (1 - w) * a));
      return [u, v];
    }
  }
}

/** Kendall's tau of the family, a rank correlation in [-1, 1]. */
export function kendallTau(id: CopulaId, theta: number): number {
  const t = clampCopulaParameter(id, theta);
  switch (id) {
    case 'independiente':
      return 0;
    case 'gaussiana':
      return (2 / Math.PI) * Math.asin(t);
    case 'clayton':
      return t / (t + 2);
    case 'gumbel':
      return 1 - 1 / t;
    case 'frank': {
      if (Math.abs(t) < 1e-9) return 0;
      // Debye function D1(t) = (1/t) * integral from 0 to t of s / (e^s - 1) ds, by Simpson's rule.
      const n = 400;
      const h = t / n;
      let sum = 0;
      for (let k = 0; k <= n; k += 1) {
        const s = k * h;
        const f = s === 0 ? 1 : s / Math.expm1(s);
        sum += (k === 0 || k === n ? 1 : k % 2 === 1 ? 4 : 2) * f;
      }
      const debye = (sum * h) / 3 / t;
      return 1 - (4 / t) * (1 - debye);
    }
  }
}

/**
 * Parameter of the family that gives the requested Kendall tau in [0, 1):
 * closed forms for the Gaussian, Clayton and Gumbel families and bisection
 * for Frank, whose tau increases with theta.
 */
export function thetaFromTau(id: CopulaId, tau: number): number {
  const t = Math.min(0.95, Math.max(0, tau));
  switch (id) {
    case 'independiente':
      return 0;
    case 'gaussiana':
      return Math.sin((Math.PI * t) / 2);
    case 'clayton':
      return clampCopulaParameter(id, (2 * t) / (1 - t));
    case 'gumbel':
      return clampCopulaParameter(id, 1 / (1 - t));
    case 'frank': {
      let lo = 0;
      let hi = COPULA_INFO.frank.max;
      for (let k = 0; k < 60; k += 1) {
        const mid = (lo + hi) / 2;
        if (kendallTau('frank', mid) < t) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }
  }
}

export interface TailDependence {
  /** lim P(V <= q | U <= q) as q goes to 0. */
  lower: number;
  /** lim P(V > q | U > q) as q goes to 1. */
  upper: number;
}

export function tailDependence(id: CopulaId, theta: number): TailDependence {
  const t = clampCopulaParameter(id, theta);
  switch (id) {
    case 'clayton':
      return { lower: 2 ** (-1 / t), upper: 0 };
    case 'gumbel':
      return { lower: 0, upper: 2 - 2 ** (1 / t) };
    default:
      // The Gaussian copula with |rho| < 1 and the Frank copula have no tail dependence.
      return { lower: 0, upper: 0 };
  }
}

/**
 * Empirical estimate of P(V > q | U > q) (upper) or P(V <= 1 - q | U <= 1 - q)
 * (lower) from sampled pairs; it approaches the tail coefficient as q nears 1.
 */
export function empiricalTail(
  pairs: readonly (readonly [number, number])[],
  q: number,
  side: 'upper' | 'lower',
): number {
  let inU = 0;
  let both = 0;
  for (const [u, v] of pairs) {
    const hitU = side === 'upper' ? u > q : u <= 1 - q;
    if (!hitU) continue;
    inU += 1;
    if (side === 'upper' ? v > q : v <= 1 - q) both += 1;
  }
  return inU > 0 ? both / inU : 0;
}
