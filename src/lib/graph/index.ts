/**
 * Prerequisite graph utilities. Edges point from a prerequisite to the concept
 * that needs it; every function here is pure and works on plain maps so it can
 * run both in the content build and in the browser.
 */

export interface GraphInput {
  id: string;
  prerequisites: readonly string[];
}

export interface PrerequisiteGraph {
  /** Node identifiers in insertion order. */
  ids: string[];
  /** Direct prerequisites of each node. */
  prerequisites: Map<string, string[]>;
  /** Direct dependents of each node (inverse edges). */
  dependents: Map<string, string[]>;
}

export function buildGraph(nodes: readonly GraphInput[]): PrerequisiteGraph {
  const ids = nodes.map((node) => node.id);
  const known = new Set(ids);
  const prerequisites = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();
  for (const id of ids) {
    dependents.set(id, []);
  }
  for (const node of nodes) {
    const valid = node.prerequisites.filter((prerequisite) => known.has(prerequisite));
    prerequisites.set(node.id, valid);
    for (const prerequisite of valid) {
      dependents.get(prerequisite)?.push(node.id);
    }
  }
  return { ids, prerequisites, dependents };
}

function traverse(
  start: string,
  next: (id: string) => readonly string[],
  shouldExpand: (id: string) => boolean = () => true,
): Set<string> {
  const visited = new Set<string>();
  const stack = [...next(start)];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    if (shouldExpand(current)) {
      stack.push(...next(current));
    }
  }
  return visited;
}

/** All concepts reachable by following prerequisites, excluding the start node. */
export function ancestors(graph: PrerequisiteGraph, id: string): Set<string> {
  return traverse(id, (current) => graph.prerequisites.get(current) ?? []);
}

/** All concepts that transitively depend on the given one, excluding it. */
export function descendants(graph: PrerequisiteGraph, id: string): Set<string> {
  return traverse(id, (current) => graph.dependents.get(current) ?? []);
}

/**
 * Returns one cycle as a closed list of ids (first element repeated at the end),
 * or null when the graph is acyclic. Iterative DFS with three colors.
 */
export function findCycle(graph: PrerequisiteGraph): string[] | null {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>(graph.ids.map((id) => [id, WHITE]));
  const parent = new Map<string, string>();

  for (const root of graph.ids) {
    if (color.get(root) !== WHITE) continue;
    const stack: { id: string; index: number }[] = [{ id: root, index: 0 }];
    color.set(root, GRAY);
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      if (!frame) break;
      const children = graph.prerequisites.get(frame.id) ?? [];
      if (frame.index >= children.length) {
        color.set(frame.id, BLACK);
        stack.pop();
        continue;
      }
      const child = children[frame.index] as string;
      frame.index += 1;
      const childColor = color.get(child);
      if (childColor === GRAY) {
        const cycle = [child];
        let cursor = frame.id;
        while (cursor !== child) {
          cycle.push(cursor);
          cursor = parent.get(cursor) as string;
        }
        cycle.push(child);
        return cycle.reverse();
      }
      if (childColor === WHITE) {
        parent.set(child, frame.id);
        color.set(child, GRAY);
        stack.push({ id: child, index: 0 });
      }
    }
  }
  return null;
}

/**
 * Kahn's algorithm restricted to `subset`, always emitting the available node
 * that sorts first under `compare`. This makes the order deterministic and keeps
 * syllabus order whenever the dependencies allow it.
 */
export function topologicalOrder(
  graph: PrerequisiteGraph,
  subset: Iterable<string>,
  compare: (a: string, b: string) => number,
): string[] {
  const members = new Set(subset);
  const pending = new Map<string, number>();
  for (const id of members) {
    const count = (graph.prerequisites.get(id) ?? []).filter((p) => members.has(p)).length;
    pending.set(id, count);
  }
  const available = [...members].filter((id) => pending.get(id) === 0).sort(compare);
  const order: string[] = [];
  while (available.length > 0) {
    const current = available.shift() as string;
    order.push(current);
    let inserted = false;
    for (const dependent of graph.dependents.get(current) ?? []) {
      if (!members.has(dependent)) continue;
      const remaining = (pending.get(dependent) ?? 0) - 1;
      pending.set(dependent, remaining);
      if (remaining === 0) {
        available.push(dependent);
        inserted = true;
      }
    }
    if (inserted) available.sort(compare);
  }
  if (order.length !== members.size) {
    throw new Error('The prerequisite subgraph contains a cycle');
  }
  return order;
}

/** Longest distance from a root (a node with no prerequisites). Roots have depth 0. */
export function depths(graph: PrerequisiteGraph): Map<string, number> {
  const order = topologicalOrder(graph, graph.ids, (a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const result = new Map<string, number>();
  for (const id of order) {
    const parents = graph.prerequisites.get(id) ?? [];
    const depth =
      parents.length === 0 ? 0 : 1 + Math.max(...parents.map((p) => result.get(p) ?? 0));
    result.set(id, depth);
  }
  return result;
}

export interface RoadmapOptions {
  /** Concepts the learner already masters: they and their exclusive ancestors are pruned. */
  known?: Iterable<string>;
  /** A concept the learner already understands; it and all its ancestors count as known. */
  from?: string;
}

/**
 * Set of concepts to study before (and including) `target`. The search walks
 * prerequisites from the target and stops at known concepts, so an ancestor is
 * dropped only when every path to it passes through something already known.
 */
export function roadmapSet(
  graph: PrerequisiteGraph,
  target: string,
  options: RoadmapOptions = {},
): Set<string> {
  const known = new Set(options.known ?? []);
  if (options.from && graph.prerequisites.has(options.from)) {
    known.add(options.from);
    for (const ancestor of ancestors(graph, options.from)) known.add(ancestor);
  }
  known.delete(target);
  const reached = traverse(target, (current) =>
    (graph.prerequisites.get(current) ?? []).filter((p) => !known.has(p)),
  );
  reached.add(target);
  return reached;
}

/**
 * Shortest chain of prerequisite edges leading from `from` to `to`, both
 * included, or null when `to` does not depend on `from`.
 */
export function shortestPrerequisitePath(
  graph: PrerequisiteGraph,
  from: string,
  to: string,
): string[] | null {
  if (from === to) return [from];
  const previous = new Map<string, string>();
  const queue = [from];
  const seen = new Set([from]);
  while (queue.length > 0) {
    const current = queue.shift() as string;
    for (const dependent of graph.dependents.get(current) ?? []) {
      if (seen.has(dependent)) continue;
      seen.add(dependent);
      previous.set(dependent, current);
      if (dependent === to) {
        const path = [to];
        let cursor = to;
        while (cursor !== from) {
          cursor = previous.get(cursor) as string;
          path.push(cursor);
        }
        return path.reverse();
      }
      queue.push(dependent);
    }
  }
  return null;
}

/** Restricts the graph to `subset`, dropping edges that leave it. */
export function inducedSubgraph(
  graph: PrerequisiteGraph,
  subset: Iterable<string>,
): PrerequisiteGraph {
  const members = new Set(subset);
  const nodes = graph.ids
    .filter((id) => members.has(id))
    .map((id) => ({
      id,
      prerequisites: (graph.prerequisites.get(id) ?? []).filter((p) => members.has(p)),
    }));
  return buildGraph(nodes);
}

/**
 * Prerequisites that are already implied by another listed prerequisite
 * (A lists both B and C while B already requires C). Used to keep only
 * immediate prerequisites in the content.
 */
export function redundantPrerequisites(graph: PrerequisiteGraph, id: string): string[] {
  const direct = graph.prerequisites.get(id) ?? [];
  return direct.filter((candidate) =>
    direct.some((other) => other !== candidate && ancestors(graph, other).has(candidate)),
  );
}
