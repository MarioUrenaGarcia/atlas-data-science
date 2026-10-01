export interface Circle {
  cx: number;
  cy: number;
  r: number;
}

export interface VennLayout {
  width: number;
  height: number;
  circles: Circle[];
  /** Rectangle of the universe. */
  frame: { x: number; y: number; width: number; height: number };
}

/**
 * Circles for two or three sets inside the universe rectangle. With two sets,
 * `nested` names the set contained in the other: it is drawn inside, so the
 * picture has no region for elements that cannot exist.
 */
export function vennLayout(
  width: number,
  height: number,
  sets: number,
  nested: 0 | 1 | null = null,
): VennLayout {
  const pad = 10;
  const frame = { x: pad, y: pad, width: width - 2 * pad, height: height - 2 * pad };
  const cx = width / 2;
  const cy = height / 2;
  if (sets === 2 && nested !== null) {
    const outerRadius = Math.min(frame.width * 0.3, frame.height * 0.44);
    const outer = { cx: cx + outerRadius * 0.1, cy, r: outerRadius };
    const inner = { cx: cx - outerRadius * 0.25, cy, r: outerRadius * 0.45 };
    return { width, height, frame, circles: nested === 0 ? [inner, outer] : [outer, inner] };
  }
  if (sets === 2) {
    const r = Math.min(frame.width * 0.24, frame.height * 0.4);
    return {
      width,
      height,
      frame,
      circles: [
        { cx: cx - r * 0.62, cy, r },
        { cx: cx + r * 0.62, cy, r },
      ],
    };
  }
  const r = Math.min(frame.width * 0.2, frame.height * 0.3);
  const offset = r * 0.62;
  return {
    width,
    height,
    frame,
    circles: [
      { cx: cx - offset, cy: cy - offset * 0.55, r },
      { cx: cx + offset, cy: cy - offset * 0.55, r },
      { cx, cy: cy + offset * 0.75, r },
    ],
  };
}

export function inside(circle: Circle, x: number, y: number): boolean {
  return (x - circle.cx) ** 2 + (y - circle.cy) ** 2 <= circle.r * circle.r;
}

/** Membership vector of a point: bit i is set when the point lies in circle i. */
export function regionOf(layout: VennLayout, x: number, y: number): number {
  return layout.circles.reduce(
    (mask, circle, index) => (inside(circle, x, y) ? mask | (1 << index) : mask),
    0,
  );
}

/**
 * Assigns a position to every element inside the region given by its
 * membership mask. Candidate points come from a grid; each region spreads its
 * elements over its candidates so they neither overlap nor cross borders.
 */
export function placeElements(
  layout: VennLayout,
  masks: readonly number[],
  spacing: number,
): { x: number; y: number }[] {
  const margin = spacing * 0.6;
  const candidates = new Map<number, { x: number; y: number }[]>();
  const { frame } = layout;
  for (let y = frame.y + margin; y <= frame.y + frame.height - margin; y += spacing) {
    for (let x = frame.x + margin; x <= frame.x + frame.width - margin; x += spacing) {
      // Keep points away from circle borders so labels stay readable.
      const nearBorder = layout.circles.some(
        (circle) => Math.abs(Math.hypot(x - circle.cx, y - circle.cy) - circle.r) < spacing * 0.45,
      );
      if (nearBorder) continue;
      const mask = regionOf(layout, x, y);
      const list = candidates.get(mask) ?? [];
      list.push({ x, y });
      candidates.set(mask, list);
    }
  }
  const byRegion = new Map<number, number[]>();
  masks.forEach((mask, index) => {
    const list = byRegion.get(mask) ?? [];
    list.push(index);
    byRegion.set(mask, list);
  });
  const positions = masks.map(() => ({ x: layout.width / 2, y: layout.height / 2 }));
  for (const [mask, indices] of byRegion) {
    const spots = candidates.get(mask) ?? [];
    if (spots.length === 0) continue;
    // Sort spots by distance to their centroid so few elements cluster centrally.
    const centroid = spots.reduce(
      (sum, spot) => ({ x: sum.x + spot.x / spots.length, y: sum.y + spot.y / spots.length }),
      { x: 0, y: 0 },
    );
    // The outside region surrounds the circles, so its elements go to the corners instead.
    const distance = (spot: { x: number; y: number }) =>
      Math.hypot(spot.x - centroid.x, spot.y - centroid.y);
    const ordered = [...spots].sort((a, b) =>
      mask === 0 ? distance(b) - distance(a) : distance(a) - distance(b),
    );
    indices.forEach((elementIndex, position) => {
      const spot = ordered[position % ordered.length];
      if (spot) positions[elementIndex] = spot;
    });
  }
  return positions;
}

/** Grid step, in pixels, used to locate the center of each region. */
const ANCHOR_STEP = 6;

/**
 * A representative point for each region inside the circles: the sampled
 * point of the region farthest from every circle border, so a label placed
 * there stays inside the region even for thin crescent shapes.
 */
export function regionAnchors(layout: VennLayout): Map<number, { x: number; y: number }> {
  const best = new Map<number, { x: number; y: number; clearance: number }>();
  const { frame } = layout;
  for (let y = frame.y; y <= frame.y + frame.height; y += ANCHOR_STEP) {
    for (let x = frame.x; x <= frame.x + frame.width; x += ANCHOR_STEP) {
      const mask = regionOf(layout, x, y);
      if (mask === 0) continue;
      const clearance = Math.min(
        ...layout.circles.map((circle) =>
          Math.abs(Math.hypot(x - circle.cx, y - circle.cy) - circle.r),
        ),
      );
      const previous = best.get(mask);
      if (!previous || clearance > previous.clearance) best.set(mask, { x, y, clearance });
    }
  }
  return new Map([...best].map(([mask, point]) => [mask, { x: point.x, y: point.y }]));
}

/**
 * For two sets, the index of the one strictly contained in the other
 * according to the members' masks, or null when neither contains the other.
 */
export function containedSet(masks: readonly number[]): 0 | 1 | null {
  const present = new Set(masks);
  if (!present.has(3)) return null;
  if (!present.has(1) && present.has(2)) return 0;
  if (!present.has(2) && present.has(1)) return 1;
  return null;
}
