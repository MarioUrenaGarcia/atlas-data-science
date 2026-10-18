import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  assignBins,
  equalFrequencyEdges,
  equalWidthEdges,
} from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { BinMethod } from './schema.ts';

const N = 120;
const POINTS_PER_SECOND = 40;

/** Delivery times in days: a right-skewed gamma sample. */
function deliveryTimes(seed: number): number[] {
  const random = new Random(seed);
  return Array.from({ length: N }, () => Number((0.5 + random.gamma(2, 0.5)).toFixed(1)));
}

/**
 * A skewed variable cut into intervals of equal width or of equal frequency.
 * Values drop into their bins one by one; equal width leaves the tail bins
 * almost empty, equal frequency makes narrow bins where data are dense.
 */
export function BinningView({
  title,
  method,
  bins,
  seed: seed0,
}: {
  title: string;
  method: BinMethod;
  bins: number;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'metodo',
      label: 'Criterio de los cortes',
      options: [
        { value: 'anchura', label: 'Igual anchura' },
        { value: 'frecuencia', label: 'Igual frecuencia (cuantiles)' },
      ],
      default: method,
    },
    {
      type: 'number',
      key: 'k',
      label: 'Número de intervalos',
      min: 2,
      max: 10,
      step: 1,
      default: bins,
      symbol: 'k',
    },
  ];
  const parameters = useParameters(definitions);
  const current = String(parameters.values.metodo) as BinMethod;
  const k = Number(parameters.values.k);
  const seed = useSeed(seed0);
  const values = useMemo(() => deliveryTimes(seed.seed), [seed.seed]);
  const edges = current === 'anchura' ? equalWidthEdges(values, k) : equalFrequencyEdges(values, k);
  const assigned = assignBins(values, edges);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${current}|${k}|${run}`, () =>
    reducedMotion ? N : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(N, v + 1)),
    stepMany: (count) => update((v) => Math.min(N, v + count)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= N,
  });
  const counts = Array.from(
    { length: k },
    (_, b) => assigned.slice(0, shown).filter((a) => a === b).length,
  );
  const finalCounts = Array.from({ length: k }, (_, b) => assigned.filter((a) => a === b).length);
  const f = (v: number) => formatNumber(v, 2);
  const header =
    current === 'anchura'
      ? `h = \\frac{\\max x - \\min x}{k} = \\frac{${f(Math.max(...values))} - ${f(Math.min(...values))}}{${k}} = ${f((Math.max(...values) - Math.min(...values)) / k)}`
      : `c_j = q_{j/${k}},\\quad j = 0, \\dots, ${k}:\\quad ${edges.map(f).join(',\\ ')}`;
  const labels = edges
    .slice(0, -1)
    .map(
      (e, i) =>
        `[${formatNumber(e, 1)}, ${formatNumber(edges[i + 1] ?? e, 1)}${i === k - 1 ? ']' : ')'}`,
    );
  const description =
    `${N} tiempos de entrega discretizados en ${k} intervalos de ${current === 'anchura' ? 'igual anchura' : 'igual frecuencia'}. ` +
    labels.map((l, i) => `${l}: ${finalCounts[i]}`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Valores asignados', value: `${shown} de ${N}` },
        { label: 'Intervalo más poblado', value: String(Math.max(...finalCounts)) },
        { label: 'Intervalo menos poblado', value: String(Math.min(...finalCounts)) },
        {
          label: 'Anchura mínima y máxima',
          value: `${f(Math.min(...edges.slice(1).map((e, i) => e - (edges[i] ?? 0))))} y ${f(Math.max(...edges.slice(1).map((e, i) => e - (edges[i] ?? 0))))}`,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Intervalos y frecuencias',
        columns: ['Intervalo (días)', 'Valores'],
        rows: labels.map((l, i) => [l, finalCounts[i] ?? 0]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.32}
        minHeight={150}
        maxHeight={220}
        margins={{ top: 10, right: 16, bottom: 40, left: 16 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleLinear()
            .domain([Math.min(...values), Math.max(...values)])
            .range([left, left + width]);
          return (
            <g>
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                ticks={8}
                label="Tiempo de entrega (días)"
              />
              <g aria-hidden="true">
                {edges.map((e, i) => (
                  <line
                    key={i}
                    x1={x(e)}
                    x2={x(e)}
                    y1={top}
                    y2={top + height}
                    stroke={DATA_COLORS.highlight}
                    strokeWidth={2}
                  />
                ))}
                {values.slice(0, shown).map((v, i) => (
                  <circle
                    key={i}
                    cx={x(v)}
                    cy={top + 6 + (((i * 7919) % 101) / 101) * (height - 12)}
                    r={3}
                    fill={seriesColor(assigned[i] ?? 0)}
                    fillOpacity={0.8}
                  />
                ))}
              </g>
            </g>
          );
        }}
      </ChartSvg>
      <ChartSvg
        label={`Frecuencia por intervalo. ${description}`}
        aspect={0.3}
        minHeight={160}
        maxHeight={220}
        margins={{ top: 10, right: 16, bottom: 44, left: 44 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const x = scaleBand<number>()
            .domain(counts.map((_, i) => i))
            .range([left, left + width])
            .padding(0.15);
          const y = scaleLinear()
            .domain([0, Math.max(1, ...finalCounts)])
            .nice()
            .range([top + height, top]);
          return (
            <g>
              <Axis scale={y} orientation="left" position={left} gridLength={width} ticks={4} />
              <g aria-hidden="true">
                {counts.map((c, i) => (
                  <g key={i}>
                    <rect
                      x={x(i)}
                      y={y(c)}
                      width={x.bandwidth()}
                      height={top + height - y(c)}
                      fill={seriesColor(i)}
                      fillOpacity={0.8}
                    />
                    <text
                      x={(x(i) ?? 0) + x.bandwidth() / 2}
                      y={top + height + 14}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {labels[i]}
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
