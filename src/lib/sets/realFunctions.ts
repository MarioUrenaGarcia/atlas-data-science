/** Real functions of one variable used to illustrate properties of functions with their graphs. */

export const REAL_FUNCTION_IDS = [
  'identidad',
  'lineal',
  'cuadrado',
  'cubo',
  'cubica',
  'exponencial',
  'logaritmo',
  'raiz',
  'seno',
  'arcotangente',
  'valor-absoluto',
  'parte-entera',
  'fahrenheit',
] as const;

export type RealFunctionId = (typeof REAL_FUNCTION_IDS)[number];

export interface RealFunction {
  latex: string;
  label: string;
  f: (x: number) => number;
  /** Largest interval where the formula is defined. */
  natural: [number, number];
  /** Jumps make the graph a set of pieces; it is drawn without joining them. */
  discontinuous?: boolean;
}

export const REAL_FUNCTIONS: Record<RealFunctionId, RealFunction> = {
  identidad: { latex: 'f(x) = x', label: 'f(x) = x', f: (x) => x, natural: [-Infinity, Infinity] },
  lineal: {
    latex: 'f(x) = 2x + 1',
    label: 'f(x) = 2x + 1',
    f: (x) => 2 * x + 1,
    natural: [-Infinity, Infinity],
  },
  cuadrado: {
    latex: 'f(x) = x^2',
    label: 'f(x) = x²',
    f: (x) => x * x,
    natural: [-Infinity, Infinity],
  },
  cubo: {
    latex: 'f(x) = x^3',
    label: 'f(x) = x³',
    f: (x) => x ** 3,
    natural: [-Infinity, Infinity],
  },
  cubica: {
    latex: 'f(x) = x^3 - 3x',
    label: 'f(x) = x³ - 3x',
    f: (x) => x ** 3 - 3 * x,
    natural: [-Infinity, Infinity],
  },
  exponencial: {
    latex: 'f(x) = e^{x}',
    label: 'f(x) = eˣ',
    f: (x) => Math.exp(x),
    natural: [-Infinity, Infinity],
  },
  logaritmo: {
    latex: 'f(x) = \\log x',
    label: 'f(x) = log x',
    f: (x) => Math.log(x),
    natural: [0, Infinity],
  },
  raiz: {
    latex: 'f(x) = \\sqrt{x}',
    label: 'f(x) = √x',
    f: (x) => Math.sqrt(x),
    natural: [0, Infinity],
  },
  seno: {
    latex: 'f(x) = \\operatorname{sen} x',
    label: 'f(x) = sen x',
    f: (x) => Math.sin(x),
    natural: [-Infinity, Infinity],
  },
  arcotangente: {
    latex: 'f(x) = \\arctan x',
    label: 'f(x) = arctan x',
    f: (x) => Math.atan(x),
    natural: [-Infinity, Infinity],
  },
  'valor-absoluto': {
    latex: 'f(x) = |x|',
    label: 'f(x) = |x|',
    f: (x) => Math.abs(x),
    natural: [-Infinity, Infinity],
  },
  'parte-entera': {
    latex: 'f(x) = \\lfloor x \\rfloor',
    label: 'f(x) = ⌊x⌋',
    f: (x) => Math.floor(x),
    natural: [-Infinity, Infinity],
    discontinuous: true,
  },
  fahrenheit: {
    latex: 'f(c) = \\tfrac{9}{5}c + 32',
    label: 'f(c) = 9c/5 + 32',
    f: (c) => 1.8 * c + 32,
    natural: [-Infinity, Infinity],
  },
};

/** Points sampled along the domain when analysing a function numerically. */
const SAMPLES = 2000;
/** Relative tolerance for comparing values of the function. */
const TOLERANCE = 1e-9;

export function sampleFunction(
  f: (x: number) => number,
  [a, b]: readonly [number, number],
  count = SAMPLES,
) {
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = a + ((b - a) * index) / count;
    return { x, y: f(x) };
  });
}

/** Horizontal levels tried when looking for a value with two preimages. */
const COLLISION_LEVELS = 41;

/**
 * Two clearly separated points with the same value: among several horizontal
 * levels, the one whose outermost preimages are farthest apart. Points next
 * to a turning point would also collide but would be useless as an example.
 */
function widestCollision(
  f: (x: number) => number,
  domain: readonly [number, number],
  low: number,
  high: number,
): [number, number] | null {
  let best: [number, number] | null = null;
  for (let level = 1; level < COLLISION_LEVELS; level += 1) {
    const c = low + ((high - low) * level) / COLLISION_LEVELS;
    const roots = preimages(f, domain, c);
    const first = roots[0];
    const last = roots.at(-1);
    if (roots.length >= 2 && first !== undefined && last !== undefined) {
      if (!best || last - first > best[1] - best[0]) best = [first, last];
    }
  }
  return best;
}

export interface FunctionAnalysis {
  /** Smallest and largest value taken on the domain. */
  range: [number, number];
  /** The graph stays inside the codomain, so f really maps the domain into it. */
  intoCodomain: boolean;
  injective: boolean;
  /** Two domain points with the same value, when the function is not injective. */
  collision: [number, number] | null;
  /** Every value of the codomain is reached (for continuous functions on an interval). */
  surjective: boolean;
  /** A value of the codomain that is never reached, when not surjective. */
  missed: number | null;
}

/**
 * Numerical analysis of a function restricted to an interval. Injectivity is
 * decided by strict monotonicity of the samples (or, for step functions, by
 * repeated values); surjectivity compares the range with the codomain, which
 * is exact for continuous functions on a closed interval.
 */
export function analyzeFunction(
  fn: RealFunction,
  domain: readonly [number, number],
  codomain: readonly [number, number],
): FunctionAnalysis {
  const points = sampleFunction(fn.f, domain);
  const ys = points.map((point) => point.y);
  const low = Math.min(...ys);
  const high = Math.max(...ys);
  const scale = Math.max(1, Math.abs(low), Math.abs(high));
  const tolerance = TOLERANCE * scale;
  let collision: [number, number] | null = null;
  if (fn.discontinuous) {
    for (let i = 1; i < points.length && !collision; i += 1) {
      const current = points[i];
      const previous = points[i - 1];
      if (current && previous && Math.abs(current.y - previous.y) <= tolerance)
        collision = [previous.x, current.x];
    }
  } else {
    let direction = 0;
    for (let i = 1; i < points.length && !collision; i += 1) {
      const current = points[i];
      const previous = points[i - 1];
      if (!current || !previous) continue;
      const change = current.y - previous.y;
      const sign = Math.abs(change) <= tolerance ? 0 : Math.sign(change);
      if (sign === 0 || (direction !== 0 && sign !== direction)) {
        collision = widestCollision(fn.f, domain, low, high) ?? [previous.x, current.x];
      }
      if (sign !== 0) direction = sign;
    }
  }
  const [c, d] = codomain;
  const intoCodomain = low >= c - tolerance && high <= d + tolerance;
  let missed: number | null = null;
  if (fn.discontinuous) {
    const values = new Set(ys.map((y) => Math.round(y / tolerance)));
    const probe = Array.from({ length: 200 }, (_, index) => c + ((d - c) * (index + 0.5)) / 200);
    missed = probe.find((value) => !values.has(Math.round(value / tolerance))) ?? null;
  } else if (low > c + tolerance) missed = (c + low) / 2;
  else if (high < d - tolerance) missed = (high + d) / 2;
  return {
    range: [low, high],
    intoCodomain,
    injective: collision === null,
    collision,
    surjective: missed === null,
    missed,
  };
}

/** Solutions of f(x) = c on the interval, found by sign changes and bisection. */
export function preimages(
  f: (x: number) => number,
  [a, b]: readonly [number, number],
  c: number,
): number[] {
  const points = sampleFunction(f, [a, b], 800);
  const roots: number[] = [];
  const g = (x: number) => f(x) - c;
  for (let i = 1; i < points.length; i += 1) {
    const left = points[i - 1];
    const right = points[i];
    if (!left || !right) continue;
    const gl = left.y - c;
    const gr = right.y - c;
    if (gl === 0) {
      roots.push(left.x);
      continue;
    }
    if (gl * gr < 0) {
      let lo = left.x;
      let hi = right.x;
      for (let step = 0; step < 50; step += 1) {
        const mid = (lo + hi) / 2;
        if (g(lo) * g(mid) <= 0) hi = mid;
        else lo = mid;
      }
      roots.push((lo + hi) / 2);
    }
  }
  const last = points.at(-1);
  if (last && last.y === c) roots.push(last.x);
  return roots;
}
