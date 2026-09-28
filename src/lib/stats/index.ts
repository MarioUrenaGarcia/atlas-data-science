/**
 * Descriptive statistics on plain arrays. Functions never mutate their input.
 */

/**
 * Running mean and variance by Welford's algorithm, which avoids the
 * catastrophic cancellation of the naive sum-of-squares formula.
 */
export class RunningStats {
  private n = 0;
  private meanValue = 0;
  private m2 = 0;
  private minValue = Number.POSITIVE_INFINITY;
  private maxValue = Number.NEGATIVE_INFINITY;

  push(value: number): void {
    this.n += 1;
    const delta = value - this.meanValue;
    this.meanValue += delta / this.n;
    this.m2 += delta * (value - this.meanValue);
    this.minValue = Math.min(this.minValue, value);
    this.maxValue = Math.max(this.maxValue, value);
  }

  get count(): number {
    return this.n;
  }

  get mean(): number {
    return this.n === 0 ? Number.NaN : this.meanValue;
  }

  /** Sample variance with denominator n - 1. */
  get variance(): number {
    return this.n < 2 ? Number.NaN : this.m2 / (this.n - 1);
  }

  get populationVariance(): number {
    return this.n === 0 ? Number.NaN : this.m2 / this.n;
  }

  get sd(): number {
    return Math.sqrt(this.variance);
  }

  get min(): number {
    return this.minValue;
  }

  get max(): number {
    return this.maxValue;
  }
}

export function sum(values: readonly number[]): number {
  // Neumaier compensated summation keeps long sums accurate.
  let total = 0;
  let compensation = 0;
  for (const value of values) {
    const t = total + value;
    compensation += Math.abs(total) >= Math.abs(value) ? total - t + value : value - t + total;
    total = t;
  }
  return total + compensation;
}

export function mean(values: readonly number[]): number {
  return values.length === 0 ? Number.NaN : sum(values) / values.length;
}

export function weightedMean(values: readonly number[], weights: readonly number[]): number {
  const totalWeight = sum(weights);
  return sum(values.map((value, index) => value * (weights[index] ?? 0))) / totalWeight;
}

export function geometricMean(values: readonly number[]): number {
  return Math.exp(mean(values.map((value) => Math.log(value))));
}

export function harmonicMean(values: readonly number[]): number {
  return values.length / sum(values.map((value) => 1 / value));
}

/** Variance with denominator n - 1 (unbiased) or n when `population` is true. */
export function variance(values: readonly number[], population = false): number {
  const n = values.length;
  if (n < (population ? 1 : 2)) return Number.NaN;
  const m = mean(values);
  return sum(values.map((value) => (value - m) ** 2)) / (population ? n : n - 1);
}

export function standardDeviation(values: readonly number[], population = false): number {
  return Math.sqrt(variance(values, population));
}

export function sorted(values: readonly number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export type QuantileMethod = 1 | 2 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Sample quantile following the Hyndman and Fan (1996) taxonomy. Type 7 is
 * the default of most statistical software; type 6 is used by several
 * textbooks; types 1 and 2 are based on the inverse of the empirical cdf.
 */
export function quantile(values: readonly number[], p: number, method: QuantileMethod = 7): number {
  const x = sorted(values);
  const n = x.length;
  if (n === 0) return Number.NaN;
  const at = (index: number) => x[Math.min(n - 1, Math.max(0, index))] as number;
  if (method === 1 || method === 2) {
    const np = n * p;
    const j = Math.floor(np);
    const g = np - j;
    if (g > 0) return at(j);
    if (method === 1) return at(j - 1);
    return j === 0 ? at(0) : j === n ? at(n - 1) : (at(j - 1) + at(j)) / 2;
  }
  const m = { 4: 0, 5: 0.5, 6: p, 7: 1 - p, 8: (p + 1) / 3, 9: p / 4 + 3 / 8 }[method];
  const position = n * p + m;
  const j = Math.floor(position);
  const g = position - j;
  if (j < 1) return at(0);
  if (j >= n) return at(n - 1);
  return (1 - g) * at(j - 1) + g * at(j);
}

export function median(values: readonly number[]): number {
  return quantile(values, 0.5, 7);
}

/** Most frequent values; every tied value is returned. */
export function modes(values: readonly number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const best = Math.max(0, ...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === best)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

export function trimmedMean(values: readonly number[], proportion: number): number {
  const x = sorted(values);
  const cut = Math.floor(x.length * proportion);
  return mean(x.slice(cut, x.length - cut));
}

export function winsorizedMean(values: readonly number[], proportion: number): number {
  const x = sorted(values);
  const cut = Math.floor(x.length * proportion);
  if (cut === 0) return mean(x);
  const low = x[cut] as number;
  const high = x[x.length - 1 - cut] as number;
  return mean(x.map((value) => Math.min(high, Math.max(low, value))));
}

export function range(values: readonly number[]): number {
  return Math.max(...values) - Math.min(...values);
}

export function interquartileRange(values: readonly number[]): number {
  return quantile(values, 0.75) - quantile(values, 0.25);
}

/** Median absolute deviation, unscaled. Multiply by 1.4826 to estimate sigma under normality. */
export function medianAbsoluteDeviation(values: readonly number[]): number {
  const m = median(values);
  return median(values.map((value) => Math.abs(value - m)));
}

export function meanAbsoluteDeviation(values: readonly number[]): number {
  const m = mean(values);
  return mean(values.map((value) => Math.abs(value - m)));
}

/** Adjusted Fisher-Pearson skewness G1, as reported by most software. */
export function skewness(values: readonly number[]): number {
  const n = values.length;
  const m = mean(values);
  const m2 = sum(values.map((value) => (value - m) ** 2)) / n;
  const m3 = sum(values.map((value) => (value - m) ** 3)) / n;
  const g1 = m3 / m2 ** 1.5;
  return (Math.sqrt(n * (n - 1)) / (n - 2)) * g1;
}

/** Sample excess kurtosis G2 (zero for a normal population). */
export function excessKurtosis(values: readonly number[]): number {
  const n = values.length;
  const m = mean(values);
  const m2 = sum(values.map((value) => (value - m) ** 2)) / n;
  const m4 = sum(values.map((value) => (value - m) ** 4)) / n;
  const g2 = m4 / (m2 * m2) - 3;
  return ((n - 1) / ((n - 2) * (n - 3))) * ((n + 1) * g2 + 6);
}

export function covariance(x: readonly number[], y: readonly number[]): number {
  const mx = mean(x);
  const my = mean(y);
  return sum(x.map((value, index) => (value - mx) * ((y[index] ?? 0) - my))) / (x.length - 1);
}

export function pearson(x: readonly number[], y: readonly number[]): number {
  return covariance(x, y) / (standardDeviation(x) * standardDeviation(y));
}

/** Ranks starting at 1; ties receive the average of the ranks they span. */
export function ranks(values: readonly number[]): number[] {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const result = new Array<number>(values.length);
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && order[j + 1]?.value === order[i]?.value) j += 1;
    const averageRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) result[order[k]?.index ?? 0] = averageRank;
    i = j + 1;
  }
  return result;
}

export function spearman(x: readonly number[], y: readonly number[]): number {
  return pearson(ranks(x), ranks(y));
}

/** Kendall's tau-b, which corrects for ties in either variable. */
export function kendallTau(x: readonly number[], y: readonly number[]): number {
  let concordant = 0;
  let discordant = 0;
  let tiesX = 0;
  let tiesY = 0;
  for (let i = 0; i < x.length; i += 1) {
    for (let j = i + 1; j < x.length; j += 1) {
      const dx = Math.sign((x[i] ?? 0) - (x[j] ?? 0));
      const dy = Math.sign((y[i] ?? 0) - (y[j] ?? 0));
      if (dx === 0 && dy === 0) continue;
      if (dx === 0) tiesX += 1;
      else if (dy === 0) tiesY += 1;
      else if (dx === dy) concordant += 1;
      else discordant += 1;
    }
  }
  return (
    (concordant - discordant) /
    Math.sqrt((concordant + discordant + tiesX) * (concordant + discordant + tiesY))
  );
}

export function zScores(values: readonly number[]): number[] {
  const m = mean(values);
  const s = standardDeviation(values);
  return values.map((value) => (value - m) / s);
}

export interface FiveNumberSummary {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export function fiveNumberSummary(values: readonly number[]): FiveNumberSummary {
  return {
    min: Math.min(...values),
    q1: quantile(values, 0.25),
    median: median(values),
    q3: quantile(values, 0.75),
    max: Math.max(...values),
  };
}

export type BinRule = 'sturges' | 'scott' | 'freedman-diaconis';

/** Number of histogram bins suggested by a classic rule. */
export function binCount(values: readonly number[], rule: BinRule): number {
  const n = values.length;
  if (n < 2) return 1;
  const width = range(values);
  if (width === 0) return 1;
  if (rule === 'sturges') return Math.ceil(Math.log2(n)) + 1;
  const binWidth =
    rule === 'scott'
      ? (3.49 * standardDeviation(values)) / Math.cbrt(n)
      : (2 * interquartileRange(values)) / Math.cbrt(n);
  return binWidth > 0 ? Math.max(1, Math.ceil(width / binWidth)) : 1;
}

export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
}

/** Equal-width histogram; the last bin is closed on the right. */
export function histogram(
  values: readonly number[],
  bins: number,
  domain?: [number, number],
): HistogramBin[] {
  const [lo, hi] = domain ?? [Math.min(...values), Math.max(...values)];
  const width = (hi - lo) / bins || 1;
  const result = Array.from({ length: bins }, (_, index) => ({
    x0: lo + index * width,
    x1: lo + (index + 1) * width,
    count: 0,
  }));
  for (const value of values) {
    if (value < lo || value > hi) continue;
    const index = Math.min(bins - 1, Math.floor((value - lo) / width));
    const bin = result[index];
    if (bin) bin.count += 1;
  }
  return result;
}

/** Empirical cdf evaluated at x. */
export function ecdf(values: readonly number[]): (x: number) => number {
  const x = sorted(values);
  return (point: number) => {
    let low = 0;
    let high = x.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if ((x[middle] as number) <= point) low = middle + 1;
      else high = middle;
    }
    return low / x.length;
  };
}

/** Silverman's rule-of-thumb bandwidth for a Gaussian kernel. */
export function silvermanBandwidth(values: readonly number[]): number {
  const s = standardDeviation(values);
  const spread = Math.min(s, interquartileRange(values) / 1.34) || s;
  return 0.9 * spread * values.length ** -0.2;
}

export type Kernel = 'gaussian' | 'epanechnikov' | 'uniform' | 'triangular';

export function kernelValue(kernel: Kernel, u: number): number {
  switch (kernel) {
    case 'gaussian':
      return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    case 'epanechnikov':
      return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0;
    case 'uniform':
      return Math.abs(u) <= 1 ? 0.5 : 0;
    case 'triangular':
      return Math.abs(u) <= 1 ? 1 - Math.abs(u) : 0;
  }
}

/** Kernel density estimate as a function of x. */
export function kernelDensity(
  values: readonly number[],
  bandwidth = silvermanBandwidth(values),
  kernel: Kernel = 'gaussian',
): (x: number) => number {
  const n = values.length;
  return (x: number) => {
    let total = 0;
    for (const value of values) total += kernelValue(kernel, (x - value) / bandwidth);
    return total / (n * bandwidth);
  };
}

export interface LinearFit {
  intercept: number;
  slope: number;
  rSquared: number;
  residuals: number[];
}

/** Ordinary least squares line y = intercept + slope * x. */
export function linearRegression(x: readonly number[], y: readonly number[]): LinearFit {
  const mx = mean(x);
  const my = mean(y);
  const sxy = sum(x.map((value, index) => (value - mx) * ((y[index] ?? 0) - my)));
  const sxx = sum(x.map((value) => (value - mx) ** 2));
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = my - slope * mx;
  const residuals = y.map((value, index) => value - (intercept + slope * (x[index] ?? 0)));
  const total = sum(y.map((value) => (value - my) ** 2));
  const residual = sum(residuals.map((value) => value * value));
  return { intercept, slope, rSquared: total === 0 ? 1 : 1 - residual / total, residuals };
}
