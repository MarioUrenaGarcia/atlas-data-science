import type { Random } from '../../../lib/random/index.ts';
import type { Experiment } from './processes.ts';

/** Experiments kept in the histogram; later ones would not change it visibly. */
export const MAX_EXPERIMENTS = 3000;
/** Events per second at 1x while the first experiments are shown one event at a time. */
const BASE_EVENTS_PER_SECOND = 5;
/** Growth of the event rate per completed experiment, so the histogram fills after a few slow runs. */
const ACCELERATION_PER_EXPERIMENT = 0.25;
const MAX_ACCELERATION = 150;

export interface GenesisState {
  experiment: Experiment | null;
  /** Events of the current experiment already revealed. */
  shown: number;
  /** Completed values in order. */
  values: number[];
  /** Completed values that came from a structural zero. */
  structural: number;
  /** Count vectors of completed multinomial experiments. */
  vectors: number[][];
}

export function initialGenesisState(): GenesisState {
  return { experiment: null, shown: 0, values: [], structural: 0, vectors: [] };
}

export function eventRate(completed: number): number {
  return (
    BASE_EVENTS_PER_SECOND * Math.min(MAX_ACCELERATION, 1 + completed * ACCELERATION_PER_EXPERIMENT)
  );
}

/**
 * Reveals `steps` events. An experiment is recorded when its final event is
 * revealed, and the next step starts a new experiment.
 */
export function advanceGenesis(
  state: GenesisState,
  steps: number,
  random: Random,
  simulate: (random: Random) => Experiment,
): GenesisState {
  let { experiment, shown, structural } = state;
  const values = [...state.values];
  const vectors = [...state.vectors];
  for (let i = 0; i < steps && values.length < MAX_EXPERIMENTS; i += 1) {
    if (!experiment || shown >= experiment.events.length) {
      experiment = simulate(random);
      shown = 0;
    }
    shown += 1;
    if (shown === experiment.events.length) {
      values.push(experiment.value);
      if (experiment.structural) structural += 1;
      if (experiment.counts) vectors.push(experiment.counts);
    }
  }
  return { experiment, shown, values, structural, vectors };
}

/** Above this event rate objects appear without the growth animation, which would never finish. */
const POP_RATE_LIMIT = 30;

export function animatesObjects(completed: number): boolean {
  return eventRate(completed) <= POP_RATE_LIMIT;
}
