import { describe, expect, it } from 'vitest';
import { splitFigures } from '../../../src/content/figures.ts';

describe('splitFigures', () => {
  it('separates html and figure placeholders in order', () => {
    const html =
      '<p>Antes.</p>\n<figure class="concept-figure" data-figura="0"><figcaption>Uno <em>a</em></figcaption></figure>\n<p>Entre.</p><figure class="concept-figure" data-figura="1"></figure>';
    expect(splitFigures(html)).toEqual([
      { type: 'html', html: '<p>Antes.</p>' },
      { type: 'figure', index: 0, captionHtml: 'Uno <em>a</em>' },
      { type: 'html', html: '<p>Entre.</p>' },
      { type: 'figure', index: 1, captionHtml: '' },
    ]);
  });

  it('returns the html untouched when there are no figures', () => {
    expect(splitFigures('<p>Solo texto.</p>')).toEqual([
      { type: 'html', html: '<p>Solo texto.</p>' },
    ]);
  });
});
