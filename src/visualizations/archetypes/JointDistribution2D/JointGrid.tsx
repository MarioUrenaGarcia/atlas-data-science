import { scaleLinear, type ScaleLinear } from 'd3-scale';
import type { ReactNode } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import type { JointSource } from './source.ts';

/** Share of the plotting area taken by each marginal band. */
const MARGINAL_SHARE = 0.2;
const MARGINAL_MAX = 72;
/** Gap between neighboring cells of a discrete table, as a fraction of the step. */
const CELL_GAP = 0.08;
const MIN_OPACITY = 0.06;
/** Tables with at most this many cells print each probability inside its cell. */
const LABEL_LIMIT = 49;

export interface GridScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  /** Pixel width and height of one cell. */
  cellWidth: number;
  cellHeight: number;
  /** Edges of the main grid in pixels. */
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface CellPaint {
  color: string;
  /** Opacity; by default it grows with the probability of the cell. */
  opacity?: number;
}

interface JointGridProps {
  source: JointSource;
  label: string;
  /** Probabilities to draw instead of the joint table, such as the product of the marginals. */
  probs?: readonly (readonly number[])[];
  paint?: (i: number, j: number, p: number) => CellPaint;
  cellText?: (i: number, j: number, p: number) => string | null;
  showMarginals?: boolean;
  marginalX?: readonly number[];
  marginalY?: readonly number[];
  marginalColorX?: (i: number) => string;
  marginalColorY?: (j: number) => string;
  overlay?: (scales: GridScales) => ReactNode;
  aspect?: number;
  maxHeight?: number;
}

function sum(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/**
 * A joint distribution as a grid of cells shaded by probability, with the
 * marginal distributions of X (above) and Y (right) as bars. Discrete tables
 * draw separated cells and can print their probabilities; discretized
 * densities draw adjacent cells.
 */
export function JointGrid({
  source,
  label,
  probs,
  paint,
  cellText,
  showMarginals = true,
  marginalX,
  marginalY,
  marginalColorX = () => DATA_COLORS.primary,
  marginalColorY = () => DATA_COLORS.secondary,
  overlay,
  aspect = 0.8,
  maxHeight = 460,
}: JointGridProps) {
  const { joint, continuous } = source;
  const table = probs ?? joint.p;
  const pMax = Math.max(1e-12, ...table.flat());
  const px = marginalX ?? joint.xs.map((_, i) => sum(table[i] ?? []));
  const py = marginalY ?? joint.ys.map((_, j) => sum(table.map((row) => row[j] ?? 0)));
  const showLabels = !continuous && joint.xs.length * joint.ys.length <= LABEL_LIMIT;
  const defaultPaint = (_i: number, _j: number, p: number): CellPaint => ({
    color: DATA_COLORS.primary,
    opacity: MIN_OPACITY + (1 - MIN_OPACITY) * (p / pMax),
  });
  const paintCell = paint ?? defaultPaint;
  return (
    <ChartSvg
      label={label}
      aspect={aspect}
      minHeight={260}
      maxHeight={maxHeight}
      margins={{ top: 10, right: 14, bottom: 42, left: 52 }}
    >
      {(box) => {
        const band = showMarginals ? Math.min(MARGINAL_MAX, box.inner.height * MARGINAL_SHARE) : 0;
        const left = box.inner.left;
        const right = box.inner.left + box.inner.width - band;
        const top = box.inner.top + band;
        const bottom = box.inner.top + box.inner.height;
        const x = scaleLinear().domain(source.xDomain).range([left, right]);
        const y = scaleLinear().domain(source.yDomain).range([bottom, top]);
        const stepX = continuous ? source.cellX : stepOf(joint.xs, source.xDomain);
        const stepY = continuous ? source.cellY : stepOf(joint.ys, source.yDomain);
        const gap = continuous ? 0 : CELL_GAP;
        const cellWidth = Math.abs(x(stepX) - x(0)) * (1 - gap);
        const cellHeight = Math.abs(y(0) - y(stepY)) * (1 - gap);
        const scales: GridScales = { x, y, cellWidth, cellHeight, left, right, top, bottom };
        const pxMax = Math.max(1e-12, ...px);
        const pyMax = Math.max(1e-12, ...py);
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={left}
              ticks={5}
              tickValues={continuous || joint.ys.length > 12 ? undefined : joint.ys}
              label={source.symbolY.replace(/[_^{}]/g, '')}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={bottom}
              ticks={6}
              tickValues={continuous || joint.xs.length > 12 ? undefined : joint.xs}
              label={source.symbolX.replace(/[_^{}]/g, '')}
            />
            <g aria-hidden="true">
              {joint.xs.map((xv, i) =>
                joint.ys.map((yv, j) => {
                  const p = table[i]?.[j] ?? 0;
                  if (p <= 0 && continuous) return null;
                  const style = paintCell(i, j, p);
                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={x(xv) - cellWidth / 2}
                      y={y(yv) - cellHeight / 2}
                      width={cellWidth}
                      height={cellHeight}
                      fill={p > 0 ? style.color : 'none'}
                      fillOpacity={style.opacity ?? MIN_OPACITY + (1 - MIN_OPACITY) * (p / pMax)}
                      stroke={continuous ? 'none' : DATA_COLORS.grid}
                    />
                  );
                }),
              )}
              {showLabels &&
                joint.xs.map((xv, i) =>
                  joint.ys.map((yv, j) => {
                    const p = table[i]?.[j] ?? 0;
                    const text = cellText ? cellText(i, j, p) : p > 0 ? formatNumber(p, 3) : null;
                    if (!text || cellWidth < 26) return null;
                    return (
                      <text
                        key={`t${i}-${j}`}
                        x={x(xv)}
                        y={y(yv) + 4}
                        textAnchor="middle"
                        fontSize={cellWidth < 40 ? 9 : 11}
                        fill={DATA_COLORS.text}
                      >
                        {text}
                      </text>
                    );
                  }),
                )}
              {showMarginals && (
                <>
                  {joint.xs.map((xv, i) => {
                    const h = ((band - 6) * (px[i] ?? 0)) / pxMax;
                    return (
                      <rect
                        key={`mx${i}`}
                        x={x(xv) - cellWidth / 2}
                        y={top - 4 - h}
                        width={cellWidth}
                        height={Math.max(0, h)}
                        fill={marginalColorX(i)}
                        fillOpacity={0.75}
                      />
                    );
                  })}
                  {joint.ys.map((yv, j) => {
                    const w = ((band - 6) * (py[j] ?? 0)) / pyMax;
                    return (
                      <rect
                        key={`my${j}`}
                        x={right + 4}
                        y={y(yv) - cellHeight / 2}
                        width={Math.max(0, w)}
                        height={cellHeight}
                        fill={marginalColorY(j)}
                        fillOpacity={0.75}
                      />
                    );
                  })}
                  <line x1={left} x2={right} y1={top - 3} y2={top - 3} stroke={DATA_COLORS.grid} />
                  <line
                    x1={right + 3}
                    x2={right + 3}
                    y1={top}
                    y2={bottom}
                    stroke={DATA_COLORS.grid}
                  />
                </>
              )}
            </g>
            {overlay?.(scales)}
          </>
        );
      }}
    </ChartSvg>
  );
}

/** Smallest gap between consecutive values, or the window width for a single value. */
function stepOf(values: readonly number[], domain: [number, number]): number {
  const gaps = values.slice(1).map((value, i) => value - (values[i] ?? value));
  return gaps.length > 0 ? Math.min(...gaps) : domain[1] - domain[0];
}
