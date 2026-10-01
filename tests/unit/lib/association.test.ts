import { describe, expect, it } from 'vitest';
import {
  classifyPairs,
  contingencySummary,
  correlationMatrix,
  distanceCorrelation,
  gridScore,
  maximalInformation,
  partialCorrelation,
} from '../../../src/lib/stats/association.ts';
import { kendallTau } from '../../../src/lib/stats/index.ts';

describe('association', () => {
  it('summarizes contingency tables', () => {
    const summary = contingencySummary([
      [30, 10],
      [20, 40],
    ]);
    expect(summary.expected[0]?.[0]).toBeCloseTo(20, 12);
    expect(summary.chiSquare).toBeCloseTo(16.6667, 4);
    expect(summary.phi).toBeCloseTo(0.40825, 4);
    expect(summary.mutualInformation).toBeCloseTo(0.0863, 4);
    const negative = contingencySummary([
      [10, 30],
      [40, 20],
    ]);
    expect(negative.phi).toBeLessThan(0);
    const wide = contingencySummary([
      [25, 15, 10],
      [10, 20, 20],
    ]);
    expect(wide.chiSquare).toBeCloseTo(10.4762, 4);
    expect(wide.cramersV).toBeCloseTo(0.32367, 4);
    expect(
      contingencySummary([
        [5, 5],
        [5, 5],
      ]).mutualInformation,
    ).toBeCloseTo(0, 12);
  });

  it('classifies pairs consistently with Kendall tau', () => {
    const x = [1, 2, 3, 4];
    const y = [1, 3, 2, 4];
    const pairs = classifyPairs(x, y);
    const c = pairs.filter((p) => p.kind === 'concordante').length;
    const d = pairs.filter((p) => p.kind === 'discordante').length;
    expect([c, d]).toEqual([5, 1]);
    expect(kendallTau(x, y)).toBeCloseTo((c - d) / 6, 12);
  });

  it('computes distance correlation', () => {
    const x = [-2, -1, 0, 1, 2];
    expect(
      distanceCorrelation(
        x,
        x.map((v) => v * v),
      ).dCor,
    ).toBeCloseTo(0.51592, 4);
    expect(distanceCorrelation([1, 2, 3, 4], [2, 4, 6, 8]).dCor).toBeCloseTo(1, 10);
  });

  it('removes a common cause with the partial correlation', () => {
    const z = [1, 2, 3, 4, 5, 6, 7, 8];
    const noiseA = [0.3, -0.2, 0.1, -0.4, 0.2, 0.1, -0.3, 0.2];
    const noiseB = [-0.1, 0.4, -0.3, 0.1, 0.2, -0.2, 0.3, -0.4];
    const x = z.map((v, i) => 2 * v + (noiseA[i] ?? 0));
    const y = z.map((v, i) => -v + (noiseB[i] ?? 0));
    const r = correlationMatrix([x, y, z]);
    const rxy = r[0]?.[1] ?? 0;
    const rxz = r[0]?.[2] ?? 0;
    const ryz = r[1]?.[2] ?? 0;
    const formula = (rxy - rxz * ryz) / Math.sqrt((1 - rxz ** 2) * (1 - ryz ** 2));
    expect(partialCorrelation(x, y, z)).toBeCloseTo(formula, 10);
    expect(rxy).toBeLessThan(-0.95);
  });

  it('scores grids for the maximal information coefficient', () => {
    const x = Array.from({ length: 40 }, (_, i) => i);
    const y = x.map((v) => (v - 19.5) ** 2);
    const { best } = maximalInformation(x, y);
    expect(best.score).toBeGreaterThan(0.3);
    expect(gridScore(x, x, 2, 2).score).toBeCloseTo(1, 10);
  });
});
