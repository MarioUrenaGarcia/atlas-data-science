import { describe, expect, it } from 'vitest';
import {
  ancestors,
  buildGraph,
  depths,
  descendants,
  findCycle,
  inducedSubgraph,
  redundantPrerequisites,
  roadmapSet,
  shortestPrerequisitePath,
  topologicalOrder,
} from '../../../src/lib/graph/index.ts';

// a -> b -> d -> e, a -> c -> d, f independent
const graph = buildGraph([
  { id: 'a', prerequisites: [] },
  { id: 'b', prerequisites: ['a'] },
  { id: 'c', prerequisites: ['a'] },
  { id: 'd', prerequisites: ['b', 'c'] },
  { id: 'e', prerequisites: ['d'] },
  { id: 'f', prerequisites: [] },
]);

const alphabetical = (x: string, y: string) => x.localeCompare(y);

describe('ancestors and descendants', () => {
  it('follows edges transitively', () => {
    expect([...ancestors(graph, 'e')].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect([...descendants(graph, 'a')].sort()).toEqual(['b', 'c', 'd', 'e']);
    expect(ancestors(graph, 'f').size).toBe(0);
  });

  it('ignores prerequisites that are not nodes', () => {
    const partial = buildGraph([{ id: 'x', prerequisites: ['missing'] }]);
    expect(partial.prerequisites.get('x')).toEqual([]);
  });
});

describe('findCycle', () => {
  it('returns null for a DAG', () => {
    expect(findCycle(graph)).toBeNull();
  });

  it('returns a closed cycle when one exists', () => {
    const cyclic = buildGraph([
      { id: 'p', prerequisites: ['r'] },
      { id: 'q', prerequisites: ['p'] },
      { id: 'r', prerequisites: ['q'] },
    ]);
    const cycle = findCycle(cyclic);
    expect(cycle).not.toBeNull();
    expect(cycle?.[0]).toBe(cycle?.[cycle.length - 1]);
    expect(new Set(cycle).size).toBe(3);
  });

  it('detects self loops', () => {
    expect(findCycle(buildGraph([{ id: 's', prerequisites: ['s'] }]))).toEqual(['s', 's']);
  });
});

describe('topologicalOrder', () => {
  it('respects prerequisites and uses the comparator to break ties', () => {
    expect(topologicalOrder(graph, graph.ids, alphabetical)).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ]);
    const reverse = topologicalOrder(graph, graph.ids, (x, y) => y.localeCompare(x));
    expect(reverse).toEqual(['f', 'a', 'c', 'b', 'd', 'e']);
  });

  it('works on subsets', () => {
    expect(topologicalOrder(graph, ['e', 'b', 'a'], alphabetical)).toEqual(['a', 'b', 'e']);
  });

  it('throws on cycles', () => {
    const cyclic = buildGraph([
      { id: 'p', prerequisites: ['q'] },
      { id: 'q', prerequisites: ['p'] },
    ]);
    expect(() => topologicalOrder(cyclic, cyclic.ids, alphabetical)).toThrow();
  });
});

describe('depths', () => {
  it('uses the longest path from a root', () => {
    const result = depths(graph);
    expect(result.get('a')).toBe(0);
    expect(result.get('d')).toBe(2);
    expect(result.get('e')).toBe(3);
    expect(result.get('f')).toBe(0);
  });
});

describe('roadmapSet', () => {
  it('includes the target and all its ancestors by default', () => {
    expect([...roadmapSet(graph, 'e')].sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('prunes known concepts and ancestors reachable only through them', () => {
    expect([...roadmapSet(graph, 'e', { known: ['b'] })].sort()).toEqual(['a', 'c', 'd', 'e']);
    expect([...roadmapSet(graph, 'e', { known: ['b', 'c'] })].sort()).toEqual(['d', 'e']);
  });

  it('treats a starting concept and its ancestors as known', () => {
    expect([...roadmapSet(graph, 'e', { from: 'b' })].sort()).toEqual(['c', 'd', 'e']);
  });

  it('never prunes the target itself', () => {
    expect([...roadmapSet(graph, 'd', { known: ['d'] })].sort()).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('shortestPrerequisitePath', () => {
  it('finds a shortest chain along dependencies', () => {
    const path = shortestPrerequisitePath(graph, 'a', 'e');
    expect(path).toHaveLength(4);
    expect(path?.[0]).toBe('a');
    expect(path?.[3]).toBe('e');
    expect(shortestPrerequisitePath(graph, 'e', 'a')).toBeNull();
    expect(shortestPrerequisitePath(graph, 'f', 'f')).toEqual(['f']);
  });
});

describe('inducedSubgraph and redundantPrerequisites', () => {
  it('keeps only internal edges', () => {
    const sub = inducedSubgraph(graph, ['a', 'd', 'e']);
    expect(sub.prerequisites.get('d')).toEqual([]);
    expect(sub.prerequisites.get('e')).toEqual(['d']);
  });

  it('flags prerequisites implied by others', () => {
    const redundant = buildGraph([
      { id: 'a', prerequisites: [] },
      { id: 'b', prerequisites: ['a'] },
      { id: 'c', prerequisites: ['a', 'b'] },
    ]);
    expect(redundantPrerequisites(redundant, 'c')).toEqual(['a']);
    expect(redundantPrerequisites(graph, 'd')).toEqual([]);
  });
});
