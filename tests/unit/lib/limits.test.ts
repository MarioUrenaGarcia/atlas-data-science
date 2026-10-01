import { describe, expect, it } from 'vitest';
import { Random } from '../../../src/lib/random/index.ts';
import { mean, variance } from '../../../src/lib/stats/index.ts';
import {
  berryEsseenBound,
  CLT_POPULATION_IDS,
  CLT_POPULATIONS,
  discretize,
  kolmogorovToNormal,
  latticeMoments,
  standardize,
  sumDistributions,
} from '../../../src/lib/limits/clt.ts';
import { exponential } from '../../../src/lib/distributions/index.ts';
import {
  coinMeanOutside,
  SEQUENCE_IDS,
  SEQUENCES,
  typewriterIndex,
} from '../../../src/lib/limits/sequences.ts';
import {
  DISTRIBUTION_SEQUENCE_IDS,
  DISTRIBUTION_SEQUENCES,
  maxCdfDistance,
} from '../../../src/lib/limits/distributionSequences.ts';
import {
  diagnostics,
  SCENARIOS,
  summandAbsoluteThird,
  summandTailVariance,
  summandVariance,
  type Summand,
} from '../../../src/lib/limits/lindeberg.ts';
import {
  LD_POPULATION_IDS,
  LD_POPULATIONS,
  logBinomialUpperTail,
  logCltTail,
  logNormalUpperTail,
  logPoissonUpperTail,
} from '../../../src/lib/limits/largeDeviations.ts';
import {
  iteratedLogScale,
  kolmogorovCdf,
  kolmogorovPdf,
  ksDistance,
} from '../../../src/lib/limits/empirical.ts';
import {
  BIVARIATE_TRANSFORM_IDS,
  BIVARIATE_TRANSFORMS,
  deltaApproximation,
  quadraticForm,
  TRANSFORM_IDS,
  TRANSFORMS,
} from '../../../src/lib/limits/delta.ts';
import {
  covarianceEllipse,
  VECTOR_POPULATION_IDS,
  VECTOR_POPULATIONS,
} from '../../../src/lib/limits/bivariate.ts';
import {
  chebyshevBound,
  LLN_POPULATIONS,
  randomWalk,
  runningMeans,
} from '../../../src/lib/limits/lln.ts';
import {
  eventProbability,
  independentTailUnion,
  oscillation,
  partialSum,
  randomSignSeries,
  seriesVariance,
  simulateEvents,
} from '../../../src/lib/limits/tail.ts';
import {
  atomsCdf,
  MAP_IDS,
  MAPS,
  mapAtoms,
  sequenceAtoms,
  standardizedBinomialAtoms,
} from '../../../src/lib/limits/mapping.ts';

describe('random sequences', () => {
  it('maps indices to typewriter blocks', () => {
    expect(typewriterIndex(1)).toEqual({ block: 1, position: 0 });
    expect(typewriterIndex(2)).toEqual({ block: 2, position: 0 });
    expect(typewriterIndex(3)).toEqual({ block: 2, position: 1 });
    expect(typewriterIndex(4)).toEqual({ block: 3, position: 0 });
    expect(typewriterIndex(6)).toEqual({ block: 3, position: 2 });
    expect(typewriterIndex(7)).toEqual({ block: 4, position: 0 });
    expect(typewriterIndex(5050)).toEqual({ block: 100, position: 99 });
  });

  it('computes the exact probability for the coin mean', () => {
    // n = 4: |K/4 - 1/2| > 0.3 only for K = 0 and K = 4.
    expect(coinMeanOutside(4, 0.3)).toBeCloseTo(2 / 16, 12);
    expect(coinMeanOutside(10, 0.6)).toBe(0);
  });

  for (const id of SEQUENCE_IDS) {
    it(`${id} matches its closed forms by simulation`, () => {
      const sequence = SEQUENCES[id];
      const random = new Random(11);
      const runs = 4000;
      const n = 20;
      const eps = 0.3;
      let outside = 0;
      let square = 0;
      for (let r = 0; r < runs; r += 1) {
        const value = sequence.simulate(random, n)[n - 1] ?? 0;
        if (Math.abs(value) > eps) outside += 1;
        square += value * value;
      }
      if (sequence.outside) expect(outside / runs).toBeCloseTo(sequence.outside(n, eps), 1);
      if (sequence.meanSquare) {
        const expected = sequence.meanSquare(n);
        expect(Math.abs(square / runs - expected)).toBeLessThan(0.15 * Math.max(1, expected));
      }
    });
  }

  it('the typewriter spikes once in every block', () => {
    const path = SEQUENCES['maquina-de-escribir'].simulate(new Random(3), 55);
    let total = 0;
    path.forEach((value) => {
      total += value;
    });
    expect(total).toBe(10);
  });
});

describe('distribution sequences', () => {
  for (const id of DISTRIBUTION_SEQUENCE_IDS) {
    it(`${id} approaches its limit at continuity points`, () => {
      const sequence = DISTRIBUTION_SEQUENCES[id];
      const [lo, hi] = sequence.domain;
      for (const t of [0.13, 0.37, 0.61, 0.89]) {
        const x = lo + (hi - lo) * t;
        if (sequence.jumps.some((jump) => Math.abs(jump - x) < 1e-9)) continue;
        expect(Math.abs(sequence.cdf(5000, x) - sequence.limitCdf(x))).toBeLessThan(0.02);
      }
    });
  }

  it('the constant 1/n never converges uniformly near the jump', () => {
    const sequence = DISTRIBUTION_SEQUENCES['punto-1-n'];
    expect(maxCdfDistance(sequence, 500, 20000).distance).toBe(1);
    expect(sequence.cdf(500, 0)).toBe(0);
    expect(sequence.limitCdf(0)).toBe(1);
  });

  it('the distance shrinks for a continuous limit', () => {
    const sequence = DISTRIBUTION_SEQUENCES['maximo-uniformes'];
    expect(maxCdfDistance(sequence, 100).distance).toBeLessThan(
      maxCdfDistance(sequence, 5).distance,
    );
  });
});

describe('central limit theorem computations', () => {
  it('discretization keeps mass and moments', () => {
    const masses = discretize(exponential(1), 0, 12, 400);
    const moments = latticeMoments(masses);
    expect(moments.mean).toBeCloseTo(1, 2);
    expect(moments.variance).toBeCloseTo(1, 1);
    // E|X - 1|^3 = 12/e - 2 for Exp(1).
    expect(moments.absoluteThird).toBeCloseTo(12 / Math.E - 2, 1);
  });

  for (const id of CLT_POPULATION_IDS) {
    it(`${id}: sums have n times the mean and variance`, () => {
      const population = CLT_POPULATIONS[id];
      const one = latticeMoments(population.masses);
      const sums = sumDistributions(population.masses, 6);
      const six = latticeMoments(sums[5] ?? population.masses);
      let total = 0;
      sums[5]?.masses.forEach((p) => {
        total += p;
      });
      expect(total).toBeCloseTo(1, 9);
      expect(six.mean).toBeCloseTo(6 * one.mean, 6);
      expect(six.variance).toBeCloseTo(6 * one.variance, 6);
    });
  }

  it('matches the simulated population moments', () => {
    const random = new Random(5);
    for (const id of CLT_POPULATION_IDS) {
      const population = CLT_POPULATIONS[id];
      const draws = Array.from({ length: 20000 }, () => population.sample(random));
      const moments = latticeMoments(population.masses);
      expect(Math.abs(mean(draws) - moments.mean)).toBeLessThan(0.05 * Math.max(1, moments.mean));
      expect(Math.abs(variance(draws) - moments.variance) / moments.variance).toBeLessThan(0.12);
    }
  });

  it('the Kolmogorov distance falls below the Berry-Esseen bound', () => {
    for (const id of ['bernoulli', 'exponencial', 'dado'] as const) {
      const population = CLT_POPULATIONS[id];
      const moments = latticeMoments(population.masses);
      const sums = sumDistributions(population.masses, 30);
      for (const n of [1, 5, 30]) {
        const sum = sums[n - 1];
        if (!sum) throw new Error('missing sum');
        const { distance } = kolmogorovToNormal(standardize(sum, n, moments), population.lattice);
        expect(distance).toBeLessThanOrEqual(berryEsseenBound(moments, n) + 0.005);
      }
    }
  });

  it('the Kolmogorov distance for a fair coin with n = 1 is 1/2 - Phi gap', () => {
    const masses = { start: 0, step: 1, masses: Float64Array.from([0.5, 0.5]) };
    const moments = latticeMoments(masses);
    const { distance } = kolmogorovToNormal(standardize(masses, 1, moments), true);
    // Atoms at -1 and 1: the largest gap is Phi(1) - 1/2 on either side... or 1/2 - Phi(-1).
    expect(distance).toBeCloseTo(0.5 - 0.158655, 5);
  });
});

describe('Lindeberg and Lyapunov', () => {
  const cases: Summand[] = [
    { kind: 'uniforme', halfWidth: 1.7 },
    { kind: 'bernoulli', p: 0.3 },
    { kind: 'normal', sd: 1.4 },
  ];
  for (const summand of cases) {
    it(`${summand.kind}: moments agree with simulation`, () => {
      const random = new Random(9);
      const draws = Array.from({ length: 40000 }, () => {
        switch (summand.kind) {
          case 'uniforme':
            return random.uniform(-summand.halfWidth, summand.halfWidth);
          case 'bernoulli':
            return (random.bernoulli(summand.p) ? 1 : 0) - summand.p;
          case 'normal':
            return random.normal(0, summand.sd);
        }
      });
      const v = summandVariance(summand);
      expect(variance(draws, true)).toBeCloseTo(v, 1);
      expect(mean(draws.map((x) => Math.abs(x) ** 3))).toBeCloseTo(
        summandAbsoluteThird(summand),
        0,
      );
      const c = 0.5;
      const tail = mean(draws.map((x) => (Math.abs(x) > c ? x * x : 0)));
      expect(Math.abs(tail - summandTailVariance(summand, c))).toBeLessThan(0.05 * Math.max(1, v));
      expect(summandTailVariance(summand, 0)).toBeCloseTo(v, 9);
    });
  }

  it('identifies which scenarios satisfy the Lindeberg condition', () => {
    for (const scenario of Object.values(SCENARIOS)) {
      const d = diagnostics(scenario, 300, 0.2);
      if (scenario.lindeberg) expect(d.lindeberg).toBeLessThan(0.05);
      else expect(d.lindeberg).toBeGreaterThan(0.2);
      expect(d.shares.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
    }
  });
});

describe('large deviations', () => {
  it('computes exact tails', () => {
    // P(Bin(3, 0.5) >= 2) = 1/2.
    expect(Math.exp(logBinomialUpperTail(3, 0.5, 2))).toBeCloseTo(0.5, 12);
    // P(Poisson(1) >= 1) = 1 - e^-1.
    expect(Math.exp(logPoissonUpperTail(1, 1))).toBeCloseTo(1 - Math.exp(-1), 10);
    expect(Math.exp(logNormalUpperTail(1.96))).toBeCloseTo(0.025, 3);
    // The asymptotic branch agrees with the direct one near the switch.
    expect(logNormalUpperTail(8)).toBeCloseTo(Math.log(6.22096e-16), 2);
  });

  for (const id of LD_POPULATION_IDS) {
    it(`${id}: the rate function vanishes at the mean and matches the exact tails`, () => {
      const population = LD_POPULATIONS[id];
      expect(population.rate(population.mean)).toBeCloseTo(0, 9);
      const a = (population.range[0] + population.range[1]) / 2;
      // Legendre transform: I(a) = theta a - cgf(theta) at the tilt.
      const theta = population.tilt(a);
      expect(theta * a - population.cgf(theta)).toBeCloseTo(population.rate(a), 9);
      // -(1/n) log P approaches I(a) from above.
      const rate200 = -population.logTail(200, a) / 200;
      expect(rate200).toBeGreaterThan(population.rate(a) - 1e-9);
      expect(rate200 - population.rate(a)).toBeLessThan(0.05);
      // Chernoff: P <= exp(-n I(a)).
      expect(population.logTail(30, a)).toBeLessThanOrEqual(-30 * population.rate(a) + 1e-9);
      expect(Number.isFinite(logCltTail(population, 200, a))).toBe(true);
    });
  }
});

describe('empirical processes', () => {
  it('computes the Kolmogorov-Smirnov distance', () => {
    const uniformCdf = (x: number) => Math.min(1, Math.max(0, x));
    expect(ksDistance([0.5], uniformCdf).distance).toBeCloseTo(0.5, 12);
    expect(ksDistance([0.25, 0.75], uniformCdf).distance).toBeCloseTo(0.25, 12);
  });

  it('matches known values of the Kolmogorov distribution', () => {
    expect(kolmogorovCdf(1.358)).toBeCloseTo(0.95, 3);
    expect(kolmogorovCdf(1.628)).toBeCloseTo(0.99, 3);
    const h = 1e-5;
    expect(kolmogorovPdf(0.9)).toBeCloseTo(
      (kolmogorovCdf(0.9 + h) - kolmogorovCdf(0.9 - h)) / (2 * h),
      4,
    );
  });

  it('defines the iterated logarithm scale from n = 3', () => {
    expect(Number.isNaN(iteratedLogScale(2))).toBe(true);
    expect(iteratedLogScale(1000)).toBeCloseTo(Math.sqrt(2000 * Math.log(Math.log(1000))), 12);
  });
});

describe('delta method', () => {
  for (const id of TRANSFORM_IDS) {
    it(`${id}: derivatives agree with finite differences`, () => {
      const t = TRANSFORMS[id];
      const x = 0.4;
      const h = 1e-5;
      expect(t.d1(x)).toBeCloseTo((t.g(x + h) - t.g(x - h)) / (2 * h), 4);
      expect(t.d2(x)).toBeCloseTo((t.d1(x + h) - t.d1(x - h)) / (2 * h), 3);
    });
  }

  it('predicts the spread of log of an exponential mean', () => {
    const random = new Random(21);
    const n = 200;
    const values = Array.from({ length: 3000 }, () => {
      let total = 0;
      for (let i = 0; i < n; i += 1) total += random.exponential(0.5);
      return Math.log(total / n);
    });
    const approx = deltaApproximation(TRANSFORMS.logaritmo, 2, 2, n);
    expect(mean(values)).toBeCloseTo(approx.center, 1);
    expect(Math.sqrt(variance(values)) / approx.sd).toBeCloseTo(1, 1);
  });

  it('switches to second order when the derivative vanishes', () => {
    expect(deltaApproximation(TRANSFORMS['varianza-bernoulli'], 0.5, 0.5, 100).firstOrder).toBe(
      false,
    );
  });

  for (const id of BIVARIATE_TRANSFORM_IDS) {
    it(`${id}: gradient agrees with finite differences`, () => {
      const t = BIVARIATE_TRANSFORMS[id];
      const [gx, gy] = t.gradient(1.3, 0.7);
      const h = 1e-6;
      expect(gx).toBeCloseTo((t.g(1.3 + h, 0.7) - t.g(1.3 - h, 0.7)) / (2 * h), 5);
      expect(gy).toBeCloseTo((t.g(1.3, 0.7 + h) - t.g(1.3, 0.7 - h)) / (2 * h), 5);
    });
  }

  it('evaluates quadratic forms', () => {
    expect(
      quadraticForm(
        [1, 2],
        [
          [2, 0.5],
          [0.5, 1],
        ],
      ),
    ).toBeCloseTo(2 + 2 + 4, 12);
  });
});

describe('vector populations', () => {
  for (const id of VECTOR_POPULATION_IDS) {
    it(`${id}: mean and covariance agree with simulation`, () => {
      const population = VECTOR_POPULATIONS[id];
      const random = new Random(4);
      const draws = Array.from({ length: 40000 }, () => population.sample(random));
      const xs = draws.map((d) => d[0]);
      const ys = draws.map((d) => d[1]);
      expect(mean(xs)).toBeCloseTo(population.mean[0], 1);
      expect(mean(ys)).toBeCloseTo(population.mean[1], 1);
      expect(variance(xs)).toBeCloseTo(population.covariance[0][0], 1);
      expect(variance(ys)).toBeCloseTo(population.covariance[1][1], 1);
      const mx = mean(xs);
      const my = mean(ys);
      const cov = mean(draws.map(([x, y]) => (x - mx) * (y - my)));
      expect(cov).toBeCloseTo(population.covariance[0][1], 1);
    });
  }

  it('computes covariance ellipses', () => {
    const circle = covarianceEllipse(
      [
        [4, 0],
        [0, 1],
      ],
      1,
    );
    expect(circle.rx).toBeCloseTo(2, 12);
    expect(circle.ry).toBeCloseTo(1, 12);
    expect(circle.angle).toBeCloseTo(0, 12);
    const tilted = covarianceEllipse(
      [
        [1, 0.9],
        [0.9, 1],
      ],
      1,
    );
    expect(tilted.angle).toBeCloseTo(Math.PI / 4, 9);
    expect(tilted.rx).toBeCloseTo(Math.sqrt(1.9), 9);
  });
});

describe('law of large numbers helpers', () => {
  it('samples heavy tailed populations correctly', () => {
    const random = new Random(13);
    const pareto = Array.from({ length: 40000 }, () => LLN_POPULATIONS.pareto.sample(random));
    // P(X > 2) = 2^(-1.5) for Pareto(1, 1.5).
    expect(pareto.filter((x) => x > 2).length / pareto.length).toBeCloseTo(2 ** -1.5, 2);
    expect(Math.min(...pareto)).toBeGreaterThanOrEqual(1);
    const cauchy = Array.from({ length: 40000 }, () => LLN_POPULATIONS.cauchy.sample(random));
    expect(cauchy.filter((x) => Math.abs(x) < 1).length / cauchy.length).toBeCloseTo(0.5, 2);
  });

  it('computes running means, walks and the Chebyshev bound', () => {
    const random = new Random(2);
    const [path] = runningMeans(LLN_POPULATIONS.dado, 1, 500, random);
    expect(path?.length).toBe(500);
    expect(Math.abs((path?.[499] ?? 0) - 3.5)).toBeLessThan(0.4);
    const walk = randomWalk(1000, random);
    for (let i = 1; i < walk.length; i += 1)
      expect(Math.abs((walk[i] ?? 0) - (walk[i - 1] ?? 0))).toBe(1);
    expect(chebyshevBound(1, 100, 0.2)).toBeCloseTo(0.25, 12);
    expect(chebyshevBound(1, 1, 0.1)).toBe(1);
  });
});

describe('tail events', () => {
  it('sums event probabilities', () => {
    expect(eventProbability(4, 1, 2)).toBeCloseTo(1 / 16, 12);
    expect(eventProbability(1, 3, 1)).toBe(1);
    expect(partialSum(3, 1, 1)).toBeCloseTo(1 + 1 / 2 + 1 / 3, 12);
  });

  it('computes the probability of a later occurrence', () => {
    // For p_m = 1/m^2, prod_{m >= n} (1 - 1/m^2) = (n - 1)/n.
    const curve = independentTailUnion(50, 1, 2);
    expect(curve[9]).toBeCloseTo(1 / 10, 4);
    expect(curve[0]).toBe(1);
    expect(independentTailUnion(10, 1, 1)[9]).toBe(1);
  });

  it('simulates finitely many dependent occurrences', () => {
    const hits = simulateEvents(10000, 1, 1, true, new Random(8));
    // A_n = {U < 1/n} occurs exactly for n < 1/U, a prefix of the indices.
    hits.forEach((index, k) => expect(index).toBe(k));
  });

  it('matches the variance of the random sign series', () => {
    const random = new Random(10);
    const ends = Array.from({ length: 20000 }, () => randomSignSeries(50, 0.75, random)[49] ?? 0);
    expect(variance(ends)).toBeCloseTo(seriesVariance(50, 0.75), 1);
    expect(oscillation(Float64Array.from([0, 1, -2, 5, 3]), 2)).toBe(7);
  });
});

describe('continuous mapping', () => {
  it('builds the exact standardized binomial', () => {
    const atoms = standardizedBinomialAtoms(10);
    expect(atoms.reduce((t, a) => t + a.p, 0)).toBeCloseTo(1, 12);
    expect(atoms.reduce((t, a) => t + a.x * a.p, 0)).toBeCloseTo(0, 12);
    expect(atoms.reduce((t, a) => t + a.x * a.x * a.p, 0)).toBeCloseTo(1, 12);
  });

  for (const id of MAP_IDS) {
    it(`${id}: g(X_n) approaches the limit law`, () => {
      const map = MAPS[id];
      const atoms = mapAtoms(sequenceAtoms(map, 400), map.g);
      expect(atoms.reduce((t, a) => t + a.p, 0)).toBeCloseTo(1, 9);
      const [lo, hi] = map.domain;
      let worst = 0;
      for (let i = 1; i < 50; i += 1) {
        const y = lo + ((hi - lo) * i) / 50;
        worst = Math.max(worst, Math.abs(atomsCdf(atoms, y) - map.limitCdf(y)));
      }
      if (map.constantSequence) expect(worst).toBe(1);
      else expect(worst).toBeLessThan(0.06);
    });
  }
});
