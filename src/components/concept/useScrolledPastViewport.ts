import { useEffect, useState } from 'react';

/**
 * Whether the page has been scrolled more than one viewport height. Checked on
 * scroll and resize, at most once per frame.
 */
export function useScrolledPastViewport(): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame: number | null = null;
    const check = () => {
      frame = null;
      setPast(window.scrollY > window.innerHeight);
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return past;
}
