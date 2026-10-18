import { Random } from '../random/index.ts';
import { groupIndices, type GridPopulation } from './population.ts';

export type Allocation = 'proporcional' | 'neyman' | 'igual';

export type DesignId =
  | 'mas'
  | 'estratificado'
  | 'conglomerados'
  | 'sistematico'
  | 'multietapa'
  | 'pps'
  | 'cuotas'
  | 'conveniencia'
  | 'seleccion'
  | 'marco'
  | 'no-respuesta';

export interface DesignOptions {
  design: DesignId;
  /** Units for element designs, clusters for cluster designs. */
  n: number;
  replace?: boolean;
  allocation?: Allocation;
  /** Units drawn inside each selected cluster in two-stage sampling. */
  perCluster?: number;
  /** Strength of the selection bias: weights grow as exp(bias · z) with the standardized value z. */
  bias?: number;
  /** Share of each stratum covered by the sampling frame. */
  coverage?: readonly number[];
  /** Logistic response model: P(respond) = 1 / (1 + exp(-(base + slope · z))). */
  response?: { base: number; slope: number };
}

/** A drawn sample: units in drawing order (repeated when drawn with replacement). */
export interface DrawnSample {
  units: number[];
  /** Expansion weight of each drawn unit: how many population units it represents. */
  weights: number[];
  /** Whether each drawn unit answered; all true except under nonresponse. */
  responded: boolean[];
  /** Clusters selected at the first stage, for cluster and two-stage designs. */
  clusters: number[];
  /** Sample size allotted to each stratum, for stratified and quota designs. */
  allocation: number[];
}

/** Population variance with denominator N - 1, the S² of survey sampling. */
export function finiteVariance(values: readonly number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const m = values.reduce((a, b) => a + b, 0) / n;
  return values.reduce((a, v) => a + (v - m) ** 2, 0) / (n - 1);
}

function meanOf(values: readonly number[]): number {
  return values.length === 0 ? Number.NaN : values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Rounds real allotments to integers that add up to the total (largest
 * remainder), keeping each between a floor and the stratum size.
 */
export function roundAllocation(
  ideal: readonly number[],
  total: number,
  caps: readonly number[],
  floor = 1,
): number[] {
  const result = ideal.map((value, h) =>
    Math.min(caps[h] ?? 0, Math.max(floor, Math.floor(value))),
  );
  let assigned = result.reduce((a, b) => a + b, 0);
  const order = ideal
    .map((value, h) => ({ h, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  let guard = 0;
  while (assigned < total && guard < 10_000) {
    let moved = false;
    for (const { h } of order) {
      if (assigned >= total) break;
      if ((result[h] ?? 0) < (caps[h] ?? 0)) {
        result[h] = (result[h] ?? 0) + 1;
        assigned += 1;
        moved = true;
      }
    }
    if (!moved) break;
    guard += 1;
  }
  while (assigned > total) {
    const h = result.reduce(
      (best, value, index) => (value > floor && value > (result[best] ?? 0) ? index : best),
      0,
    );
    if ((result[h] ?? 0) <= floor) break;
    result[h] = (result[h] ?? 0) - 1;
    assigned -= 1;
  }
  return result;
}

/** Ideal (unrounded) allotment of n units to strata of sizes N_h and deviations S_h. */
export function idealAllocation(
  allocation: Allocation,
  n: number,
  sizes: readonly number[],
  sds: readonly number[],
): number[] {
  const total = sizes.reduce((a, b) => a + b, 0);
  if (allocation === 'igual') return sizes.map(() => n / sizes.length);
  if (allocation === 'proporcional') return sizes.map((size) => (n * size) / total);
  const products = sizes.map((size, h) => size * (sds[h] ?? 0));
  const sum = products.reduce((a, b) => a + b, 0);
  if (sum === 0) return sizes.map((size) => (n * size) / total);
  return products.map((value) => (n * value) / sum);
}

export function allocate(
  allocation: Allocation,
  n: number,
  sizes: readonly number[],
  sds: readonly number[],
): number[] {
  // A stratum whose ideal share exceeds its size is taken whole (a census) and
  // the remaining units are allotted again among the other strata.
  const fixed = new Map<number, number>();
  for (let guard = 0; guard < sizes.length; guard += 1) {
    const open = sizes.map((_, h) => h).filter((h) => !fixed.has(h));
    const left = n - [...fixed.values()].reduce((a, b) => a + b, 0);
    const ideal = idealAllocation(
      allocation,
      left,
      open.map((h) => sizes[h] ?? 0),
      open.map((h) => sds[h] ?? 0),
    );
    const over = open.filter((h, i) => (ideal[i] ?? 0) > (sizes[h] ?? 0));
    if (over.length === 0) {
      const rounded = roundAllocation(
        ideal,
        left,
        open.map((h) => sizes[h] ?? 0),
        1,
      );
      return sizes.map((_, h) => fixed.get(h) ?? rounded[open.indexOf(h)] ?? 0);
    }
    for (const h of over) fixed.set(h, sizes[h] ?? 0);
  }
  return sizes.map((_, h) => fixed.get(h) ?? 0);
}

/** Variance of the stratified mean, Σ W_h² (1 - n_h/N_h) S_h² / n_h. */
export function stratifiedVariance(
  sizes: readonly number[],
  variances: readonly number[],
  allotment: readonly number[],
): number {
  const total = sizes.reduce((a, b) => a + b, 0);
  return sizes.reduce((acc, size, h) => {
    const nh = allotment[h] ?? 0;
    if (nh <= 0) return acc;
    const w = size / total;
    return acc + w * w * (1 - nh / size) * ((variances[h] ?? 0) / nh);
  }, 0);
}

/** Variance of the mean of a simple random sample, with or without replacement. */
export function srsVariance(values: readonly number[], n: number, replace = false): number {
  const N = values.length;
  const s2 = finiteVariance(values);
  if (replace) return (s2 * (N - 1)) / N / n;
  return (1 - n / N) * (s2 / n);
}

/** Variance of the estimated mean when m of the clusters are drawn by simple random sampling. */
export function clusterVariance(values: readonly number[], clusters: readonly number[], m: number) {
  const count = Math.max(...clusters) + 1;
  const totals = new Array<number>(count).fill(0);
  clusters.forEach((c, i) => (totals[c] = (totals[c] ?? 0) + (values[i] ?? 0)));
  const N = values.length;
  // The estimated total is (C/m) Σ t_c, so the mean is that over N.
  return ((count * count) / (N * N)) * (1 - m / count) * (finiteVariance(totals) / m);
}

function standardized(values: readonly number[]): number[] {
  const m = meanOf(values);
  const sd = Math.sqrt(finiteVariance(values)) || 1;
  return values.map((v) => (v - m) / sd);
}

/** Weighted sampling without replacement, one unit at a time. */
function weightedWithoutReplacement(
  candidates: readonly number[],
  weights: readonly number[],
  n: number,
  random: Random,
): number[] {
  const pool = [...candidates];
  const w = pool.map((unit) => weights[unit] ?? 0);
  const chosen: number[] = [];
  while (chosen.length < n && pool.length > 0) {
    const index = random.categorical(w);
    chosen.push(pool[index] ?? 0);
    pool.splice(index, 1);
    w.splice(index, 1);
  }
  return chosen;
}

/** Units ordered by accessibility with a little jitter, so convenient samples are not all identical. */
function byAccessibility(units: readonly number[], population: GridPopulation, random: Random) {
  return units
    .map((unit) => ({ unit, key: (population.distance[unit] ?? 0) + random.uniform(0, 0.12) }))
    .sort((a, b) => a.key - b.key)
    .map((item) => item.unit);
}

/** Systematic selection of n positions out of N with interval N/n and a random start. */
export function systematicPositions(N: number, n: number, start: number): number[] {
  const k = N / n;
  return Array.from({ length: n }, (_, i) => Math.min(N - 1, Math.floor(start + i * k)));
}

/**
 * Draws one sample from the population under the given design and returns
 * the units with their expansion weights. Nonprobability designs receive the
 * weights a naive analyst would use (N/n), which is precisely why they are biased.
 */
export function drawSample(
  population: GridPopulation,
  options: DesignOptions,
  random: Random,
): DrawnSample {
  const N = population.values.length;
  const all = Array.from({ length: N }, (_, i) => i);
  const strataCount = population.strataNames.length;
  const strata = groupIndices(population.stratum, strataCount);
  const clustersOf = groupIndices(population.cluster, population.clusterCount);
  const n = Math.max(1, Math.round(options.n));
  const plain = (units: number[]): DrawnSample => ({
    units,
    weights: units.map(() => N / Math.max(1, units.length)),
    responded: units.map(() => true),
    clusters: [],
    allocation: [],
  });
  switch (options.design) {
    case 'mas': {
      const units = options.replace
        ? Array.from({ length: n }, () => random.int(0, N - 1))
        : random.sample(all, Math.min(n, N));
      return plain(units);
    }
    case 'estratificado': {
      const sizes = strata.map((s) => s.length);
      const sds = strata.map((s) =>
        Math.sqrt(finiteVariance(s.map((u) => population.values[u] ?? 0))),
      );
      const allotment = allocate(options.allocation ?? 'proporcional', n, sizes, sds);
      const units: number[] = [];
      const weights: number[] = [];
      strata.forEach((members, h) => {
        const nh = allotment[h] ?? 0;
        for (const unit of random.sample(members, nh)) {
          units.push(unit);
          weights.push(members.length / Math.max(1, nh));
        }
      });
      return {
        units,
        weights,
        responded: units.map(() => true),
        clusters: [],
        allocation: allotment,
      };
    }
    case 'conglomerados': {
      const C = population.clusterCount;
      const m = Math.min(n, C);
      const chosen = random.sample(
        Array.from({ length: C }, (_, c) => c),
        m,
      );
      const units = chosen.flatMap((c) => clustersOf[c] ?? []);
      return {
        units,
        weights: units.map(() => C / m),
        responded: units.map(() => true),
        clusters: chosen,
        allocation: [],
      };
    }
    case 'multietapa': {
      const C = population.clusterCount;
      const m = Math.min(n, C);
      const k = Math.max(1, options.perCluster ?? 2);
      const chosen = random.sample(
        Array.from({ length: C }, (_, c) => c),
        m,
      );
      const units: number[] = [];
      const weights: number[] = [];
      for (const c of chosen) {
        const members = clustersOf[c] ?? [];
        const kc = Math.min(k, members.length);
        for (const unit of random.sample(members, kc)) {
          units.push(unit);
          weights.push((C / m) * (members.length / kc));
        }
      }
      return { units, weights, responded: units.map(() => true), clusters: chosen, allocation: [] };
    }
    case 'sistematico': {
      const start = random.uniform(0, N / n);
      return plain(systematicPositions(N, Math.min(n, N), start));
    }
    case 'pps': {
      const total = population.size.reduce((a, b) => a + b, 0);
      const units = Array.from({ length: n }, () => random.categorical(population.size));
      // Hansen-Hurwitz weights: each draw represents 1 / (n p_i) units.
      return {
        units,
        weights: units.map((u) => total / (n * (population.size[u] ?? 1))),
        responded: units.map(() => true),
        clusters: [],
        allocation: [],
      };
    }
    case 'cuotas': {
      const sizes = strata.map((s) => s.length);
      const allotment = allocate('proporcional', n, sizes, []);
      const units = strata.flatMap((members, h) =>
        byAccessibility(members, population, random).slice(0, allotment[h] ?? 0),
      );
      return { ...plain(units), allocation: allotment };
    }
    case 'conveniencia':
      return plain(byAccessibility(all, population, random).slice(0, Math.min(n, N)));
    case 'seleccion': {
      const z = standardized(population.values);
      const weights = z.map((value) => Math.exp((options.bias ?? 1) * value));
      return plain(weightedWithoutReplacement(all, weights, Math.min(n, N), random));
    }
    case 'marco': {
      const covered = frameUnits(population, options.coverage ?? []);
      return plain(random.sample(covered, Math.min(n, covered.length)));
    }
    case 'no-respuesta': {
      const z = standardized(population.values);
      const units = random.sample(all, Math.min(n, N));
      const { base, slope } = options.response ?? { base: 0, slope: 1 };
      const responded = units.map(
        (u) => random.next() < 1 / (1 + Math.exp(-(base + slope * (z[u] ?? 0)))),
      );
      return { ...plain(units), responded };
    }
  }
}

/**
 * Units listed in the frame. Within each stratum the covered share is taken
 * from the first columns, so the excluded units form a contiguous region,
 * as when a telephone directory misses the newest neighborhoods.
 */
export function frameUnits(population: GridPopulation, coverage: readonly number[]): number[] {
  const strata = groupIndices(population.stratum, population.strataNames.length);
  return strata.flatMap((members, h) => {
    const share = Math.min(1, Math.max(0, coverage[h] ?? 1));
    const ordered = [...members].sort(
      (a, b) => (a % population.columns) - (b % population.columns) || a - b,
    );
    return ordered.slice(0, Math.round(share * members.length));
  });
}

/**
 * Estimate of the population mean from a drawn sample. Probability designs
 * use the Horvitz-Thompson form Σ w_i y_i / N; under nonresponse only the
 * respondents are averaged, which is what happens when the missing answers
 * are simply ignored.
 */
export function estimateMean(
  population: GridPopulation,
  sample: DrawnSample,
  design: DesignId,
): number {
  const N = population.values.length;
  if (sample.units.length === 0) return Number.NaN;
  if (design === 'no-respuesta') {
    const answered = sample.units.filter((_, i) => sample.responded[i]);
    return meanOf(answered.map((u) => population.values[u] ?? 0));
  }
  if (
    design === 'conglomerados' ||
    design === 'multietapa' ||
    design === 'estratificado' ||
    design === 'pps'
  ) {
    const total = sample.units.reduce(
      (acc, u, i) => acc + (sample.weights[i] ?? 0) * (population.values[u] ?? 0),
      0,
    );
    return total / N;
  }
  return meanOf(sample.units.map((u) => population.values[u] ?? 0));
}

/** Theoretical variance of the estimated mean when it has a closed form; null otherwise. */
export function theoreticalVariance(
  population: GridPopulation,
  options: DesignOptions,
): number | null {
  const values = population.values;
  const n = Math.max(1, Math.round(options.n));
  switch (options.design) {
    case 'mas':
      return srsVariance(values, Math.min(n, values.length), options.replace);
    case 'estratificado': {
      const strata = groupIndices(population.stratum, population.strataNames.length);
      const groups = strata.map((s) => s.map((u) => values[u] ?? 0));
      const sizes = strata.map((s) => s.length);
      const variances = groups.map(finiteVariance);
      const allotment = allocate(
        options.allocation ?? 'proporcional',
        n,
        sizes,
        variances.map(Math.sqrt),
      );
      return stratifiedVariance(sizes, variances, allotment);
    }
    case 'conglomerados':
      return clusterVariance(values, population.cluster, Math.min(n, population.clusterCount));
    case 'pps': {
      const total = population.size.reduce((a, b) => a + b, 0);
      const N = values.length;
      const yTotal = values.reduce((a, b) => a + b, 0);
      // Var of Hansen-Hurwitz total: (1/n) Σ p_i (y_i/p_i - Y)².
      const v = population.size.reduce((acc, x, i) => {
        const p = x / total;
        return acc + p * ((values[i] ?? 0) / p - yTotal) ** 2;
      }, 0);
      return v / n / (N * N);
    }
    default:
      return null;
  }
}

/** Number of units the design ends up observing (responses included). */
export function observedCount(sample: DrawnSample): number {
  return sample.responded.filter(Boolean).length;
}

/** Cost-optimal allocation: n_h proportional to N_h S_h / √c_h, which is Neyman's when costs are equal. */
export function optimalAllocation(
  n: number,
  sizes: readonly number[],
  sds: readonly number[],
  costs: readonly number[],
): number[] {
  const scores = sizes.map((size, h) => (size * (sds[h] ?? 0)) / Math.sqrt(costs[h] ?? 1));
  const sum = scores.reduce((a, b) => a + b, 0);
  const ideal = sum === 0 ? sizes.map(() => n / sizes.length) : scores.map((s) => (n * s) / sum);
  return roundAllocation(ideal, n, sizes, 1);
}

/**
 * Order in which units are handed to strata so that a final allotment is
 * reached evenly: each unit goes to the stratum furthest from its share.
 */
export function allocationSequence(allotment: readonly number[]): number[] {
  const total = allotment.reduce((a, b) => a + b, 0);
  const current = allotment.map(() => 0);
  const order: number[] = [];
  for (let step = 0; step < total; step += 1) {
    let best = -1;
    let bestScore = -Infinity;
    allotment.forEach((target, h) => {
      if ((current[h] ?? 0) >= target) return;
      const score = (target * (step + 1)) / total - (current[h] ?? 0);
      if (score > bestScore) {
        bestScore = score;
        best = h;
      }
    });
    if (best < 0) break;
    current[best] = (current[best] ?? 0) + 1;
    order.push(best);
  }
  return order;
}
