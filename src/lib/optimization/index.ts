/**
 * Test functions and first- and second-order optimizers in two dimensions,
 * written as step functions so a visualization can animate each iteration.
 */

export type Point = [number, number];

export interface TestFunction {
  id: string;
  label: string;
  f: (p: Point) => number;
  gradient: (p: Point) => Point;
  hessian: (p: Point) => [[number, number], [number, number]];
  /** Suggested plotting window. */
  domain: { x: [number, number]; y: [number, number] };
  /** Known global minimizers, when they exist. */
  minima: Point[];
}

export const TEST_FUNCTIONS: Record<string, TestFunction> = {
  cuadratica: {
    id: 'cuadratica',
    label: 'Cuadrática alargada',
    f: ([x, y]) => 0.5 * (x * x + 10 * y * y),
    gradient: ([x, y]) => [x, 10 * y],
    hessian: () => [
      [1, 0],
      [0, 10],
    ],
    domain: { x: [-4, 4], y: [-2, 2] },
    minima: [[0, 0]],
  },
  rosenbrock: {
    id: 'rosenbrock',
    label: 'Rosenbrock',
    f: ([x, y]) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
    gradient: ([x, y]) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)],
    hessian: ([x, y]) => [
      [2 - 400 * (y - x * x) + 800 * x * x, -400 * x],
      [-400 * x, 200],
    ],
    domain: { x: [-2, 2], y: [-1, 3] },
    minima: [[1, 1]],
  },
  himmelblau: {
    id: 'himmelblau',
    label: 'Himmelblau',
    f: ([x, y]) => (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2,
    gradient: ([x, y]) => [
      4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
      2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
    ],
    hessian: ([x, y]) => [
      [12 * x * x + 4 * y - 42, 4 * x + 4 * y],
      [4 * x + 4 * y, 4 * x + 12 * y * y - 26],
    ],
    domain: { x: [-5, 5], y: [-5, 5] },
    minima: [
      [3, 2],
      [-2.805118, 3.131312],
      [-3.77931, -3.283186],
      [3.584428, -1.848126],
    ],
  },
  silla: {
    id: 'silla',
    label: 'Punto silla',
    f: ([x, y]) => x * x - y * y,
    gradient: ([x, y]) => [2 * x, -2 * y],
    hessian: () => [
      [2, 0],
      [0, -2],
    ],
    domain: { x: [-2, 2], y: [-2, 2] },
    minima: [],
  },
};

export type OptimizerId =
  'gradiente' | 'momentum' | 'nesterov' | 'adagrad' | 'rmsprop' | 'adam' | 'newton';

export interface OptimizerSettings {
  learningRate: number;
  momentum?: number;
  beta1?: number;
  beta2?: number;
  epsilon?: number;
}

export interface Optimizer {
  id: OptimizerId;
  position: Point;
  /** Advances one iteration and returns the new position. */
  step: () => Point;
}

const DEFAULT_EPSILON = 1e-8;

export function createOptimizer(
  id: OptimizerId,
  fn: TestFunction,
  start: Point,
  settings: OptimizerSettings,
): Optimizer {
  const lr = settings.learningRate;
  const mu = settings.momentum ?? 0.9;
  const beta1 = settings.beta1 ?? 0.9;
  const beta2 = settings.beta2 ?? 0.999;
  const epsilon = settings.epsilon ?? DEFAULT_EPSILON;
  let position: Point = [...start];
  let velocity: Point = [0, 0];
  let squares: Point = [0, 0];
  let t = 0;

  const update = (): Point => {
    t += 1;
    switch (id) {
      case 'gradiente': {
        const g = fn.gradient(position);
        return [position[0] - lr * g[0], position[1] - lr * g[1]];
      }
      case 'momentum': {
        const g = fn.gradient(position);
        velocity = [mu * velocity[0] - lr * g[0], mu * velocity[1] - lr * g[1]];
        return [position[0] + velocity[0], position[1] + velocity[1]];
      }
      case 'nesterov': {
        const ahead: Point = [position[0] + mu * velocity[0], position[1] + mu * velocity[1]];
        const g = fn.gradient(ahead);
        velocity = [mu * velocity[0] - lr * g[0], mu * velocity[1] - lr * g[1]];
        return [position[0] + velocity[0], position[1] + velocity[1]];
      }
      case 'adagrad': {
        const g = fn.gradient(position);
        squares = [squares[0] + g[0] * g[0], squares[1] + g[1] * g[1]];
        return [
          position[0] - (lr * g[0]) / (Math.sqrt(squares[0]) + epsilon),
          position[1] - (lr * g[1]) / (Math.sqrt(squares[1]) + epsilon),
        ];
      }
      case 'rmsprop': {
        const g = fn.gradient(position);
        squares = [
          beta2 * squares[0] + (1 - beta2) * g[0] * g[0],
          beta2 * squares[1] + (1 - beta2) * g[1] * g[1],
        ];
        return [
          position[0] - (lr * g[0]) / (Math.sqrt(squares[0]) + epsilon),
          position[1] - (lr * g[1]) / (Math.sqrt(squares[1]) + epsilon),
        ];
      }
      case 'adam': {
        const g = fn.gradient(position);
        velocity = [
          beta1 * velocity[0] + (1 - beta1) * g[0],
          beta1 * velocity[1] + (1 - beta1) * g[1],
        ];
        squares = [
          beta2 * squares[0] + (1 - beta2) * g[0] * g[0],
          beta2 * squares[1] + (1 - beta2) * g[1] * g[1],
        ];
        const mHat: Point = [velocity[0] / (1 - beta1 ** t), velocity[1] / (1 - beta1 ** t)];
        const vHat: Point = [squares[0] / (1 - beta2 ** t), squares[1] / (1 - beta2 ** t)];
        return [
          position[0] - (lr * mHat[0]) / (Math.sqrt(vHat[0]) + epsilon),
          position[1] - (lr * mHat[1]) / (Math.sqrt(vHat[1]) + epsilon),
        ];
      }
      case 'newton': {
        const g = fn.gradient(position);
        const [[a, b], [c, d]] = fn.hessian(position);
        const det = a * d - b * c;
        if (Math.abs(det) < 1e-12) return position;
        // Damped Newton step: lr = 1 gives the pure Newton method.
        const dx = (d * g[0] - b * g[1]) / det;
        const dy = (-c * g[0] + a * g[1]) / det;
        return [position[0] - lr * dx, position[1] - lr * dy];
      }
    }
  };

  return {
    id,
    get position() {
      return position;
    },
    step: () => {
      position = update();
      return position;
    },
  };
}

/**
 * Backtracking line search satisfying the Armijo sufficient-decrease
 * condition f(x - t g) <= f(x) - c t |g|^2.
 */
export function armijoStep(
  fn: TestFunction,
  position: Point,
  initial = 1,
  shrink = 0.5,
  c = 1e-4,
): number {
  const g = fn.gradient(position);
  const squared = g[0] * g[0] + g[1] * g[1];
  const f0 = fn.f(position);
  let t = initial;
  for (let i = 0; i < 60; i += 1) {
    const candidate: Point = [position[0] - t * g[0], position[1] - t * g[1]];
    if (fn.f(candidate) <= f0 - c * t * squared) return t;
    t *= shrink;
  }
  return t;
}

/** Golden-section search for the minimum of a unimodal function on [a, b]. */
export function goldenSection(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance = 1e-10,
): number {
  const ratio = (Math.sqrt(5) - 1) / 2;
  let low = a;
  let high = b;
  let x1 = high - ratio * (high - low);
  let x2 = low + ratio * (high - low);
  let f1 = f(x1);
  let f2 = f(x2);
  while (high - low > tolerance) {
    if (f1 < f2) {
      high = x2;
      x2 = x1;
      f2 = f1;
      x1 = high - ratio * (high - low);
      f1 = f(x1);
    } else {
      low = x1;
      x1 = x2;
      f1 = f2;
      x2 = low + ratio * (high - low);
      f2 = f(x2);
    }
  }
  return (low + high) / 2;
}
