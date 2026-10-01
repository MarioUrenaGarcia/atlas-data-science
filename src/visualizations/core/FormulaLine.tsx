import { useLayoutEffect, useRef, useState } from 'react';
import { strings } from '../../app/strings.ts';
import styles from './FormulaLine.module.css';
import { Latex } from './Latex.tsx';

interface FormulaLineProps {
  tex: string;
}

/**
 * Centered formula above a visualization. Long formulas scroll horizontally;
 * only then the line becomes a labelled, focusable region so keyboard users
 * can scroll it, without adding a tab stop to formulas that fit.
 */
export function FormulaLine({ tex }: FormulaLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const check = () => setOverflows(element.scrollWidth > element.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  }, [tex]);

  return (
    <div
      ref={ref}
      className={styles.formula}
      role={overflows ? 'region' : undefined}
      aria-label={overflows ? strings.viz.formulaRegion : undefined}
      tabIndex={overflows ? 0 : undefined}
    >
      <Latex tex={tex} />
    </div>
  );
}
