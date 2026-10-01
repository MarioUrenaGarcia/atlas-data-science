import type { Experiment, GenesisEvent, GenesisSettings } from './processes.ts';

export interface StageBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StageProps {
  box: StageBox;
  settings: GenesisSettings;
  experiment: Experiment | null;
  /** Events of the experiment revealed so far. */
  shown: number;
  /** Completed experiments, used to number the current one. */
  completed: number;
  /** Whether new objects grow in; off at high speed, where the growth would never finish. */
  animate: boolean;
}

export function revealed(experiment: Experiment | null, shown: number): GenesisEvent[] {
  return experiment ? experiment.events.slice(0, shown) : [];
}

export function isDone(experiment: Experiment | null, shown: number): boolean {
  return experiment !== null && shown >= experiment.events.length;
}

/** Number of the experiment on screen, counting the one in progress. */
export function experimentNumber(experiment: Experiment | null, shown: number, completed: number) {
  if (!experiment) return 0;
  return isDone(experiment, shown) ? completed : completed + 1;
}

/** Largest circle radius that fits `perRow` circles in the width and `rows` rows in the height. */
export function fitRadius(
  width: number,
  height: number,
  perRow: number,
  rows: number,
  max: number,
) {
  const byWidth = width / (Math.max(1, perRow) * 2.5);
  const byHeight = height / (Math.max(1, rows) * 2.6);
  return Math.max(3, Math.min(max, byWidth, byHeight));
}

/** Caption of the scene: whether an experiment is running, finished or not started. */
export function stageTitle(
  noun: string,
  ready: string,
  experiment: Experiment | null,
  shown: number,
  completed: number,
): string {
  const number = experimentNumber(experiment, shown, completed);
  if (number === 0) return ready;
  return isDone(experiment, shown)
    ? `${noun} ${number}: resultado registrado`
    : `${noun} ${number} en curso`;
}
