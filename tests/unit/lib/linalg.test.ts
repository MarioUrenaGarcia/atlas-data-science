import { describe, expect, it } from 'vitest';
import {
  cholesky,
  conditionNumber,
  determinant,
  eigen2x2,
  eigenSymmetric,
  gramSchmidt,
  identity,
  inverse,
  multiply,
  multiplyVector,
  norm,
  pseudoInverse,
  qr,
  rank,
  solve,
  svd,
  transpose,
  type Matrix,
} from '../../../src/lib/linalg/index.ts';

function expectMatrixClose(actual: Matrix, expected: Matrix, digits = 9) {
  expect(actual.length).toBe(expected.length);
  actual.forEach((row, i) =>
    row.forEach((value, j) => expect(value).toBeCloseTo(expected[i]?.[j] ?? 0, digits)),
  );
}

describe('basic operations', () => {
  it('multiplies and transposes', () => {
    expect(
      multiply(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [0, 1],
          [1, 0],
        ],
      ),
    ).toEqual([
      [2, 1],
      [4, 3],
    ]);
    expect(transpose([[1, 2, 3]])).toEqual([[1], [2], [3]]);
    expect(
      multiplyVector(
        [
          [2, 0],
          [0, 3],
        ],
        [1, 1],
      ),
    ).toEqual([2, 3]);
  });

  it('computes norms', () => {
    expect(norm([3, 4])).toBe(5);
    expect(norm([3, -4], 1)).toBe(7);
    expect(norm([3, -4], Number.POSITIVE_INFINITY)).toBe(4);
    expect(norm([1, 1], 3)).toBeCloseTo(2 ** (1 / 3), 12);
  });
});

describe('solving systems', () => {
  const A = [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2],
  ];

  it('computes determinants, inverses and solutions', () => {
    expect(
      determinant([
        [1, 2],
        [3, 4],
      ]),
    ).toBeCloseTo(-2, 12);
    expect(
      determinant([
        [1, 2],
        [2, 4],
      ]),
    ).toBe(0);
    expectMatrixClose(
      inverse([
        [1, 2],
        [3, 4],
      ]) ?? [],
      [
        [-2, 1],
        [1.5, -0.5],
      ],
    );
    const x = solve(A, [8, -11, -3]) ?? [];
    expect(x[0]).toBeCloseTo(2, 12);
    expect(x[1]).toBeCloseTo(3, 12);
    expect(x[2]).toBeCloseTo(-1, 12);
    expect(
      solve(
        [
          [1, 2],
          [2, 4],
        ],
        [1, 2],
      ),
    ).toBeNull();
  });

  it('factors positive definite matrices', () => {
    expectMatrixClose(
      cholesky([
        [4, 2],
        [2, 3],
      ]) ?? [],
      [
        [2, 0],
        [1, Math.SQRT2],
      ],
    );
    expect(
      cholesky([
        [1, 2],
        [2, 1],
      ]),
    ).toBeNull();
  });
});

describe('decompositions', () => {
  const M = [
    [3, 1, 2],
    [1, 4, 0],
    [2, 0, 5],
    [1, 1, 1],
  ];

  it('QR reconstructs the matrix with an orthogonal Q', () => {
    const { q, r } = qr(M);
    expectMatrixClose(multiply(q, r), M);
    expectMatrixClose(multiply(transpose(q), q), identity(4));
    expect(Math.abs(r[2]?.[0] ?? 1)).toBeLessThan(1e-10);
  });

  it('Gram-Schmidt returns an orthonormal basis', () => {
    const basis = gramSchmidt([
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
    ]);
    expectMatrixClose(multiply(basis, transpose(basis)), identity(3));
  });

  it('diagonalizes symmetric matrices', () => {
    const { values, vectors } = eigenSymmetric([
      [2, 1],
      [1, 2],
    ]);
    expect(values[0]).toBeCloseTo(3, 10);
    expect(values[1]).toBeCloseTo(1, 10);
    const v = transpose(vectors)[0] ?? [];
    expect(Math.abs(v[0] ?? 0)).toBeCloseTo(Math.SQRT1_2, 10);
  });

  it('handles general 2x2 eigenproblems including complex ones', () => {
    const real = eigen2x2([
      [2, 0],
      [0, 3],
    ]);
    expect(real.real).toEqual([3, 2]);
    const rotation = eigen2x2([
      [0, -1],
      [1, 0],
    ]);
    expect(rotation.imaginary[0]).toBeCloseTo(1, 12);
    expect(rotation.vectors).toBeNull();
  });

  it('computes the SVD, rank, pseudoinverse and condition number', () => {
    const { u, singularValues, v } = svd(M);
    const sigma = singularValues.map((value, i) =>
      singularValues.map((_, j) => (i === j ? value : 0)),
    );
    expectMatrixClose(multiply(multiply(u, sigma), transpose(v)), M, 8);
    expect(
      rank([
        [1, 2],
        [2, 4],
      ]),
    ).toBe(1);
    const pinv = pseudoInverse(M);
    expectMatrixClose(multiply(multiply(M, pinv), M), M, 8);
    expect(
      conditionNumber([
        [1, 0],
        [0, 100],
      ]),
    ).toBeCloseTo(100, 8);
  });
});
