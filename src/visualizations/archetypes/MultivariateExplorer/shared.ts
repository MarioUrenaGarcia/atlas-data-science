import { useCallback, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Matrix, Vector } from '../../../lib/linalg/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import type { NumberParameter, ParameterDefinition } from '../../core/parameters.ts';
import { usePlayback, type Playback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import type { PlaneScales } from '../../core/svg/CartesianPlane.tsx';
import type { MultivariatePreset } from './schema.ts';

export const num = (
  key: string,
  label: string,
  symbol: string,
  min: number,
  max: number,
  step: number,
  value: number,
  digits = 2,
): NumberParameter => ({
  type: 'number',
  key,
  label,
  symbol,
  min,
  max,
  step,
  default: value,
  digits,
});

/** Mean vector and covariance sliders of a bivariate normal. */
export function bivariateDefinitions(initial: Record<string, number>): ParameterDefinition[] {
  return [
    num('mu1', 'Media de X₁', 'μ₁', -3, 3, 0.1, initial.mu1 ?? 0),
    num('mu2', 'Media de X₂', 'μ₂', -3, 3, 0.1, initial.mu2 ?? 0),
    num('sigma1', 'Desviación de X₁', 'σ₁', 0.3, 3, 0.05, initial.sigma1 ?? 1.5),
    num('sigma2', 'Desviación de X₂', 'σ₂', 0.3, 3, 0.05, initial.sigma2 ?? 1),
    num('rho', 'Correlación', 'ρ', -0.95, 0.95, 0.05, initial.rho ?? 0.6),
  ];
}

/** Half width of a plane that holds about 3.5 standard deviations around the mean. */
export function planeExtent(mu: Vector, sigma1: number, sigma2: number): number {
  const reach = Math.max(
    Math.abs(mu[0] ?? 0) + 3.5 * sigma1,
    (Math.abs(mu[1] ?? 0) + 3.5 * sigma2) / 0.7,
  );
  return Math.max(4, Math.ceil(reach / 2) * 2);
}

export function polyline(plane: PlaneScales, points: readonly Vector[]): string {
  return points.map((p) => `${plane.x(p[0] ?? 0)},${plane.y(p[1] ?? 0)}`).join(' ');
}

export function matrixText(matrix: Matrix, digits = 2): string {
  return `[${matrix.map((row) => row.map((value) => formatNumber(value, digits)).join(', ')).join('; ')}]`;
}

/** Samples drawn on demand, kept until the parameters, the seed or a restart change them. */
export function useSamples<T>(
  seed: SeedState,
  runKey: string,
  draw: (random: Random) => T,
  options: { max: number; rate: number },
): { samples: T[]; stepMany: (count: number) => void; playback: Playback } {
  const [run, setRun] = useState(0);
  const key = `${runKey}|${run}|${seed.seed}`;
  const random = useRandomSource(seed.seed, key);
  const [samples, update] = useResettableState<T[]>(key, () => []);
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws = Array.from({ length: count }, () => draw(generator));
      update((previous) => [...previous, ...draws].slice(0, options.max));
    },
    [random, draw, update, options.max],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: options.rate,
    done: samples.length >= options.max,
    autoplay: false,
  });
  return { samples, stepMany, playback };
}

/** Loads the values of a preset into the parameters that exist. */
export function loadPreset(
  preset: MultivariatePreset,
  definitions: readonly ParameterDefinition[],
  set: (key: string, value: number) => void,
): void {
  for (const [key, value] of Object.entries(preset.valores)) {
    if (definitions.some((definition) => definition.key === key)) set(key, value);
  }
}
