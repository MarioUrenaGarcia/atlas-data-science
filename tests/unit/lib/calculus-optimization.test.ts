import { describe, expect, it } from 'vitest';
import {
  derivative,
  integrate,
  riemannSum,
  secondDerivative,
  simpson,
  TAYLOR_FUNCTIONS,
  taylorPolynomial,
} from '../../../src/lib/calculus/index.ts';
import {
  armijoStep,
  createOptimizer,
  goldenSection,
  TEST_FUNCTIONS,
  type OptimizerId,
} from '../../../src/lib/optimization/index.ts';

describe('calculus', () => {
  it('differentiates numerically', () => {
    expect(derivative(Math.sin, 0)).toBeCloseTo(1, 9);
    expect(derivative((x) => x ** 3, 2)).toBeCloseTo(12, 7);
    expect(secondDerivative((x) => x ** 3, 2)).toBeCloseTo(12, 4);
  });

  it('integrates with Riemann sums, Simpson and adaptive quadrature', () => {
    const square = (x: number) => x * x;
    expect(riemannSum(square, 0, 1, 4, 'izquierda')).toBeCloseTo(0.21875, 12);
    expect(riemannSum(square, 0, 1, 4, 'derecha')).toBeCloseTo(0.46875, 12);
    expect(riemannSum(square, 0, 1, 4, 'punto-medio')).toBeCloseTo(0.328125, 12);
    expect(riemannSum(square, 0, 1, 4, 'trapecio')).toBeCloseTo(0.34375, 12);
    expect(simpson(square, 0, 1, 2)).toBeCloseTo(1 / 3, 12);
    expect(integrate(Math.exp, 0, 1)).toBeCloseTo(Math.E - 1, 10);
    expect(integrate((x) => Math.exp(-x * x), -8, 8)).toBeCloseTo(Math.sqrt(Math.PI), 9);
  });

  it('builds Taylor polynomials', () => {
    const exp5 = taylorPolynomial(TAYLOR_FUNCTIONS.exp!, 0, 5);
    expect(exp5(1)).toBeCloseTo(1 + 1 + 1 / 2 + 1 / 6 + 1 / 24 + 1 / 120, 12);
    const sin3 = taylorPolynomial(TAYLOR_FUNCTIONS.sin!, 0, 3);
    expect(sin3(0.5)).toBeCloseTo(0.5 - 0.125 / 6, 12);
    const log2 = taylorPolynomial(TAYLOR_FUNCTIONS.log1p!, 0, 2);
    expect(log2(0.1)).toBeCloseTo(0.1 - 0.005, 12);
  });
});

describe('optimization', () => {
  it('converges on the elongated quadratic with every optimizer', () => {
    const quadratic = TEST_FUNCTIONS.cuadratica!;
    const settings: Record<OptimizerId, number> = {
      gradiente: 0.15,
      momentum: 0.05,
      nesterov: 0.05,
      adagrad: 1,
      rmsprop: 0.05,
      adam: 0.2,
      newton: 1,
    };
    for (const [id, learningRate] of Object.entries(settings) as [OptimizerId, number][]) {
      const optimizer = createOptimizer(id, quadratic, [3, 1.5], { learningRate });
      for (let i = 0; i < 400; i += 1) optimizer.step();
      expect(quadratic.f(optimizer.position), id).toBeLessThan(1e-3);
    }
  });

  it('solves a quadratic in one Newton step', () => {
    const optimizer = createOptimizer('newton', TEST_FUNCTIONS.cuadratica!, [3, -2], {
      learningRate: 1,
    });
    const [x, y] = optimizer.step();
    expect(x).toBeCloseTo(0, 12);
    expect(y).toBeCloseTo(0, 12);
  });

  it('has consistent gradients for the test functions', () => {
    for (const fn of Object.values(TEST_FUNCTIONS)) {
      const point: [number, number] = [0.7, -0.4];
      const [gx, gy] = fn.gradient(point);
      const h = 1e-6;
      expect(gx, fn.id).toBeCloseTo(
        (fn.f([point[0] + h, point[1]]) - fn.f([point[0] - h, point[1]])) / (2 * h),
        4,
      );
      expect(gy, fn.id).toBeCloseTo(
        (fn.f([point[0], point[1] + h]) - fn.f([point[0], point[1] - h])) / (2 * h),
        4,
      );
    }
    for (const minimum of TEST_FUNCTIONS.himmelblau!.minima) {
      expect(TEST_FUNCTIONS.himmelblau!.f(minimum)).toBeLessThan(1e-8);
    }
  });

  it('finds Armijo steps and golden-section minima', () => {
    const rosenbrock = TEST_FUNCTIONS.rosenbrock!;
    const point: [number, number] = [-1.2, 1];
    const t = armijoStep(rosenbrock, point);
    const [gx, gy] = rosenbrock.gradient(point);
    expect(rosenbrock.f([point[0] - t * gx, point[1] - t * gy])).toBeLessThan(rosenbrock.f(point));
    expect(goldenSection((x) => (x - 2) ** 2 + 1, -5, 5)).toBeCloseTo(2, 6);
  });
});
