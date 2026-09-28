import type { Level } from './types.ts';

/** Levels in increasing difficulty; kept apart from the Zod schema so pages do not bundle it. */
export const LEVEL_ORDER: readonly Level[] = ['basico', 'intermedio', 'avanzado'];
