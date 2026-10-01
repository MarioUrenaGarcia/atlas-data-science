import { DATA_COLORS } from '../colors.ts';
import type { Vec3 } from './projection.ts';
import type { Screen } from './Scene3D.tsx';

const MESH = 26;

interface SurfaceMeshProps {
  screen: Screen;
  f: (x: number, y: number) => number;
  /** Input window, [x range, y range]. */
  domain: [[number, number], [number, number]];
  /** Maps a function value to the drawn height. */
  toZ: (value: number) => number;
  /** Maps x and y of the domain to scene coordinates. */
  toScene: (x: number, y: number) => [number, number];
  /** Relative height in [0, 1], used to shade each face. */
  shade: (value: number) => number;
}

/**
 * The graph z = f(x, y) as a mesh of quadrilaterals, drawn back to front so
 * nearer faces cover farther ones. Faces are shaded by height.
 */
export function SurfaceMesh({ screen, f, domain, toZ, toScene, shade }: SurfaceMeshProps) {
  const [[x0, x1], [y0, y1]] = domain;
  const point = (i: number, j: number): { p: Vec3; v: number } => {
    const x = x0 + ((x1 - x0) * i) / MESH;
    const y = y0 + ((y1 - y0) * j) / MESH;
    const v = f(x, y);
    const [sx, sy] = toScene(x, y);
    return { p: [sx, sy, toZ(Number.isFinite(v) ? v : 0)], v };
  };
  const faces: { depth: number; points: string; value: number }[] = [];
  for (let i = 0; i < MESH; i += 1) {
    for (let j = 0; j < MESH; j += 1) {
      const corners = [point(i, j), point(i + 1, j), point(i + 1, j + 1), point(i, j + 1)];
      const projected = corners.map(({ p }) => screen.at(p));
      faces.push({
        depth: projected.reduce((total, p) => total + p.depth, 0) / 4,
        points: projected.map((p) => `${p.x},${p.y}`).join(' '),
        value: corners.reduce((total, c) => total + c.v, 0) / 4,
      });
    }
  }
  faces.sort((a, b) => b.depth - a.depth);
  return (
    <g aria-hidden="true">
      {faces.map((face, index) => (
        <polygon
          key={index}
          points={face.points}
          fill={DATA_COLORS.primary}
          fillOpacity={0.25 + 0.6 * shade(face.value)}
          stroke="var(--color-surface)"
          strokeWidth={0.5}
          strokeOpacity={0.8}
        />
      ))}
    </g>
  );
}
