import { useCallback, useRef, useState } from 'react';
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
  /** When true, playback stops automatically. */
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
  done = false,
  autoplay = true,
}: PlaybackOptions): Playback {
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(autoplay && !reducedMotion);
  const [speed, setSpeed] = useState<Speed>(1);
  const carry = useRef(0);

  const advance = useCallback(
    (seconds: number) => {
      if (done) {
        setPlaying(false);
        return;
      }
      carry.current += seconds * rate;
      const count = Math.min(MAX_STEPS_PER_FRAME, Math.floor(carry.current));
      if (count <= 0) return;
      carry.current -= count;
      if (stepMany) stepMany(count);
      else for (let i = 0; i < count; i += 1) step();
    },
    [done, rate, step, stepMany],
  );

  return {
    playing: playing && !done,
    speed,
    done,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((value) => !value),
    stepOnce: () => {
      setPlaying(false);
      if (!done) step();
    },
    restart: () => {
      carry.current = 0;
      reset();
    },
    setSpeed,
    advance,
  };
}
