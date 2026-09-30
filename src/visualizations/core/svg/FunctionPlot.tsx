import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { useId, type ReactNode } from 'react';
import { Axis } from './Axis.tsx';
import type { ChartBox } from './chartBox.ts';
import { autoYDomain, curveSegments, type PlotCurve } from './plotDomain.ts';
import { ChartSvg } from './ChartSvg.tsx';

const SAMPLES = 400;

export interface PlotScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  box: ChartBox;
}

interface FunctionPlotProps {
  xDomain: [number, number];
  yDomain?: [number, number];
  curves: readonly PlotCurve[];
  label: string;
  interactive?: boolean;
  aspect?: number;
  minHeight?: number;
  maxHeight?: number;
  xLabel?: string;
  /** Drawn under the curves, for shaded areas. */
  background?: (scales: PlotScales) => ReactNode;
  /** Drawn over the curves, for points, tangents and handles. */
  children?: (scales: PlotScales) => ReactNode;
}

/**
 * Graph of one or more real functions on shared axes. Curves are sampled into
 * segments that break at poles and jumps, and everything is clipped to the
 * plotting area so tangents and areas never spill outside.
 */
export function FunctionPlot({
  xDomain,
  yDomain,
  curves,
  label,
  interactive = false,
  aspect = 0.6,
  minHeight = 240,
  maxHeight = 420,
  xLabel = 'x',
  background,
  children,
}: FunctionPlotProps) {
  const clipId = `plot-clip-${useId().replace(/:/g, '')}`;
  const [y0, y1] = yDomain ?? autoYDomain(curves, xDomain);
  const span = y1 - y0 || 1;
  return (
    <ChartSvg
      label={label}
      interactive={interactive}
      aspect={aspect}
      minHeight={minHeight}
      maxHeight={maxHeight}
      margins={{ left: 46, bottom: 36 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain(xDomain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([y0, y1])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const scales = { x, y, box };
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={7}
              label={xLabel}
            />
            <clipPath id={clipId}>
              <rect
                x={box.inner.left}
                y={box.inner.top}
                width={box.inner.width}
                height={box.inner.height}
              />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
              {y0 < 0 && y1 > 0 && (
                <line
                  aria-hidden="true"
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(0)}
                  y2={y(0)}
                  stroke="var(--data-axis)"
                  strokeWidth={1.2}
                />
              )}
              {xDomain[0] < 0 && xDomain[1] > 0 && (
                <line
                  aria-hidden="true"
                  x1={x(0)}
                  x2={x(0)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke="var(--data-axis)"
                  strokeWidth={1.2}
                />
              )}
              {background?.(scales)}
              <g aria-hidden="true">
                {curves.flatMap((curve, index) =>
                  curveSegments(curve, xDomain, SAMPLES, span).map((segment, part) => (
                    <polyline
                      key={`${index}-${part}`}
                      points={segment
                        .map((p) => `${x(p.x)},${y(Math.max(y0 - span, Math.min(y1 + span, p.y)))}`)
                        .join(' ')}
                      fill="none"
                      stroke={curve.color}
                      strokeWidth={curve.width ?? 2.5}
                      strokeDasharray={curve.dashed ? '7 5' : undefined}
                      strokeLinejoin="round"
                    />
                  )),
                )}
              </g>
              {children?.(scales)}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
