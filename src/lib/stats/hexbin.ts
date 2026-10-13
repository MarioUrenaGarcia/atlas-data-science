export interface HexBin {
  /** Center of the hexagon in the same units as the input coordinates. */
  x: number;
  y: number;
  count: number;
}

/**
 * Counts points in a grid of pointy-top regular hexagons of the given radius
 * (distance from the center to a vertex), following the classic algorithm of
 * Carr: round to the nearest center of two offset rectangular lattices and
 * keep the closer one. Coordinates must be in comparable units, usually
 * pixels, so the hexagons are regular on screen.
 */
export function hexbin(points: readonly (readonly [number, number])[], radius: number): HexBin[] {
  const dx = Math.sqrt(3) * radius;
  const dy = 1.5 * radius;
  const bins = new Map<string, HexBin>();
  for (const [x, y] of points) {
    const py = y / dy;
    let pj = Math.round(py);
    const px = x / dx - (pj & 1) / 2;
    let pi = Math.round(px);
    const py1 = py - pj;
    if (Math.abs(py1) * 3 > 1) {
      const px1 = px - pi;
      const pi2 = pi + (px < pi ? -1 : 1) / 2;
      const pj2 = pj + (py < pj ? -1 : 1);
      const px2 = px - pi2;
      const py2 = py - pj2;
      if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
        pi = pi2 + ((pj & 1) !== 0 ? 1 : -1) / 2;
        pj = pj2;
      }
    }
    const key = `${pi},${pj}`;
    const existing = bins.get(key);
    if (existing) existing.count += 1;
    else bins.set(key, { x: (pi + (pj & 1) / 2) * dx, y: pj * dy, count: 1 });
  }
  return [...bins.values()];
}

/** SVG path of a pointy-top hexagon centered at the origin. */
export function hexagonPath(radius: number): string {
  const corners = Array.from({ length: 6 }, (_, k) => {
    const angle = (Math.PI / 3) * k + Math.PI / 6;
    return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;
  });
  return `M${corners.join('L')}Z`;
}
