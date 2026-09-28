import { useEffect, useRef, useState, type RefObject } from 'react';

/** Frames longer than this are clamped so a background tab does not cause a huge jump. */
const MAX_FRAME_SECONDS = 0.1;

/** True while the element intersects the viewport. */
export function useIsVisible(target: RefObject<Element>): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = target.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      {
        threshold: 0,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);
  return visible;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

interface AnimationLoopOptions {
  running: boolean;
  /** Multiplier applied to elapsed time. */
  speed?: number;
  /** Element whose visibility gates the loop. */
  target: RefObject<Element>;
}

/**
 * Calls `onFrame` with the elapsed simulated seconds on every animation frame
 * while `running` is true, the target is on screen and the tab is visible.
 */
export function useAnimationLoop(
  onFrame: (seconds: number) => void,
  { running, speed = 1, target }: AnimationLoopOptions,
): void {
  const callback = useRef(onFrame);
  useEffect(() => {
    callback.current = onFrame;
  });
  const onScreen = useIsVisible(target);
  const pageVisible = usePageVisible();
  const active = running && onScreen && pageVisible;

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      if (last !== null) {
        const seconds = Math.min(MAX_FRAME_SECONDS, (now - last) / 1000);
        callback.current(seconds * speed);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, speed]);
}
