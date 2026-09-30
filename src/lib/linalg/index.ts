/**
 * Dense linear algebra for the small matrices used in visualizations
 * (usually 2x2 to 10x10). Matrices are arrays of rows.
 */

export type Vector = number[];
export type Matrix = number[][];

const EPSILON = 1e-12;

export function zeros(rows: number, columns: number): Matrix {
  return Array.from({ length: rows }, () => new Array<number>(columns).fill(0));
}

export function identity(size: number): Matrix {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0)),
  );
}

export function clone(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

function at(matrix: Matrix, i: number, j: number): number {
  return matrix[i]?.[j] ?? 0;
}

export function shape(matrix: Matrix): [number, number] {
  return [matrix.length, matrix[0]?.length ?? 0];
}

export function transpose(matrix: Matrix): Matrix {
  const [rows, columns] = shape(matrix);
  return Array.from({ length: columns }, (_, j) =>
    Array.from({ length: rows }, (_, i) => at(matrix, i, j)),
  );
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  const [rows, inner] = shape(a);
  const [, columns] = shape(b);
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: columns }, (_, j) => {
      let total = 0;
      for (let k = 0; k < inner; k += 1) total += at(a, i, k) * at(b, k, j);
      return total;
    }),
  );
}

export function multiplyVector(matrix: Matrix, vector: Vector): Vector {
  return matrix.map((row) => row.reduce((total, value, j) => total + value * (vector[j] ?? 0), 0));
}

export function add(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((value, j) => value + at(b, i, j)));
}

export function scale(matrix: Matrix, factor: number): Matrix {
  return matrix.map((row) => row.map((value) => value * factor));
}

export function dot(a: Vector, b: Vector): number {
  return a.reduce((total, value, i) => total + value * (b[i] ?? 0), 0);
}

export function norm(vector: Vector, p = 2): number {
  if (p === Number.POSITIVE_INFINITY) return Math.max(...vector.map(Math.abs));
  if (p === 1) return vector.reduce((total, value) => total + Math.abs(value), 0);
  if (p === 2) return Math.sqrt(dot(vector, vector));
  return vector.reduce((total, value) => total + Math.abs(value) ** p, 0) ** (1 / p);
}

export function trace(matrix: Matrix): number {
  return matrix.reduce((total, row, i) => total + (row[i] ?? 0), 0);
}

export function frobeniusNorm(matrix: Matrix): number {
  return Math.sqrt(matrix.reduce((total, row) => total + dot(row, row), 0));
}

export interface LuDecomposition {
  /** Unit lower triangular factor. */
  lower: Matrix;
  upper: Matrix;
  /** Row permutation: row i of P A is row permutation[i] of A. */
  permutation: number[];
  /** +1 or -1, the sign of the permutation. */
  sign: number;
  singular: boolean;
}

/** LU decomposition with partial pivoting, P A = L U. */
export function lu(matrix: Matrix): LuDecomposition {
  const n = matrix.length;
  const a = clone(matrix);
  const permutation = Array.from({ length: n }, (_, i) => i);
  let sign = 1;
  let singular = false;
  for (let k = 0; k < n; k += 1) {
    let pivot = k;
    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(at(a, i, k)) > Math.abs(at(a, pivot, k))) pivot = i;
    }
    if (Math.abs(at(a, pivot, k)) < EPSILON) {
      singular = true;
      continue;
    }
    if (pivot !== k) {
      [a[k], a[pivot]] = [a[pivot] as number[], a[k] as number[]];
      [permutation[k], permutation[pivot]] = [
        permutation[pivot] as number,
        permutation[k] as number,
      ];
      sign = -sign;
    }
    for (let i = k + 1; i < n; i += 1) {
      const factor = at(a, i, k) / at(a, k, k);
      const row = a[i] as number[];
      row[k] = factor;
      for (let j = k + 1; j < n; j += 1) row[j] = (row[j] ?? 0) - factor * at(a, k, j);
    }
  }
  const lower = identity(n);
  const upper = zeros(n, n);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (j < i) (lower[i] as number[])[j] = at(a, i, j);
      else (upper[i] as number[])[j] = at(a, i, j);
    }
  }
  return { lower, upper, permutation, sign, singular };
}

export function determinant(matrix: Matrix): number {
  const { upper, sign, singular } = lu(matrix);
  if (singular) return 0;
  return upper.reduce((product, row, i) => product * (row[i] ?? 0), sign);
}

/** Solves A x = b; returns null when A is singular. */
export function solve(matrix: Matrix, b: Vector): Vector | null {
  const { lower, upper, permutation, singular } = lu(matrix);
  if (singular) return null;
  const n = matrix.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    let value = b[permutation[i] ?? 0] ?? 0;
    for (let j = 0; j < i; j += 1) value -= at(lower, i, j) * (y[j] ?? 0);
    y[i] = value;
  }
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let value = y[i] ?? 0;
    for (let j = i + 1; j < n; j += 1) value -= at(upper, i, j) * (x[j] ?? 0);
    x[i] = value / at(upper, i, i);
  }
  return x;
}

export function inverse(matrix: Matrix): Matrix | null {
  const n = matrix.length;
  const columns: Vector[] = [];
  for (let j = 0; j < n; j += 1) {
    const e = Array.from({ length: n }, (_, i) => (i === j ? 1 : 0));
    const column = solve(matrix, e);
    if (!column) return null;
    columns.push(column);
  }
  return transpose(columns);
}

/** Cholesky factor L with A = L L^T; returns null if A is not positive definite. */
export function cholesky(matrix: Matrix): Matrix | null {
  const n = matrix.length;
  const lower = zeros(n, n);
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let total = at(matrix, i, j);
      for (let k = 0; k < j; k += 1) total -= at(lower, i, k) * at(lower, j, k);
      if (i === j) {
        if (total <= EPSILON) return null;
        (lower[i] as number[])[j] = Math.sqrt(total);
      } else {
        (lower[i] as number[])[j] = total / at(lower, j, j);
      }
    }
  }
  return lower;
}

/** QR decomposition by Householder reflections: A = Q R with Q orthogonal. */
export function qr(matrix: Matrix): { q: Matrix; r: Matrix } {
  const [m, n] = shape(matrix);
  const r = clone(matrix);
  let q = identity(m);
  for (let k = 0; k < Math.min(m - 1, n); k += 1) {
    const x = Array.from({ length: m - k }, (_, i) => at(r, k + i, k));
    const alpha = -Math.sign(x[0] || 1) * norm(x);
    const v = [...x];
    v[0] = (v[0] ?? 0) - alpha;
    const vNorm = norm(v);
    if (vNorm < EPSILON) continue;
    const u = v.map((value) => value / vNorm);
    // Apply H = I - 2 u u^T to the trailing block of R and accumulate Q = Q H.
    for (let j = 0; j < n; j += 1) {
      let projection = 0;
      for (let i = 0; i < u.length; i += 1) projection += (u[i] ?? 0) * at(r, k + i, j);
      for (let i = 0; i < u.length; i += 1)
        (r[k + i] as number[])[j] = at(r, k + i, j) - 2 * (u[i] ?? 0) * projection;
    }
    const nextQ = clone(q);
    for (let i = 0; i < m; i += 1) {
      let projection = 0;
      for (let l = 0; l < u.length; l += 1) projection += at(q, i, k + l) * (u[l] ?? 0);
      for (let l = 0; l < u.length; l += 1)
        (nextQ[i] as number[])[k + l] = at(q, i, k + l) - 2 * projection * (u[l] ?? 0);
    }
    q = nextQ;
  }
  return { q, r };
}

/** Classical Gram-Schmidt on the columns of A, returning the orthonormal columns. */
export function gramSchmidt(columns: Vector[]): Vector[] {
  const basis: Vector[] = [];
  for (const column of columns) {
    let v = [...column];
    for (const q of basis) {
      const projection = dot(column, q);
      v = v.map((value, i) => value - projection * (q[i] ?? 0));
    }
    const length = norm(v);
    if (length > EPSILON) basis.push(v.map((value) => value / length));
  }
  return basis;
}

export interface Eigen {
  values: number[];
  /** Eigenvectors as columns of the returned matrix, in the same order as the values. */
  vectors: Matrix;
}

/**
 * Eigen decomposition of a symmetric matrix by the cyclic Jacobi method.
 * Values are sorted in decreasing order.
 */
export function eigenSymmetric(matrix: Matrix, maxSweeps = 100): Eigen {
  const n = matrix.length;
  const a = clone(matrix);
  const v = identity(n);
  for (let sweep = 0; sweep < maxSweeps; sweep += 1) {
    let offDiagonal = 0;
    for (let i = 0; i < n; i += 1)
      for (let j = i + 1; j < n; j += 1) offDiagonal += at(a, i, j) ** 2;
    if (offDiagonal < 1e-22) break;
    for (let p = 0; p < n; p += 1) {
      for (let q = p + 1; q < n; q += 1) {
        const apq = at(a, p, q);
        if (Math.abs(apq) < 1e-300) continue;
        const theta = (at(a, q, q) - at(a, p, p)) / (2 * apq);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k += 1) {
          const akp = at(a, k, p);
          const akq = at(a, k, q);
          (a[k] as number[])[p] = c * akp - s * akq;
          (a[k] as number[])[q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k += 1) {
          const apk = at(a, p, k);
          const aqk = at(a, q, k);
          (a[p] as number[])[k] = c * apk - s * aqk;
          (a[q] as number[])[k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k += 1) {
          const vkp = at(v, k, p);
          const vkq = at(v, k, q);
          (v[k] as number[])[p] = c * vkp - s * vkq;
          (v[k] as number[])[q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => at(a, j, j) - at(a, i, i));
  return {
    values: order.map((i) => at(a, i, i)),
    vectors: v.map((row) => order.map((i) => row[i] ?? 0)),
  };
}

export interface Eigen2x2 {
  /** Real parts of the eigenvalues. */
  real: [number, number];
  /** Imaginary parts; zero when the eigenvalues are real. */
  imaginary: [number, number];
  /** Real eigenvectors when they exist. */
  vectors: [Vector, Vector] | null;
}

/** Closed-form eigenvalues and eigenvectors of a general 2x2 matrix. */
export function eigen2x2(matrix: Matrix): Eigen2x2 {
  const a = at(matrix, 0, 0);
  const b = at(matrix, 0, 1);
  const c = at(matrix, 1, 0);
  const d = at(matrix, 1, 1);
  const tr = a + d;
  const det = a * d - b * c;
  const discriminant = (tr * tr) / 4 - det;
  if (discriminant < 0) {
    const im = Math.sqrt(-discriminant);
    return { real: [tr / 2, tr / 2], imaginary: [im, -im], vectors: null };
  }
  const root = Math.sqrt(discriminant);
  const l1 = tr / 2 + root;
  const l2 = tr / 2 - root;
  const vectorFor = (lambda: number): Vector => {
    let v: Vector;
    if (Math.abs(b) > EPSILON) v = [b, lambda - a];
    else if (Math.abs(c) > EPSILON) v = [lambda - d, c];
    else v = Math.abs(lambda - a) < Math.abs(lambda - d) ? [1, 0] : [0, 1];
    const length = norm(v);
    return v.map((value) => value / length);
  };
  const v1 = vectorFor(l1);
  let v2 = vectorFor(l2);
  // For repeated eigenvalues of a diagonal matrix, return two independent vectors.
  if (Math.abs(l1 - l2) < EPSILON && Math.abs(b) < EPSILON && Math.abs(c) < EPSILON) v2 = [0, 1];
  return { real: [l1, l2], imaginary: [0, 0], vectors: [v1, v2] };
}

export interface Svd {
  u: Matrix;
  singularValues: number[];
  v: Matrix;
}

/** Thin singular value decomposition A = U diag(s) V^T via the eigen decomposition of A^T A. */
export function svd(matrix: Matrix): Svd {
  const at_ = transpose(matrix);
  const { values, vectors } = eigenSymmetric(multiply(at_, matrix));
  const singularValues = values.map((value) => Math.sqrt(Math.max(0, value)));
  const v = vectors;
  const [m] = shape(matrix);
  const vColumns = transpose(v);
  const uColumns = vColumns.map((column, index) => {
    const sigma = singularValues[index] ?? 0;
    if (sigma < 1e-10) return new Array<number>(m).fill(0);
    return multiplyVector(matrix, column).map((value) => value / sigma);
  });
  return { u: transpose(uColumns), singularValues, v };
}

export function rank(matrix: Matrix, tolerance = 1e-9): number {
  const { singularValues } = svd(matrix);
  const largest = singularValues[0] ?? 0;
  return singularValues.filter((value) => value > tolerance * Math.max(1, largest)).length;
}

/** Moore-Penrose pseudoinverse through the SVD. */
export function pseudoInverse(matrix: Matrix, tolerance = 1e-10): Matrix {
  const { u, singularValues, v } = svd(matrix);
  const [m, n] = shape(matrix);
  const result = zeros(n, m);
  singularValues.forEach((sigma, k) => {
    if (sigma <= tolerance) return;
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < m; j += 1) {
        (result[i] as number[])[j] = at(result, i, j) + (at(v, i, k) * at(u, j, k)) / sigma;
      }
    }
  });
  return result;
}

/** Orthogonal projection of b onto the column space of A. */
export function projectOntoColumns(matrix: Matrix, b: Vector): Vector {
  const pinv = pseudoInverse(matrix);
  return multiplyVector(matrix, multiplyVector(pinv, b));
}

/** Condition number in the 2-norm, the ratio of extreme singular values. */
export function conditionNumber(matrix: Matrix): number {
  const { singularValues } = svd(matrix);
  const smallest = singularValues[singularValues.length - 1] ?? 0;
  return smallest === 0 ? Number.POSITIVE_INFINITY : (singularValues[0] ?? 0) / smallest;
}

/** Best rank-k approximation in Frobenius and spectral norm: the first k terms of the SVD. */
export function lowRankApproximation(decomposition: Svd, k: number): Matrix {
  const { u, singularValues, v } = decomposition;
  const m = u.length;
  const n = v.length;
  const result = zeros(m, n);
  for (let l = 0; l < Math.min(k, singularValues.length); l += 1) {
    const sigma = singularValues[l] ?? 0;
    for (let i = 0; i < m; i += 1) {
      const scaled = sigma * at(u, i, l);
      if (scaled === 0) continue;
      const row = result[i] as number[];
      for (let j = 0; j < n; j += 1) row[j] = (row[j] ?? 0) + scaled * at(v, j, l);
    }
  }
  return result;
}

/** Kronecker product: the block matrix whose block (i, j) is a_ij B. */
export function kronecker(a: Matrix, b: Matrix): Matrix {
  const [p, q] = shape(a);
  const [r, s] = shape(b);
  return Array.from({ length: p * r }, (_, row) =>
    Array.from(
      { length: q * s },
      (_, column) =>
        at(a, Math.floor(row / r), Math.floor(column / s)) * at(b, row % r, column % s),
    ),
  );
}

export interface CompressedRows {
  values: number[];
  columnIndices: number[];
  /** Start of each row in values, plus the total count at the end. */
  rowPointers: number[];
}

/** Compressed sparse row storage: only the nonzero entries and where they are. */
export function toCompressedRows(matrix: Matrix): CompressedRows {
  const values: number[] = [];
  const columnIndices: number[] = [];
  const rowPointers = [0];
  for (const row of matrix) {
    row.forEach((value, j) => {
      if (value !== 0) {
        values.push(value);
        columnIndices.push(j);
      }
    });
    rowPointers.push(values.length);
  }
  return { values, columnIndices, rowPointers };
}
