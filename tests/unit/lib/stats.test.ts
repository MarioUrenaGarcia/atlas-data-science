import { describe, expect, it } from 'vitest';
import {
  binCount,
  ecdf,
  excessKurtosis,
  fiveNumberSummary,
  geometricMean,
  harmonicMean,
  histogram,
  interquartileRange,
  kendallTau,
  kernelDensity,
  linearRegression,
  mean,
  median,
  medianAbsoluteDeviation,
  modes,
  pearson,
  quantile,
  ranks,
  RunningStats,
  skewness,
  spearman,
  sum,
  trimmedMean,
  variance,
  winsorizedMean,
} from '../../../src/lib/stats/index.ts';

const DATA = [2, 4, 4, 4, 5, 5, 7, 9];
const ONE_TO_TEN = Array.from({ length: 10 }, (_, i) => i + 1);

describe('location and spread', () => {
  it('matches textbook values', () => {
    expect(mean(DATA)).toBe(5);
    expect(variance(DATA, true)).toBe(4);
    expect(variance(DATA)).toBeCloseTo(32 / 7, 12);
    expect(median(DATA)).toBe(4.5);
    expect(modes(DATA)).toEqual([4]);
    expect(geometricMean([1, 10, 100])).toBeCloseTo(10, 12);
    expect(harmonicMean([1, 2, 4])).toBeCloseTo(12 / 7, 12);
    expect(trimmedMean([1, 2, 3, 4, 100], 0.2)).toBe(3);
    expect(winsorizedMean([1, 2, 3, 4, 100], 0.2)).toBe(3);
    expect(medianAbsoluteDeviation([1, 1, 2, 2, 4, 6, 9])).toBe(1);
  });

  it('sums accurately with compensation', () => {
    const values = [1e16, 1, -1e16];
    expect(sum(values)).toBe(1);
  });

  it('accumulates with Welford identical to the batch formulas', () => {
    const stats = new RunningStats();
    for (const value of DATA) stats.push(value);
    expect(stats.mean).toBe(5);
    expect(stats.variance).toBeCloseTo(32 / 7, 12);
    expect(stats.populationVariance).toBeCloseTo(4, 12);
    expect(stats.min).toBe(2);
    expect(stats.max).toBe(9);
    const shifted = new RunningStats();
    for (const value of DATA) shifted.push(value + 1e9);
    expect(shifted.variance).toBeCloseTo(32 / 7, 6);
  });
});

describe('quantiles', () => {
  it('implements several Hyndman and Fan types', () => {
    expect(quantile(ONE_TO_TEN, 0.25, 7)).toBeCloseTo(3.25, 12);
    expect(quantile(ONE_TO_TEN, 0.25, 6)).toBeCloseTo(2.75, 12);
    expect(quantile(ONE_TO_TEN, 0.25, 1)).toBe(3);
    expect(quantile(ONE_TO_TEN, 0.25, 2)).toBe(3);
    expect(quantile(ONE_TO_TEN, 0.5, 2)).toBe(5.5);
    expect(quantile(ONE_TO_TEN, 0.25, 5)).toBe(3);
    expect(interquartileRange(ONE_TO_TEN)).toBeCloseTo(4.5, 12);
    expect(fiveNumberSummary(ONE_TO_TEN)).toEqual({
      min: 1,
      q1: 3.25,
      median: 5.5,
      q3: 7.75,
      max: 10,
    });
  });
});

describe('shape', () => {
  it('computes adjusted skewness and excess kurtosis', () => {
    expect(skewness([1, 2, 3, 4, 5])).toBeCloseTo(0, 12);
    expect(excessKurtosis([1, 2, 3, 4, 5])).toBeCloseTo(-1.2, 12);
    expect(skewness([1, 1, 1, 2, 10])).toBeGreaterThan(1);
  });
});

describe('association', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 5, 4, 5];

  it('computes Pearson and least squares', () => {
    expect(pearson(x, y)).toBeCloseTo(0.7745966692414834, 12);
    const fit = linearRegression(x, y);
    expect(fit.slope).toBeCloseTo(0.6, 12);
    expect(fit.intercept).toBeCloseTo(2.2, 12);
    expect(fit.rSquared).toBeCloseTo(0.6, 12);
  });

  it('ranks with average ties and computes rank correlations', () => {
    expect(ranks([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
    expect(
      spearman(
        x,
        x.map((value) => value ** 3),
      ),
    ).toBeCloseTo(1, 12);
    expect(kendallTau(x, [...x].reverse())).toBeCloseTo(-1, 12);
    expect(kendallTau([1, 2, 3], [1, 1, 2])).toBeCloseTo(2 / Math.sqrt(6), 12);
  });
});

describe('distributions of data', () => {
  it('bins values and applies classic rules', () => {
    const bins = histogram([0, 0.5, 1, 1.5, 2], 2);
    expect(bins.map((bin) => bin.count)).toEqual([2, 3]);
    expect(
      binCount(
        Array.from({ length: 100 }, (_, i) => i),
        'sturges',
      ),
    ).toBe(8);
  });

  it('evaluates the empirical cdf', () => {
    const F = ecdf([3, 1, 2, 2]);
    expect(F(0)).toBe(0);
    expect(F(2)).toBe(0.75);
    expect(F(3)).toBe(1);
  });

  it('builds a kernel density that integrates to one', () => {
    const density = kernelDensity([0, 1, 1.5, 3], 0.5);
    let total = 0;
    for (let x = -5; x <= 8; x += 0.01) total += density(x) * 0.01;
    expect(total).toBeCloseTo(1, 4);
  });
});
