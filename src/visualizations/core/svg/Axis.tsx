import styles from './svg.module.css';
import { defaultTickFormat } from './tickFormat.ts';

interface Scale {
  (value: number): number;
  ticks?: (count?: number) => number[];
  domain: () => number[];
}

interface AxisProps {
  scale: Scale;
  orientation: 'bottom' | 'left';
  /** Position of the axis line: y for bottom axes, x for left axes. */
  position: number;
  /** Length of the perpendicular grid lines; zero draws no grid. */
  gridLength?: number;
  ticks?: number;
  tickValues?: number[];
  format?: (value: number) => string;
  label?: string;
}

const TICK_SIZE = 5;

export function Axis({
  scale,
  orientation,
  position,
  gridLength = 0,
  ticks = 6,
  tickValues,
  format = defaultTickFormat,
  label,
}: AxisProps) {
  const values = tickValues ?? scale.ticks?.(ticks) ?? scale.domain();
  const [d0 = 0, d1 = 1] = scale.domain();
  const r0 = scale(d0);
  const r1 = scale(d1);
  if (orientation === 'bottom') {
    return (
      <g className={styles.axis} aria-hidden="true">
        {gridLength > 0 &&
          values.map((value) => (
            <line
              key={`g${value}`}
              className={styles.grid}
              x1={scale(value)}
              x2={scale(value)}
              y1={position}
              y2={position - gridLength}
            />
          ))}
        <line className={styles.domain} x1={r0} x2={r1} y1={position} y2={position} />
        {values.map((value) => (
          <g key={value} transform={`translate(${scale(value)},${position})`}>
            <line y2={TICK_SIZE} className={styles.tick} />
            <text y={TICK_SIZE + 12} textAnchor="middle" className={styles.tickLabel}>
              {format(value)}
            </text>
          </g>
        ))}
        {label && (
          <text
            x={(r0 + r1) / 2}
            y={position + 34}
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {label}
          </text>
        )}
      </g>
    );
  }
  return (
    <g className={styles.axis} aria-hidden="true">
      {gridLength > 0 &&
        values.map((value) => (
          <line
            key={`g${value}`}
            className={styles.grid}
            y1={scale(value)}
            y2={scale(value)}
            x1={position}
            x2={position + gridLength}
          />
        ))}
      <line className={styles.domain} y1={r0} y2={r1} x1={position} x2={position} />
      {values.map((value) => (
        <g key={value} transform={`translate(${position},${scale(value)})`}>
          <line x2={-TICK_SIZE} className={styles.tick} />
          <text x={-TICK_SIZE - 4} dy="0.32em" textAnchor="end" className={styles.tickLabel}>
            {format(value)}
          </text>
        </g>
      ))}
      {label && (
        <text
          transform={`translate(${position - 40},${(r0 + r1) / 2}) rotate(-90)`}
          textAnchor="middle"
          className={styles.axisLabel}
        >
          {label}
        </text>
      )}
    </g>
  );
}
