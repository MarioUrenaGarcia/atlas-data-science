import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

const BINS = 12;
const BAND_SHARE = 0.16;
const BAND_MAX = 56;
const POINT_RADIUS = 2.2;

export interface ScatterScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface PairScatterProps {
  points: readonly (readonly [number, number])[];
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  label: string;
  color?: (index: number) => string;
  /** Histograms of each coordinate along the top and right edges. */
  showMarginals?: boolean;
  underlay?: (scales: ScatterScales) => ReactNode;
  overlay?: (scales: ScatterScales) => ReactNode;
  maxHeight?: number;
}

function histogram(values: readonly number[], [lo, hi]: [number, number]): number[] {
  const counts = Array<number>(BINS).fill(0);
  for (const value of values) {
    const k = Math.floor(((value - lo) / (hi - lo)) * BINS);
    if (k >= 0 && k < BINS) counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

/**
 * Scatter plot of simulated pairs on a square drawing area, with optional
 * histograms of each coordinate on the edges so the marginal distributions
 * can be read next to the joint behavior.
 */
export function PairScatter({
  points,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  label,
  color = () => DATA_COLORS.primary,
  showMarginals = true,
  underlay,
  overlay,
  maxHeight = 400,
}: PairScatterProps) {
  const hx = histogram(
    points.map(([x]) => x),
    xDomain,
  );
  const hy = histogram(
    points.map(([, y]) => y),
    yDomain,
  );
  const maxCount = Math.max(1, ...hx, ...hy);
  return (
    <ChartSvg label={label} aspect={1} minHeight={260} maxHeight={maxHeight}>
      {(box) => {
        const band = showMarginals ? Math.min(BAND_MAX, box.inner.height * BAND_SHARE) : 0;
        const side = Math.min(box.inner.width - band, box.inner.height - band);
        const left = box.inner.left;
        const right = left + side;
        const top = box.inner.top + band;
        const bottom = top + side;
        const x = scaleLinear().domain(xDomain).range([left, right]);
        const y = scaleLinear().domain(yDomain).range([bottom, top]);
        const scales: ScatterScales = { x, y, left, right, top, bottom };
        const binW = side / BINS;
        return (
          <>
            {underlay?.(scales)}
            <Axis
              scale={y}
              orientation="left"
              position={left}
              gridLength={side}
              ticks={5}
              label={yLabel}
            />
            <Axis scale={x} orientation="bottom" position={bottom} ticks={5} label={xLabel} />
            <g aria-hidden="true">
              {points.map(([px, py], k) =>
                // Points beyond the window (far tails of the marginals) are not drawn.
                px < xDomain[0] || px > xDomain[1] || py < yDomain[0] || py > yDomain[1] ? null : (
                  <circle
                    key={k}
                    cx={x(px)}
                    cy={y(py)}
                    r={POINT_RADIUS}
                    fill={color(k)}
                    fillOpacity={0.5}
                  />
                ),
              )}
              {showMarginals &&
                hx.map((count, k) => {
                  const h = ((band - 6) * count) / maxCount;
                  return (
                    <rect
                      key={`hx${k}`}
                      x={left + k * binW + 1}
                      y={top - 4 - h}
                      width={binW - 2}
                      height={h}
                      fill={DATA_COLORS.primary}
                      fillOpacity={0.6}
                    />
                  );
                })}
              {showMarginals &&
                hy.map((count, k) => {
                  const w = ((band - 6) * count) / maxCount;
                  return (
                    <rect
                      key={`hy${k}`}
                      x={right + 4}
                      y={bottom - (k + 1) * binW + 1}
                      width={w}
                      height={binW - 2}
                      fill={DATA_COLORS.secondary}
                      fillOpacity={0.6}
                    />
                  );
                })}
            </g>
            {overlay?.(scales)}
          </>
        );
      }}
    </ChartSvg>
  );
}
