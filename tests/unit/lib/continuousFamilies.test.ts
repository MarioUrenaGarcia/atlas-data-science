import { describe, expect, it } from 'vitest';
import {
  besselI,
  cauchy,
  chiSquare,
  frechet,
  irwinHall,
  inverseGamma,
  kumaraswamy,
  levy,
  noncentralChiSquare,
  noncentralT,
  normal,
  rayleigh,
  rice,
  simpsonIntegral,
  skewNormal,
  stable,
  stableTailConstant,
  studentT,
  truncatedNormal,
  vonMises,
  vonMisesConcentration,
  type ContinuousDistribution,
} from '../../../src/lib/distributions/index.ts';
import { Random } from '../../../src/lib/random/index.ts';

function integral(d: ContinuousDistribution, a: number, b: number, g: (x: number) => number = () => 1) {
  return simpsonIntegral((x) => g(x) * d.pdf(x), a, b, 4000);
}

function sampleMean(d: ContinuousDistribution, n = 40000, seed = 3) {
  const random = new Random(seed);
  let total = 0;
  for (let i = 0; i < n; i += 1) total += d.sample(random);
  return total / n;
}

describe('Bessel functions', () => {
  it('match reference values in both regimes', () => {
    expect(besselI(0, 1)).toBeCloseTo(1.2660658777520082, 12);
    expect(besselI(1, 1)).toBeCloseTo(0.5651591039924851, 12);
    expect(besselI(0, 20) / 4.355828255955353e7).toBeCloseTo(1, 8);
    expect(besselI(1, 20) / 4.245497338512777e7).toBeCloseTo(1, 8);
  });
});

describe('Frechet', () => {
  it('has the extreme value cdf and the gamma-function mean', () => {
    const d = frechet(3, 2, 1);
    expect(d.cdf(3)).toBeCloseTo(Math.exp(-1), 12);
    expect(d.quantile(Math.exp(-1))).toBeCloseTo(3, 10);
    expect(d.mean).toBeCloseTo(1 + 2 * 1.3541179394264, 9);
    expect(integral(d, 1, 400)).toBeCloseTo(1, 3);
  });
});

describe('Rice', () => {
  it('reduces to Rayleigh when nu = 0', () => {
    const d = rice(0, 1.5);
    const r = rayleigh(1.5);
    for (const x of [0.5, 1, 2.5]) expect(d.pdf(x)).toBeCloseTo(r.pdf(x), 10);
    expect(d.mean).toBeCloseTo(r.mean, 10);
  });

  it('has consistent moments for nu > 0', () => {
    const d = rice(3, 1);
    expect(integral(d, 0, 20)).toBeCloseTo(1, 6);
    expect(integral(d, 0, 20, (x) => x)).toBeCloseTo(d.mean, 6);
    expect(integral(d, 0, 20, (x) => x * x)).toBeCloseTo(11, 6);
    expect(d.cdf(3)).toBeCloseTo(integral(d, 0, 3), 5);
    expect(Math.abs(sampleMean(d) - d.mean)).toBeLessThan(0.02);
  });
});

describe('von Mises', () => {
  it('is uniform with kappa = 0 and integrates to one', () => {
    const flat = vonMises(0, 0);
    expect(flat.pdf(1)).toBeCloseTo(1 / (2 * Math.PI), 12);
    const d = vonMises(1, 4);
    expect(integral(d, 1 - Math.PI, 1 + Math.PI)).toBeCloseTo(1, 8);
    expect(d.cdf(1)).toBeCloseTo(0.5, 6);
    expect(integral(d, 1 - Math.PI, 1 + Math.PI, (x) => Math.cos(x - 1))).toBeCloseTo(
      vonMisesConcentration(4),
      8,
    );
  });

  it('samples with the right concentration', () => {
    const d = vonMises(0.5, 2);
    const random = new Random(9);
    let total = 0;
    const n = 30000;
    for (let i = 0; i < n; i += 1) total += Math.cos(d.sample(random) - 0.5);
    expect(Math.abs(total / n - vonMisesConcentration(2))).toBeLessThan(0.01);
  });
});

describe('truncated normal', () => {
  it('matches the half-normal and the two-sided formulas', () => {
    const half = truncatedNormal(0, 1, 0, Number.POSITIVE_INFINITY);
    expect(half.mean).toBeCloseTo(Math.sqrt(2 / Math.PI), 12);
    expect(half.variance).toBeCloseTo(1 - 2 / Math.PI, 12);
    const d = truncatedNormal(1, 2, -1, 4);
    expect(integral(d, -1, 4)).toBeCloseTo(1, 8);
    expect(integral(d, -1, 4, (x) => x)).toBeCloseTo(d.mean, 8);
    expect(integral(d, -1, 4, (x) => (x - d.mean) ** 2)).toBeCloseTo(d.variance, 8);
    expect(d.cdf(d.quantile(0.3))).toBeCloseTo(0.3, 10);
  });
});

describe('skew normal', () => {
  it('is normal with alpha = 0 and has the Azzalini moments', () => {
    expect(skewNormal(1, 2, 0).pdf(2)).toBeCloseTo(normal(1, 2).pdf(2), 12);
    const d = skewNormal(0, 1.5, 4);
    expect(integral(d, -15, 15)).toBeCloseTo(1, 8);
    expect(integral(d, -15, 15, (x) => x)).toBeCloseTo(d.mean, 8);
    expect(integral(d, -15, 15, (x) => (x - d.mean) ** 2)).toBeCloseTo(d.variance, 7);
    expect(Math.abs(sampleMean(d) - d.mean)).toBeLessThan(0.02);
  });
});

describe('inverse gamma', () => {
  it('has the closed-form moments', () => {
    const d = inverseGamma(4, 6);
    expect(d.mean).toBeCloseTo(2, 12);
    expect(d.variance).toBeCloseTo(2, 12);
    expect(integral(d, 1e-6, 200)).toBeCloseTo(1, 5);
    expect(d.cdf(2)).toBeCloseTo(integral(d, 1e-6, 2), 6);
  });
});

describe('noncentral chi-square', () => {
  it('reduces to the central case and has mean k + lambda', () => {
    const central = noncentralChiSquare(4, 0);
    expect(central.pdf(3)).toBeCloseTo(chiSquare(4).pdf(3), 12);
    const d = noncentralChiSquare(3, 5);
    // Simpson loses some accuracy near the square-root behavior at 0.
    expect(integral(d, 1e-9, 120)).toBeCloseTo(1, 4);
    expect(integral(d, 1e-9, 120, (x) => x)).toBeCloseTo(8, 3);
    expect(integral(d, 1e-9, 120, (x) => (x - 8) ** 2)).toBeCloseTo(26, 2);
    expect(d.cdf(6)).toBeCloseTo(integral(d, 1e-9, 6), 4);
    expect(Math.abs(sampleMean(d) - 8)).toBeLessThan(0.08);
  });
});

describe('noncentral t', () => {
  it('reduces to Student t and has the noncentral mean', () => {
    const central = noncentralT(6, 0);
    expect(central.pdf(0.7)).toBeCloseTo(studentT(6).pdf(0.7), 6);
    expect(central.cdf(1.2)).toBeCloseTo(studentT(6).cdf(1.2), 6);
    const d = noncentralT(8, 1.5);
    expect(integral(d, -20, 40)).toBeCloseTo(1, 4);
    expect(integral(d, -20, 40, (x) => x)).toBeCloseTo(d.mean, 3);
    expect(Math.abs(sampleMean(d) - d.mean)).toBeLessThan(0.03);
  });
});

describe('Kumaraswamy', () => {
  it('has closed-form cdf, quantile and moments', () => {
    const d = kumaraswamy(2, 3);
    expect(d.cdf(0.5)).toBeCloseTo(1 - 0.75 ** 3, 12);
    expect(d.quantile(d.cdf(0.4))).toBeCloseTo(0.4, 12);
    expect(integral(d, 0, 1, (x) => x)).toBeCloseTo(d.mean, 8);
    expect(integral(d, 0, 1, (x) => (x - d.mean) ** 2)).toBeCloseTo(d.variance, 8);
  });
});

describe('Levy', () => {
  it('is the law of c / Z^2', () => {
    const d = levy(0, 2);
    expect(d.cdf(d.quantile(0.4))).toBeCloseTo(0.4, 10);
    expect(d.cdf(2)).toBeCloseTo(2 * (1 - 0.8413447460685429), 9);
    expect(integral(d, 1e-9, 4)).toBeCloseTo(d.cdf(4), 5);
  });
});

describe('stable', () => {
  it('matches the normal, Cauchy and Levy special cases', () => {
    const gaussian = stable(2, 0, 1, 0.5);
    const reference = normal(0.5, Math.SQRT2);
    for (const x of [-1, 0.5, 2]) {
      expect(gaussian.pdf(x)).toBeCloseTo(reference.pdf(x), 5);
      expect(gaussian.cdf(x)).toBeCloseTo(reference.cdf(x), 5);
    }
    const lorentz = stable(1, 0, 1.5, -1);
    const c = cauchy(-1, 1.5);
    for (const x of [-3, -1, 2]) {
      expect(lorentz.pdf(x)).toBeCloseTo(c.pdf(x), 5);
      expect(lorentz.cdf(x)).toBeCloseTo(c.cdf(x), 4);
    }
    const heavy = stable(0.5, 1, 1, 0);
    const l = levy(0, 1);
    for (const x of [0.5, 1, 3]) expect(heavy.pdf(x)).toBeCloseTo(l.pdf(x), 4);
  });

  it('samples reproduce the cdf', () => {
    const d = stable(1.5, 0.5, 1, 0);
    const random = new Random(5);
    const n = 20000;
    let below = 0;
    for (let i = 0; i < n; i += 1) if (d.sample(random) <= 0.5) below += 1;
    expect(Math.abs(below / n - d.cdf(0.5))).toBeLessThan(0.012);
  });
});

describe('Irwin-Hall', () => {
  it('is triangular for two uniforms and integrates to one', () => {
    const two = irwinHall(2);
    expect(two.pdf(0.5)).toBeCloseTo(0.5, 12);
    expect(two.pdf(1)).toBeCloseTo(1, 12);
    expect(two.cdf(1.5)).toBeCloseTo(0.875, 12);
    const twelve = irwinHall(12);
    expect(integral(twelve, 0, 12)).toBeCloseTo(1, 8);
    expect(integral(twelve, 0, 12, (x) => (x - 6) ** 2)).toBeCloseTo(1, 7);
    expect(twelve.quantile(0.5)).toBeCloseTo(6, 8);
  });
});

describe('stable tail constant', () => {
  it('is continuous at alpha = 1 and gives the Cauchy scale', () => {
    expect(stableTailConstant(1)).toBeCloseTo(2 / Math.PI, 12);
    expect(stableTailConstant(1 + 1e-4)).toBeCloseTo(2 / Math.PI, 3);
    // A Cauchy has P(|X| > x) ~ 2 gamma / (pi x), the tail constant with alpha = 1.
    expect(stableTailConstant(1.5)).toBeGreaterThan(0);
  });
});
