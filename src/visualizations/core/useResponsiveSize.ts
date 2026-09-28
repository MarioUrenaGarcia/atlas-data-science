import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Tracks the content box of an element with ResizeObserver. The initial value
 * is measured synchronously before paint so the first render already uses the
 * real width instead of a placeholder.
 */
export function useResponsiveSize<T extends HTMLElement>(
  initial: Size = { width: 0, height: 0 },
): [RefObject<T>, Size] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>(initial);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize((previous) =>
        previous.width === rect.width && previous.height === rect.height
          ? previous
          : { width: rect.width, height: rect.height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
