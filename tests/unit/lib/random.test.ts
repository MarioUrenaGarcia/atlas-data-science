import { describe, expect, it } from 'vitest';
import { Random, seedFromText } from '../../../src/lib/random/index.ts';

const N = 40_000;

function moments(values: number[]): { mean: number; variance: number } {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  return { mean, variance };
}

function draw(count: number, generator: () => number): number[] {
  return Array.from({ length: count }, generator);
}

/** Checks the sample mean within five standard errors of the true mean. */
function expectMean(values: number[], mean: number, variance: number) {
  const observed = moments(values);
  const standardError = Math.sqrt(variance / values.length);
  expect(Math.abs(observed.mean - mean)).toBeLessThan(5 * standardError);
  expect(observed.variance / variance).toBeGreaterThan(0.95);
  expect(observed.variance / variance).toBeLessThan(1.05);
}

describe('Random', () => {
  it('is reproducible for a given seed and differs across seeds', () => {
    const a = new Random(42);
    const b = new Random(42);
    const c = new Random(43);
    const sequenceA = draw(20, () => a.next());
    expect(draw(20, () => b.next())).toEqual(sequenceA);
    expect(draw(20, () => c.next())).not.toEqual(sequenceA);
  });

  it('produces uniform values in [0, 1) with the right moments', () => {
    const random = new Random(1);
    const values = draw(N, () => random.next());
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThan(1);
    expectMean(values, 0.5, 1 / 12);
  });

  it('draws integers uniformly including both bounds', () => {
    const random = new Random(2);
    const counts = new Array<number>(6).fill(0);
    const values = draw(60_000, () => random.int(1, 6));
    for (const value of values) counts[value - 1] = (counts[value - 1] ?? 0) + 1;
    for (const count of counts) expect(Math.abs(count - 10_000)).toBeLessThan(500);
  });

  it('samples continuous distributions with correct moments', () => {
    const random = new Random(3);
    expectMean(
      draw(N, () => random.normal(2, 3)),
      2,
      9,
    );
    expectMean(
      draw(N, () => random.exponential(0.5)),
      2,
      4,
    );
    expectMean(
      draw(N, () => random.gamma(0.4, 2)),
      0.2,
      0.1,
    );
    expectMean(
      draw(N, () => random.gamma(5, 0.5)),
      10,
      20,
    );
    expectMean(
      draw(N, () => random.beta(2, 5)),
      2 / 7,
      10 / (49 * 8),
    );
    expectMean(
      draw(N, () => random.chiSquare(4)),
      4,
      8,
    );
  });

  it('samples discrete distributions with correct moments on every code path', () => {
    const random = new Random(4);
    expectMean(
      draw(N, () => random.poisson(3.5)),
      3.5,
      3.5,
    );
    expectMean(
      draw(N, () => random.poisson(120)),
      120,
      120,
    );
    expectMean(
      draw(N, () => random.binomial(20, 0.3)),
      6,
      4.2,
    );
    expectMean(
      draw(N, () => random.binomial(500, 0.4)),
      200,
      120,
    );
    expectMean(
      draw(N, () => random.binomial(40, 0.9)),
      36,
      3.6,
    );
    expectMean(
      draw(N, () => random.geometric(0.25)),
      4,
      12,
    );
  });

  it('draws categories in proportion to their weights', () => {
    const random = new Random(5);
    const counts = [0, 0, 0];
    for (let i = 0; i < 30_000; i += 1) {
      const index = random.categorical([1, 2, 7]);
      counts[index] = (counts[index] ?? 0) + 1;
    }
    expect(Math.abs((counts[0] ?? 0) / 30_000 - 0.1)).toBeLessThan(0.01);
    expect(Math.abs((counts[2] ?? 0) / 30_000 - 0.7)).toBeLessThan(0.015);
  });

  it('shuffles into a permutation and samples distinct elements', () => {
    const random = new Random(6);
    const items = Array.from({ length: 20 }, (_, index) => index);
    const shuffled = random.shuffle(items);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(items);
    expect(shuffled).not.toEqual(items);
    const sample = random.sample(items, 8);
    expect(new Set(sample).size).toBe(8);
  });

  it('hashes text seeds deterministically', () => {
    expect(seedFromText('atlas')).toBe(seedFromText('atlas'));
    expect(seedFromText('atlas')).not.toBe(seedFromText('Atlas'));
  });
});
