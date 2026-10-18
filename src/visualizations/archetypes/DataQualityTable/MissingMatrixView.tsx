import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { missingPatterns } from '../../../lib/stats/eda.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Column } from './columns.ts';
import styles from './DataQualityTable.module.css';

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const HEADER = 34;
const PRESENT_OPACITY = 0.35;

export type Order = 'original' | 'patron' | 'primera';

interface MissingMatrixViewProps {
  title: string;
  columns: Column[];
  order: Order;
}

/**
 * One row per record and one column per variable, with missing cells
 * marked. Sorting the rows by their missing pattern, or by the first
 * column, reveals whether the gaps are scattered or concentrated.
 */
export function MissingMatrixView({ title, columns, order: order0 }: MissingMatrixViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'orden',
        label: 'Orden de las filas',
        options: [
          { value: 'original', label: 'Orden original' },
          { value: 'patron', label: 'Agrupar por patrón de faltantes' },
          { value: 'primera', label: `Ordenar por ${columns[0]?.nombre ?? 'la primera columna'}` },
        ],
        default: order0,
      },
    ],
    [columns, order0],
  );
  const parameters = useParameters(definitions);
  const order = String(parameters.values.orden) as Order;
  const n = columns[0]?.valores.length ?? 0;
  const rows = useMemo(
    () => Array.from({ length: n }, (_, r) => columns.map((c) => c.valores[r] ?? null)),
    [columns, n],
  );
  const indices = useMemo(() => {
    const idx = rows.map((_, i) => i);
    if (order === 'patron') {
      const key = (i: number) => (rows[i] ?? []).map((c) => (c === null ? '1' : '0')).join('');
      return idx.sort((a, b) => key(a).localeCompare(key(b)) || a - b);
    }
    if (order === 'primera') {
      return idx.sort((a, b) => String(rows[a]?.[0]).localeCompare(String(rows[b]?.[0])) || a - b);
    }
    return idx;
  }, [rows, order]);
  const patterns = useMemo(() => missingPatterns(rows), [rows]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const visibleRows = Math.round((n * shown) / BATCHES);
  const visible = indices.slice(0, visibleRows);
  const missingByColumn = columns.map(
    (_, j) => visible.filter((i) => rows[i]?.[j] === null).length,
  );
  const complete = visible.filter((i) => (rows[i] ?? []).every((c) => c !== null)).length;
  const header = `\\text{filas completas} = ${complete} \\text{ de } ${visible.length},\\quad ${patterns.length}\\ \\text{patrones distintos}`;
  const description =
    `Matriz de faltantes con ${visible.length} de ${n} filas y ${columns.length} columnas, ${order === 'original' ? 'en el orden original' : order === 'patron' ? 'agrupadas por patrón' : `ordenadas por ${columns[0]?.nombre ?? ''}`}. ` +
    columns.map((c, j) => `${c.nombre}: ${missingByColumn[j]} faltantes`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        ...columns.map((c, j) => ({
          label: `${c.nombre}, faltantes`,
          value: `${formatNumber(visible.length ? (100 * (missingByColumn[j] ?? 0)) / visible.length : 0, 1)} %`,
        })),
        {
          label: 'Patrones distintos',
          value: String(patterns.length),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Valor presente', color: DATA_COLORS.neutral },
        { label: 'Valor faltante', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={300}
        maxHeight={480}
        margins={{ top: HEADER, right: 12, bottom: 8, left: 12 }}
      >
        {(box) => {
          const cw = box.inner.width / columns.length;
          const rh = box.inner.height / Math.max(1, n);
          return (
            <g>
              {columns.map((c, j) => (
                <text
                  key={c.nombre}
                  x={box.inner.left + cw * (j + 0.5)}
                  y={box.inner.top - 10}
                  textAnchor="middle"
                  className={styles.chartLabel}
                >
                  {c.nombre}
                </text>
              ))}
              <g aria-hidden="true">
                {visible.map((i, r) =>
                  columns.map((_, j) => (
                    <rect
                      key={`${i}-${j}`}
                      x={box.inner.left + cw * j + 1}
                      y={box.inner.top + r * rh}
                      width={cw - 2}
                      height={Math.max(1, rh)}
                      fill={rows[i]?.[j] === null ? DATA_COLORS.secondary : DATA_COLORS.neutral}
                      fillOpacity={rows[i]?.[j] === null ? 1 : PRESENT_OPACITY}
                    />
                  )),
                )}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
