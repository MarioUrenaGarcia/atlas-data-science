import { useCallback, useRef, useState } from 'react';
import { Random, randomSeed } from '../../lib/random/index.ts';

export interface SeedState {
  seed: number;
  initialSeed: number;
  setSeed: (seed: number) => void;
  newSeed: () => void;
  resetSeed: () => void;
}

export function useSeed(initialSeed: number): SeedState {
  const [seed, setSeedValue] = useState(initialSeed);
  const setSeed = useCallback((value: number) => {
    if (Number.isFinite(value)) setSeedValue(Math.abs(Math.trunc(value)) >>> 0);
  }, []);
  return {
    seed,
    initialSeed,
    setSeed,
    newSeed: () => setSeedValue(randomSeed()),
    resetSeed: () => setSeedValue(initialSeed),
  };
}

/**
 * Returns a getter for the simulation's random generator. A new generator is
 * created whenever `runKey` changes (new parameters, a new seed or a restart),
 * so the same key and seed always replay the same sequence. The getter is
 * meant for event handlers and animation callbacks, never for rendering.
 */
export function useRandomSource(seed: number, runKey: string): () => Random {
  const ref = useRef<{ key: string; generator: Random } | null>(null);
  return useCallback(() => {
    const key = `${seed}|${runKey}`;
    if (!ref.current || ref.current.key !== key) ref.current = { key, generator: new Random(seed) };
    return ref.current.generator;
  }, [seed, runKey]);
}

/**
 * State that resets to `create()` whenever `key` changes. The reset happens
 * during rendering, the pattern React recommends over effects for derived
 * resets, so the stale state is never painted.
 */
export function useResettableState<T>(
  key: string,
  create: () => T,
): [T, (update: (previous: T) => T) => void] {
  const [state, setState] = useState(() => ({ key, value: create() }));
  let current = state;
  if (state.key !== key) {
    current = { key, value: create() };
    setState(current);
  }
  const update = useCallback(
    (updater: (previous: T) => T) => {
      setState((previous) =>
        previous.key === key ? { key, value: updater(previous.value) } : previous,
      );
    },
    [key],
  );
  return [current.value, update];
}
