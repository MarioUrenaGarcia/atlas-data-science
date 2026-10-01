import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { boxplotStats } from '../../../lib/stats/dispersion.ts';
import { sorted } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';

const STAGES = 7;
const STAGES_PER_SECOND = 0.6;
const BOX_HEIGHT = 46;
const DOT_RADIUS = 6;
const STACK_GAP = 2;
const DOMAIN_PADDING = 0.08;

const STAGE_TEXT = [
  'Datos ordenados de menor a mayor',
  'La mediana divide los datos en dos mitades',
  'Los cuartiles dividen cada mitad otra vez',
  'La caja va de Q1 a Q3: contiene el 50 % central',
  'Las vallas se colocan a k RIQ de la caja',
  'Los bigotes llegan al dato más extremo dentro de las vallas',
  'Los datos fuera de las vallas se marcan como atípicos',
];

interface BoxViewProps {
  title: string;
  data: readonly number[];
  k: number;
  variable: string;
  unit: string;
  decimals: number;
  domain?: [number, number];
  /** Stage where the animation stops; 6 builds the whole diagram. */
  until: number;
}

/** Tukey's box plot built step by step from the sorted data. */
export function BoxView(props: BoxViewProps) {
  const { title, data, variable, unit, decimals } = props;
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'k',
      label: 'Distancia de las vallas en RIQ',
      symbol: 'k',
      min: 0.5,
      max: 3,
      step: 0.5,
      default: props.k,
      digits: 1,
    },
  ];
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const reducedMotion = useReducedMotion();
  const last = Math.min(STAGES - 1, props.until);
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState(`${data.join(',')}|${run}`, () => ({
    values: [...data],
    stage: reducedMotion ? last : 0,
  }));
  const playback = usePlayback({
    step: () => update((previous) => ({ ...previous, stage: Math.min(last, previous.stage + 1) })),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: state.stage >= last,
  });
  const values = state.values;
  const stats = boxplotStats(values, k);
  const stage = state.stage;
  const f = (value: number) => formatNumber(value, decimals + 2);
  const x = sorted(values);
  const headers = [
    `x_{(1)}, \\dots, x_{(${x.length})} = ${x
      .slice(0, 6)
      .map((v) => formatNumber(v, decimals))
      .join(',\\ ')}${x.length > 6 ? ',\\ \\dots' : ''}`,
    `\\tilde{x} = Q_2 = ${f(stats.median)}`,
    `Q_1 = ${f(stats.q1)},\\quad Q_3 = ${f(stats.q3)}`,
    `\\mathrm{RIQ} = Q_3 - Q_1 = ${f(stats.q3)} - ${f(stats.q1)} = ${f(stats.iqr)}`,
    `Q_1 - ${formatNumber(k, 1)}\\,\\mathrm{RIQ} = ${f(stats.lowerFence)},\\quad Q_3 + ${formatNumber(k, 1)}\\,\\mathrm{RIQ} = ${f(stats.upperFence)}`,
    `\\text{bigotes: } ${f(stats.lowerWhisker)} \\text{ y } ${f(stats.upperWhisker)}`,
    stats.outliers.length > 0
      ? `\\text{atípicos: } ${sorted(stats.outliers)
          .map((v) => formatNumber(v, decimals))
          .join(',\\ ')}`
      : `\\text{ningún dato queda fuera de las vallas}`,
  ];
  const lo = props.domain?.[0] ?? Math.min(...data, ...values);
  const hi = props.domain?.[1] ?? Math.max(...data, ...values);
  const pad = props.domain ? 0 : (hi - lo) * DOMAIN_PADDING || 1;
  const domain: [number, number] = [lo - pad, hi + pad];
  const step = 10 ** -decimals;
  const unitText = unit ? ` ${unit}` : '';
  const description =
    `${values.length} datos de ${variable}. Mínimo ${f(stats.min)}, Q1 ${f(stats.q1)}, mediana ${f(stats.median)}, Q3 ${f(stats.q3)}, máximo ${f(stats.max)}. ` +
    `Vallas en ${f(stats.lowerFence)} y ${f(stats.upperFence)}; ${stats.outliers.length} atípicos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Mínimo', value: `${f(stats.min)}${unitText}` },
        {
          label: 'Primer cuartil Q1',
          value: `${f(stats.q1)}${unitText}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Mediana', value: `${f(stats.median)}${unitText}`, color: DATA_COLORS.highlight },
        {
          label: 'Tercer cuartil Q3',
          value: `${f(stats.q3)}${unitText}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Máximo', value: `${f(stats.max)}${unitText}` },
        { label: 'Rango intercuartílico', value: `${f(stats.iqr)}${unitText}` },
        { label: 'Atípicos', value: String(stats.outliers.length), color: DATA_COLORS.negative },
      ]}
      legend={[
        { label: 'Caja de Q1 a Q3', color: DATA_COLORS.primary },
        { label: 'Mediana', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Vallas', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'Atípico', color: DATA_COLORS.negative, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: `Datos de ${variable}`,
        columns: ['Posición', variable],
        rows: x.map((value, i) => [String(i + 1), formatNumber(value, decimals)]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={headers[stage] ?? ''} />
      </p>
      <p className={styles.caption}>{STAGE_TEXT[stage]}</p>
      <ChartSvg
        label={description}
        interactive
        aspect={0.38}
        minHeight={240}
        maxHeight={320}
        margins={{ top: 24, right: 24, bottom: 48, left: 24 }}
      >
        {(box) => {
          const sx = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const boxY = box.inner.top + 20;
          const axisY = box.inner.top + box.inner.height;
          const mid = boxY + BOX_HEIGHT / 2;
          const stacks = new Map<string, number>();
          const outlier = (value: number) =>
            stage >= 6 && (value < stats.lowerFence || value > stats.upperFence);
          return (
            <g>
              {stage >= 3 && (
                <rect
                  x={sx(stats.q1)}
                  y={boxY}
                  width={Math.max(1, sx(stats.q3) - sx(stats.q1))}
                  height={BOX_HEIGHT}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.2}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                />
              )}
              {stage >= 2 &&
                [stats.q1, stats.q3].map((q, i) => (
                  <g key={i} aria-hidden="true">
                    <line
                      x1={sx(q)}
                      x2={sx(q)}
                      y1={boxY - 10}
                      y2={axisY}
                      stroke={DATA_COLORS.primary}
                      strokeWidth={2}
                      strokeDasharray={stage >= 3 ? undefined : '4 3'}
                    />
                    <text
                      x={sx(q)}
                      y={boxY - 12}
                      textAnchor="middle"
                      className={styles.markerLabel}
                      fill={DATA_COLORS.primary}
                    >
                      {i === 0 ? 'Q1' : 'Q3'}
                    </text>
                  </g>
                ))}
              {stage >= 1 && (
                <g aria-hidden="true">
                  <line
                    x1={sx(stats.median)}
                    x2={sx(stats.median)}
                    y1={boxY - 10}
                    y2={stage >= 3 ? boxY + BOX_HEIGHT : axisY}
                    stroke={DATA_COLORS.highlight}
                    strokeWidth={3}
                  />
                  <text
                    x={sx(stats.median)}
                    y={boxY - 12}
                    textAnchor="middle"
                    className={styles.markerLabel}
                    fill={DATA_COLORS.highlight}
                  >
                    {stage >= 2 ? '' : 'mediana'}
                  </text>
                </g>
              )}
              {stage >= 4 &&
                [stats.lowerFence, stats.upperFence].map((fence, i) => (
                  <line
                    key={i}
                    x1={sx(fence)}
                    x2={sx(fence)}
                    y1={boxY - 6}
                    y2={boxY + BOX_HEIGHT + 6}
                    stroke={DATA_COLORS.muted}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    aria-hidden="true"
                  />
                ))}
              {stage >= 5 && (
                <g aria-hidden="true">
                  <line
                    x1={sx(stats.lowerWhisker)}
                    x2={sx(stats.q1)}
                    y1={mid}
                    y2={mid}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2}
                  />
                  <line
                    x1={sx(stats.q3)}
                    x2={sx(stats.upperWhisker)}
                    y1={mid}
                    y2={mid}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2}
                  />
                  {[stats.lowerWhisker, stats.upperWhisker].map((w, i) => (
                    <line
                      key={i}
                      x1={sx(w)}
                      x2={sx(w)}
                      y1={mid - 10}
                      y2={mid + 10}
                      stroke={DATA_COLORS.text}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              )}
              <Axis
                scale={sx}
                orientation="bottom"
                position={axisY}
                ticks={8}
                label={`${variable}${unit ? ` (${unit})` : ''}`}
              />
              {values.map((value, i) => {
                const key = value.toFixed(decimals);
                const level = stacks.get(key) ?? 0;
                stacks.set(key, level + 1);
                return (
                  <DraggablePoint
                    key={i}
                    x={sx(value)}
                    y={axisY - DOT_RADIUS - 4 - level * (2 * DOT_RADIUS + STACK_GAP)}
                    radius={DOT_RADIUS}
                    color={outlier(value) ? DATA_COLORS.negative : DATA_COLORS.text}
                    axis="x"
                    label={`Dato ${i + 1}`}
                    valueText={`${formatNumber(value, decimals)}${unitText}`}
                    step={Math.max(2, Math.abs(sx(domain[0] + step) - sx(domain[0])))}
                    onDrag={(px) => {
                      const raw = Math.min(domain[1], Math.max(domain[0], sx.invert(px)));
                      const snapped = Number((Math.round(raw / step) * step).toFixed(decimals));
                      playback.pause();
                      update((previous) => ({
                        ...previous,
                        values: previous.values.map((v, j) => (j === i ? snapped : v)),
                      }));
                    }}
                  />
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
