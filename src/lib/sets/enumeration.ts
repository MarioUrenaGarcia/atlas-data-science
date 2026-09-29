/** Explicit bijections used to show that some infinite sets are countable. */

/** The n-th integer in the order 0, 1, -1, 2, -2, ... (n starts at 0). */
export function integerAt(n: number): number {
  if (n === 0) return 0;
  return n % 2 === 1 ? (n + 1) / 2 : -n / 2;
}

/** Inverse of integerAt: position of an integer in that list. */
export function positionOfInteger(z: number): number {
  return z > 0 ? 2 * z - 1 : -2 * z;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export interface GridStep {
  numerator: number;
  denominator: number;
  /** False when the fraction repeats an earlier value (not in lowest terms) and is skipped. */
  counted: boolean;
}

/**
 * Walks the grid of positive fractions p/q along its anti-diagonals
 * (p + q = 2, 3, 4, ...), alternating direction as in Cantor's zigzag. Only
 * fractions in lowest terms are counted, so each positive rational gets
 * exactly one position.
 */
export function zigzagFractions(count: number): GridStep[] {
  const steps: GridStep[] = [];
  for (let diagonal = 2; steps.length < count; diagonal += 1) {
    const cells: [number, number][] = [];
    for (let p = 1; p < diagonal; p += 1) cells.push([p, diagonal - p]);
    if (diagonal % 2 === 0) cells.reverse();
    for (const [p, q] of cells) {
      if (steps.length >= count) break;
      steps.push({ numerator: p, denominator: q, counted: gcd(p, q) === 1 });
    }
  }
  return steps;
}

/** Binary sequence that differs from row i of the list at position i. */
export function diagonalComplement(rows: readonly (readonly number[])[]): number[] {
  return rows.map((row, index) => 1 - (row[index] ?? 0));
}
