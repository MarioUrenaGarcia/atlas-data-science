import { describe, expect, it } from 'vitest';
import {
  kronecker,
  lowRankApproximation,
  multiply,
  svd,
  toCompressedRows,
  transpose,
} from '../../../src/lib/linalg/index.ts';
import {
  choleskySteps,
  gaussianElimination,
  luSteps,
  qrSteps,
} from '../../../src/lib/linalg/steps.ts';

const close = (a: number[][], b: number[][]) =>
  a.forEach((row, i) => row.forEach((value, j) => expect(value).toBeCloseTo(b[i]?.[j] ?? NaN, 9)));

describe('gaussianElimination', () => {
  it('reduces an augmented system to its solution', () => {
    const { steps, rank } = gaussianElimination(
      [
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3],
      ],
      { reduced: true, columns: 3 },
    );
    const last = steps.at(-1)?.matrix ?? [];
    expect(rank).toBe(3);
    close(last, [
      [1, 0, 0, 2],
      [0, 1, 0, 3],
      [0, 0, 1, -1],
    ]);
  });

  it('counts pivots to get the rank and swaps rows when a pivot is zero', () => {
    const { steps, rank, pivots } = gaussianElimination([
      [0, 2, 4],
      [1, 1, 1],
      [2, 4, 6],
    ]);
    expect(steps[1]?.operation).toEqual({ kind: 'swap', rows: [0, 1] });
    expect(rank).toBe(2);
    expect(pivots).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it('never uses the augmented column as a pivot column', () => {
    const { rank } = gaussianElimination(
      [
        [1, 1, 2],
        [1, 1, 3],
      ],
      { columns: 2 },
    );
    expect(rank).toBe(1);
  });
});

describe('luSteps', () => {
  it('stores each multiplier in L so that L U = A', () => {
    const a = [
      [2, 1, 1],
      [4, -6, 0],
      [-2, 7, 2],
    ];
    const result = luSteps(a);
    expect(result.ok).toBe(true);
    const last = result.steps.at(-1);
    expect(last?.lower).toEqual([
      [1, 0, 0],
      [2, 1, 0],
      [-1, -1, 1],
    ]);
    close(multiply(last?.lower ?? [], last?.upper ?? []), a);
  });

  it('fails when a row exchange would be needed', () => {
    const result = luSteps([
      [0, 1],
      [1, 1],
    ]);
    expect(result.ok).toBe(false);
  });
});

describe('choleskySteps', () => {
  it('computes L with L Lᵀ = A for a positive definite matrix', () => {
    const a = [
      [4, 12, -16],
      [12, 37, -43],
      [-16, -43, 98],
    ];
    const result = choleskySteps(a);
    expect(result.ok).toBe(true);
    const lower = result.steps.at(-1)?.lower ?? [];
    close(lower, [
      [2, 0, 0],
      [6, 1, 0],
      [-8, 5, 3],
    ]);
    close(multiply(lower, transpose(lower)), a);
  });

  it('stops at the first nonpositive pivot', () => {
    const result = choleskySteps([
      [1, 2],
      [2, 1],
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.failedAt).toBe(1);
      expect(result.partial).toBeCloseTo(-3, 12);
    }
  });
});

describe('qrSteps', () => {
  it('builds orthonormal Q and upper triangular R with Q R = A', () => {
    const a = [
      [3, 2],
      [4, 1],
      [0, 2],
    ];
    const steps = qrSteps(a);
    expect(steps).not.toBeNull();
    const last = steps?.at(-1);
    close(multiply(last?.q ?? [], last?.r ?? []), a);
    close(multiply(transpose(last?.q ?? []), last?.q ?? []), [
      [1, 0],
      [0, 1],
    ]);
    expect(last?.r[1]?.[0]).toBe(0);
    expect(last?.r[0]?.[0]).toBeCloseTo(5, 12);
  });

  it('returns null for dependent columns', () => {
    expect(
      qrSteps([
        [1, 2],
        [2, 4],
      ]),
    ).toBeNull();
  });
});

describe('matrix constructions', () => {
  it('builds the Kronecker product block by block', () => {
    expect(
      kronecker(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [0, 5],
          [6, 7],
        ],
      ),
    ).toEqual([
      [0, 5, 0, 10],
      [6, 7, 12, 14],
      [0, 15, 0, 20],
      [18, 21, 24, 28],
    ]);
  });

  it('stores only nonzero entries in compressed rows', () => {
    expect(
      toCompressedRows([
        [5, 0, 0],
        [0, 0, 3],
        [0, 2, 1],
      ]),
    ).toEqual({ values: [5, 3, 2, 1], columnIndices: [0, 2, 1, 2], rowPointers: [0, 1, 2, 4] });
  });

  it('recovers a rank-1 matrix exactly with one singular value and reduces error with k', () => {
    const outer = [
      [1, 2, 3],
      [2, 4, 6],
    ];
    close(lowRankApproximation(svd(outer), 1), outer);
    const a = [
      [4, 0, 1],
      [0, 3, 0],
      [1, 0, 2],
    ];
    const decomposition = svd(a);
    const error = (k: number) => {
      const approx = lowRankApproximation(decomposition, k);
      return Math.hypot(
        ...a.flatMap((row, i) => row.map((value, j) => value - (approx[i]?.[j] ?? 0))),
      );
    };
    const [, s2 = 0, s3 = 0] = decomposition.singularValues;
    expect(error(1)).toBeCloseTo(Math.hypot(s2, s3), 9);
    expect(error(2)).toBeCloseTo(s3, 9);
    expect(error(3)).toBeCloseTo(0, 9);
  });
});
