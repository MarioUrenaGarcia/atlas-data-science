import katex from 'katex';
import { useMemo } from 'react';

interface LatexProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/** Inline or display LaTeX for HTML parts of a visualization (tables, captions). */
export function Latex({ tex, display = false, className }: LatexProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        throwOnError: false,
        displayMode: display,
        output: 'htmlAndMathml',
      }),
    [tex, display],
  );
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
