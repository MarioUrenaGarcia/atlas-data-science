import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Matrix } from '../../../lib/linalg/index.ts';
import {
  distributionAfter,
  nextState,
  normalizeRows,
  stationaryDistribution,
  totalVariation,
} from '../../../lib/stochastic/markov.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { DistributionBars } from './DistributionBars.tsx';
import { MatrixEditor } from './MatrixEditor.tsx';
import type { MarkovChainConfig } from './schema.ts';
import { StateGraph } from './StateGraph.tsx';

const STEPS_PER_SECOND = 2;
const MAX_STEPS = 100_000;

interface ChainState {
  current: number;
  previous: number | null;
  steps: number;
  visits: number[];
}

export default function MarkovChainViz({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as MarkovChainConfig;
  const states = config.estados;
  const initialState = config.inicial ?? 0;
  const [weights, setWeights] = useState<Matrix>(() => config.matriz.map((row) => [...row]));
  const transition = useMemo(() => normalizeRows(weights), [weights]);
  const initialDistribution = useMemo(
    () => states.map((_, index) => (index === initialState ? 1 : 0)),
    [states, initialState],
  );
  const stationary = useMemo(
    () => stationaryDistribution(transition, initialDistribution),
    [transition, initialDistribution],
  );

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${JSON.stringify(weights)}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [chain, update] = useResettableState<ChainState>(`${runKey}|${seed.seed}`, () => ({
    current: initialState,
    previous: null,
    steps: 0,
    visits: states.map((_, index) => (index === initialState ? 1 : 0)),
  }));

  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      update((previous) => {
        let current = previous.current;
        let before = previous.current;
        const visits = [...previous.visits];
        for (let i = 0; i < count; i += 1) {
          before = current;
          current = nextState(current, transition, generator);
          visits[current] = (visits[current] ?? 0) + 1;
        }
        return { current, previous: before, steps: previous.steps + count, visits };
      });
    },
    [random, transition, update],
  );

  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: chain.steps >= MAX_STEPS,
  });

  const totalVisits = chain.visits.reduce((sum, value) => sum + value, 0);
  const empirical = chain.visits.map((value) => value / Math.max(1, totalVisits));
  const theoretical = useMemo(
    () => distributionAfter(initialDistribution, transition, Math.min(chain.steps, 500)),
    [initialDistribution, transition, chain.steps],
  );
  const tokenDuration = Math.min(450, 900 / (STEPS_PER_SECOND * playback.speed));
  const stateName = states[chain.current] ?? '';

  const readouts = [
    { label: 'Paso', value: String(chain.steps) },
    { label: 'Estado actual', value: stateName },
    {
      label: 'Distribución estacionaria π',
      value: stationary.map((value) => formatNumber(value, 3)).join(', '),
      color: DATA_COLORS.text,
    },
    {
      label: 'Distancia de variación total entre πₙ y π',
      value: formatNumber(totalVariation(theoretical, stationary), 4),
      color: DATA_COLORS.primary,
    },
    {
      label: 'Distancia entre frecuencias y π',
      value: formatNumber(totalVariation(empirical, stationary), 4),
      color: DATA_COLORS.secondary,
    },
  ];

  const description =
    `Cadena de Markov con estados ${states.join(', ')}. Tras ${chain.steps} pasos la ficha está en ${stateName}. ` +
    `Frecuencias de visita: ${states.map((state, index) => `${state} ${formatNumber(empirical[index] ?? 0, 3)}`).join(', ')}. ` +
    `Distribución estacionaria: ${states.map((state, index) => `${state} ${formatNumber(stationary[index] ?? 0, 3)}`).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={readouts}
      legend={[
        { label: 'Frecuencia de visitas', color: DATA_COLORS.secondary },
        { label: 'Distribución después de n pasos', color: DATA_COLORS.primary },
        { label: 'Distribución estacionaria', color: DATA_COLORS.text, shape: 'dashed' },
      ]}
      description={description}
      controls={
        config.editable === false ? undefined : (
          <MatrixEditor
            states={states}
            weights={weights}
            normalized={transition}
            onChange={(row, column, value) =>
              setWeights((previous) =>
                previous.map((entries, i) =>
                  i === row ? entries.map((entry, j) => (j === column ? value : entry)) : entries,
                ),
              )
            }
          />
        )
      }
      dataTable={{
        caption: 'Matriz de transición normalizada',
        columns: ['Desde', ...states],
        rows: transition.map((row, i) => [
          states[i] ?? '',
          ...row.map((value) => formatNumber(value, 3)),
        ]),
      }}
    >
      <StateGraph
        states={states}
        transition={transition}
        current={chain.current}
        previous={chain.previous}
        stepCount={chain.steps}
        tokenDuration={tokenDuration}
        label={description}
      />
      <DistributionBars
        states={states}
        empirical={empirical}
        theoretical={theoretical}
        stationary={stationary}
        label="Distribución de la cadena por estado"
      />
    </VizFrame>
  );
}
