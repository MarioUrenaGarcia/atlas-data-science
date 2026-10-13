import { useMemo, type ReactNode } from 'react';
import { contourSegments, type Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../colors.ts';
import { EqualPlane, type MapScales } from './EqualPlane.tsx';
import { fieldRange, relative, type FieldRange } from './levels.ts';

export type { MapScales } from './EqualPlane.tsx';

const HEAT_CELLS = 36;

interface ContourMapProps {
  f: (x: number, y: number) => number;
  domain: [Point2, Point2];
  label: string;
  range?: FieldRange;
  /** Extra level drawn thicker, such as the level of the current point. */
  highlight?: number | null;
  heat?: boolean;
  interactive?: boolean;
  children?: (scales: MapScales) => ReactNode;
}

/** Level curves of f over a shaded map of its values, with equal scales on both axes. */
export function ContourMap({
  f,
  domain,
  label,
  range,
  highlight = null,
  heat = true,
  interactive = false,
  children,
}: ContourMapProps) {
  const levelsRange = useMemo(() => range ?? fieldRange(f, domain), [range, f, domain]);
  const curves = useMemo(
    () =>
      levelsRange.levels.map((level) => ({
        level,
        segments: contourSegments(f, domain, level, 70, 70),
      })),
    [levelsRange, f, domain],
  );
  const highlighted = useMemo(
    () => (highlight === null ? [] : contourSegments(f, domain, highlight, 90, 90)),
    [highlight, f, domain],
  );
  const [[x0, x1], [y0, y1]] = domain;
  return (
    <EqualPlane
      domain={domain}
      label={label}
      interactive={interactive}
      background={({ x, y, left, top, width, height }) => {
        const cw = width / HEAT_CELLS;
        const ch = height / HEAT_CELLS;
        return (
          <g aria-hidden="true">
            {heat &&
              Array.from({ length: HEAT_CELLS * HEAT_CELLS }, (_, k) => {
                const i = k % HEAT_CELLS;
                const j = Math.floor(k / HEAT_CELLS);
                const value = f(
                  x0 + ((i + 0.5) * (x1 - x0)) / HEAT_CELLS,
                  y0 + ((j + 0.5) * (y1 - y0)) / HEAT_CELLS,
                );
                return (
                  <rect
                    key={k}
                    x={left + i * cw}
                    y={top + height - (j + 1) * ch}
                    width={cw + 0.5}
                    height={ch + 0.5}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.05 + 0.4 * relative(value, levelsRange)}
                  />
                );
              })}
            {curves.map(({ level, segments }) => (
              <path
                key={level}
                d={segments
                  .map(({ a, b }) => `M${x(a[0])},${y(a[1])}L${x(b[0])},${y(b[1])}`)
                  .join('')}
                stroke={DATA_COLORS.text}
                strokeOpacity={0.45}
                strokeWidth={1}
                fill="none"
              />
            ))}
            {highlighted.length > 0 && (
              <path
                d={highlighted
                  .map(({ a, b }) => `M${x(a[0])},${y(a[1])}L${x(b[0])},${y(b[1])}`)
                  .join('')}
                stroke={DATA_COLORS.highlight}
                strokeWidth={3}
                fill="none"
              />
            )}
          </g>
        );
      }}
    >
      {children}
    </EqualPlane>
  );
}
