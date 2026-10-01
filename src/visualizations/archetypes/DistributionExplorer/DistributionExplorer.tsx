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
import { DISTRIBUTION_SPECS, specValues, withRanges } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { VisualizationProps } from '../../types.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { DistributionChart, type ChartView } from './DistributionChart.tsx';
import { linkedValues } from './linkedValues.ts';
import { PresetPanel } from './PresetPanel.tsx';
import { regionLabel, regionProbability, usesSecondBound } from './regions.ts';
import type { DistributionExplorerConfig, ExplorerPreset, Region } from './schema.ts';

const SAMPLES_PER_SECOND = 30;
const MAX_SAMPLES = 5000;
const TABLE_POINTS = 21;
/** Samples drawn at once by the quick simulation button. */
const QUICK_SAMPLES = 1000;

const REGION_OPTIONS = [
  { value: 'intervalo', label: 'Entre a y b' },
  { value: 'izquierda', label: 'Hasta a (X ≤ a)' },
  { value: 'derecha', label: 'Desde a (X ≥ a)' },
  { value: 'colas', label: 'Colas (X ≤ a o X ≥ b)' },
];

const VIEWS = [
  { value: 'densidad', label: 'Densidad o masa' },
  { value: 'acumulada', label: 'Función de distribución' },
] as const;

export default function DistributionExplorer({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DistributionExplorerConfig;
  const spec = useMemo(
    () => withRanges(DISTRIBUTION_SPECS[config.distribucion], config.rangos),
    [config.distribucion, config.rangos],
  );
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
  // Discrete windows end on halves; the bound sliders must sit on integers.
  const boundMin = spec.discrete ? Math.ceil(limits[0]) : limits[0];
  const boundMax = spec.discrete ? Math.floor(limits[1]) : limits[1];

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...spec.parameters
        .filter((parameter) => !fixed.has(parameter.key))
        .map((parameter) => ({
          ...parameter,
          default: initial[parameter.key] ?? parameter.default,
        })),
      {
        type: 'select',
        key: 'region',
        label: 'Región de probabilidad',
        options: REGION_OPTIONS,
        default: config.region ?? 'intervalo',
      },
      {
        type: 'number',
        key: 'desde',
        label: 'Límite a',
        symbol: 'a',
        min: boundMin,
        max: boundMax,
        step: intervalStep,
        default: defaultFrom,
      },
      {
        type: 'number',
        key: 'hasta',
        label: 'Límite b',
        symbol: 'b',
        min: boundMin,
        max: boundMax,
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
        label: 'Mostrar muestras simuladas',
        default: config.muestras ?? true,
      },
      ...(config.referencia
        ? [
            {
              type: 'toggle' as const,
              key: 'comparar',
              label: `Superponer: ${config.referencia.etiqueta}`,
              default: config.referencia.visible ?? true,
            },
          ]
        : []),
    ],
    [
      spec,
      fixed,
      initial,
      boundMin,
      boundMax,
      intervalStep,
      defaultFrom,
      defaultTo,
      config.probabilidad,
      config.muestras,
      config.region,
      config.referencia,
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
    const referenceSpec = withRanges(
      DISTRIBUTION_SPECS[config.referencia.distribucion],
      config.rangos,
    );
    const linked = linkedValues(config.referencia.enlace, distributionValues);
    return {
      distribution: referenceSpec.create(
        specValues(referenceSpec, { ...config.referencia.valores, ...linked }),
      ),
      label: config.referencia.etiqueta,
    };
  }, [config.referencia, config.rangos, distributionValues]);

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
    // Samples are drawn only when asked for, so the page opens on a still, readable chart.
    autoplay: false,
  });
  const sampleCount = samples.length;

  const from = Number(values.desde);
  const to = Number(values.hasta);
  const probability = Number(values.probabilidad);
  const showSamples = Boolean(values.muestras);
  const region = (values.region ?? 'intervalo') as Region;
  const intervalProbability = regionProbability(distribution, region, from, to);
  const regionText = regionLabel(region, from, to);
  const showReference = reference !== null && Boolean(values.comparar);
  const quantile = distribution.quantile(probability);
  const currentSamples = samples;

  const readouts = [
    { label: 'Esperanza E[X]', value: formatNumber(distribution.mean), color: DATA_COLORS.text },
    { label: 'Varianza Var(X)', value: formatNumber(distribution.variance) },
    { label: 'Desviación estándar', value: formatNumber(Math.sqrt(distribution.variance)) },
    {
      label: regionText,
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
    { label: 'Región de probabilidad y cuantil', color: DATA_COLORS.secondary },
    ...(showSamples ? [{ label: 'Muestras simuladas', color: DATA_COLORS.light }] : []),
    ...(reference && showReference
      ? [{ label: reference.label, color: DATA_COLORS.muted, shape: 'dashed' as const }]
      : []),
  ];

  const description =
    `Distribución ${spec.label} con ${spec.parameters.map((parameter) => `${parameter.label.toLowerCase()} ${formatNumber(distributionValues[parameter.key] ?? 0, 2)}`).join(', ')}. ` +
    `Media ${formatNumber(distribution.mean)} y varianza ${formatNumber(distribution.variance)}. ` +
    `${regionText} = ${formatProbability(intervalProbability)}. ` +
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

  const [active, setActive] = useState<number | 'ejemplo' | null>(null);
  const loadPreset = (preset: Pick<ExplorerPreset, 'valores' | 'region' | 'desde' | 'hasta'>) => {
    for (const [key, value] of Object.entries(preset.valores)) {
      if (spec.parameters.some((parameter) => parameter.key === key) && !fixed.has(key))
        parameters.set(key, value);
    }
    if (preset.region) parameters.set('region', preset.region);
    if (preset.desde !== undefined) parameters.set('desde', preset.desde);
    if (preset.hasta !== undefined) parameters.set('hasta', preset.hasta);
  };
  const exampleAnswer =
    active === 'ejemplo' ? `${regionText} = ${formatProbability(intervalProbability)}` : null;
  const hasPresets = (config.casos?.length ?? 0) > 0 || config.ejemplo !== undefined;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{
        ...parameters,
        values,
        disabled: usesSecondBound(region) ? [] : ['hasta'],
      }}
      controls={
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            if (!showSamples) parameters.set('muestras', true);
            stepMany(QUICK_SAMPLES);
          }}
        >
          {`Simular ${QUICK_SAMPLES} muestras`}
        </Button>
      }
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as ChartView) }}
      readouts={readouts}
      legend={legend}
      description={description}
      dataTable={table}
    >
      {hasPresets && (
        <PresetPanel
          cases={config.casos ?? []}
          example={config.ejemplo}
          active={active}
          answer={exampleAnswer}
          onLoadCase={(index) => {
            const preset = config.casos?.[index];
            if (!preset) return;
            loadPreset(preset);
            setActive(index);
          }}
          onLoadExample={() => {
            if (!config.ejemplo) return;
            loadPreset(config.ejemplo);
            setActive('ejemplo');
          }}
        />
      )}
      <DistributionChart
        distribution={distribution}
        reference={showReference ? reference : null}
        domain={domain}
        view={view}
        from={from}
        to={usesSecondBound(region) ? to : from}
        region={region}
        probability={probability}
        samples={currentSamples}
        showSamples={showSamples}
        label={description}
        onIntervalChange={(nextFrom, nextTo) => {
          parameters.set('desde', nextFrom);
          if (usesSecondBound(region)) parameters.set('hasta', nextTo);
        }}
      />
    </VizFrame>
  );
}
