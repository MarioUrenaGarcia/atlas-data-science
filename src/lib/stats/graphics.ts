/** Relative change from a to b, |b - a| / a, the "size of effect" of Tufte. */
export function effectSize(a: number, b: number): number {
  return Math.abs(b - a) / Math.abs(a);
}

/**
 * Lie factor of Tufte: size of the effect shown in the graphic divided by the
 * size of the effect in the data. It is 1 for an honest graphic; above 1 the
 * graphic exaggerates the change and below 1 it understates it.
 */
export function lieFactor(shownA: number, shownB: number, dataA: number, dataB: number): number {
  return effectSize(shownA, shownB) / effectSize(dataA, dataB);
}

/**
 * Ratio perceived under Stevens's power law, where the sensation grows as the
 * stimulus to the power beta: a true ratio r is perceived as r^beta.
 */
export function perceivedRatio(ratio: number, exponent: number): number {
  return ratio ** exponent;
}

/** Share of the ink that encodes data: data ink over total ink. */
export function dataInkRatio(dataInk: number, nonDataInk: number): number {
  const total = dataInk + nonDataInk;
  return total === 0 ? 0 : dataInk / total;
}
