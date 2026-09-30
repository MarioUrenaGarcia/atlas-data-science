import type { PlaneScales } from './CartesianPlane.tsx';
type Vec2 = readonly [number, number];

/** Far enough to cross any visible plane; the plane clips the rest. */
const FAR = 60;

interface OriginLineProps {
  plane: PlaneScales;
  direction: Vec2;
  color: string;
  width?: number;
  dashed?: boolean;
  /** Point the line passes through, the origin by default. */
  through?: Vec2;
}

/** Full line through a point (the origin by default) along a direction. */
export function OriginLine({
  plane,
  direction,
  color,
  width = 2.5,
  dashed = false,
  through = [0, 0],
}: OriginLineProps) {
  return (
    <line
      aria-hidden="true"
      x1={plane.x(through[0] - direction[0] * FAR)}
      y1={plane.y(through[1] - direction[1] * FAR)}
      x2={plane.x(through[0] + direction[0] * FAR)}
      y2={plane.y(through[1] + direction[1] * FAR)}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? '8 5' : undefined}
      strokeLinecap="round"
    />
  );
}
