import { useCallback, useMemo, useState } from 'react';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import { mean, variance } from '../../../lib/stats/index.ts';
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
import { DistributionChart, type ChartView } from './DistributionChart.tsx';
import type { DistributionExplorerConfig } from './schema.ts';

const SAMPLES_PER_SECOND = 30;
const MAX_SAMPLES = 5000;
const TABLE_POINTS = 21;

const VIEWS = [
  { value: 'densidad', label: 'Densidad o masa' },
  { value: 'acumulada', label: 'Función de distribución' },
] as const;

export default function DistributionExplorer({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DistributionExplorerConfig;
  const spec = DISTRIBUTION_SPECS[config.distribucion];
  // Slider limits for the interval; the plotted window adapts inside them.
  const limits: [number, number] = config.dominio ?? spec.domain;
  const fixed = useMemo(() => new Set(config.fijos ?? []), [config.fijos]);

  // Defaults of the adjustable controls come from the frontmatter; the
  // interval defaults to the central 50 % of the initial distribution.
  const initial = useMemo(() => specValues(spec, config.valores), [spec, config.valores]);
  const initialDistribution = useMemo(() => spec.create(initial), [spec, initial]);
  const defaultFrom = config.desde ?? Number(initialDistribution.quantile(0.25).toFixed(2));
  const defaultTo = config.hasta ?? Number(initialDistribution.quantile(0.75).toFixed(2));
  const intervalStep = spec.discrete ? 1 : Number(((limits[1] - limits[0]) / 400).toPrecision(1));

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...spec.parameters
        .filter((parameter) => !fixed.has(parameter.key))
        .map((parameter) => ({
          ...parameter,
          default: initial[parameter.key] ?? parameter.default,
        })),
      {
        type: 'number',
        key: 'desde',
        label: 'Inicio del intervalo',
        symbol: 'a',
        min: limits[0],
        max: limits[1],
        step: intervalStep,
        default: defaultFrom,
      },
      {
        type: 'number',
        key: 'hasta',
        label: 'Fin del intervalo',
        symbol: 'b',
        min: limits[0],
        max: limits[1],
        step: intervalStep,
        default: defaultTo,
      },
      {
        type: 'number',
        key: 'probabilidad',
        label: 'Probabilidad acumulada',
        symbol: 'p',
        min: 0.01,
        max: 0.99,
        step: 0.01,
        default: config.probabilidad ?? 0.9,
      },
      {
        type: 'toggle',
        key: 'muestras',
        label: 'Superponer muestras simuladas',
        default: config.muestras ?? true,
      },
    ],
    [
      spec,
      fixed,
      initial,
      limits,
      intervalStep,
      defaultFrom,
      defaultTo,
      config.probabilidad,
      config.muestras,
    ],
  );

  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  // Keyed by the distribution's own values so moving the interval or the
  // quantile does not rebuild the distribution and restart the simulation.
  const distributionKey = spec.parameters
    .map((parameter) => values[parameter.key] ?? initial[parameter.key])
    .join('|');
  const distributionValues = useMemo(
    () =>
      Object.fromEntries(
        spec.parameters.map((parameter, index) => [
          parameter.key,
          Number(distributionKey.split('|')[index]),
        ]),
      ),
    [spec, distributionKey],
  );
  const distribution = useMemo(() => spec.create(distributionValues), [spec, distributionValues]);
  const reference = useMemo(() => {
    if (!config.referencia) return null;
    const referenceSpec = DISTRIBUTION_SPECS[config.referencia.distribucion];
    return {
      distribution: referenceSpec.create(specValues(referenceSpec, config.referencia.valores)),
      label: config.referencia.etiqueta,
    };
  }, [config.referencia]);

  const domain = useMemo<[number, number]>(
    () => config.dominio ?? plotWindow([initialDistribution, distribution], limits, spec.discrete),
    [config.dominio, initialDistribution, distribution, limits, spec.discrete],
  );

  const [view, setView] = useState<ChartView>(config.vista ?? 'densidad');
  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  // New distribution parameters, a new seed or a restart begin a fresh simulation.
  const runKey = `${distributionKey}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [samples, updateSamples] = useResettableState<number[]>(`${runKey}|${seed.seed}`, () => []);

  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws = Array.from({ length: count }, () => distribution.sample(generator));
      updateSamples((previous) => [...previous, ...draws].slice(0, MAX_SAMPLES));
    },
    [random, distribution, updateSamples],
  );

  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: samples.length >= MAX_SAMPLES,
    autoplay: Boolean(values.muestras),
  });
  const sampleCount = samples.length;

  const from = Number(values.desde);
  const to = Number(values.hasta);
  const probability = Number(values.probabilidad);
  const showSamples = Boolean(values.muestras);
  const intervalProbability =
    distribution.kind === 'discrete'
      ? distribution.cdf(Math.floor(to)) - distribution.cdf(Math.ceil(from) - 1)
      : distribution.cdf(to) - distribution.cdf(from);
  const quantile = distribution.quantile(probability);
  const currentSamples = samples;

  const readouts = [
    { label: 'Esperanza E[X]', value: formatNumber(distribution.mean), color: DATA_COLORS.text },
    { label: 'Varianza Var(X)', value: formatNumber(distribution.variance) },
    { label: 'Desviación estándar', value: formatNumber(Math.sqrt(distribution.variance)) },
    {
      label: `P(${formatNumber(from, 2)} ≤ X ≤ ${formatNumber(to, 2)})`,
      value: formatProbability(intervalProbability),
      color: DATA_COLORS.secondary,
    },
    { label: `Cuantil x con p = ${probability.toFixed(2)}`, value: formatNumber(quantile) },
    ...(showSamples
      ? [
          { label: 'Muestras simuladas', value: String(sampleCount), color: DATA_COLORS.light },
          {
            label: 'Media muestral',
            value: sampleCount > 0 ? formatNumber(mean(currentSamples)) : 'sin datos',
          },
          {
            label: 'Varianza muestral',
            value: sampleCount > 1 ? formatNumber(variance(currentSamples)) : 'sin datos',
          },
        ]
      : []),
  ];

  const legend = [
    {
      label: `${spec.label} ${spec.discrete ? '(función de masa)' : '(densidad)'}`,
      color: DATA_COLORS.primary,
      shape: 'line' as const,
    },
    { label: 'Intervalo [a, b] y cuantil', color: DATA_COLORS.secondary },
    ...(showSamples ? [{ label: 'Muestras simuladas', color: DATA_COLORS.light }] : []),
    ...(reference
      ? [{ label: reference.label, color: DATA_COLORS.muted, shape: 'dashed' as const }]
      : []),
  ];

  const description =
    `Distribución ${spec.label} con ${spec.parameters.map((parameter) => `${parameter.label.toLowerCase()} ${formatNumber(distributionValues[parameter.key] ?? 0, 2)}`).join(', ')}. ` +
    `Media ${formatNumber(distribution.mean)} y varianza ${formatNumber(distribution.variance)}. ` +
    `La probabilidad entre ${formatNumber(from, 2)} y ${formatNumber(to, 2)} es ${formatProbability(intervalProbability)}. ` +
    (showSamples ? `Se han simulado ${sampleCount} valores.` : '');

  const table = useMemo(() => {
    if (distribution.kind === 'discrete') {
      const first = Math.ceil(Math.max(domain[0], distribution.support[0]));
      const last = Math.floor(Math.min(domain[1], distribution.support[1]));
      const rows = [];
      for (let k = first; k <= last && rows.length < 60; k += 1) {
        rows.push([
          k,
          formatProbability(distribution.pmf(k)),
          formatProbability(distribution.cdf(k)),
        ]);
      }
      return {
        caption: `Valores de la distribución ${spec.label}`,
        columns: ['k', 'P(X = k)', 'P(X ≤ k)'],
        rows,
      };
    }
    const rows = Array.from({ length: TABLE_POINTS }, (_, i) => {
      const xValue = domain[0] + ((domain[1] - domain[0]) * i) / (TABLE_POINTS - 1);
      return [
        formatNumber(xValue, 2),
        formatNumber(distribution.pdf(xValue), 4),
        formatProbability(distribution.cdf(xValue)),
      ];
    });
    return {
      caption: `Valores de la distribución ${spec.label}`,
      columns: ['x', 'f(x)', 'F(x)'],
      rows,
    };
  }, [distribution, domain, spec.label]);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as ChartView) }}
      readouts={readouts}
      legend={legend}
      description={description}
      dataTable={table}
    >
      <DistributionChart
        distribution={distribution}
        reference={reference}
        domain={domain}
        view={view}
        from={Math.min(from, to)}
        to={Math.max(from, to)}
        probability={probability}
        samples={currentSamples}
        showSamples={showSamples}
        label={description}
        onIntervalChange={(nextFrom, nextTo) => {
          parameters.set('desde', nextFrom);
          parameters.set('hasta', nextTo);
        }}
      />
    </VizFrame>
  );
}
