import { choose } from '../distributions/special.ts';

export { choose };

/** n! as an exact integer while it stays below 2^53 (n <= 18), rounded beyond that. */
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) return Number.NaN;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

/** Ordered selections of k distinct objects out of n: n (n - 1) ... (n - k + 1). */
export function fallingFactorial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i += 1) result *= n - i;
  return result;
}

/** Number of distinct arrangements of a multiset with the given multiplicities. */
export function multinomial(counts: readonly number[]): number {
  let total = 0;
  let result = 1;
  // Building it as a product of binomials keeps every intermediate value an integer.
  for (const count of counts) {
    total += count;
    result *= choose(total, count);
  }
  return result;
}

/** Multisets of size k drawn from n types: C(n + k - 1, k). */
export function multisetCount(n: number, k: number): number {
  if (n === 0) return k === 0 ? 1 : 0;
  return choose(n + k - 1, k);
}

/** Arrangements of n distinct objects around a circle, up to rotation. */
export function circularPermutations(n: number): number {
  return n <= 0 ? 0 : factorial(n - 1);
}

/** Permutations of n objects with no fixed point, from D(n) = (n - 1)(D(n - 1) + D(n - 2)). */
export function derangements(n: number): number {
  if (n === 0) return 1;
  if (n === 1) return 0;
  let previous = 1;
  let current = 0;
  for (let i = 2; i <= n; i += 1) [previous, current] = [current, (i - 1) * (current + previous)];
  return current;
}

/** Table of Stirling numbers of the second kind S(i, k) for 0 <= k <= i <= n. */
export function stirling2Table(n: number): number[][] {
  const table: number[][] = [[1]];
  for (let i = 1; i <= n; i += 1) {
    const row = [0];
    const above = table[i - 1] ?? [];
    for (let k = 1; k <= i; k += 1) row.push(k * (above[k] ?? 0) + (above[k - 1] ?? 0));
    table.push(row);
  }
  return table;
}

/** Ways to split n labelled objects into k non-empty unlabelled blocks. */
export function stirling2(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return stirling2Table(n)[n]?.[k] ?? 0;
}

/**
 * Bell triangle: each row starts with the last entry of the previous one and
 * every other entry adds its left neighbour and the entry above that neighbour.
 * The first entry of row n is the Bell number B(n).
 */
export function bellTriangle(rows: number): number[][] {
  const triangle: number[][] = [[1]];
  for (let i = 1; i < rows; i += 1) {
    const above = triangle[i - 1] ?? [1];
    const row = [above[above.length - 1] ?? 1];
    for (let j = 1; j <= i; j += 1) row.push((row[j - 1] ?? 0) + (above[j - 1] ?? 0));
    triangle.push(row);
  }
  return triangle;
}

/** Number of partitions of a set of n elements. */
export function bell(n: number): number {
  return bellTriangle(n + 1)[n]?.[0] ?? 0;
}

/** C(2n, n) / (n + 1). */
export function catalan(n: number): number {
  return choose(2 * n, n) / (n + 1);
}

/** Number of partitions of the integer n, counted by adding one allowed part size at a time. */
export function partitionCount(n: number): number {
  const ways: number[] = Array.from({ length: n + 1 }, (_, index) => (index === 0 ? 1 : 0));
  for (let part = 1; part <= n; part += 1) {
    for (let total = part; total <= n; total += 1)
      ways[total] = (ways[total] ?? 0) + (ways[total - part] ?? 0);
  }
  return ways[n] ?? 0;
}

/** Rows 0..n of Pascal's triangle. */
export function pascalRows(n: number): number[][] {
  const rows: number[][] = [[1]];
  for (let i = 1; i <= n; i += 1) {
    const above = rows[i - 1] ?? [1];
    rows.push(Array.from({ length: i + 1 }, (_, k) => (above[k - 1] ?? 0) + (above[k] ?? 0)));
  }
  return rows;
}

/**
 * Size of a union from the sizes of all intersections. `intersection(mask)`
 * returns the size of the intersection of the sets whose bits are on.
 */
export function inclusionExclusion(
  setCount: number,
  intersection: (mask: number) => number,
): number {
  let total = 0;
  for (let mask = 1; mask < 1 << setCount; mask += 1) {
    let bits = 0;
    for (let rest = mask; rest > 0; rest >>= 1) bits += rest & 1;
    total += (bits % 2 === 1 ? 1 : -1) * intersection(mask);
  }
  return total;
}
