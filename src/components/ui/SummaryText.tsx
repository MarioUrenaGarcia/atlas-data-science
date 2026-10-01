import { useMemo, type ReactNode } from 'react';
import { parseSummary, type SummaryPiece } from '../../lib/format/summary.ts';

function render(pieces: SummaryPiece[]): ReactNode[] {
  return pieces.map((piece, index) => {
    if (piece.kind === 'text') return piece.value;
    const Tag = piece.kind;
    return <Tag key={index}>{render(piece.children)}</Tag>;
  });
}

/** Concept summary with its powers and indices typeset. */
export function SummaryText({ text }: { text: string }) {
  const nodes = useMemo(() => render(parseSummary(text)), [text]);
  return <>{nodes}</>;
}
