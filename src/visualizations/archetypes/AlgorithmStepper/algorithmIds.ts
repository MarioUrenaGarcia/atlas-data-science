/** Algorithms available to AlgorithmStepper; a plain module so schemas can import it from Node. */
export const ALGORITHM_IDS = ['biseccion', 'newton-raphson'] as const;

export type AlgorithmId = (typeof ALGORITHM_IDS)[number];
