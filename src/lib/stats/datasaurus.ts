import { Random } from '../random/index.ts';

export type Point = [number, number];
type Segment = [number, number, number, number];

/** Summary statistics that the morph keeps fixed, rounded to a number of decimals. */
export interface PairSummary {
  meanX: number;
  meanY: number;
  sdX: number;
  sdY: number;
  correlation: number;
}

export const DATASAURUS_TARGETS = [
  'dinosaurio',
  'circulo',
  'diana',
  'estrella',
  'equis',
  'lineas-horizontales',
  'lineas-verticales',
  'cumulos',
  'nube',
] as const;
export type DatasaurusTarget = (typeof DATASAURUS_TARGETS)[number];

/** Region in data units where every target shape is drawn. */
export const SHAPE_BOX = { x0: 20, x1: 95, y0: 5, y1: 95 } as const;

function polyline(points: readonly Point[]): Segment[] {
  return points.slice(1).map((p, i) => {
    const q = points[i] ?? p;
    return [q[0], q[1], p[0], p[1]];
  });
}

function circle(cx: number, cy: number, r: number, sides = 32): Segment[] {
  return polyline(
    Array.from({ length: sides + 1 }, (_, k) => {
      const t = (2 * Math.PI * k) / sides;
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as Point;
    }),
  );
}

/** Outline of a dinosaur facing right, drawn in a 0 to 100 square: raised tail, back, head, arm and two legs. The raised tail balances the head so the outline is nearly uncorrelated, as in the original Datasaurus. */
const DINO_OUTLINE: Point[] = [
  [0, 85],
  [28, 62],
  [45, 62],
  [60, 72],
  [62, 88],
  [75, 92],
  [92, 86],
  [92, 80],
  [80, 78],
  [72, 72],
  [70, 58],
  [80, 52],
  [82, 46],
  [70, 50],
  [62, 38],
  [64, 20],
  [68, 8],
  [58, 8],
  [54, 28],
  [46, 32],
  [44, 18],
  [46, 8],
  [36, 8],
  [34, 30],
  [22, 48],
  [0, 85],
];

function scaleToBox(segments: Segment[]): Segment[] {
  const { x0, x1, y0, y1 } = SHAPE_BOX;
  const sx = (v: number) => x0 + ((x1 - x0) * v) / 100;
  const sy = (v: number) => y0 + ((y1 - y0) * v) / 100;
  return segments.map(([a, b, c, d]) => [sx(a), sy(b), sx(c), sy(d)]);
}

/** Line segments that make up a target shape, in data units inside SHAPE_BOX. */
export function targetSegments(target: DatasaurusTarget): Segment[] {
  switch (target) {
    case 'dinosaurio':
      return scaleToBox(polyline(DINO_OUTLINE));
    case 'circulo':
      return scaleToBox(circle(50, 50, 40));
    case 'diana':
      return scaleToBox([...circle(50, 50, 42), ...circle(50, 50, 18)]);
    case 'estrella': {
      const points = Array.from({ length: 11 }, (_, k) => {
        const r = k % 2 === 0 ? 46 : 20;
        const t = Math.PI / 2 + (Math.PI * k) / 5;
        return [50 + r * Math.cos(t), 50 + r * Math.sin(t)] as Point;
      });
      return scaleToBox(polyline(points));
    }
    case 'equis':
      return scaleToBox([
        [8, 8, 92, 92],
        [8, 92, 92, 8],
      ]);
    case 'lineas-horizontales':
      return scaleToBox([10, 30, 50, 70, 90].map((y) => [5, y, 95, y] as Segment));
    case 'lineas-verticales':
      return scaleToBox([10, 30, 50, 70, 90].map((x) => [x, 5, x, 95] as Segment));
    case 'cumulos':
      return scaleToBox(
        [20, 50, 80].flatMap((x) => [20, 50, 80].map((y) => [x, y, x, y] as Segment)),
      );
    case 'nube':
      return [];
  }
}

function distanceToSegment(x: number, y: number, [ax, ay, bx, by]: Segment): number {
  const dx = bx - ax;
  const dy = by - ay;
  const length2 = dx * dx + dy * dy;
  const t = length2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length2));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

/**
 * The target shape moved, stretched and sheared so that points spread evenly
 * along it would have the given means, standard deviations and correlation.
 * Without this, a shape wider, narrower or more tilted than the data could
 * never be reached while those statistics stay fixed. The map whitens the
 * shape with its own covariance and colors it with the target one.
 */
export function fittedSegments(target: DatasaurusTarget, summary: PairSummary): Segment[] {
  const segments = targetSegments(target);
  if (segments.length === 0) return segments;
  const shape = pairSummary(pointsOnShape(target, 2000, 1, 0));
  const rs = Number.isFinite(shape.correlation) ? shape.correlation : 0;
  const r = Number.isFinite(summary.correlation) ? summary.correlation : 0;
  const map = (px: number, py: number): Point => {
    const u = (px - shape.meanX) / (shape.sdX || 1);
    const v = ((py - shape.meanY) / (shape.sdY || 1) - rs * u) / Math.sqrt(1 - rs * rs);
    return [
      summary.meanX + summary.sdX * u,
      summary.meanY + summary.sdY * (r * u + Math.sqrt(1 - r * r) * v),
    ];
  };
  return segments.map(([a, b, c, d]) => [...map(a, b), ...map(c, d)]);
}

/** Distance from a point to the nearest segment of the shape; zero when there is no shape. */
export function distanceToShape(x: number, y: number, segments: readonly Segment[]): number {
  let best = Infinity;
  for (const s of segments) best = Math.min(best, distanceToSegment(x, y, s));
  return Number.isFinite(best) ? best : 0;
}

interface Sums {
  n: number;
  x: number;
  y: number;
  xx: number;
  yy: number;
  xy: number;
}

function sumsOf(points: readonly Point[]): Sums {
  const s: Sums = { n: points.length, x: 0, y: 0, xx: 0, yy: 0, xy: 0 };
  for (const [x, y] of points) {
    s.x += x;
    s.y += y;
    s.xx += x * x;
    s.yy += y * y;
    s.xy += x * y;
  }
  return s;
}

function summaryOf(s: Sums): PairSummary {
  const meanX = s.x / s.n;
  const meanY = s.y / s.n;
  const sxx = s.xx - s.n * meanX * meanX;
  const syy = s.yy - s.n * meanY * meanY;
  const sxy = s.xy - s.n * meanX * meanY;
  return {
    meanX,
    meanY,
    sdX: Math.sqrt(Math.max(0, sxx) / (s.n - 1)),
    sdY: Math.sqrt(Math.max(0, syy) / (s.n - 1)),
    correlation: sxy / Math.sqrt(sxx * syy),
  };
}

/** Means, sample standard deviations and Pearson correlation of a set of pairs. */
export function pairSummary(points: readonly Point[]): PairSummary {
  return summaryOf(sumsOf(points));
}

function rounded(s: PairSummary, decimals: number): string {
  return [s.meanX, s.meanY, s.sdX, s.sdY, s.correlation].map((v) => v.toFixed(decimals)).join('|');
}

export interface MorphState {
  points: Point[];
  /** Number of perturbations tried so far toward the current target. */
  iteration: number;
  /** Rounded statistics that every accepted move must preserve. */
  key: string;
  /** Cached distance of each point to the segments it was last measured against. */
  distances: number[];
  segments: readonly Segment[] | null;
}

export interface MorphOptions {
  decimals: number;
  /** Standard deviation of each random move, in data units. */
  shake: number;
  /** Iterations over which the temperature cools from its maximum to its minimum. */
  horizon: number;
  maxTemperature: number;
  minTemperature: number;
}

export const DEFAULT_MORPH: MorphOptions = {
  decimals: 2,
  shake: 0.6,
  horizon: 150000,
  maxTemperature: 0.4,
  minTemperature: 0.01,
};

export function startMorph(
  points: readonly Point[],
  decimals = DEFAULT_MORPH.decimals,
): MorphState {
  return {
    points: points.map(([x, y]) => [x, y]),
    iteration: 0,
    key: rounded(pairSummary(points), decimals),
    distances: [],
    segments: null,
  };
}

/**
 * Simulated annealing of Matejka and Fitzmaurice: a random point takes a small
 * random step; the step is kept only if the rounded means, standard
 * deviations and correlation are unchanged and the point gets closer to the
 * target shape, or, while the temperature is high, at random. The state is
 * modified in place for speed and returned.
 */
export function morphSteps(
  state: MorphState,
  segments: readonly Segment[],
  count: number,
  random: Random,
  options: MorphOptions = DEFAULT_MORPH,
): MorphState {
  const { points } = state;
  const sums = sumsOf(points);
  if (state.segments !== segments) {
    state.segments = segments;
    state.distances = points.map(([x, y]) => distanceToShape(x, y, segments));
  }
  const { distances } = state;
  for (let k = 0; k < count; k += 1) {
    const progress = Math.min(1, state.iteration / options.horizon);
    const temperature =
      options.minTemperature +
      (options.maxTemperature - options.minTemperature) * (1 - progress) * (1 - progress);
    state.iteration += 1;
    const i = Math.floor(random.uniform(0, points.length));
    const p = points[i];
    if (!p) continue;
    const [x, y] = p;
    const nx = x + options.shake * random.normal(0, 1);
    const ny = y + options.shake * random.normal(0, 1);
    const distance = distanceToShape(nx, ny, segments);
    const closer = distance <= (distances[i] ?? Infinity);
    if (!closer && random.uniform(0, 1) >= temperature) continue;
    const trial: Sums = {
      n: sums.n,
      x: sums.x - x + nx,
      y: sums.y - y + ny,
      xx: sums.xx - x * x + nx * nx,
      yy: sums.yy - y * y + ny * ny,
      xy: sums.xy - x * y + nx * ny,
    };
    if (rounded(summaryOf(trial), options.decimals) !== state.key) continue;
    points[i] = [nx, ny];
    distances[i] = distance;
    Object.assign(sums, trial);
  }
  return state;
}

/** Mean distance from the points to the target shape. */
export function meanDistance(points: readonly Point[], segments: readonly Segment[]): number {
  if (points.length === 0) return 0;
  return points.reduce((t, [x, y]) => t + distanceToShape(x, y, segments), 0) / points.length;
}

/**
 * n points spread evenly along the outline of a target shape, with a small
 * random jitter. Starting from the dinosaur gives the classic Datasaurus.
 */
export function pointsOnShape(
  target: DatasaurusTarget,
  n: number,
  seed: number,
  jitter = 1,
): Point[] {
  const random = new Random(seed);
  const segments = targetSegments(target);
  const lengths = segments.map(([ax, ay, bx, by]) => Math.hypot(bx - ax, by - ay));
  const total = lengths.reduce((t, v) => t + v, 0);
  return Array.from({ length: n }, () => {
    if (total === 0) {
      const [ax, ay] = segments[Math.floor(random.uniform(0, segments.length))] ?? [0, 0];
      return [ax + jitter * random.normal(0, 1), ay + jitter * random.normal(0, 1)] as Point;
    }
    let u = random.uniform(0, total);
    let k = 0;
    while (k < segments.length - 1 && u > (lengths[k] ?? 0)) {
      u -= lengths[k] ?? 0;
      k += 1;
    }
    const [ax, ay, bx, by] = segments[k] ?? [0, 0, 0, 0];
    const t = (lengths[k] ?? 0) === 0 ? 0 : u / (lengths[k] ?? 1);
    return [
      ax + t * (bx - ax) + jitter * random.normal(0, 1),
      ay + t * (by - ay) + jitter * random.normal(0, 1),
    ] as Point;
  });
}
