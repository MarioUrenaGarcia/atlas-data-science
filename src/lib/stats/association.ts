import { linearRegression, mean, pearson, quantile, sum } from './index.ts';

/** Classification of a pair of observations for Kendall's tau. */
export type PairKind = 'concordante' | 'discordante' | 'empate';

export interface ObservationPair {
  i: number;
  j: number;
  kind: PairKind;
}

/** Every pair i < j with its concordance: same order in x and y, opposite order, or a tie. */
export function classifyPairs(x: readonly number[], y: readonly number[]): ObservationPair[] {
  const pairs: ObservationPair[] = [];
  for (let i = 0; i < x.length; i += 1) {
    for (let j = i + 1; j < x.length; j += 1) {
      const product = Math.sign((x[i] ?? 0) - (x[j] ?? 0)) * Math.sign((y[i] ?? 0) - (y[j] ?? 0));
      pairs.push({
        i,
        j,
        kind: product > 0 ? 'concordante' : product < 0 ? 'discordante' : 'empate',
      });
    }
  }
  return pairs;
}

/** Correlation of x and y after removing the linear effect of z from both. */
export function partialCorrelation(
  x: readonly number[],
  y: readonly number[],
  z: readonly number[],
): number {
  const rx = linearRegression(z, x).residuals;
  const ry = linearRegression(z, y).residuals;
  return pearson(rx, ry);
}

/** Pearson correlation of every pair of columns. */
export function correlationMatrix(columns: readonly (readonly number[])[]): number[][] {
  return columns.map((a, i) => columns.map((b, j) => (i === j ? 1 : pearson(a, b))));
}

export interface ContingencySummary {
  total: number;
  rowTotals: number[];
  columnTotals: number[];
  expected: number[][];
  chiSquare: number;
  phi: number;
  cramersV: number;
  /** Mutual information in nats. */
  mutualInformation: number;
}

/** Expected counts under independence, chi-square, phi, Cramér's V and mutual information. */
export function contingencySummary(table: readonly (readonly number[])[]): ContingencySummary {
  const rowTotals = table.map((row) => sum(row));
  const columns = table[0]?.length ?? 0;
  const columnTotals = Array.from({ length: columns }, (_, j) =>
    sum(table.map((row) => row[j] ?? 0)),
  );
  const total = sum(rowTotals);
  const expected = table.map((_, i) => columnTotals.map((c) => ((rowTotals[i] ?? 0) * c) / total));
  let chiSquare = 0;
  let mutualInformation = 0;
  table.forEach((row, i) =>
    row.forEach((observed, j) => {
      const e = expected[i]?.[j] ?? 0;
      if (e > 0) chiSquare += (observed - e) ** 2 / e;
      if (observed > 0 && e > 0) mutualInformation += (observed / total) * Math.log(observed / e);
    }),
  );
  const k = Math.min(table.length, columns);
  const phi = Math.sqrt(chiSquare / total);
  // For 2 x 2 tables phi carries the sign of ad - bc, the direction of the association.
  const signedPhi =
    table.length === 2 && columns === 2
      ? Math.sign(
          (table[0]?.[0] ?? 0) * (table[1]?.[1] ?? 0) - (table[0]?.[1] ?? 0) * (table[1]?.[0] ?? 0),
        ) * phi
      : phi;
  return {
    total,
    rowTotals,
    columnTotals,
    expected,
    chiSquare,
    phi: signedPhi,
    cramersV: k > 1 ? Math.sqrt(chiSquare / (total * (k - 1))) : 0,
    mutualInformation,
  };
}

function doublyCenteredDistances(values: readonly number[]): number[][] {
  const n = values.length;
  const d = values.map((a) => values.map((b) => Math.abs(a - b)));
  const rowMeans = d.map((row) => mean(row));
  const grand = mean(rowMeans);
  return d
    .map((row, i) => row.map((value, j) => value - (rowMeans[i] ?? 0) - (rowMeans[j] ?? 0) + grand))
    .slice(0, n);
}

export interface DistanceCorrelationParts {
  a: number[][];
  b: number[][];
  dCov2: number;
  dVarX: number;
  dVarY: number;
  dCor: number;
}

/**
 * Distance correlation of Székely, Rizzo and Bakirov: zero in the population
 * only under independence, so it detects nonlinear dependence that Pearson's
 * coefficient misses.
 */
export function distanceCorrelation(
  x: readonly number[],
  y: readonly number[],
): DistanceCorrelationParts {
  const a = doublyCenteredDistances(x);
  const b = doublyCenteredDistances(y);
  const n = x.length;
  const product = (p: number[][], q: number[][]) =>
    sum(p.flatMap((row, i) => row.map((value, j) => value * (q[i]?.[j] ?? 0)))) / (n * n);
  const dCov2 = product(a, b);
  const dVarX = product(a, a);
  const dVarY = product(b, b);
  const dCor =
    dVarX > 0 && dVarY > 0 ? Math.sqrt(Math.max(0, dCov2) / Math.sqrt(dVarX * dVarY)) : 0;
  return { a, b, dCov2, dVarX, dVarY, dCor };
}

/** Index of the equal-frequency bin of each value, with `bins` bins. */
function binIndices(values: readonly number[], bins: number): number[] {
  const cuts = Array.from({ length: bins - 1 }, (_, k) => quantile(values, (k + 1) / bins));
  return values.map((value) => cuts.filter((cut) => value > cut).length);
}

export interface GridScore {
  columns: number;
  rows: number;
  /** Mutual information of the grid divided by log(min(columns, rows)). */
  score: number;
  mutualInformation: number;
}

/** Normalized mutual information of x and y on an equal-frequency grid. */
export function gridScore(
  x: readonly number[],
  y: readonly number[],
  columns: number,
  rows: number,
): GridScore {
  const bx = binIndices(x, columns);
  const by = binIndices(y, rows);
  const table = Array.from({ length: rows }, () => new Array<number>(columns).fill(0));
  bx.forEach((c, i) => {
    const r = by[i] ?? 0;
    const row = table[r];
    if (row) row[c] = (row[c] ?? 0) + 1;
  });
  const mi = contingencySummary(table).mutualInformation;
  return { columns, rows, mutualInformation: mi, score: mi / Math.log(Math.min(columns, rows)) };
}

/**
 * Approximation of the maximal information coefficient: the best normalized
 * mutual information over equal-frequency grids with columns * rows below
 * n^0.6. The original statistic also optimizes the position of the cuts.
 */
export function maximalInformation(
  x: readonly number[],
  y: readonly number[],
): { best: GridScore; grids: GridScore[] } {
  const limit = Math.max(4, Math.floor(x.length ** 0.6));
  const grids: GridScore[] = [];
  for (let columns = 2; columns <= limit / 2; columns += 1) {
    for (let rows = 2; columns * rows <= limit; rows += 1) {
      grids.push(gridScore(x, y, columns, rows));
    }
  }
  const best = grids.reduce(
    (a, b) => (b.score > a.score ? b : a),
    grids[0] ?? { columns: 2, rows: 2, score: 0, mutualInformation: 0 },
  );
  return { best, grids };
}
