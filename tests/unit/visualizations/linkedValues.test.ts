import { describe, expect, it } from 'vitest';
import { linkedValues } from '../../../src/visualizations/archetypes/DistributionExplorer/linkedValues.ts';

describe('linkedValues', () => {
  it('multiplies main parameters for λ = n p', () => {
    expect(linkedValues({ lambda: { de: ['n', 'p'] } }, { n: 50, p: 0.05 })).toEqual({
      lambda: 2.5,
    });
  });

  it('applies powers and factors', () => {
    const values = linkedValues(
      { lambda: { de: ['theta'], potencias: [-1] }, alpha: { de: ['k'], factor: 0.5 } },
      { theta: 4, k: 6 },
    );
    expect(values.lambda).toBeCloseTo(0.25);
    expect(values.alpha).toBe(3);
  });

  it('returns nothing without links', () => {
    expect(linkedValues(undefined, { n: 3 })).toEqual({});
  });
});
