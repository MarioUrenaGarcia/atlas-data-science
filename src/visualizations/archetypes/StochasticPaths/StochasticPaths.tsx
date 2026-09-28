import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean, variance } from '../../../lib/stats/index.ts';
import {
  DEFAULT_PROCESS_PARAMETERS,
  marginalAt,
  simulatePaths,
  type ProcessId,
  type ProcessParameters,
} from '../../../lib/stochastic/paths.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import type { NumberParameter, ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { PathsCanvas } from './PathsCanvas.tsx';
import type { StochasticPathsConfig } from './schema.ts';

const PROCESS_LABELS: Record<ProcessId, string> = {
  caminata: 'Caminata aleatoria simple',
  browniano: 'Movimiento browniano',
  'browniano-geometrico': 'Movimiento browniano geométrico',
  'ornstein-uhlenbeck': 'Proceso de Ornstein-Uhlenbeck',
  poisson: 'Proceso de Poisson',
  'puente-browniano': 'Puente browniano',
};

/** Which process parameters each process uses, with slider ranges. */
const PROCESS_CONTROLS: Record<ProcessId, NumberParameter[]> = {
  caminata: [
    {
      type: 'number',
      key: 'p',
      label: 'Probabilidad de subir',
      symbol: 'p',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.5,
    },
  ],
  browniano: [
    {
      type: 'number',
      key: 'mu',
      label: 'Deriva',
      symbol: 'μ',
      min: -2,
      max: 2,
      step: 0.05,
      default: 0,
    },
    {
      type: 'number',
      key: 'sigma',
      label: 'Volatilidad',
      symbol: 'σ',
      min: 0.1,
      max: 3,
      step: 0.05,
      default: 1,
    },
  ],
  'browniano-geometrico': [
    {
      type: 'number',
      key: 'mu',
      label: 'Deriva',
      symbol: 'μ',
      min: -1,
      max: 1,
      step: 0.01,
      default: 0.1,
    },
    {
      type: 'number',
      key: 'sigma',
      label: 'Volatilidad',
      symbol: 'σ',
      min: 0.05,
      max: 1,
      step: 0.01,
      default: 0.3,
    },
  ],
  'ornstein-uhlenbeck': [
    {
      type: 'number',
      key: 'theta',
      label: 'Velocidad de reversión',
      symbol: 'θ',
      min: 0.1,
      max: 5,
      step: 0.05,
      default: 1,
    },
    {
      type: 'number',
      key: 'mu',
      label: 'Media de largo plazo',
      symbol: 'μ',
      min: -3,
      max: 3,
      step: 0.1,
      default: 0,
    },
    {
      type: 'number',
      key: 'sigma',
      label: 'Volatilidad',
      symbol: 'σ',
      min: 0.1,
      max: 3,
      step: 0.05,
      default: 1,
    },
  ],
  poisson: [
    {
      type: 'number',
      key: 'lambda',
      label: 'Tasa de llegadas',
      symbol: 'λ',
      min: 0.2,
      max: 10,
      step: 0.1,
      default: 2,
    },
  ],
  'puente-browniano': [
    {
      type: 'number',
      key: 'sigma',
      label: 'Volatilidad',
      symbol: 'σ',
      min: 0.1,
      max: 3,
      step: 0.05,
      default: 1,
    },
  ],
};

const STEPS_PER_SECOND = 60;

export default function StochasticPaths({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as StochasticPathsConfig;
  const process = config.proceso;
  const isWalk = process === 'caminata';
  const steps = config.pasos ?? (isWalk ? 100 : 250);
  const horizon = isWalk ? steps : (config.horizonte ?? 1);
  const initialProcess = useMemo<ProcessParameters>(
    () => ({
      ...DEFAULT_PROCESS_PARAMETERS,
      ...(process === 'browniano-geometrico' ? { x0: 1 } : {}),
      ...config.valores,
    }),
    [process, config.valores],
  );

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...PROCESS_CONTROLS[process].map((control) => ({
        ...control,
        default: initialProcess[control.key as keyof ProcessParameters] ?? control.default,
      })),
      {
        type: 'number',
        key: 'trayectorias',
        label: 'Número de trayectorias',
        min: 1,
        max: 400,
        step: 1,
        default: config.trayectorias ?? 60,
      },
      {
        type: 'number',
        key: 'corte',
        label: 'Instante del corte',
        symbol: 't',
        min: 0,
        max: 1,
        step: 0.01,
        default: config.corte ?? 1,
        digits: 2,
      },
    ],
    [process, initialProcess, config.trayectorias, config.corte],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const processParameters = useMemo<ProcessParameters>(
    () => ({
      ...initialProcess,
      ...Object.fromEntries(
        PROCESS_CONTROLS[process].map((control) => [control.key, values[control.key]]),
      ),
    }),
    [initialProcess, process, values],
  );
  const count = Number(values.trayectorias);
  const parameterKey = PROCESS_CONTROLS[process].map((control) => values[control.key]).join('|');

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const simulationKey = `${parameterKey}|${count}|${seed.seed}|${run}`;
  const [simulation, update] = useResettableState(simulationKey, () => ({
    paths: simulatePaths(process, processParameters, horizon, steps, count, new Random(seed.seed)),
    revealed: 0,
  }));

  const playback = usePlayback({
    step: () =>
      update((previous) => ({ ...previous, revealed: Math.min(steps, previous.revealed + 1) })),
    stepMany: (n) =>
      update((previous) => ({ ...previous, revealed: Math.min(steps, previous.revealed + n) })),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND * (steps / 250),
    done: simulation.revealed >= steps,
  });

  const sliceIndex = Math.round(Number(values.corte) * steps);
  const sliceTime = (horizon * sliceIndex) / steps;
  const marginal = marginalAt(process, processParameters, sliceTime, horizon);
  const sliceValues =
    simulation.revealed >= sliceIndex ? simulation.paths.map((path) => path[sliceIndex] ?? 0) : [];

  // Vertical window from all simulated values, so it does not move while paths are revealed.
  const yDomain = useMemo<[number, number]>(() => {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const path of simulation.paths) {
      for (const value of path) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
      }
    }
    if (!(hi > lo)) return [lo - 1, hi + 1];
    const [niceLo = lo, niceHi = hi] = scaleLinear().domain([lo, hi]).nice().domain();
    return [niceLo, niceHi];
  }, [simulation.paths]);

  const readouts = [
    { label: 'Tiempo simulado', value: formatNumber((horizon * simulation.revealed) / steps, 2) },
    {
      label: 'Instante del corte t',
      value: formatNumber(sliceTime, 2),
      color: DATA_COLORS.secondary,
    },
    {
      label: 'Media observada de X(t)',
      value: sliceValues.length > 0 ? formatNumber(mean(sliceValues)) : 'sin datos',
    },
    {
      label: 'Varianza observada de X(t)',
      value: sliceValues.length > 1 ? formatNumber(variance(sliceValues)) : 'sin datos',
    },
    ...(marginal
      ? [
          {
            label: `Media teórica de X(t)${marginal.exact ? '' : ' (aprox.)'}`,
            value: formatNumber(marginal.distribution.mean),
            color: DATA_COLORS.primary,
          },
          {
            label: 'Varianza teórica de X(t)',
            value: formatNumber(marginal.distribution.variance),
          },
        ]
      : []),
  ];

  const description =
    `${count} trayectorias de ${PROCESS_LABELS[process].toLowerCase()} hasta t = ${formatNumber(horizon, 2)}. ` +
    (sliceValues.length > 0
      ? `En t = ${formatNumber(sliceTime, 2)} los valores tienen media ${formatNumber(mean(sliceValues))} y varianza ${formatNumber(variance(sliceValues))}.`
      : 'Las trayectorias todavía no alcanzan el instante del corte.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={[
        { label: 'Trayectorias destacadas', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Resto de trayectorias', color: DATA_COLORS.neutral, shape: 'line' },
        { label: 'Distribución en el corte', color: DATA_COLORS.secondary },
        ...(marginal && process !== 'poisson'
          ? [
              {
                label: 'Densidad teórica en el corte',
                color: DATA_COLORS.primary,
                shape: 'line' as const,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <PathsCanvas
        paths={simulation.paths}
        horizon={horizon}
        revealed={simulation.revealed}
        sliceIndex={sliceIndex}
        marginal={marginal?.distribution ?? null}
        discrete={isWalk || process === 'poisson'}
        yDomain={yDomain}
        label={description}
      />
    </VizFrame>
  );
}
