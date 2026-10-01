import { scaleLinear } from 'd3-scale';
import { line, curveStepAfter } from 'd3-shape';
import { useMemo, type ReactNode } from 'react';
import { DATA_COLORS } from '../core/colors.ts';
import { Axis } from '../core/svg/Axis.tsx';
import { Bars, type Bar } from '../core/svg/Bars.tsx';
import type { ChartBox } from '../core/svg/chartBox.ts';
import { ChartSvg } from '../core/svg/ChartSvg.tsx';
import { CurvePath } from '../core/svg/CurvePath.tsx';

export interface HistogramCurve {
  f: (x: number) => number;
  color: string;
  dashed?: boolean;
}

interface DensityHistogramProps {
  /** Left edge, width and densities of the histogram bins. */
  start: number;
  width: number;
  densities: readonly number[];
  /** Exact densities on the same bins, drawn as a step outline. */
  outline?: readonly number[] | null;
  curves?: readonly HistogramCurve[];
  domain: [number, number];
  label: string;
  axisLabel: string;
  aspect?: number;
  /** Smallest vertical range, so an empty histogram still has a sensible axis. */
  minTop?: number;
  children?: (scales: {
    x: (v: number) => number;
    y: (v: number) => number;
    box: ChartBox;
  }) => ReactNode;
}

const CURVE_POINTS = 240;

/**
 * Histogram scaled as a density, with an optional exact distribution drawn
 * as a step outline on the same bins and smooth reference densities.
 */
export function DensityHistogram({
  start,
  width,
  densities,
  outline = null,
  curves = [],
  domain,
  label,
  axisLabel,
  aspect = 0.45,
  minTop = 0.45,
  children,
}: DensityHistogramProps) {
  const [lo, hi] = domain;
  const bars = useMemo<Bar[]>(
    () =>
      densities.map((value, i) => ({ x0: start + i * width, x1: start + (i + 1) * width, value })),
    [densities, start, width],
  );
  const curvePoints = useMemo(
    () =>
      curves.map((curve) =>
        Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
          const x = lo + ((hi - lo) * i) / CURVE_POINTS;
          return { x, y: curve.f(x) };
        }),
      ),
    [curves, lo, hi],
  );
  const top =
    Math.max(
      minTop,
      ...densities,
      ...(outline ?? []),
      ...curvePoints.flatMap((points) => points.map((p) => (Number.isFinite(p.y) ? p.y : 0))),
    ) * 1.08;

  return (
    <ChartSvg label={label} aspect={aspect} minHeight={220} maxHeight={400}>
      {(box) => {
        const x = scaleLinear()
          .domain(domain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, top])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const clip = `hist-clip-${Math.round(box.inner.width)}`;
        const outlinePath = outline
          ? line<number>()
              .x((_, i) => x(start + i * width))
              .y((value) => y(value))
              .curve(curveStepAfter)([...outline, outline[outline.length - 1] ?? 0])
          : null;
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={4}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={Math.max(3, Math.min(8, Math.round(box.inner.width / 70)))}
              label={axisLabel}
            />
            <defs>
              <clipPath id={clip}>
                <rect
                  x={box.inner.left}
                  y={box.inner.top}
                  width={box.inner.width}
                  height={box.inner.height}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clip})`}>
              <Bars
                bars={bars}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                opacity={0.6}
                animate={false}
              />
              {outlinePath && (
                <path
                  aria-hidden="true"
                  d={outlinePath}
                  fill="none"
                  stroke={DATA_COLORS.tertiary}
                  strokeWidth={2}
                />
              )}
              {curves.map((curve, index) => (
                <CurvePath
                  key={index}
                  points={curvePoints[index] ?? []}
                  xScale={x}
                  yScale={y}
                  color={curve.color}
                  width={2.5}
                  dashed={curve.dashed}
                  animate={false}
                />
              ))}
              {children?.({ x, y, box })}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
