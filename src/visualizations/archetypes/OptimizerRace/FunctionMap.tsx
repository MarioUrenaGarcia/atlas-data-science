import { useMemo, type ReactNode } from 'react';
import type { TestFunction } from '../../../lib/optimization/index.ts';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import type { MapScales } from '../../core/plane/EqualPlane.tsx';

interface FunctionMapProps {
  fn: TestFunction;
  label: string;
  highlight?: number | null;
  children?: (scales: MapScales) => ReactNode;
}

/**
 * Level curves of a test function. Levels are spaced on asinh(f), a
 * monotone rescaling that keeps the same curves but spreads them evenly
 * when values range over several orders of magnitude, as in Rosenbrock.
 */
export function FunctionMap({ fn, label, highlight = null, children }: FunctionMapProps) {
  const display = useMemo(() => (x: number, y: number) => Math.asinh(fn.f([x, y])), [fn]);
  const domain = useMemo(
    (): [[number, number], [number, number]] => [fn.domain.x, fn.domain.y],
    [fn],
  );
  return (
    <ContourMap f={display} domain={domain} label={label} highlight={highlight === null ? null : Math.asinh(highlight)}>
      {children}
    </ContourMap>
  );
}
