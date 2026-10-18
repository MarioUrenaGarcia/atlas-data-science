import { useMemo, useState } from 'react';
import {
  COPULA_IDS,
  COPULA_INFO,
  sampleCopula,
  thetaFromTau,
  type CopulaId,
} from '../../../lib/probability/copula.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import type { CopulaVizConfig } from './schema.ts';

const DEFAULT_SAMPLES = 1500;
/** Simulations finish in about twenty seconds at normal speed. */
const SAMPLE_SECONDS = 20;
const DEFAULT_TAU = 0.5;

/**
 * Shared state of the copula views: the family selector, one slider for the
 * strength of dependence measured by Kendall's tau (so families can be
 * compared at equal tau), any extra controls of the view, the seed and the
 * growing sample of pairs.
 */
export function useCopulaSample(
  config: CopulaVizConfig,
  conceptId: string,
  extra: readonly ParameterDefinition[] = [],
) {
  const families = useMemo(() => {
    const offered = config.familias ?? [config.familia];
    return COPULA_IDS.filter((id) => offered.includes(id) || id === config.familia);
  }, [config.familias, config.familia]);
  const definitions = useMemo(() => {
    const list: ParameterDefinition[] = [];
    if (families.length > 1) {
      list.push({
        type: 'select',
        key: 'familia',
        label: 'Familia de cópula',
        options: families.map((id) => ({ value: id, label: COPULA_INFO[id].label })),
        default: config.familia,
      });
    }
    list.push({
      type: 'number',
      key: 'tau',
      label: 'Dependencia (tau de Kendall)',
      symbol: 'τ',
      min: 0,
      max: 0.9,
      step: 0.05,
      digits: 2,
      default: config.tau ?? DEFAULT_TAU,
    });
    return [...list, ...extra];
  }, [config.familia, config.tau, families, extra]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const family = (values.familia as CopulaId | undefined) ?? config.familia;
  const tau = family === 'independiente' ? 0 : Number(values.tau ?? DEFAULT_TAU);
  const theta = thetaFromTau(family, tau);

  const total = config.muestras ?? DEFAULT_SAMPLES;
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const key = `${run}|${seed.seed}|${family}|${tau}`;
  const random = useRandomSource(seed.seed, key);
  const [pairs, update] = useResettableState<[number, number][]>(key, () => []);
  const draw = (count: number) => {
    const generator = random();
    const fresh = Array.from({ length: Math.max(0, Math.min(count, total - pairs.length)) }, () =>
      sampleCopula(family, theta, generator),
    );
    update((previous) => [...previous, ...fresh]);
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: Math.max(20, total / SAMPLE_SECONDS),
    done: pairs.length >= total,
  });
  return { family, tau, theta, pairs, total, playback, seed, parameters, values };
}
