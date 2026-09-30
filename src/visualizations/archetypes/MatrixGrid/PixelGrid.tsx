import type { Matrix } from '../../../lib/linalg/index.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

interface PixelGridProps {
  matrix: Matrix;
  label: string;
}

/** Matrix with entries in [0, 1] drawn as gray pixels. */
export function PixelGrid({ matrix, label }: PixelGridProps) {
  return (
    <ChartSvg
      label={label}
      aspect={1}
      minHeight={160}
      maxHeight={260}
      margins={{ top: 4, right: 4, bottom: 4, left: 4 }}
    >
      {(box) => {
        const side = Math.min(box.inner.width, box.inner.height);
        const cell = side / Math.max(1, matrix.length);
        const left = box.inner.left + (box.inner.width - side) / 2;
        return (
          <g aria-hidden="true">
            <rect
              x={left}
              y={box.inner.top}
              width={side}
              height={side}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
            />
            {matrix.flatMap((row, i) =>
              row.map((value, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={left + j * cell}
                  y={box.inner.top + i * cell}
                  width={cell + 0.3}
                  height={cell + 0.3}
                  fill="var(--color-text)"
                  fillOpacity={Math.max(0, Math.min(1, value))}
                />
              )),
            )}
          </g>
        );
      }}
    </ChartSvg>
  );
}
