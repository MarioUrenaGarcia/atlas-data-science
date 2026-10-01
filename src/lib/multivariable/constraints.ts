import { findRoots } from '../calculus/index.ts';
import { FIELDS, type Field2, type Point2 } from './index.ts';

/** Optimization of a field along a curve g(x, y) = 0 given by a parametrization. */
export interface LagrangeCase {
  id: string;
  fieldId: string;
  constraintLatex: string;
  g: (x: number, y: number) => number;
  gradG: (x: number, y: number) => Point2;
  curve: (t: number) => Point2;
  velocity: (t: number) => Point2;
  tRange: [number, number];
}

export const LAGRANGE_CASES: Readonly<Record<string, LagrangeCase>> = {
  'suma-circulo': {
    id: 'suma-circulo',
    fieldId: 'suma',
    constraintLatex: 'x^2 + y^2 = 1',
    g: (x, y) => x * x + y * y - 1,
    gradG: (x, y) => [2 * x, 2 * y],
    curve: (t) => [Math.cos(t), Math.sin(t)],
    velocity: (t) => [-Math.sin(t), Math.cos(t)],
    tRange: [0, 2 * Math.PI],
  },
  'paraboloide-recta': {
    id: 'paraboloide-recta',
    fieldId: 'paraboloide',
    constraintLatex: 'x + y = 1',
    g: (x, y) => x + y - 1,
    gradG: () => [1, 1],
    curve: (t) => [t, 1 - t],
    velocity: () => [1, -1],
    tRange: [-1, 2],
  },
  'producto-elipse': {
    id: 'producto-elipse',
    fieldId: 'producto',
    constraintLatex: '\\tfrac{x^2}{4} + y^2 = 1',
    g: (x, y) => (x * x) / 4 + y * y - 1,
    gradG: (x, y) => [x / 2, 2 * y],
    curve: (t) => [2 * Math.cos(t), Math.sin(t)],
    velocity: (t) => [-2 * Math.sin(t), Math.cos(t)],
    tRange: [0, 2 * Math.PI],
  },
};

export const LAGRANGE_CASE_IDS = Object.keys(LAGRANGE_CASES) as [string, ...string[]];

export interface ConstrainedCritical {
  t: number;
  point: Point2;
  value: number;
  /** Multiplier with grad f = lambda grad g at the point. */
  lambda: number;
}

/** Points of the curve where the derivative of f along it vanishes, with their multipliers. */
export function lagrangePoints(c: LagrangeCase): ConstrainedCritical[] {
  const field = FIELDS[c.fieldId] as Field2;
  const along = (t: number) => {
    const [x, y] = c.curve(t);
    const [gx, gy] = field.grad(x, y);
    const [vx, vy] = c.velocity(t);
    return gx * vx + gy * vy;
  };
  return findRoots(along, c.tRange[0], c.tRange[1], 720).map((t) => {
    const point = c.curve(t);
    const [fx, fy] = field.grad(point[0], point[1]);
    const [gx, gy] = c.gradG(point[0], point[1]);
    return { t, point, value: field.f(point[0], point[1]), lambda: (fx * gx + fy * gy) / (gx * gx + gy * gy) };
  });
}

/** Linear inequality a · x <= c. */
export interface HalfPlane {
  a: Point2;
  c: number;
  label: string;
}

export interface KktSolution {
  point: Point2;
  /** Multipliers mu_i >= 0, zero for inactive constraints. */
  multipliers: number[];
  active: number[];
}

const dot = (u: Point2, v: Point2) => u[0] * v[0] + u[1] * v[1];
const TOLERANCE = 1e-9;

/**
 * Closest point of a polygon {x : a_i · x <= c_i} to a target: minimizes
 * |x - target|^2 by trying every set of at most two active constraints and
 * keeping the one that is feasible and has nonnegative multipliers. For
 * f = |x - target|^2 the KKT conditions read 2(x - target) + sum mu_i a_i = 0.
 */
export function projectOntoPolygon(target: Point2, planes: readonly HalfPlane[]): KktSolution {
  const feasible = (p: Point2) => planes.every(({ a, c }) => dot(a, p) <= c + TOLERANCE);
  const n = planes.length;
  const subsets: number[][] = [[]];
  for (let i = 0; i < n; i += 1) subsets.push([i]);
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) subsets.push([i, j]);
  for (const subset of subsets) {
    let point: Point2;
    const mu = new Array<number>(n).fill(0);
    if (subset.length === 0) {
      point = target;
    } else if (subset.length === 1) {
      const i = subset[0] as number;
      const { a, c } = planes[i] as HalfPlane;
      const excess = (dot(a, target) - c) / dot(a, a);
      point = [target[0] - excess * a[0], target[1] - excess * a[1]];
      mu[i] = 2 * excess;
    } else {
      const [i, j] = subset as [number, number];
      const pi = planes[i] as HalfPlane;
      const pj = planes[j] as HalfPlane;
      const det = pi.a[0] * pj.a[1] - pi.a[1] * pj.a[0];
      if (Math.abs(det) < TOLERANCE) continue;
      point = [(pi.c * pj.a[1] - pi.a[1] * pj.c) / det, (pi.a[0] * pj.c - pi.c * pj.a[0]) / det];
      // Solve 2(point - target) = -(mu_i a_i + mu_j a_j) for the two multipliers.
      const r: Point2 = [2 * (target[0] - point[0]), 2 * (target[1] - point[1])];
      mu[i] = (r[0] * pj.a[1] - r[1] * pj.a[0]) / det;
      mu[j] = (pi.a[0] * r[1] - pi.a[1] * r[0]) / det;
    }
    if (feasible(point) && mu.every((m) => m >= -TOLERANCE)) {
      return { point, multipliers: mu.map((m) => Math.max(0, m)), active: subset };
    }
  }
  return { point: target, multipliers: new Array<number>(n).fill(0), active: [] };
}

/**
 * Vertices of the polygon {x : a_i · x <= c_i} inside a bounding box, by
 * clipping the box with one half-plane at a time (Sutherland-Hodgman).
 */
export function feasiblePolygon(planes: readonly HalfPlane[], box: [Point2, Point2]): Point2[] {
  const [[x0, x1], [y0, y1]] = box;
  let polygon: Point2[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ];
  for (const { a, c } of planes) {
    const inside = (p: Point2) => dot(a, p) <= c + TOLERANCE;
    const clipped: Point2[] = [];
    polygon.forEach((p, index) => {
      const q = polygon[(index + 1) % polygon.length] as Point2;
      if (inside(p)) clipped.push(p);
      if (inside(p) !== inside(q)) {
        const s = (c - dot(a, p)) / (dot(a, q) - dot(a, p));
        clipped.push([p[0] + s * (q[0] - p[0]), p[1] + s * (q[1] - p[1])]);
      }
    });
    polygon = clipped;
  }
  return polygon;
}

export interface KktCase {
  id: string;
  planes: HalfPlane[];
  /** Path followed by the target point in the animation. */
  path: (t: number) => Point2;
  domain: [Point2, Point2];
}

export const KKT_CASES: Readonly<Record<string, KktCase>> = {
  triangulo: {
    id: 'triangulo',
    planes: [
      { a: [1, 1], c: 1, label: 'x + y \\le 1' },
      { a: [-1, 0], c: 0, label: 'x \\ge 0' },
      { a: [0, -1], c: 0, label: 'y \\ge 0' },
    ],
    path: (t) => [0.4 + 1.4 * Math.cos(t), 0.4 + 1.4 * Math.sin(t)],
    domain: [
      [-1.5, 2.3],
      [-1.5, 2.3],
    ],
  },
  semiplano: {
    id: 'semiplano',
    planes: [{ a: [1, 2], c: 2, label: 'x + 2y \\le 2' }],
    path: (t) => [1.2 * Math.cos(t), 0.4 + 1.3 * Math.sin(t)],
    domain: [
      [-2, 2],
      [-1.5, 2.3],
    ],
  },
};

export const KKT_CASE_IDS = Object.keys(KKT_CASES) as [string, ...string[]];
