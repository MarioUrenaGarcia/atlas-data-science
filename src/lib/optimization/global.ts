import { Random } from '../random/index.ts';
import type { Point } from './index.ts';

/**
 * Derivative-free and population methods in two dimensions. Each returns one
 * snapshot per iteration so a visualization can replay the search; all
 * randomness comes from a seeded generator.
 */

type Objective = (p: Point) => number;
export interface Box {
  x: [number, number];
  y: [number, number];
}

const clampTo = (box: Box, [x, y]: Point): Point => [
  Math.min(box.x[1], Math.max(box.x[0], x)),
  Math.min(box.y[1], Math.max(box.y[0], y)),
];

export type SimplexMove = 'inicio' | 'reflexión' | 'expansión' | 'contracción' | 'encogimiento';

export interface NelderMeadStep {
  /** Vertices sorted from best to worst. */
  simplex: [Point, Point, Point];
  move: SimplexMove;
}

/** Nelder-Mead with the standard coefficients: reflection 1, expansion 2, contraction 1/2, shrink 1/2. */
export function nelderMead(f: Objective, start: [Point, Point, Point], iterations: number): NelderMeadStep[] {
  let simplex = [...start].sort((a, b) => f(a) - f(b)) as [Point, Point, Point];
  const steps: NelderMeadStep[] = [{ simplex, move: 'inicio' }];
  for (let k = 0; k < iterations; k += 1) {
    const [best, good, worst] = simplex;
    const centroid: Point = [(best[0] + good[0]) / 2, (best[1] + good[1]) / 2];
    const toward = (c: number): Point => [
      centroid[0] + c * (centroid[0] - worst[0]),
      centroid[1] + c * (centroid[1] - worst[1]),
    ];
    const reflected = toward(1);
    const fr = f(reflected);
    let move: SimplexMove;
    if (fr < f(best)) {
      const expanded = toward(2);
      if (f(expanded) < fr) {
        simplex = [best, good, expanded];
        move = 'expansión';
      } else {
        simplex = [best, good, reflected];
        move = 'reflexión';
      }
    } else if (fr < f(good)) {
      simplex = [best, good, reflected];
      move = 'reflexión';
    } else {
      const contracted = fr < f(worst) ? toward(0.5) : toward(-0.5);
      if (f(contracted) < Math.min(fr, f(worst))) {
        simplex = [best, good, contracted];
        move = 'contracción';
      } else {
        const half = (p: Point): Point => [(best[0] + p[0]) / 2, (best[1] + p[1]) / 2];
        simplex = [best, half(good), half(worst)];
        move = 'encogimiento';
      }
    }
    simplex = [...simplex].sort((a, b) => f(a) - f(b)) as [Point, Point, Point];
    steps.push({ simplex, move });
  }
  return steps;
}

export interface AnnealingStep {
  current: Point;
  candidate: Point;
  best: Point;
  temperature: number;
  accepted: boolean;
  /** Probability with which the candidate was accepted. */
  probability: number;
}

/**
 * Simulated annealing: a random neighbor is always accepted when it is
 * better and with probability exp(-Δ/T) when it is worse; the temperature
 * decreases geometrically.
 */
export function simulatedAnnealing(
  f: Objective,
  box: Box,
  start: Point,
  { iterations = 300, t0 = 10, cooling = 0.98, step = 0.6, seed = 1 } = {},
): AnnealingStep[] {
  const random = new Random(seed);
  let current = start;
  let best = start;
  let temperature = t0;
  const steps: AnnealingStep[] = [
    { current, candidate: start, best, temperature, accepted: true, probability: 1 },
  ];
  for (let k = 0; k < iterations; k += 1) {
    const candidate = clampTo(box, [current[0] + random.normal(0, step), current[1] + random.normal(0, step)]);
    const delta = f(candidate) - f(current);
    const probability = delta <= 0 ? 1 : Math.exp(-delta / temperature);
    const accepted = random.next() < probability;
    if (accepted) current = candidate;
    if (f(current) < f(best)) best = current;
    steps.push({ current, candidate, best, temperature, accepted, probability });
    temperature *= cooling;
  }
  return steps;
}

export interface GenerationStep {
  population: Point[];
  best: Point;
}

/**
 * A real-coded genetic algorithm: tournament selection of size 2, blend
 * crossover, Gaussian mutation and elitism of the best individual.
 */
export function geneticAlgorithm(
  f: Objective,
  box: Box,
  { size = 30, generations = 40, mutation = 0.3, seed = 1 } = {},
): GenerationStep[] {
  const random = new Random(seed);
  const sample = (): Point => [random.uniform(box.x[0], box.x[1]), random.uniform(box.y[0], box.y[1])];
  let population = Array.from({ length: size }, sample);
  const bestOf = (list: Point[]) => list.reduce((b, p) => (f(p) < f(b) ? p : b));
  const steps: GenerationStep[] = [{ population, best: bestOf(population) }];
  const tournament = () => {
    const a = population[random.int(0, size - 1)] as Point;
    const b = population[random.int(0, size - 1)] as Point;
    return f(a) < f(b) ? a : b;
  };
  for (let g = 0; g < generations; g += 1) {
    const elite = bestOf(population);
    const next: Point[] = [elite];
    while (next.length < size) {
      const p = tournament();
      const q = tournament();
      const w = random.next();
      const child: Point = [
        w * p[0] + (1 - w) * q[0] + random.normal(0, mutation),
        w * p[1] + (1 - w) * q[1] + random.normal(0, mutation),
      ];
      next.push(clampTo(box, child));
    }
    population = next;
    steps.push({ population, best: bestOf(population) });
  }
  return steps;
}

export interface SwarmStep {
  positions: Point[];
  velocities: Point[];
  personal: Point[];
  global: Point;
}

/**
 * Particle swarm optimization with inertia w and attraction coefficients
 * c1 toward each particle's best and c2 toward the swarm's best.
 */
export function particleSwarm(
  f: Objective,
  box: Box,
  { size = 20, iterations = 60, w = 0.7, c1 = 1.5, c2 = 1.5, seed = 1 } = {},
): SwarmStep[] {
  const random = new Random(seed);
  let positions = Array.from({ length: size }, (): Point => [
    random.uniform(box.x[0], box.x[1]),
    random.uniform(box.y[0], box.y[1]),
  ]);
  let velocities = positions.map((): Point => [0, 0]);
  let personal = positions.map((p): Point => [p[0], p[1]]);
  let global = personal.reduce((b, p) => (f(p) < f(b) ? p : b));
  const steps: SwarmStep[] = [{ positions, velocities, personal, global }];
  for (let k = 0; k < iterations; k += 1) {
    velocities = velocities.map((v, i) => {
      const p = positions[i] as Point;
      const own = personal[i] as Point;
      return [
        w * v[0] + c1 * random.next() * (own[0] - p[0]) + c2 * random.next() * (global[0] - p[0]),
        w * v[1] + c1 * random.next() * (own[1] - p[1]) + c2 * random.next() * (global[1] - p[1]),
      ];
    });
    positions = positions.map((p, i) => clampTo(box, [p[0] + (velocities[i]?.[0] ?? 0), p[1] + (velocities[i]?.[1] ?? 0)]));
    personal = personal.map((own, i) => {
      const p = positions[i] as Point;
      return f(p) < f(own) ? p : own;
    });
    global = personal.reduce((b, p) => (f(p) < f(b) ? p : b), global);
    steps.push({ positions, velocities, personal, global });
  }
  return steps;
}
