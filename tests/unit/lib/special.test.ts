import { describe, expect, it } from 'vitest';
import {
  choose,
  erf,
  erfc,
  gammaFunction,
  invertMonotone,
  logBeta,
  logGamma,
  regularizedBeta,
  regularizedGammaP,
  regularizedGammaQ,
  standardNormalCdf,
  standardNormalQuantile,
} from '../../../src/lib/distributions/special.ts';

const TOLERANCE = 12;

describe('gamma and beta functions', () => {
  it('matches known values', () => {
    expect(logGamma(0.5)).toBeCloseTo(0.5723649429247001, TOLERANCE);
    expect(logGamma(10)).toBeCloseTo(Math.log(362880), TOLERANCE);
    expect(gammaFunction(5)).toBe(24);
    expect(gammaFunction(0.5)).toBeCloseTo(Math.sqrt(Math.PI), TOLERANCE);
    expect(gammaFunction(-0.5)).toBeCloseTo(-2 * Math.sqrt(Math.PI), 10);
    expect(logBeta(2, 3)).toBeCloseTo(Math.log(1 / 12), TOLERANCE);
  });

  it('computes binomial coefficients exactly', () => {
    expect(choose(10, 3)).toBe(120);
    expect(choose(50, 25)).toBe(126410606437752);
    expect(choose(5, 7)).toBe(0);
  });
});

describe('incomplete gamma and beta', () => {
  it('matches closed forms', () => {
    expect(regularizedGammaP(1, 1)).toBeCloseTo(1 - Math.exp(-1), TOLERANCE);
    expect(regularizedGammaP(2, 1)).toBeCloseTo(1 - 2 / Math.E, TOLERANCE);
    expect(regularizedGammaP(3, 10) + regularizedGammaQ(3, 10)).toBeCloseTo(1, TOLERANCE);
    expect(regularizedBeta(0.5, 2, 3)).toBeCloseTo(0.6875, TOLERANCE);
    expect(regularizedBeta(0.3, 1, 1)).toBeCloseTo(0.3, TOLERANCE);
    expect(regularizedBeta(0.9, 5, 0.5)).toBeCloseTo(1 - regularizedBeta(0.1, 0.5, 5), TOLERANCE);
  });
});

describe('error function and normal', () => {
  it('matches reference values', () => {
    expect(erf(1)).toBeCloseTo(0.8427007929497149, TOLERANCE);
    expect(erf(-0.5)).toBeCloseTo(-0.5204998778130465, TOLERANCE);
    expect(erfc(2)).toBeCloseTo(0.004677734981047266, 14);
    expect(standardNormalCdf(1.96)).toBeCloseTo(0.9750021048517795, TOLERANCE);
    expect(standardNormalCdf(-3)).toBeCloseTo(0.0013498980316301, 13);
  });

  it('inverts the normal cdf accurately', () => {
    expect(standardNormalQuantile(0.975)).toBeCloseTo(1.959963984540054, TOLERANCE);
    expect(standardNormalQuantile(0.001)).toBeCloseTo(-3.090232306167813, TOLERANCE);
    expect(standardNormalQuantile(0.5)).toBe(0);
    for (const p of [1e-8, 0.01, 0.2, 0.7, 0.999999]) {
      expect(standardNormalCdf(standardNormalQuantile(p))).toBeCloseTo(p, 12);
    }
  });
});

describe('invertMonotone', () => {
  it('finds roots with infinite brackets', () => {
    expect(
      invertMonotone((x) => x * x * x, 27, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    ).toBeCloseTo(3, 9);
    expect(invertMonotone((x) => 1 - 5 / x, 0.5, 5, Number.POSITIVE_INFINITY)).toBeCloseTo(10, 8);
  });
});
