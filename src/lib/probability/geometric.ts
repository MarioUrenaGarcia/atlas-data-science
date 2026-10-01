/**
 * Geometric probability scenarios: a point chosen uniformly in a region and
 * a favorable subregion whose area ratio is the probability. Each scenario
 * gives the sampler, the membership test and the exact probability, so a
 * simulation can be compared against the value it estimates.
 */

export const GEOMETRIC_SCENARIOS = [
  'encuentro',
  'cuarto-de-circulo',
  'disco',
  'varilla-rota',
  'raices-reales',
] as const;
export type GeometricScenario = (typeof GEOMETRIC_SCENARIOS)[number];

/** Probability that two arrivals uniform on [0, horizon] are at most `wait` apart. */
export function meetingProbability(wait: number, horizon: number): number {
  const ratio = Math.min(1, Math.max(0, wait / horizon));
  return 1 - (1 - ratio) ** 2;
}

/** A point uniform in the unit disc lands within distance r of the center with probability r squared. */
export function discProbability(radius: number): number {
  const r = Math.min(1, Math.max(0, radius));
  return r * r;
}

/** Two uniform cuts of a unit stick form a triangle when every piece is shorter than one half. */
export function formsTriangle(x: number, y: number): boolean {
  const low = Math.min(x, y);
  const high = Math.max(x, y);
  return low < 0.5 && high - low < 0.5 && 1 - high < 0.5;
}

export const TRIANGLE_PROBABILITY = 0.25;

/**
 * Probability that x^2 + b x + c = 0 has real roots when b and c are uniform
 * on [0, bMax] and [0, cMax]: the area under c = b^2 / 4 divided by the
 * rectangle's area.
 */
export function realRootsProbability(bMax: number, cMax: number): number {
  // The parabola c = b^2/4 reaches cMax at b = 2 sqrt(cMax).
  const cross = Math.min(bMax, 2 * Math.sqrt(cMax));
  const underParabola = cross ** 3 / 12 + (bMax - cross) * cMax;
  return underParabola / (bMax * cMax);
}

/** Probability that a needle of length l crosses one of the parallel lines spaced t apart, for l at most t. */
export function buffonProbability(length: number, spacing: number): number {
  return (2 * length) / (Math.PI * spacing);
}

/** Estimate of pi from the crossing count of Buffon's experiment; infinite while there are no crossings. */
export function buffonPiEstimate(
  length: number,
  spacing: number,
  needles: number,
  crossings: number,
): number {
  if (crossings === 0) return Number.POSITIVE_INFINITY;
  return (2 * length * needles) / (spacing * crossings);
}

/**
 * Whether a needle whose center is at distance `x` from the nearest line and
 * that makes angle `theta` with the lines crosses that line.
 */
export function needleCrosses(x: number, theta: number, length: number): boolean {
  return x <= (length / 2) * Math.sin(theta);
}
