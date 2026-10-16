import { describe, expect, it } from 'vitest';
import {
  argMax,
  breakEvenThreshold,
  classificationMetrics,
  confusionAt,
  decisionValue,
  expectedSales,
  newsvendorOptimum,
  newsvendorProfit,
  scoredPopulation,
} from '../../../src/lib/dataprep/decision.ts';
import {
  anonymityK,
  decomposeChange,
  equivalenceClasses,
  fitSalesModel,
  groupRates,
  leastSquares,
  reproRunConfig,
  runAnalysis,
  simulateSales,
  syntheticPatients,
  uniqueRecords,
  type PersonRecord,
} from '../../../src/lib/dataprep/lifecycle.ts';
import { Random } from '../../../src/lib/random/index.ts';

describe('confusion and metrics', () => {
  const cases = [
    { score: 0.9, positive: true },
    { score: 0.8, positive: false },
    { score: 0.6, positive: true },
    { score: 0.3, positive: true },
    { score: 0.2, positive: false },
  ];

  it('counts each cell with the threshold rule score >= u', () => {
    expect(confusionAt(cases, 0.6)).toEqual({ tp: 2, fp: 1, tn: 1, fn: 1 });
  });

  it('computes the usual metrics', () => {
    const m = classificationMetrics({ tp: 2, fp: 1, tn: 1, fn: 1 });
    expect(m.accuracy).toBeCloseTo(0.6);
    expect(m.precision).toBeCloseTo(2 / 3);
    expect(m.recall).toBeCloseTo(2 / 3);
    expect(m.f1).toBeCloseTo(2 / 3);
    expect(m.specificity).toBeCloseTo(0.5);
  });

  it('values a decision with the payoff of each cell', () => {
    expect(
      decisionValue({ tp: 3, fp: 2, tn: 5, fn: 1 }, { tp: 100, fp: -20, tn: 0, fn: -50 }),
    ).toBe(300 - 40 - 50);
  });

  it('simulates the requested prevalence', () => {
    const population = scoredPopulation(
      { n: 20000, prevalence: 0.2, separation: 2 },
      new Random(4),
    );
    const share = population.filter((c) => c.positive).length / population.length;
    expect(share).toBeCloseTo(0.2, 1);
    expect(population.every((c) => c.score > 0 && c.score < 1)).toBe(true);
  });

  it('scores are calibrated probabilities', () => {
    const population = scoredPopulation(
      { n: 40000, prevalence: 0.2, separation: 2 },
      new Random(9),
    );
    const band = population.filter((c) => c.score > 0.25 && c.score < 0.35);
    const share = band.filter((c) => c.positive).length / band.length;
    expect(share).toBeGreaterThan(0.25);
    expect(share).toBeLessThan(0.35);
  });

  it('the break-even threshold balances the payoffs', () => {
    expect(breakEvenThreshold({ tp: 400, fp: -100, tn: 0, fn: 0 })).toBeCloseTo(0.2);
  });

  it('finds the first maximum and ignores NaN', () => {
    expect(argMax([Number.NaN, 1, 3, 3, 2])).toBe(2);
  });
});

describe('newsvendor', () => {
  it('expected sales approach the mean for large orders and q for tiny ones', () => {
    expect(expectedSales(1000, 100, 10)).toBeCloseTo(100, 6);
    expect(expectedSales(10, 100, 10)).toBeCloseTo(10, 6);
  });

  it('the optimum is the critical-ratio quantile and beats nearby orders', () => {
    const q = newsvendorOptimum(150, 12, 60, 35);
    // Critical ratio 25/60 = 0.4167, whose normal quantile is about -0.2104.
    expect(q).toBeCloseTo(150 - 0.21043 * 12, 2);
    const best = newsvendorProfit(q, 150, 12, 60, 35);
    expect(best).toBeGreaterThan(newsvendorProfit(q - 3, 150, 12, 60, 35));
    expect(best).toBeGreaterThan(newsvendorProfit(q + 3, 150, 12, 60, 35));
  });
});

describe('least squares and sales decomposition', () => {
  it('recovers an exact linear relation', () => {
    const design = [1, 2, 3, 4].map((x) => [1, x]);
    const fit = leastSquares(design, [3, 5, 7, 9]);
    expect(fit?.coefficients[0]).toBeCloseTo(1);
    expect(fit?.coefficients[1]).toBeCloseTo(2);
    expect(fit?.sigma).toBeCloseTo(0);
  });

  it('decomposes a change into parts that add up to the observed change', () => {
    const series = simulateSales(
      {
        months: 24,
        base: 100,
        trend: 1,
        seasonal: 10,
        promoEffect: 20,
        noise: 3,
        promoMonths: [4, 9],
      },
      new Random(3),
    );
    const model = fitSalesModel(series);
    expect(model).not.toBeNull();
    if (!model) return;
    const d = decomposeChange(series, model, 8, 9);
    expect(d.trend + d.season + d.promo + d.residual).toBeCloseTo(d.total, 9);
    expect(model.fit.coefficients[4]).toBeGreaterThan(12);
  });
});

describe('privacy', () => {
  const records: PersonRecord[] = [
    { postal: '06700', age: 34, sex: 'F', diagnosis: 'Asma' },
    { postal: '06720', age: 36, sex: 'F', diagnosis: 'Asma' },
    { postal: '06700', age: 52, sex: 'M', diagnosis: 'Migraña' },
    { postal: '03100', age: 51, sex: 'M', diagnosis: 'Diabetes' },
  ];

  it('more quasi-identifiers make smaller classes', () => {
    const coarse = equivalenceClasses(records, ['sex'], { postalDigits: 5, ageBand: 1 });
    expect(anonymityK(coarse)).toBe(2);
    const fine = equivalenceClasses(records, ['sex', 'age'], { postalDigits: 5, ageBand: 1 });
    expect(uniqueRecords(fine)).toBe(4);
  });

  it('generalization merges classes again', () => {
    const exact = equivalenceClasses(records, ['sex', 'age', 'postal'], {
      postalDigits: 5,
      ageBand: 1,
    });
    expect(anonymityK(exact)).toBe(1);
    const general = equivalenceClasses(records, ['sex', 'age', 'postal'], {
      postalDigits: 1,
      ageBand: 10,
    });
    expect(anonymityK(general)).toBe(2);
  });

  it('builds reproducible synthetic tables', () => {
    expect(syntheticPatients(10, 5)).toEqual(syntheticPatients(10, 5));
  });
});

describe('reproducibility', () => {
  it('pinning seed, data and code returns identical results', () => {
    const pinned = { seed: true, data: true, code: true };
    const slopes = [0, 5, 11].map((i) => runAnalysis(reproRunConfig(i, 12, pinned)).slope);
    expect(new Set(slopes).size).toBe(1);
  });

  it('a free seed changes the answer', () => {
    const free = { seed: false, data: true, code: true };
    const a = runAnalysis(reproRunConfig(0, 12, free)).slope;
    const b = runAnalysis(reproRunConfig(1, 12, free)).slope;
    expect(a).not.toBe(b);
  });
});

describe('group error rates', () => {
  it('computes false positive and false negative rates', () => {
    const rates = groupRates(
      [
        { score: 0.9, positive: true },
        { score: 0.4, positive: true },
        { score: 0.7, positive: false },
        { score: 0.1, positive: false },
      ],
      0.5,
    );
    expect(rates.falsePositiveRate).toBeCloseTo(0.5);
    expect(rates.falseNegativeRate).toBeCloseTo(0.5);
    expect(rates.baseRate).toBeCloseTo(0.5);
  });
});
