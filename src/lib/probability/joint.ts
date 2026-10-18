/**
 * Joint distributions of two random variables with finitely many value pairs:
 * tables built from sample spaces or by discretizing a joint density, and the
 * quantities derived from them (marginals, conditionals, covariance,
 * correlation, conditional expectation and variance, and the distribution of
 * the sum).
 */
import { makePmf, type FinitePmf } from './randomVariable.ts';
import { experiment, type ExperimentId, type Outcome } from './sampleSpace.ts';

export interface JointPmf {
  /** Values of X in increasing order (cell centers for discretized densities). */
  xs: number[];
  /** Values of Y in increasing order. */
  ys: number[];
  /** p[i][j] = P(X = xs[i], Y = ys[j]); all entries add up to one. */
  p: number[][];
}

/** Builds a joint table from raw non-negative weights, normalizing them to add up to one. */
export function makeJoint(
  xs: readonly number[],
  ys: readonly number[],
  weights: readonly (readonly number[])[],
): JointPmf {
  const total = weights.reduce(
    (sum, row) => sum + row.reduce((rowSum, value) => rowSum + Math.max(0, value), 0),
    0,
  );
  return {
    xs: [...xs],
    ys: [...ys],
    p: xs.map((_, i) =>
      ys.map((_, j) => (total > 0 ? Math.max(0, weights[i]?.[j] ?? 0) / total : 0)),
    ),
  };
}

/** Joint table of two variables defined on the same equally likely sample space. */
export function jointFromExperiment(
  id: ExperimentId,
  mapX: (outcome: Outcome) => number,
  mapY: (outcome: Outcome) => number,
): JointPmf {
  const outcomes = experiment(id).outcomes;
  const xs = [...new Set(outcomes.map(mapX))].sort((a, b) => a - b);
  const ys = [...new Set(outcomes.map(mapY))].sort((a, b) => a - b);
  const counts = xs.map(() => ys.map(() => 0));
  for (const outcome of outcomes) {
    const row = counts[xs.indexOf(mapX(outcome))];
    const j = ys.indexOf(mapY(outcome));
    if (row) row[j] = (row[j] ?? 0) + 1;
  }
  return makeJoint(xs, ys, counts);
}

/** P(X = xs[i], Y = ys[j]), zero outside the table. */
export function cell(joint: JointPmf, i: number, j: number): number {
  return joint.p[i]?.[j] ?? 0;
}

export function marginalX(joint: JointPmf): FinitePmf {
  return {
    values: [...joint.xs],
    probs: joint.xs.map((_, i) => (joint.p[i] ?? []).reduce((a, b) => a + b, 0)),
  };
}

export function marginalY(joint: JointPmf): FinitePmf {
  return {
    values: [...joint.ys],
    probs: joint.ys.map((_, j) => joint.xs.reduce((sum, _x, i) => sum + cell(joint, i, j), 0)),
  };
}

/** Distribution of Y given X = xs[i]; null when that value has probability zero. */
export function conditionalYGivenX(joint: JointPmf, i: number): FinitePmf | null {
  const row = joint.p[i] ?? [];
  const total = row.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  return { values: [...joint.ys], probs: row.map((value) => value / total) };
}

/** Distribution of X given Y = ys[j]; null when that value has probability zero. */
export function conditionalXGivenY(joint: JointPmf, j: number): FinitePmf | null {
  const column = joint.xs.map((_, i) => cell(joint, i, j));
  const total = column.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  return { values: [...joint.xs], probs: column.map((value) => value / total) };
}

/** E[g(X, Y)] by summing over the table. */
export function jointExpectation(joint: JointPmf, g: (x: number, y: number) => number): number {
  let total = 0;
  joint.xs.forEach((x, i) =>
    joint.ys.forEach((y, j) => {
      total += g(x, y) * cell(joint, i, j);
    }),
  );
  return total;
}

export interface JointSummary {
  meanX: number;
  meanY: number;
  varX: number;
  varY: number;
  covariance: number;
  /** Pearson correlation; zero when either variance is zero. */
  correlation: number;
}

export function summarizeJoint(joint: JointPmf): JointSummary {
  const meanX = jointExpectation(joint, (x) => x);
  const meanY = jointExpectation(joint, (_x, y) => y);
  const varX = jointExpectation(joint, (x) => (x - meanX) ** 2);
  const varY = jointExpectation(joint, (_x, y) => (y - meanY) ** 2);
  const covariance = jointExpectation(joint, (x, y) => (x - meanX) * (y - meanY));
  const scale = Math.sqrt(varX * varY);
  return {
    meanX,
    meanY,
    varX,
    varY,
    covariance,
    correlation: scale > 0 ? covariance / scale : 0,
  };
}

/** Table with the same marginals as `joint` but independent coordinates. */
export function productOfMarginals(joint: JointPmf): JointPmf {
  const px = marginalX(joint).probs;
  const py = marginalY(joint).probs;
  return {
    xs: [...joint.xs],
    ys: [...joint.ys],
    p: px.map((a) => py.map((b) => a * b)),
  };
}

/** Largest gap between the joint table and the product of its marginals; zero under independence. */
export function dependenceGap(joint: JointPmf): number {
  const product = productOfMarginals(joint);
  let gap = 0;
  joint.xs.forEach((_x, i) =>
    joint.ys.forEach((_y, j) => {
      gap = Math.max(gap, Math.abs(cell(joint, i, j) - cell(product, i, j)));
    }),
  );
  return gap;
}

/** P(X <= x, Y <= y). */
export function jointCdf(joint: JointPmf, x: number, y: number): number {
  let total = 0;
  joint.xs.forEach((xi, i) => {
    if (xi > x) return;
    joint.ys.forEach((yj, j) => {
      if (yj <= y) total += cell(joint, i, j);
    });
  });
  return total;
}

export interface ConditionalSummary {
  x: number;
  /** P(X = x). */
  weight: number;
  /** E[Y | X = x]. */
  mean: number;
  /** Var(Y | X = x). */
  variance: number;
}

/** E[Y | X = x] and Var(Y | X = x) for every value of X with positive probability. */
export function conditionalSummaries(joint: JointPmf): ConditionalSummary[] {
  const result: ConditionalSummary[] = [];
  joint.xs.forEach((x, i) => {
    const conditional = conditionalYGivenX(joint, i);
    if (!conditional) return;
    const weight = (joint.p[i] ?? []).reduce((a, b) => a + b, 0);
    const mean = conditional.values.reduce((sum, y, j) => sum + y * (conditional.probs[j] ?? 0), 0);
    const variance = conditional.values.reduce(
      (sum, y, j) => sum + (y - mean) ** 2 * (conditional.probs[j] ?? 0),
      0,
    );
    result.push({ x, weight, mean, variance });
  });
  return result;
}

export interface VarianceDecomposition {
  /** Var(E[Y | X]): variability explained by X. */
  explained: number;
  /** E[Var(Y | X)]: variability left within each value of X. */
  unexplained: number;
  /** Var(Y) = explained + unexplained. */
  total: number;
}

/** Law of total variance computed from the table. */
export function varianceDecomposition(joint: JointPmf): VarianceDecomposition {
  const rows = conditionalSummaries(joint);
  const meanY = rows.reduce((sum, row) => sum + row.weight * row.mean, 0);
  const explained = rows.reduce((sum, row) => sum + row.weight * (row.mean - meanY) ** 2, 0);
  const unexplained = rows.reduce((sum, row) => sum + row.weight * row.variance, 0);
  return { explained, unexplained, total: explained + unexplained };
}

/** Distribution of a function of the pair, such as the sum X + Y. */
export function distributionOf(joint: JointPmf, h: (x: number, y: number) => number): FinitePmf {
  const values: number[] = [];
  const probs: number[] = [];
  joint.xs.forEach((x, i) =>
    joint.ys.forEach((y, j) => {
      const p = cell(joint, i, j);
      if (p <= 0) return;
      // Rounding merges values such as 0.1 + 0.2 and 0.3 that differ only by floating point error.
      values.push(Math.round(h(x, y) * 1e9) / 1e9);
      probs.push(p);
    }),
  );
  return makePmf(values, probs);
}

/**
 * Discretizes a joint density on an n by n grid of cells over the given
 * window: each cell receives the density at its center times its area, and
 * the table is renormalized so the mass outside the window is spread evenly.
 */
export function discretizeDensity(
  density: (x: number, y: number) => number,
  xWindow: readonly [number, number],
  yWindow: readonly [number, number],
  n: number,
): JointPmf {
  const [x0, x1] = xWindow;
  const [y0, y1] = yWindow;
  const dx = (x1 - x0) / n;
  const dy = (y1 - y0) / n;
  const xs = Array.from({ length: n }, (_, i) => x0 + (i + 0.5) * dx);
  const ys = Array.from({ length: n }, (_, j) => y0 + (j + 0.5) * dy);
  const weights = xs.map((x) =>
    ys.map((y) => {
      const value = density(x, y);
      return Number.isFinite(value) ? value * dx * dy : 0;
    }),
  );
  return makeJoint(xs, ys, weights);
}

export interface BivariateNormalParameters {
  muX: number;
  muY: number;
  sigmaX: number;
  sigmaY: number;
  /** Correlation, strictly between -1 and 1. */
  rho: number;
}

export function bivariateNormalDensity({
  muX,
  muY,
  sigmaX,
  sigmaY,
  rho,
}: BivariateNormalParameters): (x: number, y: number) => number {
  const r = Math.max(-0.999, Math.min(0.999, rho));
  const norm = 1 / (2 * Math.PI * sigmaX * sigmaY * Math.sqrt(1 - r * r));
  return (x, y) => {
    const zx = (x - muX) / sigmaX;
    const zy = (y - muY) / sigmaY;
    return norm * Math.exp(-(zx * zx - 2 * r * zx * zy + zy * zy) / (2 * (1 - r * r)));
  };
}

export interface CovarianceAxes {
  /** Eigenvalues of the covariance matrix, largest first. */
  values: [number, number];
  /** Unit eigenvectors, same order. */
  vectors: [[number, number], [number, number]];
}

/** Eigen-decomposition of a 2 by 2 covariance matrix [[a, b], [b, c]]: the axes of its ellipses. */
export function covarianceAxes(a: number, b: number, c: number): CovarianceAxes {
  const mean = (a + c) / 2;
  const radius = Math.sqrt(((a - c) / 2) ** 2 + b * b);
  const l1 = mean + radius;
  const l2 = mean - radius;
  // For a diagonal matrix the axes are the coordinate axes, in order of decreasing variance.
  if (Math.abs(b) < 1e-12) {
    return a >= c
      ? {
          values: [a, c],
          vectors: [
            [1, 0],
            [0, 1],
          ],
        }
      : {
          values: [c, a],
          vectors: [
            [0, 1],
            [1, 0],
          ],
        };
  }
  const v1: [number, number] = [b, l1 - a];
  const n1 = Math.hypot(v1[0], v1[1]);
  const u1: [number, number] = [v1[0] / n1, v1[1] / n1];
  return { values: [l1, l2], vectors: [u1, [-u1[1], u1[0]]] };
}

/** Half-width of the normal window in standard deviations; the mass outside is below 1e-5. */
const NORMAL_SPAN = 4.5;
/** Width of the exponential window in means; the mass beyond is below 1e-3. */
const EXPONENTIAL_SPAN = 7;

export const JOINT_MODELS = [
  'normal-bivariada',
  'uniforme-triangulo',
  'exponenciales-independientes',
  'producto-xy',
  'suma-xy',
] as const;
export type JointModelId = (typeof JOINT_MODELS)[number];

export interface JointModel {
  density: (x: number, y: number) => number;
  xWindow: [number, number];
  yWindow: [number, number];
  /** LaTeX of the density, for headers. */
  tex: string;
}

/**
 * Continuous joint models used in the visualizations: the bivariate normal,
 * the uniform on the triangle 0 < x < y < 1, two independent exponentials,
 * and the densities 4xy and x + y on the unit square (independent and
 * dependent, with the same support).
 */
export function jointModel(
  id: JointModelId,
  normal: BivariateNormalParameters = { muX: 0, muY: 0, sigmaX: 1, sigmaY: 1, rho: 0.6 },
  lambda = 1,
): JointModel {
  switch (id) {
    case 'normal-bivariada': {
      const spanX = NORMAL_SPAN * normal.sigmaX;
      const spanY = NORMAL_SPAN * normal.sigmaY;
      return {
        density: bivariateNormalDensity(normal),
        xWindow: [normal.muX - spanX, normal.muX + spanX],
        yWindow: [normal.muY - spanY, normal.muY + spanY],
        tex: '\\mathcal{N}_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})',
      };
    }
    case 'uniforme-triangulo':
      return {
        density: (x, y) => (x >= 0 && y <= 1 && x < y ? 2 : 0),
        xWindow: [0, 1],
        yWindow: [0, 1],
        tex: 'f(x, y) = 2, \\quad 0 < x < y < 1',
      };
    case 'exponenciales-independientes': {
      const top = EXPONENTIAL_SPAN / lambda;
      return {
        density: (x, y) => (x >= 0 && y >= 0 ? lambda * lambda * Math.exp(-lambda * (x + y)) : 0),
        xWindow: [0, top],
        yWindow: [0, top],
        tex: `f(x, y) = ${lambda === 1 ? '' : `${lambda}^2`}e^{-${lambda === 1 ? '' : lambda}(x + y)}`,
      };
    }
    case 'producto-xy':
      return {
        density: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 4 * x * y : 0),
        xWindow: [0, 1],
        yWindow: [0, 1],
        tex: 'f(x, y) = 4xy, \\quad 0 \\le x, y \\le 1',
      };
    case 'suma-xy':
      return {
        density: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= 1 ? x + y : 0),
        xWindow: [0, 1],
        yWindow: [0, 1],
        tex: 'f(x, y) = x + y, \\quad 0 \\le x, y \\le 1',
      };
  }
}
