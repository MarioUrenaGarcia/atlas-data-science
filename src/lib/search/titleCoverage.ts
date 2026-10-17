import { processTerm } from './config.ts';

/**
 * BM25 rewards documents that repeat a term in many fields, so variants of a
 * concept ("Distribución de Poisson inflada en ceros") outrank the concept the
 * query names ("Distribución de Poisson"). The ranking is corrected with the
 * share of the title that the matched terms cover. Each title word weighs by
 * its rarity among all titles, so a word shared by dozens of titles, such as
 * "distribución", barely counts and the distinctive word decides.
 */

export type TitleWeights = ReadonlyMap<string, number>;

/** Weight of the title coverage relative to the BM25 score: 1 + weight at full coverage. */
export const TITLE_COVERAGE_WEIGHT = 3;

export function titleTerms(title: string): string[] {
  return title
    .split(/[^\p{L}\p{N}]+/u)
    .map((word) => processTerm(word))
    .filter((term): term is string => term !== null);
}

/** Inverse document frequency of each title term over the given titles. */
export function titleWeights(titles: readonly string[]): TitleWeights {
  const frequency = new Map<string, number>();
  for (const title of titles) {
    for (const term of new Set(titleTerms(title))) {
      frequency.set(term, (frequency.get(term) ?? 0) + 1);
    }
  }
  const weights = new Map<string, number>();
  for (const [term, count] of frequency) {
    weights.set(term, Math.log(1 + titles.length / count));
  }
  return weights;
}

/** Share between 0 and 1 of the weighted title terms that the search matched. */
export function titleCoverage(
  title: string,
  matchedTerms: readonly string[],
  weights: TitleWeights,
): number {
  const terms = titleTerms(title);
  if (terms.length === 0) return 0;
  const matched = new Set(matchedTerms);
  let total = 0;
  let covered = 0;
  for (const term of terms) {
    const weight = weights.get(term) ?? 1;
    total += weight;
    if (matched.has(term)) covered += weight;
  }
  return total > 0 ? covered / total : 0;
}

export function rankScore(score: number, coverage: number): number {
  return score * (1 + TITLE_COVERAGE_WEIGHT * coverage);
}
