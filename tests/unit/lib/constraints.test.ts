import { describe, expect, it } from 'vitest';
import {
  KKT_CASES,
  LAGRANGE_CASES,
  feasiblePolygon,
  lagrangePoints,
  projectOntoPolygon,
} from '../../../src/lib/multivariable/constraints.ts';

describe('lagrangePoints', () => {
  it('finds the maximum and minimum of x + y on the unit circle', () => {
    const c = LAGRANGE_CASES['suma-circulo'];
    if (!c) throw new Error('missing case');
    const points = lagrangePoints(c);
    const values = points.map((p) => p.value).sort((a, b) => a - b);
    expect(values[0]).toBeCloseTo(-Math.SQRT2, 8);
    expect(values[values.length - 1]).toBeCloseTo(Math.SQRT2, 8);
    const max = points.find((p) => p.value > 0);
    expect(max?.lambda).toBeCloseTo(1 / Math.SQRT2, 8);
  });

  it('finds the minimum of x^2 + y^2 on the line x + y = 1', () => {
    const c = LAGRANGE_CASES['paraboloide-recta'];
    if (!c) throw new Error('missing case');
    const [p] = lagrangePoints(c);
    expect(p?.point[0]).toBeCloseTo(0.5, 8);
    expect(p?.value).toBeCloseTo(0.5, 8);
    expect(p?.lambda).toBeCloseTo(1, 8);
  });
});

describe('feasiblePolygon', () => {
  it('clips the box to the triangle x + y <= 1, x >= 0, y >= 0', () => {
    const triangle = KKT_CASES.triangulo;
    if (!triangle) throw new Error('missing case');
    const vertices = feasiblePolygon(triangle.planes, triangle.domain);
    const area =
      Math.abs(
        vertices.reduce((sum, [x, y], i) => {
          const [nx, ny] = vertices[(i + 1) % vertices.length] ?? [0, 0];
          return sum + x * ny - nx * y;
        }, 0),
      ) / 2;
    expect(area).toBeCloseTo(0.5, 10);
  });
});

describe('projectOntoPolygon', () => {
  const triangle = KKT_CASES.triangulo?.planes ?? [];

  it('keeps an interior target with no active constraints', () => {
    const s = projectOntoPolygon([0.2, 0.3], triangle);
    expect(s.point).toEqual([0.2, 0.3]);
    expect(s.active).toEqual([]);
  });

  it('projects onto an edge with a positive multiplier', () => {
    const s = projectOntoPolygon([1, 1], triangle);
    expect(s.point[0]).toBeCloseTo(0.5, 10);
    expect(s.point[1]).toBeCloseTo(0.5, 10);
    expect(s.active).toEqual([0]);
    expect(s.multipliers[0]).toBeCloseTo(1, 10);
  });

  it('lands on a vertex when two constraints are active', () => {
    const s = projectOntoPolygon([-1, -1], triangle);
    expect(s.point[0]).toBeCloseTo(0, 10);
    expect(s.point[1]).toBeCloseTo(0, 10);
    expect(s.active).toEqual([1, 2]);
    expect(s.multipliers[1]).toBeCloseTo(2, 10);
    expect(s.multipliers[2]).toBeCloseTo(2, 10);
  });
});
