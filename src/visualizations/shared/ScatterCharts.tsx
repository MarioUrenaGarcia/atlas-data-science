import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { useId, type ReactNode } from 'react';
import { DATA_COLORS } from '../core/colors.ts';
import { Axis } from '../core/svg/Axis.tsx';
import { ChartSvg } from '../core/svg/ChartSvg.tsx';

export interface StackedSeries {
  values: readonly number[];
  color: string;
}

/** Histogram with stacked series sharing the same bins (for observed and imputed values). */
export function StackedHistogram({
  series,
  domain,
  binWidth,
  label,
  axisLabel,
}: {
  series: readonly StackedSeries[];
  domain: [number, number];
  binWidth: number;
  label: string;
  axisLabel: string;
}) {
  const bins = Math.max(1, Math.ceil((domain[1] - domain[0]) / binWidth));
  const counts = series.map((s) => {
    const c = Array.from({ length: bins }, () => 0);
    for (const v of s.values) {
      const b = Math.min(bins - 1, Math.max(0, Math.floor((v - domain[0]) / binWidth)));
      c[b] = (c[b] ?? 0) + 1;
    }
    return c;
  });
  const totals = Array.from({ length: bins }, (_, b) =>
    counts.reduce((acc, c) => acc + (c[b] ?? 0), 0),
  );
  const maxCount = Math.max(1, ...totals);
  return (
    <ChartSvg
      label={label}
      aspect={0.7}
      minHeight={240}
      maxHeight={360}
      margins={{ top: 12, right: 12, bottom: 46, left: 44 }}
    >
      {(box) => {
        const { left, top, width, height } = box.inner;
        const x = scaleLinear()
          .domain(domain)
          .range([left, left + width]);
        const y = scaleLinear()
          .domain([0, maxCount])
          .nice()
          .range([top + height, top]);
        return (
          <g>
            <Axis
              scale={y}
              orientation="left"
              position={left}
              gridLength={width}
              ticks={4}
              label="Frecuencia"
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={top + height}
              ticks={6}
              label={axisLabel}
            />
            <g aria-hidden="true">
              {Array.from({ length: bins }, (_, b) => {
                let base = 0;
                return counts.map((c, s) => {
                  const count = c[b] ?? 0;
                  const y0 = y(base);
                  base += count;
                  const y1 = y(base);
                  return count > 0 ? (
                    <rect
                      key={`${b}-${s}`}
                      x={x(domain[0] + b * binWidth) + 0.5}
                      y={y1}
                      width={Math.max(0, x(domain[0] + binWidth) - x(domain[0]) - 1)}
                      height={y0 - y1}
                      fill={series[s]?.color ?? DATA_COLORS.primary}
                      fillOpacity={0.8}
                    />
                  ) : null;
                });
              })}
            </g>
          </g>
        );
      }}
    </ChartSvg>
  );
}

export interface ScatterScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Scatter frame with axes; children draw the marks. */
export function ScatterFrame({
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  label,
  children,
}: {
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  label: string;
  children: (s: ScatterScales) => ReactNode;
}) {
  const clipId = useId().replace(/:/g, '');
  return (
    <ChartSvg
      label={label}
      aspect={0.7}
      minHeight={240}
      maxHeight={380}
      margins={{ top: 12, right: 12, bottom: 46, left: 52 }}
    >
      {(box) => {
        const { left, top, width, height } = box.inner;
        const x = scaleLinear()
          .domain(xDomain)
          .range([left, left + width]);
        const y = scaleLinear()
          .domain(yDomain)
          .range([top + height, top]);
        return (
          <g>
            <Axis
              scale={y}
              orientation="left"
              position={left}
              gridLength={width}
              ticks={5}
              label={yLabel}
            />
            <Axis scale={x} orientation="bottom" position={top + height} ticks={6} label={xLabel} />
            <defs>
              <clipPath id={`${clipId}-plot`}>
                <rect x={left} y={top} width={width} height={height} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId}-plot)`}>
              {children({ x, y, left, right: left + width, top, bottom: top + height })}
            </g>
          </g>
        );
      }}
    </ChartSvg>
  );
}
