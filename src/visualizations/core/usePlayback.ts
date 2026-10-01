import { useCallback, useRef, useState } from 'react';
import { queueSkipSteps } from './skipToEnd.ts';
import { useReducedMotion } from './useReducedMotion.ts';

export const SPEEDS = [0.25, 0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

/** Upper bound of steps per frame so very fast settings never freeze the page. */
const MAX_STEPS_PER_FRAME = 200;

interface PlaybackOptions {
  /** Advances the simulation by one step. */
  step: () => void;
  /** Advances by several steps at once when that is cheaper than repeated calls. */
  stepMany?: (count: number) => void;
  /** Restores the initial state of the simulation. */
  reset: () => void;
  /** Steps per second at 1x speed. */
  rate: number;
  /**
   * When true, playback stops automatically. Animations that pass this flag
   * have a final state and get the skip-to-end action; endless loops omit it.
   */
  done?: boolean;
  autoplay?: boolean;
}

export interface Playback {
  playing: boolean;
  speed: Speed;
  done: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepOnce: () => void;
  restart: () => void;
  /** Runs the simulation to its final state; null for animations without one. */
  skipToEnd: (() => void) | null;
  /** True while a skip to the end is in progress. */
  skipping: boolean;
  setSpeed: (speed: Speed) => void;
  /** Called by the frame loop with the simulated seconds since the last frame. */
  advance: (seconds: number) => void;
}

/**
 * Converts continuous time into discrete simulation steps. Playback starts
 * paused when the user prefers reduced motion.
 */
export function usePlayback({
  step,
  stepMany,
  reset,
  rate,
  done: doneOption,
  autoplay = true,
}: PlaybackOptions): Playback {
  const finite = doneOption !== undefined;
  const done = doneOption ?? false;
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(autoplay && !reducedMotion);
  const [speed, setSpeed] = useState<Speed>(1);
  const [skipping, setSkipping] = useState(false);
  const carry = useRef(0);

  const advance = useCallback(
    (seconds: number) => {
      if (done) {
        setPlaying(false);
        setSkipping(false);
        return;
      }
      if (skipping) {
        // Fast-forward: ignore elapsed time and queue a large batch of steps.
        queueSkipSteps({ step, stepMany });
        return;
      }
      carry.current += seconds * rate;
      const count = Math.min(MAX_STEPS_PER_FRAME, Math.floor(carry.current));
      if (count <= 0) return;
      carry.current -= count;
      if (stepMany) stepMany(count);
      else for (let i = 0; i < count; i += 1) step();
    },
    [done, skipping, rate, step, stepMany],
  );

  return {
    playing: playing && !done,
    speed,
    done,
    play: () => setPlaying(true),
    pause: () => {
      setSkipping(false);
      setPlaying(false);
    },
    toggle: () => {
      setSkipping(false);
      setPlaying((value) => !value);
    },
    stepOnce: () => {
      setSkipping(false);
      setPlaying(false);
      if (!done) step();
    },
    restart: () => {
      carry.current = 0;
      setSkipping(false);
      reset();
    },
    skipToEnd: finite
      ? () => {
          if (done) return;
          setSkipping(true);
          setPlaying(true);
        }
      : null,
    skipping: skipping && !done,
    setSpeed,
    advance,
  };
}
