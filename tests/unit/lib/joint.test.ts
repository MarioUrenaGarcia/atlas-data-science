import { describe, expect, it } from 'vitest';
import {
  conditionalSummaries,
  covarianceAxes,
  dependenceGap,
  discretizeDensity,
  distributionOf,
  jointCdf,
  jointFromExperiment,
  jointModel,
  makeJoint,
  marginalX,
  marginalY,
  summarizeJoint,
  varianceDecomposition,
} from '../../../src/lib/probability/joint.ts';
import {
  empiricalTail,
  kendallTau,
  sampleCopula,
  tailDependence,
} from '../../../src/lib/probability/copula.ts';
import { orderStatisticCdf, orderStatisticDensity } from '../../../src/lib/probability/order.ts';
import {
  mixtureSequence,
  polyaSequence,
  polyaSequenceProbability,
} from '../../../src/lib/probability/exchangeable.ts';
import { Random } from '../../../src/lib/random/index.ts';

const first = (o: readonly number[]) => o[0] ?? 0;
const sum = (o: readonly number[]) => (o[0] ?? 0) + (o[1] ?? 0);

describe('joint tables', () => {
  it('builds the first die and the sum of two dice', () => {
    const joint = jointFromExperiment('dos-dados', first, sum);
    expect(joint.xs).toEqual([1, 2, 3, 4, 5, 6]);
    expect(joint.ys).toHaveLength(11);
    expect(marginalX(joint).probs.every((p) => Math.abs(p - 1 / 6) < 1e-12)).toBe(true);
    expect(marginalY(joint).probs[5]).toBeCloseTo(6 / 36, 12);
    const s = summarizeJoint(joint);
    // Cov(X1, X1 + X2) = Var(X1) = 35/12 and the correlation is 1/sqrt(2).
    expect(s.covariance).toBeCloseTo(35 / 12, 10);
    expect(s.correlation).toBeCloseTo(1 / Math.sqrt(2), 10);
    expect(jointCdf(joint, 1, 7)).toBeCloseTo(6 / 36, 12);
  });

  it('detects dependence with zero correlation', () => {
    // X uniform on {-1, 0, 1} and Y = X^2.
    const joint = makeJoint(
      [-1, 0, 1],
      [0, 1],
      [
        [0, 1],
        [1, 0],
        [0, 1],
      ],
    );
    expect(summarizeJoint(joint).covariance).toBeCloseTo(0, 12);
    expect(dependenceGap(joint)).toBeGreaterThan(0.1);
  });

  it('satisfies the laws of total expectation and total variance', () => {
    const joint = jointFromExperiment('dos-dados', first, sum);
    const rows = conditionalSummaries(joint);
    expect(rows[2]?.mean).toBeCloseTo(3 + 3.5, 12);
    const decomposition = varianceDecomposition(joint);
    expect(decomposition.explained).toBeCloseTo(35 / 12, 10);
    expect(decomposition.unexplained).toBeCloseTo(35 / 12, 10);
    expect(decomposition.total).toBeCloseTo(35 / 6, 10);
  });

  it('computes the distribution of the sum by convolution', () => {
    const die = makeJoint(
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 1)),
    );
    const s = distributionOf(die, (x, y) => x + y);
    expect(s.values).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(s.probs[5]).toBeCloseTo(1 / 6, 12);
  });

  it('discretizes the bivariate normal with the right correlation', () => {
    const model = jointModel('normal-bivariada', {
      muX: 0,
      muY: 0,
      sigmaX: 1,
      sigmaY: 2,
      rho: 0.6,
    });
    const joint = discretizeDensity(model.density, model.xWindow, model.yWindow, 80);
    const s = summarizeJoint(joint);
    expect(s.correlation).toBeCloseTo(0.6, 2);
    expect(Math.sqrt(s.varY)).toBeCloseTo(2, 1);
  });

  it('finds the axes of a covariance matrix', () => {
    const axes = covarianceAxes(2, 1, 2);
    expect(axes.values[0]).toBeCloseTo(3, 12);
    expect(axes.values[1]).toBeCloseTo(1, 12);
    expect(Math.abs(axes.vectors[0][0])).toBeCloseTo(Math.SQRT1_2, 12);
  });
});

describe('copulas', () => {
  it('samples pairs with the right Kendall tau', () => {
    const random = new Random(7);
    for (const [id, theta] of [
      ['gaussiana', 0.7],
      ['clayton', 2],
      ['gumbel', 2],
      ['frank', 5],
    ] as const) {
      const pairs = Array.from({ length: 1500 }, () => sampleCopula(id, theta, random));
      let concordant = 0;
      let discordant = 0;
      for (let i = 0; i < 400; i += 1) {
        for (let j = i + 1; j < 400; j += 1) {
          const a = pairs[i];
          const b = pairs[j];
          if (!a || !b) continue;
          const sign = (a[0] - b[0]) * (a[1] - b[1]);
          if (sign > 0) concordant += 1;
          else if (sign < 0) discordant += 1;
        }
      }
      const tau = (concordant - discordant) / (concordant + discordant);
      expect(Math.abs(tau - kendallTau(id, theta))).toBeLessThan(0.07);
      expect(pairs.every(([u, v]) => u >= 0 && u <= 1 && v >= 0 && v <= 1)).toBe(true);
    }
  });

  it('gives the known tail coefficients', () => {
    expect(tailDependence('clayton', 2).lower).toBeCloseTo(2 ** -0.5, 12);
    expect(tailDependence('gumbel', 2).upper).toBeCloseTo(2 - Math.SQRT2, 12);
    expect(kendallTau('clayton', 2)).toBeCloseTo(0.5, 12);
    expect(kendallTau('frank', 5)).toBeCloseTo(0.4567, 3);
    const random = new Random(3);
    const pairs = Array.from({ length: 20000 }, () => sampleCopula('gumbel', 3, random));
    expect(empiricalTail(pairs, 0.98, 'upper')).toBeGreaterThan(0.55);
  });
});

describe('order statistics', () => {
  it('matches the beta density for uniforms', () => {
    // The 2nd of 3 uniforms has density 6u(1 - u).
    expect(orderStatisticDensity(2, 3, 0.4, 1)).toBeCloseTo(6 * 0.4 * 0.6, 12);
    // The maximum of n uniforms has distribution function u^n.
    expect(orderStatisticCdf(5, 5, 0.8)).toBeCloseTo(0.8 ** 5, 12);
    expect(orderStatisticCdf(1, 5, 0.2)).toBeCloseTo(1 - 0.8 ** 5, 12);
  });
});

describe('exchangeable sequences', () => {
  it('assigns the same probability to every order', () => {
    const p = polyaSequenceProbability(1, 1, 3, 2);
    // With one ball of each color, 1, 1, 0 has probability 1/2 * 2/3 * 1/4 = 1/12.
    expect(p).toBeCloseTo(1 / 12, 12);
  });

  it('produces sequences with the beta-mixture mean', () => {
    const random = new Random(11);
    let urn = 0;
    let mixture = 0;
    for (let r = 0; r < 600; r += 1) {
      urn += polyaSequence(2, 1, 20, random).reduce((a, b) => a + b, 0);
      mixture += mixtureSequence(2, 1, 20, random).draws.reduce((a, b) => a + b, 0);
    }
    expect(urn / (600 * 20)).toBeCloseTo(2 / 3, 1);
    expect(mixture / (600 * 20)).toBeCloseTo(2 / 3, 1);
  });
});
