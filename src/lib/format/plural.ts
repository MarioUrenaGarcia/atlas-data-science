const ACCENTED: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

/**
 * Spanish plural of a single noun or of the last word of a short phrase:
 * vowels add "s", consonants add "es" (dropping the written accent of
 * words such as "transacción"), and a final "z" becomes "ces".
 */
export function pluralize(text: string): string {
  const match = /^(.*?)(\S+)$/.exec(text);
  if (!match) return text;
  const [, head = '', word = ''] = match;
  const lower = word.toLowerCase();
  let result: string;
  if (/[aeiouáéó]$/.test(lower)) result = `${word}s`;
  else if (lower.endsWith('z')) result = `${word.slice(0, -1)}ces`;
  else if (
    /s$/.test(lower) &&
    !/[áéíóú]s$/.test(lower) &&
    (lower.match(/[aeiouáéíóú]+/g) ?? []).length > 1
  ) {
    // Unstressed final syllables ending in "s" are invariable: análisis, lunes.
    result = word;
  } else {
    const last = word.slice(-2, -1);
    const plain = ACCENTED[last];
    result = plain ? `${word.slice(0, -2)}${plain}${word.slice(-1)}es` : `${word}es`;
  }
  return head + result;
}
