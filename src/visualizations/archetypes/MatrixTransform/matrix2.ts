import { eigen2x2, svd } from '../../../lib/linalg/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';

export type Mat2 = [[number, number], [number, number]];
export type Vec2 = [number, number];

export const IDENTITY: Mat2 = [
  [1, 0],
  [0, 1],
];

export const apply = (m: Mat2, v: Vec2): Vec2 => [
  m[0][0] * v[0] + m[0][1] * v[1],
  m[1][0] * v[0] + m[1][1] * v[1],
];

export const multiply = (a: Mat2, b: Mat2): Mat2 => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
];

export const determinant = (m: Mat2) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
export const trace = (m: Mat2) => m[0][0] + m[1][1];

export function inverse(m: Mat2): Mat2 | null {
  const det = determinant(m);
  if (Math.abs(det) < 1e-12) return null;
  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det],
  ];
}

/** Straight-line blend between two matrices, used to animate a transformation. */
export const blend = (a: Mat2, b: Mat2, t: number): Mat2 => [
  [a[0][0] + (b[0][0] - a[0][0]) * t, a[0][1] + (b[0][1] - a[0][1]) * t],
  [a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t],
];

export function eigen(m: Mat2) {
  return eigen2x2(m);
}

export interface Svd2 {
  u: Mat2;
  sigma: [number, number];
  v: Mat2;
}

/** Singular value decomposition of a 2x2 matrix, with U completed to a rotation or reflection when A is singular. */
export function svd2(m: Mat2): Svd2 {
  const result = svd(m);
  const sigma: [number, number] = [result.singularValues[0] ?? 0, result.singularValues[1] ?? 0];
  const v: Mat2 = [
    [result.v[0]?.[0] ?? 1, result.v[0]?.[1] ?? 0],
    [result.v[1]?.[0] ?? 0, result.v[1]?.[1] ?? 1],
  ];
  let u1: Vec2 = [result.u[0]?.[0] ?? 1, result.u[1]?.[0] ?? 0];
  let u2: Vec2 = [result.u[0]?.[1] ?? 0, result.u[1]?.[1] ?? 1];
  if (Math.hypot(u1[0], u1[1]) < 1e-9) u1 = [1, 0];
  if (Math.hypot(u2[0], u2[1]) < 1e-9) u2 = [-u1[1], u1[0]];
  return {
    u: [
      [u1[0], u2[0]],
      [u1[1], u2[1]],
    ],
    sigma,
    v,
  };
}

export const transpose = (m: Mat2): Mat2 => [
  [m[0][0], m[1][0]],
  [m[0][1], m[1][1]],
];

export const matText = (m: Mat2, digits = 2) =>
  `[${m.map((row) => row.map((value) => formatNumber(value, digits)).join(', ')).join('; ')}]`;

export const matLatex = (m: Mat2, digits = 2) =>
  `\\begin{pmatrix} ${m.map((row) => row.map((value) => formatNumber(value, digits)).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;

export const vecText = (v: readonly number[], digits = 2) =>
  `(${v.map((value) => formatNumber(value, digits)).join(', ')})`;

/** Eigenvalues as text, including the complex case. */
export function eigenText(m: Mat2): string {
  const { real, imaginary } = eigen(m);
  if (imaginary[0] === 0) return `${formatNumber(real[0], 3)} y ${formatNumber(real[1], 3)}`;
  return `${formatNumber(real[0], 3)} ± ${formatNumber(Math.abs(imaginary[0]), 3)}i`;
}
