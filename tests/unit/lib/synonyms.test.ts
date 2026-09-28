import { describe, expect, it } from 'vitest';
import { expandQuery } from '../../../src/lib/search/synonyms.ts';

const groups = [
  ['tcl', 'teorema central del límite'],
  ['map', 'máximo a posteriori'],
];

describe('expandQuery', () => {
  it('normalizes the query', () => {
    expect(expandQuery('  Distribución   NORMAL ', [])).toEqual(['distribucion normal']);
  });

  it('expands acronyms in both directions', () => {
    expect(expandQuery('TCL', groups)).toEqual(['tcl', 'teorema central del limite']);
    expect(expandQuery('teorema central del limite', groups)).toContain('tcl');
  });

  it('replaces only whole words', () => {
    expect(expandQuery('mapa del conocimiento', groups)).toEqual(['mapa del conocimiento']);
    expect(expandQuery('estimador map', groups)).toContain('estimador maximo a posteriori');
  });

  it('returns nothing for blank queries', () => {
    expect(expandQuery('   ', groups)).toEqual([]);
  });
});
