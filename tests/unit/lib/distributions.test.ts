import { describe, expect, it } from 'vitest';
import {
  bernoulli,
  beta,
  binomial,
  categorical,
  cauchy,
  chiSquare,
  choose,
  discreteUniform,
  exponential,
  fisherF,
  gamma,
  geometric,
  gumbel,
  hypergeometric,
  laplace,
  logistic,
  lognormal,
  negativeBinomial,
  normal,
  pareto,
  poisson,
  rayleigh,
  studentT,
  triangular,
  uniform,
  weibull,
  type ContinuousDistribution,
  type DiscreteDistribution,
} from '../../../src/lib/distributions/index.ts';
import { Random } from '../../../src/lib/random/index.ts';

describe('continuous distributions: reference values', () => {
  it('normal', () => {
    const d = normal(10, 2);
    expect(d.pdf(10)).toBeCloseTo(1 / (2 * Math.sqrt(2 * Math.PI)), 12);
    expect(d.cdf(13.92)).toBeCloseTo(0.9750021048517795, 12);
    expect(d.quantile(0.5)).toBeCloseTo(10, 12);
  });

  it('student t', () => {
    const d = studentT(10);
    expect(d.cdf(2.228138851964938)).toBeCloseTo(0.975, 10);
    expect(d.quantile(0.975)).toBeCloseTo(2.228138851964938, 8);
    expect(d.pdf(0)).toBeCloseTo(0.389108383966031, 12);
    expect(d.variance).toBeCloseTo(1.25, 12);
  });

  it('chi-square and F', () => {
    expect(chiSquare(1).cdf(3.841458820694124)).toBeCloseTo(0.95, 10);
    expect(chiSquare(5).quantile(0.95)).toBeCloseTo(11.070497693516351, 8);
    expect(fisherF(3, 20).quantile(0.95)).toBeCloseTo(3.0983912121407795, 7);
  });

  it('gamma, exponential and beta', () => {
    expect(gamma(2, 1).cdf(1)).toBeCloseTo(1 - 2 / Math.E, 12);
    expect(gamma(3, 2).mean).toBe(1.5);
    expect(exponential(0.5).quantile(0.5)).toBeCloseTo(2 * Math.LN2, 12);
    expect(beta(2, 3).cdf(0.5)).toBeCloseTo(0.6875, 12);
    expect(beta(2, 3).pdf(0.5)).toBeCloseTo(1.5, 12);
    expect(beta(0.5, 0.5).quantile(0.5)).toBeCloseTo(0.5, 9);
  });

  it('other families', () => {
    expect(lognormal(0, 1).quantile(0.5)).toBeCloseTo(1, 12);
    expect(weibull(2, 1).cdf(1)).toBeCloseTo(1 - Math.exp(-1), 12);
    expect(cauchy(0, 1).cdf(1)).toBeCloseTo(0.75, 12);
    expect(laplace(0, 1).cdf(0)).toBe(0.5);
    expect(logistic(0, 1).cdf(0)).toBe(0.5);
    expect(pareto(1, 3).mean).toBeCloseTo(1.5, 12);
    expect(triangular(0, 1, 3).cdf(1)).toBeCloseTo(1 / 3, 12);
    expect(rayleigh(1).quantile(1 - Math.exp(-0.5))).toBeCloseTo(1, 12);
    expect(gumbel(0, 1).cdf(0)).toBeCloseTo(Math.exp(-1), 12);
    expect(uniform(2, 6).variance).toBeCloseTo(16 / 12, 12);
  });
});

describe('discrete distributions: reference values', () => {
  it('binomial', () => {
    const d = binomial(10, 0.5);
    expect(d.pmf(5)).toBeCloseTo(0.24609375, 12);
    expect(d.cdf(5)).toBeCloseTo(0.623046875, 12);
    expect(d.quantile(0.623046875)).toBe(5);
    expect(d.quantile(0.63)).toBe(6);
  });

  it('poisson', () => {
    const d = poisson(2);
    expect(d.pmf(3)).toBeCloseTo((Math.exp(-2) * 8) / 6, 12);
    expect(d.cdf(3)).toBeCloseTo(Math.exp(-2) * (1 + 2 + 2 + 4 / 3), 12);
    expect(d.quantile(0.5)).toBe(2);
  });

  it('geometric, negative binomial and hypergeometric', () => {
    expect(geometric(0.2).pmf(3)).toBeCloseTo(0.128, 12);
    expect(geometric(0.2).cdf(3)).toBeCloseTo(0.488, 12);
    expect(geometric(0.2).quantile(0.488)).toBe(3);
    expect(negativeBinomial(3, 0.5).pmf(2)).toBeCloseTo(0.1875, 12);
    expect(negativeBinomial(3, 0.5).cdf(2)).toBeCloseTo(0.125 + 0.1875 + 0.1875, 12);
    expect(hypergeometric(50, 5, 10).pmf(1)).toBeCloseTo((5 * choose(45, 9)) / choose(50, 10), 12);
    expect(hypergeometric(50, 5, 10).mean).toBe(1);
  });

  it('bernoulli, discrete uniform and categorical', () => {
    expect(bernoulli(0.3).variance).toBeCloseTo(0.21, 12);
    expect(discreteUniform(1, 6).mean).toBe(3.5);
    expect(discreteUniform(1, 6).variance).toBeCloseTo(35 / 12, 12);
    expect(discreteUniform(1, 6).quantile(0.5)).toBe(3);
    const c = categorical([1, 1, 2]);
    expect(c.pmf(2)).toBe(0.5);
    expect(c.quantile(0.3)).toBe(1);
  });
});

const CONTINUOUS: ContinuousDistribution[] = [
  normal(1, 2),
  exponential(1.5),
  gamma(0.7, 2),
  gamma(4, 0.5),
  beta(2, 5),
  beta(0.5, 0.8),
  studentT(3),
  fisherF(4, 12),
  lognormal(0.5, 0.4),
  weibull(1.5, 2),
  chiSquare(7),
  laplace(0, 2),
  logistic(1, 0.5),
  pareto(2, 3),
  triangular(0, 2, 5),
  gumbel(1, 2),
];

describe('continuous distributions: internal consistency', () => {
  it('quantile inverts the cdf', () => {
    for (const d of CONTINUOUS) {
      for (const p of [0.01, 0.25, 0.5, 0.9, 0.995]) {
        expect(d.cdf(d.quantile(p)), `${d.name} p=${p}`).toBeCloseTo(p, 8);
      }
    }
  });

  it('the density integrates to the cdf', () => {
    for (const d of CONTINUOUS) {
      const a = d.quantile(0.1);
      const b = d.quantile(0.8);
      const steps = 4000;
      const h = (b - a) / steps;
      let integral = 0;
      for (let i = 0; i < steps; i += 1) {
        const x0 = a + i * h;
        integral += (h / 6) * (d.pdf(x0) + 4 * d.pdf(x0 + h / 2) + d.pdf(x0 + h));
      }
      expect(integral, d.name).toBeCloseTo(0.7, 6);
    }
  });

  it('samples reproduce mean and variance', () => {
    const random = new Random(7);
    for (const d of CONTINUOUS) {
      if (!Number.isFinite(d.variance)) continue;
      const values = Array.from({ length: 30_000 }, () => d.sample(random));
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      expect(Math.abs(mean - d.mean), d.name).toBeLessThan(
        5 * Math.sqrt(d.variance / values.length),
      );
    }
  });
});

const DISCRETE: DiscreteDistribution[] = [
  binomial(12, 0.3),
  poisson(4.2),
  geometric(0.3),
  negativeBinomial(4, 0.4),
  hypergeometric(30, 12, 8),
  discreteUniform(-2, 5),
];

describe('discrete distributions: internal consistency', () => {
  it('the mass sums to one and matches the cdf', () => {
    for (const d of DISCRETE) {
      let total = 0;
      const upper = Number.isFinite(d.support[1]) ? d.support[1] : 200;
      for (let k = d.support[0]; k <= upper; k += 1) {
        total += d.pmf(k);
        expect(d.cdf(k), `${d.name} k=${k}`).toBeCloseTo(Math.min(1, total), 9);
      }
      expect(total, d.name).toBeCloseTo(1, 9);
    }
  });

  it('the quantile is the smallest k with cdf(k) >= p', () => {
    for (const d of DISCRETE) {
      for (const p of [0.05, 0.3, 0.5, 0.77, 0.99]) {
        const k = d.quantile(p);
        expect(d.cdf(k), d.name).toBeGreaterThanOrEqual(p - 1e-12);
        if (k > d.support[0]) expect(d.cdf(k - 1), d.name).toBeLessThan(p);
      }
    }
  });

  it('samples reproduce the mean', () => {
    const random = new Random(8);
    for (const d of DISCRETE) {
      const values = Array.from({ length: 30_000 }, () => d.sample(random));
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      expect(Math.abs(mean - d.mean), d.name).toBeLessThan(
        5 * Math.sqrt(d.variance / values.length),
      );
    }
  });
});
