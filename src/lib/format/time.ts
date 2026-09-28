import type { Level } from '../../content/types.ts';

/** Estimated study time per concept, in minutes, by level. */
export const MINUTES_BY_LEVEL: Record<Level, number> = {
  basico: 15,
  intermedio: 25,
  avanzado: 40,
};

export function studyMinutes(levels: Iterable<Level>): number {
  let total = 0;
  for (const level of levels) total += MINUTES_BY_LEVEL[level];
  return total;
}
