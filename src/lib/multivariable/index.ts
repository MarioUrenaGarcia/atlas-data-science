/**
 * Functions of two variables with exact gradients and Hessians, plus the
 * numerical tools used to draw and analyze them: level curves by marching
 * squares, critical points by Newton's method and double integrals.
 */

export type Point2 = [number, number];
export type Sym2 = [[number, number], [number, number]];

export interface Field2 {
  id: string;
  latex: string;
  f: (x: number, y: number) => number;
  grad: (x: number, y: number) => Point2;
  hess: (x: number, y: number) => Sym2;
  /** Plotted window, [x range, y range]. */
  domain: [Point2, Point2];
}

const gauss = (x: number, y: number, cx: number, cy: number, s: number) =>
  Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / s);

function field(
  id: string,
  latex: string,
  f: Field2['f'],
  grad: Field2['grad'],
  hess: Field2['hess'],
  domain: [Point2, Point2] = [
    [-2, 2],
    [-2, 2],
  ],
): Field2 {
  return { id, latex, f, grad, hess, domain };
}

/** Sum of two Gaussian hills: a higher one at (1, 0.5) and a lower one at (-1, -0.5). */
const hillsF = (x: number, y: number) => 2 * gauss(x, y, 1, 0.5, 0.8) + gauss(x, y, -1, -0.5, 0.6);
function hillsGrad(x: number, y: number): Point2 {
  const g1 = 2 * gauss(x, y, 1, 0.5, 0.8);
  const g2 = gauss(x, y, -1, -0.5, 0.6);
  return [
    (g1 * (-2 * (x - 1))) / 0.8 + (g2 * (-2 * (x + 1))) / 0.6,
    (g1 * (-2 * (y - 0.5))) / 0.8 + (g2 * (-2 * (y + 0.5))) / 0.6,
  ];
}
function hillsHess(x: number, y: number): Sym2 {
  const term = (g: number, dx: number, dy: number, s: number): Sym2 => [
    [g * ((4 * dx * dx) / (s * s) - 2 / s), (g * 4 * dx * dy) / (s * s)],
    [(g * 4 * dx * dy) / (s * s), g * ((4 * dy * dy) / (s * s) - 2 / s)],
  ];
  const a = term(2 * gauss(x, y, 1, 0.5, 0.8), x - 1, y - 0.5, 0.8);
  const b = term(gauss(x, y, -1, -0.5, 0.6), x + 1, y + 0.5, 0.6);
  return [
    [a[0][0] + b[0][0], a[0][1] + b[0][1]],
    [a[1][0] + b[1][0], a[1][1] + b[1][1]],
  ];
}

const LIST: Field2[] = [
  field(
    'suma',
    'x + y',
    (x, y) => x + y,
    () => [1, 1],
    () => [
      [0, 0],
      [0, 0],
    ],
  ),
  field(
    'producto',
    'xy',
    (x, y) => x * y,
    (x, y) => [y, x],
    () => [
      [0, 1],
      [1, 0],
    ],
    [
      [-2.5, 2.5],
      [-2, 2],
    ],
  ),
  field(
    'paraboloide',
    'x^2 + y^2',
    (x, y) => x * x + y * y,
    (x, y) => [2 * x, 2 * y],
    () => [
      [2, 0],
      [0, 2],
    ],
  ),
  field(
    'eliptico',
    'x^2 + 3y^2',
    (x, y) => x * x + 3 * y * y,
    (x, y) => [2 * x, 6 * y],
    () => [
      [2, 0],
      [0, 6],
    ],
  ),
  field(
    'cuadratica-girada',
    '2x^2 + 2xy + y^2',
    (x, y) => 2 * x * x + 2 * x * y + y * y,
    (x, y) => [4 * x + 2 * y, 2 * x + 2 * y],
    () => [
      [4, 2],
      [2, 2],
    ],
  ),
  field(
    'silla',
    'x^2 - y^2',
    (x, y) => x * x - y * y,
    (x, y) => [2 * x, -2 * y],
    () => [
      [2, 0],
      [0, -2],
    ],
  ),
  field(
    'silla-mono',
    'x^3 - 3xy^2',
    (x, y) => x ** 3 - 3 * x * y * y,
    (x, y) => [3 * x * x - 3 * y * y, -6 * x * y],
    (x, y) => [
      [6 * x, -6 * y],
      [-6 * y, -6 * x],
    ],
    [
      [-1.5, 1.5],
      [-1.5, 1.5],
    ],
  ),
  field(
    'gaussiana',
    'e^{-(x^2 + y^2)}',
    (x, y) => Math.exp(-(x * x + y * y)),
    (x, y) => {
      const g = Math.exp(-(x * x + y * y));
      return [-2 * x * g, -2 * y * g];
    },
    (x, y) => {
      const g = Math.exp(-(x * x + y * y));
      return [
        [(4 * x * x - 2) * g, 4 * x * y * g],
        [4 * x * y * g, (4 * y * y - 2) * g],
      ];
    },
  ),
  field(
    'dos-colinas',
    '2e^{-\\frac{(x-1)^2 + (y-0.5)^2}{0.8}} + e^{-\\frac{(x+1)^2 + (y+0.5)^2}{0.6}}',
    hillsF,
    hillsGrad,
    hillsHess,
    [
      [-2.5, 2.5],
      [-2, 2],
    ],
  ),
  field(
    'min-y-silla',
    'x^3 - 3x + y^2',
    (x, y) => x ** 3 - 3 * x + y * y,
    (x, y) => [3 * x * x - 3, 2 * y],
    (x) => [
      [6 * x, 0],
      [0, 2],
    ],
    [
      [-2.2, 2.2],
      [-2, 2],
    ],
  ),
  field(
    'ondas',
    '\\operatorname{sen} x \\cos y',
    (x, y) => Math.sin(x) * Math.cos(y),
    (x, y) => [Math.cos(x) * Math.cos(y), -Math.sin(x) * Math.sin(y)],
    (x, y) => [
      [-Math.sin(x) * Math.cos(y), -Math.cos(x) * Math.sin(y)],
      [-Math.cos(x) * Math.sin(y), -Math.sin(x) * Math.cos(y)],
    ],
    [
      [-3.2, 3.2],
      [-3.2, 3.2],
    ],
  ),
  field(
    'plano',
    '2x - y + 1',
    (x, y) => 2 * x - y + 1,
    () => [2, -1],
    () => [
      [0, 0],
      [0, 0],
    ],
  ),
  field(
    'rosenbrock',
    '(1 - x)^2 + 5(y - x^2)^2',
    (x, y) => (1 - x) ** 2 + 5 * (y - x * x) ** 2,
    (x, y) => [-2 * (1 - x) - 20 * x * (y - x * x), 10 * (y - x * x)],
    (x, y) => [
      [2 - 20 * y + 60 * x * x, -20 * x],
      [-20 * x, 10],
    ],
    [
      [-1.5, 1.8],
      [-1, 2.5],
    ],
  ),
];

export const FIELDS: Readonly<Record<string, Field2>> = Object.fromEntries(
  LIST.map((item) => [item.id, item]),
);
export const FIELD_IDS = LIST.map((item) => item.id) as [string, ...string[]];

export interface Segment {
  a: Point2;
  b: Point2;
}

/**
 * Level curves f = level by marching squares on an nx by ny grid. Each cell
 * whose corners straddle the level contributes one or two segments with
 * endpoints placed by linear interpolation along the cell edges.
 */
export function contourSegments(
  f: (x: number, y: number) => number,
  domain: [Point2, Point2],
  level: number,
  nx = 60,
  ny = 60,
): Segment[] {
  const [[x0, x1], [y0, y1]] = domain;
  const dx = (x1 - x0) / nx;
  const dy = (y1 - y0) / ny;
  const values: number[][] = [];
  for (let j = 0; j <= ny; j += 1) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i += 1) row.push(f(x0 + i * dx, y0 + j * dy) - level);
    values.push(row);
  }
  const segments: Segment[] = [];
  const cross = (pa: Point2, va: number, pb: Point2, vb: number): Point2 => {
    const t = va / (va - vb);
    return [pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1])];
  };
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      const p: Point2[] = [
        [x0 + i * dx, y0 + j * dy],
        [x0 + (i + 1) * dx, y0 + j * dy],
        [x0 + (i + 1) * dx, y0 + (j + 1) * dy],
        [x0 + i * dx, y0 + (j + 1) * dy],
      ];
      const v = [
        values[j]?.[i] ?? 0,
        values[j]?.[i + 1] ?? 0,
        values[j + 1]?.[i + 1] ?? 0,
        values[j + 1]?.[i] ?? 0,
      ];
      if (!v.every(Number.isFinite)) continue;
      const points: Point2[] = [];
      for (let k = 0; k < 4; k += 1) {
        const a = v[k] ?? 0;
        const b = v[(k + 1) % 4] ?? 0;
        if ((a < 0 && b >= 0) || (a >= 0 && b < 0))
          points.push(cross(p[k] as Point2, a, p[(k + 1) % 4] as Point2, b));
      }
      if (points.length === 2) segments.push({ a: points[0] as Point2, b: points[1] as Point2 });
      else if (points.length === 4) {
        // Saddle cell: pair the crossings using the value at the center to decide the connection.
        const center = (v[0] ?? 0) + (v[1] ?? 0) + (v[2] ?? 0) + (v[3] ?? 0);
        const sameAsFirst = center >= 0 === (v[0] ?? 0) >= 0;
        const [q0, q1, q2, q3] = points as [Point2, Point2, Point2, Point2];
        if (sameAsFirst) {
          segments.push({ a: q0, b: q1 }, { a: q2, b: q3 });
        } else {
          segments.push({ a: q0, b: q3 }, { a: q1, b: q2 });
        }
      }
    }
  }
  return segments;
}

export function eigenSym2(h: Sym2): { values: [number, number]; vectors: [Point2, Point2] } {
  const [[a, b], [, d]] = h;
  const mean = (a + d) / 2;
  const radius = Math.hypot((a - d) / 2, b);
  const l1 = mean + radius;
  const l2 = mean - radius;
  let v1: Point2 = Math.abs(b) > 1e-12 ? [b, l1 - a] : a >= d ? [1, 0] : [0, 1];
  const n = Math.hypot(v1[0], v1[1]);
  v1 = [v1[0] / n, v1[1] / n];
  return { values: [l1, l2], vectors: [v1, [-v1[1], v1[0]]] };
}

export type CriticalKind = 'mínimo' | 'máximo' | 'silla' | 'degenerado';

export function classifyCritical(h: Sym2, tolerance = 1e-9): CriticalKind {
  const { values } = eigenSym2(h);
  if (Math.abs(values[0]) < tolerance || Math.abs(values[1]) < tolerance) return 'degenerado';
  if (values[0] > 0 && values[1] > 0) return 'mínimo';
  if (values[0] < 0 && values[1] < 0) return 'máximo';
  return 'silla';
}

/**
 * Critical points inside the domain: Newton's method on the gradient started
 * from a grid of seeds, keeping the distinct converged points.
 */
export function criticalPoints(
  fieldValue: Field2,
  seeds = 9,
  tolerance = 1e-10,
): { point: Point2; kind: CriticalKind }[] {
  const [[x0, x1], [y0, y1]] = fieldValue.domain;
  const found: { point: Point2; kind: CriticalKind }[] = [];
  for (let i = 0; i < seeds; i += 1) {
    for (let j = 0; j < seeds; j += 1) {
      let x = x0 + ((x1 - x0) * (i + 0.5)) / seeds;
      let y = y0 + ((y1 - y0) * (j + 0.5)) / seeds;
      let converged = false;
      for (let k = 0; k < 60; k += 1) {
        const [gx, gy] = fieldValue.grad(x, y);
        if (Math.hypot(gx, gy) < tolerance) {
          converged = true;
          break;
        }
        const [[a, b], [, d]] = fieldValue.hess(x, y);
        const det = a * d - b * b;
        if (Math.abs(det) < 1e-14) break;
        x -= (d * gx - b * gy) / det;
        y -= (-b * gx + a * gy) / det;
        if (!Number.isFinite(x) || !Number.isFinite(y)) break;
      }
      if (!converged || x < x0 || x > x1 || y < y0 || y > y1) continue;
      if (found.some(({ point }) => Math.hypot(point[0] - x, point[1] - y) < 1e-6)) continue;
      found.push({ point: [x, y], kind: classifyCritical(fieldValue.hess(x, y)) });
    }
  }
  return found.sort((p, q) => p.point[0] - q.point[0] || p.point[1] - q.point[1]);
}

/** Midpoint rule on an n by n grid of the rectangle [x0, x1] by [y0, y1]. */
export function doubleIntegral(
  f: (x: number, y: number) => number,
  [x0, x1]: Point2,
  [y0, y1]: Point2,
  n = 200,
): number {
  const dx = (x1 - x0) / n;
  const dy = (y1 - y0) / n;
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) total += f(x0 + (i + 0.5) * dx, y0 + (j + 0.5) * dy);
  }
  return total * dx * dy;
}

/** A smooth map of the plane with its Jacobian matrix, for change-of-variables pictures. */
export interface Map2 {
  id: string;
  latex: string;
  /** Names of the input coordinates. */
  inputs: [string, string];
  map: (u: number, v: number) => Point2;
  jacobian: (u: number, v: number) => Sym2 | [[number, number], [number, number]];
  /** Input window drawn as a grid. */
  domain: [Point2, Point2];
}

export const MAPS: Readonly<Record<string, Map2>> = {
  polares: {
    id: 'polares',
    latex: '(r, \\theta) \\mapsto (r\\cos\\theta,\\ r\\operatorname{sen}\\theta)',
    inputs: ['r', 'θ'],
    map: (r, t) => [r * Math.cos(t), r * Math.sin(t)],
    jacobian: (r, t) => [
      [Math.cos(t), -r * Math.sin(t)],
      [Math.sin(t), r * Math.cos(t)],
    ],
    domain: [
      [0.2, 2],
      [0, Math.PI],
    ],
  },
  cuadrado: {
    id: 'cuadrado',
    latex: '(u, v) \\mapsto (u^2 - v^2,\\ 2uv)',
    inputs: ['u', 'v'],
    map: (u, v) => [u * u - v * v, 2 * u * v],
    jacobian: (u, v) => [
      [2 * u, -2 * v],
      [2 * v, 2 * u],
    ],
    domain: [
      [0.2, 1.4],
      [0, 1.2],
    ],
  },
  lineal: {
    id: 'lineal',
    latex: '(u, v) \\mapsto (2u + v,\\ u + v)',
    inputs: ['u', 'v'],
    map: (u, v) => [2 * u + v, u + v],
    jacobian: () => [
      [2, 1],
      [1, 1],
    ],
    domain: [
      [-1, 1],
      [-1, 1],
    ],
  },
  onda: {
    id: 'onda',
    latex: '(u, v) \\mapsto (u + 0.3\\operatorname{sen} v,\\ v + 0.3\\operatorname{sen} u)',
    inputs: ['u', 'v'],
    map: (u, v) => [u + 0.3 * Math.sin(v), v + 0.3 * Math.sin(u)],
    jacobian: (u, v) => [
      [1, 0.3 * Math.cos(v)],
      [0.3 * Math.cos(u), 1],
    ],
    domain: [
      [-2, 2],
      [-2, 2],
    ],
  },
};

export const MAP_IDS = Object.keys(MAPS) as [string, ...string[]];

export const det2 = (m: [[number, number], [number, number]]) =>
  m[0][0] * m[1][1] - m[0][1] * m[1][0];
