import svgStyles from '../../core/svg/svg.module.css';

/** Minimum horizontal room per tick label, in pixels. */
const TICK_SPACING = 30;

interface OutcomeAxisProps {
  x: (value: number) => number;
  baseline: number;
  integers: readonly number[];
  labels?: readonly string[];
  label: string;
}

/** Integer or categorical horizontal axis centered on each outcome. */
export function OutcomeAxis({ x, baseline, integers, labels, label }: OutcomeAxisProps) {
  const first = integers[0] ?? 0;
  const last = integers[integers.length - 1] ?? 0;
  const left = x(first - 0.5);
  const right = x(last + 0.5);
  const room = labels ? 1 : Math.max(2, Math.floor((right - left) / TICK_SPACING));
  const stride = labels ? 1 : Math.max(1, Math.ceil(integers.length / room));
  const ticks = integers.filter((k) => (k - first) % stride === 0);
  return (
    <g className={svgStyles.axis} aria-hidden="true">
      <line className={svgStyles.domain} x1={left} x2={right} y1={baseline} y2={baseline} />
      {ticks.map((k) => (
        <g key={k} transform={`translate(${x(k)},${baseline})`}>
          <line y2={5} className={svgStyles.tick} />
          <text y={17} textAnchor="middle" className={svgStyles.tickLabel}>
            {labels?.[k] ?? String(k)}
          </text>
        </g>
      ))}
      <text
        x={(left + right) / 2}
        y={baseline + 32}
        textAnchor="middle"
        className={svgStyles.axisLabel}
      >
        {label}
      </text>
    </g>
  );
}
