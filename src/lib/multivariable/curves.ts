import type { Point2 } from './index.ts';

/** A parametrized plane curve r(t) with its velocity r'(t). */
export interface Curve2 {
  id: string;
  latex: string;
  r: (t: number) => Point2;
  velocity: (t: number) => Point2;
  tRange: [number, number];
}

const LIST: Curve2[] = [
  {
    id: 'circulo',
    latex: '\\mathbf{r}(t) = (1.2\\cos t,\\ 1.2\\operatorname{sen} t)',
    r: (t) => [1.2 * Math.cos(t), 1.2 * Math.sin(t)],
    velocity: (t) => [-1.2 * Math.sin(t), 1.2 * Math.cos(t)],
    tRange: [0, 2 * Math.PI],
  },
  {
    id: 'recta',
    latex: '\\mathbf{r}(t) = (t,\\ 0.5t - 0.3)',
    r: (t) => [t, 0.5 * t - 0.3],
    velocity: () => [1, 0.5],
    tRange: [-1.8, 1.8],
  },
  {
    id: 'espiral',
    latex: '\\mathbf{r}(t) = (0.3t\\cos t,\\ 0.3t\\operatorname{sen} t)',
    r: (t) => [0.3 * t * Math.cos(t), 0.3 * t * Math.sin(t)],
    velocity: (t) => [0.3 * Math.cos(t) - 0.3 * t * Math.sin(t), 0.3 * Math.sin(t) + 0.3 * t * Math.cos(t)],
    tRange: [0, 6],
  },
];

export const CURVES: Readonly<Record<string, Curve2>> = Object.fromEntries(
  LIST.map((curve) => [curve.id, curve]),
);
export const CURVE_IDS = LIST.map((curve) => curve.id) as [string, ...string[]];

/** Derivative of t -> f(r(t)) by the chain rule: grad f(r(t)) . r'(t). */
export function chainDerivative(
  grad: (x: number, y: number) => Point2,
  curve: Curve2,
  t: number,
): number {
  const [x, y] = curve.r(t);
  const [gx, gy] = grad(x, y);
  const [vx, vy] = curve.velocity(t);
  return gx * vx + gy * vy;
}
