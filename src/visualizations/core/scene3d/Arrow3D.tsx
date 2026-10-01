import { Arrow } from '../svg/Arrow.tsx';
import svgStyles from '../svg/svg.module.css';
import type { Vec3 } from './projection.ts';
import type { Screen } from './Scene3D.tsx';

const LABEL_OFFSET = 14;

interface Arrow3DProps {
  screen: Screen;
  from?: Vec3;
  to: Vec3;
  color: string;
  label?: string;
  width?: number;
  dashed?: boolean;
}

/** Arrow between two points of the scene, with an optional name past its tip. */
export function Arrow3D({
  screen,
  from = [0, 0, 0],
  to,
  color,
  label,
  width = 2.5,
  dashed = false,
}: Arrow3DProps) {
  const a = screen.at(from);
  const b = screen.at(to);
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = length > 0 ? (b.x - a.x) / length : 0;
  const uy = length > 0 ? (b.y - a.y) / length : 0;
  return (
    <g aria-hidden="true">
      {length > 1 && (
        <Arrow x1={a.x} y1={a.y} x2={b.x} y2={b.y} color={color} width={width} dashed={dashed} />
      )}
      {label && (
        <text
          x={b.x + ux * LABEL_OFFSET}
          y={b.y + uy * LABEL_OFFSET}
          dy="0.35em"
          textAnchor="middle"
          className={svgStyles.label}
          style={{ fill: color, fontWeight: 700 }}
        >
          {label}
        </text>
      )}
    </g>
  );
}
