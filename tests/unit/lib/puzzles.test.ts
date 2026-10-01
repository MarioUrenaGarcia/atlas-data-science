import { describe, expect, it } from 'vitest';
import {
  birthdayProbability,
  birthdayThreshold,
  couponExpectation,
  couponVariance,
  montyRound,
  montySwitchProbability,
  ruinExpectedDuration,
  ruinWinProbability,
  secretaryOptimalSkip,
  secretaryRound,
  secretarySuccess,
  stPetersburgCappedExpectation,
  stPetersburgRound,
} from '../../../src/lib/probability/puzzles.ts';
import { Random } from '../../../src/lib/random/index.ts';

describe('Monty Hall', () => {
  it('gives 2/3 to switching with an informed host', () => {
    const random = new Random(3);
    let wins = 0;
    const n = 30000;
    for (let i = 0; i < n; i += 1) if (montyRound(random, 3, true).switchWins) wins += 1;
    expect(wins / n).toBeCloseTo(2 / 3, 1);
    expect(montySwitchProbability(10)).toBeCloseTo(0.9);
  });

  it('gives 1/2 among valid rounds with an uninformed host', () => {
    const random = new Random(5);
    let valid = 0;
    let wins = 0;
    for (let i = 0; i < 60000; i += 1) {
      const round = montyRound(random, 3, false);
      if (!round.valid) continue;
      valid += 1;
      if (round.switchWins) wins += 1;
    }
    expect(wins / valid).toBeCloseTo(0.5, 1);
  });
});

describe('puzzles with closed forms', () => {
  it('birthday', () => {
    expect(birthdayProbability(23)).toBeCloseTo(0.5073, 4);
    expect(birthdayThreshold(0.5)).toBe(23);
    expect(birthdayProbability(366)).toBe(1);
  });

  it('coupon collector', () => {
    expect(couponExpectation(6)).toBeCloseTo(14.7, 1);
    expect(couponVariance(1)).toBe(0);
  });

  it('gambler ruin', () => {
    expect(ruinWinProbability(5, 10, 0.5)).toBeCloseTo(0.5);
    expect(ruinExpectedDuration(5, 10, 0.5)).toBe(25);
    expect(ruinWinProbability(10, 20, 18 / 38)).toBeCloseTo(0.2585, 3);
    expect(ruinWinProbability(0, 10, 0.4)).toBe(0);
  });

  it('secretary', () => {
    expect(secretaryOptimalSkip(10)).toBe(3);
    expect(secretarySuccess(10, 3)).toBeCloseTo(0.3987, 3);
    expect(secretaryRound([3, 1, 5, 2, 4], 2)).toEqual({ chosen: 2, best: true });
  });

  it('St. Petersburg with a capped bank', () => {
    expect(stPetersburgCappedExpectation(1)).toBeCloseTo(1);
    expect(stPetersburgCappedExpectation(2)).toBeCloseTo(1.5);
    // With a cap of 2^m the expectation is (m + 2) / 2.
    expect(stPetersburgCappedExpectation(2 ** 20)).toBeCloseTo(11);
  });

  it('St. Petersburg payouts are powers of two', () => {
    const random = new Random(1);
    const round = stPetersburgRound(random);
    expect(round.payout).toBe(2 ** (round.tosses - 1));
  });
});
