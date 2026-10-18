import { describe, expect, it } from 'vitest';
import { logisticRegression } from '../../../src/lib/dataprep/logistic.ts';
import { meanWithVariance, mice } from '../../../src/lib/dataprep/mice.ts';
import {
  calibrateIntercept,
  correlationOnRows,
  imputeSimple,
  knnImpute,
  listwiseRows,
  modeOf,
  pairwiseRows,
  rubinInterval,
  rubinPool,
  simulateMissing,
  tukeyFences,
  winsorizeQuantiles,
  type MissingPoint,
} from '../../../src/lib/dataprep/missing.ts';
import {
  checkCell,
  duplicateGroups,
  standardize,
  stringSimilarity,
} from '../../../src/lib/dataprep/quality.ts';
import { Random } from '../../../src/lib/random/index.ts';
import { mean } from '../../../src/lib/stats/index.ts';

describe('text cleaning and duplicates', () => {
  it('standardizes spaces, case, accents and punctuation, then applies the dictionary', () => {
    const steps = ['espacios', 'minusculas', 'acentos', 'puntuacion'] as const;
    expect(standardize('  Cd. de  México ', steps, { 'cd de mexico': 'ciudad de mexico' })).toBe(
      'ciudad de mexico',
    );
    expect(standardize('Ñandú', ['acentos'])).toBe('Nandu');
  });

  it('measures similarity with the edit distance', () => {
    expect(stringSimilarity('abcd', 'abcd')).toBe(1);
    expect(stringSimilarity('Hernandez', 'Hernandes')).toBeCloseTo(1 - 1 / 9);
  });

  it('groups records transitively above the threshold', () => {
    const groups = duplicateGroups(['ana', 'anaa', 'anaaa', 'luis'], 0.75);
    expect(groups[0]).toBe(groups[1]);
    expect(groups[1]).toBe(groups[2]);
    expect(groups[3]).not.toBe(groups[0]);
  });
});

describe('schema checks', () => {
  const field = {
    name: 'Edad',
    rules: [
      { kind: 'requerido' },
      { kind: 'entero' },
      { kind: 'rango', min: 0, max: 120 },
    ] as const,
  };
  it('flags each broken rule', () => {
    expect(checkCell('45', field)).toEqual([]);
    expect(checkCell('', field).map((r) => r.kind)).toEqual(['requerido']);
    expect(checkCell('38.5', field).map((r) => r.kind)).toEqual(['entero']);
    expect(checkCell('134', field).map((r) => r.kind)).toEqual(['rango']);
  });
});

describe('missing data mechanisms', () => {
  it('calibrates the intercept to the target rate', () => {
    const z = Array.from({ length: 1000 }, (_, i) => (i - 500) / 200);
    const a = calibrateIntercept(z, 1.5, 0.3);
    const avg = mean(z.map((v) => 1 / (1 + Math.exp(-(a + 1.5 * v)))));
    expect(avg).toBeCloseTo(0.3, 6);
  });

  const spec = {
    n: 20000,
    rho: 0.6,
    meanX: 40,
    sdX: 10,
    meanY: 18,
    sdY: 6,
    rate: 0.3,
    strength: 1.5,
  };
  const bias = (points: MissingPoint[]) =>
    mean(points.filter((p) => !p.missing).map((p) => p.y)) - mean(points.map((p) => p.y));

  it('MCAR keeps the observed mean unbiased', () => {
    const points = simulateMissing({ ...spec, mechanism: 'MCAR' }, new Random(1));
    expect(Math.abs(bias(points))).toBeLessThan(0.15);
    expect(points.filter((p) => p.missing).length / points.length).toBeCloseTo(0.3, 1);
  });

  it('MNAR on large values biases the observed mean downward more than MAR', () => {
    const mar = bias(simulateMissing({ ...spec, mechanism: 'MAR' }, new Random(2)));
    const mnar = bias(simulateMissing({ ...spec, mechanism: 'MNAR' }, new Random(2)));
    expect(mar).toBeLessThan(-0.5);
    expect(mnar).toBeLessThan(mar);
  });
});

describe('deletion and simple imputation', () => {
  const table = [
    [1, 2, Number.NaN],
    [2, Number.NaN, 3],
    [3, 4, 5],
    [4, 6, 7],
  ];
  it('listwise keeps complete rows and pairwise keeps rows per pair', () => {
    expect(listwiseRows(table)).toEqual([2, 3]);
    expect(pairwiseRows(table, 0, 1)).toEqual([0, 2, 3]);
    expect(correlationOnRows(table, [0, 2, 3], 0, 1)).toBeCloseTo(0.982, 3);
  });

  it('fills with mean, median and mode of the observed values', () => {
    expect(imputeSimple([1, Number.NaN, 2, 9], 'media')).toEqual([1, 4, 2, 9]);
    expect(imputeSimple([1, Number.NaN, 2, 9], 'mediana')).toEqual([1, 2, 2, 9]);
    expect(modeOf([3, 1, 3, 2, 1, 3])).toBe(3);
  });

  it('imputes with the mean of the k nearest neighbors in x', () => {
    const points = [
      { x: 1, y: 10, missing: false },
      { x: 2, y: 20, missing: false },
      { x: 10, y: 100, missing: false },
      { x: 2.2, y: 0, missing: true },
    ];
    const result = knnImpute(points, 3, 2);
    expect(result.neighbors).toEqual([1, 0]);
    expect(result.value).toBe(15);
  });
});

describe('multiple imputation', () => {
  it('Rubin pooling adds the between variance', () => {
    const pooled = rubinPool([10, 12, 14], [1, 1, 1]);
    expect(pooled.qBar).toBe(12);
    expect(pooled.within).toBe(1);
    expect(pooled.between).toBe(4);
    expect(pooled.total).toBeCloseTo(1 + (4 / 3) * 4);
    expect(pooled.lambda).toBeCloseTo(16 / 3 / (1 + 16 / 3));
    expect(pooled.df).toBeCloseTo(2 / pooled.lambda ** 2);
  });

  it('Rubin interval uses the t quantile with Rubin degrees of freedom', () => {
    const pooled = rubinPool([18.2, 18.6, 18.0], [0.25, 0.27, 0.23]);
    const [lo, hi] = rubinInterval(pooled);
    expect(lo).toBeCloseTo(16.98, 1);
    expect(hi).toBeCloseTo(19.55, 1);
  });

  it('chained equations recover a regression relation and keep observed values', () => {
    const random = new Random(5);
    const table = Array.from({ length: 400 }, () => {
      const x = random.normal();
      const y = 2 * x + random.normal(0, 0.5);
      return [x, random.next() < 0.3 ? Number.NaN : y];
    });
    const run = mice(table, 5, new Random(6));
    const missingRows = table.flatMap((row, i) => (Number.isNaN(row[1] ?? 0) ? [i] : []));
    const ratio = mean(missingRows.map((i) => (run.data[i]?.[1] ?? 0) / (run.data[i]?.[0] ?? 1)));
    expect(Number.isFinite(ratio)).toBe(true);
    const errors = missingRows.map((i) => (run.data[i]?.[1] ?? 0) - 2 * (run.data[i]?.[0] ?? 0));
    expect(Math.abs(mean(errors))).toBeLessThan(0.2);
    expect(run.data[0]?.[0]).toBe(table[0]?.[0]);
    expect(run.trace.means).toHaveLength(6);
    expect(meanWithVariance([1, 2, 3]).variance).toBeCloseTo(1 / 3);
  });
});

describe('outliers and winsorization', () => {
  it('computes Tukey fences', () => {
    expect(tukeyFences([1, 2, 3, 4, 5])).toEqual([-1, 7]);
  });

  it('caps at the quantiles', () => {
    const r = winsorizeQuantiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 100], 0.1);
    expect(r.values[9]).toBeCloseTo(r.high);
    expect(r.clippedHigh).toBe(1);
    expect(r.clippedLow).toBe(1);
  });
});

describe('logistic regression', () => {
  it('recovers known coefficients', () => {
    const random = new Random(11);
    const design: number[][] = [];
    const y: number[] = [];
    for (let i = 0; i < 4000; i += 1) {
      const x = random.normal();
      design.push([1, x]);
      y.push(random.next() < 1 / (1 + Math.exp(-(-0.5 + 1.2 * x))) ? 1 : 0);
    }
    const fit = logisticRegression(design, y);
    expect(fit.converged).toBe(true);
    expect(fit.coefficients[0]).toBeCloseTo(-0.5, 1);
    expect(fit.coefficients[1]).toBeCloseTo(1.2, 1);
  });
});
