import { describe, expect, it } from 'vitest';
import {
  autodiffGraph,
  chebyshevNodes,
  differenceErrorModel,
  equispacedNodes,
  finiteDifference,
  floatParts,
  gaussLegendre,
  gaussQuadrature,
  integralRecurrence,
  iterationRadius,
  iterativeSolve,
  lagrangeInterpolant,
  logSumExp,
  machineEpsilon,
  maxError,
  naiveLogSumExp,
  naiveVariance,
  naturalCubicSpline,
  optimalStep,
  simpson,
  softmax,
  solveOde,
  trapezoid,
  welfordVariance,
} from '../../../src/lib/numerics/index.ts';

describe('floating point', () => {
  it('decomposes 0.1 in double precision', () => {
    const parts = floatParts(0.1, 'float64');
    expect(parts.kind).toBe('normal');
    expect(parts.sign).toBe(0);
    expect(parts.exponent).toBe(-4);
    expect(parts.significand * 2 ** parts.exponent).toBe(0.1);
    expect(parts.fractionBits).toHaveLength(52);
  });
  it('shows the rounding of 0.1 in single precision', () => {
    const parts = floatParts(0.1, 'float32');
    expect(parts.stored).toBeCloseTo(0.100000001490116, 14);
    expect(parts.exponentBits).toBe('01111011');
  });
  it('has the standard machine epsilons and ulps', () => {
    expect(machineEpsilon('float64')).toBe(2 ** -52);
    expect(machineEpsilon('float32')).toBe(2 ** -23);
    expect(floatParts(1, 'float64').ulp).toBe(2 ** -52);
    expect(floatParts(1024, 'float32').ulp).toBe(2 ** -13);
  });
  it('classifies zero, subnormal and infinity', () => {
    expect(floatParts(0, 'float32').kind).toBe('cero');
    expect(floatParts(1e-40, 'float32').kind).toBe('subnormal');
    expect(floatParts(1e40, 'float32').kind).toBe('infinito');
  });
});

describe('finite differences', () => {
  it('central differences are more accurate than forward ones', () => {
    const forward = Math.abs(finiteDifference(Math.exp, 1, 1e-3, 'adelante') - Math.E);
    const central = Math.abs(finiteDifference(Math.exp, 1, 1e-3, 'centrada') - Math.E);
    expect(central).toBeLessThan(forward / 100);
  });
  it('the error model is minimized near the optimal step', () => {
    const h = optimalStep('adelante', Math.E, Math.E);
    expect(h).toBeGreaterThan(1e-9);
    expect(h).toBeLessThan(1e-7);
    const at = differenceErrorModel(h, 'adelante', Math.E, Math.E).total;
    expect(differenceErrorModel(h * 10, 'adelante', Math.E, Math.E).total).toBeGreaterThan(at);
    expect(differenceErrorModel(h / 10, 'adelante', Math.E, Math.E).total).toBeGreaterThan(at);
  });
});

describe('stability', () => {
  it('the forward recurrence amplifies the error and the backward one does not', () => {
    const forward = integralRecurrence(20, 'adelante');
    const backward = integralRecurrence(20, 'atras');
    // I_20 lies between 0 and 1/21.
    expect(backward[20]).toBeGreaterThan(0);
    expect(backward[20]).toBeLessThan(1 / 21);
    expect(backward[1]).toBeCloseTo(Math.exp(-1), 12);
    expect(Math.abs(forward[20] ?? 0)).toBeGreaterThan(1);
  });
  it('Welford survives a large offset that breaks the naive variance', () => {
    const data = [4, 7, 13, 16].map((v) => v + 1e9);
    expect(welfordVariance(data)).toBeCloseTo(30, 6);
    expect(Math.abs(naiveVariance(data) - 30)).toBeGreaterThan(1);
  });
  it('log-sum-exp is exact where the naive formula overflows', () => {
    expect(naiveLogSumExp([1000, 1000])).toBe(Infinity);
    expect(logSumExp([1000, 1000])).toBeCloseTo(1000 + Math.log(2), 10);
    expect(logSumExp([1, 2, 3])).toBeCloseTo(naiveLogSumExp([1, 2, 3]), 12);
    const p = softmax([1000, 1001, 1002]);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    expect(p[2]).toBeCloseTo(0.665241, 5);
  });
});

describe('interpolation', () => {
  it('reproduces a polynomial of low degree exactly', () => {
    const xs = [-1, 0, 2, 3];
    const p = lagrangeInterpolant(
      xs,
      xs.map((x) => x ** 3 - x),
    );
    expect(p(1.5)).toBeCloseTo(1.5 ** 3 - 1.5, 10);
  });
  it('shows the Runge phenomenon with equispaced nodes but not with Chebyshev nodes', () => {
    const runge = (x: number) => 1 / (1 + 25 * x * x);
    const make = (xs: number[]) => lagrangeInterpolant(xs, xs.map(runge));
    const equi = maxError(runge, make(equispacedNodes(15, -1, 1)), -1, 1);
    const cheb = maxError(runge, make(chebyshevNodes(15, -1, 1)), -1, 1);
    expect(equi).toBeGreaterThan(2);
    expect(cheb).toBeLessThan(0.1);
  });
  it('the natural spline interpolates and has zero curvature at the ends', () => {
    const xs = [0, 1, 2, 3, 4];
    const ys = [0, 1, 0, 1, 0];
    const s = naturalCubicSpline(xs, ys);
    xs.forEach((x, i) => expect(s(x)).toBeCloseTo(ys[i] ?? 0, 12));
    expect(s.second[0]).toBe(0);
    expect(s.second[4]).toBe(0);
    // Continuity of the first derivative at an interior knot.
    const left = (s(2) - s(2 - 1e-6)) / 1e-6;
    const right = (s(2 + 1e-6) - s(2)) / 1e-6;
    expect(left).toBeCloseTo(right, 4);
  });
  it('a natural spline through points on a line is the line', () => {
    const xs = [0, 0.5, 2, 3];
    const s = naturalCubicSpline(
      xs,
      xs.map((x) => 2 * x + 1),
    );
    expect(s(1.3)).toBeCloseTo(3.6, 10);
  });
});

describe('quadrature', () => {
  it('trapezoid error is of order h^2 and Simpson of order h^4', () => {
    const exact = 1 - Math.cos(1);
    const t1 = Math.abs(trapezoid(Math.sin, 0, 1, 8) - exact);
    const t2 = Math.abs(trapezoid(Math.sin, 0, 1, 16) - exact);
    const s1 = Math.abs(simpson(Math.sin, 0, 1, 8) - exact);
    const s2 = Math.abs(simpson(Math.sin, 0, 1, 16) - exact);
    expect(t1 / t2).toBeCloseTo(4, 1);
    expect(s1 / s2).toBeCloseTo(16, 0);
  });
  it('Simpson is exact for cubics', () => {
    expect(simpson((x) => x ** 3 + x, 0, 2, 2)).toBeCloseTo(6, 12);
  });
  it('Gauss-Legendre nodes and weights match the tables', () => {
    const two = gaussLegendre(2);
    expect(two.nodes[0]).toBeCloseTo(-1 / Math.sqrt(3), 12);
    expect(two.weights[0]).toBeCloseTo(1, 12);
    const three = gaussLegendre(3);
    expect(three.nodes[1]).toBeCloseTo(0, 12);
    expect(three.weights[1]).toBeCloseTo(8 / 9, 12);
    expect(gaussLegendre(5).weights.reduce((a, b) => a + b, 0)).toBeCloseTo(2, 12);
  });
  it('n Gauss points integrate polynomials of degree 2n - 1 exactly', () => {
    expect(gaussQuadrature((x) => x ** 5 - 2 * x ** 2, -1, 2, 3)).toBeCloseTo(10.5 - 6, 10);
    expect(gaussQuadrature(Math.exp, 0, 1, 5)).toBeCloseTo(Math.E - 1, 10);
  });
});

describe('automatic differentiation', () => {
  it('forward and reverse modes agree with the exact partials', () => {
    const [x1, x2] = [2, 3];
    const forward1 = autodiffGraph(x1, x2, 'x1');
    const forward2 = autodiffGraph(x1, x2, 'x2');
    const output = forward1[4];
    expect(output?.value).toBeCloseTo(6 + Math.sin(2), 12);
    expect(output?.tangent).toBeCloseTo(3 + Math.cos(2), 12);
    expect(forward2[4]?.tangent).toBeCloseTo(2, 12);
    expect(forward1[0]?.adjoint).toBeCloseTo(3 + Math.cos(2), 12);
    expect(forward1[1]?.adjoint).toBeCloseTo(2, 12);
  });
});

describe('iterative solvers', () => {
  const A = [
    [4, 1],
    [2, 5],
  ];
  const b = [9, 13];
  it('Jacobi and Gauss-Seidel converge to the solution of a diagonally dominant system', () => {
    const jacobi = iterativeSolve(A, b, [0, 0], 'jacobi', 40).at(-1) ?? [];
    const seidel = iterativeSolve(A, b, [0, 0], 'gauss-seidel', 20).at(-1) ?? [];
    expect(jacobi[0]).toBeCloseTo(16 / 9, 8);
    expect(jacobi[1]).toBeCloseTo(17 / 9, 8);
    expect(seidel[0]).toBeCloseTo(16 / 9, 8);
  });
  it('the Gauss-Seidel radius is the square of the Jacobi radius in 2 by 2', () => {
    expect(iterationRadius(A, 'jacobi')).toBeCloseTo(Math.sqrt(0.1), 12);
    expect(iterationRadius(A, 'gauss-seidel')).toBeCloseTo(0.1, 12);
  });
  it('diverges when the radius exceeds 1', () => {
    const bad = [
      [1, 2],
      [3, 1],
    ];
    const path = iterativeSolve(bad, [3, 4], [0, 0], 'jacobi', 30);
    expect(Math.abs(path.at(-1)?.[0] ?? 0)).toBeGreaterThan(1e3);
  });
});

describe('ODE solvers', () => {
  const decay = (_t: number, y: number) => -y;
  it('Euler is first order and RK4 fourth order', () => {
    const error = (method: 'euler' | 'rk4', h: number) =>
      Math.abs((solveOde(decay, 0, 1, h, Math.round(1 / h), method).at(-1)?.y ?? 0) - Math.exp(-1));
    expect(error('euler', 0.1) / error('euler', 0.05)).toBeCloseTo(2, 0);
    const ratio = error('rk4', 0.1) / error('rk4', 0.05);
    expect(ratio).toBeGreaterThan(14);
    expect(ratio).toBeLessThan(18);
  });
  it('Euler is unstable for a stiff decay with a large step', () => {
    const fast = (_t: number, y: number) => -30 * y;
    const path = solveOde(fast, 0, 1, 0.1, 10, 'euler');
    // Each Euler step multiplies y by 1 - 30 * 0.1 = -2, so ten steps give (-2)^10.
    expect(path.at(-1)?.y).toBeCloseTo(1024, 8);
  });
});
