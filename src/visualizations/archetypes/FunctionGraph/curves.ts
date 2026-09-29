/**
 * Curves in the plane given parametrically, some of which are graphs of
 * functions and some of which are not, for the vertical line test.
 */

export const CURVE_IDS = [
  'parabola',
  'circulo',
  'parabola-lateral',
  'seno',
  'cubica',
  'elipse',
  'raiz',
] as const;
export type CurveId = (typeof CURVE_IDS)[number];

export interface Curve {
  label: string;
  latex: string;
  /** Point of the curve for t in [0, 1]. */
  point: (t: number) => { x: number; y: number };
  isFunction: boolean;
}

const TAU = 2 * Math.PI;

export const CURVES: Record<CurveId, Curve> = {
  parabola: {
    label: 'y = x²',
    latex: 'y = x^2',
    point: (t) => {
      const x = -2 + 4 * t;
      return { x, y: x * x };
    },
    isFunction: true,
  },
  circulo: {
    label: 'x² + y² = 4',
    latex: 'x^2 + y^2 = 4',
    point: (t) => ({ x: 2 * Math.cos(TAU * t), y: 2 * Math.sin(TAU * t) }),
    isFunction: false,
  },
  'parabola-lateral': {
    label: 'x = y²',
    latex: 'x = y^2',
    point: (t) => {
      const y = -2 + 4 * t;
      return { x: y * y, y };
    },
    isFunction: false,
  },
  seno: {
    label: 'y = sen x',
    latex: 'y = \\operatorname{sen} x',
    point: (t) => {
      const x = -3.5 + 7 * t;
      return { x, y: Math.sin(x) };
    },
    isFunction: true,
  },
  cubica: {
    label: 'y = x³ - 3x',
    latex: 'y = x^3 - 3x',
    point: (t) => {
      const x = -2.2 + 4.4 * t;
      return { x, y: x ** 3 - 3 * x };
    },
    isFunction: true,
  },
  elipse: {
    label: 'x²/9 + y²/4 = 1',
    latex: '\\tfrac{x^2}{9} + \\tfrac{y^2}{4} = 1',
    point: (t) => ({ x: 3 * Math.cos(TAU * t), y: 2 * Math.sin(TAU * t) }),
    isFunction: false,
  },
  raiz: {
    label: 'y = √x',
    latex: 'y = \\sqrt{x}',
    point: (t) => {
      const x = 4 * t;
      return { x, y: Math.sqrt(x) };
    },
    isFunction: true,
  },
};

/** Heights where the vertical line x = c meets the curve, from its sampled segments. */
export function verticalHits(curve: Curve, c: number, samples = 600): number[] {
  const hits: number[] = [];
  let previous = curve.point(0);
  for (let i = 1; i <= samples; i += 1) {
    const current = curve.point(i / samples);
    const dx = current.x - previous.x;
    if ((previous.x - c) * (current.x - c) <= 0 && dx !== 0) {
      const ratio = (c - previous.x) / dx;
      const y = previous.y + ratio * (current.y - previous.y);
      if (!hits.some((value) => Math.abs(value - y) < 1e-6)) hits.push(y);
    }
    previous = current;
  }
  return hits.sort((a, b) => a - b);
}
