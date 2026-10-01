import { Random } from '../random/index.ts';
import { mean, standardDeviation } from './index.ts';

export type ShapeFamily =
  | 'normal'
  | 'sesgo-derecha'
  | 'sesgo-izquierda'
  | 'colas-pesadas'
  | 'uniforme'
  | 'laplace'
  | 'mezcla';

export interface ShapeSpec {
  family: ShapeFamily;
  /**
   * Shape control: gamma shape for skewed families, degrees of freedom for
   * heavy tails, separation between components (in standard deviations) for
   * the mixture. Ignored by the other families.
   */
  shape: number;
  /** Weight of the first component of the mixture. */
  weight?: number;
}

/** Standardized draw (location 0, scale near 1) from a family of the given shape. */
export function drawShape(spec: ShapeSpec, random: Random): number {
  switch (spec.family) {
    case 'normal':
      return random.normal();
    case 'sesgo-derecha':
    case 'sesgo-izquierda': {
      // A gamma with shape k has skewness 2 / sqrt(k); it is centered and scaled to unit variance.
      const k = Math.max(0.2, spec.shape);
      const value = (random.gamma(k) - k) / Math.sqrt(k);
      return spec.family === 'sesgo-derecha' ? value : -value;
    }
    case 'colas-pesadas':
      return random.studentT(Math.max(1, spec.shape));
    case 'uniforme':
      return random.uniform(-Math.sqrt(3), Math.sqrt(3));
    case 'laplace': {
      const e1 = random.exponential();
      const e2 = random.exponential();
      return (e1 - e2) / Math.SQRT2;
    }
    case 'mezcla': {
      const half = spec.shape / 2;
      return random.next() < (spec.weight ?? 0.5)
        ? random.normal(-half, 1)
        : random.normal(half, 1);
    }
  }
}

export function drawSample(spec: ShapeSpec, n: number, random: Random): number[] {
  return Array.from({ length: n }, () => drawShape(spec, random));
}

/** Fraction of observations farther than k standard deviations from the mean. */
export function tailFraction(values: readonly number[], k: number): number {
  if (values.length < 2) return Number.NaN;
  const m = mean(values);
  const s = standardDeviation(values);
  return values.filter((value) => Math.abs(value - m) > k * s).length / values.length;
}

/**
 * Local maxima of a density evaluated on a grid, ignoring bumps lower than
 * `minRelativeHeight` times the global maximum so sampling noise is not
 * counted as a mode.
 */
export function densityModes(
  density: (x: number) => number,
  domain: [number, number],
  points = 200,
  minRelativeHeight = 0.1,
): number[] {
  const [lo, hi] = domain;
  const xs = Array.from({ length: points }, (_, i) => lo + ((hi - lo) * i) / (points - 1));
  const ys = xs.map(density);
  const top = Math.max(...ys);
  const modes: number[] = [];
  for (let i = 1; i < points - 1; i += 1) {
    const y = ys[i] ?? 0;
    if (y > (ys[i - 1] ?? 0) && y >= (ys[i + 1] ?? 0) && y >= minRelativeHeight * top) {
      modes.push(xs[i] ?? 0);
    }
  }
  return modes;
}

/** Population skewness and excess kurtosis of each family, for the reference readouts. */
export function familyMoments(spec: ShapeSpec): { skewness: number; kurtosis: number } {
  switch (spec.family) {
    case 'normal':
      return { skewness: 0, kurtosis: 0 };
    case 'sesgo-derecha':
      return { skewness: 2 / Math.sqrt(spec.shape), kurtosis: 6 / spec.shape };
    case 'sesgo-izquierda':
      return { skewness: -2 / Math.sqrt(spec.shape), kurtosis: 6 / spec.shape };
    case 'colas-pesadas':
      return {
        skewness: spec.shape > 3 ? 0 : Number.NaN,
        kurtosis: spec.shape > 4 ? 6 / (spec.shape - 4) : Number.POSITIVE_INFINITY,
      };
    case 'uniforme':
      return { skewness: 0, kurtosis: -1.2 };
    case 'laplace':
      return { skewness: 0, kurtosis: 3 };
    case 'mezcla': {
      const w = spec.weight ?? 0.5;
      const d = spec.shape;
      const mu = (1 - 2 * w) * (d / 2);
      const c1 = -d / 2 - mu;
      const c2 = d / 2 - mu;
      const m2 = 1 + w * c1 ** 2 + (1 - w) * c2 ** 2;
      const m3 = w * (c1 ** 3 + 3 * c1) + (1 - w) * (c2 ** 3 + 3 * c2);
      const m4 = w * (c1 ** 4 + 6 * c1 ** 2 + 3) + (1 - w) * (c2 ** 4 + 6 * c2 ** 2 + 3);
      return { skewness: m3 / m2 ** 1.5, kurtosis: m4 / m2 ** 2 - 3 };
    }
  }
}
