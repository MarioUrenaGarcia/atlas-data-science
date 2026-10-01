/**
 * Conditional probability over a finite partition: the law of total
 * probability and Bayes' theorem, written for arrays of prior probabilities
 * P(A_i) and likelihoods P(B | A_i).
 */

/** Divides by the total so the values add up to one; all zeros stay zeros. */
export function normalize(values: readonly number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total > 0 ? values.map((value) => value / total) : values.map(() => 0);
}

/** Joint probabilities P(A_i and B) = P(A_i) P(B | A_i). */
export function jointProbabilities(
  priors: readonly number[],
  likelihoods: readonly number[],
): number[] {
  return priors.map((prior, index) => prior * (likelihoods[index] ?? 0));
}

/** P(B) = sum over i of P(A_i) P(B | A_i). */
export function totalProbability(
  priors: readonly number[],
  likelihoods: readonly number[],
): number {
  return jointProbabilities(priors, likelihoods).reduce((sum, value) => sum + value, 0);
}

/** P(A_i | B) for every i; all zeros when P(B) = 0, where the posterior is undefined. */
export function posterior(priors: readonly number[], likelihoods: readonly number[]): number[] {
  return normalize(jointProbabilities(priors, likelihoods));
}

/** Posterior after several independent observations, applying Bayes' theorem once per observation. */
export function sequentialPosterior(
  priors: readonly number[],
  likelihoodSequence: readonly (readonly number[])[],
): number[][] {
  const history = [normalize(priors)];
  for (const likelihoods of likelihoodSequence) {
    const last = history.at(-1) ?? [];
    history.push(posterior(last, likelihoods));
  }
  return history;
}

export interface DiagnosticCounts {
  truePositives: number;
  falseNegatives: number;
  falsePositives: number;
  trueNegatives: number;
}

/** Expected counts of a diagnostic test in a population, as natural frequencies. */
export function diagnosticCounts(
  population: number,
  prevalence: number,
  sensitivity: number,
  specificity: number,
): DiagnosticCounts {
  const sick = population * prevalence;
  const healthy = population - sick;
  return {
    truePositives: sick * sensitivity,
    falseNegatives: sick * (1 - sensitivity),
    falsePositives: healthy * (1 - specificity),
    trueNegatives: healthy * specificity,
  };
}

/** Positive and negative predictive values of a test. */
export function predictiveValues(
  prevalence: number,
  sensitivity: number,
  specificity: number,
): { positive: number; negative: number } {
  const c = diagnosticCounts(1, prevalence, sensitivity, specificity);
  const positives = c.truePositives + c.falsePositives;
  const negatives = c.trueNegatives + c.falseNegatives;
  return {
    positive: positives > 0 ? c.truePositives / positives : 0,
    negative: negatives > 0 ? c.trueNegatives / negatives : 0,
  };
}
