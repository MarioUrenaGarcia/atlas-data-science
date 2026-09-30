import type { CSSProperties } from 'react';
import { formatFraction } from '../../lib/format/number.ts';
import styles from './MatrixDisplay.module.css';

export type CellState = 'pivot' | 'changed' | 'filled' | 'active' | 'muted' | 'zero';

export interface HeatScale {
  /** Largest absolute value; entries are shaded in proportion to it. */
  max: number;
}

interface MatrixDisplayProps {
  matrix: readonly (readonly number[])[];
  /** Name shown before the matrix, such as A or L. */
  name?: string;
  /** Accessible description of the matrix. */
  label: string;
  format?: (value: number) => string;
  /** Column index before which a vertical bar separates an augmented part. */
  augmentedAt?: number;
  cellState?: (row: number, column: number) => CellState | undefined;
  /** Row labels such as R₁, R₂, shown at the left. */
  rowLabels?: readonly string[];
  rowState?: (row: number) => 'changed' | 'pivot' | undefined;
  /** Shades each entry by value: blue for positive and orange for negative. */
  heat?: HeatScale;
  /** Hides the numbers, useful for large heat maps. */
  hideValues?: boolean;
  compact?: boolean;
}

/**
 * A matrix drawn as a table between brackets. Cells can be highlighted to
 * follow an algorithm (pivots, rows that change, entries being filled) or
 * shaded by value to read the matrix as an image.
 */
export function MatrixDisplay({
  matrix,
  name,
  label,
  format = formatFraction,
  augmentedAt,
  cellState,
  rowLabels,
  rowState,
  heat,
  hideValues = false,
  compact = false,
}: MatrixDisplayProps) {
  const heatStyle = (value: number): CSSProperties | undefined => {
    if (!heat || heat.max <= 0) return undefined;
    const intensity = Math.min(1, Math.abs(value) / heat.max);
    const color = value >= 0 ? 'var(--data-1)' : 'var(--data-2)';
    return {
      background: `color-mix(in srgb, ${color} ${Math.round(intensity * 85)}%, transparent)`,
    };
  };
  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
      {name && (
        <span className={styles.name} aria-hidden="true">
          {name} =
        </span>
      )}
      <table className={styles.matrix}>
        <caption className="visually-hidden">{label}</caption>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className={rowState?.(i) ? styles[`row-${rowState(i)}`] : undefined}>
              {rowLabels && (
                <th scope="row" className={styles.rowLabel}>
                  {rowLabels[i]}
                </th>
              )}
              {row.map((value, j) => {
                const state = cellState?.(i, j);
                return (
                  <td
                    key={j}
                    className={[
                      styles.cell,
                      state ? styles[state] : '',
                      augmentedAt === j ? styles.augmented : '',
                      heat ? styles.heat : '',
                    ].join(' ')}
                    style={heatStyle(value)}
                  >
                    {hideValues ? (
                      <span className="visually-hidden">{format(value)}</span>
                    ) : (
                      format(value)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
