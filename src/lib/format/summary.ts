/**
 * Summaries are plain text so they stay searchable and usable in page
 * metadata, but they may write powers and indices the way a keyboard allows:
 * x^n, e^(-t^2), P^{-1}, a_n, [x]_B. This parser turns those into a tree of
 * superscript and subscript pieces for display.
 */
export type SummaryPiece =
  | { kind: 'text'; value: string }
  | { kind: 'sup' | 'sub'; children: SummaryPiece[] };

const TOKEN = /^(?:[A-Za-z0-9]+|[+*-])/;
const CLOSING: Record<string, string> = { '(': ')', '{': '}' };

/** Index of the bracket that closes the one at `start`, or -1 when unbalanced. */
function matchingBracket(text: string, start: number): number {
  const open = text[start] ?? '';
  const close = CLOSING[open];
  if (!close) return -1;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === open) depth += 1;
    else if (text[i] === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export function parseSummary(text: string): SummaryPiece[] {
  const pieces: SummaryPiece[] = [];
  let buffer = '';
  const flush = () => {
    if (buffer) pieces.push({ kind: 'text', value: buffer });
    buffer = '';
  };
  let i = 0;
  while (i < text.length) {
    const char = text[i] ?? '';
    const previous = text[i - 1] ?? ' ';
    if ((char === '^' || char === '_') && previous !== ' ' && i + 1 < text.length) {
      const kind = char === '^' ? 'sup' : 'sub';
      const next = text[i + 1] ?? '';
      if (next === '(' || next === '{') {
        const end = matchingBracket(text, i + 1);
        if (end > 0) {
          flush();
          // Brackets only group: once raised, e^(-t^2) reads as e with -t² above it.
          pieces.push({ kind, children: parseSummary(text.slice(i + 2, end)) });
          i = end + 1;
          continue;
        }
      }
      const token = TOKEN.exec(text.slice(i + 1));
      if (token) {
        flush();
        pieces.push({ kind, children: [{ kind: 'text', value: token[0] }] });
        i += 1 + token[0].length;
        continue;
      }
    }
    buffer += char;
    i += 1;
  }
  flush();
  return pieces;
}
