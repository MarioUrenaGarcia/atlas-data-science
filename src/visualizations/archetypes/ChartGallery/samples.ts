import { Random } from '../../../lib/random/index.ts';
import { drawSample } from '../../../lib/stats/shape.ts';
import type { SampleSpec } from './schema.ts';

const DEFAULT_N = 200;
const SEED_STRIDE = 104729;

/** Values of a sample: the given ones, or a seeded draw from its shape. */
export function resolveSample(spec: SampleSpec, seed: number, index = 0): number[] {
  if (spec.valores) return [...spec.valores];
  const factor = 10 ** (spec.decimales ?? 1);
  const draws = drawSample(
    { family: spec.forma ?? 'normal', shape: spec.parametro ?? 4 },
    spec.n ?? DEFAULT_N,
    new Random(seed + SEED_STRIDE * index),
  );
  const center = spec.centro ?? 0;
  const scale = spec.escala ?? 1;
  return draws.map((z) => Math.round((center + scale * z) * factor) / factor);
}

export function axisLabel(axis: { variable: string; unidad?: string | undefined }): string {
  return axis.unidad ? `${axis.variable} (${axis.unidad})` : axis.variable;
}

export interface PairGenerator {
  n: number;
  pendiente: number;
  ruido: number;
  media?: number | undefined;
  mediaY?: number | undefined;
  escala?: number | undefined;
  redondeo?: number | undefined;
}

/** Pairs with y = mediaY + slope (x - media) + noise, optionally rounding x to create ties. */
export function resolvePairs(spec: PairGenerator, seed: number): [number, number][] {
  const random = new Random(seed);
  const center = spec.media ?? 0;
  const scale = spec.escala ?? 1;
  return Array.from({ length: spec.n }, () => {
    let x = random.normal(center, scale);
    if (spec.redondeo) x = Math.round(x / spec.redondeo) * spec.redondeo;
    const y =
      spec.pendiente * (x - center) + random.normal(0, spec.ruido) + (spec.mediaY ?? center);
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100] as [number, number];
  });
}
