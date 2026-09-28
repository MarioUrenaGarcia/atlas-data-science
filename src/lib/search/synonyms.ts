import { normalizeText } from '../format/text.ts';

function tokens(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0);
}

function indexOfSequence(haystack: readonly string[], needle: readonly string[]): number {
  for (let start = 0; start + needle.length <= haystack.length; start += 1) {
    if (needle.every((token, offset) => haystack[start + offset] === token)) return start;
  }
  return -1;
}

/**
 * Returns the normalized query plus every variant obtained by replacing a
 * member of a synonym group with the other members of that group. Matching is
 * done on whole normalized words, so "TCL" and "tcl" behave the same and "map"
 * does not match inside "mapa".
 */
export function expandQuery(query: string, groups: readonly (readonly string[])[]): string[] {
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) return [];
  const variants = new Set([queryTokens.join(' ')]);
  for (const group of groups) {
    const members = group.map(tokens).filter((member) => member.length > 0);
    for (const member of members) {
      const position = indexOfSequence(queryTokens, member);
      if (position < 0) continue;
      for (const alternative of members) {
        if (alternative === member) continue;
        const replaced = [
          ...queryTokens.slice(0, position),
          ...alternative,
          ...queryTokens.slice(position + member.length),
        ];
        variants.add(replaced.join(' '));
      }
    }
  }
  return [...variants];
}
