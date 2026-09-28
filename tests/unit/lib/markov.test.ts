import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import {
  distributionAfter,
  nextState,
  normalizeRows,
  stationaryDistribution,
  totalVariation,
} from '../../../src/lib/stochastic/markov.ts';

const WEATHER = [
  [0.9, 0.1],
  [0.5, 0.5],
];

describe('Markov chains', () => {
  it('normalizes rows', () => {
    expect(
      normalizeRows([
        [1, 3],
        [0, 0],
      ]),
    ).toEqual([
      [0.25, 0.75],
      [0.5, 0.5],
    ]);
  });

  it('finds the stationary distribution of an ergodic chain', () => {
    const pi = stationaryDistribution(WEATHER);
    expect(pi[0]).toBeCloseTo(5 / 6, 12);
    expect(pi[1]).toBeCloseTo(1 / 6, 12);
  });

  it('propagates distributions and converges', () => {
    expect(distributionAfter([1, 0], WEATHER, 1)).toEqual([0.9, 0.1]);
    const far = distributionAfter([0, 1], WEATHER, 60);
    expect(totalVariation(far, stationaryDistribution(WEATHER))).toBeLessThan(1e-12);
  });

  it('averages when the chain has several closed classes', () => {
    const reducible = [
      [1, 0],
      [0, 1],
    ];
    const pi = stationaryDistribution(reducible, [0.3, 0.7]);
    expect(pi[0]).toBeCloseTo(0.3, 10);
  });

  it('simulates visit frequencies close to the stationary distribution', () => {
    const random = new Random(9);
    let state = 0;
    const visits = [0, 0];
    for (let i = 0; i < 60_000; i += 1) {
      state = nextState(state, WEATHER, random);
      visits[state] = (visits[state] ?? 0) + 1;
    }
    expect((visits[0] ?? 0) / 60_000).toBeCloseTo(5 / 6, 2);
  });
});
