import { describe, expect, it } from 'vitest';
import {
  conceptIdFromName,
  countWords,
  editDistance,
  normalizeText,
  slugify,
} from '../../../src/lib/format/text.ts';

describe('normalizeText', () => {
  it('removes accents, diacritics and case', () => {
    expect(normalizeText('Distribución de POISSON')).toBe('distribucion de poisson');
    expect(normalizeText('Añoranza Šidák Erdős')).toBe('anoranza sidak erdos');
  });
});

describe('slugify and conceptIdFromName', () => {
  it('builds kebab-case identifiers', () => {
    expect(slugify('Teorema de Bayes')).toBe('teorema-de-bayes');
    expect(slugify("Regla de L'Hôpital")).toBe('regla-de-lhopital');
  });

  it('drops clarifying parentheticals but keeps glued ones', () => {
    expect(conceptIdFromName('Normas vectoriales (L1, L2, Linf, Lp)')).toBe('normas-vectoriales');
    expect(conceptIdFromName('Función de masa de probabilidad (PMF)')).toBe(
      'funcion-de-masa-de-probabilidad',
    );
    expect(conceptIdFromName('Modelo autorregresivo AR(p)')).toBe('modelo-autorregresivo-ar-p');
    expect(conceptIdFromName('Diferencias temporales TD(0)')).toBe('diferencias-temporales-td-0');
  });

  it('keeps names that differ only by a trailing ++ distinct', () => {
    expect(conceptIdFromName('K-means++')).toBe('k-means-plus-plus');
    expect(conceptIdFromName('K-means')).toBe('k-means');
  });

  it('handles numbers and slashes', () => {
    expect(conceptIdFromName('Regla empírica 68-95-99.7')).toBe('regla-empirica-68-95-99-7');
    expect(conceptIdFromName('Cola M/M/1')).toBe('cola-m-m-1');
  });
});

describe('countWords', () => {
  it('ignores punctuation-only tokens', () => {
    expect(countWords('Una prueba , con - signos y 3 números.')).toBe(7);
  });
});

describe('editDistance', () => {
  it('matches the classic examples', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('poison', 'poisson')).toBe(1);
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('igual', 'igual')).toBe(0);
  });
});
