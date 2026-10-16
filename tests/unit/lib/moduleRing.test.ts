import { describe, expect, it } from 'vitest';
import { moduleLinks, moduleRing } from '../../../src/lib/graph/moduleRing.ts';

describe('moduleRing', () => {
  it('skips empty modules and keeps module order', () => {
    const bubbles = moduleRing([
      { numero: 0, count: 120 },
      { numero: 1, count: 0 },
      { numero: 2, count: 30 },
      { numero: 3, count: 5 },
    ]);
    expect(bubbles.map((bubble) => bubble.numero)).toEqual([0, 2, 3]);
  });

  it('gives larger modules larger bubbles', () => {
    const [big, small] = moduleRing([
      { numero: 0, count: 100 },
      { numero: 1, count: 25 },
    ]);
    expect(big?.r).toBeGreaterThan(small?.r ?? Infinity);
  });

  it('never overlaps bubbles', () => {
    const counts = [120, 40, 60, 25, 70, 10, 90, 15, 30, 50, 80, 20, 35, 45, 55, 65, 75, 85];
    const bubbles = moduleRing(counts.map((count, numero) => ({ numero, count })));
    expect(bubbles).toHaveLength(counts.length);
    bubbles.forEach((a, i) => {
      bubbles.slice(i + 1).forEach((b) => {
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(a.r + b.r);
      });
    });
  });

  it('centers a single module', () => {
    const [only] = moduleRing([{ numero: 4, count: 12 }]);
    expect(only).toMatchObject({ numero: 4, x: 0, y: 0 });
  });
});

describe('moduleLinks', () => {
  it('counts cross module prerequisites and ignores internal ones', () => {
    const modules: Record<string, number> = { a: 0, b: 0, c: 1, d: 2 };
    const links = moduleLinks(
      [
        { modulo: 0, prerrequisitos: ['a'] },
        { modulo: 1, prerrequisitos: ['a', 'b'] },
        { modulo: 2, prerrequisitos: ['c', 'a', 'missing'] },
      ],
      (id) => modules[id],
    );
    expect(links).toEqual([
      { source: 0, target: 1, weight: 2 },
      { source: 0, target: 2, weight: 1 },
      { source: 1, target: 2, weight: 1 },
    ]);
  });
});
