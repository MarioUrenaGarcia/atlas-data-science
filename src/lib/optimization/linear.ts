/**
 * Linear programs in standard inequality form: maximize cᵀx subject to
 * Ax <= b and x >= 0, with b >= 0 so the origin is a feasible starting
 * vertex. The tableau simplex records every vertex it visits.
 */

export interface LinearProgram {
  c: number[];
  a: number[][];
  b: number[];
}

export interface SimplexStep {
  /** Values of the original variables at the current vertex. */
  x: number[];
  value: number;
  /** Names of the basic variables, x1..xn and slacks s1..sm. */
  basis: string[];
  entering: string | null;
  leaving: string | null;
  /** Reduced costs of every variable: positive values can still improve the objective. */
  reducedCosts: number[];
}

export interface SimplexResult {
  steps: SimplexStep[];
  status: 'óptimo' | 'no acotado';
  /** Optimal dual values, one per constraint: the shadow prices. */
  duals: number[];
}

const EPS = 1e-12;

export function simplex(lp: LinearProgram, maxIterations = 50): SimplexResult {
  const m = lp.b.length;
  const n = lp.c.length;
  const names = [...lp.c.map((_, j) => `x${j + 1}`), ...lp.b.map((_, i) => `s${i + 1}`)];
  // Rows: constraints with slack identity; last column is the right-hand side.
  const rows = lp.a.map((row, i) => [...row, ...lp.b.map((_, k) => (k === i ? 1 : 0)), lp.b[i] ?? 0]);
  // Objective row stores -c so that negative entries mark improving columns.
  const objective = [...lp.c.map((v) => -v), ...lp.b.map(() => 0), 0];
  const basis = lp.b.map((_, i) => n + i);
  const snapshot = (entering: string | null, leaving: string | null): SimplexStep => {
    const x = lp.c.map((_, j) => {
      const r = basis.indexOf(j);
      return r >= 0 ? (rows[r]?.[n + m] ?? 0) : 0;
    });
    return {
      x,
      value: objective[n + m] ?? 0,
      basis: basis.map((j) => names[j] ?? ''),
      entering,
      leaving,
      reducedCosts: objective.slice(0, n + m).map((v) => -v),
    };
  };
  const steps = [snapshot(null, null)];
  let status: SimplexResult['status'] = 'óptimo';
  for (let k = 0; k < maxIterations; k += 1) {
    // Dantzig's rule: the most negative entry of the objective row enters.
    let col = -1;
    let most = -EPS;
    objective.slice(0, n + m).forEach((v, j) => {
      if (v < most) {
        most = v;
        col = j;
      }
    });
    if (col < 0) break;
    let row = -1;
    let ratio = Infinity;
    rows.forEach((r, i) => {
      const coefficient = r[col] ?? 0;
      if (coefficient > EPS) {
        const q = (r[n + m] ?? 0) / coefficient;
        if (q < ratio - EPS) {
          ratio = q;
          row = i;
        }
      }
    });
    if (row < 0) {
      status = 'no acotado';
      break;
    }
    const pivotRow = rows[row] as number[];
    const pivot = pivotRow[col] ?? 1;
    for (let j = 0; j < pivotRow.length; j += 1) pivotRow[j] = (pivotRow[j] ?? 0) / pivot;
    const eliminate = (target: number[]) => {
      const factor = target[col] ?? 0;
      for (let j = 0; j < target.length; j += 1) target[j] = (target[j] ?? 0) - factor * (pivotRow[j] ?? 0);
    };
    rows.forEach((r, i) => {
      if (i !== row) eliminate(r);
    });
    eliminate(objective);
    const leaving = names[basis[row] ?? 0] ?? null;
    basis[row] = col;
    steps.push(snapshot(names[col] ?? null, leaving));
  }
  // At the optimum the objective-row entries of the slacks are the dual values.
  const duals = lp.b.map((_, i) => objective[n + i] ?? 0);
  return { steps, status, duals };
}

/** Vertices of {x >= 0, y >= 0, a_i · (x, y) <= b_i}, in counterclockwise order. */
export function feasibleVertices(lp: LinearProgram): [number, number][] {
  const lines: { a: [number, number]; b: number }[] = [
    ...lp.a.map((row, i) => ({ a: [row[0] ?? 0, row[1] ?? 0] as [number, number], b: lp.b[i] ?? 0 })),
    { a: [-1, 0], b: 0 },
    { a: [0, -1], b: 0 },
  ];
  const feasible = ([x, y]: [number, number]) => lines.every(({ a, b }) => a[0] * x + a[1] * y <= b + 1e-9);
  const vertices: [number, number][] = [];
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      const p = lines[i] as { a: [number, number]; b: number };
      const q = lines[j] as { a: [number, number]; b: number };
      const det = p.a[0] * q.a[1] - p.a[1] * q.a[0];
      if (Math.abs(det) < EPS) continue;
      const v: [number, number] = [(p.b * q.a[1] - p.a[1] * q.b) / det, (p.a[0] * q.b - p.b * q.a[0]) / det];
      if (feasible(v) && !vertices.some((w) => Math.hypot(w[0] - v[0], w[1] - v[1]) < 1e-9)) vertices.push(v);
    }
  }
  const cx = vertices.reduce((s, v) => s + v[0], 0) / vertices.length;
  const cy = vertices.reduce((s, v) => s + v[1], 0) / vertices.length;
  return vertices.sort((u, v) => Math.atan2(u[1] - cy, u[0] - cx) - Math.atan2(v[1] - cy, v[0] - cx));
}

/**
 * Lagrange dual of projecting a target t onto a half-plane aᵀx <= c:
 * minimize 1/2 |x - t|² subject to aᵀx <= c. The dual function is
 * g(μ) = μ(aᵀt - c) - μ²|a|²/2 for μ >= 0, concave, and its maximum equals
 * the primal optimum (strong duality).
 */
export function projectionDual(t: [number, number], a: [number, number], c: number) {
  const excess = a[0] * t[0] + a[1] * t[1] - c;
  const norm2 = a[0] * a[0] + a[1] * a[1];
  const g = (mu: number) => mu * excess - (mu * mu * norm2) / 2;
  const muStar = Math.max(0, excess / norm2);
  const primal = excess > 0 ? (excess * excess) / (2 * norm2) : 0;
  return { g, muStar, primal, dualOptimum: g(muStar) };
}
