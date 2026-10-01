import { useEffect, useRef, useState } from 'react';
import { strings } from '../../app/strings.ts';
import { Latex } from './Latex.tsx';

interface FormulaLineProps {
  tex: string;
  className?: string;
}

/**
 * A header formula that scrolls sideways when it does not fit. Only while it
 * overflows does it become a focusable region, so keyboard users can scroll
 * it without adding tab stops to formulas that fit.
 */
export function FormulaLine({ tex, className }: FormulaLineProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const check = () => setOverflowing(element.scrollWidth > element.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  }, [tex]);
  return (
    <p
      ref={ref}
      className={className}
      {...(overflowing ? { tabIndex: 0, role: 'region', 'aria-label': strings.viz.formula } : {})}
    >
      <Latex tex={tex} />
    </p>
  );
}
