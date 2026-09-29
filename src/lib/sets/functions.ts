/**
 * Finite relations between two sets given by index pairs (domain index,
 * codomain index), with the checks that define functions and their kinds.
 */

export type Arrow = readonly [number, number];

export interface FunctionCheck {
  isFunction: boolean;
  /** Domain elements with no image (the relation is not total). */
  withoutImage: number[];
  /** Domain elements with more than one image (the relation is not single-valued). */
  withSeveralImages: number[];
}

export function checkFunction(domainSize: number, arrows: readonly Arrow[]): FunctionCheck {
  const counts = new Array<number>(domainSize).fill(0);
  for (const [from] of arrows) counts[from] = (counts[from] ?? 0) + 1;
  const withoutImage = counts.flatMap((count, index) => (count === 0 ? [index] : []));
  const withSeveralImages = counts.flatMap((count, index) => (count > 1 ? [index] : []));
  return {
    isFunction: withoutImage.length === 0 && withSeveralImages.length === 0,
    withoutImage,
    withSeveralImages,
  };
}

/** Image of a function as sorted codomain indices. */
export function image(arrows: readonly Arrow[]): number[] {
  return [...new Set(arrows.map(([, to]) => to))].sort((a, b) => a - b);
}

export interface Kind {
  injective: boolean;
  surjective: boolean;
  bijective: boolean;
  /** Two domain indices sharing an image, when injectivity fails. */
  collision: [number, number] | null;
  /** Codomain indices never reached, when surjectivity fails. */
  unreached: number[];
}

export function classifyFunction(codomainSize: number, arrows: readonly Arrow[]): Kind {
  const firstByTarget = new Map<number, number>();
  let collision: [number, number] | null = null;
  for (const [from, to] of arrows) {
    const previous = firstByTarget.get(to);
    if (previous !== undefined && previous !== from && collision === null)
      collision = [previous, from];
    if (previous === undefined) firstByTarget.set(to, from);
  }
  const reached = new Set(arrows.map(([, to]) => to));
  const unreached = Array.from({ length: codomainSize }, (_, index) => index).filter(
    (index) => !reached.has(index),
  );
  const injective = collision === null;
  const surjective = unreached.length === 0;
  return { injective, surjective, bijective: injective && surjective, collision, unreached };
}

/** Composition g after f for functions given as arrays of image indices. */
export function compose(f: readonly number[], g: readonly number[]): number[] {
  return f.map((index) => g[index] ?? -1);
}

/** Inverse of a bijection given as an array of image indices, or null when it is not bijective. */
export function inverse(f: readonly number[], codomainSize: number): number[] | null {
  if (f.length !== codomainSize) return null;
  const result = new Array<number>(codomainSize).fill(-1);
  for (let i = 0; i < f.length; i += 1) {
    const target = f[i] ?? -1;
    if (target < 0 || target >= codomainSize || result[target] !== -1) return null;
    result[target] = i;
  }
  return result;
}
