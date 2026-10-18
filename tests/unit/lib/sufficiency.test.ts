import { describe, expect, it } from 'vitest';
import {
  binarySequences,
  binomialExpectation,
  conditionalGivenSum,
  normalLogLikelihood,
  raoBlackwellPoissonZero,
  sequenceProbability,
} from '../../../src/lib/inference/sufficiency.ts';

describe('sufficiency', () => {
  it('enumerates binary sequences', () => {
    const s = binarySequences(3);
    expect(s).toHaveLength(8);
    expect(s[5]).toEqual([1, 0, 1]);
  });

  it('the conditional law given the sum does not depend on p', () => {
    for (const p of [0.1, 0.5, 0.8]) {
      expect(conditionalGivenSum([1, 0, 1, 0], p)).toBeCloseTo(1 / 6, 12);
      expect(conditionalGivenSum([1, 1, 1, 0], p)).toBeCloseTo(1 / 4, 12);
    }
    expect(sequenceProbability([1, 0, 1], 0.5)).toBeCloseTo(0.125, 12);
  });

  it('computes the Rao-Blackwell estimator of a Poisson zero probability', () => {
    expect(raoBlackwellPoissonZero(4, 0)).toBe(1);
    expect(raoBlackwellPoissonZero(4, 2)).toBeCloseTo(0.5625, 12);
  });

  it('expects a function of a binomial count', () => {
    // g(T) = T has expectation n p.
    expect(binomialExpectation([0, 1, 2, 3], 0.4)).toBeCloseTo(1.2, 12);
    expect(binomialExpectation([0, 0, 0, 0], 0.7)).toBe(0);
  });

  it('two samples with the same mean have likelihoods that differ by a constant', () => {
    const a = [1, 2, 3];
    const b = [0, 2, 4];
    const d1 = normalLogLikelihood(a, 1, 1) - normalLogLikelihood(b, 1, 1);
    const d2 = normalLogLikelihood(a, 5, 1) - normalLogLikelihood(b, 5, 1);
    expect(d1).toBeCloseTo(d2, 12);
  });
});
