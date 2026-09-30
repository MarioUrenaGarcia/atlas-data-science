import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { useId, type ReactNode } from 'react';
import { ChartSvg } from './ChartSvg.tsx';
import styles from './svg.module.css';

export interface PlaneScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  /** Pixels per unit, the same on both axes. */
  unit: number;
  /** Visible range of each axis in units. */
  xDomain: [number, number];
  yDomain: [number, number];
}

interface CartesianPlaneProps {
  /** Half of the visible width, in units; the height follows from the aspect ratio. */
  extent: number;
  label: string;
  interactive?: boolean;
  aspect?: number;
  minHeight?: number;
  maxHeight?: number;
  /** Draws a light grid line at every integer. */
  grid?: boolean;
  children: (plane: PlaneScales) => ReactNode;
}

/**
 * Cartesian plane centered at the origin with the same scale on both axes,
 * so angles, lengths and areas look as they are. Children receive the scales.
 */
export function CartesianPlane({
  extent,
  label,
  interactive = false,
  aspect = 0.7,
  minHeight = 280,
  maxHeight = 460,
  grid = true,
  children,
}: CartesianPlaneProps) {
  // Lines through the origin and level curves extend past the visible range; the clip keeps them inside the plane.
  const clipId = `plane-clip-${useId().replace(/:/g, '')}`;
  return (
    <ChartSvg
      label={label}
      interactive={interactive}
      aspect={aspect}
      minHeight={minHeight}
      maxHeight={maxHeight}
      margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      {(box) => {
        const unit = box.inner.width / (2 * extent);
        const halfHeight = box.inner.height / unit / 2;
        const xDomain: [number, number] = [-extent, extent];
        const yDomain: [number, number] = [-halfHeight, halfHeight];
        const x = scaleLinear()
          .domain(xDomain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain(yDomain)
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const verticals = Array.from(
          { length: 2 * Math.floor(extent) + 1 },
          (_, index) => index - Math.floor(extent),
        );
        const horizontals = Array.from(
          { length: 2 * Math.floor(halfHeight) + 1 },
          (_, index) => index - Math.floor(halfHeight),
        );
        return (
          <>
            <g aria-hidden="true">
              {grid &&
                verticals.map((value) => (
                  <line
                    key={`v${value}`}
                    x1={x(value)}
                    x2={x(value)}
                    y1={y(yDomain[0])}
                    y2={y(yDomain[1])}
                    stroke="var(--data-grid)"
                  />
                ))}
              {grid &&
                horizontals.map((value) => (
                  <line
                    key={`h${value}`}
                    x1={x(xDomain[0])}
                    x2={x(xDomain[1])}
                    y1={y(value)}
                    y2={y(value)}
                    stroke="var(--data-grid)"
                  />
                ))}
              <line
                x1={x(xDomain[0])}
                x2={x(xDomain[1])}
                y1={y(0)}
                y2={y(0)}
                stroke="var(--color-border-strong)"
                strokeWidth={1.5}
              />
              <line
                x1={x(0)}
                x2={x(0)}
                y1={y(yDomain[0])}
                y2={y(yDomain[1])}
                stroke="var(--color-border-strong)"
                strokeWidth={1.5}
              />
              {verticals
                .filter((value) => value !== 0 && value % 2 === 0)
                .map((value) => (
                  <text
                    key={`tx${value}`}
                    x={x(value)}
                    y={y(0) + 14}
                    textAnchor="middle"
                    className={styles.labelMuted}
                    style={{ fontSize: 10 }}
                  >
                    {value}
                  </text>
                ))}
              {horizontals
                .filter((value) => value !== 0 && value % 2 === 0)
                .map((value) => (
                  <text
                    key={`ty${value}`}
                    x={x(0) - 6}
                    y={y(value)}
                    dy="0.35em"
                    textAnchor="end"
                    className={styles.labelMuted}
                    style={{ fontSize: 10 }}
                  >
                    {value}
                  </text>
                ))}
            </g>
            <clipPath id={clipId}>
              <rect
                x={box.inner.left}
                y={box.inner.top}
                width={box.inner.width}
                height={box.inner.height}
              />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>{children({ x, y, unit, xDomain, yDomain })}</g>
          </>
        );
      }}
    </ChartSvg>
  );
}
