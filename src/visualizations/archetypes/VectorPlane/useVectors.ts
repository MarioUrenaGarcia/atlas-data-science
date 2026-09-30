import { useState } from 'react';
import { useResettableState } from '../../core/useSeededRandom.ts';
import type { Vec2 } from './schema.ts';

/**
 * Editable list of vectors that starts from the configured ones and returns
 * to them on reset. Dragging a handle replaces one vector of the list.
 */
export function useVectors(initial: readonly Vec2[]) {
  const [run, setRun] = useState(0);
  const [vectors, update] = useResettableState<Vec2[]>(`${JSON.stringify(initial)}|${run}`, () =>
    initial.map((vector) => [vector[0], vector[1]] as Vec2),
  );
  const set = (index: number, value: Vec2) =>
    update((previous) => previous.map((vector, position) => (position === index ? value : vector)));
  const reset = () => setRun((value) => value + 1);
  return { vectors, set, reset };
}
