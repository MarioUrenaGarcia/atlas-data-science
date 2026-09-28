import type { AtlasData } from '../../content/loader.ts';
import { roadmapSet, topologicalOrder } from '../../lib/graph/index.ts';

export interface RoadmapOptions {
  from?: string;
  known?: Iterable<string>;
}

/** Ordered list of concepts to study to reach `target`, ending with the target itself. */
export function computeRoadmap(
  atlas: AtlasData,
  target: string,
  options: RoadmapOptions = {},
): string[] {
  if (!atlas.byId.has(target)) return [];
  const from = options.from && atlas.byId.has(options.from) ? options.from : undefined;
  const set = roadmapSet(atlas.graph, target, { from, known: options.known });
  return topologicalOrder(atlas.graph, set, atlas.compare);
}
