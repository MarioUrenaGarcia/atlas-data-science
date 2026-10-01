export type Vec3 = [number, number, number];

export interface Camera {
  /** Rotation around the vertical z axis, in degrees. */
  azimuth: number;
  /** Tilt of the view above the xy plane, in degrees. */
  elevation: number;
}

export interface Projected {
  x: number;
  y: number;
  /** Larger values are farther from the viewer. */
  depth: number;
}

/**
 * Orthographic projection: rotate the scene around z, tilt it, and drop the
 * depth coordinate. Returned coordinates are in scene units with y upward.
 */
export function project(point: Vec3, camera: Camera): Projected {
  const a = (camera.azimuth * Math.PI) / 180;
  const e = (camera.elevation * Math.PI) / 180;
  const x1 = point[0] * Math.cos(a) - point[1] * Math.sin(a);
  const y1 = point[0] * Math.sin(a) + point[1] * Math.cos(a);
  const z1 = point[2];
  return {
    x: x1,
    y: z1 * Math.cos(e) - y1 * Math.sin(e),
    depth: y1 * Math.cos(e) + z1 * Math.sin(e),
  };
}

export const add3 = (u: Vec3, v: Vec3): Vec3 => [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
export const sub3 = (u: Vec3, v: Vec3): Vec3 => [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
export const scale3 = (u: Vec3, c: number): Vec3 => [u[0] * c, u[1] * c, u[2] * c];
export const dot3 = (u: Vec3, v: Vec3) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
export const cross3 = (u: Vec3, v: Vec3): Vec3 => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
export const norm3 = (u: Vec3) => Math.sqrt(dot3(u, u));
export const det3 = (a: Vec3, b: Vec3, c: Vec3) => dot3(a, cross3(b, c));
