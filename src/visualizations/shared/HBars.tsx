import { scaleBand, scaleLinear } from 'd3-scale';
import { formatNumber } from '../../lib/format/number.ts';
import { DATA_COLORS } from '../core/colors.ts';
import { Axis } from '../core/svg/Axis.tsx';
import { ChartSvg } from '../core/svg/ChartSvg.tsx';
import styles from '../core/svg/svg.module.css';

interface HBarsProps {
  labels: readonly string[];
  values: readonly number[];
  highlight: number;
  axisLabel: string;
  decimals: number;
  label: string;
  /** Fraction of each bar drawn, for grow-in animations. */
  progress?: number;
  /** Fixed value domain, for bars that should keep their scale while they change. */
  domain?: [number, number];
  /** Color of each bar; the highlighted bar keeps the highlight color. */
  colors?: readonly string[];
  /** Space reserved for the labels on the left, in pixels. */
  labelWidth?: number;
}

/** Horizontal bars with the value printed at the end of each bar. */
export function HBars({
  labels,
  values,
  highlight,
  axisLabel,
  decimals,
  label,
  progress = 1,
  domain,
  colors,
  labelWidth = 84,
}: HBarsProps) {
  const low = domain?.[0] ?? Math.min(0, ...values);
  const high = domain?.[1] ?? Math.max(0, ...values);
  return (
    <ChartSvg
      label={label}
      aspect={0.5}
      minHeight={180}
      maxHeight={300}
      margins={{ top: 8, right: 56, bottom: 42, left: labelWidth }}
    >
      {(box) => {
        const base = scaleLinear().domain([low, high === low ? low + 1 : high]);
        const x = (domain ? base : base.nice()).range([
          box.inner.left,
          box.inner.left + box.inner.width,
        ]);
        const y = scaleBand<number>()
          .domain(labels.map((_, i) => i))
          .range([box.inner.top, box.inner.top + box.inner.height])
          .padding(0.25);
        const bottom = box.inner.top + box.inner.height;
        return (
          <g>
            <Axis
              scale={x}
              orientation="bottom"
              position={bottom}
              gridLength={box.inner.height}
              ticks={5}
              label={axisLabel}
            />
            <g aria-hidden="true">
              {values.map((v, i) => {
                const shown = v * progress;
                const x0 = x(Math.min(0, shown));
                const x1 = x(Math.max(0, shown));
                const yy = y(i) ?? 0;
                return (
                  <g key={i}>
                    <text
                      x={box.inner.left - 6}
                      y={yy + y.bandwidth() / 2}
                      dy="0.35em"
                      textAnchor="end"
                      className={styles.label}
                    >
                      {labels[i]}
                    </text>
                    <rect
                      x={x0}
                      y={yy}
                      width={Math.max(0, x1 - x0)}
                      height={y.bandwidth()}
                      rx={3}
                      fill={
                        i === highlight
                          ? DATA_COLORS.highlight
                          : (colors?.[i] ?? DATA_COLORS.primary)
                      }
                      fillOpacity={i === highlight ? 0.95 : 0.55}
                    />
                    <text
                      x={x1 + 4}
                      y={yy + y.bandwidth() / 2}
                      dy="0.35em"
                      className={styles.labelMuted}
                    >
                      {formatNumber(shown, decimals)}
                    </text>
                  </g>
                );
              })}
              <line x1={x(0)} x2={x(0)} y1={box.inner.top} y2={bottom} stroke={DATA_COLORS.muted} />
            </g>
          </g>
        );
      }}
    </ChartSvg>
  );
}
