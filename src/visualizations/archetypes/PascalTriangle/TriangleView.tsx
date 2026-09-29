import { useMemo, useState } from 'react';
import { pascalRows } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PascalTriangle.module.css';

const CELLS_PER_SECOND = 4;
/** Cells narrower than this show color only, without their number. */
const MIN_LABEL_WIDTH = 26;

interface TriangleViewProps {
  title: string;
  rows: number;
  modulus?: number;
}

/**
 * Pascal's triangle built cell by cell: each entry is the sum of the two
 * above it. Coloring by remainder reveals the self-similar pattern that
 * appears modulo a prime.
 */
export function TriangleView({ title, rows, modulus }: TriangleViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'filas',
        label: 'Filas',
        symbol: 'n',
        min: 2,
        max: 16,
        step: 1,
        default: rows,
      },
      {
        type: 'toggle' as const,
        key: 'residuo',
        label: 'Colorear por residuo',
        default: modulus !== undefined,
      },
      {
        type: 'number' as const,
        key: 'm',
        label: 'Residuo módulo',
        symbol: 'm',
        min: 2,
        max: 7,
        step: 1,
        default: modulus ?? 2,
      },
    ],
    [rows, modulus],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const lastRow = Number(values.filas) - 1;
  const byRemainder = Boolean(values.residuo);
  const m = Number(values.m);
  const triangle = pascalRows(lastRow);
  const cells = triangle.flatMap((row, n) => row.map((value, k) => ({ n, k, value })));
  const total = cells.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${lastRow}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: CELLS_PER_SECOND * Math.max(1, lastRow / 6),
    done: shown >= total,
  });
  const current = shown > 0 ? cells[shown - 1] : undefined;
  const above = (n: number, k: number) => triangle[n - 1]?.[k] ?? 0;
  const currentText = current
    ? current.n === 0 || current.k === 0 || current.k === current.n
      ? `C(${current.n}, ${current.k}) = 1, borde del triángulo`
      : `C(${current.n}, ${current.k}) = ${above(current.n, current.k - 1)} + ${above(current.n, current.k)} = ${current.value}`
    : 'sin celdas todavía';
  const description = `Triángulo de Pascal con ${lastRow + 1} filas. ${currentText}.${byRemainder ? ` Colores según el residuo módulo ${m}.` : ''}`;
  const rowSum = current ? 2 ** current.n : 1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values, disabled: byRemainder ? [] : ['m'] }}
      readouts={[
        { label: 'Celda actual', value: currentText, color: DATA_COLORS.highlight },
        { label: 'Suma de su fila', value: current ? `2^${current.n} = ${rowSum}` : '1' },
        { label: 'Celdas construidas', value: `${shown} de ${total}` },
      ]}
      legend={
        byRemainder
          ? Array.from({ length: m }, (_, remainder) => ({
              label: `residuo ${remainder}`,
              color: remainder === 0 ? 'var(--color-surface-2)' : seriesColor(remainder - 1),
            }))
          : undefined
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex="\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}" />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={520}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const size = Math.min(box.inner.width / (lastRow + 1), box.inner.height / (lastRow + 1));
          const cx = box.inner.left + box.inner.width / 2;
          const position = (n: number, k: number) => ({
            x: cx + (k - n / 2) * size,
            y: box.inner.top + n * size + size / 2,
          });
          const parents =
            current && current.n > 0
              ? [current.k - 1, current.k].filter((k) => k >= 0 && k <= current.n - 1)
              : [];
          return (
            <g aria-hidden="true">
              {cells.map((cell, index) => {
                const visible = index < shown;
                const { x, y } = position(cell.n, cell.k);
                const remainder = cell.value % m;
                const fill = byRemainder
                  ? remainder === 0
                    ? 'var(--color-surface-2)'
                    : seriesColor(remainder - 1)
                  : 'var(--color-surface)';
                const isCurrent = index === shown - 1;
                const isParent =
                  current !== undefined && cell.n === current.n - 1 && parents.includes(cell.k);
                return (
                  <g key={`${cell.n}-${cell.k}`} opacity={visible ? 1 : 0.12}>
                    <rect
                      x={x - size / 2 + 1}
                      y={y - size / 2 + 1}
                      width={size - 2}
                      height={size - 2}
                      rx={Math.min(6, size / 5)}
                      fill={isCurrent ? DATA_COLORS.highlight : fill}
                      fillOpacity={
                        byRemainder && remainder !== 0 && !isCurrent ? 0.55 : isCurrent ? 0.45 : 1
                      }
                      stroke={isParent ? DATA_COLORS.primary : 'var(--color-border)'}
                      strokeWidth={isParent ? 3 : 1}
                    />
                    {size >= MIN_LABEL_WIDTH && (
                      <text
                        x={x}
                        y={y}
                        dy="0.35em"
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: Math.min(14, size / 3) }}
                      >
                        {cell.value}
                      </text>
                    )}
                  </g>
                );
              })}
              {current &&
                parents.map((k) => {
                  const from = position(current.n - 1, k);
                  const to = position(current.n, current.k);
                  return (
                    <line
                      key={k}
                      x1={from.x}
                      y1={from.y + size / 4}
                      x2={to.x}
                      y2={to.y - size / 4}
                      stroke={DATA_COLORS.primary}
                      strokeWidth={2}
                    />
                  );
                })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
