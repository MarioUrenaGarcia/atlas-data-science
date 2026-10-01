import { Random } from '../random/index.ts';

export type PairShape =
  'lineal' | 'parabola' | 'circulo' | 'independiente' | 'exponencial' | 'escalon' | 'senoidal';

export interface PairSpec {
  shape: PairShape;
  n: number;
  /** Noise as a fraction of the spread of the noiseless curve. */
  noise?: number;
  slope?: number;
}

const X_RANGE = 10;
const ROUND = 100;

function round(value: number): number {
  return Math.round(value * ROUND) / ROUND;
}

/**
 * Pairs (x, y) with a known kind of dependence, scaled to roughly 0 to 10 on
 * both axes so the figures share a layout.
 */
export function generatePairs(spec: PairSpec, random: Random): [number, number][] {
  const noise = spec.noise ?? 0.3;
  const slope = spec.slope ?? 1;
  const result: [number, number][] = [];
  for (let i = 0; i < spec.n; i += 1) {
    if (spec.shape === 'circulo') {
      const angle = random.uniform(0, 2 * Math.PI);
      const radius = 4 + random.normal(0, noise);
      result.push([round(5 + radius * Math.cos(angle)), round(5 + radius * Math.sin(angle))]);
      continue;
    }
    const x = random.uniform(0, X_RANGE);
    const t = x / X_RANGE;
    let y: number;
    switch (spec.shape) {
      case 'lineal':
        y = slope >= 0 ? 10 * t : 10 * (1 - t);
        break;
      case 'parabola':
        y = 10 * (2 * t - 1) ** 2;
        break;
      case 'exponencial':
        y = (10 * (Math.exp(3 * t) - 1)) / (Math.exp(3) - 1);
        break;
      case 'escalon':
        y = t < 0.5 ? 3 : 7;
        break;
      case 'senoidal':
        y = 5 + 4 * Math.sin(4 * Math.PI * t);
        break;
      case 'independiente':
        y = random.uniform(0, X_RANGE);
        break;
    }
    const spread = spec.shape === 'independiente' ? 0 : noise * 2.5;
    result.push([round(x), round(y + random.normal(0, spread))]);
  }
  return result;
}

/** Two independent random walks, the classic source of spurious correlation. */
export function randomWalks(
  steps: number,
  drift: [number, number],
  random: Random,
): [number[], number[]] {
  const a: number[] = [0];
  const b: number[] = [0];
  for (let t = 1; t < steps; t += 1) {
    a.push(round((a[t - 1] ?? 0) + drift[0] + random.normal()));
    b.push(round((b[t - 1] ?? 0) + drift[1] + random.normal()));
  }
  return [a, b];
}

export interface ConfounderSpec {
  levels: number;
  n: number;
  effectX: number;
  effectY: number;
  direct: number;
  noise: number;
  /** Values of x and y for the lowest stratum, so the data can sit in a realistic range. */
  origin?: [number, number];
}

/**
 * Data where a stratified variable z drives both x and y. Within each stratum
 * x affects y only through `direct`, so the overall association can be
 * produced entirely by z.
 */
export function confoundedData(
  spec: ConfounderSpec,
  random: Random,
): { x: number; y: number; z: number }[] {
  const rows: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < spec.n; i += 1) {
    const z = i % spec.levels;
    const [x0, y0] = spec.origin ?? [0, 0];
    const x = x0 + spec.effectX * z + random.normal(0, spec.noise);
    const y =
      y0 +
      spec.effectY * z +
      spec.direct * (x - x0 - spec.effectX * z) +
      random.normal(0, spec.noise);
    rows.push({ x: round(x), y: round(y), z });
  }
  return rows;
}
