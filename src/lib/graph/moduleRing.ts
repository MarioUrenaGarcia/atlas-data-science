export interface ModuleGroupInput {
  numero: number;
  count: number;
}

export interface ModuleBubble {
  numero: number;
  count: number;
  x: number;
  y: number;
  r: number;
}

export interface ModuleLink {
  source: number;
  target: number;
  /** Number of prerequisite edges that go from `source` to `target`. */
  weight: number;
}

const MIN_RADIUS = 34;
const MAX_RADIUS = 120;
const GAP = 36;

/**
 * Places one bubble per non empty module on a circle, in module order. Bubble
 * area grows with the number of concepts, and the ring radius is the smallest
 * one that keeps every pair of neighbors apart by at least GAP, so bubbles
 * never overlap whatever the number of modules.
 */
export function moduleRing(groups: readonly ModuleGroupInput[]): ModuleBubble[] {
  const present = groups.filter((group) => group.count > 0);
  if (present.length === 0) return [];
  const largest = Math.max(...present.map((group) => group.count));
  const sized = present.map((group) => ({
    numero: group.numero,
    count: group.count,
    r: Math.max(MIN_RADIUS, MAX_RADIUS * Math.sqrt(group.count / largest)),
  }));
  const n = sized.length;
  if (n === 1) return sized.map((group) => ({ ...group, x: 0, y: 0 }));

  // Neighbors on a regular n-gon are 2 R sin(pi / n) apart.
  const chordFactor = 2 * Math.sin(Math.PI / n);
  const ring = Math.max(
    ...sized.map((group, index) => {
      const next = sized[(index + 1) % n] ?? group;
      return (group.r + next.r + GAP) / chordFactor;
    }),
  );

  return sized.map((group, index) => {
    const angle = (2 * Math.PI * index) / n - Math.PI / 2;
    return { ...group, x: ring * Math.cos(angle), y: ring * Math.sin(angle) };
  });
}

/**
 * Aggregates concept level prerequisite edges into module level links. Edges
 * inside a module are ignored because the bubble already represents them.
 */
export function moduleLinks(
  nodes: readonly { modulo: number; prerrequisitos: readonly string[] }[],
  moduleOf: (id: string) => number | undefined,
): ModuleLink[] {
  const weights = new Map<string, ModuleLink>();
  for (const node of nodes) {
    for (const prerequisite of node.prerrequisitos) {
      const source = moduleOf(prerequisite);
      if (source === undefined || source === node.modulo) continue;
      const key = `${source}:${node.modulo}`;
      const link = weights.get(key);
      if (link) link.weight += 1;
      else weights.set(key, { source, target: node.modulo, weight: 1 });
    }
  }
  return [...weights.values()].sort((a, b) => a.source - b.source || a.target - b.target);
}
