import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.ts';

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function parse(key: string): number[] {
  return key === '' ? [] : key.split(',').map(Number);
}

/**
 * Smoothly interpolates an array of numbers toward `target`. Arrays of a
 * different length snap immediately. With reduced motion the value updates
 * without animation.
 */
export function useTween(target: readonly number[], duration = 350): number[] {
  const reducedMotion = useReducedMotion();
  // The target is compared by content so an equal array with a new identity
  // on every render does not restart the animation.
  const key = target.join(',');
  const [current, setCurrent] = useState<number[]>(() => parse(key));
  const shown = useRef<number[]>(parse(key));

  useEffect(() => {
    const goal = parse(key);
    if (reducedMotion || duration <= 0 || shown.current.length !== goal.length) {
      shown.current = goal;
      setCurrent(goal);
      return;
    }
    const origin = [...shown.current];
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const next = goal.map((value, index) => {
        const from = origin[index] ?? value;
        return from + (value - from) * eased;
      });
      shown.current = next;
      setCurrent(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration, reducedMotion]);

  // When the length changes the new target is shown immediately.
  return current.length === target.length ? current : [...target];
}
