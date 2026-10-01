import { describe, expect, it } from 'vitest';
import {
  buffonPiEstimate,
  buffonProbability,
  combineEvents,
  diagnosticCounts,
  discProbability,
  normalize,
  posterior,
  predictiveValues,
  sequentialPosterior,
  totalProbability,
  eventProbability,
  experiment,
  EXPERIMENT_IDS,
  findEvent,
  formsTriangle,
  frequencyBand,
  meetingProbability,
  needleCrosses,
  realRootsProbability,
} from '../../../src/lib/probability/index.ts';
import { Random } from '../../../src/lib/random/index.ts';

describe('sample spaces', () => {
  it('have the expected sizes and distinct grid cells', () => {
    const sizes: Record<string, number> = {
      moneda: 2,
      dado: 6,
      'dos-monedas': 4,
      'tres-monedas': 8,
      'cuatro-monedas': 16,
      'dos-dados': 36,
      'cuatro-dados': 1296,
      carta: 52,
    };
    for (const id of EXPERIMENT_IDS) {
      const space = experiment(id);
      expect(space.outcomes).toHaveLength(sizes[id] ?? -1);
      expect(space.rows * space.cols).toBe(space.outcomes.length);
      const cells = new Set(space.outcomes.map((o) => `${space.cell(o).row},${space.cell(o).col}`));
      expect(cells.size).toBe(space.outcomes.length);
    }
  });

  it('compute classic probabilities', () => {
    const dice = experiment('dos-dados');
    const p = (id: string) => eventProbability(dice.outcomes, findEvent('dos-dados', id)!.test);
    expect(p('suma-7')).toBeCloseTo(6 / 36);
    expect(p('dobles')).toBeCloseTo(1 / 6);
    expect(p('al-menos-un-seis')).toBeCloseTo(11 / 36);
    const four = experiment('cuatro-dados');
    expect(
      eventProbability(four.outcomes, findEvent('cuatro-dados', 'al-menos-un-seis')!.test),
    ).toBeCloseTo(1 - (5 / 6) ** 4);
    const cards = experiment('carta');
    expect(eventProbability(cards.outcomes, findEvent('carta', 'figura')!.test)).toBeCloseTo(
      12 / 52,
    );
  });

  it('combine events and respect inclusion and exclusion', () => {
    const dice = experiment('dos-dados');
    const a = findEvent('dos-dados', 'suma-mayor-9')!.test;
    const b = findEvent('dos-dados', 'dobles')!.test;
    const prob = (op: Parameters<typeof combineEvents>[0]) =>
      eventProbability(dice.outcomes, combineEvents(op, a, b));
    expect(prob('union')).toBeCloseTo(prob('A') + prob('B') - prob('interseccion'));
    expect(prob('complemento')).toBeCloseTo(1 - prob('A'));
    expect(prob('diferencia')).toBeCloseTo(prob('A') - prob('interseccion'));
  });

  it('normalize weights', () => {
    const die = experiment('dado');
    const even = findEvent('dado', 'par')!.test;
    expect(eventProbability(die.outcomes, even, [1, 1, 1, 1, 1, 1])).toBeCloseTo(0.5);
    expect(eventProbability(die.outcomes, even, [1, 1, 1, 1, 1, 5])).toBeCloseTo(7 / 10);
  });

  it('build a frequency band that shrinks with the trials', () => {
    const narrow = frequencyBand(0.5, 1000);
    const wide = frequencyBand(0.5, 10);
    expect(narrow.high - narrow.low).toBeLessThan(wide.high - wide.low);
    expect(narrow.high - 0.5).toBeCloseTo(1.96 * Math.sqrt(0.25 / 1000));
  });
});

describe('conditional probability', () => {
  it('applies total probability and Bayes theorem', () => {
    const priors = [0.01, 0.99];
    const likelihoods = [0.95, 0.1];
    expect(totalProbability(priors, likelihoods)).toBeCloseTo(0.0095 + 0.099);
    const post = posterior(priors, likelihoods);
    expect(post[0]).toBeCloseTo(0.0095 / 0.1085);
    expect((post[0] ?? 0) + (post[1] ?? 0)).toBeCloseTo(1);
  });

  it('updates sequentially like a single update with multiplied likelihoods', () => {
    const history = sequentialPosterior(
      [0.5, 0.5],
      [
        [0.8, 0.3],
        [0.8, 0.3],
      ],
    );
    expect(history).toHaveLength(3);
    expect(history[2]?.[0]).toBeCloseTo(posterior([0.5, 0.5], [0.64, 0.09])[0] ?? 0);
  });

  it('computes diagnostic counts and predictive values', () => {
    const counts = diagnosticCounts(1000, 0.01, 0.9, 0.95);
    expect(counts.truePositives).toBeCloseTo(9);
    expect(counts.falsePositives).toBeCloseTo(49.5);
    const values = predictiveValues(0.01, 0.9, 0.95);
    expect(values.positive).toBeCloseTo(9 / 58.5);
    expect(values.negative).toBeCloseTo(940.5 / 941.5);
    expect(normalize([0, 0])).toEqual([0, 0]);
  });
});

describe('geometric probability', () => {
  it('gives the exact values of the classic scenarios', () => {
    expect(meetingProbability(15, 60)).toBeCloseTo(7 / 16);
    expect(discProbability(0.5)).toBeCloseTo(0.25);
    expect(realRootsProbability(1, 1)).toBeCloseTo(1 / 12);
    // Area under c = b^2/4 up to b = 2 is 2/3, plus the full strip 2 < b < 4: (2/3 + 2) / 4.
    expect(realRootsProbability(4, 1)).toBeCloseTo(2 / 3);
    expect(buffonProbability(1, 2)).toBeCloseTo(1 / Math.PI);
    expect(buffonPiEstimate(1, 2, 100, 32)).toBeCloseTo(3.125);
  });

  it('matches simulations', () => {
    const random = new Random(7);
    const n = 200000;
    let triangle = 0;
    let crosses = 0;
    for (let i = 0; i < n; i += 1) {
      if (formsTriangle(random.uniform(), random.uniform())) triangle += 1;
      if (needleCrosses(random.uniform(0, 1), random.uniform(0, Math.PI), 1.5)) crosses += 1;
    }
    expect(triangle / n).toBeCloseTo(0.25, 2);
    expect(crosses / n).toBeCloseTo(buffonProbability(1.5, 2), 2);
  });
});
