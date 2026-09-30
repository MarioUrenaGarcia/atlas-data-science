import { add3, scale3, type Vec3 } from './projection.ts';
import type { Screen } from './Scene3D.tsx';

const GRID_LINES = 4;

interface PlanePatchProps {
  screen: Screen;
  /** Two independent directions spanning the plane. */
  u: Vec3;
  v: Vec3;
  /** Half-size of the patch along each direction. */
  reach: number;
  color: string;
}

/** A square piece of the plane through the origin spanned by u and v, with a light grid. */
export function PlanePatch({ screen, u, v, reach, color }: PlanePatchProps) {
  const point = (s: number, t: number) => screen.at(add3(scale3(u, s), scale3(v, t)));
  const corners = [
    point(-reach, -reach),
    point(reach, -reach),
    point(reach, reach),
    point(-reach, reach),
  ];
  const steps = Array.from(
    { length: 2 * GRID_LINES + 1 },
    (_, i) => ((i - GRID_LINES) / GRID_LINES) * reach,
  );
  return (
    <g aria-hidden="true">
      <polygon
        points={corners.map((c) => `${c.x},${c.y}`).join(' ')}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth={1.5}
      />
      {steps.map((s) => {
        const a = point(s, -reach);
        const b = point(s, reach);
        const c = point(-reach, s);
        const d = point(reach, s);
        return (
          <g key={s}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeOpacity={0.35} />
            <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke={color} strokeOpacity={0.35} />
          </g>
        );
      })}
    </g>
  );
}
