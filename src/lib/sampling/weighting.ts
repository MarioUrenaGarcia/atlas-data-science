/**
 * Calibration of survey weights: post-stratification to known population
 * shares and raking (iterative proportional fitting) to several margins.
 */

/** Post-stratification weight of each cell: population share over sample share. */
export function postStratificationWeights(
  sampleCounts: readonly number[],
  populationShares: readonly number[],
): number[] {
  const n = sampleCounts.reduce((a, b) => a + b, 0);
  const totalShare = populationShares.reduce((a, b) => a + b, 0) || 1;
  return sampleCounts.map((count, h) =>
    count === 0 ? 0 : (populationShares[h] ?? 0) / totalShare / (count / n),
  );
}

/** Weighted mean of cell means with the given cell weights per respondent. */
export function weightedCellMean(
  counts: readonly number[],
  cellMeans: readonly number[],
  weights: readonly number[],
): number {
  let numerator = 0;
  let denominator = 0;
  counts.forEach((count, h) => {
    const w = (weights[h] ?? 0) * count;
    numerator += w * (cellMeans[h] ?? 0);
    denominator += w;
  });
  return denominator === 0 ? Number.NaN : numerator / denominator;
}

export interface RakingStep {
  /** Weighted table after the step. */
  table: number[][];
  /** Which margin was adjusted: rows or columns; the first step is the starting table. */
  adjusted: 'inicio' | 'filas' | 'columnas';
  iteration: number;
  /** Largest absolute gap between a weighted margin and its target, as a share of the total. */
  gap: number;
}

function rowSums(table: readonly (readonly number[])[]): number[] {
  return table.map((row) => row.reduce((a, b) => a + b, 0));
}

function columnSums(table: readonly (readonly number[])[]): number[] {
  const columns = table[0]?.length ?? 0;
  return Array.from({ length: columns }, (_, j) =>
    table.reduce((acc, row) => acc + (row[j] ?? 0), 0),
  );
}

export function marginGap(
  table: readonly (readonly number[])[],
  rowTargets: readonly number[],
  columnTargets: readonly number[],
): number {
  const total = rowTargets.reduce((a, b) => a + b, 0) || 1;
  const rows = rowSums(table).map((value, i) => Math.abs(value - (rowTargets[i] ?? 0)));
  const columns = columnSums(table).map((value, j) => Math.abs(value - (columnTargets[j] ?? 0)));
  return Math.max(...rows, ...columns) / total;
}

/**
 * Iterative proportional fitting. Starting from the sample table scaled to the
 * population total, rows and columns are rescaled in turn to match their
 * targets. Returns every intermediate table so the process can be animated.
 */
export function rake(
  sample: readonly (readonly number[])[],
  rowTargets: readonly number[],
  columnTargets: readonly number[],
  iterations: number,
): RakingStep[] {
  const total = rowTargets.reduce((a, b) => a + b, 0);
  const sampleTotal = sample.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0) || 1;
  let table = sample.map((row) => row.map((value) => (value * total) / sampleTotal));
  const steps: RakingStep[] = [
    { table, adjusted: 'inicio', iteration: 0, gap: marginGap(table, rowTargets, columnTargets) },
  ];
  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    const rows = rowSums(table);
    table = table.map((row, i) =>
      row.map((value) =>
        (rows[i] ?? 0) === 0 ? 0 : (value * (rowTargets[i] ?? 0)) / (rows[i] ?? 1),
      ),
    );
    steps.push({
      table,
      adjusted: 'filas',
      iteration,
      gap: marginGap(table, rowTargets, columnTargets),
    });
    const columns = columnSums(table);
    table = table.map((row) =>
      row.map((value, j) =>
        (columns[j] ?? 0) === 0 ? 0 : (value * (columnTargets[j] ?? 0)) / (columns[j] ?? 1),
      ),
    );
    steps.push({
      table,
      adjusted: 'columnas',
      iteration,
      gap: marginGap(table, rowTargets, columnTargets),
    });
  }
  return steps;
}

export { columnSums, rowSums };
