import { describe, expect, it } from 'vitest';
import { hexagonPath, hexbin } from '../../../src/lib/stats/hexbin.ts';

describe('hexbin', () => {
  it('puts points near one center in the same bin', () => {
    const bins = hexbin(
      [
        [0, 0],
        [1, 1],
        [-1, 0.5],
      ],
      10,
    );
    expect(bins).toHaveLength(1);
    expect(bins[0]).toEqual({ x: 0, y: 0, count: 3 });
  });

  it('separates points farther apart than a hexagon', () => {
    const bins = hexbin(
      [
        [0, 0],
        [100, 0],
        [0, 100],
      ],
      10,
    );
    expect(bins).toHaveLength(3);
  });

  it('keeps the total count and assigns each point to its nearest center', () => {
    const points: [number, number][] = [];
    for (let i = 0; i < 40; i += 1) {
      for (let j = 0; j < 40; j += 1) points.push([i * 2.3 + 0.1, j * 1.7 + 0.2]);
    }
    const radius = 6;
    const bins = hexbin(points, radius);
    expect(bins.reduce((t, b) => t + b.count, 0)).toBe(points.length);
    // In a hexagonal tiling every point lies within one circumradius of its own center.
    const centers = bins.map((b) => [b.x, b.y] as const);
    for (const [x, y] of points) {
      const nearest = Math.min(...centers.map(([cx, cy]) => Math.hypot(x - cx, y - cy)));
      expect(nearest).toBeLessThanOrEqual(radius + 1e-9);
    }
  });

  it('draws a closed path with six vertices', () => {
    const path = hexagonPath(5);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.split('L')).toHaveLength(6);
  });
});
