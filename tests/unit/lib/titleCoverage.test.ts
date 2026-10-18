import MiniSearch from 'minisearch';
import { describe, expect, it } from 'vitest';
import { INDEX_OPTIONS, type SearchDocument } from '../../../src/lib/search/config.ts';
import {
  rankScore,
  titleCoverage,
  titleTerms,
  titleWeights,
} from '../../../src/lib/search/titleCoverage.ts';

const doc = (id: string, titulo: string, extra: Partial<SearchDocument> = {}): SearchDocument => ({
  id,
  titulo,
  alias: '',
  titulo_en: '',
  etiquetas: '',
  resumen: '',
  texto: '',
  ...extra,
});

// Mirrors the real index: the variants mention "Poisson" in more fields than the
// concept the query names (summary, tags), which made BM25 put them first, and
// "distribución" starts many titles, as it does in the Atlas.
const OTHER_DISTRIBUTIONS = [
  'normal',
  'exponencial',
  'gamma',
  'beta',
  'binomial',
  'geométrica',
  'uniforme continua',
  'de Cauchy',
  'de Weibull',
  'lognormal',
];
const DOCS = [
  doc('poisson', 'Distribución de Poisson', {
    alias: 'ley de Poisson',
    titulo_en: 'Poisson distribution',
    texto: 'Cuenta eventos raros en un intervalo, como en un proceso de Poisson.',
  }),
  doc('poisson-inflada', 'Distribución de Poisson inflada en ceros', {
    alias: 'Poisson inflada en ceros',
    titulo_en: 'Zero-inflated Poisson distribution',
    resumen: 'Mezcla un cero seguro y un conteo de Poisson.',
    texto: 'Modela conteos con más ceros de los que da una Poisson.',
  }),
  doc('aproximacion', 'Aproximación de Poisson a la binomial', {
    alias: 'ley de los eventos raros de Poisson',
    titulo_en: 'Poisson approximation to the binomial',
    etiquetas: 'Poisson',
    resumen: 'La binomial con n grande y p chica se parece a una Poisson.',
    texto: 'Se usa cuando la Poisson simplifica el cálculo.',
  }),
  ...OTHER_DISTRIBUTIONS.map((name, index) => doc(`otra-${index}`, `Distribución ${name}`)),
  doc('bayes', 'Teorema de Bayes'),
  doc('varianza', 'Varianza'),
];

function rank(query: string, corrected: boolean): string[] {
  const index = new MiniSearch<SearchDocument>(INDEX_OPTIONS);
  index.addAll(DOCS);
  const titles = new Map(DOCS.map((d) => [d.id, d.titulo]));
  const weights = titleWeights([...titles.values()]);
  return index
    .search(query)
    .map((result) => {
      const title = titles.get(String(result.id)) ?? '';
      const coverage = corrected ? titleCoverage(title, result.terms, weights) : 0;
      return { id: String(result.id), score: rankScore(result.score, coverage) };
    })
    .sort((a, b) => b.score - a.score)
    .map((hit) => hit.id);
}

describe('title coverage ranking', () => {
  it('puts the concept named by a misspelled query first: "poison" finds "Distribución de Poisson"', () => {
    expect(rank('poison', false)[0]).not.toBe('poisson');
    expect(rank('poison', true)[0]).toBe('poisson');
  });

  it('also works with the exact name and with accents removed', () => {
    expect(rank('poisson', true)[0]).toBe('poisson');
    expect(rank('distribucion de poisson', true)[0]).toBe('poisson');
  });
});

describe('titleCoverage', () => {
  const weights = titleWeights(DOCS.map((d) => d.titulo));

  it('ignores stop words and accents in titles', () => {
    expect(titleTerms('Distribución de Poisson')).toEqual(['distribucion', 'poisson']);
  });

  it('weighs a distinctive word more than a word shared by many titles', () => {
    expect(weights.get('poisson') ?? 0).toBeGreaterThan(weights.get('distribucion') ?? 0);
    expect(titleCoverage('Distribución de Poisson', ['poisson'], weights)).toBeGreaterThan(0.5);
  });

  it('is full when every title term matched and zero when none did', () => {
    expect(titleCoverage('Distribución normal', ['distribucion', 'normal'], weights)).toBe(1);
    expect(titleCoverage('Distribución normal', ['gamma'], weights)).toBe(0);
  });

  it('is smaller for longer titles with unmatched words', () => {
    const short = titleCoverage('Distribución de Poisson', ['poisson'], weights);
    const long = titleCoverage('Distribución de Poisson inflada en ceros', ['poisson'], weights);
    expect(short).toBeGreaterThan(long);
  });
});
