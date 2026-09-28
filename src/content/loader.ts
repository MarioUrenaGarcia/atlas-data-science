import graphUrl from '../generated/graph.json?url';
import mapLayoutUrl from '../generated/map-layout.json?url';
import modulesUrl from '../generated/modules.json?url';
import notationUrl from '../generated/notation.json?url';
import routesUrl from '../generated/routes.json?url';
import searchUrl from '../generated/search-index.json?url';
import { buildGraph, type PrerequisiteGraph } from '../lib/graph/index.ts';
import type {
  ConceptContent,
  ConceptNode,
  GraphData,
  MapLayoutData,
  ModuleContentFile,
  ModuleInfo,
  ModulesData,
  NotationData,
  RoutesData,
  SearchData,
  SubmoduleInfo,
} from './types.ts';

/*
 * Generated content is fetched as static JSON assets instead of being bundled
 * as JavaScript: the browser parses JSON much faster than an equivalent
 * object literal, and every file is loaded only by the pages that need it.
 */

const moduleContentUrls = import.meta.glob<string>('../generated/modules/module-*.json', {
  query: '?url',
  import: 'default',
  eager: true,
});

type Entry<T> =
  | { status: 'pending'; promise: Promise<void> }
  | { status: 'done'; value: T }
  | { status: 'error'; error: unknown };

const cache = new Map<string, Entry<unknown>>();

function load<T>(key: string, loader: () => Promise<T>): Entry<T> {
  const existing = cache.get(key) as Entry<T> | undefined;
  if (existing) return existing;
  const entry: Entry<T> = {
    status: 'pending',
    promise: loader().then(
      (value) => {
        cache.set(key, { status: 'done', value });
      },
      (error: unknown) => {
        cache.set(key, { status: 'error', error });
      },
    ),
  };
  cache.set(key, entry);
  return entry;
}

/**
 * Suspense-style read: returns the value when ready, throws the pending
 * promise so the nearest Suspense boundary shows a fallback, and throws the
 * error for the nearest error boundary otherwise.
 */
function read<T>(key: string, loader: () => Promise<T>): T {
  const entry = load(key, loader);
  if (entry.status === 'done') return entry.value;
  if (entry.status === 'pending') throw entry.promise;
  throw entry.error;
}

/** Forgets failed entries so that a retry fetches them again. */
export function clearFailedResources(): void {
  for (const [key, entry] of cache) {
    if (entry.status === 'error') cache.delete(key);
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} al cargar ${url}`);
  return (await response.json()) as T;
}

export interface AtlasData {
  nodes: ConceptNode[];
  byId: Map<string, ConceptNode>;
  graph: PrerequisiteGraph;
  modules: ModuleInfo[];
  moduleByNumber: Map<number, ModuleInfo>;
  submoduleByKey: Map<string, SubmoduleInfo>;
  /** Position of each concept in syllabus order, used as a stable tie breaker. */
  position: Map<string, number>;
  compare: (a: string, b: string) => number;
}

async function loadAtlas(): Promise<AtlasData> {
  const [graphData, modulesData] = await Promise.all([
    fetchJson<GraphData>(graphUrl),
    fetchJson<ModulesData>(modulesUrl),
  ]);
  const nodes = graphData.nodes;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const graph = buildGraph(
    nodes.map((node) => ({ id: node.id, prerequisites: node.prerrequisitos })),
  );
  const position = new Map(nodes.map((node, index) => [node.id, index]));
  const submoduleByKey = new Map<string, SubmoduleInfo>();
  for (const module of modulesData.modules) {
    for (const submodule of module.submodulos) submoduleByKey.set(submodule.clave, submodule);
  }
  return {
    nodes,
    byId,
    graph,
    modules: modulesData.modules,
    moduleByNumber: new Map(modulesData.modules.map((module) => [module.numero, module])),
    submoduleByKey,
    position,
    compare: (a, b) => (position.get(a) ?? 0) - (position.get(b) ?? 0),
  };
}

export function useAtlas(): AtlasData {
  return read('atlas', loadAtlas);
}

export function preloadAtlas(): void {
  load('atlas', loadAtlas);
}

export function useModuleContent(moduleNumber: number): Record<string, ConceptContent> {
  return read(`module-${moduleNumber}`, async () => {
    const url = moduleContentUrls[`../generated/modules/module-${moduleNumber}.json`];
    if (!url) return {};
    const file = await fetchJson<ModuleContentFile>(url);
    return file.concepts;
  });
}

export function useRoutesData(): RoutesData {
  return read('routes', () => fetchJson<RoutesData>(routesUrl));
}

export function useMapLayout(): MapLayoutData {
  return read('map-layout', () => fetchJson<MapLayoutData>(mapLayoutUrl));
}

export function useNotation(): NotationData {
  return read('notation', () => fetchJson<NotationData>(notationUrl));
}

export function loadSearchData(): Promise<SearchData> {
  const entry = load('search', () => fetchJson<SearchData>(searchUrl));
  if (entry.status === 'done') return Promise.resolve(entry.value);
  if (entry.status === 'error')
    return Promise.reject(
      entry.error instanceof Error ? entry.error : new Error(String(entry.error)),
    );
  return entry.promise.then(() => loadSearchData());
}
