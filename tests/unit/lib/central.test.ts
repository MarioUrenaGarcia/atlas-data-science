import { describe, expect, it } from 'vitest';
import {
  centerMeasure,
  extremeIndices,
  midrange,
  quadraticMean,
  trimCount,
  winsorize,
} from '../../../src/lib/stats/central.ts';
import { centerFormula } from '../../../src/visualizations/archetypes/DataStrip/centerFormulas.ts';

describe('central tendency', () => {
  it('computes the classical means', () => {
    expect(centerMeasure('media', [420, 380, 510, 465, 395, 450, 600])).toBe(460);
    expect(centerMeasure('ponderada', [23.5, 24.1, 22.9], { weights: [40, 25, 35] })).toBeCloseTo(
      23.44,
      10,
    );
    expect(centerMeasure('geometrica', [0.8, 1.25])).toBeCloseTo(1, 12);
    expect(centerMeasure('armonica', [12, 36])).toBeCloseTo(18, 12);
    expect(quadraticMean([2, 8])).toBeCloseTo(Math.sqrt(34), 12);
    expect(midrange([14, 31, 20])).toBe(22.5);
  });

  it('returns NaN where a measure is undefined', () => {
    expect(centerMeasure('geometrica', [0, 4, 9])).toBeNaN();
    expect(centerMeasure('armonica', [-4, 2, 6])).toBeNaN();
    expect(centerMeasure('moda', [3, 5, 5, 10, 10])).toBeNaN();
    expect(centerMeasure('moda', [25, 26, 26, 27, 25, 26, 28, 24, 26, 27, 25])).toBe(26);
    expect(centerMeasure('media', [])).toBeNaN();
  });

  it('trims and winsorizes symmetric counts', () => {
    expect(trimCount(7, 0.15)).toBe(1);
    expect(centerMeasure('recortada', [7.5, 8, 8, 8.5, 9.5, 6, 8], { proportion: 0.15 })).toBe(8);
    const data = [21.4, 21.9, 22.1, 22, 21.7, 35, 21.8, 22.3, 21.6, 22];
    expect(winsorize(data, 0.1)[5]).toBe(22.3);
    expect(winsorize(data, 0.1)[0]).toBe(21.6);
    expect(centerMeasure('winsorizada', data, { proportion: 0.1 })).toBeCloseTo(21.93, 10);
    const extremes = extremeIndices([5, 1, 9, 3], 0.25);
    expect(extremes).toEqual({ low: [1], high: [2] });
  });

  it('builds the header formula with the current numbers', () => {
    expect(centerFormula('media', [2, 4], { decimals: 0 })).toContain('\\frac{2 + 4}{2} = 3');
    expect(centerFormula('mediana', [29, 34, 38, 41, 45, 52], { decimals: 0 })).toContain('39.50');
    expect(centerFormula('moda', [1, 2, 3], { decimals: 0 })).toContain('no hay moda');
  });
});
