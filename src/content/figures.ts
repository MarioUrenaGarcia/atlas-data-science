/** A piece of a section: plain HTML, or the place where an embedded figure goes. */
export type SectionSegment =
  { type: 'html'; html: string } | { type: 'figure'; index: number; captionHtml: string };

const FIGURE = /<figure class="concept-figure" data-figura="(\d+)">([\s\S]*?)<\/figure>/g;
const CAPTION = /^\s*<figcaption>([\s\S]*)<\/figcaption>\s*$/;

/**
 * Splits the HTML of a section around the figure placeholders written by the
 * content pipeline. Placeholders are always top-level blocks, so cutting the
 * string at them never breaks an element apart.
 */
export function splitFigures(html: string): SectionSegment[] {
  const segments: SectionSegment[] = [];
  let last = 0;
  for (const match of html.matchAll(FIGURE)) {
    const [whole, index = '0', inner = ''] = match;
    const before = html.slice(last, match.index).trim();
    if (before) segments.push({ type: 'html', html: before });
    segments.push({
      type: 'figure',
      index: Number(index),
      captionHtml: CAPTION.exec(inner)?.[1] ?? '',
    });
    last = match.index + whole.length;
  }
  const rest = html.slice(last).trim();
  if (rest) segments.push({ type: 'html', html: rest });
  return segments;
}
