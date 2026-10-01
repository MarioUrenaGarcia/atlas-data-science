const PADDING = 0.08;

/** Data range widened by a margin so points never sit on the axes. */
export function paddedDomain(values: readonly number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * PADDING || 1;
  return [lo - pad, hi + pad];
}
