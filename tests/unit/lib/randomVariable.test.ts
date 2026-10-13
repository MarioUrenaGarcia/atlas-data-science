import { describe, expect, it } from 'vitest';
import {
  affinePmf,
  cdfAt,
  centralMoment,
  characteristicOf,
  cumulantsFromRawMoments,
  excessKurtosisOf,
  expectationOf,
  findVariable,
  makePmf,
  medianInterval,
  mgfOf,
  modesOf,
  pgfOf,
  pmfOfVariable,
  quantileOf,
  rawMoment,
  skewnessOf,
  varianceOf,
} from '../../../src/lib/probability/randomVariable.ts';

const sumOfDice = pmfOfVariable('dos-dados', findVariable('dos-dados', 'suma')!.map);
const die = makePmf([1, 2, 3, 4, 5, 6], [1, 1, 1, 1, 1, 1]);

describe('finite random variables', () => {
  it('build the pmf of the sum of two dice', () => {
    expect(sumOfDice.values).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(sumOfDice.probs[5]).toBeCloseTo(6 / 36);
    expect(cdfAt(sumOfDice, 7)).toBeCloseTo(21 / 36);
    expect(quantileOf(sumOfDice, 0.5)).toBe(7);
  });

  it('compute expectation, variance and moments', () => {
    expect(expectationOf(die)).toBeCloseTo(3.5);
    expect(varianceOf(die)).toBeCloseTo(35 / 12);
    expect(rawMoment(die, 2)).toBeCloseTo(91 / 6);
    expect(expectationOf(sumOfDice)).toBeCloseTo(7);
    expect(varianceOf(sumOfDice)).toBeCloseTo(35 / 6);
    expect(centralMoment(die, 3)).toBeCloseTo(0);
    expect(skewnessOf(die)).toBeCloseTo(0);
    // Discrete uniform on 1..6: excess kurtosis -222/175.
    expect(excessKurtosisOf(die)).toBeCloseTo(-222 / 175);
  });

  it('measure skewness of an asymmetric variable', () => {
    const bet = makePmf([-1, 4], [5, 1]);
    expect(expectationOf(bet)).toBeCloseTo(-1 / 6);
    expect(skewnessOf(bet)).toBeGreaterThan(1);
  });

  it('find medians and modes', () => {
    expect(medianInterval(die)).toEqual([3, 4]);
    expect(medianInterval(sumOfDice)).toEqual([7, 7]);
    expect(modesOf(sumOfDice)).toEqual([7]);
    expect(modesOf(die)).toHaveLength(6);
  });

  it('transform affinely', () => {
    const y = affinePmf(die, 2, 1);
    expect(expectationOf(y)).toBeCloseTo(2 * 3.5 + 1);
    expect(varianceOf(y)).toBeCloseTo(4 * (35 / 12));
  });

  it('convert raw moments into cumulants', () => {
    // Poisson(2): every cumulant equals 2; raw moments 2, 6, 22, 94.
    const [k1, k2, k3, k4] = cumulantsFromRawMoments([2, 6, 22, 94]);
    expect([k1, k2, k3, k4]).toEqual([2, 2, 2, 2]);
    // Standard normal: raw moments 0, 1, 0, 3 give cumulants 0, 1, 0, 0.
    expect(cumulantsFromRawMoments([0, 1, 0, 3])).toEqual([0, 1, 0, 0]);
  });

  it('evaluate generating functions', () => {
    const coin = makePmf([0, 1], [1, 1]);
    expect(mgfOf(coin, 0)).toBeCloseTo(1);
    expect(mgfOf(coin, 1)).toBeCloseTo((1 + Math.E) / 2);
    expect(pgfOf(coin, 0)).toBeCloseTo(0.5);
    const [re, im] = characteristicOf(coin, Math.PI);
    expect(re).toBeCloseTo(0);
    expect(im).toBeCloseTo(0);
  });
});
