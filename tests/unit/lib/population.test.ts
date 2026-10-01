import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import { mean } from '../../../src/lib/stats/index.ts';
import {
  allSamples,
  biasedSample,
  generatePopulation,
  populationStatistic,
  simpleRandomSample,
} from '../../../src/lib/stats/population.ts';

describe('population', () => {
  it('generates reproducible populations with the requested center', () => {
    const spec = { size: 4000, shape: 'normal' as const, center: 50, spread: 5, decimals: 2 };
    const a = generatePopulation(spec, new Random(3));
    const b = generatePopulation(spec, new Random(3));
    expect(a).toEqual(b);
    expect(mean(a)).toBeCloseTo(50, 0);
    const skewed = generatePopulation({ size: 4000, shape: 'sesgada', center: 20 }, new Random(4));
    expect(Math.min(...skewed)).toBeGreaterThanOrEqual(0);
    expect(mean(skewed)).toBeGreaterThan(18);
    expect(mean(skewed)).toBeLessThan(22);
    const binary = generatePopulation(
      { size: 4000, shape: 'bernoulli', center: 0.3 },
      new Random(5),
    );
    expect(new Set(binary)).toEqual(new Set([0, 1]));
    expect(mean(binary)).toBeCloseTo(0.3, 1);
  });

  it('computes statistics', () => {
    expect(populationStatistic('media', [12, 15, 9, 14, 10])).toBe(12);
    expect(populationStatistic('mediana', [12, 15, 9, 14, 10])).toBe(12);
    expect(populationStatistic('maximo', [12, 15, 9, 14, 10])).toBe(15);
    expect(populationStatistic('proporcion', [1, 0, 0, 1])).toBe(0.5);
    expect(populationStatistic('media', [])).toBeNaN();
  });

  it('draws samples without replacement', () => {
    const sample = simpleRandomSample(50, 20, new Random(1));
    expect(sample).toHaveLength(20);
    expect(new Set(sample).size).toBe(20);
    expect(Math.max(...sample)).toBeLessThan(50);
  });

  it('biased samples overrepresent large values', () => {
    const values = Array.from({ length: 200 }, (_, i) => i);
    const means: number[] = [];
    for (let seed = 0; seed < 30; seed += 1) {
      const sample = biasedSample(values, 20, new Random(seed));
      expect(new Set(sample).size).toBe(20);
      means.push(mean(sample.map((index) => values[index] ?? 0)));
    }
    expect(mean(means)).toBeGreaterThan(120);
  });

  it('enumerates every sample and their means average to the parameter', () => {
    const samples = allSamples(5, 2);
    expect(samples).toHaveLength(10);
    expect(samples[0]).toEqual([0, 1]);
    const heights = [12, 15, 9, 14, 10];
    const means = samples.map((pair) => mean(pair.map((index) => heights[index] ?? 0)));
    expect(mean(means)).toBeCloseTo(12, 10);
  });
});
