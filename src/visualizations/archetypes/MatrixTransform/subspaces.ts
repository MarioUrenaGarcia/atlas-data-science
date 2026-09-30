import { svd2, type Mat2, type Vec2 } from './matrix2.ts';

/** Singular values below this count as zero when deciding the rank. */
export const RANK_TOLERANCE = 1e-9;

export interface FundamentalSubspaces {
  rank: 0 | 1 | 2;
  /** Unit direction of the row space when the rank is 1. */
  row: Vec2;
  /** Unit direction of the null space when the rank is 1. */
  nullDirection: Vec2;
  /** Unit direction of the column space when the rank is 1. */
  column: Vec2;
  sigma: [number, number];
  u: Mat2;
  v: Mat2;
}

/**
 * Row, column and null space of a 2x2 matrix from its SVD: the right singular
 * vectors with nonzero singular value span the row space, the others the null
 * space, and the matching left singular vectors span the column space.
 */
export function fundamentalSubspaces(matrix: Mat2): FundamentalSubspaces {
  const { u, sigma, v } = svd2(matrix);
  const rank = sigma.filter((value) => value > RANK_TOLERANCE).length as 0 | 1 | 2;
  return {
    rank,
    row: [v[0][0], v[1][0]],
    nullDirection: [v[0][1], v[1][1]],
    column: [u[0][0], u[1][0]],
    sigma,
    u,
    v,
  };
}

/** Component of x along a unit direction. */
export const along = (x: Vec2, unit: Vec2): Vec2 => {
  const c = x[0] * unit[0] + x[1] * unit[1];
  return [c * unit[0], c * unit[1]];
};

/** Moore-Penrose pseudoinverse of a 2x2 matrix, V Σ⁺ Uᵀ. */
export function pseudoInverse2(matrix: Mat2): Mat2 {
  const { u, sigma, v } = svd2(matrix);
  const inv = sigma.map((value) => (value > RANK_TOLERANCE ? 1 / value : 0));
  const entry = (i: number, j: number) =>
    (v[i]?.[0] ?? 0) * (inv[0] ?? 0) * (u[j]?.[0] ?? 0) +
    (v[i]?.[1] ?? 0) * (inv[1] ?? 0) * (u[j]?.[1] ?? 0);
  return [
    [entry(0, 0), entry(0, 1)],
    [entry(1, 0), entry(1, 1)],
  ];
}
