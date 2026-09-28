import type { AlgorithmId } from '../algorithmIds.ts';
import type { AlgorithmDefinition } from '../types.ts';
import { bisection } from './bisection.ts';
import { newton } from './newton.ts';

// Each definition fixes its own state type; the stepper only passes states back to the same definition.
export const ALGORITHMS: Record<AlgorithmId, AlgorithmDefinition<never>> = {
  biseccion: bisection as unknown as AlgorithmDefinition<never>,
  'newton-raphson': newton as unknown as AlgorithmDefinition<never>,
};
