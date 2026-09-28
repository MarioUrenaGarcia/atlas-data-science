import { area, curveLinear, curveStepAfter, line } from 'd3-shape';
import { useMemo } from 'react';
import { useTween } from '../useTween.ts';

export interface XY {
  x: number;
  y: number;
}

interface CurvePathProps {
  points: readonly XY[];
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  color: string;
  width?: number;
  dashed?: boolean;
  /** Fills the area between the curve and y = 0. */
  fill?: boolean;
  fillOpacity?: number;
  step?: boolean;
  animate?: boolean;
}

/** Line or filled area whose vertices interpolate smoothly when they change. */
export function CurvePath({
  points,
  xScale,
  yScale,
  color,
  width = 2,
  dashed = false,
  fill = false,
  fillOpacity = 0.2,
  step = false,
  animate = true,
}: CurvePathProps) {
  const flat = useMemo(() => points.flatMap((point) => [point.x, point.y]), [points]);
  const tweened = useTween(flat, animate ? 300 : 0);
  const data = useMemo(() => {
    const result: XY[] = [];
    for (let i = 0; i + 1 < tweened.length; i += 2)
      result.push({ x: tweened[i] ?? 0, y: tweened[i + 1] ?? 0 });
    return result;
  }, [tweened]);
  const curve = step ? curveStepAfter : curveLinear;
  const path = line<XY>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
    .defined((point) => Number.isFinite(point.y))
    .curve(curve)(data);
  const areaPath = fill
    ? area<XY>()
        .x((point) => xScale(point.x))
        .y0(yScale(0))
        .y1((point) => yScale(point.y))
        .defined((point) => Number.isFinite(point.y))
        .curve(curve)(data)
    : null;
  return (
    <g aria-hidden="true">
      {areaPath && <path d={areaPath} fill={color} fillOpacity={fillOpacity} stroke="none" />}
      {path && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeDasharray={dashed ? '6 4' : undefined}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}
