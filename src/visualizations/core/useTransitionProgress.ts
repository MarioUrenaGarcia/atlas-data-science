import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.ts';

/**
 * Progress in [0, 1] of a short animation that restarts whenever `key`
 * changes, for example a token traveling along an edge after each step.
 * Returns 0 on the render right after the change, so the old end state is
 * never shown for a frame.
 */
export function useTransitionProgress(key: string | number, duration: number): number {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<{ key: string | number; value: number }>({ key, value: 1 });

  useEffect(() => {
    if (reducedMotion || duration <= 0) {
      const frame = requestAnimationFrame(() => setState({ key, value: 1 }));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(1, (now - start) / duration);
      setState({ key, value });
      if (value < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration, reducedMotion]);

  if (state.key !== key) return reducedMotion ? 1 : 0;
  return state.value;
}
