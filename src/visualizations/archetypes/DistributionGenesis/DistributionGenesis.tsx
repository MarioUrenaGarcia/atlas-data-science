import { useCallback, useMemo, useState } from 'react';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import { covariance, mean, variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import type { LegendItem } from '../../core/LegendList.tsx';
import type { NumberParameter, ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { plotWindow } from '../../shared/plotWindow.ts';
import type { VisualizationProps } from '../../types.ts';
import styles from './DistributionGenesis.module.css';
import { GenesisStage } from './GenesisStage.tsx';
import { genesisHeader } from './headers.ts';
import { JointGrid } from './JointGrid.tsx';
import { OutcomeChart, type OutcomeView } from './OutcomeChart.tsx';
import {
  categoryProbabilities,
  defaultCategories,
  processSpec,
  type GenesisSettings,
  type StageKind,
} from './processes.ts';
import type { DistributionGenesisConfig, GenesisProcess } from './schema.ts';
import {
  advanceGenesis,
  animatesObjects,
  eventRate,
  initialGenesisState,
  MAX_EXPERIMENTS,
} from './simulation.ts';

/** Share of the drawing given to the experiment, by kind of scene. */
const STAGE_SHARES: Record<StageKind, number> = {
  die: 0.28,
  coins: 0.32,
  signs: 0.4,
  urn: 0.42,
  timeline: 0.34,
  spinner: 0.46,
  bins: 0.44,
  ranking: 0.38,
};
const MIN_STAGE_HEIGHT = 150;
/** Extra share for scenes that grow: long rows of coins, two arrival lanes. */
const EXTRA_SHARE = 0.06;

function stageShare(settings: GenesisSettings): number {
  const kind = processSpec(settings.process).stage;
  const n = settings.values.n ?? 1;
  let share = STAGE_SHARES[kind];
  if (kind === 'coins' && n > 20) share += EXTRA_SHARE;
  if (['primer-exito', 'r-exitos', 'mezcla-geometrica'].includes(settings.process))
    share += EXTRA_SHARE;
  if (settings.process === 'diferencia-de-llegadas') share += EXTRA_SHARE;
  if (settings.process === 'signos' && n === 1) share -= 2 * EXTRA_SHARE;
  return share;
}
const STAGE_GAP = 10;
/** Wide window for plotWindow; the real limits come from the distribution itself. */
const OUTCOME_LIMITS: [number, number] = [-1000, 1000];
/** Finite supports up to this width are drawn completely instead of trimmed by quantiles. */
const MAX_FULL_SUPPORT = 120;

const DEFAULT_UNITS: Partial<Record<GenesisProcess, string>> = {
  llegadas: 'llegadas en el intervalo',
  'ceros-inflados': 'conteo en el intervalo',
  'diferencia-de-llegadas': 'diferencia entre los conteos',
};

const REFERENCE_LABELS: Partial<Record<GenesisProcess, string>> = {
  urna: 'Comparar con el otro tipo de extracción',
  llegadas: 'Comparar con la Poisson',
  'beta-binomial': 'Comparar con la binomial de p fija',
  'ceros-inflados': 'Comparar con una Poisson de la misma media',
};

function clampDefault(parameter: NumberParameter, raw: number | undefined): NumberParameter {
  const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : parameter.default;
  return { ...parameter, default: Math.min(parameter.max, Math.max(parameter.min, value)) };
}

/**
 * A random experiment runs event by event (coins, draws, arrivals, spins)
 * and each result falls into a histogram that converges to the theoretical
 * mass function of the distribution it generates.
 */
export default function DistributionGenesis({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DistributionGenesisConfig;
  const spec = processSpec(config.proceso);
  const categories = useMemo(() => defaultCategories(config), [config]);
  const numeric = useMemo(
    () =>
      spec
        .parameters(config)
        .map((parameter) => clampDefault(parameter, config.valores?.[parameter.key])),
    [spec, config],
  );
  const fixed = useMemo(() => new Set(config.fijos ?? []), [config.fijos]);
  const offersReference =
    spec.reference !== undefined &&
    (config.proceso !== 'llegadas' || config.rendijas !== undefined);

  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...numeric.filter((parameter) => !fixed.has(parameter.key)),
      ...(config.proceso === 'urna'
        ? [
            {
              type: 'toggle' as const,
              key: 'reemplazo',
              label: 'Extraer con reemplazo',
              default: config.reemplazo ?? false,
            },
          ]
        : []),
      ...(spec.waiting
        ? [
            {
              type: 'select' as const,
              key: 'conteo',
              label: 'Qué se cuenta',
              options: [
                { value: 'ensayos', label: 'Ensayos totales' },
                { value: 'fracasos', label: 'Solo los fracasos' },
              ],
              default: config.conteo ?? (spec.waiting === 'first' ? 'ensayos' : 'fracasos'),
            },
          ]
        : []),
      ...(config.proceso === 'bolas-en-cajas'
        ? [
            {
              type: 'select' as const,
              key: 'caja',
              label: 'Caja cuyo conteo se grafica',
              options: categories.map((category, index) => ({
                value: String(index),
                label: category.label,
              })),
              default: '0',
            },
          ]
        : []),
      ...(offersReference
        ? [
            {
              type: 'toggle' as const,
              key: 'comparar',
              label: REFERENCE_LABELS[config.proceso] ?? 'Mostrar la comparación',
              default: config.comparar ?? config.proceso !== 'urna',
            },
          ]
        : []),
    ],
    [numeric, fixed, config, spec.waiting, categories, offersReference],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;

  const numericKey = numeric
    .map((parameter) =>
      fixed.has(parameter.key) ? parameter.default : Number(values[parameter.key]),
    )
    .join('|');
  const replacement = Boolean(values.reemplazo);
  const countTrials = spec.waiting ? values.conteo === 'ensayos' : false;
  const focus = Number(values.caja ?? 0);

  const settings = useMemo<GenesisSettings>(() => {
    const numbers = numericKey.split('|').map(Number);
    return {
      process: config.proceso,
      values: Object.fromEntries(
        numeric.map((parameter, index) => [parameter.key, numbers[index] ?? parameter.default]),
      ),
      replacement,
      countTrials,
      categories,
      focus,
      slots: config.rendijas ?? null,
      success: config.exito ?? 'Éxito',
      failure: config.fracaso ?? 'Fracaso',
      streams: config.flujos ?? ['Flujo 1', 'Flujo 2'],
      unit: config.unidad ?? DEFAULT_UNITS[config.proceso] ?? '',
      rankLabels: config.etiquetas ?? [],
    };
  }, [numericKey, numeric, replacement, countTrials, categories, focus, config]);

  const theory = useMemo(() => spec.theory(settings), [spec, settings]);
  const showReference = offersReference && Boolean(values.comparar);
  const reference = useMemo(
    () => (showReference && spec.reference ? spec.reference(settings) : null),
    [showReference, spec, settings],
  );

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  // The plotted box of a multinomial is read from the stored vectors, so changing it keeps the run.
  const runKey = `${numericKey}|${replacement}|${countTrials}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [state, updateState] = useResettableState(`${runKey}|${seed.seed}`, initialGenesisState);
  const simulate = spec.simulate;

  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      updateState((previous) =>
        advanceGenesis(previous, count, generator, (r) => simulate(r, settings)),
      );
    },
    [random, updateState, simulate, settings],
  );
  const outcomes = useMemo(
    () =>
      config.proceso === 'bolas-en-cajas'
        ? state.vectors.map((vector) => vector[focus] ?? 0)
        : state.values,
    [config.proceso, state.vectors, state.values, focus],
  );
  const completed = state.values.length;
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: eventRate(completed),
    done: completed >= MAX_EXPERIMENTS,
  });

  const probabilities = categoryProbabilities(settings);
  const categorical = config.proceso === 'ruleta';
  const viewOptions = [
    { value: 'masa', label: 'Función de masa' },
    { value: 'acumulada', label: 'Función de distribución' },
    ...(config.proceso === 'ranking' ? [{ value: 'loglog', label: 'Escala log-log' }] : []),
    ...(config.proceso === 'bolas-en-cajas' && categories.length >= 3
      ? [{ value: 'conjunta', label: 'Conteos conjuntos' }]
      : []),
  ];
  const [view, setView] = useState<string>(
    viewOptions.some((option) => option.value === config.vista) ? (config.vista ?? 'masa') : 'masa',
  );

  const domain = useMemo<[number, number]>(() => {
    if (categorical) return [0, categories.length - 1];
    if (config.proceso === 'ranking') return [1, Math.round(settings.values.N ?? 30)];
    // Finite supports are shown whole: a value with tiny probability is still possible.
    const [first, last] = theory.support;
    if (Number.isFinite(first) && Number.isFinite(last) && last - first <= MAX_FULL_SUPPORT)
      return [first, last];
    const window = plotWindow(
      reference ? [theory, reference.distribution] : [theory],
      OUTCOME_LIMITS,
      true,
    );
    return [Math.ceil(window[0]), Math.floor(window[1])];
  }, [categorical, categories.length, config.proceso, settings.values.N, theory, reference]);

  const experimentDone = state.experiment !== null && state.shown >= state.experiment.events.length;
  const latestVector = experimentDone ? (state.experiment?.counts ?? null) : null;
  const latest = experimentDone
    ? config.proceso === 'bolas-en-cajas'
      ? (latestVector?.[focus] ?? null)
      : (state.experiment?.value ?? null)
    : null;
  const header = genesisHeader(settings, state.experiment, state.shown);
  const symbol = spec.symbol;
  const axisLabel = `${symbol}: ${spec.describe(settings)}`;
  const labels = categorical ? categories.map((category) => category.label) : undefined;

  const readouts = [
    { label: 'Experimentos completados', value: String(completed) },
    ...(categorical
      ? categories.map((category, index) => ({
          label: `${category.label}: probabilidad y frecuencia`,
          value: `${probabilities[index]?.toFixed(3) ?? '0'} y ${
            outcomes.length > 0
              ? (outcomes.filter((value) => value === index).length / outcomes.length).toFixed(3)
              : 'sin datos'
          }`,
          color: index === 0 ? DATA_COLORS.primary : undefined,
        }))
      : [
          {
            label: `E[${symbol}] teórica`,
            value: formatNumber(theory.mean),
            color: DATA_COLORS.primary,
          },
          {
            label: 'Media de los resultados',
            value: outcomes.length > 0 ? formatNumber(mean(outcomes)) : 'sin datos',
          },
          {
            label: `Var(${symbol}) teórica`,
            value: formatNumber(theory.variance),
            color: DATA_COLORS.primary,
          },
          {
            label: 'Varianza de los resultados',
            value: outcomes.length > 1 ? formatNumber(variance(outcomes)) : 'sin datos',
          },
        ]),
    ...(config.proceso === 'ceros-inflados'
      ? [
          { label: 'P(X = 0) teórica', value: formatProbability(theory.pmf(0)) },
          {
            label: 'Proporción de ceros observada',
            value:
              outcomes.length > 0
                ? formatProbability(
                    outcomes.filter((value) => value === 0).length / outcomes.length,
                  )
                : 'sin datos',
          },
          {
            label: 'Ceros estructurales',
            value: String(state.structural),
            color: DATA_COLORS.tertiary,
          },
        ]
      : []),
    ...(config.proceso === 'bolas-en-cajas' && categories.length >= 2
      ? [
          {
            label: `Cov(X₁, X₂) teórica`,
            value: formatNumber(
              -(settings.values.n ?? 8) * (probabilities[0] ?? 0) * (probabilities[1] ?? 0),
            ),
          },
          {
            label: 'Covarianza observada',
            value:
              state.vectors.length > 1
                ? formatNumber(
                    covariance(
                      state.vectors.map((vector) => vector[0] ?? 0),
                      state.vectors.map((vector) => vector[1] ?? 0),
                    ),
                  )
                : 'sin datos',
          },
        ]
      : []),
  ];

  const legend: LegendItem[] = [
    { label: `${theory.name}: probabilidad teórica`, color: DATA_COLORS.primary, shape: 'line' },
    { label: 'Frecuencia relativa observada', color: DATA_COLORS.light },
    { label: 'Último resultado', color: DATA_COLORS.highlight },
    ...(config.proceso === 'ceros-inflados'
      ? [{ label: 'Ceros estructurales', color: DATA_COLORS.tertiary }]
      : []),
    ...(reference
      ? [{ label: reference.label, color: DATA_COLORS.muted, shape: 'dashed' as const }]
      : []),
  ];

  const description =
    `Se repite el experimento que genera la distribución ${theory.name}. ` +
    `Van ${completed} experimentos; la media teórica es ${formatNumber(theory.mean)} y la media de los resultados es ${
      outcomes.length > 0 ? formatNumber(mean(outcomes)) : 'aún no disponible'
    }. ` +
    (latest !== null
      ? `El último resultado fue ${labels ? (labels[latest] ?? latest) : latest}.`
      : '');

  const table = useMemo(() => {
    const rows = [];
    for (let k = domain[0]; k <= domain[1] && rows.length < 60; k += 1) {
      const observed =
        outcomes.length > 0 ? outcomes.filter((value) => value === k).length / outcomes.length : 0;
      rows.push([
        labels?.[k] ?? k,
        formatProbability(theory.pmf(k)),
        outcomes.length > 0 ? formatProbability(observed) : 'sin datos',
      ]);
    }
    return {
      caption: `Probabilidades teóricas y frecuencias observadas de ${symbol}`,
      columns: [symbol, `P(${symbol} = k)`, 'Frecuencia observada'],
      rows,
    };
  }, [domain, outcomes, theory, labels, symbol]);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      views={{ options: viewOptions, value: view, onChange: setView }}
      readouts={readouts}
      legend={legend}
      description={description}
      dataTable={table}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.85}
        minHeight={420}
        maxHeight={620}
        margins={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {(box) => {
          const stageHeight = Math.max(MIN_STAGE_HEIGHT, box.height * stageShare(settings));
          const stage = { x: 0, y: 0, width: box.width, height: stageHeight };
          const chart = {
            x: 0,
            y: stageHeight + STAGE_GAP,
            width: box.width,
            height: box.height - stageHeight - STAGE_GAP,
          };
          return (
            <>
              <GenesisStage
                box={stage}
                settings={settings}
                experiment={state.experiment}
                shown={state.shown}
                completed={completed}
                animate={animatesObjects(completed) && playback.speed <= 1}
              />
              <line
                x1={8}
                x2={box.width - 8}
                y1={stageHeight + STAGE_GAP / 2}
                y2={stageHeight + STAGE_GAP / 2}
                stroke="var(--data-grid)"
              />
              {view === 'conjunta' ? (
                <JointGrid
                  box={chart}
                  n={Math.round(settings.values.n ?? 8)}
                  probabilities={[
                    probabilities[0] ?? 0,
                    probabilities[1] ?? 0,
                    Math.max(0, 1 - (probabilities[0] ?? 0) - (probabilities[1] ?? 0)),
                  ]}
                  vectors={state.vectors}
                  labels={[categories[0]?.label ?? '1', categories[1]?.label ?? '2']}
                  latest={latestVector}
                />
              ) : (
                <OutcomeChart
                  box={chart}
                  theory={theory}
                  reference={reference}
                  values={outcomes}
                  structural={state.structural}
                  view={view as OutcomeView}
                  domain={domain}
                  labels={labels}
                  latest={latest}
                  axisLabel={axisLabel}
                />
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
