import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import {
  DATASAURUS_TARGETS,
  distanceToShape,
  fittedSegments,
  meanDistance,
  morphSteps,
  pairSummary,
  pointsOnShape,
  startMorph,
  targetSegments,
} from '../../../src/lib/stats/datasaurus.ts';

describe('datasaurus morph', () => {
  it('summarizes pairs with means, sample deviations and correlation', () => {
    const s = pairSummary([
      [1, 2],
      [2, 4],
      [3, 6],
    ]);
    expect(s.meanX).toBeCloseTo(2, 12);
    expect(s.meanY).toBeCloseTo(4, 12);
    expect(s.sdX).toBeCloseTo(1, 12);
    expect(s.sdY).toBeCloseTo(2, 12);
    expect(s.correlation).toBeCloseTo(1, 12);
  });

  it('measures the distance to the nearest segment', () => {
    const segments = [[0, 0, 10, 0] as [number, number, number, number]];
    expect(distanceToShape(5, 3, segments)).toBeCloseTo(3, 12);
    expect(distanceToShape(13, 4, segments)).toBeCloseTo(5, 12);
  });

  it('places the starting points on the dinosaur', () => {
    const points = pointsOnShape('dinosaurio', 142, 7, 0);
    expect(meanDistance(points, targetSegments('dinosaurio'))).toBeLessThan(1e-9);
  });

  it('every target has segments except the free cloud', () => {
    for (const t of DATASAURUS_TARGETS) {
      expect(targetSegments(t).length > 0).toBe(t !== 'nube');
    }
  });

  it('keeps the rounded statistics while moving toward the target', () => {
    const state = startMorph(pointsOnShape('dinosaurio', 142, 7));
    const before = pairSummary(state.points);
    const segments = fittedSegments('equis', before);
    const start = meanDistance(state.points, segments);
    morphSteps(state, segments, 60000, new Random(3));
    const after = pairSummary(state.points);
    expect(meanDistance(state.points, segments)).toBeLessThan(start / 3);
    for (const k of ['meanX', 'meanY', 'sdX', 'sdY', 'correlation'] as const) {
      expect(after[k].toFixed(2)).toBe(before[k].toFixed(2));
    }
  });

  it('fits a shape to the given means and deviations', () => {
    const summary = { meanX: 50, meanY: 40, sdX: 10, sdY: 20, correlation: 0 };
    const segments = fittedSegments('circulo', summary);
    const xs = segments.map((s) => s[0]);
    const ys = segments.map((s) => s[1]);
    expect(xs.reduce((t, v) => t + v, 0) / xs.length).toBeCloseTo(50, 0);
    expect(ys.reduce((t, v) => t + v, 0) / ys.length).toBeCloseTo(40, 0);
  });
});
