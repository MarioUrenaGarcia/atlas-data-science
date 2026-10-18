import { describe, expect, it } from 'vitest';
import {
  averageLength,
  binaryChannel,
  binaryEntropy,
  blockDistribution,
  composeChannels,
  crossEntropy,
  DIFFERENTIAL_ENTROPY,
  entropy,
  fDivergence,
  huffman,
  jointInformation,
  jsDivergence,
  klDivergence,
  kraftSum,
  maxEntropyWithMean,
  perplexity,
  surprise,
  throughChannel,
  transportPlan,
  wasserstein1,
} from '../../../src/lib/information/index.ts';
import {
  bimodalDensity,
  descriptionLength,
  fitNormal,
  grid,
  polyfit,
} from '../../../src/lib/information/models.ts';

describe('surprise and entropy', () => {
  it('measures surprise in bits', () => {
    expect(surprise(0.5)).toBeCloseTo(1, 12);
    expect(surprise(1 / 8)).toBeCloseTo(3, 12);
    expect(surprise(1)).toBe(-0);
  });
  it('gives the known entropies', () => {
    expect(entropy([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(2, 12);
    expect(entropy([1, 0, 0])).toBe(0);
    expect(binaryEntropy(0.5)).toBeCloseTo(1, 12);
    expect(binaryEntropy(0.1)).toBeCloseTo(0.468996, 5);
    expect(entropy([0.5, 0.5], Math.E)).toBeCloseTo(Math.log(2), 12);
  });
  it('the uniform distribution has the largest entropy', () => {
    expect(entropy([0.7, 0.1, 0.1, 0.1])).toBeLessThan(Math.log2(4));
  });
});

describe('divergences', () => {
  const p = [0.5, 0.25, 0.25];
  const q = [1 / 3, 1 / 3, 1 / 3];
  it('cross-entropy is entropy plus KL', () => {
    expect(crossEntropy(p, q)).toBeCloseTo(entropy(p) + klDivergence(p, q), 12);
    expect(crossEntropy(p, q)).toBeCloseTo(Math.log2(3), 12);
  });
  it('KL is nonnegative, zero only for equal distributions, and asymmetric', () => {
    expect(klDivergence(p, p)).toBe(0);
    expect(klDivergence(p, q)).toBeGreaterThan(0);
    expect(klDivergence(p, q)).not.toBeCloseTo(klDivergence(q, p), 3);
    expect(klDivergence([0.5, 0.5], [1, 0])).toBe(Infinity);
  });
  it('Jensen-Shannon is symmetric and bounded by 1 bit', () => {
    expect(jsDivergence(p, q)).toBeCloseTo(jsDivergence(q, p), 12);
    expect(jsDivergence([1, 0], [0, 1])).toBeCloseTo(1, 12);
  });
  it('f-divergences contain KL and total variation', () => {
    expect(fDivergence(p, q, 'kl')).toBeCloseTo(klDivergence(p, q, Math.E), 12);
    expect(fDivergence(p, q, 'kl-inversa')).toBeCloseTo(klDivergence(q, p, Math.E), 12);
    expect(fDivergence([1, 0], [0.5, 0.5], 'variacion-total')).toBeCloseTo(0.5, 12);
  });
  it('bounded f-divergences stay finite when q misses part of the support of p', () => {
    const a = [0.4, 0.3, 0.3];
    const b = [0.5, 0.5, 0];
    expect(fDivergence(a, b, 'kl')).toBe(Infinity);
    expect(fDivergence(a, b, 'chi-cuadrada')).toBe(Infinity);
    expect(fDivergence(a, b, 'variacion-total')).toBeCloseTo(0.3, 12);
    expect(fDivergence(a, b, 'hellinger')).toBeCloseTo(fDivergence(b, a, 'hellinger'), 12);
    expect(fDivergence(a, b, 'kl-inversa')).toBeCloseTo(klDivergence(b, a, Math.E), 12);
  });
});

describe('joint information', () => {
  it('independent variables have zero mutual information', () => {
    const joint = [
      [0.25, 0.25],
      [0.25, 0.25],
    ];
    const info = jointInformation(joint);
    expect(info.mutual).toBeCloseTo(0, 12);
    expect(info.hxy).toBeCloseTo(2, 12);
  });
  it('a copy has mutual information equal to its entropy', () => {
    const info = jointInformation([
      [0.5, 0],
      [0, 0.5],
    ]);
    expect(info.mutual).toBeCloseTo(1, 12);
    expect(info.hxGivenY).toBeCloseTo(0, 12);
  });
  it('the data processing inequality holds along a chain of channels', () => {
    const p = [0.5, 0.5];
    const W1 = binaryChannel(0.1);
    const W2 = binaryChannel(0.2);
    const ixy = jointInformation(throughChannel(p, W1)).mutual;
    const ixz = jointInformation(throughChannel(p, composeChannels(W1, W2))).mutual;
    expect(ixy).toBeCloseTo(1 - binaryEntropy(0.1), 12);
    expect(ixz).toBeLessThan(ixy);
    expect(ixz).toBeCloseTo(1 - binaryEntropy(0.1 * 0.8 + 0.9 * 0.2), 12);
  });
});

describe('codes', () => {
  it('Huffman gives the optimal code for dyadic probabilities', () => {
    const p = [0.5, 0.25, 0.125, 0.125];
    const { codes } = huffman(p);
    expect(codes.map((c) => c.length)).toEqual([1, 2, 3, 3]);
    expect(averageLength(p, codes)).toBeCloseTo(entropy(p), 12);
    expect(kraftSum(codes)).toBeCloseTo(1, 12);
  });
  it('the average length lies between H and H + 1, and blocks approach H', () => {
    const p = [0.9, 0.1];
    const h = entropy(p);
    const single = averageLength(p, huffman(p).codes);
    const blocks = blockDistribution(p, 3);
    const triple = averageLength(blocks, huffman(blocks).codes) / 3;
    expect(single).toBeGreaterThanOrEqual(h);
    expect(single).toBeLessThan(h + 1);
    expect(triple).toBeLessThan(single);
    expect(triple).toBeGreaterThanOrEqual(h);
  });
  it('codewords form a prefix code', () => {
    const { codes } = huffman([0.4, 0.2, 0.2, 0.1, 0.1]);
    codes.forEach((a, i) =>
      codes.forEach((b, j) => i !== j && expect(b.startsWith(a)).toBe(false)),
    );
  });
});

describe('maximum entropy and other measures', () => {
  it('with mean 3.5 on a die the maximum entropy distribution is uniform', () => {
    const { p } = maxEntropyWithMean([1, 2, 3, 4, 5, 6], 3.5);
    p.forEach((pi) => expect(pi).toBeCloseTo(1 / 6, 8));
  });
  it('with a larger mean it tilts exponentially', () => {
    const { p, lambda } = maxEntropyWithMean([1, 2, 3, 4, 5, 6], 4.5);
    expect(lambda).toBeGreaterThan(0);
    expect(p.reduce((s, pi, i) => s + pi * (i + 1), 0)).toBeCloseTo(4.5, 8);
    expect((p[1] ?? 0) / (p[0] ?? 1)).toBeCloseTo((p[5] ?? 0) / (p[4] ?? 1), 8);
  });
  it('differential entropies of standard families', () => {
    expect(DIFFERENTIAL_ENTROPY.uniforme(0.5)).toBeCloseTo(-1, 12);
    expect(DIFFERENTIAL_ENTROPY.normal(1)).toBeCloseTo(2.047096, 5);
  });
  it('Wasserstein distance moves mass along the line', () => {
    expect(wasserstein1([1, 0, 0], [0, 0, 1])).toBeCloseTo(2, 12);
    expect(wasserstein1([0.5, 0.5, 0], [0, 0.5, 0.5])).toBeCloseTo(1, 12);
    const plan = transportPlan([0.5, 0.5, 0], [0, 0.5, 0.5]);
    expect(plan.reduce((s, t) => s + t.mass * Math.abs(t.to - t.from), 0)).toBeCloseTo(1, 12);
  });
  it('perplexity of a fair die is 6', () => {
    expect(perplexity([1 / 6, 1 / 6, 1 / 6])).toBeCloseTo(6, 10);
  });
});

describe('models', () => {
  const xs = grid(-6, 6, 600);
  const p = bimodalDensity(4);
  it('forward KL matches the moments and reverse KL picks a mode', () => {
    const forward = fitNormal(p, xs, 'forward');
    const reverse = fitNormal(p, xs, 'reverse');
    expect(forward.mu).toBeCloseTo(0, 6);
    expect(forward.sigma).toBeCloseTo(Math.sqrt(4 + 0.36), 3);
    expect(Math.abs(reverse.mu)).toBeGreaterThan(1.5);
    expect(reverse.sigma).toBeLessThan(1);
  });
  it('polyfit recovers a polynomial and MDL prefers its true degree', () => {
    const data = Array.from({ length: 30 }, (_, i) => -1 + (2 * i) / 29);
    const ys = data.map((x, i) => 1 + 2 * x - 3 * x * x + 0.05 * Math.sin(7 * i));
    expect(
      polyfit(
        data,
        data.map((x) => 1 + 2 * x - 3 * x * x),
        2,
      )[2],
    ).toBeCloseTo(-3, 8);
    const totals = [1, 2, 3, 6].map((d) => descriptionLength(data, ys, d).total);
    expect(Math.min(...totals)).toBe(totals[1]);
  });
});
