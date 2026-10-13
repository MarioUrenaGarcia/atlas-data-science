import { describe, expect, it } from 'vitest';
import {
  classifyCritical,
  contourSegments,
  criticalPoints,
  det2,
  doubleIntegral,
  FIELDS,
  MAPS,
} from '../../../src/lib/multivariable/index.ts';

const H = 1e-5;
const POINTS: [number, number][] = [
  [0.3, -0.4],
  [-0.7, 0.9],
  [1.1, 0.2],
];

describe('field catalog', () => {
  for (const field of Object.values(FIELDS)) {
    it(`${field.id}: gradient and Hessian match finite differences`, () => {
      for (const [x, y] of POINTS) {
        const [gx, gy] = field.grad(x, y);
        expect(gx).toBeCloseTo((field.f(x + H, y) - field.f(x - H, y)) / (2 * H), 4);
        expect(gy).toBeCloseTo((field.f(x, y + H) - field.f(x, y - H)) / (2 * H), 4);
        const [[a, b], [c, d]] = field.hess(x, y);
        expect(a).toBeCloseTo((field.grad(x + H, y)[0] - field.grad(x - H, y)[0]) / (2 * H), 3);
        expect(b).toBeCloseTo((field.grad(x, y + H)[0] - field.grad(x, y - H)[0]) / (2 * H), 3);
        expect(c).toBeCloseTo(b, 10);
        expect(d).toBeCloseTo((field.grad(x, y + H)[1] - field.grad(x, y - H)[1]) / (2 * H), 3);
      }
    });
  }
});

describe('contourSegments', () => {
  it('traces the circle x^2 + y^2 = 1 with points on it', () => {
    const segments = contourSegments(
      (x, y) => x * x + y * y,
      [
        [-2, 2],
        [-2, 2],
      ],
      1,
      80,
      80,
    );
    expect(segments.length).toBeGreaterThan(40);
    for (const { a } of segments) expect(Math.hypot(a[0], a[1])).toBeCloseTo(1, 2);
    const length = segments.reduce((t, { a, b }) => t + Math.hypot(a[0] - b[0], a[1] - b[1]), 0);
    expect(length).toBeCloseTo(2 * Math.PI, 1);
  });
});

describe('critical points', () => {
  it('finds the minimum and the saddle of x^3 - 3x + y^2', () => {
    const field = FIELDS['min-y-silla'];
    if (!field) throw new Error('missing field');
    const found = criticalPoints(field);
    expect(found).toHaveLength(2);
    expect(found[0]?.point[0]).toBeCloseTo(-1, 8);
    expect(found[0]?.kind).toBe('silla');
    expect(found[1]?.point[0]).toBeCloseTo(1, 8);
    expect(found[1]?.kind).toBe('mínimo');
  });

  it('classifies Hessians', () => {
    expect(
      classifyCritical([
        [2, 0],
        [0, 3],
      ]),
    ).toBe('mínimo');
    expect(
      classifyCritical([
        [-2, 1],
        [1, -2],
      ]),
    ).toBe('máximo');
    expect(
      classifyCritical([
        [1, 2],
        [2, 1],
      ]),
    ).toBe('silla');
    expect(
      classifyCritical([
        [1, 1],
        [1, 1],
      ]),
    ).toBe('degenerado');
  });
});

describe('integration and maps', () => {
  it('integrates x y over the unit square and the Gaussian over a large square', () => {
    expect(doubleIntegral((x, y) => x * y, [0, 1], [0, 1])).toBeCloseTo(0.25, 6);
    expect(doubleIntegral((x, y) => Math.exp(-(x * x + y * y)), [-6, 6], [-6, 6])).toBeCloseTo(
      Math.PI,
      5,
    );
  });

  it('polar Jacobian determinant is r', () => {
    const polar = MAPS.polares;
    if (!polar) throw new Error('missing map');
    expect(det2(polar.jacobian(1.7, 0.6) as [[number, number], [number, number]])).toBeCloseTo(
      1.7,
      12,
    );
  });
});

describe('critical points of harder fields', () => {
  it('reports the degenerate monkey saddle once', () => {
    const points = criticalPoints(FIELDS['silla-mono']!);
    expect(points).toHaveLength(1);
    expect(points[0]?.kind).toBe('degenerado');
  });

  it('finds the nine critical points of Himmelblau', () => {
    const kinds = criticalPoints(FIELDS.himmelblau!).map((p) => p.kind);
    expect(kinds.filter((k) => k === 'mínimo')).toHaveLength(4);
    expect(kinds.filter((k) => k === 'máximo')).toHaveLength(1);
    expect(kinds.filter((k) => k === 'silla')).toHaveLength(4);
  });
});
