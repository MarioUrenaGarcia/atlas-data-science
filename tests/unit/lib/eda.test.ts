import { describe, expect, it } from 'vitest';
import {
  ENTRY_ERRORS,
  boxCox,
  homesDataset,
  iqrOutliers,
  missingDemo,
  missingPatterns,
  modifiedZScores,
  optimalLambda,
  profileColumn,
  profileLogLikelihood,
  tukeyFences,
  yeoJohnson,
  zScoresOf,
} from '../../../src/lib/stats/eda.ts';
import { skewness } from '../../../src/lib/stats/index.ts';

describe('power transforms', () => {
  it('Box-Cox matches its closed forms', () => {
    expect(boxCox(4, 0.5)).toBeCloseTo(2, 12);
    expect(boxCox(Math.E, 0)).toBeCloseTo(1, 12);
    expect(boxCox(3, 1)).toBeCloseTo(2, 12);
    // Continuity at lambda = 0.
    expect(boxCox(5, 1e-7)).toBeCloseTo(Math.log(5), 5);
  });

  it('Yeo-Johnson handles both signs and is continuous at zero', () => {
    expect(yeoJohnson(3, 1)).toBeCloseTo(3, 12);
    expect(yeoJohnson(-3, 1)).toBeCloseTo(-3, 12);
    expect(yeoJohnson(0, 0.4)).toBeCloseTo(0, 12);
    expect(yeoJohnson(-1, 2)).toBeCloseTo(-Math.log(2), 12);
    expect(yeoJohnson(1, 0)).toBeCloseTo(Math.log(2), 12);
    expect(yeoJohnson(1e-9, 0.7)).toBeCloseTo(yeoJohnson(-1e-9, 0.7), 8);
  });

  it('the optimal lambda is near 0 for lognormal data and near 1 for normal data', () => {
    const lognormal = Array.from({ length: 400 }, (_, i) => Math.exp(Math.sin(i * 12.9898) * 1.2));
    expect(Math.abs(optimalLambda('box-cox', lognormal))).toBeLessThan(0.25);
    const normal = Array.from({ length: 400 }, (_, i) => 50 + 5 * Math.sin(i * 78.233) * 1.5);
    const lambda = optimalLambda('yeo-johnson', normal);
    expect(profileLogLikelihood('yeo-johnson', normal, lambda)).toBeGreaterThanOrEqual(
      profileLogLikelihood('yeo-johnson', normal, 1) - 1e-9,
    );
  });
});

describe('outliers', () => {
  const data = [10, 12, 12, 13, 14, 15, 16, 18, 60];

  it('computes Tukey fences with type 7 quartiles', () => {
    const f = tukeyFences(data);
    expect(f.q1).toBeCloseTo(12, 12);
    expect(f.q3).toBeCloseTo(16, 12);
    expect(f.lower).toBeCloseTo(6, 12);
    expect(f.upper).toBeCloseTo(22, 12);
    expect(iqrOutliers(data)).toEqual([8]);
  });

  it('the extreme value inflates the z-scores but not the modified ones', () => {
    const z = zScoresOf(data);
    const mz = modifiedZScores(data);
    expect(Math.abs(z[8] ?? 0)).toBeLessThan(3);
    expect(mz[8] ?? 0).toBeGreaterThan(3.5);
  });
});

describe('profiling and missing values', () => {
  it('profiles numeric and categorical columns', () => {
    const p = profileColumn('edad', [20, 30, null, 30, 40]);
    expect(p.kind).toBe('numerica');
    expect(p.missing).toBe(1);
    expect(p.distinct).toBe(3);
    expect(p.mean).toBeCloseTo(30, 12);
    expect(p.mode).toEqual({ value: '30', count: 2 });
    const c = profileColumn('color', ['rojo', 'azul', 'rojo', null]);
    expect(c.kind).toBe('categorica');
    expect(c.top[0]).toEqual({ value: 'rojo', count: 2 });
  });

  it('counts missing patterns', () => {
    const patterns = missingPatterns([
      [1, null],
      [2, 3],
      [null, null],
      [4, null],
    ]);
    expect(patterns.map((p) => p.count)).toEqual([2, 1, 1]);
    expect(patterns[0]?.missing).toEqual([false, true]);
  });

  it('missing income at random keeps the observed mean; hiding high incomes lowers it', () => {
    const mcar = missingDemo('mcar', 4000, 3);
    const mnar = missingDemo('mnar', 4000, 3);
    const observedMean = (d: typeof mcar) => {
      const xs = d.income.filter((_, i) => !d.missing[i]);
      return xs.reduce((t, x) => t + x, 0) / xs.length;
    };
    const trueMean = mcar.income.reduce((t, x) => t + x, 0) / mcar.income.length;
    expect(Math.abs(observedMean(mcar) - trueMean)).toBeLessThan(0.4);
    expect(observedMean(mnar)).toBeLessThan(trueMean - 1.5);
  });
});

describe('homes dataset', () => {
  it('has a right-skewed price, two entry errors and ages missing mostly in the south', () => {
    const homes = homesDataset();
    expect(homes).toHaveLength(200);
    const prices = homes.map((h) => h.precio);
    expect(skewness(prices)).toBeGreaterThan(0.8);
    expect(Math.abs(skewness(prices.map(Math.log)))).toBeLessThan(0.4);
    const outliers = iqrOutliers(homes.map((h) => h.superficie));
    for (const i of ENTRY_ERRORS) expect(outliers).toContain(i);
    const missing = homes.filter((h) => h.antiguedad === null);
    expect(missing.filter((h) => h.zona === 'Sur').length).toBeGreaterThan(missing.length / 2);
  });
});
