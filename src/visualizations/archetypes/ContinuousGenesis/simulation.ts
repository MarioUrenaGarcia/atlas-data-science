import type { Random } from '../../../lib/random/index.ts';
import type { ContinuousExperiment } from './processes.ts';

/** Experiments kept in the histogram. */
export const MAX_EXPERIMENTS = 4000;
const BASE_EVENTS_PER_SECOND = 5;
const ACCELERATION_PER_EXPERIMENT = 0.3;
const MAX_ACCELERATION = 200;
/** Above this rate objects appear without the growth animation, which would never finish. */
const POP_RATE_LIMIT = 30;

export interface ContinuousState {
  experiment: ContinuousExperiment | null;
  shown: number;
  values: number[];
}

export function initialContinuousState(): ContinuousState {
  return { experiment: null, shown: 0, values: [] };
}

export function continuousRate(completed: number): number {
  return (
    BASE_EVENTS_PER_SECOND * Math.min(MAX_ACCELERATION, 1 + completed * ACCELERATION_PER_EXPERIMENT)
  );
}

export function animatesContinuous(completed: number): boolean {
  return continuousRate(completed) <= POP_RATE_LIMIT;
}

/** Reveals `steps` events; an experiment is recorded when its last event appears. */
export function advanceContinuous(
  state: ContinuousState,
  steps: number,
  random: Random,
  simulate: (random: Random) => ContinuousExperiment,
): ContinuousState {
  let { experiment, shown } = state;
  const values = [...state.values];
  for (let i = 0; i < steps && values.length < MAX_EXPERIMENTS; i += 1) {
    if (!experiment || shown >= experiment.events.length) {
      experiment = simulate(random);
      shown = 0;
    }
    shown += 1;
    if (shown === experiment.events.length) values.push(experiment.value);
  }
  return { experiment, shown, values };
}
