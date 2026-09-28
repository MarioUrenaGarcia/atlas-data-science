import { scaleLinear } from 'd3-scale';
import type { Distribution } from '../../lib/distributions/index.ts';

const TAIL = 0.002;

/**
 * Horizontal window that shows the bulk of every given distribution, clipped
 * to `limits` so heavy tails (Cauchy, Pareto) do not flatten the plot. The
 * result is rounded to readable tick values; discrete windows end on halves.
 */
export function plotWindow(
  distributions: readonly Distribution[],
  limits: [number, number],
  discrete: boolean,
): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const distribution of distributions) {
    const [s0, s1] = distribution.support;
    const left =
      Number.isFinite(s0) && distribution.cdf(s0) >= TAIL ? s0 : distribution.quantile(TAIL);
    const right = Number.isFinite(s1)
      ? Math.min(s1, distribution.quantile(1 - TAIL))
      : distribution.quantile(1 - TAIL);
    lo = Math.min(lo, Number.isFinite(s0) && !discrete ? Math.min(s0, left) : left);
    hi = Math.max(hi, Number.isFinite(s1) && !discrete && s1 - s0 <= 1.0001 ? s1 : right);
  }
  lo = Math.max(limits[0], lo);
  hi = Math.min(limits[1], hi);
  if (!(hi > lo)) return limits;
  if (discrete) return [Math.floor(lo) - 0.5, Math.ceil(hi) + 0.5];
  const padding = (hi - lo) * 0.05;
  const [niceLo = lo, niceHi = hi] = scaleLinear()
    .domain([Math.max(limits[0], lo - padding), Math.min(limits[1], hi + padding)])
    .nice()
    .domain();
  return [Math.max(limits[0], niceLo), Math.min(limits[1], niceHi)];
}
