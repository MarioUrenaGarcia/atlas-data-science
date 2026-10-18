import { logGamma } from '../distributions/special.ts';
import { Random } from '../random/index.ts';
import { mean, pearson, quantile, standardDeviation } from '../stats/index.ts';
import { leastSquares } from './lifecycle.ts';

export interface FeatureSpec {
  name: string;
  /** How the feature enters the response. */
  role: 'lineal' | 'cuadratica' | 'redundante' | 'ruido' | 'interaccion';
}

export interface SelectionData {
  names: string[];
  roles: FeatureSpec['role'][];
  train: { x: number[][]; y: number[] };
  valid: { x: number[][]; y: number[] };
}

/**
 * Synthetic regression data for feature selection. Linear features enter
 * with decreasing weights, a quadratic feature enters through its square
 * (zero correlation, strong dependence), a redundant feature copies a linear
 * one with noise and the rest are pure noise.
 */
export function selectionData(
  features: readonly FeatureSpec[],
  nTrain: number,
  nValid: number,
  seed: number,
): SelectionData {
  const random = new Random(seed);
  const draw = (n: number) => {
    const x: number[][] = [];
    const y: number[] = [];
    for (let i = 0; i < n; i += 1) {
      const row: number[] = [];
      let response = 0;
      let linearIndex = 0;
      let firstLinear = 0;
      features.forEach((f) => {
        let v = random.normal();
        if (f.role === 'redundante') v = firstLinear + random.normal(0, 0.3);
        if (f.role === 'lineal') {
          if (linearIndex === 0) firstLinear = v;
          response += (3 / (linearIndex + 1)) * v;
          linearIndex += 1;
        }
        if (f.role === 'cuadratica') response -= 1.5 * (v * v - 1);
        row.push(v);
      });
      const inter = features.findIndex((f) => f.role === 'interaccion');
      if (inter >= 0) response += 2 * (row[inter] ?? 0) * (row[0] ?? 0);
      y.push(response + random.normal(0, 1));
      x.push(row);
    }
    return { x, y };
  };
  return {
    names: features.map((f) => f.name),
    roles: features.map((f) => f.role),
    train: draw(nTrain),
    valid: draw(nValid),
  };
}

function column(x: readonly (readonly number[])[], j: number): number[] {
  return x.map((row) => row[j] ?? 0);
}

/** Validation mean squared error of OLS with an intercept on the chosen columns. */
export function validationError(data: SelectionData, chosen: readonly number[]): number {
  const design = (x: readonly (readonly number[])[]) =>
    x.map((row) => [1, ...chosen.map((j) => row[j] ?? 0)]);
  const fit = leastSquares(design(data.train.x), data.train.y);
  if (!fit) return Number.NaN;
  const pred = design(data.valid.x).map((row) =>
    row.reduce((a, v, k) => a + v * (fit.coefficients[k] ?? 0), 0),
  );
  return mean(data.valid.y.map((v, i) => (v - (pred[i] ?? 0)) ** 2));
}

/** Absolute Pearson correlation of each feature with the response, on training data. */
export function correlationScores(data: SelectionData): number[] {
  return data.names.map((_, j) => Math.abs(pearson(column(data.train.x, j), data.train.y)));
}

/**
 * Mutual information estimate (nats) from a two-dimensional histogram with
 * equal-frequency bins on each axis.
 */
export function binnedMutualInformation(
  x: readonly number[],
  y: readonly number[],
  bins: number,
): number {
  const edges = (v: readonly number[]) =>
    Array.from({ length: bins - 1 }, (_, k) => quantile(v, (k + 1) / bins));
  const ex = edges(x);
  const ey = edges(y);
  const bin = (v: number, e: readonly number[]) => e.filter((c) => v > c).length;
  const n = x.length;
  const joint = Array.from({ length: bins }, () => Array.from({ length: bins }, () => 0));
  x.forEach((v, i) => {
    const r = joint[bin(v, ex)];
    if (r) r[bin(y[i] ?? 0, ey)] = (r[bin(y[i] ?? 0, ey)] ?? 0) + 1;
  });
  const px = joint.map((r) => r.reduce((a, b) => a + b, 0) / n);
  const py = Array.from({ length: bins }, (_, c) => joint.reduce((a, r) => a + (r[c] ?? 0), 0) / n);
  let mi = 0;
  joint.forEach((r, a) =>
    r.forEach((count, b) => {
      if (count === 0) return;
      const p = count / n;
      mi += p * Math.log(p / ((px[a] ?? 1) * (py[b] ?? 1)));
    }),
  );
  return mi;
}

export interface SelectionStep {
  /** Features in the model after the step. */
  chosen: number[];
  /** Validation error of every candidate considered in the step (NaN if not considered). */
  candidates: number[];
  error: number;
}

/** Greedy forward selection by validation error, one feature per step. */
export function forwardSelection(data: SelectionData): SelectionStep[] {
  const p = data.names.length;
  const steps: SelectionStep[] = [
    {
      chosen: [],
      candidates: Array.from({ length: p }, () => Number.NaN),
      error: validationError(data, []),
    },
  ];
  let chosen: number[] = [];
  while (chosen.length < p) {
    const candidates = Array.from({ length: p }, (_, j) =>
      chosen.includes(j) ? Number.NaN : validationError(data, [...chosen, j]),
    );
    let best = -1;
    candidates.forEach((v, j) => {
      if (Number.isFinite(v) && (best < 0 || v < (candidates[best] ?? Infinity))) best = j;
    });
    if (best < 0) break;
    chosen = [...chosen, best];
    steps.push({ chosen, candidates, error: candidates[best] ?? Number.NaN });
  }
  return steps;
}

/** Standardized OLS coefficients of the chosen features (training data). */
export function standardizedCoefficients(data: SelectionData, chosen: readonly number[]): number[] {
  const sd = chosen.map((j) => standardDeviation(column(data.train.x, j)) || 1);
  const fit = leastSquares(
    data.train.x.map((row) => [1, ...chosen.map((j, k) => (row[j] ?? 0) / (sd[k] ?? 1))]),
    data.train.y,
  );
  return chosen.map((_, k) => fit?.coefficients[k + 1] ?? 0);
}

/** Recursive feature elimination: refit and drop the smallest standardized coefficient each step. */
export function recursiveElimination(data: SelectionData): SelectionStep[] {
  let chosen = data.names.map((_, j) => j);
  const steps: SelectionStep[] = [];
  while (chosen.length > 0) {
    const coefs = standardizedCoefficients(data, chosen);
    const full = data.names.map((_, j) => {
      const k = chosen.indexOf(j);
      return k >= 0 ? (coefs[k] ?? 0) : Number.NaN;
    });
    steps.push({ chosen, candidates: full, error: validationError(data, chosen) });
    let worst = 0;
    coefs.forEach((c, k) => {
      if (Math.abs(c) < Math.abs(coefs[worst] ?? Infinity)) worst = k;
    });
    chosen = chosen.filter((_, k) => k !== worst);
  }
  steps.push({
    chosen: [],
    candidates: data.names.map(() => Number.NaN),
    error: validationError(data, []),
  });
  return steps;
}

export interface LassoPoint {
  lambda: number;
  coefficients: number[];
}

/**
 * Lasso path by cyclic coordinate descent on standardized features and a
 * centered response, minimizing (1 / 2n) ||y - X b||^2 + lambda ||b||_1,
 * from the smallest lambda that zeroes every coefficient down to a small one.
 */
export function lassoPath(data: SelectionData, points: number): LassoPoint[] {
  const n = data.train.y.length;
  const p = data.names.length;
  const cols = data.names.map((_, j) => {
    const c = column(data.train.x, j);
    const m = mean(c);
    const s = standardDeviation(c, true) || 1;
    return c.map((v) => (v - m) / s);
  });
  const my = mean(data.train.y);
  const y = data.train.y.map((v) => v - my);
  const lambdaMax = Math.max(
    ...cols.map((c) => Math.abs(c.reduce((a, v, i) => a + v * (y[i] ?? 0), 0)) / n),
  );
  const beta = Array.from({ length: p }, () => 0);
  const residual = [...y];
  const path: LassoPoint[] = [];
  for (let k = 0; k < points; k += 1) {
    const lambda = lambdaMax * 10 ** (-2.5 * (k / (points - 1)));
    for (let sweep = 0; sweep < 100; sweep += 1) {
      let change = 0;
      for (let j = 0; j < p; j += 1) {
        const c = cols[j] ?? [];
        const old = beta[j] ?? 0;
        // Partial residual correlation, using that each column has unit variance.
        const rho = c.reduce((a, v, i) => a + v * (residual[i] ?? 0), 0) / n + old;
        const updated = Math.sign(rho) * Math.max(0, Math.abs(rho) - lambda);
        if (updated !== old) {
          c.forEach((v, i) => {
            residual[i] = (residual[i] ?? 0) - v * (updated - old);
          });
          beta[j] = updated;
          change = Math.max(change, Math.abs(updated - old));
        }
      }
      if (change < 1e-8) break;
    }
    path.push({ lambda, coefficients: [...beta] });
  }
  return path;
}

/** Fraction of the unit cube of dimension d inside its inscribed ball of radius 1/2. */
export function inscribedBallFraction(d: number): number {
  return Math.exp((d / 2) * Math.log(Math.PI) - logGamma(d / 2 + 1) + d * Math.log(0.5));
}
