import type { ContinuousEvent, ContinuousExperiment, ContinuousSettings } from './processes.ts';

export interface StageBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ContinuousStageProps {
  box: StageBox;
  settings: ContinuousSettings;
  experiment: ContinuousExperiment | null;
  shown: number;
  completed: number;
  /** Whether new objects grow in; off at high speed. */
  animate: boolean;
}

export function revealedEvents(
  experiment: ContinuousExperiment | null,
  shown: number,
): ContinuousEvent[] {
  return experiment ? experiment.events.slice(0, shown) : [];
}

export function experimentDone(experiment: ContinuousExperiment | null, shown: number): boolean {
  return experiment !== null && shown >= experiment.events.length;
}

/** Caption of the scene: whether an experiment is running, finished or not started. */
export function continuousTitle(
  noun: string,
  ready: string,
  experiment: ContinuousExperiment | null,
  shown: number,
  completed: number,
): string {
  if (!experiment) return ready;
  return experimentDone(experiment, shown)
    ? `${noun} ${completed}: resultado registrado`
    : `${noun} ${completed + 1} en curso`;
}
