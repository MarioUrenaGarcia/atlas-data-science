/**
 * Information theory on finite distributions and a few continuous families:
 * surprise, entropies, divergences, Huffman codes, maximum entropy, the data
 * processing inequality and the one-dimensional Wasserstein distance.
 * Logarithms are in base 2 (bits) unless a base is given.
 */

export type Distribution = readonly number[];

const log = (x: number, base: number) => Math.log(x) / Math.log(base);

/** Normalizes nonnegative weights so they sum to 1. */
export function normalize(weights: readonly number[]): number[] {
  const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);
  if (total === 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => Math.max(0, w) / total);
}

/** Surprise -log p of an event with probability p. */
export function surprise(p: number, base = 2): number {
  return -log(p, base);
}

/** Shannon entropy; terms with p = 0 contribute 0. */
export function entropy(p: Distribution, base = 2): number {
  return p.reduce((sum, pi) => (pi > 0 ? sum - pi * log(pi, base) : sum), 0);
}

/** Binary entropy of a coin with probability p of heads. */
export function binaryEntropy(p: number, base = 2): number {
  return entropy([p, 1 - p], base);
}

/** Cross-entropy H(p, q); infinite if q is 0 where p is positive. */
export function crossEntropy(p: Distribution, q: Distribution, base = 2): number {
  return p.reduce((sum, pi, i) => {
    if (pi === 0) return sum;
    const qi = q[i] ?? 0;
    return qi > 0 ? sum - pi * log(qi, base) : Infinity;
  }, 0);
}

/** Kullback-Leibler divergence D(p || q). */
export function klDivergence(p: Distribution, q: Distribution, base = 2): number {
  return p.reduce((sum, pi, i) => {
    if (pi === 0) return sum;
    const qi = q[i] ?? 0;
    return qi > 0 ? sum + pi * log(pi / qi, base) : Infinity;
  }, 0);
}

/** Jensen-Shannon divergence, the average KL to the midpoint mixture. */
export function jsDivergence(p: Distribution, q: Distribution, base = 2): number {
  const m = p.map((pi, i) => (pi + (q[i] ?? 0)) / 2);
  return (klDivergence(p, m, base) + klDivergence(q, m, base)) / 2;
}

export type FDivergence = 'kl' | 'kl-inversa' | 'variacion-total' | 'hellinger' | 'chi-cuadrada';

/** Generator f of each f-divergence D_f(p || q) = sum q f(p / q). */
export const F_GENERATORS: Readonly<Record<FDivergence, (t: number) => number>> = {
  kl: (t) => (t > 0 ? t * Math.log(t) : 0),
  'kl-inversa': (t) => -Math.log(t),
  'variacion-total': (t) => Math.abs(t - 1) / 2,
  hellinger: (t) => (Math.sqrt(t) - 1) ** 2,
  'chi-cuadrada': (t) => (t - 1) ** 2,
};

/**
 * Limit of f(t) / t as t grows: the cost per unit of p-mass placed where q has none.
 * It is finite for total variation, Hellinger and reverse KL, so those stay finite
 * on mismatched supports.
 */
const F_SLOPE_AT_INFINITY: Readonly<Record<FDivergence, number>> = {
  kl: Infinity,
  'kl-inversa': 0,
  'variacion-total': 0.5,
  hellinger: 1,
  'chi-cuadrada': Infinity,
};

/** f-divergence with natural logarithms, as usual for this family. */
export function fDivergence(p: Distribution, q: Distribution, kind: FDivergence): number {
  const f = F_GENERATORS[kind];
  return p.reduce((sum, pi, i) => {
    const qi = q[i] ?? 0;
    if (qi === 0) return pi === 0 ? sum : sum + pi * F_SLOPE_AT_INFINITY[kind];
    return sum + qi * f(pi / qi);
  }, 0);
}

/* ------------------------------------------------------------------ */
/* Joint distributions                                                 */
/* ------------------------------------------------------------------ */

export type Joint = readonly (readonly number[])[];

export function marginals(joint: Joint): { px: number[]; py: number[] } {
  const px = joint.map((row) => row.reduce((a, b) => a + b, 0));
  const py = (joint[0] ?? []).map((_, j) => joint.reduce((a, row) => a + (row[j] ?? 0), 0));
  return { px, py };
}

export interface JointInformation {
  hx: number;
  hy: number;
  hxy: number;
  hxGivenY: number;
  hyGivenX: number;
  mutual: number;
}

/** Differences of entropies below this size are rounding noise. */
const ROUNDING_FLOOR = 1e-12;

/** Entropies of a joint table of probabilities p(x, y), rows indexed by x. */
export function jointInformation(joint: Joint, base = 2): JointInformation {
  const { px, py } = marginals(joint);
  const hx = entropy(px, base);
  const hy = entropy(py, base);
  const hxy = entropy(joint.flat(), base);
  // Rounding leaves residues near 1e-16 for independent tables; mutual information is never negative.
  const raw = hx + hy - hxy;
  const mutual = raw < ROUNDING_FLOOR ? 0 : raw;
  return { hx, hy, hxy, hxGivenY: hx - mutual, hyGivenX: hy - mutual, mutual };
}

/** Binary symmetric channel: flips its input with probability e. */
export function binaryChannel(e: number): [[number, number], [number, number]] {
  return [
    [1 - e, e],
    [e, 1 - e],
  ];
}

/** Joint table of the input distribution p and the output of a channel W (rows: input). */
export function throughChannel(p: Distribution, W: Joint): number[][] {
  return p.map((pi, i) => (W[i] ?? []).map((w) => pi * w));
}

/** Composition of two channels, the channel X -> Z of a chain X -> Y -> Z. */
export function composeChannels(W1: Joint, W2: Joint): number[][] {
  return W1.map((row) =>
    (W2[0] ?? []).map((_, k) => row.reduce((s, w, j) => s + w * (W2[j]?.[k] ?? 0), 0)),
  );
}

/* ------------------------------------------------------------------ */
/* Codes                                                               */
/* ------------------------------------------------------------------ */

export interface HuffmanMerge {
  /** Indices of the two groups merged, into the list of active groups before the merge. */
  left: number[];
  right: number[];
  weight: number;
}

/**
 * Huffman code for the given probabilities. Returns the codewords in the
 * original order and the sequence of merges, so a view can replay the tree.
 * Ties are broken by the order of appearance to make the result stable.
 */
export function huffman(p: Distribution): { codes: string[]; merges: HuffmanMerge[] } {
  const codes = p.map(() => '');
  if (p.length === 1) return { codes: ['0'], merges: [] };
  let groups = p.map((w, i) => ({ symbols: [i], weight: w, order: i }));
  const merges: HuffmanMerge[] = [];
  let order = p.length;
  while (groups.length > 1) {
    groups = [...groups].sort((a, b) => a.weight - b.weight || a.order - b.order);
    const [a, b, ...rest] = groups;
    if (!a || !b) break;
    for (const s of a.symbols) codes[s] = `0${codes[s] ?? ''}`;
    for (const s of b.symbols) codes[s] = `1${codes[s] ?? ''}`;
    merges.push({ left: a.symbols, right: b.symbols, weight: a.weight + b.weight });
    groups = [
      ...rest,
      { symbols: [...a.symbols, ...b.symbols], weight: a.weight + b.weight, order },
    ];
    order += 1;
  }
  return { codes, merges };
}

/** Expected codeword length sum p_i l_i. */
export function averageLength(p: Distribution, codes: readonly string[]): number {
  return p.reduce((sum, pi, i) => sum + pi * (codes[i]?.length ?? 0), 0);
}

/** Distribution of blocks of n independent symbols, in lexicographic order. */
export function blockDistribution(p: Distribution, n: number): number[] {
  let blocks = [1];
  for (let k = 0; k < n; k += 1) blocks = blocks.flatMap((b) => p.map((pi) => b * pi));
  return blocks;
}

/** Kraft sum of the lengths of a prefix code; at most 1. */
export function kraftSum(codes: readonly string[]): number {
  return codes.reduce((sum, c) => sum + 2 ** -c.length, 0);
}

/* ------------------------------------------------------------------ */
/* Maximum entropy                                                     */
/* ------------------------------------------------------------------ */

/**
 * Maximum entropy distribution on the given values with a fixed mean: the
 * Gibbs form p_i proportional to exp(lambda x_i), with lambda found by bisection.
 */
export function maxEntropyWithMean(
  values: readonly number[],
  mean: number,
): { p: number[]; lambda: number } {
  const at = (lambda: number) => {
    const m = Math.max(...values.map((x) => lambda * x));
    const w = values.map((x) => Math.exp(lambda * x - m));
    const total = w.reduce((a, b) => a + b, 0);
    const p = w.map((wi) => wi / total);
    return { p, mean: p.reduce((s, pi, i) => s + pi * (values[i] ?? 0), 0) };
  };
  let lo = -50;
  let hi = 50;
  for (let k = 0; k < 200; k += 1) {
    const mid = (lo + hi) / 2;
    if (at(mid).mean < mean) lo = mid;
    else hi = mid;
  }
  const lambda = (lo + hi) / 2;
  return { p: at(lambda).p, lambda };
}

/* ------------------------------------------------------------------ */
/* Continuous families                                                 */
/* ------------------------------------------------------------------ */

/** Differential entropies in bits. */
export const DIFFERENTIAL_ENTROPY = {
  uniforme: (width: number) => Math.log2(width),
  normal: (sigma: number) => 0.5 * Math.log2(2 * Math.PI * Math.E * sigma * sigma),
  exponencial: (rate: number) => Math.log2(Math.E / rate),
} as const;

/** One-dimensional Wasserstein-1 distance between two histograms on the same equally spaced bins. */
export function wasserstein1(p: Distribution, q: Distribution, binWidth = 1): number {
  let cumulative = 0;
  let total = 0;
  for (let i = 0; i < p.length; i += 1) {
    cumulative += (p[i] ?? 0) - (q[i] ?? 0);
    total += Math.abs(cumulative) * binWidth;
  }
  return total;
}

/**
 * Monotone transport plan between two histograms on the same bins: mass is
 * moved in order, filling the target from left to right.
 */
export function transportPlan(
  p: Distribution,
  q: Distribution,
): { from: number; to: number; mass: number }[] {
  const supply = [...p];
  const demand = [...q];
  const plan: { from: number; to: number; mass: number }[] = [];
  let i = 0;
  let j = 0;
  while (i < supply.length && j < demand.length) {
    const mass = Math.min(supply[i] ?? 0, demand[j] ?? 0);
    if (mass > 1e-12) plan.push({ from: i, to: j, mass });
    supply[i] = (supply[i] ?? 0) - mass;
    demand[j] = (demand[j] ?? 0) - mass;
    if ((supply[i] ?? 0) <= 1e-12) i += 1;
    if ((demand[j] ?? 0) <= 1e-12) j += 1;
  }
  return plan;
}

/** Perplexity 2^H of a model on observed outcomes, from the probabilities the model gave them. */
export function perplexity(probabilities: readonly number[]): number {
  const mean = probabilities.reduce((s, p) => s - Math.log2(p), 0) / probabilities.length;
  return 2 ** mean;
}
