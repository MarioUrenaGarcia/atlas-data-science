import { Arrow } from './Arrow.tsx';
import type { PlaneScales } from './CartesianPlane.tsx';
import styles from './svg.module.css';

interface VectorArrowProps {
  plane: PlaneScales;
  /** Tail of the arrow in plane units; the origin by default. */
  from?: readonly [number, number];
  to: readonly [number, number];
  color: string;
  label?: string;
  width?: number;
  dashed?: boolean;
}

/** Vector drawn as an arrow in plane coordinates, with an optional name near its tip. */
export function VectorArrow({
  plane,
  from = [0, 0],
  to,
  color,
  label,
  width = 2.5,
  dashed = false,
}: VectorArrowProps) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const length = Math.hypot(x1 - x0, y1 - y0);
  // The name sits just beyond the tip, pushed away along the direction of the arrow.
  const offset = length === 0 ? 0 : 14 / plane.unit / length;
  return (
    <g aria-hidden="true">
      {length > 0 && (
        <Arrow
          x1={plane.x(x0)}
          y1={plane.y(y0)}
          x2={plane.x(x1)}
          y2={plane.y(y1)}
          color={color}
          width={width}
          dashed={dashed}
        />
      )}
      {label && (
        <text
          x={plane.x(x1 + (x1 - x0) * offset)}
          y={plane.y(y1 + (y1 - y0) * offset)}
          dy="0.35em"
          textAnchor="middle"
          className={styles.label}
          style={{ fill: color, fontWeight: 700 }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
