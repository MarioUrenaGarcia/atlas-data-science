import { solve } from '../linalg/index.ts';

export interface LogisticFit {
  coefficients: number[];
  /** Fitted probabilities for the training rows. */
  probabilities: number[];
  /** Weighted average negative log-likelihood. */
  logLoss: number;
  converged: boolean;
}

function sigmoid(v: number): number {
  return 1 / (1 + Math.exp(-v));
}

/**
 * Logistic regression by Newton-Raphson (iteratively reweighted least
 * squares). Rows of `design` must include the intercept column. Optional case
 * weights multiply each row's contribution to the log-likelihood, and a small
 * ridge penalty keeps the solution finite when the classes are separable.
 */
export function logisticRegression(
  design: readonly (readonly number[])[],
  y: readonly number[],
  options: { weights?: readonly number[]; ridge?: number; maxIterations?: number } = {},
): LogisticFit {
  const p = design[0]?.length ?? 0;
  const weights = options.weights ?? y.map(() => 1);
  const ridge = options.ridge ?? 1e-6;
  const maxIterations = options.maxIterations ?? 50;
  let beta = Array.from({ length: p }, () => 0);
  let converged = false;
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const eta = design.map((row) => row.reduce((acc, v, j) => acc + v * (beta[j] ?? 0), 0));
    const mu = eta.map(sigmoid);
    const gradient = Array.from(
      { length: p },
      (_, j) =>
        design.reduce(
          (acc, row, i) => acc + (weights[i] ?? 1) * ((y[i] ?? 0) - (mu[i] ?? 0)) * (row[j] ?? 0),
          0,
        ) -
        ridge * (beta[j] ?? 0),
    );
    const hessian = Array.from({ length: p }, (_, a) =>
      Array.from(
        { length: p },
        (_, b) =>
          design.reduce((acc, row, i) => {
            const m = mu[i] ?? 0;
            return acc + (weights[i] ?? 1) * m * (1 - m) * (row[a] ?? 0) * (row[b] ?? 0);
          }, 0) + (a === b ? ridge : 0),
      ),
    );
    const step = solve(hessian, gradient);
    if (!step) break;
    beta = beta.map((b, j) => b + (step[j] ?? 0));
    if (Math.max(...step.map(Math.abs)) < 1e-9) {
      converged = true;
      break;
    }
  }
  const probabilities = design.map((row) =>
    sigmoid(row.reduce((acc, v, j) => acc + v * (beta[j] ?? 0), 0)),
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const eps = 1e-12;
  const logLoss =
    -design.reduce((acc, _, i) => {
      const pr = Math.min(1 - eps, Math.max(eps, probabilities[i] ?? 0.5));
      const yi = y[i] ?? 0;
      return acc + (weights[i] ?? 1) * (yi * Math.log(pr) + (1 - yi) * Math.log(1 - pr));
    }, 0) / totalWeight;
  return { coefficients: beta, probabilities, logLoss, converged };
}

/** Probability predicted for a row with the fitted coefficients. */
export function logisticPredict(coefficients: readonly number[], row: readonly number[]): number {
  return sigmoid(row.reduce((acc, v, j) => acc + v * (coefficients[j] ?? 0), 0));
}
