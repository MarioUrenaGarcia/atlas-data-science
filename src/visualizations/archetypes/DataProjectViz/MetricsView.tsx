import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { useMemo, useState } from 'react';
import {
  argMax,
  breakEvenThreshold,
  classificationMetrics,
  confusionAt,
  decisionValue,
  scoredPopulation,
  thresholdSweep,
  type OutcomeValues,
} from '../../../lib/dataprep/decision.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';
import type { MetricCaseId, ModelMetric } from './schema.ts';

const POPULATION = 2000;
const GRID = Array.from({ length: 91 }, (_, i) => Number((0.05 + i * 0.01).toFixed(2)));
const POINTS_PER_SECOND = 24;

interface MetricCase {
  name: string;
  positive: string;
  action: string;
  values: OutcomeValues;
  prevalence: number;
  separation: number;
}

const CASES: Record<MetricCaseId, MetricCase> = {
  retencion: {
    name: 'Campaña de retención',
    positive: 'cliente que cancelaría',
    action: 'ofrecer descuento',
    values: { tp: 400, fp: -100, fn: 0, tn: 0 },
    prevalence: 0.15,
    separation: 2,
  },
  fraude: {
    name: 'Revisión de transacciones',
    positive: 'transacción fraudulenta',
    action: 'revisar a mano',
    values: { tp: 1850, fp: -150, fn: 0, tn: 0 },
    prevalence: 0.03,
    separation: 2.6,
  },
  mantenimiento: {
    name: 'Revisión preventiva de bombas',
    positive: 'bomba que fallará',
    action: 'revisar la bomba',
    values: { tp: 28000, fp: -2000, fn: 0, tn: 0 },
    prevalence: 0.08,
    separation: 2.2,
  },
};

const METRIC_NAMES: Record<ModelMetric, string> = {
  exactitud: 'Exactitud',
  f1: 'F1',
  precision: 'Precisión',
  sensibilidad: 'Sensibilidad',
};

const METRIC_KEY = {
  exactitud: 'accuracy',
  f1: 'f1',
  precision: 'precision',
  sensibilidad: 'recall',
} as const;

const METRIC_TEX: Record<ModelMetric, string> = {
  exactitud: '\\frac{VP + VN}{n}',
  f1: '\\frac{2\\,VP}{2\\,VP + FP + FN}',
  precision: '\\frac{VP}{VP + FP}',
  sensibilidad: '\\frac{VP}{VP + FN}',
};

interface MetricsViewProps {
  title: string;
  caseId: MetricCaseId;
  metric: ModelMetric;
  prevalence?: number;
  separation?: number;
  threshold: number;
  seed: number;
}

/**
 * A classifier score with a movable threshold. The model metric and the
 * money the decision earns are traced against the threshold: their best
 * thresholds rarely coincide.
 */
export function MetricsView(props: MetricsViewProps) {
  const item = CASES[props.caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'umbral',
      label: 'Umbral de decisión',
      min: 0.05,
      max: 0.95,
      step: 0.01,
      default: props.threshold,
      symbol: 'u',
      digits: 2,
    },
    {
      type: 'select',
      key: 'metrica',
      label: 'Métrica del modelo',
      options: Object.entries(METRIC_NAMES).map(([value, label]) => ({ value, label })),
      default: props.metric,
    },
    {
      type: 'number',
      key: 'prevalencia',
      label: 'Proporción de positivos',
      min: 0.02,
      max: 0.5,
      step: 0.01,
      default: props.prevalence ?? item.prevalence,
      symbol: 'π',
      digits: 2,
    },
    {
      type: 'number',
      key: 'separacion',
      label: 'Separación de puntajes',
      min: 0.5,
      max: 4,
      step: 0.1,
      default: props.separation ?? item.separation,
      symbol: 'd',
      digits: 1,
    },
  ];
  const parameters = useParameters(definitions);
  const threshold = Number(parameters.values.umbral);
  const metric = String(parameters.values.metrica) as ModelMetric;
  const prevalence = Number(parameters.values.prevalencia);
  const separation = Number(parameters.values.separacion);
  const seed = useSeed(props.seed);
  const reducedMotion = useReducedMotion();
  const cases = useMemo(
    () => scoredPopulation({ n: POPULATION, prevalence, separation }, new Random(seed.seed)),
    [prevalence, separation, seed.seed],
  );
  const sweep = useMemo(() => thresholdSweep(cases, GRID, item.values), [cases, item.values]);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState(
    `${seed.seed}|${prevalence}|${separation}|${run}`,
    () => (reducedMotion ? GRID.length : 1),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(GRID.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= GRID.length,
  });
  const key = METRIC_KEY[metric];
  const metricSeries = sweep.map((p) => p.metrics[key]);
  const valueSeries = sweep.map((p) => p.value);
  const bestMetric = argMax(metricSeries);
  const bestValue = argMax(valueSeries);
  const done = shown >= GRID.length;
  const c = confusionAt(cases, threshold);
  const m = classificationMetrics(c);
  const value = decisionValue(c, item.values);
  const g = (v: number) => formatNumber(v, 3);
  const money = (v: number) => `${formatNumber(Math.round(v), 0)} pesos`;
  const header = `${METRIC_NAMES[metric]} = ${METRIC_TEX[metric]} = ${g(m[key])},\\quad \\text{valor} = ${item.values.tp}\\,VP ${item.values.fp < 0 ? '-' : '+'} ${Math.abs(item.values.fp)}\\,FP = ${formatNumber(Math.round(value), 0)}`;
  const description =
    `${item.name}, ${POPULATION} casos con ${formatNumber(prevalence * 100, 0)} % de positivos. ` +
    `Con umbral ${formatNumber(threshold, 2)}: VP ${c.tp}, FP ${c.fp}, FN ${c.fn}, VN ${c.tn}; ` +
    `${METRIC_NAMES[metric]} ${g(m[key])} y valor ${money(value)}. ` +
    (done
      ? `La ${METRIC_NAMES[metric].toLowerCase()} es máxima con umbral ${formatNumber(GRID[bestMetric] ?? 0, 2)} y el valor con umbral ${formatNumber(GRID[bestValue] ?? 0, 2)}.`
      : '');

  return (
    <VizFrame
      title={props.title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: METRIC_NAMES[metric], value: g(m[key]), color: DATA_COLORS.primary },
        { label: 'Valor de la decisión', value: money(value), color: DATA_COLORS.secondary },
        {
          label: `Umbral que maximiza ${METRIC_NAMES[metric].toLowerCase()}`,
          value: done ? formatNumber(GRID[bestMetric] ?? 0, 2) : '...',
        },
        {
          label: 'Umbral que maximiza el valor',
          value: done ? formatNumber(GRID[bestValue] ?? 0, 2) : '...',
        },
        {
          label: 'Umbral de equilibrio teórico',
          value: formatNumber(breakEvenThreshold(item.values), 3),
        },
        { label: 'Casos marcados', value: `${c.tp + c.fp} de ${POPULATION}` },
      ]}
      legend={[
        { label: METRIC_NAMES[metric], color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Valor de la decisión (pesos)', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Umbral actual', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Métrica y valor por umbral',
        columns: ['Umbral', METRIC_NAMES[metric], 'Valor (pesos)'],
        rows: sweep
          .filter((_, i) => i % 5 === 0)
          .map((p) => [
            formatNumber(p.threshold, 2),
            g(p.metrics[key]),
            formatNumber(Math.round(p.value), 0),
          ]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        {item.name}: {item.action} si el puntaje es al menos {formatNumber(threshold, 2)}. Positivo:{' '}
        {item.positive}.
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={300}
        maxHeight={440}
        margins={{ top: 12, right: 18, bottom: 44, left: 64 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const gap = 26;
          const panel = (height - gap) / 2;
          const x = scaleLinear()
            .domain([0, 1])
            .range([left, left + width]);
          const yTop = scaleLinear()
            .domain([0, 1])
            .range([top + panel, top]);
          const vMin = Math.min(0, ...valueSeries);
          const vMax = Math.max(1, ...valueSeries);
          const yBottom = scaleLinear()
            .domain([vMin, vMax])
            .nice()
            .range([top + 2 * panel + gap, top + panel + gap]);
          const metricPath = line<number>()
            .defined((v) => Number.isFinite(v))
            .x((_, i) => x(GRID[i] ?? 0))
            .y((v) => yTop(v))(metricSeries.slice(0, shown));
          const valuePath = line<number>()
            .x((_, i) => x(GRID[i] ?? 0))
            .y((v) => yBottom(v))(valueSeries.slice(0, shown));
          return (
            <g>
              <Axis
                scale={yTop}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={4}
                label={METRIC_NAMES[metric]}
              />
              <Axis
                scale={yBottom}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={4}
                format={(v) => formatNumber(v / 1000, 0)}
                label="Valor (miles)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + 2 * panel + gap}
                ticks={10}
                label="Umbral"
              />
              <g aria-hidden="true">
                <line
                  x1={left}
                  x2={left + width}
                  y1={yBottom(0)}
                  y2={yBottom(0)}
                  stroke={DATA_COLORS.muted}
                />
                <path
                  d={metricPath ?? ''}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                <path
                  d={valuePath ?? ''}
                  fill="none"
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2.5}
                />
                {done && bestMetric >= 0 && (
                  <circle
                    cx={x(GRID[bestMetric] ?? 0)}
                    cy={yTop(metricSeries[bestMetric] ?? 0)}
                    r={6}
                    fill={DATA_COLORS.primary}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                )}
                {done && bestValue >= 0 && (
                  <circle
                    cx={x(GRID[bestValue] ?? 0)}
                    cy={yBottom(valueSeries[bestValue] ?? 0)}
                    r={6}
                    fill={DATA_COLORS.secondary}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                )}
                <line
                  x1={x(threshold)}
                  x2={x(threshold)}
                  y1={top}
                  y2={top + 2 * panel + gap}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                />
              </g>
            </g>
          );
        }}
      </ChartSvg>
      <div className={styles.tableScroll}>
        <table className={styles.matrix}>
          <caption className="visually-hidden">Matriz de confusión con el umbral actual</caption>
          <thead>
            <tr>
              <th scope="col">Clase real</th>
              <th scope="col">Actuar: {item.action}</th>
              <th scope="col">No actuar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Positivo</th>
              <td>
                VP = {c.tp}
                <span className={styles.matrixValue}>{money(c.tp * item.values.tp)}</span>
              </td>
              <td>
                FN = {c.fn}
                <span className={styles.matrixValue}>{money(c.fn * item.values.fn)}</span>
              </td>
            </tr>
            <tr>
              <th scope="row">Negativo</th>
              <td>
                FP = {c.fp}
                <span className={styles.matrixValue}>{money(c.fp * item.values.fp)}</span>
              </td>
              <td>
                VN = {c.tn}
                <span className={styles.matrixValue}>{money(c.tn * item.values.tn)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
