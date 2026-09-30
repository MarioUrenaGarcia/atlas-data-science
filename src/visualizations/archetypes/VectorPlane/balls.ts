import type { PlaneScales } from '../../core/svg/CartesianPlane.tsx';
import type { Vec2 } from './schema.ts';
import { pNorm } from './vectors.ts';

const BALL_SAMPLES = 160;

/** Points of the sphere of radius r in the p-norm, traced by angle. */
export function ballPath(plane: PlaneScales, p: number, radius: number): string {
  return Array.from({ length: BALL_SAMPLES + 1 }, (_, index) => {
    const angle = (2 * Math.PI * index) / BALL_SAMPLES;
    const direction: Vec2 = [Math.cos(angle), Math.sin(angle)];
    const norm = pNorm(direction, p);
    return `${plane.x((direction[0] / norm) * radius)},${plane.y((direction[1] / norm) * radius)}`;
  }).join(' ');
}
