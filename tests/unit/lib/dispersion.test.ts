import { describe, expect, it } from 'vitest';
import {
  boxplotStats,
  coefficientOfVariation,
  modifiedZScores,
  quantileRank,
  spreadMeasure,
} from '../../../src/lib/stats/dispersion.ts';
import { quantile, type QuantileMethod } from '../../../src/lib/stats/index.ts';

describe('dispersion', () => {
  it('computes spread measures on known data', () => {
    const plants = [12, 15, 11, 18, 14];
    expect(spreadMeasure('varianza', plants)).toBeCloseTo(7.5, 12);
    expect(spreadMeasure('varianza-n', plants)).toBeCloseTo(6, 12);
    expect(spreadMeasure('rango', plants)).toBe(7);
    expect(spreadMeasure('dam', [15, 18, 22, 20, 25])).toBeCloseTo(2.8, 12);
    expect(spreadMeasure('mad', [12, 14, 15, 15, 17, 20, 31])).toBe(2);
    expect(spreadMeasure('riq', [18, 22, 25, 27, 30, 31, 35, 38, 44, 60])).toBeCloseTo(11.75, 12);
    expect(coefficientOfVariation([498, 503, 500, 497, 502])).toBeCloseTo(0.0051, 4);
    expect(coefficientOfVariation([-2, 1, 3, 0, -1])).toBeGreaterThan(9);
    expect(coefficientOfVariation([-3, -1])).toBeNaN();
  });

  it('builds Tukey boxplots', () => {
    const stats = boxplotStats([52, 55, 58, 60, 61, 63, 64, 66, 70, 95]);
    expect(stats.q1).toBeCloseTo(58.5, 12);
    expect(stats.q3).toBeCloseTo(65.5, 12);
    expect(stats.upperFence).toBeCloseTo(76, 12);
    expect(stats.upperWhisker).toBe(70);
    expect(stats.outliers).toEqual([95]);
  });

  it('matches the nine Hyndman and Fan definitions', () => {
    // Reference values from an independent implementation of the same definitions.
    const data = [3, 6, 7, 8, 8, 10, 13, 15];
    const expected: Record<QuantileMethod, [number, number]> = {
      1: [6, 15],
      2: [6.5, 15],
      4: [6, 13.4],
      5: [6.5, 14.4],
      6: [6.25, 15],
      7: [6.75, 13.6],
      8: [6.4167, 14.6667],
      9: [6.4375, 14.6],
    };
    for (const [method, [q25, q90]] of Object.entries(expected)) {
      expect(quantile(data, 0.25, Number(method) as QuantileMethod)).toBeCloseTo(q25, 3);
      expect(quantile(data, 0.9, Number(method) as QuantileMethod)).toBeCloseTo(q90, 3);
    }
    expect(quantileRank(8, 0.25, 7)).toBeCloseTo(2.75, 12);
    expect(quantileRank(8, 0.25, 6)).toBeCloseTo(2.25, 12);
  });

  it('computes modified z-scores', () => {
    const z = modifiedZScores([2, 3, 3, 4, 5, 6, 8, 12, 25]);
    expect(z[8]).toBeCloseTo(6.745, 3);
    expect(modifiedZScores([1, 1, 1])[0]).toBeNaN();
  });
});
