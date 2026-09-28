import MiniSearch from 'minisearch';
import { loadSearchData, type AtlasData } from '../../content/loader.ts';
import type { ConceptNode } from '../../content/types.ts';
import { editDistance, normalizeText } from '../../lib/format/text.ts';
import { INDEX_OPTIONS, type SearchDocument } from '../../lib/search/config.ts';
import { expandQuery } from '../../lib/search/synonyms.ts';

export interface SearchEngine {
  index: MiniSearch<SearchDocument>;
  synonyms: string[][];
}

export interface SearchHit {
  node: ConceptNode;
  score: number;
}

let enginePromise: Promise<SearchEngine> | null = null;

export function loadSearchEngine(): Promise<SearchEngine> {
  enginePromise ??= loadSearchData()
    .then((data) => ({
      index: MiniSearch.loadJSON<SearchDocument>(JSON.stringify(data.index), INDEX_OPTIONS),
      synonyms: data.synonyms,
    }))
    .catch((error: unknown) => {
      enginePromise = null;
      throw error;
    });
  return enginePromise;
}

/**
 * Searches every synonym variant of the query and keeps the best score per
 * concept. When requiring all terms finds nothing, it retries accepting any
 * term so that long or partially wrong queries still return something useful.
 */
export function runSearch(engine: SearchEngine, atlas: AtlasData, query: string): SearchHit[] {
  const variants = expandQuery(query, engine.synonyms);
  if (variants.length === 0) return [];
  const collect = (combineWith: 'AND' | 'OR') => {
    const scores = new Map<string, number>();
    for (const variant of variants) {
      for (const result of engine.index.search(variant, { combineWith })) {
        const id = String(result.id);
        scores.set(id, Math.max(scores.get(id) ?? 0, result.score));
      }
    }
    return scores;
  };
  let scores = collect('AND');
  if (scores.size === 0) scores = collect('OR');
  const hits: SearchHit[] = [];
  for (const [id, score] of scores) {
    const node = atlas.byId.get(id);
    if (node) hits.push({ node, score });
  }
  return hits.sort((a, b) => b.score - a.score || atlas.compare(a.node.id, b.node.id));
}

/** Concepts whose title or alias is closest to the query by edit distance. */
export function suggestConcepts(atlas: AtlasData, query: string, limit = 5): ConceptNode[] {
  const normalized = normalizeText(query).trim();
  if (normalized.length < 2) return [];
  const threshold = Math.max(2, Math.round(normalized.length * 0.45));
  const scored: { node: ConceptNode; distance: number }[] = [];
  for (const node of atlas.nodes) {
    const names = [node.titulo, node.titulo_en, ...node.alias].map((name) => normalizeText(name));
    let best = Number.POSITIVE_INFINITY;
    for (const name of names) {
      best = Math.min(best, editDistance(normalized, name));
      // Also compare against same-length prefixes so short queries match long titles.
      best = Math.min(best, editDistance(normalized, name.slice(0, normalized.length)) + 1);
    }
    if (best <= threshold) scored.push({ node, distance: best });
  }
  return scored
    .sort((a, b) => a.distance - b.distance || atlas.compare(a.node.id, b.node.id))
    .slice(0, limit)
    .map((entry) => entry.node);
}
