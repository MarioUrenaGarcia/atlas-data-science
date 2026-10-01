import { useMemo, useState } from 'react';
import { formatNumber, formatPercent } from '../../../lib/format/number.ts';
import { toCompressedRows, type Matrix } from '../../../lib/linalg/index.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MatrixGrid.module.css';

type Pattern = 'tridiagonal' | 'banda' | 'aleatoria' | 'rejilla';

const SIZE = 30;
const GRID_COLUMNS = 6;
const BANDWIDTH = 3;
const RANDOM_DENSITY = 0.05;
const ROWS_PER_SECOND = 4;

const PATTERNS: { value: Pattern; label: string }[] = [
  { value: 'tridiagonal', label: 'Tridiagonal (diferencias finitas)' },
  { value: 'banda', label: 'Banda de ancho 3' },
  { value: 'rejilla', label: 'Vecinos en una rejilla de 5 por 6' },
  { value: 'aleatoria', label: 'Aleatoria (5 % de entradas)' },
];

function buildPattern(pattern: Pattern, seed: number): Matrix {
  const random = new Random(seed);
  return Array.from({ length: SIZE }, (_, i) =>
    Array.from({ length: SIZE }, (_, j) => {
      const distance = Math.abs(i - j);
      switch (pattern) {
        case 'tridiagonal':
          return distance === 0 ? 2 : distance === 1 ? -1 : 0;
        case 'banda':
          return distance <= BANDWIDTH ? BANDWIDTH + 1 - distance : 0;
        case 'rejilla': {
          const sameRow = Math.floor(i / GRID_COLUMNS) === Math.floor(j / GRID_COLUMNS);
          const neighbor = (distance === 1 && sameRow) || distance === GRID_COLUMNS;
          return i === j ? 4 : neighbor ? -1 : 0;
        }
        case 'aleatoria':
          return i === j ? 1 : random.uniform() < RANDOM_DENSITY ? 1 : 0;
      }
    }),
  );
}

interface SparseViewProps {
  title: string;
  conceptId: string;
  initialPattern: Pattern;
}

/**
 * A sparse matrix drawn as its pattern of nonzeros. The product with a vector
 * is swept row by row: only the marked entries do any work, so the cost and
 * the memory are proportional to the number of nonzeros instead of n².
 */
export function SparseView({ title, conceptId, initialPattern }: SparseViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'patron',
        label: 'Patrón',
        options: PATTERNS,
        default: initialPattern,
      },
    ],
    [initialPattern],
  );
  const parameters = useParameters(definitions);
  const pattern = (parameters.values as Record<string, Pattern>).patron ?? initialPattern;
  const seed = useSeed(defaultSeed(conceptId));
  const matrix = useMemo(() => buildPattern(pattern, seed.seed), [pattern, seed.seed]);
  const csr = useMemo(() => toCompressedRows(matrix), [matrix]);
  const nonzeros = csr.values.length;
  const [run, setRun] = useState(0);
  const [row, setRow] = useResettableState(`${pattern}|${seed.seed}|${run}`, () => -1);
  const playback = usePlayback({
    step: () => setRow((value) => Math.min(SIZE - 1, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ROWS_PER_SECOND,
    done: row >= SIZE - 1,
  });
  const operationsSoFar = row < 0 ? 0 : (csr.rowPointers[row + 1] ?? 0);
  const rowStart = row < 0 ? 0 : (csr.rowPointers[row] ?? 0);
  const rowEnd = row < 0 ? 0 : (csr.rowPointers[row + 1] ?? 0);
  const denseStorage = SIZE * SIZE;
  const sparseStorage = 2 * nonzeros + SIZE + 1;
  const description =
    `Matriz de ${SIZE} por ${SIZE} con ${nonzeros} entradas distintas de cero (${formatPercent(nonzeros / denseStorage)}). ` +
    `Guardarla completa ocupa ${denseStorage} números; en formato de filas comprimidas, ${sparseStorage}.` +
    (row >= 0 ? ` Fila ${row + 1}: usa ${rowEnd - rowStart} multiplicaciones.` : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      seed={pattern === 'aleatoria' ? seed : undefined}
      readouts={[
        { label: 'Entradas distintas de cero', value: String(nonzeros) },
        { label: 'Densidad', value: formatPercent(nonzeros / denseStorage) },
        { label: 'Almacenamiento denso', value: `${denseStorage} números` },
        {
          label: 'Filas comprimidas (valores, columnas, punteros)',
          value: `${sparseStorage} números`,
        },
        {
          label: 'Multiplicaciones en A x hasta ahora',
          value: `${operationsSoFar} (denso: ${formatNumber((row + 1) * SIZE, 0)})`,
        },
      ]}
      legend={[
        { label: 'Entrada distinta de cero', color: DATA_COLORS.primary },
        { label: 'Fila en uso para A x', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`(\\mathbf{A}\\mathbf{x})_i = \\sum_{j:\\,a_{ij} \\neq 0} a_{ij}\\,x_j,\\qquad \\text{costo} \\propto \\operatorname{nnz}(\\mathbf{A}) = ${nonzeros}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={1}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const side = Math.min(box.inner.width, box.inner.height);
          const cell = side / SIZE;
          const left = box.inner.left + (box.inner.width - side) / 2;
          const top = box.inner.top;
          return (
            <g aria-hidden="true">
              <rect
                x={left}
                y={top}
                width={side}
                height={side}
                fill="none"
                stroke="var(--color-border-strong)"
              />
              {row >= 0 && (
                <rect
                  x={left}
                  y={top + row * cell}
                  width={side}
                  height={cell}
                  fill={DATA_COLORS.highlight}
                  fillOpacity={0.25}
                />
              )}
              {matrix.flatMap((values, i) =>
                values.map((value, j) =>
                  value === 0 ? null : (
                    <rect
                      key={`${i}-${j}`}
                      x={left + j * cell + 0.5}
                      y={top + i * cell + 0.5}
                      width={Math.max(1, cell - 1)}
                      height={Math.max(1, cell - 1)}
                      fill={i === row ? DATA_COLORS.highlight : DATA_COLORS.primary}
                    />
                  ),
                ),
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
