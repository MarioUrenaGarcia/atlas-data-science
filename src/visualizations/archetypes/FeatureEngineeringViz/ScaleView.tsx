import { useState } from 'react';
import { minMaxScale, robustScale, standardize } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, median, quantile, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import { SCALE_CASES } from './scaleCases.ts';
import type { ScaleCaseId, ScaleMethod } from './schema.ts';

const MORPH_STEPS = 24;
const STEPS_PER_SECOND = 12;
const QUERY = 0;

const METHOD_NAMES: Record<ScaleMethod, string> = {
  minmax: 'Escalamiento min-max',
  estandar: 'Estandarización',
  robusto: 'Escalamiento robusto',
};

function scale(method: ScaleMethod, values: readonly number[]): number[] {
  if (method === 'minmax') return minMaxScale(values);
  if (method === 'estandar') return standardize(values);
  return robustScale(values);
}

function nearest(points: readonly [number, number][], query: number): number {
  let best = -1;
  let bestD = Number.POSITIVE_INFINITY;
  const q = points[query];
  points.forEach((p, i) => {
    if (i === query || !q) return;
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/** Maps points into a square with the same scale on both axes, so drawn distances are true distances. */
function isotropic(
  points: readonly [number, number][],
  size: number,
  pad: number,
): [number, number][] {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const k = (size - 2 * pad) / span;
  return points.map((p) => [size / 2 + (p[0] - cx) * k, size / 2 - (p[1] - cy) * k]);
}

/**
 * Two variables measured in very different units, drawn with the same scale
 * on both axes so that drawn distance is Euclidean distance. The points morph
 * from raw units to scaled units and the nearest neighbor of the first point
 * changes once neither variable dominates.
 */
export function ScaleView({
  title,
  method,
  caseId,
  outlier,
}: {
  title: string;
  method: ScaleMethod;
  caseId: ScaleCaseId;
  outlier: boolean;
}) {
  const item = SCALE_CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'metodo',
      label: 'Método',
      options: (Object.keys(METHOD_NAMES) as ScaleMethod[]).map((m) => ({
        value: m,
        label: METHOD_NAMES[m],
      })),
      default: method,
    },
    {
      type: 'toggle',
      key: 'atipico',
      label: `Agregar un valor extremo de ${item.names[1].toLowerCase()}`,
      default: outlier,
    },
  ];
  const parameters = useParameters(definitions);
  const current = String(parameters.values.metodo) as ScaleMethod;
  const withOutlier = Boolean(parameters.values.atipico);
  const rows: [number, number][] = withOutlier ? [...item.rows, item.extreme] : [...item.rows];
  const labels = withOutlier ? [...item.labels, 'Extremo'] : [...item.labels];
  const a = rows.map((r) => r[0]);
  const b = rows.map((r) => r[1]);
  const sa = scale(current, a);
  const sb = scale(current, b);
  const scaled: [number, number][] = sa.map((v, i) => [v, sb[i] ?? 0]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stepIndex, update] = useResettableState<number>(
    `${current}|${caseId}|${withOutlier}|${run}`,
    () => (reducedMotion ? MORPH_STEPS : 0),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(MORPH_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: stepIndex >= MORPH_STEPS,
  });
  const t = stepIndex / MORPH_STEPS;
  const rawNN = nearest(rows, QUERY);
  const scaledNN = nearest(scaled, QUERY);
  const currentNN = t < 1 ? rawNN : scaledNN;
  const f = (v: number) => formatNumber(v, 2);
  const paramsText = (values: readonly number[]) =>
    current === 'minmax'
      ? `mín ${f(Math.min(...values))}, máx ${f(Math.max(...values))}`
      : current === 'estandar'
        ? `media ${f(mean(values))}, desv. est. ${f(standardDeviation(values))}`
        : `mediana ${f(median(values))}, RIC ${f(quantile(values, 0.75) - quantile(values, 0.25))}`;
  const x1 = b[QUERY] ?? 0;
  const header =
    current === 'minmax'
      ? `x' = \\frac{x - \\min x}{\\max x - \\min x}:\\quad ${f(x1)} \\mapsto \\frac{${f(x1)} - ${f(Math.min(...b))}}{${f(Math.max(...b))} - ${f(Math.min(...b))}} = ${f(sb[QUERY] ?? 0)}`
      : current === 'estandar'
        ? `z = \\frac{x - \\bar{x}}{s}:\\quad ${f(x1)} \\mapsto \\frac{${f(x1)} - ${f(mean(b))}}{${f(standardDeviation(b))}} = ${f(sb[QUERY] ?? 0)}`
        : `x' = \\frac{x - \\operatorname{mediana}}{\\mathrm{RIC}}:\\quad ${f(x1)} \\mapsto \\frac{${f(x1)} - ${f(median(b))}}{${f(quantile(b, 0.75) - quantile(b, 0.25))}} = ${f(sb[QUERY] ?? 0)}`;
  const description =
    `${METHOD_NAMES[current]} de ${item.names[0]} y ${item.names[1]}. Vecino más cercano de ${labels[QUERY]}: ` +
    `${labels[rawNN]} en unidades originales y ${labels[scaledNN]} tras escalar. ` +
    `${item.names[1]} escalado: entre ${f(Math.min(...sb))} y ${f(Math.max(...sb))}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: `Parámetros de ${item.names[0].toLowerCase()}`, value: paramsText(a) },
        { label: `Parámetros de ${item.names[1].toLowerCase()}`, value: paramsText(b) },
        {
          label: `Rango escalado de ${item.names[1].toLowerCase()}`,
          value: `${f(Math.min(...sb))} a ${f(Math.max(...sb))}`,
        },
        { label: 'Vecino más cercano sin escalar', value: labels[rawNN] ?? '' },
        {
          label: 'Vecino más cercano tras escalar',
          value: labels[scaledNN] ?? '',
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        {
          label: `Punto de consulta (${labels[QUERY]})`,
          color: DATA_COLORS.negative,
          shape: 'circle',
        },
        { label: 'Vecino más cercano', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Demás observaciones', color: DATA_COLORS.primary, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Valores originales y escalados',
        columns: [
          'Observación',
          item.names[0],
          item.names[1],
          `${item.names[0]} escalada`,
          `${item.names[1]} escalado`,
        ],
        rows: rows.map((r, i) => [labels[i] ?? '', f(r[0]), f(r[1]), f(sa[i] ?? 0), f(sb[i] ?? 0)]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        {t < 1
          ? `Unidades originales (${item.units[0]} y ${item.units[1]}), dibujadas con la misma escala en ambos ejes.`
          : 'Variables escaladas, con la misma escala en ambos ejes.'}
      </p>
      <ChartSvg
        label={description}
        aspect={0.75}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const size = Math.min(box.width, box.height);
          const pad = 24;
          const raw = isotropic(rows, size, pad);
          const fin = isotropic(scaled, size, pad);
          const offset = (box.width - size) / 2;
          const pos = raw.map((p, i) => {
            const q = fin[i] ?? p;
            return [offset + p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t] as [
              number,
              number,
            ];
          });
          const qp = pos[QUERY] ?? [0, 0];
          const np = pos[currentNN] ?? [0, 0];
          return (
            <g aria-hidden="true">
              <rect
                x={offset + 1}
                y={1}
                width={size - 2}
                height={size - 2}
                fill="none"
                stroke={DATA_COLORS.grid}
              />
              <text
                x={offset + size / 2}
                y={size - 6}
                textAnchor="middle"
                className={styles.chartLabel}
              >
                {item.names[0]}
                {t < 1 ? ` (${item.units[0]})` : ' escalada'}
              </text>
              <text
                transform={`translate(${offset + 12},${size / 2}) rotate(-90)`}
                textAnchor="middle"
                className={styles.chartLabel}
              >
                {item.names[1]}
                {t < 1 ? ` (${item.units[1]})` : ' escalado'}
              </text>
              <line
                x1={qp[0]}
                y1={qp[1]}
                x2={np[0]}
                y2={np[1]}
                stroke={DATA_COLORS.highlight}
                strokeWidth={2.5}
              />
              {pos.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={i === QUERY ? 7 : 5}
                    fill={i === QUERY ? DATA_COLORS.negative : DATA_COLORS.primary}
                    fillOpacity={0.85}
                  />
                  <text x={p[0] + 8} y={p[1] - 6} className={styles.chartLabel}>
                    {labels[i]}
                  </text>
                </g>
              ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
