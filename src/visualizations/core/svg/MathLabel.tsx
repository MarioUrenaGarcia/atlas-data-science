import katex from 'katex';
import { useMemo } from 'react';
import styles from './svg.module.css';

interface MathLabelProps {
  x: number;
  y: number;
  latex: string;
  width?: number;
  height?: number;
  align?: 'start' | 'middle' | 'end';
}

/** LaTeX rendered with KaTeX inside a foreignObject, positioned in SVG coordinates. */
export function MathLabel({
  x,
  y,
  latex,
  width = 160,
  height = 28,
  align = 'start',
}: MathLabelProps) {
  const html = useMemo(
    () => katex.renderToString(latex, { throwOnError: false, output: 'html' }),
    [latex],
  );
  const left = align === 'start' ? x : align === 'middle' ? x - width / 2 : x - width;
  return (
    <foreignObject x={left} y={y - height / 2} width={width} height={height} aria-hidden="true">
      <div
        className={styles.math}
        style={{ textAlign: align === 'start' ? 'left' : align === 'middle' ? 'center' : 'right' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </foreignObject>
  );
}
