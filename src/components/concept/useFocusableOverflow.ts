import { useEffect, type RefObject } from 'react';

const SCROLLERS = '.katex-display, .prose table';

/**
 * Display formulas and tables scroll horizontally on narrow screens. A scroll
 * container that holds no focusable element cannot be reached by keyboard, so
 * the ones that actually overflow receive a tab stop, and lose it again when
 * the layout grows wide enough to show them whole.
 */
export function useFocusableOverflow(ref: RefObject<HTMLElement | null>, key: unknown): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const update = () => {
      root.querySelectorAll<HTMLElement>(SCROLLERS).forEach((element) => {
        if (element.scrollWidth > element.clientWidth + 1) element.tabIndex = 0;
        else element.removeAttribute('tabindex');
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, key]);
}
