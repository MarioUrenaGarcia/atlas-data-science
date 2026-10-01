import { scaleLinear, scaleLog } from 'd3-scale';
import type { ReactNode } from 'react';
import { Axis } from '../core/svg/Axis.tsx';
import type { ChartBox } from '../core/svg/chartBox.ts';
import { ChartSvg } from '../core/svg/ChartSvg.tsx';
import { CurvePath, type XY } from '../core/svg/CurvePath.tsx';

export interface Series {
  points: readonly XY[];
  color: string;
  width?: number;
  dashed?: boolean;
  step?: boolean;
  /** Draws the points as dots instead of a line. */
  dots?: boolean;
}

export interface SeriesScales {
  x: (value: number) => number;
  y: (value: number) => number;
  box: ChartBox;
}

interface SeriesChartProps {
  series: readonly Series[];
  xDomain: [number, number];
  yDomain: [number, number];
  label: string;
  xLabel?: string;
  yLabel?: string;
  logX?: boolean;
  logY?: boolean;
  aspect?: number;
  minHeight?: number;
  maxHeight?: number;
  yTickFormat?: (value: number) => string;
  /** Drawn over the series, for markers and reference lines. */
  children?: (scales: SeriesScales) => ReactNode;
}

const LOG_TICKS_Y = 5;

const MAX_POWER_TICKS = 7;

/** Powers of ten inside [lo, hi], thinned so that at most MAX_POWER_TICKS remain. */
function powerTicks(lo: number, hi: number): number[] {
  const first = Math.ceil(Math.log10(lo));
  const last = Math.floor(Math.log10(hi));
  const stride = Math.max(1, Math.ceil((last - first + 1) / MAX_POWER_TICKS));
  const ticks: number[] = [];
  for (let e = last; e >= first; e -= stride) ticks.push(10 ** e);
  return ticks.reverse();
}

function formatPower(value: number): string {
  const exponent = Math.round(Math.log10(value));
  if (exponent >= 0 && exponent <= 4) return String(10 ** exponent);
  return `1e${exponent}`;
}

/**
 * Lines or dots indexed by a numeric x, with optional logarithmic axes. Used
 * for summaries that evolve with n, such as probabilities or distances.
 */
export function SeriesChart({
  series,
  xDomain,
  yDomain,
  label,
  xLabel = 'n',
  yLabel,
  logX = false,
  logY = false,
  aspect = 0.42,
  minHeight = 200,
  maxHeight = 340,
  yTickFormat,
  children,
}: SeriesChartProps) {
  return (
    <ChartSvg
      label={label}
      aspect={aspect}
      minHeight={minHeight}
      maxHeight={maxHeight}
      margins={{ left: yLabel ? 62 : 52 }}
    >
      {(box) => {
        const range: [number, number] = [box.inner.left, box.inner.left + box.inner.width];
        const yRange: [number, number] = [box.inner.top + box.inner.height, box.inner.top];
        const x = logX
          ? scaleLog().domain(xDomain).range(range)
          : scaleLinear().domain(xDomain).range(range);
        const y = logY
          ? scaleLog().domain(yDomain).range(yRange)
          : scaleLinear().domain(yDomain).range(yRange);
        const clampY = (value: number) => {
          if (!Number.isFinite(value)) return Number.NaN;
          if (logY && value <= 0) return yDomain[0];
          return Math.min(yDomain[1], Math.max(yDomain[0], value));
        };
        const yTicks = logY ? powerTicks(yDomain[0], yDomain[1]) : undefined;
        const xTicks = logX ? powerTicks(xDomain[0], xDomain[1]) : undefined;
        const clip = `series-clip-${Math.round(box.inner.left)}-${Math.round(box.inner.width)}`;
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={LOG_TICKS_Y}
              tickValues={yTicks}
              format={yTickFormat ?? (logY ? formatPower : undefined)}
              label={yLabel}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={6}
              tickValues={xTicks}
              format={logX ? formatPower : undefined}
              label={xLabel}
            />
            <defs>
              <clipPath id={clip}>
                <rect
                  x={box.inner.left}
                  y={box.inner.top - 4}
                  width={box.inner.width}
                  height={box.inner.height + 8}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clip})`}>
              {series.map((s, index) =>
                s.dots ? (
                  <g key={index} aria-hidden="true">
                    {s.points.map((point) =>
                      Number.isFinite(point.y) ? (
                        <circle
                          key={point.x}
                          cx={x(point.x)}
                          cy={y(clampY(point.y))}
                          r={2.5}
                          fill={s.color}
                        />
                      ) : null,
                    )}
                  </g>
                ) : (
                  <CurvePath
                    key={index}
                    points={s.points.map((point) => ({ x: point.x, y: clampY(point.y) }))}
                    xScale={x}
                    yScale={y}
                    color={s.color}
                    width={s.width ?? 2}
                    dashed={s.dashed}
                    step={s.step}
                    animate={false}
                  />
                ),
              )}
              {children?.({ x, y, box })}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
