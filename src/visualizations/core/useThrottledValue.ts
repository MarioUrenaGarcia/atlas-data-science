import { useEffect, useRef, useState } from 'react';

/**
 * Returns `value` but updates at most once per `interval` milliseconds. Live
 * descriptions use it so screen readers are not flooded during animations.
 */
export function useThrottledValue<T>(value: T, interval: number): T {
  const [throttled, setThrottled] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const now = Date.now();
    const wait = Math.max(0, interval - (now - last.current));
    const timer = window.setTimeout(() => {
      last.current = Date.now();
      setThrottled(value);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [value, interval]);
  return throttled;
}
