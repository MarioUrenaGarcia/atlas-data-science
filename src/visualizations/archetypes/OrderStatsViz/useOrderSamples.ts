import { useMemo, useState } from 'react';
import type { ContinuousDistribution } from '../../../lib/distributions/index.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { OrderStatsVizConfig } from './schema.ts';

const DEFAULT_SAMPLES = 1500;
/** The first samples are drawn slowly so each sorted sample can be followed. */
const SLOW_SAMPLES = 8;
const SLOW_RATE = 1.5;
const SAMPLE_SECONDS = 25;

export interface OrderSamples {
  /** The last sample, sorted. */
  last: number[];
  /** Every sample, sorted, as columns of order statistics: values[k] holds the (k+1)-th smallest. */
  byRank: number[][];
}

/** Continuous parent distribution of the draws, its plotting window and a sampler. */
export function useParent(config: OrderStatsVizConfig) {
  return useMemo(() => {
    const spec = DISTRIBUTION_SPECS[config.distribucion];
    const created = spec.create(specValues(spec, config.parametros));
    const distribution: ContinuousDistribution =
      created.kind === 'continuous'
        ? created
        : (DISTRIBUTION_SPECS.normal.create({}) as ContinuousDistribution);
    return {
      distribution,
      label: config.nombre ?? spec.label,
      domain: plotWindow([distribution], spec.domain, false),
    };
  }, [config.distribucion, config.parametros, config.nombre]);
}

/**
 * Repeated samples of size n from the parent distribution, each one sorted,
 * accumulated rank by rank so any order statistic can be histogrammed.
 */
export function useOrderSamples(
  config: OrderStatsVizConfig,
  conceptId: string,
  distribution: ContinuousDistribution,
  n: number,
) {
  const total = config.muestras ?? DEFAULT_SAMPLES;
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}|${n}`;
  const random = useRandomSource(seed.seed, key);
  const [samples, update] = useResettableState<OrderSamples>(key, () => ({
    last: [],
    byRank: Array.from({ length: n }, () => []),
  }));
  const count = samples.byRank[0]?.length ?? 0;
  const draw = (rounds: number) => {
    const generator = random();
    const fresh = Array.from({ length: Math.max(0, Math.min(rounds, total - count)) }, () =>
      Array.from({ length: n }, () => distribution.sample(generator)).sort((a, b) => a - b),
    );
    if (fresh.length === 0) return;
    update((previous) => ({
      last: fresh.at(-1) ?? previous.last,
      byRank: previous.byRank.map((column, k) => [...column, ...fresh.map((s) => s[k] ?? 0)]),
    }));
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: count < SLOW_SAMPLES ? SLOW_RATE : Math.max(30, total / SAMPLE_SECONDS),
    done: count >= total,
  });
  return { samples, count, total, playback, seed };
}

/** Histogram of values as densities over the window. */
export function densityBins(
  values: readonly number[],
  [lo, hi]: [number, number],
  bins: number,
): number[] {
  const width = (hi - lo) / bins;
  const counts = Array<number>(bins).fill(0);
  for (const value of values) {
    const k = Math.floor((value - lo) / width);
    if (k >= 0 && k < bins) counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts.map((c) => (values.length > 0 ? c / (values.length * width) : 0));
}
