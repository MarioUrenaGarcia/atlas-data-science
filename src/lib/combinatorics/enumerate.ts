/**
 * Explicit listings of small combinatorial families, in lexicographic order of
 * indices, so visualizations can show every object being counted.
 */

/** Ordered selections of k distinct positions out of n (all of them when k = n). */
export function permutations(n: number, k: number = n): number[][] {
  const result: number[][] = [];
  const used = Array.from({ length: n }, () => false);
  const current: number[] = [];
  const visit = () => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < n; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      current.push(i);
      visit();
      current.pop();
      used[i] = false;
    }
  };
  if (k >= 0 && k <= n) visit();
  return result;
}

/** Ordered selections of length k from n symbols where symbols may repeat. */
export function words(n: number, k: number): number[][] {
  const result: number[][] = [];
  const total = n ** k;
  for (let index = 0; index < total; index += 1) {
    const word: number[] = [];
    let rest = index;
    for (let position = 0; position < k; position += 1) {
      word.unshift(rest % n);
      rest = Math.floor(rest / n);
    }
    result.push(word);
  }
  return result;
}

/** Subsets of size k of {0, ..., n - 1}, each listed in increasing order. */
export function combinations(n: number, k: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visit = (start: number) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i <= n - (k - current.length); i += 1) {
      current.push(i);
      visit(i + 1);
      current.pop();
    }
  };
  if (k >= 0 && k <= n) visit(0);
  return result;
}

/** Multisets of size k from n types, as non-decreasing lists of types. */
export function multisets(n: number, k: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visit = (start: number) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < n; i += 1) {
      current.push(i);
      visit(i);
      current.pop();
    }
  };
  if (n > 0 || k === 0) visit(0);
  return result;
}

/** Distinct rearrangements of a sequence that may contain repeated symbols. */
export function distinctPermutations<T>(items: readonly T[]): T[][] {
  const keys = items.map((item) => String(item));
  const order = items
    .map((_, index) => index)
    .sort((a, b) => (keys[a] ?? '').localeCompare(keys[b] ?? ''));
  const sorted = order.map((index) => items[index] as T);
  const sortedKeys = order.map((index) => keys[index] ?? '');
  const result: T[][] = [];
  const used = sorted.map(() => false);
  const current: T[] = [];
  const visit = () => {
    if (current.length === sorted.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < sorted.length; i += 1) {
      if (used[i]) continue;
      // Skipping a symbol equal to an unused earlier copy avoids generating the same word twice.
      if (i > 0 && sortedKeys[i] === sortedKeys[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      current.push(sorted[i] as T);
      visit();
      current.pop();
      used[i] = false;
    }
  };
  visit();
  return result;
}

/** Rotation of a circular arrangement that starts with element 0, used as its representative. */
export function canonicalRotation(arrangement: readonly number[]): number[] {
  const start = arrangement.indexOf(0);
  if (start < 0) return [...arrangement];
  return [...arrangement.slice(start), ...arrangement.slice(0, start)];
}

/**
 * Partitions of {0, ..., n - 1} into non-empty blocks, generated as restricted
 * growth strings (element i joins an existing block or opens the next one).
 */
export function setPartitions(n: number): number[][][] {
  const result: number[][][] = [];
  const labels: number[] = [];
  const visit = (blocks: number) => {
    if (labels.length === n) {
      const partition: number[][] = Array.from({ length: blocks }, () => []);
      labels.forEach((block, element) => partition[block]?.push(element));
      result.push(partition);
      return;
    }
    for (let block = 0; block <= blocks; block += 1) {
      labels.push(block);
      visit(Math.max(blocks, block + 1));
      labels.pop();
    }
  };
  if (n === 0) return [[]];
  visit(0);
  return result;
}

/** Partitions of the integer n as non-increasing lists of parts, largest first. */
export function integerPartitions(n: number, maxPart: number = n): number[][] {
  if (n === 0) return [[]];
  const result: number[][] = [];
  for (let part = Math.min(n, maxPart); part >= 1; part -= 1) {
    for (const rest of integerPartitions(n - part, part)) result.push([part, ...rest]);
  }
  return result;
}

/** Conjugate partition: the column lengths of the Ferrers diagram. */
export function conjugatePartition(parts: readonly number[]): number[] {
  const largest = parts[0] ?? 0;
  return Array.from(
    { length: largest },
    (_, column) => parts.filter((part) => part > column).length,
  );
}

/** Balanced strings of n up steps (1) and n down steps (-1) that never go below zero. */
export function dyckPaths(n: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visit = (ups: number, height: number) => {
    if (current.length === 2 * n) {
      result.push([...current]);
      return;
    }
    if (ups < n) {
      current.push(1);
      visit(ups + 1, height + 1);
      current.pop();
    }
    if (height > 0) {
      current.push(-1);
      visit(ups, height - 1);
      current.pop();
    }
  };
  visit(0, 0);
  return result;
}

/** Number of positions i with permutation[i] === i. */
export function fixedPoints(permutation: readonly number[]): number {
  return permutation.reduce((count, value, index) => count + (value === index ? 1 : 0), 0);
}
