import type { TreeBranch } from './schema.ts';

export interface TreeNode {
  /** Labels from the root joined by "/"; the root has an empty path. */
  path: string;
  label: string;
  /** Probability of the branch that leads to this node, conditional on its parent. */
  prob: number;
  /** Product of the branch probabilities from the root. */
  pathProb: number;
  depth: number;
  parent: string | null;
  children: string[];
}

/** Flattens the tree breadth first, so growing it level by level follows the node order. */
export function flattenTree(branches: readonly TreeBranch[]): TreeNode[] {
  const nodes: TreeNode[] = [
    { path: '', label: '', prob: 1, pathProb: 1, depth: 0, parent: null, children: [] },
  ];
  const queue: { node: TreeNode; branches: readonly TreeBranch[] }[] = [
    { node: nodes[0] as TreeNode, branches },
  ];
  while (queue.length > 0) {
    const { node, branches: next } = queue.shift() as (typeof queue)[number];
    for (const branch of next) {
      const path = node.path ? `${node.path}/${branch.etiqueta}` : branch.etiqueta;
      const child: TreeNode = {
        path,
        label: branch.etiqueta,
        prob: branch.prob,
        pathProb: node.pathProb * branch.prob,
        depth: node.depth + 1,
        parent: node.path,
        children: [],
      };
      node.children.push(path);
      nodes.push(child);
      if (branch.ramas) queue.push({ node: child, branches: branch.ramas });
    }
  }
  return nodes;
}

/** Leaves in drawing order: depth first, so siblings stay next to each other. */
export function leavesInOrder(nodes: readonly TreeNode[]): TreeNode[] {
  const byPath = new Map(nodes.map((node) => [node.path, node]));
  const result: TreeNode[] = [];
  const visit = (path: string) => {
    const node = byPath.get(path);
    if (!node) return;
    if (node.children.length === 0) result.push(node);
    else node.children.forEach(visit);
  };
  visit('');
  return result;
}

/** Sum of the path probabilities of the given leaves. */
export function leafSum(nodes: readonly TreeNode[], leaves: readonly string[]): number {
  const wanted = new Set(leaves);
  return nodes
    .filter((node) => wanted.has(node.path))
    .reduce((sum, node) => sum + node.pathProb, 0);
}
