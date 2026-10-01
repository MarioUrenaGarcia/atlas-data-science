import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, median, variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { LegendItem } from '../../core/LegendList.tsx';
import type { NumberParameter, ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { ContinuousStage } from './ContinuousStage.tsx';
import { DensityOutcome, type DensityView } from './DensityOutcome.tsx';
import { continuousHeader } from './headers.ts';
import { processSpec, type ContinuousSettings, type ContinuousStageKind } from './processes.ts';
import type { ContinuousGenesisConfig } from './schema.ts';
import {
  advanceContinuous,
  animatesContinuous,
  continuousRate,
  initialContinuousState,
  MAX_EXPERIMENTS,
} from './simulation.ts';

const STAGE_SHARES: Record<ContinuousStageKind, number> = {
  rows: 0.38,
  timeline: 0.3,
  plane: 0.44,
  lighthouse: 0.4,
  circle: 0.44,
};
const MIN_STAGE_HEIGHT = 150;
const ROW_HEIGHT = 56;
const STAGE_GAP = 10;
/** Tail probability left out of the automatic histogram window on each side. */
const WINDOW_TAIL = 0.01;

const VIEWS = [
  { value: 'densidad', label: 'Densidad' },
  { value: 'acumulada', label: 'Función de distribución' },
];

function clampDefault(parameter: NumberParameter, raw: number | undefined): NumberParameter {
  const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : parameter.default;
  return { ...parameter, default: Math.min(parameter.max, Math.max(parameter.min, value)) };
}

/**
 * A random construction (waiting times, sums of squares, ratios, extremes,
 * distances, angles) runs step by step and each result falls into a
 * histogram that converges to the density of the continuous distribution it
 * generates.
 */
export default function ContinuousGenesis({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as ContinuousGenesisConfig;
  const spec = processSpec(config.proceso);
  const numeric = useMemo(
    () =>
      spec
        .parameters()
        .map((parameter) => clampDefault(parameter, config.valores?.[parameter.key])),
    [spec, config.valores],
  );
  const fixed = useMemo(() => new Set(config.fijos ?? []), [config.fijos]);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...numeric.filter((parameter) => !fixed.has(parameter.key)),
      ...(spec.reference
        ? [
            {
              type: 'toggle' as const,
              key: 'comparar',
              label: 'Mostrar la curva de comparación',
              default: config.comparar ?? true,
            },
          ]
        : []),
    ],
    [numeric, fixed, spec.reference, config.comparar],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const numericKey = numeric
    .map((parameter) =>
      fixed.has(parameter.key) ? parameter.default : Number(values[parameter.key]),
    )
    .join('|');

  const settings = useMemo<ContinuousSettings>(() => {
    const numbers = numericKey.split('|').map(Number);
    return {
      process: config.proceso,
      values: Object.fromEntries(
        numeric.map((parameter, i) => [parameter.key, numbers[i] ?? parameter.default]),
      ),
      unit: config.unidad ?? '',
    };
  }, [numericKey, numeric, config.proceso, config.unidad]);

  const theory = useMemo(() => spec.theory(settings), [spec, settings]);
  const theoryMedian = useMemo(() => theory.quantile(0.5), [theory]);
  const showReference = Boolean(values.comparar);
  const reference = useMemo(
    () => (showReference && spec.reference ? spec.reference(settings) : null),
    [showReference, spec, settings],
  );

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const runKey = `${numericKey}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [state, updateState] = useResettableState(`${runKey}|${seed.seed}`, initialContinuousState);
  const simulate = spec.simulate;
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      updateState((previous) =>
        advanceContinuous(previous, count, generator, (r) => simulate(r, settings)),
      );
    },
    [random, updateState, simulate, settings],
  );
  const completed = state.values.length;
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: continuousRate(completed),
    done: completed >= MAX_EXPERIMENTS,
    // The construction starts only when asked for; an animation running on arrival distracts from reading.
    autoplay: false,
  });

  const [view, setView] = useState<string>(config.vista ?? 'densidad');
  const domain = useMemo<[number, number]>(() => {
    if (config.dominio) return config.dominio;
    if (spec.window) return spec.window(settings);
    const [s0, s1] = theory.support;
    const lo =
      Number.isFinite(s0) && theory.cdf(s0 + 1e-9) > WINDOW_TAIL
        ? s0
        : theory.quantile(WINDOW_TAIL);
    const hi =
      Number.isFinite(s1) && 1 - theory.cdf(s1 - 1e-9) > WINDOW_TAIL
        ? s1
        : theory.quantile(1 - WINDOW_TAIL);
    const pad = (hi - lo) * 0.05;
    return [
      Number.isFinite(s0) ? Math.max(s0, lo - pad) : lo - pad,
      Number.isFinite(s1) ? Math.min(s1, hi + pad) : hi + pad,
    ];
  }, [config.dominio, theory, spec, settings]);

  const experiment = state.experiment;
  const finished = experiment !== null && state.shown >= experiment.events.length;
  const latest = finished ? (experiment?.value ?? null) : null;
  const header = continuousHeader(settings, experiment, state.shown);
  const axisLabel = `${spec.symbol}: ${spec.describe(settings)}`;
  const outcomes = state.values;
  const finiteMean = Number.isFinite(theory.mean);
  const finiteVariance = Number.isFinite(theory.variance);
  const readouts = [
    { label: 'Experimentos completados', value: String(completed) },
    {
      label: 'Media teórica',
      value: finiteMean ? formatNumber(theory.mean) : 'no existe',
      color: DATA_COLORS.primary,
    },
    {
      label: 'Media de los resultados',
      value: outcomes.length > 0 ? formatNumber(mean(outcomes)) : 'sin datos',
    },
    {
      label: 'Varianza teórica',
      value: finiteVariance ? formatNumber(theory.variance) : 'infinita o no existe',
      color: DATA_COLORS.primary,
    },
    {
      label: 'Varianza de los resultados',
      value: outcomes.length > 1 ? formatNumber(variance(outcomes)) : 'sin datos',
    },
    { label: 'Mediana teórica', value: formatNumber(theoryMedian) },
    {
      label: 'Mediana de los resultados',
      value: outcomes.length > 0 ? formatNumber(median(outcomes)) : 'sin datos',
    },
  ];
  const legend: LegendItem[] = [
    { label: `${theory.name}: densidad teórica`, color: DATA_COLORS.primary, shape: 'line' },
    { label: 'Histograma de los resultados', color: DATA_COLORS.light },
    { label: 'Último resultado', color: DATA_COLORS.highlight },
    ...(reference
      ? [{ label: reference.label, color: DATA_COLORS.muted, shape: 'dashed' as const }]
      : []),
  ];
  const description =
    `Se repite la construcción que genera la distribución ${theory.name}. Van ${completed} resultados; ` +
    `la mediana teórica es ${formatNumber(theoryMedian)} y la de los resultados es ${
      outcomes.length > 0 ? formatNumber(median(outcomes)) : 'aún no disponible'
    }.` +
    (latest !== null ? ` El último resultado fue ${formatNumber(latest)}.` : '');
  const table = useMemo(() => {
    const points = 11;
    const rows = Array.from({ length: points }, (_, i) => {
      const x = domain[0] + ((domain[1] - domain[0]) * i) / (points - 1);
      const empirical =
        outcomes.length > 0 ? outcomes.filter((v) => v <= x).length / outcomes.length : null;
      return [
        formatNumber(x, 2),
        formatNumber(theory.pdf(x), 4),
        formatNumber(theory.cdf(x), 4),
        empirical === null ? 'sin datos' : formatNumber(empirical, 4),
      ];
    });
    return {
      caption: `Densidad, función de distribución teórica y proporción observada de ${spec.symbol}`,
      columns: ['x', 'f(x)', 'F(x)', 'Proporción observada hasta x'],
      rows,
    };
  }, [domain, outcomes, theory, spec.symbol]);

  const rowsCount = spec.rows?.(settings).length ?? 0;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      views={{ options: VIEWS, value: view, onChange: setView }}
      readouts={readouts}
      legend={legend}
      description={description}
      dataTable={table}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.85}
        minHeight={420}
        maxHeight={620}
        margins={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {(box) => {
          const share = STAGE_SHARES[spec.stage];
          const wanted = spec.stage === 'rows' ? 60 + rowsCount * ROW_HEIGHT : box.height * share;
          const stageHeight = Math.max(MIN_STAGE_HEIGHT, Math.min(box.height * 0.5, wanted));
          const stage = { x: 0, y: 0, width: box.width, height: stageHeight };
          const chart = {
            x: 0,
            y: stageHeight + STAGE_GAP,
            width: box.width,
            height: box.height - stageHeight - STAGE_GAP,
          };
          return (
            <>
              <ContinuousStage
                box={stage}
                settings={settings}
                experiment={experiment}
                shown={state.shown}
                completed={completed}
                animate={animatesContinuous(completed) && playback.speed <= 1}
              />
              <line
                x1={8}
                x2={box.width - 8}
                y1={stageHeight + STAGE_GAP / 2}
                y2={stageHeight + STAGE_GAP / 2}
                stroke="var(--data-grid)"
              />
              <DensityOutcome
                box={chart}
                theory={theory}
                reference={reference}
                values={outcomes}
                view={view as DensityView}
                domain={domain}
                latest={latest}
                axisLabel={axisLabel}
              />
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
