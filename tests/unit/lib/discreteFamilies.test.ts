import { describe, expect, it } from 'vitest';
import {
  betaBinomial,
  finiteDiscrete,
  binomial,
  harmonicNumber,
  logarithmic,
  multinomialPmf,
  negativeBinomial,
  rademacher,
  rademacherSum,
  sampleMultinomial,
  shifted,
  skellam,
  sumOfDiscreteUniforms,
  zeroInflatedPoisson,
  zipf,
  type DiscreteDistribution,
} from '../../../src/lib/distributions/index.ts';
import { Random } from '../../../src/lib/random/index.ts';

/** Modified Bessel function of the first kind by its power series, as an independent reference. */
function besselI(order: number, x: number): number {
  let total = 0;
  let term = (x / 2) ** order;
  for (let m = 1; m <= order; m += 1) term /= m;
  for (let m = 0; m < 200; m += 1) {
    total += term;
    term *= (x / 2) ** 2 / ((m + 1) * (m + 1 + order));
  }
  return total;
}

function massOver(distribution: DiscreteDistribution, from: number, to: number): number {
  let total = 0;
  for (let k = from; k <= to; k += 1) total += distribution.pmf(k);
  return total;
}

function momentsOver(distribution: DiscreteDistribution, from: number, to: number) {
  let mean = 0;
  let second = 0;
  for (let k = from; k <= to; k += 1) {
    mean += k * distribution.pmf(k);
    second += k * k * distribution.pmf(k);
  }
  return { mean, variance: second - mean * mean };
}

describe('beta-binomial', () => {
  it('is uniform on 0..n when a = b = 1', () => {
    const d = betaBinomial(4, 1, 1);
    for (let k = 0; k <= 4; k += 1) expect(d.pmf(k)).toBeCloseTo(0.2, 12);
    expect(d.cdf(2)).toBeCloseTo(0.6, 12);
  });

  it('has the overdispersed variance', () => {
    const d = betaBinomial(10, 2, 3);
    const moments = momentsOver(d, 0, 10);
    expect(d.mean).toBeCloseTo(4, 12);
    expect(moments.mean).toBeCloseTo(4, 10);
    expect(moments.variance).toBeCloseTo(d.variance, 10);
    expect(d.variance).toBeCloseTo((10 * 0.4 * 0.6 * 15) / 6, 12);
    expect(d.variance).toBeGreaterThan(binomial(10, 0.4).variance);
  });
});

describe('zipf', () => {
  it('matches hand values for N = 3, s = 1', () => {
    const d = zipf(3, 1);
    expect(harmonicNumber(3, 1)).toBeCloseTo(11 / 6, 12);
    expect(d.pmf(1)).toBeCloseTo(6 / 11, 12);
    expect(d.pmf(3)).toBeCloseTo(2 / 11, 12);
    expect(d.mean).toBeCloseTo(3 / (11 / 6), 12);
    expect(d.quantile(0.5)).toBe(1);
    expect(d.quantile(0.6)).toBe(2);
  });

  it('has consistent moments', () => {
    const d = zipf(50, 1.2);
    const moments = momentsOver(d, 1, 50);
    expect(massOver(d, 1, 50)).toBeCloseTo(1, 12);
    expect(moments.mean).toBeCloseTo(d.mean, 10);
    expect(moments.variance).toBeCloseTo(d.variance, 9);
  });
});

describe('logarithmic', () => {
  it('matches the log-series formula', () => {
    const d = logarithmic(0.5);
    expect(d.pmf(1)).toBeCloseTo(0.5 / Math.LN2, 12);
    expect(d.pmf(2)).toBeCloseTo(0.125 / Math.LN2, 12);
    expect(d.mean).toBeCloseTo(1 / Math.LN2, 12);
  });

  it('has consistent moments and sampling', () => {
    const d = logarithmic(0.8);
    const moments = momentsOver(d, 1, 400);
    expect(massOver(d, 1, 400)).toBeCloseTo(1, 12);
    expect(moments.mean).toBeCloseTo(d.mean, 10);
    expect(moments.variance).toBeCloseTo(d.variance, 9);
    const random = new Random(7);
    const draws = Array.from({ length: 40000 }, () => d.sample(random));
    const sampleMean = draws.reduce((sum, value) => sum + value, 0) / draws.length;
    expect(Math.abs(sampleMean - d.mean)).toBeLessThan(0.05);
    const ones = draws.filter((value) => value === 1).length / draws.length;
    expect(Math.abs(ones - d.pmf(1))).toBeLessThan(0.01);
  });
});

describe('zero-inflated Poisson', () => {
  it('adds structural zeros', () => {
    const d = zeroInflatedPoisson(0.3, 2);
    expect(d.pmf(0)).toBeCloseTo(0.3 + 0.7 * Math.exp(-2), 12);
    expect(d.pmf(2)).toBeCloseTo(0.7 * 2 * Math.exp(-2), 12);
    const moments = momentsOver(d, 0, 80);
    expect(moments.mean).toBeCloseTo(1.4, 10);
    expect(moments.variance).toBeCloseTo(d.variance, 10);
    expect(d.variance).toBeCloseTo(1.4 * (1 + 0.6), 12);
  });
});

describe('skellam', () => {
  it('matches the Bessel expression', () => {
    const d = skellam(3, 2);
    for (const k of [-3, 0, 1, 4]) {
      const expected = Math.exp(-5) * (3 / 2) ** (k / 2) * besselI(Math.abs(k), 2 * Math.sqrt(6));
      expect(d.pmf(k)).toBeCloseTo(expected, 12);
    }
  });

  it('has mean mu1 - mu2 and variance mu1 + mu2', () => {
    const d = skellam(4, 1.5);
    const moments = momentsOver(d, -60, 80);
    expect(massOver(d, -60, 80)).toBeCloseTo(1, 12);
    expect(moments.mean).toBeCloseTo(2.5, 10);
    expect(moments.variance).toBeCloseTo(5.5, 9);
    expect(d.cdf(80)).toBeCloseTo(1, 10);
    expect(d.quantile(0.5)).toBe(2);
  });
});

describe('rademacher', () => {
  it('is a fair sign', () => {
    const d = rademacher();
    expect(d.pmf(-1)).toBe(0.5);
    expect(d.pmf(0)).toBe(0);
    expect(d.cdf(0)).toBe(0.5);
  });

  it('sums of signs have the parity of n', () => {
    const d = rademacherSum(4);
    expect(d.pmf(1)).toBe(0);
    expect(d.pmf(0)).toBeCloseTo(6 / 16, 12);
    expect(d.pmf(4)).toBeCloseTo(1 / 16, 12);
    expect(d.cdf(4)).toBeCloseTo(1, 12);
    const moments = momentsOver(d, -4, 4);
    expect(moments.variance).toBeCloseTo(4, 12);
  });
});

describe('sums of discrete uniforms', () => {
  it('gives the triangular law of two dice', () => {
    const d = sumOfDiscreteUniforms(2, 1, 6);
    expect(d.support).toEqual([2, 12]);
    expect(d.pmf(7)).toBeCloseTo(6 / 36, 14);
    expect(d.pmf(2)).toBeCloseTo(1 / 36, 14);
    expect(d.mean).toBeCloseTo(7, 12);
    expect(d.variance).toBeCloseTo(35 / 6, 12);
    expect(d.cdf(4)).toBeCloseTo(6 / 36, 14);
    expect(d.quantile(0.5)).toBe(7);
  });

  it('reduces to the uniform with one die', () => {
    const d = sumOfDiscreteUniforms(1, 0, 9);
    for (let k = 0; k <= 9; k += 1) expect(d.pmf(k)).toBeCloseTo(0.1, 14);
    expect(d.variance).toBeCloseTo(99 / 12, 12);
  });

  it('builds finite distributions from masses', () => {
    const d = finiteDiscrete(-1, [1, 2, 1], 'prueba');
    expect(d.pmf(0)).toBe(0.5);
    expect(d.cdf(-1)).toBe(0.25);
    expect(d.mean).toBeCloseTo(0, 14);
    expect(d.variance).toBeCloseTo(0.5, 14);
  });
});

describe('shifted', () => {
  it('moves the support, the mean and the quantiles', () => {
    const failures = negativeBinomial(3, 0.4);
    const trials = shifted(failures, 3);
    expect(trials.support[0]).toBe(3);
    expect(trials.pmf(5)).toBeCloseTo(failures.pmf(2), 14);
    expect(trials.cdf(5)).toBeCloseTo(failures.cdf(2), 14);
    expect(trials.mean).toBeCloseTo(3 / 0.4, 12);
    expect(trials.variance).toBeCloseTo(failures.variance, 14);
    expect(trials.quantile(0.5)).toBe(failures.quantile(0.5) + 3);
  });
});

describe('multinomial', () => {
  it('evaluates the mass function', () => {
    expect(multinomialPmf([1, 1, 1], [1 / 3, 1 / 3, 1 / 3])).toBeCloseTo(6 / 27, 12);
    expect(multinomialPmf([2, 0], [0.5, 0.5])).toBeCloseTo(0.25, 12);
    expect(multinomialPmf([1, 1], [1, 0])).toBe(0);
  });

  it('samples counts that add up to n with the right means', () => {
    const random = new Random(11);
    const probabilities = [0.5, 0.3, 0.2];
    const totals = [0, 0, 0];
    const repetitions = 5000;
    for (let i = 0; i < repetitions; i += 1) {
      const counts = sampleMultinomial(random, 10, probabilities);
      expect(counts.reduce((sum, count) => sum + count, 0)).toBe(10);
      counts.forEach((count, index) => (totals[index] = (totals[index] ?? 0) + count));
    }
    totals.forEach((total, index) =>
      expect(Math.abs(total / repetitions - 10 * (probabilities[index] ?? 0))).toBeLessThan(0.08),
    );
  });
});
