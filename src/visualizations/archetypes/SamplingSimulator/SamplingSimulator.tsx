import { scaleLinear } from 'd3-scale';
import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { VisualizationProps } from '../../types.ts';
import { PopulationStrip } from './PopulationStrip.tsx';
import type { SamplingSimulatorConfig, StatisticId } from './schema.ts';
import { computeStatistic, STATISTIC_LABELS, theoreticalSampling } from './statistics.ts';
import { StatisticHistogram } from './StatisticHistogram.tsx';

const SAMPLES_PER_SECOND = 6;
const MAX_REPETITIONS = 4000;
const PILOT_REPETITIONS = 300;

interface SimulationState {
  statistics: number[];
  lastSample: number[];
}

export default function SamplingSimulator({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as SamplingSimulatorConfig;
  const spec = DISTRIBUTION_SPECS[config.poblacion.distribucion];
  const initialPopulation = useMemo(
    () => specValues(spec, config.poblacion.valores),
    [spec, config.poblacion.valores],
  );
  const allowed = useMemo(
    () => config.estadisticos ?? [config.estadistico],
    [config.estadisticos, config.estadistico],
  );

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 1,
        max: config.nMaximo ?? 200,
        step: 1,
        default: config.n ?? 10,
      },
      ...(allowed.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'estadistico',
              label: 'Estadístico',
              options: allowed.map((id) => ({ value: id, label: STATISTIC_LABELS[id] })),
              default: config.estadistico,
            },
          ]
        : []),
      ...(config.poblacionEditable === false
        ? []
        : spec.parameters.map((parameter) => ({
            ...parameter,
            default: initialPopulation[parameter.key] ?? parameter.default,
          }))),
      {
        type: 'toggle',
        key: 'teoria',
        label: 'Mostrar la distribución teórica',
        default: config.teoria ?? true,
      },
    ],
    [
      config.nMaximo,
      config.n,
      config.estadistico,
      config.poblacionEditable,
      config.teoria,
      allowed,
      spec,
      initialPopulation,
    ],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;
  const n = Number(values.n);
  const statisticId = (
    allowed.length > 1 ? String(values.estadistico) : config.estadistico
  ) as StatisticId;
  const populationKey = spec.parameters
    .map((parameter) => values[parameter.key] ?? initialPopulation[parameter.key])
    .join('|');
  const population = useMemo(() => {
    const current = Object.fromEntries(
      spec.parameters.map((parameter, index) => [
        parameter.key,
        Number(populationKey.split('|')[index]),
      ]),
    );
    return spec.create(current);
  }, [spec, populationKey]);
  const populationDomain = useMemo(
    () => plotWindow([population], spec.domain, spec.discrete),
    [population, spec],
  );
  const theory = useMemo(
    () =>
      theoreticalSampling(statisticId, n, population, config.poblacion.distribucion === 'normal'),
    [statisticId, n, population, config.poblacion.distribucion],
  );

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${populationKey}|${n}|${statisticId}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, updateSimulation] = useResettableState<SimulationState>(
    `${runKey}|${seed.seed}`,
    () => ({
      statistics: [],
      lastSample: [],
    }),
  );

  // A pilot run with its own generator fixes a histogram window that stays
  // stable while repetitions accumulate.
  const statisticDomain = useMemo<[number, number]>(() => {
    const pilot = new Random(seed.seed + 1);
    const draws = Array.from({ length: PILOT_REPETITIONS }, () =>
      computeStatistic(
        statisticId,
        Array.from({ length: n }, () => population.sample(pilot)),
        population,
      ),
    ).filter(Number.isFinite);
    let lo = Math.min(...draws);
    let hi = Math.max(...draws);
    if (theory) {
      lo = Math.min(lo, theory.distribution.quantile(0.001));
      hi = Math.max(hi, theory.distribution.quantile(0.999));
    }
    if (!(hi > lo)) {
      lo -= 1;
      hi += 1;
    }
    const pad = (hi - lo) * 0.15;
    const [niceLo = lo - pad, niceHi = hi + pad] = scaleLinear()
      .domain([lo - pad, hi + pad])
      .nice()
      .domain();
    return [niceLo, niceHi];
  }, [seed.seed, statisticId, n, population, theory]);

  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const statistics: number[] = [];
      let lastSample: number[] = [];
      for (let i = 0; i < count; i += 1) {
        lastSample = Array.from({ length: n }, () => population.sample(generator));
        statistics.push(computeStatistic(statisticId, lastSample, population));
      }
      updateSimulation((previous) => ({
        statistics: [...previous.statistics, ...statistics].slice(0, MAX_REPETITIONS),
        lastSample,
      }));
    },
    [random, n, population, statisticId, updateSimulation],
  );

  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.statistics.length >= MAX_REPETITIONS,
  });

  const statistics = simulation.statistics;
  const last = statistics.length > 0 ? (statistics[statistics.length - 1] ?? null) : null;
  const empiricalMean = statistics.length > 0 ? mean(statistics) : Number.NaN;
  const empiricalSd = statistics.length > 1 ? standardDeviation(statistics) : Number.NaN;
  const showTheory = Boolean(values.teoria) && theory !== null;
  const label = STATISTIC_LABELS[statisticId];

  const readouts = [
    { label: 'Muestras extraídas', value: String(statistics.length) },
    {
      label: `${label} de la última muestra`,
      value: last === null ? 'sin datos' : formatNumber(last),
    },
    {
      label: `Media de los valores de ${label.toLowerCase()}`,
      value: formatNumber(empiricalMean),
      color: DATA_COLORS.secondary,
    },
    { label: 'Desviación estándar observada (error estándar)', value: formatNumber(empiricalSd) },
    ...(theory
      ? [
          {
            label: 'Media teórica',
            value: formatNumber(theory.distribution.mean),
            color: DATA_COLORS.primary,
          },
          {
            label: 'Error estándar teórico',
            value: formatNumber(Math.sqrt(theory.distribution.variance)),
          },
        ]
      : []),
  ];

  const description =
    `Se extraen muestras de tamaño ${n} de una población ${spec.label} y se registra ${label.toLowerCase()} de cada una. ` +
    `Tras ${statistics.length} muestras, su media es ${formatNumber(empiricalMean)} y su desviación estándar ${formatNumber(empiricalSd)}.` +
    (theory
      ? ` ${theory.label}: media ${formatNumber(theory.distribution.mean)} y error estándar ${formatNumber(Math.sqrt(theory.distribution.variance))}.`
      : '');

  const legend = [
    { label: 'Población', color: DATA_COLORS.primary },
    {
      label: 'Valores de la última muestra',
      color: DATA_COLORS.secondary,
      shape: 'circle' as const,
    },
    { label: `Histograma de ${label.toLowerCase()}`, color: DATA_COLORS.secondary },
    ...(showTheory && theory
      ? [{ label: theory.label, color: DATA_COLORS.primary, shape: 'line' as const }]
      : []),
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={legend}
      description={description}
    >
      <PopulationStrip
        population={population}
        domain={populationDomain}
        sample={simulation.lastSample}
        statistic={last}
        statisticLabel={label}
      />
      <StatisticHistogram
        values={statistics}
        domain={statisticDomain}
        theory={showTheory && theory ? theory.distribution : null}
        label={description}
        axisLabel={label}
      />
    </VizFrame>
  );
}
