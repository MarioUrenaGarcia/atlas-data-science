/**
 * Geometric probability scenarios: a point chosen uniformly in a region and
 * a favorable subregion whose area ratio is the probability. Each scenario
 * gives the sampler, the membership test and the exact probability, so a
 * simulation can be compared against the value it estimates.
 */
import type { Random } from '../random/index.ts';

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

export const BERTRAND_METHODS = ['extremos', 'radio', 'punto-medio'] as const;
export type BertrandMethod = (typeof BERTRAND_METHODS)[number];

/** Answer to Bertrand's question (chord longer than the side of the inscribed triangle) for each method. */
export const BERTRAND_ANSWERS: Record<BertrandMethod, number> = {
  extremos: 1 / 3,
  radio: 1 / 2,
  'punto-medio': 1 / 4,
};

export interface Chord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Distance from the center of the unit circle to the chord's midpoint. */
  distance: number;
}

function chordAtDistance(distance: number, angle: number): Chord {
  const half = Math.sqrt(Math.max(0, 1 - distance * distance));
  const mx = distance * Math.cos(angle);
  const my = distance * Math.sin(angle);
  const dx = -Math.sin(angle) * half;
  const dy = Math.cos(angle) * half;
  return { x1: mx - dx, y1: my - dy, x2: mx + dx, y2: my + dy, distance };
}

/**
 * A random chord of the unit circle under each of Bertrand's three methods:
 * two uniform points on the circle, a uniform point on a random radius, or a
 * uniform point in the disc taken as the midpoint.
 */
export function bertrandChord(random: Random, method: BertrandMethod): Chord {
  switch (method) {
    case 'extremos': {
      const a = random.uniform(0, 2 * Math.PI);
      const b = random.uniform(0, 2 * Math.PI);
      const chord = { x1: Math.cos(a), y1: Math.sin(a), x2: Math.cos(b), y2: Math.sin(b) };
      return { ...chord, distance: Math.abs(Math.cos((a - b) / 2)) };
    }
    case 'radio':
      return chordAtDistance(random.uniform(0, 1), random.uniform(0, 2 * Math.PI));
    case 'punto-medio':
      return chordAtDistance(Math.sqrt(random.uniform(0, 1)), random.uniform(0, 2 * Math.PI));
  }
}

/** A chord is longer than the side sqrt(3) of the inscribed triangle exactly when its midpoint is within 1/2 of the center. */
export function chordIsLong(chord: Chord): boolean {
  return chord.distance < 0.5;
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
