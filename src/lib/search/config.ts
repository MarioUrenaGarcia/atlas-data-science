import type { Options, SearchOptions } from 'minisearch';
import { normalizeText } from '../format/text.ts';

export interface SearchDocument {
  id: string;
  titulo: string;
  alias: string;
  titulo_en: string;
  etiquetas: string;
  resumen: string;
  texto: string;
}

export const SEARCH_FIELDS = [
  'titulo',
  'alias',
  'titulo_en',
  'etiquetas',
  'resumen',
  'texto',
] as const;

export const SEARCH_BOOSTS: Record<(typeof SEARCH_FIELDS)[number], number> = {
  titulo: 5,
  alias: 4,
  titulo_en: 4,
  etiquetas: 3,
  resumen: 2,
  texto: 1,
};

/** Very frequent Spanish function words that add noise without narrowing results. */
const STOP_WORDS = new Set([
  'de',
  'del',
  'la',
  'las',
  'el',
  'los',
  'y',
  'o',
  'en',
  'a',
  'al',
  'un',
  'una',
  'por',
  'para',
  'con',
  'que',
  'se',
  'su',
  'sus',
  'es',
  'lo',
  'como',
  'the',
  'of',
  'and',
]);

export function processTerm(term: string): string | null {
  const normalized = normalizeText(term);
  if (normalized.length === 0 || STOP_WORDS.has(normalized)) return null;
  return normalized;
}

export const SEARCH_OPTIONS: SearchOptions = {
  boost: SEARCH_BOOSTS,
  prefix: true,
  fuzzy: 0.2,
  combineWith: 'AND',
};

export const INDEX_OPTIONS: Options<SearchDocument> = {
  idField: 'id',
  fields: [...SEARCH_FIELDS],
  storeFields: [],
  processTerm,
  searchOptions: SEARCH_OPTIONS,
};
