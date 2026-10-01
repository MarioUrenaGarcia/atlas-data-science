/**
 * Exact answers and single-round simulators for classic probability puzzles:
 * Monty Hall, birthdays, coupon collecting, gambler's ruin, the secretary
 * problem and the St. Petersburg game.
 */
import type { Random } from '../random/index.ts';

export interface MontyRound {
  car: number;
  pick: number;
  /** Doors opened by the host. */
  opened: number[];
  /** Door offered when switching. */
  other: number;
  /** False when an uninformed host revealed the car; such rounds are discarded. */
  valid: boolean;
  stayWins: boolean;
  switchWins: boolean;
}

/**
 * One round with `doors` doors. A host who knows where the car is opens every
 * other door except one, always showing goats; an uninformed host opens the
 * same number of doors at random and may reveal the car.
 */
export function montyRound(random: Random, doors: number, hostKnows: boolean): MontyRound {
  const car = random.int(0, doors - 1);
  const pick = random.int(0, doors - 1);
  const rest = Array.from({ length: doors }, (_, i) => i).filter((door) => door !== pick);
  let other: number;
  if (hostKnows) {
    // The host keeps the car closed; if the contestant already has it, a random door stays closed.
    other = car !== pick ? car : (rest[random.int(0, rest.length - 1)] ?? 0);
  } else {
    other = rest[random.int(0, rest.length - 1)] ?? 0;
  }
  const opened = rest.filter((door) => door !== other);
  const valid = !opened.includes(car);
  return { car, pick, opened, other, valid, stayWins: pick === car, switchWins: other === car };
}

/** Probability of winning by switching when the host knowingly opens all but one other door. */
export function montySwitchProbability(doors: number): number {
  return (doors - 1) / doors;
}

/** Probability that at least two of n people share a birthday, with `days` equally likely days. */
export function birthdayProbability(n: number, days = 365): number {
  if (n > days) return 1;
  let allDifferent = 1;
  for (let i = 0; i < n; i += 1) allDifferent *= (days - i) / days;
  return 1 - allDifferent;
}

/** Smallest group size whose probability of a shared birthday reaches `target`. */
export function birthdayThreshold(target = 0.5, days = 365): number {
  let n = 1;
  while (birthdayProbability(n, days) < target) n += 1;
  return n;
}

/** Expected number of draws to collect all n equally likely coupons: n times the harmonic number H_n. */
export function couponExpectation(n: number): number {
  let harmonic = 0;
  for (let k = 1; k <= n; k += 1) harmonic += 1 / k;
  return n * harmonic;
}

/** Variance of the number of draws to complete the collection. */
export function couponVariance(n: number): number {
  let variance = 0;
  for (let k = 1; k <= n; k += 1) {
    const p = (n - k + 1) / n;
    variance += (1 - p) / (p * p);
  }
  return variance;
}

/**
 * Probability that a gambler starting with `start` reaches `target` before 0,
 * winning each unit bet with probability p.
 */
export function ruinWinProbability(start: number, target: number, p: number): number {
  if (start <= 0) return 0;
  if (start >= target) return 1;
  const q = 1 - p;
  if (Math.abs(p - q) < 1e-12) return start / target;
  const r = q / p;
  return (1 - r ** start) / (1 - r ** target);
}

/** Expected number of bets until the gambler is ruined or reaches the target. */
export function ruinExpectedDuration(start: number, target: number, p: number): number {
  const q = 1 - p;
  if (Math.abs(p - q) < 1e-12) return start * (target - start);
  return start / (q - p) - (target / (q - p)) * ruinWinProbability(start, target, p);
}

/**
 * Success probability of the secretary rule that rejects the first `skip`
 * candidates and then takes the first one better than all seen so far.
 */
export function secretarySuccess(n: number, skip: number): number {
  if (skip === 0) return 1 / n;
  let sum = 0;
  for (let i = skip + 1; i <= n; i += 1) sum += 1 / (i - 1);
  return (skip / n) * sum;
}

/** Number of candidates to skip that maximizes the success probability. */
export function secretaryOptimalSkip(n: number): number {
  let best = 0;
  let bestValue = secretarySuccess(n, 0);
  for (let skip = 1; skip < n; skip += 1) {
    const value = secretarySuccess(n, skip);
    if (value > bestValue) {
      best = skip;
      bestValue = value;
    }
  }
  return best;
}

/** Applies the secretary rule to one ranking (higher is better) and reports whether it picked the best. */
export function secretaryRound(
  ranks: readonly number[],
  skip: number,
): { chosen: number; best: boolean } {
  const n = ranks.length;
  const threshold = Math.max(-Infinity, ...ranks.slice(0, skip));
  for (let i = skip; i < n; i += 1) {
    if ((ranks[i] ?? 0) > threshold) return { chosen: i, best: ranks[i] === n };
  }
  return { chosen: n - 1, best: ranks[n - 1] === n };
}

/**
 * Expected payout of the St. Petersburg game when the bank can pay at most
 * `cap`: the sum over k of min(2^(k-1), cap) / 2^k, which is finite and grows
 * only like log2(cap) / 2.
 */
export function stPetersburgCappedExpectation(cap: number): number {
  let total = 0;
  for (let k = 1; k <= 200; k += 1) {
    const payout = Math.min(2 ** (k - 1), cap);
    total += payout / 2 ** k;
    if (2 ** (k - 1) >= cap) {
      // Every later term pays the cap; their probabilities add up to 2^-k.
      total += cap / 2 ** k;
      break;
    }
  }
  return total;
}

/** Payout of one St. Petersburg game: 2^(k-1) when the first head appears on toss k. */
export function stPetersburgRound(random: Random): { tosses: number; payout: number } {
  let tosses = 1;
  while (random.bernoulli(0.5)) tosses += 1;
  return { tosses, payout: 2 ** (tosses - 1) };
}
