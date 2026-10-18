import { describe, expect, it } from 'vitest';
import {
  aggregateBy,
  assignBins,
  bestLambda,
  boxCox,
  collisionPairs,
  cyclicDistance,
  cyclicEncode,
  dateParts,
  equalFrequencyEdges,
  equalWidthEdges,
  fnv1a,
  hashBucket,
  frequencyEncode,
  lpNorm,
  minMaxScale,
  normalizeRow,
  oneHot,
  polynomialFeatureCount,
  robustScale,
  standardize,
  targetEncode,
  targetEncodeOutOfFold,
  trainEmbeddings,
  yeoJohnson,
} from '../../../src/lib/dataprep/features.ts';
import {
  binnedMutualInformation,
  correlationScores,
  forwardSelection,
  inscribedBallFraction,
  lassoPath,
  recursiveElimination,
  selectionData,
  type FeatureSpec,
} from '../../../src/lib/dataprep/selection.ts';
import {
  cosineSimilarity,
  countMatrix,
  ngrams,
  tfidf,
  tokenize,
  vocabulary,
} from '../../../src/lib/dataprep/text.ts';
import { Random } from '../../../src/lib/random/index.ts';
import { mean, standardDeviation } from '../../../src/lib/stats/index.ts';

describe('scaling', () => {
  it('min-max maps the extremes to 0 and 1', () => {
    expect(minMaxScale([2, 4, 6])).toEqual([0, 0.5, 1]);
  });
  it('standardization gives mean 0 and standard deviation 1', () => {
    const z = standardize([3, 7, 8, 12, 20]);
    expect(mean(z)).toBeCloseTo(0);
    expect(standardDeviation(z)).toBeCloseTo(1);
  });
  it('robust scaling uses median and IQR', () => {
    const r = robustScale([1, 2, 3, 4, 5, 100]);
    expect(r[2]).toBeCloseTo((3 - 3.5) / (4.75 - 2.25));
  });
  it('normalizes rows to unit norm', () => {
    expect(lpNorm(normalizeRow([3, 4], 2), 2)).toBeCloseTo(1);
    expect(normalizeRow([3, 1], 1)).toEqual([0.75, 0.25]);
    expect(lpNorm([-3, 2], Number.POSITIVE_INFINITY)).toBe(3);
  });
});

describe('power transforms', () => {
  it('Box-Cox at lambda 0 is the logarithm and at 1 a shift', () => {
    expect(boxCox(Math.E, 0)).toBeCloseTo(1);
    expect(boxCox(5, 1)).toBeCloseTo(4);
  });
  it('Yeo-Johnson is continuous at zero and handles negatives', () => {
    expect(yeoJohnson(0, 0.5)).toBeCloseTo(0);
    expect(yeoJohnson(-1, 2)).toBeCloseTo(-Math.log(2));
  });
  it('the estimated lambda of lognormal data is near zero', () => {
    const random = new Random(3);
    const values = Array.from({ length: 2000 }, () => Math.exp(random.normal()));
    expect(Math.abs(bestLambda(values, 'box-cox'))).toBeLessThan(0.1);
  });
});

describe('binning and encodings', () => {
  it('builds equal width and equal frequency edges', () => {
    expect(equalWidthEdges([1, 15], 2)).toEqual([1, 8, 15]);
    const v = [1, 1.5, 2, 2.2, 3, 3.5, 4, 6, 9, 15];
    const e = equalFrequencyEdges(v, 3);
    expect(e[1]).toBeCloseTo(2.2);
    expect(e[2]).toBeCloseTo(4);
    expect(assignBins(v, e).filter((b) => b === 2).length).toBe(4);
  });
  it('one-hot rows have a single one, or zeros for the reference', () => {
    const m = oneHot(['a', 'b', 'a'], ['a', 'b'], true);
    expect(m).toEqual([[0], [1], [0]]);
  });
  it('target encoding shrinks small categories', () => {
    const enc = targetEncode(['x', 'y', 'y', 'y'], [52, 30, 32, 34], 10);
    expect(enc.byCategory.get('x')).toBeCloseTo((52 + 10 * 37) / 11);
    const oof = targetEncodeOutOfFold(['x', 'y', 'y', 'y'], [52, 30, 32, 34], 0, 4);
    expect(oof[0]).toBeCloseTo(32);
  });
  it('frequency encoding is the share of rows', () => {
    expect(frequencyEncode(['a', 'b', 'a', 'a']).get('a')).toBe(0.75);
  });
  it('hashing is deterministic and collisions follow the bucket count', () => {
    expect(fnv1a('Zapopan')).toBe(fnv1a('Zapopan'));
    expect(fnv1a('')).toBe(0x811c9dc5);
    const many = Array.from({ length: 200 }, (_, i) => `categoria-${i}`);
    const pairs = collisionPairs(many, 64);
    expect(pairs).toBeGreaterThan(200);
    expect(pairs).toBeLessThan(450);
  });
  it('signed hashing gives opposite signs inside a shared bucket with an even k', () => {
    const many = Array.from({ length: 200 }, (_, i) => `categoria-${i}`);
    const byBucket = new Map<number, number[]>();
    for (const c of many) {
      const { bucket, sign } = hashBucket(c, 8);
      byBucket.set(bucket, [...(byBucket.get(bucket) ?? []), sign]);
    }
    const mixed = [...byBucket.values()].filter((s) => s.includes(1) && s.includes(-1));
    expect(mixed.length).toBe(8);
    const positives = many.filter((c) => hashBucket(c, 8).sign === 1).length;
    expect(positives).toBeGreaterThan(70);
    expect(positives).toBeLessThan(130);
  });
  it('counts polynomial features', () => {
    expect(polynomialFeatureCount(5, 2)).toBe(21);
    expect(polynomialFeatureCount(20, 3)).toBe(1771);
  });
});

describe('dates, cycles and aggregation', () => {
  it('extracts calendar parts', () => {
    const p = dateParts('2025-03-08 01:30');
    expect(p.weekday).toBe(5);
    expect(p.weekend).toBe(true);
    expect(p.dayOfYear).toBe(67);
  });
  it('places cyclic values on the unit circle', () => {
    const [s, c] = cyclicEncode(6, 24);
    expect(s).toBeCloseTo(1);
    expect(c).toBeCloseTo(0);
    expect(cyclicDistance(23, 0, 24)).toBeCloseTo(2 * Math.sin(Math.PI / 24));
  });
  it('aggregates by group', () => {
    const agg = aggregateBy(['a', 'b', 'a'], [150, 2400, 210]);
    expect(agg.find((g) => g.key === 'a')).toMatchObject({
      count: 2,
      sum: 360,
      mean: 180,
      max: 210,
    });
  });
  it('embedding training lowers the loss and groups similar categories', () => {
    const groups = [0, 0, 1, 1];
    const target = groups.map((a) => groups.map((b) => (a === b ? 1 : -0.4)));
    const random = new Random(2);
    const start = groups.map(
      () => [random.normal(0, 0.15), random.normal(0, 0.15)] as [number, number],
    );
    const trace = trainEmbeddings(target, start, 300, 0.02);
    expect(trace.losses[300]).toBeLessThan((trace.losses[0] ?? 0) / 10);
    const f = trace.frames[300] ?? [];
    const a = f[0] ?? [0, 0];
    const b = f[1] ?? [0, 0];
    const cos = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
    expect(cos).toBeGreaterThan(0.95);
  });
});

describe('text features', () => {
  const docs = ['La comida rica.', 'El servicio lento pero la comida rica.'].map((d) =>
    tokenize(d),
  );
  it('tokenizes, counts and builds n-grams', () => {
    expect(docs[0]).toEqual(['la', 'comida', 'rica']);
    expect(ngrams(['el', 'servicio', 'no', 'es', 'bueno'], 2)).toHaveLength(4);
    const vocab = vocabulary(docs);
    expect(countMatrix(docs, vocab)[1]).toHaveLength(vocab.length);
  });
  it('tf-idf gives zero weight to words present in every document', () => {
    const vocab = vocabulary(docs);
    const { idf, weights } = tfidf(countMatrix(docs, vocab));
    expect(idf[vocab.indexOf('comida')]).toBe(0);
    expect(idf[vocab.indexOf('lento')]).toBeCloseTo(Math.log(2));
    expect(weights[1]?.[vocab.indexOf('lento')]).toBeCloseTo(Math.log(2) / 7);
  });
  it('cosine similarity', () => {
    expect(cosineSimilarity([1, 1, 0], [1, 1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });
});

describe('feature selection', () => {
  const features: FeatureSpec[] = [
    { name: 'a', role: 'lineal' },
    { name: 'b', role: 'lineal' },
    { name: 'c', role: 'cuadratica' },
    { name: 'd', role: 'ruido' },
  ];
  const data = selectionData(features, 400, 400, 11);

  it('the inscribed ball fraction matches pi/4 and pi/6', () => {
    expect(inscribedBallFraction(2)).toBeCloseTo(Math.PI / 4);
    expect(inscribedBallFraction(3)).toBeCloseTo(Math.PI / 6);
  });
  it('correlation misses the quadratic feature and mutual information finds it', () => {
    const corr = correlationScores(data);
    expect(corr[2]).toBeLessThan(0.15);
    const mi = (j: number) =>
      binnedMutualInformation(
        data.train.x.map((r) => r[j] ?? 0),
        data.train.y,
        6,
      );
    expect(mi(2)).toBeGreaterThan(mi(3));
  });
  it('forward selection adds the strongest linear feature first', () => {
    expect(forwardSelection(data)[1]?.chosen).toEqual([0]);
  });
  it('recursive elimination keeps the strongest feature last', () => {
    const steps = recursiveElimination(data);
    expect(steps[steps.length - 2]?.chosen).toEqual([0]);
  });
  it('lasso starts with all coefficients at zero and lets the strongest in first', () => {
    const path = lassoPath(data, 30);
    expect(path[0]?.coefficients.every((c) => c === 0)).toBe(true);
    const enter = data.names.map((_, j) => path.findIndex((p) => p.coefficients[j] !== 0));
    expect(enter[0]).toBe(Math.min(...enter.filter((e) => e >= 0)));
  });
});
