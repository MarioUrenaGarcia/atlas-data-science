import { cholesky, inverse } from '../linalg/index.ts';
import type { Random } from '../random/index.ts';
import { mean, variance } from '../stats/index.ts';

export interface MiceTrace {
  /** Mean of the imputed cells of each column after each iteration (index 0 is the start). */
  means: number[][];
  /** Imputed values of each column after each iteration, in row order of the missing cells. */
  values: number[][][];
}

export interface MiceRun {
  data: number[][];
  trace: MiceTrace;
}

function columnMeans(table: readonly (readonly number[])[], p: number): number[] {
  return Array.from({ length: p }, (_, j) =>
    mean(table.map((row) => row[j] ?? Number.NaN).filter((v) => !Number.isNaN(v))),
  );
}

function imputedValues(
  data: readonly (readonly number[])[],
  missing: readonly (readonly boolean[])[],
  p: number,
): number[][] {
  return Array.from({ length: p }, (_, j) =>
    data.flatMap((row, i) => (missing[i]?.[j] ? [row[j] ?? 0] : [])),
  );
}

function imputedMeans(
  data: readonly (readonly number[])[],
  missing: readonly (readonly boolean[])[],
  p: number,
): number[] {
  return Array.from({ length: p }, (_, j) => {
    const cells = data.flatMap((row, i) => (missing[i]?.[j] ? [row[j] ?? 0] : []));
    return cells.length > 0 ? mean(cells) : Number.NaN;
  });
}

/**
 * Draws one imputation of column j from its Bayesian linear regression on the
 * other columns: sigma^2 from its scaled inverse chi-square posterior, the
 * coefficients from their normal posterior, then each missing cell as the
 * prediction plus normal noise. Drawing the parameters (not only the noise)
 * is what lets the between-imputation variance reflect estimation uncertainty.
 */
function imputeColumn(
  data: number[][],
  missing: readonly (readonly boolean[])[],
  j: number,
  random: Random,
): void {
  const p = data[0]?.length ?? 0;
  const others = Array.from({ length: p }, (_, c) => c).filter((c) => c !== j);
  const design = (row: readonly number[]) => [1, ...others.map((c) => row[c] ?? 0)];
  const observed = data.filter((_, i) => !missing[i]?.[j]);
  const x = observed.map(design);
  const y = observed.map((row) => row[j] ?? 0);
  const q = x[0]?.length ?? 1;
  const gram = Array.from({ length: q }, (_, a) =>
    Array.from({ length: q }, (_, b) => x.reduce((acc, r) => acc + (r[a] ?? 0) * (r[b] ?? 0), 0)),
  );
  const gramInverse = inverse(gram);
  if (!gramInverse) return;
  const xty = Array.from({ length: q }, (_, a) =>
    x.reduce((acc, r, k) => acc + (r[a] ?? 0) * (y[k] ?? 0), 0),
  );
  const beta = gramInverse.map((row) => row.reduce((acc, v, b) => acc + v * (xty[b] ?? 0), 0));
  const residuals = y.map(
    (v, k) => v - (x[k] ?? []).reduce((acc, xv, b) => acc + xv * (beta[b] ?? 0), 0),
  );
  const dof = Math.max(1, y.length - q);
  const ssr = residuals.reduce((acc, r) => acc + r * r, 0);
  const sigma2 = ssr / random.chiSquare(dof);
  const covariance = gramInverse.map((row) => row.map((v) => v * sigma2));
  const lower = cholesky(covariance);
  const z = Array.from({ length: q }, () => random.normal());
  const betaDraw = beta.map(
    (b, a) => b + (lower ? (lower[a] ?? []).reduce((acc, l, c) => acc + l * (z[c] ?? 0), 0) : 0),
  );
  const sigma = Math.sqrt(sigma2);
  data.forEach((row, i) => {
    if (!missing[i]?.[j]) return;
    const prediction = design(row).reduce((acc, xv, b) => acc + xv * (betaDraw[b] ?? 0), 0);
    row[j] = prediction + random.normal(0, sigma);
  });
}

/**
 * Multivariate imputation by chained equations: missing cells start at the
 * column means and each iteration re-imputes every incomplete column from
 * the others. Returns the completed table and the trace of imputed means.
 */
export function mice(
  table: readonly (readonly number[])[],
  iterations: number,
  random: Random,
): MiceRun {
  const p = table[0]?.length ?? 0;
  const missing = table.map((row) => row.map((v) => Number.isNaN(v)));
  const start = columnMeans(table, p);
  const data = table.map((row) => row.map((v, j) => (Number.isNaN(v) ? (start[j] ?? 0) : v)));
  const means = [imputedMeans(data, missing, p)];
  const values = [imputedValues(data, missing, p)];
  const incomplete = Array.from({ length: p }, (_, j) => j).filter((j) =>
    missing.some((row) => row[j]),
  );
  for (let t = 0; t < iterations; t += 1) {
    for (const j of incomplete) imputeColumn(data, missing, j, random);
    means.push(imputedMeans(data, missing, p));
    values.push(imputedValues(data, missing, p));
  }
  return { data, trace: { means, values } };
}

/** Sample mean of a column and its squared standard error, s^2 / n. */
export function meanWithVariance(column: readonly number[]): {
  estimate: number;
  variance: number;
} {
  return { estimate: mean(column), variance: variance(column) / column.length };
}
