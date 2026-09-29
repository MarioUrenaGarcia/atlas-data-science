/** Slowest listing speed, so short enumerations can still be followed item by item. */
const MIN_ITEMS_PER_SECOND = 2;
/** Long enumerations are sped up to finish in about this time at normal speed. */
const TARGET_SECONDS = 20;

export function enumerationRate(total: number): number {
  return Math.max(MIN_ITEMS_PER_SECOND, total / TARGET_SECONDS);
}
