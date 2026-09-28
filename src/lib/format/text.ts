/**
 * Lowercases and strips diacritics so that "Distribución", "distribucion" and
 * "DISTRIBUCIÓN" compare equal. The eñe is folded to "n" as well, which keeps
 * searches working on keyboards without that key.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase();
}

/** Converts free text into a kebab-case identifier without accents. */
export function slugify(text: string): string {
  return normalizeText(text)
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Derives a concept identifier from its syllabus name. Parenthetical groups that
 * follow a space only clarify scope ("Normas vectoriales (L1, L2)"), so they are
 * dropped; parentheses glued to a word are part of the name ("AR(p)", "TD(0)").
 */
export function conceptIdFromName(name: string): string {
  const withoutClarifications = name.replace(/\s+\([^)]*\)/g, '');
  // The trailing ++ in names such as K-means++ distinguishes them from the base method.
  return slugify(withoutClarifications.replace(/\+\+/g, ' plus plus'));
}

/** Counts words in plain text, ignoring punctuation-only tokens. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Classic Levenshtein distance, used to suggest close matches when a search finds nothing. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      const insertion = (current[j - 1] ?? 0) + 1;
      const deletion = (previous[j] ?? 0) + 1;
      current.push(Math.min(substitution, insertion, deletion));
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}
