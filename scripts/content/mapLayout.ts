import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import type { ConceptNode, MapLayoutData } from '../../src/content/types.ts';

interface ForceNode extends SimulationNodeDatum {
  id: string;
  modulo: number;
  radius: number;
}

const MODULE_RING_RADIUS = 900;
const TICKS = 320;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function nodeRadius(descendants: number): number {
  return 3 + Math.sqrt(descendants) * 0.9;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Precomputes a stable force-directed layout: each module is pulled toward its
 * own anchor on a ring, prerequisite links pull related concepts together and
 * collisions keep nodes from overlapping. d3-force uses a seeded random source,
 * so the same content always produces the same map.
 */
export function computeMapLayout(
  nodes: readonly ConceptNode[],
  moduleNumbers: readonly number[],
): MapLayoutData {
  const anchors = new Map<number, { x: number; y: number }>();
  moduleNumbers.forEach((numero, index) => {
    const angle = (2 * Math.PI * index) / Math.max(1, moduleNumbers.length) - Math.PI / 2;
    anchors.set(numero, {
      x: MODULE_RING_RADIUS * Math.cos(angle),
      y: MODULE_RING_RADIUS * Math.sin(angle),
    });
  });

  const counters = new Map<number, number>();
  const forceNodes: ForceNode[] = nodes.map((node) => {
    const anchor = anchors.get(node.modulo) ?? { x: 0, y: 0 };
    const index = counters.get(node.modulo) ?? 0;
    counters.set(node.modulo, index + 1);
    const distance = 8 * Math.sqrt(index + 0.5);
    return {
      id: node.id,
      modulo: node.modulo,
      radius: nodeRadius(node.descendientes),
      x: anchor.x + distance * Math.cos(index * GOLDEN_ANGLE),
      y: anchor.y + distance * Math.sin(index * GOLDEN_ANGLE),
    };
  });

  const ids = new Set(nodes.map((node) => node.id));
  const links: SimulationLinkDatum<ForceNode>[] = nodes.flatMap((node) =>
    node.prerrequisitos.filter((id) => ids.has(id)).map((id) => ({ source: id, target: node.id })),
  );

  const simulation = forceSimulation(forceNodes)
    .force(
      'link',
      forceLink<ForceNode, SimulationLinkDatum<ForceNode>>(links)
        .id((node) => node.id)
        .distance(28)
        .strength(0.15),
    )
    .force('charge', forceManyBody<ForceNode>().strength(-18).distanceMax(220))
    .force('x', forceX<ForceNode>((node) => anchors.get(node.modulo)?.x ?? 0).strength(0.12))
    .force('y', forceY<ForceNode>((node) => anchors.get(node.modulo)?.y ?? 0).strength(0.12))
    .force('collide', forceCollide<ForceNode>((node) => node.radius + 2).iterations(2))
    .stop();

  simulation.tick(TICKS);

  const positions: Record<string, [number, number]> = {};
  for (const node of forceNodes) positions[node.id] = [round(node.x ?? 0), round(node.y ?? 0)];

  const modules = moduleNumbers.map((numero) => {
    const members = forceNodes.filter((node) => node.modulo === numero);
    if (members.length === 0) {
      const anchor = anchors.get(numero) ?? { x: 0, y: 0 };
      return { numero, x: round(anchor.x), y: round(anchor.y), radius: 0, count: 0 };
    }
    const x = members.reduce((sum, node) => sum + (node.x ?? 0), 0) / members.length;
    const y = members.reduce((sum, node) => sum + (node.y ?? 0), 0) / members.length;
    const radius = Math.max(
      ...members.map((node) => Math.hypot((node.x ?? 0) - x, (node.y ?? 0) - y) + node.radius),
    );
    return { numero, x: round(x), y: round(y), radius: round(radius), count: members.length };
  });

  return { positions, modules };
}
