import { solve, type Matrix } from '../linalg/index.ts';
import type { Random } from '../random/index.ts';

/** Divides each row by its sum so it becomes a probability vector. */
export function normalizeRows(weights: Matrix): Matrix {
  return weights.map((row) => {
    const total = row.reduce((sum, value) => sum + value, 0);
    return total > 0 ? row.map((value) => value / total) : row.map(() => 1 / row.length);
  });
}

/** Row vector times matrix: the distribution one step later. */
export function stepDistribution(distribution: readonly number[], transition: Matrix): number[] {
  const size = transition.length;
  return Array.from({ length: size }, (_, j) =>
    distribution.reduce(
      (total, probability, i) => total + probability * (transition[i]?.[j] ?? 0),
      0,
    ),
  );
}

export function distributionAfter(
  initial: readonly number[],
  transition: Matrix,
  steps: number,
): number[] {
  let current = [...initial];
  for (let i = 0; i < steps; i += 1) current = stepDistribution(current, transition);
  return current;
}

/**
 * Stationary distribution solving pi P = pi with sum one. When the system is
 * singular (several closed classes), the Cesaro average of pi_0 P^n is used,
 * which converges for every finite chain.
 */
export function stationaryDistribution(transition: Matrix, initial?: readonly number[]): number[] {
  const size = transition.length;
  const system = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) =>
      i === size - 1 ? 1 : (transition[j]?.[i] ?? 0) - (i === j ? 1 : 0),
    ),
  );
  const rhs = Array.from({ length: size }, (_, i) => (i === size - 1 ? 1 : 0));
  const solution = solve(system, rhs);
  if (solution && solution.every((value) => value > -1e-9)) {
    return solution.map((value) => Math.max(0, value));
  }
  let current = initial ? [...initial] : Array.from({ length: size }, () => 1 / size);
  const average = new Array<number>(size).fill(0);
  const iterations = 2000;
  for (let n = 0; n < iterations; n += 1) {
    current = stepDistribution(current, transition);
    for (let i = 0; i < size; i += 1)
      average[i] = (average[i] ?? 0) + (current[i] ?? 0) / iterations;
  }
  return average;
}

export function nextState(state: number, transition: Matrix, random: Random): number {
  return random.categorical(transition[state] ?? []);
}

/** Total variation distance between two distributions on the same finite set. */
export function totalVariation(p: readonly number[], q: readonly number[]): number {
  return 0.5 * p.reduce((total, value, i) => total + Math.abs(value - (q[i] ?? 0)), 0);
}
