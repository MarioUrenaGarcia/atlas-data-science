/** A diagonal of a convex polygon, as a pair of vertex indices. */
export type Diagonal = readonly [number, number];

/**
 * All triangulations of the convex polygon with vertices first..last. The
 * side (first, last) belongs to exactly one triangle, whose third vertex k
 * splits the polygon into two smaller ones that are triangulated separately.
 */
function triangulate(first: number, last: number): Diagonal[][] {
  if (last - first < 2) return [[]];
  const result: Diagonal[][] = [];
  for (let k = first + 1; k < last; k += 1) {
    const own: Diagonal[] = [];
    if (k - first > 1) own.push([first, k]);
    if (last - k > 1) own.push([k, last]);
    for (const left of triangulate(first, k)) {
      for (const right of triangulate(k, last)) result.push([...own, ...left, ...right]);
    }
  }
  return result;
}

/** Triangulations of a convex polygon with `vertices` corners, each as its list of diagonals. */
export function polygonTriangulations(vertices: number): Diagonal[][] {
  return triangulate(0, vertices - 1);
}

/** Parenthesis word of a Dyck path: "(" for an up step and ")" for a down step. */
export function dyckWord(path: readonly number[]): string {
  return path.map((step) => (step > 0 ? '(' : ')')).join('');
}
