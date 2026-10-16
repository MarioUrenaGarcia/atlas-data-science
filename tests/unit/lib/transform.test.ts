import { describe, expect, it } from 'vitest';
import { exponential, normal, uniform } from '../../../src/lib/distributions/index.ts';
import {
  transformedCdf,
  transformedDensity,
  transformOf,
} from '../../../src/lib/probability/transform.ts';

describe('transformations of random variables', () => {
  it('turn a standard normal squared into a chi-square with one degree of freedom', () => {
    const z = normal(0, 1);
    const square = transformOf('cuadrado');
    // Chi-square(1) density: e^{-y/2} / sqrt(2 pi y).
    const y = 0.7;
    expect(transformedDensity((x) => z.pdf(x), square, y)).toBeCloseTo(
      Math.exp(-y / 2) / Math.sqrt(2 * Math.PI * y),
    );
    expect(transformedCdf((x) => z.cdf(x), square, 1, -8, 8)).toBeCloseTo(0.6827, 4);
  });

  it('map a uniform through minus log to an exponential', () => {
    const u = uniform(0, 1);
    const minusLog = transformOf('logaritmo-negativo');
    expect(transformedDensity((x) => u.pdf(x), minusLog, 1.3)).toBeCloseTo(Math.exp(-1.3));
  });

  it('scale densities linearly', () => {
    const e = exponential(1);
    const linear = transformOf('lineal', 2, 1);
    expect(transformedDensity((x) => e.pdf(x), linear, 3)).toBeCloseTo(e.pdf(1) / 2);
    expect(transformedDensity((x) => e.pdf(x), transformOf('exponencial'), -1)).toBe(0);
  });
});
