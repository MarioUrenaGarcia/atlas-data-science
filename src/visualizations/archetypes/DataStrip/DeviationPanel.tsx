import { scaleLinear } from 'd3-scale';
import { formatNumber } from '../../../lib/format/number.ts';
import { spreadMeasure, type SpreadMeasure } from '../../../lib/stats/dispersion.ts';
import { quantile } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { spreadCenter } from './spreadFormulas.ts';
import styles from './DataStrip.module.css';

const ROW_HEIGHT = 26;
/** Taller rows leave room for the squares; their sides are scaled so every square fits its row. */
const SQUARE_ROW_HEIGHT = 58;
const SQUARE_MARGIN = 8;
const DOT_RADIUS = 7;
const TOP = 26;
const BOTTOM = 52;
const SQUARE_OPACITY = 0.18;
const BAND_OPACITY = 0.12;

interface DeviationPanelProps {
  values: readonly number[];
  measure: SpreadMeasure;
  revealed: number;
  squares: boolean;
  band: boolean;
  domain: [number, number];
  variable: string;
  unit: string;
  decimals: number;
  labels?: readonly string[];
  label: string;
  onMove: (index: number, value: number) => void;
}

/**
 * One row per observation with its deviation from the center drawn as a
 * segment, and optionally as a square whose area is the squared deviation.
 */
export function DeviationPanel(props: DeviationPanelProps) {
  const { values, measure, revealed, squares, band, domain, variable, unit, decimals, labels } =
    props;
  const n = values.length;
  const center = spreadCenter(measure, values);
  const done = revealed >= n;
  const s = spreadMeasure('desviacion', values);
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  const step = 10 ** -decimals;
  const rowHeight = squares ? SQUARE_ROW_HEIGHT : ROW_HEIGHT;
  const height = TOP + n * rowHeight + BOTTOM;
  const maxDeviation = Math.max(1e-9, ...values.map((value) => Math.abs(value - center)));
  return (
    <ChartSvg
      label={props.label}
      interactive
      aspect={height / 640}
      minHeight={height}
      maxHeight={height}
      margins={{ top: TOP, right: 24, bottom: BOTTOM, left: labels ? 84 : 24 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain(domain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const rowY = (i: number) => box.inner.top + (i + 0.5) * rowHeight;
        const unitPx = Math.abs(x(domain[0] + 1) - x(domain[0]));
        const squareScale = Math.min(unitPx, (rowHeight - SQUARE_MARGIN) / maxDeviation);
        const axisY = box.inner.top + n * rowHeight + 6;
        return (
          <g>
            {done && band && measure !== 'riq' && (
              <rect
                x={x(center - s)}
                y={box.inner.top - 8}
                width={Math.max(0, x(center + s) - x(center - s))}
                height={axisY - box.inner.top + 8}
                fill={DATA_COLORS.primary}
                fillOpacity={BAND_OPACITY}
                aria-hidden="true"
              />
            )}
            {done && measure === 'riq' && (
              <g aria-hidden="true">
                <rect
                  x={x(q1)}
                  y={box.inner.top - 8}
                  width={Math.max(0, x(q3) - x(q1))}
                  height={axisY - box.inner.top + 8}
                  fill={DATA_COLORS.highlight}
                  fillOpacity={BAND_OPACITY * 2}
                />
                <text
                  x={x(q1)}
                  y={box.inner.top - 12}
                  textAnchor="middle"
                  className={styles.pointLabel}
                >
                  Q1
                </text>
                <text
                  x={x(q3)}
                  y={box.inner.top - 12}
                  textAnchor="middle"
                  className={styles.pointLabel}
                >
                  Q3
                </text>
              </g>
            )}
            {measure !== 'rango' && measure !== 'riq' && (
              <g aria-hidden="true">
                <line
                  x1={x(center)}
                  x2={x(center)}
                  y1={box.inner.top - 8}
                  y2={axisY}
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                />
                <text
                  x={x(center)}
                  y={box.inner.top - 12}
                  textAnchor="middle"
                  className={styles.markerLabel}
                  fill={DATA_COLORS.text}
                >
                  {measure === 'mad' ? 'mediana' : 'media'} {formatNumber(center, decimals + 1)}
                </text>
              </g>
            )}
            {values.map((value, i) => {
              if (i >= revealed || measure === 'rango' || measure === 'riq') return null;
              const deviation = value - center;
              const y = rowY(i);
              const side = Math.abs(deviation) * squareScale;
              const color = deviation >= 0 ? DATA_COLORS.positive : DATA_COLORS.negative;
              return (
                <g key={`d${i}`} aria-hidden="true">
                  {squares && (
                    <rect
                      x={deviation >= 0 ? x(center) : x(center) - side}
                      y={y - side / 2}
                      width={side}
                      height={side}
                      fill={color}
                      fillOpacity={SQUARE_OPACITY}
                      stroke={color}
                      strokeOpacity={0.5}
                    />
                  )}
                  <line x1={x(center)} x2={x(value)} y1={y} y2={y} stroke={color} strokeWidth={3} />
                </g>
              );
            })}
            {done && measure === 'rango' && (
              <g aria-hidden="true">
                <line
                  x1={x(Math.min(...values))}
                  x2={x(Math.max(...values))}
                  y1={axisY - 12}
                  y2={axisY - 12}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={3}
                />
                <text
                  x={(x(Math.min(...values)) + x(Math.max(...values))) / 2}
                  y={axisY - 18}
                  textAnchor="middle"
                  className={styles.markerLabel}
                  fill={DATA_COLORS.highlight}
                >
                  {`rango ${formatNumber(Math.max(...values) - Math.min(...values), decimals)}`}
                </text>
              </g>
            )}
            {values.map((value, i) => (
              <g key={i}>
                {labels && (
                  <text
                    x={box.inner.left - 8}
                    y={rowY(i)}
                    dy="0.32em"
                    textAnchor="end"
                    className={styles.pointLabel}
                  >
                    {labels[i]}
                  </text>
                )}
                <DraggablePoint
                  x={x(value)}
                  y={rowY(i)}
                  radius={DOT_RADIUS}
                  color={DATA_COLORS.text}
                  axis="x"
                  label={`Observación ${labels?.[i] ?? i + 1}`}
                  valueText={`${formatNumber(value, decimals)}${unit ? ` ${unit}` : ''}`}
                  step={Math.max(2, Math.abs(x(domain[0] + step) - x(domain[0])))}
                  onDrag={(px) => {
                    const raw = Math.min(domain[1], Math.max(domain[0], x.invert(px)));
                    props.onMove(i, Number((Math.round(raw / step) * step).toFixed(decimals)));
                  }}
                />
              </g>
            ))}
            <Axis
              scale={x}
              orientation="bottom"
              position={axisY}
              ticks={8}
              label={`${variable}${unit ? ` (${unit})` : ''}`}
            />
          </g>
        );
      }}
    </ChartSvg>
  );
}
