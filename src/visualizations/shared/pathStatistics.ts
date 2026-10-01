/**
 * Summaries over many realizations of a sequence, measured against a center
 * value with tolerance eps.
 */
export interface PathStatistics {
  /** Fraction of paths with |X_n - center| > eps, for n = 1..N at indices 0..N-1. */
  outside: Float64Array;
  /** Fraction of paths that leave the band at some m >= n within the horizon. */
  supOutside: Float64Array;
  /** Average of (X_n - center)^2 over the paths. */
  meanSquare: Float64Array;
  /** Per path, the index of its last exit from the band, or null. */
  lastExit: (number | null)[];
}

export function pathStatistics(
  paths: readonly Float64Array[],
  eps: number,
  center = 0,
): PathStatistics {
  const horizon = paths[0]?.length ?? 0;
  const count = Math.max(1, paths.length);
  const outside = new Float64Array(horizon);
  const meanSquare = new Float64Array(horizon);
  const lastExit = paths.map((path) => {
    let last: number | null = null;
    for (let i = 0; i < horizon; i += 1) {
      const value = (path[i] ?? 0) - center;
      if (Math.abs(value) > eps) {
        last = i;
        outside[i] = (outside[i] ?? 0) + 1 / count;
      }
      meanSquare[i] = (meanSquare[i] ?? 0) + (value * value) / count;
    }
    return last;
  });
  // A path still leaves the band after n exactly when its last exit is at n or later.
  const supOutside = new Float64Array(horizon);
  for (const last of lastExit) {
    if (last === null) continue;
    for (let i = 0; i <= last; i += 1) supOutside[i] = (supOutside[i] ?? 0) + 1 / count;
  }
  return { outside, supOutside, meanSquare, lastExit };
}
