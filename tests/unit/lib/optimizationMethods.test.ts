import { describe, expect, it } from 'vitest';
import {
  lassoObjective,
  leastSquaresLine,
  lineData,
  paretoFront,
  PLANE_SETS,
  proximalGradient,
  segmentTrials,
  softThreshold,
  stochasticGradientPath,
  weightedOptimum,
  objectives,
} from '../../../src/lib/optimization/extras.ts';
import { geneticAlgorithm, nelderMead, particleSwarm, simulatedAnnealing } from '../../../src/lib/optimization/global.ts';
import { TEST_FUNCTIONS, type TestFunction } from '../../../src/lib/optimization/index.ts';
import { feasibleVertices, projectionDual, simplex } from '../../../src/lib/optimization/linear.ts';
import { lineSearchTrials, optimizerPath } from '../../../src/lib/optimization/paths.ts';

const fn = (id: string) => TEST_FUNCTIONS[id] as TestFunction;
const last = <T>(list: T[]) => list[list.length - 1] as T;

describe('optimizer paths', () => {
  it('reach the minimum (1, -1) of the rotated quadratic', () => {
    for (const method of ['gradiente-armijo', 'gradiente-exacto', 'bfgs', 'lbfgs', 'conjugado', 'coordenadas'] as const) {
      const end = last(optimizerPath(method, fn('girada'), [-2, 2], 200)).point;
      expect(end[0]).toBeCloseTo(1, 4);
      expect(end[1]).toBeCloseTo(-1, 4);
    }
  });

  it('solves a two-variable quadratic in two conjugate gradient steps', () => {
    const path = optimizerPath('conjugado', fn('girada'), [-2, 2], 2);
    const end = last(path).point;
    expect(end[0]).toBeCloseTo(1, 6);
    expect(end[1]).toBeCloseTo(-1, 6);
  });

  it('solves a quadratic in one Newton step and diverges with too large a learning rate', () => {
    const newton = optimizerPath('newton', fn('girada'), [-2, 2], 1, 1);
    expect(last(newton).point[0]).toBeCloseTo(1, 10);
    // On the elongated quadratic the largest curvature is 10, so rates above 0.2 diverge.
    const diverging = optimizerPath('gradiente', fn('cuadratica'), [3, 1], 30, 0.21);
    expect(Math.abs(last(diverging).point[1])).toBeGreaterThan(1);
    const converging = optimizerPath('gradiente', fn('cuadratica'), [3, 1], 200, 0.15);
    expect(Math.abs(last(converging).point[1])).toBeLessThan(1e-6);
  });

  it('finds the Rosenbrock minimum with BFGS', () => {
    const end = last(optimizerPath('bfgs', fn('rosenbrock'), [-1.2, 1], 200)).point;
    expect(end[0]).toBeCloseTo(1, 3);
    expect(end[1]).toBeCloseTo(1, 3);
  });

  it('backtracks until the Armijo condition holds', () => {
    const f = fn('cuadratica');
    const x: [number, number] = [3, 1];
    const g = f.gradient(x);
    const trials = lineSearchTrials(f, x, [-g[0], -g[1]]);
    expect(last(trials).armijo).toBe(true);
    expect(trials.slice(0, -1).every((t) => !t.armijo)).toBe(true);
    expect(last(trials).alpha).toBeLessThan(1);
  });
});

describe('derivative-free and population methods', () => {
  const himmelblau = fn('himmelblau');
  const box = { x: [-5, 5] as [number, number], y: [-5, 5] as [number, number] };

  it('Nelder-Mead shrinks onto a minimum of Himmelblau', () => {
    const steps = nelderMead(himmelblau.f, [[0, 0], [1, 0], [0, 1]], 120);
    expect(himmelblau.f(last(steps).simplex[0])).toBeLessThan(1e-6);
  });

  it('annealing, genetic algorithm and swarm get near a global minimum and are reproducible', () => {
    const rastrigin = fn('rastrigin');
    const area = { x: [-4, 4] as [number, number], y: [-4, 4] as [number, number] };
    const swarm = particleSwarm(rastrigin.f, area, { seed: 3, iterations: 120, size: 30 });
    expect(rastrigin.f(last(swarm).global)).toBeLessThan(1);
    const genetic = geneticAlgorithm(himmelblau.f, box, { seed: 3, generations: 60 });
    expect(himmelblau.f(last(genetic).best)).toBeLessThan(0.5);
    const annealing = simulatedAnnealing(himmelblau.f, box, [-4, -4], { seed: 3, iterations: 600 });
    expect(himmelblau.f(last(annealing).best)).toBeLessThan(1);
    expect(simulatedAnnealing(himmelblau.f, box, [-4, -4], { seed: 3 })).toEqual(
      simulatedAnnealing(himmelblau.f, box, [-4, -4], { seed: 3 }),
    );
  });
});

describe('linear programming and duality', () => {
  // Maximize 3x + 5y with x <= 4, 2y <= 12, 3x + 2y <= 18: optimum (2, 6) with value 36.
  const lp = { c: [3, 5], a: [[1, 0], [0, 2], [3, 2]], b: [4, 12, 18] };

  it('walks along vertices to the optimum and reports the shadow prices', () => {
    const result = simplex(lp);
    const end = last(result.steps);
    expect(result.status).toBe('óptimo');
    expect(end.x[0]).toBeCloseTo(2, 10);
    expect(end.x[1]).toBeCloseTo(6, 10);
    expect(end.value).toBeCloseTo(36, 10);
    // Duals (0, 3/2, 1): by strong duality 4·0 + 12·1.5 + 18·1 = 36.
    expect(result.duals[0]).toBeCloseTo(0, 10);
    expect(result.duals[1]).toBeCloseTo(1.5, 10);
    expect(result.duals[2]).toBeCloseTo(1, 10);
    expect(result.steps.every((s, i) => i === 0 || s.value >= (result.steps[i - 1]?.value ?? 0))).toBe(true);
  });

  it('lists the five vertices of the feasible region', () => {
    expect(feasibleVertices(lp)).toHaveLength(5);
  });

  it('has a dual maximum equal to the primal minimum of a projection', () => {
    const { muStar, primal, dualOptimum, g } = projectionDual([1, 1], [1, 1], 1);
    expect(muStar).toBeCloseTo(0.5, 10);
    expect(primal).toBeCloseTo(0.25, 10);
    expect(dualOptimum).toBeCloseTo(primal, 10);
    // Weak duality: every dual value is a lower bound.
    expect(g(0.2)).toBeLessThan(primal);
  });
});

describe('proximal, stochastic and multiobjective helpers', () => {
  it('soft-thresholds and solves a lasso with an exact zero', () => {
    expect(softThreshold(3, 1)).toBe(2);
    expect(softThreshold(-0.5, 1)).toBe(0);
    const problem = { a: [[1, 0], [0, 1]] as [[number, number], [number, number]], b: [2, 0.4] as [number, number], lambda: 0.6 };
    const end = last(proximalGradient(problem, [0, 0], 50)).point;
    // With A = I the solution is the soft threshold of b: (1.4, 0).
    expect(end[0]).toBeCloseTo(1.4, 10);
    expect(end[1]).toBe(0);
    expect(lassoObjective(problem, end)).toBeLessThan(lassoObjective(problem, [1.4, 0.1]));
  });

  it('brings stochastic gradient descent near the least-squares line', () => {
    const data = lineData(40, 1, 2, 0.5, 7);
    const target = leastSquaresLine(data);
    const path = stochasticGradientPath(data, [0, 0], { batch: 40, rate: 0.1, iterations: 300 });
    expect(last(path)[0]).toBeCloseTo(target[0], 6);
    expect(last(path)[1]).toBeCloseTo(target[1], 6);
  });

  it('keeps only non-dominated points and finds the weighted optimum on the front', () => {
    expect(paretoFront([[1, 3], [2, 2], [3, 1], [2.5, 2.5]])).toHaveLength(3);
    const [f1, f2] = objectives(weightedOptimum(0.5));
    expect(f1).toBeCloseTo(1.25, 10);
    expect(f2).toBeCloseTo(1.25, 10);
  });

  it('finds segments that leave non-convex sets but never convex ones', () => {
    expect(segmentTrials(PLANE_SETS.disco!, 50, 1).every((t) => t.exit === null)).toBe(true);
    expect(segmentTrials(PLANE_SETS.anillo!, 50, 1).some((t) => t.exit !== null)).toBe(true);
  });
});
