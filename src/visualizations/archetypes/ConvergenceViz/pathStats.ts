import { Random } from '../../../lib/random/index.ts';
import type { RandomSequence } from '../../../lib/limits/sequences.ts';

export function simulateSequencePaths(
  sequence: RandomSequence,
  count: number,
  horizon: number,
  seed: number,
): Float64Array[] {
  const random = new Random(seed);
  return Array.from({ length: count }, () => sequence.simulate(random, horizon));
}
