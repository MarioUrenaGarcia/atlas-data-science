import { seedFromText } from '../../lib/random/index.ts';

const SEED_RANGE = 1_000_000;

/** Seed from the frontmatter, or a stable one derived from the concept id. */
export function defaultSeed(conceptId: string, configured?: number): number {
  return configured ?? seedFromText(conceptId) % SEED_RANGE;
}
