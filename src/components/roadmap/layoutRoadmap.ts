import dagre from '@dagrejs/dagre';
import type { AtlasData } from '../../content/loader.ts';

export interface LaidOutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lines: string[];
  modulo: number;
}

export interface LaidOutCluster {
  modulo: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LaidOutEdge {
  from: string;
  to: string;
  points: { x: number; y: number }[];
}

export interface RoadmapLayout {
  nodes: LaidOutNode[];
  clusters: LaidOutCluster[];
  edges: LaidOutEdge[];
  width: number;
  height: number;
}

const NODE_WIDTH = 188;
const LINE_HEIGHT = 17;
const NODE_PADDING_Y = 14;
const MAX_CHARS_PER_LINE = 24;
const MAX_LINES = 3;

/** Greedy word wrap; the last line is truncated with an ellipsis when the title is too long. */
export function wrapTitle(
  title: string,
  maxChars = MAX_CHARS_PER_LINE,
  maxLines = MAX_LINES,
): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || current === '') {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1] ?? '';
  kept[maxLines - 1] = `${last.slice(0, maxChars - 3).trimEnd()}...`;
  return kept;
}

export function layoutRoadmap(
  atlas: AtlasData,
  ids: string[],
  direction: 'LR' | 'TB',
): RoadmapLayout {
  const graph = new dagre.graphlib.Graph({ compound: true, multigraph: false });
  graph.setGraph({
    rankdir: direction,
    nodesep: 16,
    ranksep: direction === 'LR' ? 56 : 40,
    marginx: 16,
    marginy: 16,
  });
  graph.setDefaultEdgeLabel(() => ({}));

  const members = new Set(ids);
  const modules = new Set<number>();
  const lines = new Map<string, string[]>();
  for (const id of ids) {
    const node = atlas.byId.get(id);
    if (!node) continue;
    const wrapped = wrapTitle(node.titulo);
    lines.set(id, wrapped);
    modules.add(node.modulo);
    graph.setNode(id, {
      width: NODE_WIDTH,
      height: wrapped.length * LINE_HEIGHT + NODE_PADDING_Y * 2,
    });
  }
  // Clusters group the concepts of each module when the roadmap spans several modules.
  const clustered = modules.size > 1;
  if (clustered) {
    for (const modulo of modules) graph.setNode(`modulo-${modulo}`, {});
    for (const id of ids) {
      const node = atlas.byId.get(id);
      if (node) graph.setParent(id, `modulo-${node.modulo}`);
    }
  }
  for (const id of ids) {
    for (const prerequisite of atlas.graph.prerequisites.get(id) ?? []) {
      if (members.has(prerequisite)) graph.setEdge(prerequisite, id);
    }
  }

  dagre.layout(graph);

  const nodes: LaidOutNode[] = [];
  for (const id of ids) {
    const layout = graph.node(id);
    const node = atlas.byId.get(id);
    if (!layout || !node) continue;
    nodes.push({
      id,
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      lines: lines.get(id) ?? [node.titulo],
      modulo: node.modulo,
    });
  }

  const clusters: LaidOutCluster[] = clustered
    ? [...modules].map((modulo) => {
        const layout = graph.node(`modulo-${modulo}`);
        return {
          modulo,
          label: atlas.moduleByNumber.get(modulo)?.titulo ?? '',
          x: layout?.x ?? 0,
          y: layout?.y ?? 0,
          width: layout?.width ?? 0,
          height: layout?.height ?? 0,
        };
      })
    : [];

  const edges: LaidOutEdge[] = graph.edges().map((edge) => ({
    from: edge.v,
    to: edge.w,
    points: graph.edge(edge)?.points ?? [],
  }));

  const info = graph.graph();
  return { nodes, clusters, edges, width: info.width ?? 0, height: info.height ?? 0 };
}
