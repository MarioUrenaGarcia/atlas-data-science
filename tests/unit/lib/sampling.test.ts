import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import {
  adjustForPopulation,
  allocate,
  clusterDesignEffect,
  drawSample,
  estimateMean,
  finitePopulationCorrection,
  finiteVariance,
  frameUnits,
  generateGridPopulation,
  hiddenPopulationNetwork,
  horvitzThompsonTotal,
  idealAllocation,
  inclusionProbabilities,
  marginOfErrorProportion,
  postStratificationWeights,
  rake,
  reservoirSample,
  roundAllocation,
  sampleSizeMean,
  sampleSizeProportion,
  snowballWaves,
  srsVariance,
  stratifiedVariance,
  systematicPositions,
  systematicPps,
  theoreticalVariance,
  weightingDesignEffect,
  type DesignOptions,
  type GridPopulation,
} from '../../../src/lib/sampling/index.ts';

function population(icc = 0.3): GridPopulation {
  return generateGridPopulation(
    {
      columns: 20,
      rows: 12,
      strata: [
        { name: 'A', mean: 40 },
        { name: 'B', mean: 55 },
        { name: 'C', mean: 70 },
      ],
      cluster: [4, 3],
      icc,
      sd: 8,
    },
    new Random(11),
  );
}

function empirical(pop: GridPopulation, options: DesignOptions, reps: number) {
  const random = new Random(5);
  const estimates = Array.from({ length: reps }, () =>
    estimateMean(pop, drawSample(pop, options, random), options.design),
  );
  const m = estimates.reduce((a, b) => a + b, 0) / reps;
  const v = estimates.reduce((a, e) => a + (e - m) ** 2, 0) / (reps - 1);
  return { mean: m, variance: v };
}

const trueMean = (pop: GridPopulation) => pop.values.reduce((a, b) => a + b, 0) / pop.values.length;

describe('gridded population', () => {
  it('is reproducible and keeps the stratum structure', () => {
    const a = population();
    const b = population();
    expect(a.values).toEqual(b.values);
    expect(a.values).toHaveLength(240);
    expect(a.clusterCount).toBe(20);
    expect(new Set(a.stratum)).toEqual(new Set([0, 1, 2]));
    const means = [0, 1, 2].map((h) => {
      const v = a.values.filter((_, i) => a.stratum[i] === h);
      return v.reduce((x, y) => x + y, 0) / v.length;
    });
    expect(means[0]).toBeLessThan(means[1]!);
    expect(means[1]).toBeLessThan(means[2]!);
  });
});

describe('allocation', () => {
  it('splits proportionally and by Neyman', () => {
    expect(idealAllocation('proporcional', 20, [100, 300], [1, 1])).toEqual([5, 15]);
    expect(idealAllocation('neyman', 20, [100, 100], [1, 3])).toEqual([5, 15]);
    expect(allocate('proporcional', 10, [50, 30, 20], [])).toEqual([5, 3, 2]);
  });

  it('rounds to the exact total within the caps', () => {
    const r = roundAllocation([3.4, 3.3, 3.3], 10, [10, 10, 10]);
    expect(r.reduce((a, b) => a + b, 0)).toBe(10);
    expect(roundAllocation([8, 1, 1], 10, [3, 10, 10]).reduce((a, b) => a + b, 0)).toBe(10);
  });

  it('gives the textbook stratified variance', () => {
    // Two strata of 100 with S² = 4 and 16, n_h = 10 each.
    const v = stratifiedVariance([100, 100], [4, 16], [10, 10]);
    expect(v).toBeCloseTo(0.25 * 0.9 * 0.4 + 0.25 * 0.9 * 1.6, 10);
  });
});

describe('designs', () => {
  const pop = population();
  const mu = trueMean(pop);

  it('simple random sampling is unbiased with the theoretical variance', () => {
    const options: DesignOptions = { design: 'mas', n: 20 };
    const { mean, variance } = empirical(pop, options, 3000);
    expect(mean).toBeCloseTo(mu, 0);
    const theory = theoreticalVariance(pop, options)!;
    expect(variance / theory).toBeGreaterThan(0.9);
    expect(variance / theory).toBeLessThan(1.1);
  });

  it('stratified sampling beats simple random sampling when strata differ', () => {
    const srs = srsVariance(pop.values, 24);
    const st = theoreticalVariance(pop, { design: 'estratificado', n: 24 })!;
    expect(st).toBeLessThan(srs);
    const { mean } = empirical(pop, { design: 'estratificado', n: 24 }, 2000);
    expect(mean).toBeCloseTo(mu, 0);
  });

  it('cluster sampling is unbiased and loses precision with high icc', () => {
    const clustered = population(0.8);
    const options: DesignOptions = { design: 'conglomerados', n: 2 };
    const { mean, variance } = empirical(clustered, options, 3000);
    expect(mean).toBeCloseTo(trueMean(clustered), 0);
    const theory = theoreticalVariance(clustered, options)!;
    expect(variance / theory).toBeGreaterThan(0.85);
    expect(variance / theory).toBeLessThan(1.15);
    expect(theory).toBeGreaterThan(srsVariance(clustered.values, 24));
  });

  it('pps with replacement is unbiased', () => {
    const { mean } = empirical(pop, { design: 'pps', n: 20 }, 3000);
    expect(mean).toBeCloseTo(mu, 0);
  });

  it('convenience and selection-biased samples miss the mean', () => {
    const conv = empirical(pop, { design: 'conveniencia', n: 20 }, 200);
    expect(Math.abs(conv.mean - mu)).toBeGreaterThan(5);
    const sel = empirical(pop, { design: 'seleccion', n: 20, bias: 1.5 }, 300);
    expect(sel.mean - mu).toBeGreaterThan(3);
  });

  it('nonresponse related to the value biases the respondent mean', () => {
    const r = empirical(
      pop,
      { design: 'no-respuesta', n: 60, response: { base: 0, slope: -2 } },
      300,
    );
    expect(r.mean).toBeLessThan(mu - 2);
  });

  it('the frame keeps the requested share of each stratum', () => {
    const units = frameUnits(pop, [1, 0.5, 0.25]);
    expect(units).toHaveLength(80 + 40 + 20);
  });

  it('systematic positions are evenly spaced', () => {
    expect(systematicPositions(20, 4, 2)).toEqual([2, 7, 12, 17]);
    expect(systematicPositions(10, 3, 0.5)).toEqual([0, 3, 7]);
  });

  it('two-stage sampling has n per cluster', () => {
    const s = drawSample(pop, { design: 'multietapa', n: 4, perCluster: 3 }, new Random(2));
    expect(s.units).toHaveLength(12);
    expect(s.clusters).toHaveLength(4);
  });
});

describe('precision and sample size', () => {
  it('matches the classic poll numbers', () => {
    expect(sampleSizeProportion(0.5, 0.03, 0.95)).toBe(1068);
    expect(marginOfErrorProportion(0.5, 1000, 0.95)).toBeCloseTo(0.031, 3);
    expect(sampleSizeProportion(0.5, 0.05, 0.95, 2000)).toBe(323);
    expect(sampleSizeMean(10, 2, 0.95)).toBe(97);
  });

  it('adjusts for finite populations', () => {
    expect(adjustForPopulation(400, 400)).toBe(200);
    expect(finitePopulationCorrection(1, 100)).toBeCloseTo(1, 10);
    expect(finitePopulationCorrection(100, 100)).toBe(0);
  });

  it('computes design effects', () => {
    expect(clusterDesignEffect(10, 0.1)).toBeCloseTo(1.9, 10);
    expect(weightingDesignEffect([1, 1, 1, 1])).toBe(1);
    expect(weightingDesignEffect([1, 3])).toBeCloseTo(1.25, 10);
  });

  it('finite variance uses N - 1', () => {
    expect(finiteVariance([1, 2, 3, 4])).toBeCloseTo(5 / 3, 10);
  });
});

describe('weighting', () => {
  it('post-stratification weights restore the population shares', () => {
    const w = postStratificationWeights([30, 70], [0.5, 0.5]);
    expect(w[0]).toBeCloseTo(0.5 / 0.3, 10);
    expect(w[1]).toBeCloseTo(0.5 / 0.7, 10);
  });

  it('raking converges to both margins', () => {
    const steps = rake(
      [
        [20, 30],
        [10, 40],
      ],
      [600, 400],
      [500, 500],
      10,
    );
    const last = steps[steps.length - 1]!;
    expect(last.gap).toBeLessThan(1e-3);
    expect(steps[0]!.adjusted).toBe('inicio');
  });
});

describe('inclusion probabilities', () => {
  it('are proportional to size and cap at one', () => {
    const pi = inclusionProbabilities([1, 1, 2, 20], 2);
    expect(pi[3]).toBe(1);
    expect(pi.reduce((a, b) => a + b, 0)).toBeCloseTo(2, 10);
    expect(pi[2]! / pi[0]!).toBeCloseTo(2, 10);
  });

  it('systematic pps draws n units and HT is unbiased', () => {
    const sizes = [3, 1, 4, 1, 5, 9, 2, 6];
    const values = sizes.map((x, i) => 2 * x + (i % 3));
    const pi = inclusionProbabilities(sizes, 3);
    const random = new Random(9);
    let total = 0;
    const reps = 20000;
    for (let r = 0; r < reps; r += 1) {
      const s = systematicPps(pi, random);
      expect(s).toHaveLength(3);
      total += horvitzThompsonTotal(s, values, pi);
    }
    const truth = values.reduce((a, b) => a + b, 0);
    expect(total / reps).toBeCloseTo(truth, 0);
  });
});

describe('streams and networks', () => {
  it('reservoir sampling keeps each item with probability k/n', () => {
    const counts = new Array<number>(10).fill(0);
    const random = new Random(3);
    for (let r = 0; r < 20000; r += 1)
      for (const item of reservoirSample(10, 3, random)) counts[item]! += 1;
    for (const c of counts) expect(c / 20000).toBeCloseTo(0.3, 1);
  });

  it('snowball recruits only connected members', () => {
    const net = hiddenPopulationNetwork(150, 0.2, 0.9, new Random(4));
    const seeds = net.member
      .map((m, i) => (m ? i : -1))
      .filter((i) => i >= 0)
      .slice(0, 2);
    const waves = snowballWaves(net, seeds, 2, 4, new Random(1));
    for (const wave of waves.slice(1)) {
      wave.recruits.forEach((r, j) => {
        expect(net.member[r]).toBe(true);
        expect(net.neighbors[wave.referrers[j]!]).toContain(r);
      });
    }
  });
});

describe('optimal allocation and sequence', () => {
  it('reduces to Neyman with equal costs and favors cheap strata', async () => {
    const { optimalAllocation, allocationSequence } =
      await import('../../../src/lib/sampling/designs.ts');
    expect(optimalAllocation(20, [100, 100], [1, 3], [1, 1])).toEqual([5, 15]);
    const cheap = optimalAllocation(20, [100, 100], [1, 1], [1, 4]);
    expect(cheap[0]).toBeGreaterThan(cheap[1]!);
    const order = allocationSequence([2, 6, 2]);
    expect(order).toHaveLength(10);
    expect(order.filter((h) => h === 1)).toHaveLength(6);
  });
});

describe('survivorship', () => {
  it('survivors overstate the mean return', async () => {
    const { simulateSurvival, meanReturn } = await import('../../../src/lib/sampling/survival.ts');
    const panel = simulateSurvival(
      { units: 400, periods: 10, mean: 0.04, dispersion: 0.04, volatility: 0.15, threshold: 0.75 },
      new Random(8),
    );
    expect(panel.closed.some((c) => c !== null)).toBe(true);
    expect(meanReturn(panel, 9, true)).toBeGreaterThan(meanReturn(panel, 9, false));
  });
});

describe('Neyman allocation with a census stratum', () => {
  it('takes the small stratum whole and reallots the rest by Neyman', () => {
    const a = allocate('neyman', 160, [2500, 400, 30], [0.3, 2.5, 40]);
    expect(a[2]).toBe(30);
    expect(a[0]! + a[1]!).toBe(130);
    // 130 split in proportion to 750 : 1000 gives 55.7 and 74.3.
    expect(a[0]).toBe(56);
    expect(a[1]).toBe(74);
  });
});
