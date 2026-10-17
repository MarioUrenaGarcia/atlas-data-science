import { Random } from '../random/index.ts';

/** One stratum of a gridded population: a horizontal band of rows. */
export interface StratumSpec {
  name: string;
  /** Mean of the variable in the stratum, or the proportion of ones for binary variables. */
  mean: number;
  /** Standard deviation within the stratum; defaults to the population value. */
  sd?: number;
}

export interface GridPopulationSpec {
  columns: number;
  rows: number;
  strata: readonly StratumSpec[];
  /** Width and height of each cluster block, in units. */
  cluster: readonly [number, number];
  /** Share of the within-stratum variance explained by the cluster (intraclass correlation). */
  icc: number;
  /** Standard deviation within each stratum. */
  sd: number;
  /** Change of the mean from the first to the last column, in units of the variable. */
  trend?: number;
  /** Period, in units of the row-major order, of a cyclic pattern; zero disables it. */
  period?: number;
  /** Amplitude of the cyclic pattern. */
  amplitude?: number;
  /** Correlation between the variable and the auxiliary size measure used by PPS designs. */
  sizeCorrelation?: number;
  binary?: boolean;
  /** Values are rounded to this many decimals; binary values are always 0 or 1. */
  decimals?: number;
  /** Values are clipped from below, to keep incomes or counts positive. */
  minimum?: number;
}

/** A finite population laid out on a grid, with its design structure. */
export interface GridPopulation {
  columns: number;
  rows: number;
  values: number[];
  /** Stratum index of each unit. */
  stratum: number[];
  /** Cluster index of each unit, numbered in row-major order of the blocks. */
  cluster: number[];
  /** Auxiliary size measure, positive, for probability proportional to size. */
  size: number[];
  /** Distance of each unit to the top-left corner, normalized to [0, 1]; a proxy for accessibility. */
  distance: number[];
  strataNames: string[];
  clusterCount: number;
}

const SIZE_FLOOR = 0.15;

/** Inverse logit, used to keep binary proportions inside (0, 1). */
function logistic(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function logit(p: number): number {
  const clipped = Math.min(0.999, Math.max(0.001, p));
  return Math.log(clipped / (1 - clipped));
}

/** Stratum of a row when the rows are split into equal horizontal bands. */
export function stratumOfRow(row: number, rows: number, strata: number): number {
  return Math.min(strata - 1, Math.floor((row * strata) / rows));
}

/**
 * Generates a gridded population. Each value combines the stratum mean, a
 * shared cluster effect (so that units of the same block resemble each other),
 * an optional left-to-right trend and periodic pattern, and individual noise.
 * The within-stratum variance is split between cluster and unit according to
 * the intraclass correlation.
 */
export function generateGridPopulation(spec: GridPopulationSpec, random: Random): GridPopulation {
  const { columns, rows } = spec;
  const total = columns * rows;
  const [blockWidth, blockHeight] = spec.cluster;
  const blocksPerRow = Math.ceil(columns / blockWidth);
  const blockRows = Math.ceil(rows / blockHeight);
  const clusterCount = blocksPerRow * blockRows;
  const icc = Math.min(0.95, Math.max(0, spec.icc));
  const clusterEffects = Array.from({ length: clusterCount }, () => random.normal());
  const decimals = spec.decimals ?? 1;
  const factor = 10 ** decimals;
  const values: number[] = [];
  const stratum: number[] = [];
  const cluster: number[] = [];
  const size: number[] = [];
  const distance: number[] = [];
  const rho = Math.min(0.99, Math.max(-0.99, spec.sizeCorrelation ?? 0.7));
  const maxDistance = Math.hypot(columns - 1, rows - 1) || 1;
  for (let index = 0; index < total; index += 1) {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const h = stratumOfRow(row, rows, spec.strata.length);
    const c = Math.floor(row / blockHeight) * blocksPerRow + Math.floor(column / blockWidth);
    const s = spec.strata[h];
    const sd = s?.sd ?? spec.sd;
    const shared = clusterEffects[c] ?? 0;
    const own = random.normal();
    const z = Math.sqrt(icc) * shared + Math.sqrt(1 - icc) * own;
    const trend = spec.trend ? spec.trend * (column / Math.max(1, columns - 1) - 0.5) : 0;
    const cycle =
      spec.period && spec.period > 0
        ? (spec.amplitude ?? sd) * Math.sin((2 * Math.PI * index) / spec.period)
        : 0;
    let value: number;
    if (spec.binary) {
      const p = logistic(logit(s?.mean ?? 0.5) + 1.6 * Math.sqrt(icc) * shared + trend + cycle);
      value = random.next() < p ? 1 : 0;
    } else {
      value = (s?.mean ?? 0) + sd * z + trend + cycle;
      if (spec.minimum !== undefined) value = Math.max(spec.minimum, value);
      value = Math.round(value * factor) / factor;
    }
    // The size measure shares a standardized component with the variable.
    const zSize = rho * z + Math.sqrt(1 - rho * rho) * random.normal();
    values.push(value);
    stratum.push(h);
    cluster.push(c);
    size.push(Math.max(SIZE_FLOOR, Math.exp(0.6 * zSize)));
    distance.push(Math.hypot(column, row) / maxDistance);
  }
  return {
    columns,
    rows,
    values,
    stratum,
    cluster,
    size,
    distance,
    strataNames: spec.strata.map((s) => s.name),
    clusterCount,
  };
}

/** Indices of the units of each group (stratum or cluster). */
export function groupIndices(groups: readonly number[], count: number): number[][] {
  const result = Array.from({ length: count }, () => [] as number[]);
  groups.forEach((group, index) => result[group]?.push(index));
  return result;
}
