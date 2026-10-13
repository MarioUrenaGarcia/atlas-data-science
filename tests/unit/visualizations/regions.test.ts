import { describe, expect, it } from 'vitest';
import { binomial, normal } from '../../../src/lib/distributions/index.ts';
import {
  inRegion,
  regionLabel,
  regionProbability,
} from '../../../src/visualizations/archetypes/DistributionExplorer/regions.ts';

describe('probability regions', () => {
  it('counts the boundary mass of discrete distributions', () => {
    const d = binomial(20, 0.2);
    expect(regionProbability(d, 'izquierda', 5, 0)).toBeCloseTo(0.8042, 4);
    expect(regionProbability(d, 'derecha', 5, 0)).toBeCloseTo(1 - d.cdf(4), 12);
    expect(regionProbability(d, 'intervalo', 3, 5)).toBeCloseTo(d.pmf(3) + d.pmf(4) + d.pmf(5), 12);
    expect(regionProbability(d, 'intervalo', 5, 3)).toBeCloseTo(d.pmf(3) + d.pmf(4) + d.pmf(5), 12);
    expect(regionProbability(d, 'colas', 2, 7)).toBeCloseTo(d.cdf(2) + 1 - d.cdf(6), 12);
  });

  it('adds both tails of a continuous distribution', () => {
    const z = normal(0, 1);
    expect(regionProbability(z, 'colas', -1.96, 1.96)).toBeCloseTo(0.05, 4);
    expect(regionProbability(z, 'intervalo', -1, 1)).toBeCloseTo(0.6827, 4);
  });

  it('describes and tests membership', () => {
    expect(regionLabel('derecha', 6, 0)).toBe('P(X ≥ 6)');
    expect(regionLabel('colas', 7, 2)).toBe('P(X ≤ 2 o X ≥ 7)');
    expect(inRegion('colas', 2, 7, 5)).toBe(false);
    expect(inRegion('colas', 2, 7, 8)).toBe(true);
    expect(inRegion('izquierda', 3, 0, 3)).toBe(true);
  });
});
