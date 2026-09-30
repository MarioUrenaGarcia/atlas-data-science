import { describe, expect, it } from 'vitest';
import { formatFraction, fractionLatex } from '../../../src/lib/format/number.ts';

describe('formatFraction', () => {
  it('writes small rationals as fractions', () => {
    expect(formatFraction(0.5)).toBe('1/2');
    expect(formatFraction(-2 / 3)).toBe('-2/3');
    expect(formatFraction(3)).toBe('3');
    expect(formatFraction(-1e-12)).toBe('0');
  });

  it('falls back to decimals for irrationals', () => {
    expect(formatFraction(Math.SQRT2)).toBe('1.414');
  });

  it('produces LaTeX fractions', () => {
    expect(fractionLatex(-0.25)).toBe('-\tfrac{1}{4}');
    expect(fractionLatex(2)).toBe('2');
  });
});
