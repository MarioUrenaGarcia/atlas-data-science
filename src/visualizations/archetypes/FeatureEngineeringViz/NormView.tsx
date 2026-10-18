import { scaleLinear } from 'd3-scale';
import { useId, useState } from 'react';
import { lpNorm, normalizeRow } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { NormCaseId } from './schema.ts';

const MORPH_STEPS = 24;
const STEPS_PER_SECOND = 12;

interface NormCase {
  axes: [string, string];
  rows: readonly [number, number][];
  labels: readonly string[];
}

const CASES: Record<NormCaseId, NormCase> = {
  textos: {
    axes: ['Veces que aparece "datos"', 'Veces que aparece "modelo"'],
    rows: [
      [3, 1],
      [12, 4],
      [1, 5],
      [2, 10],
      [6, 6],
    ],
    labels: ['Nota corta', 'Informe largo', 'Resumen', 'Tesis', 'Artículo'],
  },
  dietas: {
    axes: ['Proteína (g por porción)', 'Grasa (g por porción)'],
    rows: [
      [24, 6],
      [8, 2],
      [10, 14],
      [4, 16],
      [15, 15],
    ],
    labels: ['Pollo', 'Yogur', 'Queso', 'Aguacate', 'Nueces'],
  },
};

const P_VALUES: Record<string, number> = { '1': 1, '2': 2, inf: Number.POSITIVE_INFINITY };
const P_TEX: Record<string, string> = { '1': '1', '2': '2', inf: '\\infty' };

/** Boundary of the unit ball of the L_p norm in the first quadrant, as an SVG path. */
function unitBallPath(p: string, x: (v: number) => number, y: (v: number) => number): string {
  if (p === '1') return `M ${x(1)} ${y(0)} L ${x(0)} ${y(1)}`;
  if (p === 'inf') return `M ${x(1)} ${y(0)} L ${x(1)} ${y(1)} L ${x(0)} ${y(1)}`;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const a = (Math.PI / 2) * (i / 40);
    return `${i === 0 ? 'M' : 'L'} ${x(Math.cos(a))} ${y(Math.sin(a))}`;
  });
  return pts.join(' ');
}

/**
 * Each row is a vector. Normalizing divides it by its L_p norm, so every row
 * ends on the boundary of the unit ball: rows that point in the same
 * direction become identical, whatever their length.
 */
export function NormView({ title, caseId, p }: { title: string; caseId: NormCaseId; p: string }) {
  const item = CASES[caseId];
  const markerId = useId().replace(/:/g, '');
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'p',
      label: 'Norma',
      options: [
        { value: '1', label: 'L1 (suma de valores absolutos)' },
        { value: '2', label: 'L2 (euclidiana)' },
        { value: 'inf', label: 'L∞ (máximo)' },
      ],
      default: p,
    },
  ];
  const parameters = useParameters(definitions);
  const norm = String(parameters.values.p);
  const pv = P_VALUES[norm] ?? 2;
  const normalized = item.rows.map((r) => normalizeRow(r, pv) as [number, number]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stepIndex, update] = useResettableState<number>(`${caseId}|${norm}|${run}`, () =>
    reducedMotion ? MORPH_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(MORPH_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: stepIndex >= MORPH_STEPS,
  });
  const t = stepIndex / MORPH_STEPS;
  const current = item.rows.map((r) => {
    // Interpolating the divisor keeps each point on its own ray while it shrinks.
    const k = 1 + (1 / (lpNorm(r, pv) || 1) - 1) * t;
    return [r[0] * k, r[1] * k] as [number, number];
  });
  const first = item.rows[0] ?? [0, 0];
  const firstNorm = lpNorm(first, pv);
  const f = (v: number) => formatNumber(v, 3);
  const header = `\\mathbf{x}' = \\frac{\\mathbf{x}}{\\lVert \\mathbf{x} \\rVert_{${P_TEX[norm]}}} = \\frac{(${first[0]},\\ ${first[1]})}{${f(firstNorm)}} = (${f(normalized[0]?.[0] ?? 0)},\\ ${f(normalized[0]?.[1] ?? 0)})`;
  const description =
    `Normalización por la norma L${norm === 'inf' ? ' infinito' : norm}. ` +
    item.labels
      .map(
        (l, i) =>
          `${l}: norma ${f(lpNorm(item.rows[i] ?? [0, 0], pv))}, normalizado (${f(normalized[i]?.[0] ?? 0)}, ${f(normalized[i]?.[1] ?? 0)})`,
      )
      .join('; ') +
    '.';
  const maxValue = Math.max(...item.rows.flat());
  const domainMax = 1.1 * maxValue * (1 - t) + 1.15 * t;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={item.labels.map((l, i) => ({
        label: `${l}: norma`,
        value: f(lpNorm(item.rows[i] ?? [0, 0], pv)),
        color: seriesColor(i),
      }))}
      legend={[
        ...item.labels.map((l, i) => ({ label: l, color: seriesColor(i), shape: 'line' as const })),
        {
          label: 'Esfera unitaria de la norma',
          color: DATA_COLORS.muted,
          shape: 'dashed' as const,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Filas originales y normalizadas',
        columns: ['Fila', item.axes[0], item.axes[1], 'Norma', 'Normalizada'],
        rows: item.rows.map((r, i) => [
          item.labels[i] ?? '',
          r[0],
          r[1],
          f(lpNorm(r, pv)),
          `(${f(normalized[i]?.[0] ?? 0)}, ${f(normalized[i]?.[1] ?? 0)})`,
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.8}
        minHeight={280}
        maxHeight={440}
        margins={{ top: 12, right: 16, bottom: 46, left: 56 }}
      >
        {(box) => {
          const side = Math.min(box.inner.width, box.inner.height);
          const left = box.inner.left;
          const top = box.inner.top;
          const x = scaleLinear()
            .domain([0, domainMax])
            .range([left, left + side]);
          const y = scaleLinear()
            .domain([0, domainMax])
            .range([top + side, top]);
          return (
            <g>
              <defs>
                {item.rows.map((_, i) => (
                  <marker
                    key={i}
                    id={`${markerId}-${i}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={seriesColor(i)} />
                  </marker>
                ))}
              </defs>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={side}
                ticks={5}
                label={item.axes[1]}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + side}
                ticks={5}
                label={item.axes[0]}
              />
              <g aria-hidden="true">
                <path
                  d={unitBallPath(norm, x, y)}
                  fill="none"
                  stroke={DATA_COLORS.muted}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {current.map((c, i) => (
                  <g key={i}>
                    <line
                      x1={x(0)}
                      y1={y(0)}
                      x2={x(c[0])}
                      y2={y(c[1])}
                      stroke={seriesColor(i)}
                      strokeWidth={2.2}
                      markerEnd={`url(#${markerId}-${i})`}
                    />
                    <text x={x(c[0]) + 6} y={y(c[1]) - 4} className={styles.chartLabel}>
                      {item.labels[i]}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
