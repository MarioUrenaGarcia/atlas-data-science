import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { columnSums, rake, rowSums } from '../../../lib/sampling/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { RakingConfig } from './schema.ts';
import styles from './SamplingWeights.module.css';

const STEPS_PER_SECOND = 0.7;
const DEFAULT_ITERATIONS = 5;

function weightedMean(table: number[][], means: number[][] | undefined): number {
  if (!means) return Number.NaN;
  let numerator = 0;
  let denominator = 0;
  table.forEach((row, i) =>
    row.forEach((value, j) => {
      numerator += value * (means[i]?.[j] ?? 0);
      denominator += value;
    }),
  );
  return denominator === 0 ? Number.NaN : numerator / denominator;
}

/** Iterative proportional fitting of a two-way table to known row and column totals. */
export function RakingView({ config, title }: { config: RakingConfig; title: string }) {
  const iterations = config.iteraciones ?? DEFAULT_ITERATIONS;
  const steps = useMemo(
    () => rake(config.muestra, config.filas.objetivos, config.columnas.objetivos, iterations),
    [config.muestra, config.filas.objetivos, config.columnas.objetivos, iterations],
  );
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [index, update] = useResettableState(`${run}`, () =>
    reducedMotion ? steps.length - 1 : 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(steps.length - 1, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: index >= steps.length - 1,
  });
  const step = steps[index] ?? steps[0];
  const table = step?.table ?? [];
  const rows = rowSums(table);
  const columns = columnSums(table);
  const rowTargets = config.filas.objetivos;
  const columnTargets = config.columnas.objetivos;
  const previous = steps[Math.max(0, index - 1)]?.table ?? table;
  const prevRows = rowSums(previous);
  const prevColumns = columnSums(previous);
  const estimate = weightedMean(table, config.medias);
  const start = weightedMean(steps[0]?.table ?? table, config.medias);
  const f0 = (v: number) => formatNumber(v, 0);
  const header =
    step?.adjusted === 'filas'
      ? `w_{ij} \\leftarrow w_{ij}\\,\\frac{T_i}{\\sum_j w_{ij}}:\\quad ${rowTargets
          .slice(0, 3)
          .map(
            (t, i) =>
              `\\frac{${f0(t)}}{${f0(prevRows[i] ?? 0)}} = ${formatNumber(t / (prevRows[i] || 1), 3)}`,
          )
          .join(',\\ ')}`
      : step?.adjusted === 'columnas'
        ? `w_{ij} \\leftarrow w_{ij}\\,\\frac{C_j}{\\sum_i w_{ij}}:\\quad ${columnTargets
            .slice(0, 3)
            .map(
              (t, j) =>
                `\\frac{${f0(t)}}{${f0(prevColumns[j] ?? 0)}} = ${formatNumber(t / (prevColumns[j] || 1), 3)}`,
            )
            .join(',\\ ')}`
        : `w_{ij}^{(0)} = n_{ij}\\,\\frac{N}{n}\\quad\\text{(muestra escalada al total de la población)}`;
  const caption =
    step?.adjusted === 'filas'
      ? `Iteración ${step.iteration}: se ajustan las filas para que sumen sus totales conocidos`
      : step?.adjusted === 'columnas'
        ? `Iteración ${step.iteration}: se ajustan las columnas; las filas se desajustan un poco`
        : 'Punto de partida: los conteos de la muestra llevados al tamaño de la población';
  const description =
    `Raking de una tabla de ${config.filas.nombre} por ${config.columnas.nombre}. Paso ${index} de ${steps.length - 1}; ` +
    `la mayor diferencia entre un margen y su total conocido es ${((step?.gap ?? 0) * 100).toFixed(2)} % de la población.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Iteración', value: String(step?.iteration ?? 0) },
        {
          label: 'Mayor desajuste de un margen',
          value: `${((step?.gap ?? 0) * 100).toFixed(2)} %`,
          color: DATA_COLORS.negative,
        },
        ...(config.medias
          ? [
              {
                label: `Media de ${config.variable ?? 'la variable'} al inicio`,
                value: `${formatNumber(start, 2)}${config.unidad ? ` ${config.unidad}` : ''}`,
              },
              {
                label: `Media de ${config.variable ?? 'la variable'} ponderada`,
                value: `${formatNumber(estimate, 2)}${config.unidad ? ` ${config.unidad}` : ''}`,
                color: DATA_COLORS.primary,
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Peso total de cada celda', color: DATA_COLORS.primary },
        { label: 'Margen ajustado en este paso', color: DATA_COLORS.highlight },
        { label: 'Total conocido de la población', color: DATA_COLORS.positive },
      ]}
      description={description}
      dataTable={{
        caption: 'Pesos totales por celda en el paso actual',
        columns: [config.filas.nombre, ...config.columnas.categorias, 'Suma', 'Total conocido'],
        rows: [
          ...table.map((row, i) => [
            config.filas.categorias[i] ?? '',
            ...row.map((v) => f0(v)),
            f0(rows[i] ?? 0),
            f0(rowTargets[i] ?? 0),
          ]),
          ['Suma', ...columns.map(f0), '', ''],
          ['Total conocido', ...columnTargets.map(f0), '', ''],
        ],
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.caption}>{caption}</p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={360}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const R = table.length;
          const C = table[0]?.length ?? 0;
          const labelWidth = Math.min(110, box.inner.width * 0.22);
          const cellW = (box.inner.width - labelWidth) / (C + 2);
          const cellH = box.inner.height / (R + 3);
          const maxCell = Math.max(...table.flat());
          const rowsActive = step?.adjusted === 'filas';
          const columnsActive = step?.adjusted === 'columnas';
          const left = box.inner.left + labelWidth;
          const top = box.inner.top + cellH;
          const marginCell = (
            x: number,
            y: number,
            value: number,
            target: number,
            active: boolean,
            key: string,
          ) => {
            const off = Math.abs(value - target) / (target || 1) > 0.005;
            return (
              <g key={key}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cellW - 4}
                  height={cellH - 4}
                  rx={4}
                  fill={active ? DATA_COLORS.highlight : DATA_COLORS.neutral}
                  fillOpacity={active ? 0.3 : 0.1}
                  stroke={off ? DATA_COLORS.negative : DATA_COLORS.positive}
                  strokeWidth={1.5}
                />
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.cell}
                >
                  {f0(value)}
                </text>
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.target}
                >
                  {`meta ${f0(target)}`}
                </text>
              </g>
            );
          };
          return (
            <g>
              {config.columnas.categorias.map((name, j) => (
                <text
                  key={j}
                  x={left + cellW * (j + 0.5)}
                  y={box.inner.top + cellH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.label}
                >
                  {name}
                </text>
              ))}
              <text
                x={left + cellW * (C + 0.5)}
                y={box.inner.top + cellH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.labelMuted}
              >
                suma
              </text>
              {table.map((row, i) => (
                <g key={i}>
                  <text
                    x={left - 8}
                    y={top + cellH * (i + 0.5)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className={styles.label}
                  >
                    {config.filas.categorias[i]}
                  </text>
                  {row.map((value, j) => (
                    <g key={j}>
                      <rect
                        x={left + cellW * j + 2}
                        y={top + cellH * i + 2}
                        width={cellW - 4}
                        height={cellH - 4}
                        rx={4}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.1 + 0.6 * (value / maxCell)}
                      />
                      <text
                        x={left + cellW * (j + 0.5)}
                        y={top + cellH * (i + 0.5)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={styles.cell}
                      >
                        {f0(value)}
                      </text>
                    </g>
                  ))}
                  {marginCell(
                    left + cellW * C,
                    top + cellH * i,
                    rows[i] ?? 0,
                    rowTargets[i] ?? 0,
                    rowsActive,
                    `r${i}`,
                  )}
                </g>
              ))}
              <text
                x={left - 8}
                y={top + cellH * (R + 0.5)}
                textAnchor="end"
                dominantBaseline="middle"
                className={styles.labelMuted}
              >
                suma
              </text>
              {columns.map((value, j) =>
                marginCell(
                  left + cellW * j,
                  top + cellH * R,
                  value,
                  columnTargets[j] ?? 0,
                  columnsActive,
                  `c${j}`,
                ),
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
