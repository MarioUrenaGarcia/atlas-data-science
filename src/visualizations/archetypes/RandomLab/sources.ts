import { LinearCongruential, MersenneTwister, randu } from '../../../lib/random/generators.ts';
import type { GeneratorId } from './schema.ts';

export const GENERATOR_LABELS: Record<GeneratorId, string> = {
  mt: 'Mersenne Twister',
  'lcg-pequeno': 'Congruencial con m = 256',
  randu: 'RANDU de IBM',
  sesgado: 'Generador sesgado',
};

/** Exponent that pushes the faulty generator toward small values. */
const BIAS = 1.3;

/** A stream of uniforms in [0, 1) from one of the teaching generators. */
export function uniformStream(id: GeneratorId, seed: number): () => number {
  switch (id) {
    case 'mt': {
      const mt = new MersenneTwister(seed);
      return () => mt.next();
    }
    case 'lcg-pequeno': {
      const g = new LinearCongruential(37, 1, 256, seed);
      return () => g.next();
    }
    case 'randu': {
      const g = randu(seed);
      return () => g.next();
    }
    case 'sesgado': {
      const mt = new MersenneTwister(seed);
      return () => mt.next() ** BIAS;
    }
  }
}

/** The first n values of a stream. */
export function take(stream: () => number, n: number): number[] {
  return Array.from({ length: n }, () => stream());
}
