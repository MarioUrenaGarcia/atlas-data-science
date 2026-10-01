import { describe, expect, it } from 'vitest';
import { ANSCOMBE } from '../../../src/lib/stats/anscombe.ts';
import { linearRegression, mean, pearson, variance } from '../../../src/lib/stats/index.ts';

describe('Anscombe quartet', () => {
  it('the four sets share means, variances, correlation and fitted line', () => {
    for (const { x, y } of ANSCOMBE) {
      expect(mean(x)).toBeCloseTo(9, 10);
      expect(variance(x)).toBeCloseTo(11, 10);
      expect(mean(y)).toBeCloseTo(7.5, 2);
      expect(variance(y)).toBeCloseTo(4.12, 1);
      expect(pearson(x, y)).toBeCloseTo(0.816, 2);
      const fit = linearRegression(x, y);
      expect(fit.intercept).toBeCloseTo(3, 1);
      expect(fit.slope).toBeCloseTo(0.5, 2);
    }
  });
});
