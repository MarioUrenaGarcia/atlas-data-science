import { standardNormalCdf, standardNormalQuantile } from '../distributions/special.ts';
import type { Random } from '../random/index.ts';

/** Counts of a binary classifier against the true labels. */
export interface Confusion {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

/** Monetary (or utility) value assigned to each cell of the confusion matrix. */
export interface OutcomeValues {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface ScoredCase {
  score: number;
  positive: boolean;
}

/** Cases with score at or above the threshold are predicted positive. */
export function confusionAt(cases: readonly ScoredCase[], threshold: number): Confusion {
  const counts: Confusion = { tp: 0, fp: 0, tn: 0, fn: 0 };
  for (const item of cases) {
    const predicted = item.score >= threshold;
    if (predicted && item.positive) counts.tp += 1;
    else if (predicted) counts.fp += 1;
    else if (item.positive) counts.fn += 1;
    else counts.tn += 1;
  }
  return counts;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  /** Fraction of cases predicted positive. */
  flagged: number;
}

function ratio(a: number, b: number): number {
  return b === 0 ? Number.NaN : a / b;
}

export function classificationMetrics(c: Confusion): ClassificationMetrics {
  const total = c.tp + c.fp + c.tn + c.fn;
  const precision = ratio(c.tp, c.tp + c.fp);
  const recall = ratio(c.tp, c.tp + c.fn);
  return {
    accuracy: ratio(c.tp + c.tn, total),
    precision,
    recall,
    specificity: ratio(c.tn, c.tn + c.fp),
    f1: ratio(2 * c.tp, 2 * c.tp + c.fp + c.fn),
    flagged: ratio(c.tp + c.fp, total),
  };
}

/** Total value of a decision rule: each cell count times its value. */
export function decisionValue(c: Confusion, values: OutcomeValues): number {
  return c.tp * values.tp + c.fp * values.fp + c.tn * values.tn + c.fn * values.fn;
}

export interface ScoredPopulationSpec {
  n: number;
  prevalence: number;
  /** Distance between the latent score means of positives and negatives, in standard deviations. */
  separation: number;
}

/**
 * Simulated output of a calibrated classifier. Each case has a latent normal
 * signal centered at +separation/2 (positives) or -separation/2 (negatives);
 * its score is the exact posterior probability of being positive,
 * logistic(logit(prevalence) + separation * signal), so a score of 0.3 means
 * that 30 % of the cases with that score are positive.
 */
export function scoredPopulation(spec: ScoredPopulationSpec, random: Random): ScoredCase[] {
  const prior = Math.log(spec.prevalence / (1 - spec.prevalence));
  const cases: ScoredCase[] = [];
  for (let i = 0; i < spec.n; i += 1) {
    const positive = random.next() < spec.prevalence;
    const signal = random.normal(positive ? spec.separation / 2 : -spec.separation / 2, 1);
    cases.push({ score: 1 / (1 + Math.exp(-(prior + spec.separation * signal))), positive });
  }
  return cases;
}

/**
 * Score above which acting has a larger expected value than not acting, for
 * calibrated scores: p v_TP + (1 - p) v_FP > p v_FN + (1 - p) v_TN.
 */
export function breakEvenThreshold(values: OutcomeValues): number {
  const gainIfPositive = values.tp - values.fn;
  const lossIfNegative = values.tn - values.fp;
  return lossIfNegative / (gainIfPositive + lossIfNegative);
}

export interface SweepPoint {
  threshold: number;
  metrics: ClassificationMetrics;
  value: number;
}

export function thresholdSweep(
  cases: readonly ScoredCase[],
  thresholds: readonly number[],
  values: OutcomeValues,
): SweepPoint[] {
  return thresholds.map((threshold) => {
    const c = confusionAt(cases, threshold);
    return { threshold, metrics: classificationMetrics(c), value: decisionValue(c, values) };
  });
}

/** Index of the largest finite entry; ties keep the first one. */
export function argMax(values: readonly number[]): number {
  let best = -1;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i] ?? Number.NaN;
    if (!Number.isFinite(v)) continue;
    if (best < 0 || v > (values[best] ?? Number.NEGATIVE_INFINITY)) best = i;
  }
  return best;
}

function standardNormalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

/**
 * Expected units sold E[min(D, q)] when demand D is normal with mean mu and
 * standard deviation sigma: q minus the expected leftover, sigma (z Phi(z) + phi(z)).
 */
export function expectedSales(q: number, mu: number, sigma: number): number {
  const z = (q - mu) / sigma;
  return q - sigma * (z * standardNormalCdf(z) + standardNormalPdf(z));
}

/** Expected profit of ordering q units that sell at `price` and cost `cost` each. */
export function newsvendorProfit(
  q: number,
  mu: number,
  sigma: number,
  price: number,
  cost: number,
): number {
  return price * expectedSales(q, mu, sigma) - cost * q;
}

/** Profit-maximizing order: the demand quantile at the critical ratio (price - cost) / price. */
export function newsvendorOptimum(mu: number, sigma: number, price: number, cost: number): number {
  return mu + sigma * standardNormalQuantile((price - cost) / price);
}
