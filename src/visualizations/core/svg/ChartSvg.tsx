import type { ReactNode } from 'react';
import { useResponsiveSize } from '../useResponsiveSize.ts';
import { DEFAULT_MARGINS, type ChartBox, type Margins } from './chartBox.ts';

interface ChartSvgProps {
  /** Height as a fraction of the width, clamped by minHeight and maxHeight. */
  aspect?: number;
  minHeight?: number;
  maxHeight?: number;
  margins?: Partial<Margins>;
  label: string;
  /**
   * Set when the chart contains focusable elements: an image role would hide
   * them from assistive technology, so the root becomes a labelled group.
   */
  interactive?: boolean;
  children: (box: ChartBox) => ReactNode;
  onPointerDown?: React.PointerEventHandler<SVGSVGElement>;
}

/**
 * Responsive SVG root for charts. It measures the available width and passes
 * the drawing box to its children, so every chart is sized in real pixels and
 * text never scales with the viewport.
 */
export function ChartSvg({
  aspect = 0.6,
  minHeight = 240,
  maxHeight = 520,
  margins,
  label,
  interactive = false,
  children,
  onPointerDown,
}: ChartSvgProps) {
  const [ref, size] = useResponsiveSize<HTMLDivElement>();
  const width = Math.max(0, size.width);
  const height = Math.round(Math.min(maxHeight, Math.max(minHeight, width * aspect)));
  const m = { ...DEFAULT_MARGINS, ...margins };
  const box: ChartBox = {
    width,
    height,
    inner: {
      left: m.left,
      top: m.top,
      width: Math.max(0, width - m.left - m.right),
      height: Math.max(0, height - m.top - m.bottom),
    },
  };
  return (
    <div ref={ref} style={{ width: '100%' }}>
      {width > 0 && (
        <svg
          data-viz=""
          width={width}
          height={height}
          role={interactive ? 'group' : 'img'}
          aria-label={label}
          onPointerDown={onPointerDown}
        >
          {children(box)}
        </svg>
      )}
    </div>
  );
}
