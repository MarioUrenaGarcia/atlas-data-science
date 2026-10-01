import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import { excessKurtosis, mean, skewness, standardDeviation } from '../../../src/lib/stats/index.ts';
import {
  densityModes,
  drawSample,
  familyMoments,
  tailFraction,
} from '../../../src/lib/stats/shape.ts';

describe('distribution shape', () => {
  it('draws standardized samples whose moments approach the family moments', () => {
    const skewed = drawSample({ family: 'sesgo-derecha', shape: 4 }, 20000, new Random(1));
    expect(mean(skewed)).toBeCloseTo(0, 1);
    expect(standardDeviation(skewed)).toBeCloseTo(1, 1);
    expect(skewness(skewed)).toBeCloseTo(
      familyMoments({ family: 'sesgo-derecha', shape: 4 }).skewness,
      0,
    );
    const uniform = drawSample({ family: 'uniforme', shape: 1 }, 20000, new Random(2));
    expect(excessKurtosis(uniform)).toBeCloseTo(-1.2, 1);
    const left = drawSample({ family: 'sesgo-izquierda', shape: 2 }, 5000, new Random(3));
    expect(skewness(left)).toBeLessThan(-0.8);
  });

  it('computes mixture moments', () => {
    expect(familyMoments({ family: 'mezcla', shape: 3, weight: 0.5 }).kurtosis).toBeCloseTo(
      -0.9586,
      3,
    );
    expect(familyMoments({ family: 'mezcla', shape: 3, weight: 0.5 }).skewness).toBeCloseTo(0, 10);
    expect(familyMoments({ family: 'colas-pesadas', shape: 5 }).kurtosis).toBeCloseTo(6, 10);
  });

  it('finds modes and tail fractions', () => {
    const bimodal = (x: number) => Math.exp(-((x + 2) ** 2) / 2) + Math.exp(-((x - 2) ** 2) / 2);
    expect(densityModes(bimodal, [-6, 6]).length).toBe(2);
    const unimodal = (x: number) =>
      Math.exp(-((x + 0.7) ** 2) / 2) + Math.exp(-((x - 0.7) ** 2) / 2);
    expect(densityModes(unimodal, [-6, 6]).length).toBe(1);
    expect(tailFraction([0, 0, 0, 0, 0, 0, 0, 0, 0, 10], 2)).toBeCloseTo(0.1, 10);
  });
});
