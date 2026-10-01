import { describe, expect, it } from 'vitest';
import {
  dataInkRatio,
  effectSize,
  lieFactor,
  perceivedRatio,
} from '../../../src/lib/stats/graphics.ts';

describe('graphics integrity', () => {
  it('measures relative change', () => {
    expect(effectSize(50, 60)).toBeCloseTo(0.2, 12);
    expect(effectSize(60, 50)).toBeCloseTo(1 / 6, 12);
  });

  it('gives a lie factor of 1 for bars that start at zero', () => {
    expect(lieFactor(50, 60, 50, 60)).toBeCloseTo(1, 12);
  });

  it('a truncated axis exaggerates the change', () => {
    // Bars from a baseline of 45 have heights 5 and 15: a 200 % change for a 20 % one.
    expect(lieFactor(5, 15, 50, 60)).toBeCloseTo(10, 12);
  });

  it('a pictogram scaled in two dimensions squares the ratio', () => {
    // Areas grow as the square of the value: 1 to 4 for values 1 to 2.
    expect(lieFactor(1, 4, 1, 2)).toBeCloseTo(3, 12);
  });

  it('applies the power law to ratios', () => {
    expect(perceivedRatio(4, 1)).toBeCloseTo(4, 12);
    expect(perceivedRatio(4, 0.5)).toBeCloseTo(2, 12);
  });

  it('computes the data-ink ratio', () => {
    expect(dataInkRatio(30, 70)).toBeCloseTo(0.3, 12);
    expect(dataInkRatio(0, 0)).toBe(0);
  });
});
