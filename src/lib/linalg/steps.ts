import { clone, identity, zeros, type Matrix } from './index.ts';

/** Values closer to zero than this are treated as exact zeros during elimination. */
const TOLERANCE = 1e-10;

export type RowOperation =
  | { kind: 'swap'; rows: [number, number] }
  | { kind: 'scale'; row: number; factor: number }
  | { kind: 'add'; target: number; source: number; factor: number };

export interface EliminationStep {
  /** Matrix after the operation. */
  matrix: Matrix;
  operation: RowOperation | null;
  /** Pivot position in use, row and column. */
  pivot: [number, number] | null;
  /** Rows changed by the operation. */
  changed: number[];
}

export interface EliminationResult {
  steps: EliminationStep[];
  /** Pivot positions of the final echelon form. */
  pivots: [number, number][];
  rank: number;
}

const snap = (value: number) => (Math.abs(value) < TOLERANCE ? 0 : value);

function applyOperation(matrix: Matrix, operation: RowOperation): Matrix {
  const next = clone(matrix);
  if (operation.kind === 'swap') {
    const [a, b] = operation.rows;
    [next[a], next[b]] = [next[b] as number[], next[a] as number[]];
  } else if (operation.kind === 'scale') {
    next[operation.row] = (next[operation.row] ?? []).map((value) =>
      snap(value * operation.factor),
    );
  } else {
    const source = next[operation.source] ?? [];
    next[operation.target] = (next[operation.target] ?? []).map((value, j) =>
      snap(value + operation.factor * (source[j] ?? 0)),
    );
  }
  return next;
}

/**
 * Gaussian elimination recorded one row operation at a time. The pivot of
 * each column is the first nonzero entry at or below the current row (the
 * choice made by hand, which keeps small integer examples readable). With
 * `reduced` the pivots are scaled to 1 and cleared above as well, giving the
 * reduced row echelon form. `columns` limits the pivot search, so the last
 * column of an augmented matrix is never used as a pivot column.
 */
export function gaussianElimination(
  input: Matrix,
  { reduced = false, columns }: { reduced?: boolean; columns?: number } = {},
): EliminationResult {
  let matrix = clone(input).map((row) => row.map(snap));
  const steps: EliminationStep[] = [{ matrix, operation: null, pivot: null, changed: [] }];
  const record = (operation: RowOperation, pivot: [number, number], changed: number[]) => {
    matrix = applyOperation(matrix, operation);
    steps.push({ matrix, operation, pivot, changed });
  };
  const rows = matrix.length;
  const pivotColumns = Math.min(columns ?? matrix[0]?.length ?? 0, matrix[0]?.length ?? 0);
  const pivots: [number, number][] = [];
  let row = 0;
  for (let column = 0; column < pivotColumns && row < rows; column += 1) {
    let pivotRow = -1;
    for (let i = row; i < rows; i += 1) {
      if (Math.abs(matrix[i]?.[column] ?? 0) > TOLERANCE) {
        pivotRow = i;
        break;
      }
    }
    if (pivotRow < 0) continue;
    const pivot: [number, number] = [row, column];
    if (pivotRow !== row) record({ kind: 'swap', rows: [row, pivotRow] }, pivot, [row, pivotRow]);
    if (reduced) {
      const value = matrix[row]?.[column] ?? 1;
      if (Math.abs(value - 1) > TOLERANCE)
        record({ kind: 'scale', row, factor: 1 / value }, pivot, [row]);
    }
    for (let i = reduced ? 0 : row + 1; i < rows; i += 1) {
      if (i === row) continue;
      const value = matrix[i]?.[column] ?? 0;
      if (Math.abs(value) <= TOLERANCE) continue;
      const factor = -value / (matrix[row]?.[column] ?? 1);
      record({ kind: 'add', target: i, source: row, factor }, pivot, [i]);
    }
    pivots.push(pivot);
    row += 1;
  }
  return { steps, pivots, rank: pivots.length };
}

export interface LuStep {
  lower: Matrix;
  upper: Matrix;
  /** Entry of L filled in this step, if any. */
  filled: [number, number] | null;
  operation: RowOperation | null;
  pivot: [number, number] | null;
}

export type LuResult =
  { ok: true; steps: LuStep[] } | { ok: false; steps: LuStep[]; zeroPivot: number };

/**
 * Doolittle LU without row exchanges: each elimination R_i <- R_i - m R_k
 * applied to U stores the multiplier m in position (i, k) of L. Fails when a
 * zero pivot appears, which is exactly when a row exchange would be needed.
 */
export function luSteps(input: Matrix): LuResult {
  const n = input.length;
  let upper = clone(input).map((row) => row.map(snap));
  let lower = identity(n);
  const steps: LuStep[] = [{ lower, upper, filled: null, operation: null, pivot: null }];
  for (let k = 0; k < n; k += 1) {
    const pivotValue = upper[k]?.[k] ?? 0;
    if (Math.abs(pivotValue) <= TOLERANCE) {
      // A zero in the last pivot only means U is singular; earlier it blocks the elimination.
      if (k < n - 1) return { ok: false, steps, zeroPivot: k };
      continue;
    }
    for (let i = k + 1; i < n; i += 1) {
      const multiplier = (upper[i]?.[k] ?? 0) / pivotValue;
      const operation: RowOperation = { kind: 'add', target: i, source: k, factor: -multiplier };
      upper = applyOperation(upper, operation);
      lower = clone(lower);
      (lower[i] as number[])[k] = multiplier;
      steps.push({ lower, upper, filled: [i, k], operation, pivot: [k, k] });
    }
  }
  return { ok: true, steps };
}

export interface CholeskyStep {
  lower: Matrix;
  /** Entry computed in this step. */
  entry: [number, number] | null;
  /** Value under the square root for diagonal entries, or the numerator for the others. */
  partial: number;
}

export type CholeskyResult =
  | { ok: true; steps: CholeskyStep[] }
  | { ok: false; steps: CholeskyStep[]; failedAt: number; partial: number };

/**
 * Cholesky factor L of A = L Lᵀ computed row by row. Diagonal entries are
 * square roots of what is left of a_ii; when that value is not positive the
 * matrix is not positive definite and the process stops there.
 */
export function choleskySteps(input: Matrix): CholeskyResult {
  const n = input.length;
  let lower = zeros(n, n);
  const steps: CholeskyStep[] = [{ lower, entry: null, partial: 0 }];
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let total = input[i]?.[j] ?? 0;
      for (let k = 0; k < j; k += 1) total -= (lower[i]?.[k] ?? 0) * (lower[j]?.[k] ?? 0);
      total = snap(total);
      if (i === j && total <= TOLERANCE) return { ok: false, steps, failedAt: i, partial: total };
      lower = clone(lower);
      (lower[i] as number[])[j] = i === j ? Math.sqrt(total) : total / (lower[j]?.[j] ?? 1);
      steps.push({ lower, entry: [i, j], partial: total });
    }
  }
  return { ok: true, steps };
}

export interface QrStep {
  q: Matrix;
  r: Matrix;
  /** Column of A being orthogonalized. */
  column: number;
  /** Entry of R computed in this step. */
  entry: [number, number];
}

/**
 * Thin QR by classical Gram-Schmidt, one entry of R at a time: r_ij = q_iᵀ a_j
 * for i < j, then r_jj is the length of what remains and q_j that remainder
 * normalized. Returns null when the columns are linearly dependent.
 */
export function qrSteps(input: Matrix): QrStep[] | null {
  const rows = input.length;
  const columns = input[0]?.length ?? 0;
  let q = zeros(rows, columns);
  let r = zeros(columns, columns);
  const steps: QrStep[] = [];
  for (let j = 0; j < columns; j += 1) {
    const remainder = input.map((row) => row[j] ?? 0);
    for (let i = 0; i < j; i += 1) {
      const value = snap(
        input.reduce((total, row, k) => total + (q[k]?.[i] ?? 0) * (row[j] ?? 0), 0),
      );
      for (let k = 0; k < rows; k += 1)
        remainder[k] = (remainder[k] ?? 0) - value * (q[k]?.[i] ?? 0);
      r = clone(r);
      (r[i] as number[])[j] = value;
      steps.push({ q, r, column: j, entry: [i, j] });
    }
    const length = Math.hypot(...remainder);
    if (length <= TOLERANCE) return null;
    r = clone(r);
    (r[j] as number[])[j] = length;
    q = clone(q);
    for (let k = 0; k < rows; k += 1) (q[k] as number[])[j] = snap((remainder[k] ?? 0) / length);
    steps.push({ q, r, column: j, entry: [j, j] });
  }
  return steps;
}
