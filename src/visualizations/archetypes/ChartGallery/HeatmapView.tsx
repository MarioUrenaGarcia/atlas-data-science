import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';
import { PALETTE_NAMES, paletteColor, toDeuteranopia, toGray, type PaletteId } from './palettes.ts';

const ROWS_PER_SECOND = 3;
const LEGEND_STEPS = 40;
const LEGEND_HEIGHT = 14;
const LABEL_LEFT = 90;
const LABEL_TOP = 30;
const LEGEND_SPACE = 46;

interface HeatmapViewProps {
  title: string;
  rows: readonly string[];
  columns: readonly string[];
  values: readonly (readonly number[])[];
  palette: PaletteId;
  center?: number;
  variable: string;
  comparePalettes: boolean;
}

/**
 * A matrix of values encoded by color, revealed row by row. The palette and
 * a grayscale check show how the color choice changes what the eye reads.
 */
export function HeatmapView({
  title,
  rows,
  columns,
  values,
  palette: palette0,
  center,
  variable,
  comparePalettes,
}: HeatmapViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(comparePalettes
        ? [
            {
              type: 'select' as const,
              key: 'paleta',
              label: 'Paleta',
              options: (Object.keys(PALETTE_NAMES) as PaletteId[]).map((value) => ({
                value,
                label: PALETTE_NAMES[value],
              })),
              default: palette0,
            },
          ]
        : []),
      {
        type: 'select',
        key: 'vision',
        label: 'Ver como',
        options: [
          { value: 'normal', label: 'Visión de color típica' },
          { value: 'grises', label: 'Escala de grises (impresión)' },
          { value: 'deuteranopia', label: 'Deuteranopía (daltonismo rojo y verde)' },
        ],
        default: 'normal',
      },
      { type: 'toggle', key: 'numeros', label: 'Mostrar los valores', default: false },
    ],
    [comparePalettes, palette0],
  );
  const parameters = useParameters(definitions);
  const palette = (comparePalettes ? String(parameters.values.paleta) : palette0) as PaletteId;
  const vision = String(parameters.values.vision);
  const showNumbers = Boolean(parameters.values.numeros);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? rows.length : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(rows.length, v + 1)),
    reset: () => setShown(1),
    rate: ROWS_PER_SECOND,
    done: shown >= rows.length,
  });
  const all = values.flat();
  const min = Math.min(...all);
  const max = Math.max(...all);
  const mid = center ?? (min + max) / 2;
  const color = (v: number) => {
    const c = paletteColor(palette, v, min, max, mid);
    return vision === 'grises' ? toGray(c) : vision === 'deuteranopia' ? toDeuteranopia(c) : c;
  };
  let maxCell = { i: 0, j: 0, v: -Infinity };
  values.forEach((row, i) =>
    row.forEach((v, j) => (v > maxCell.v ? (maxCell = { i, j, v }) : null)),
  );
  const header = `\\text{${PALETTE_NAMES[palette].split(' (')[0]}: } ${formatNumber(min, 1)} \\le \\text{${variable.toLowerCase()}} \\le ${formatNumber(max, 1)}${palette === 'divergente' ? `,\\ \\text{centro en } ${formatNumber(mid, 1)}` : ''}`;
  const description =
    `Mapa de calor de ${variable} con ${rows.length} filas y ${columns.length} columnas, paleta ${PALETTE_NAMES[palette].toLowerCase()}. ` +
    `Valor mínimo ${formatNumber(min, 1)}, máximo ${formatNumber(max, 1)} en ${rows[maxCell.i]} y ${columns[maxCell.j]}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Filas dibujadas', value: `${shown} de ${rows.length}` },
        { label: 'Mínimo', value: formatNumber(min, 2) },
        { label: 'Máximo', value: formatNumber(max, 2) },
        { label: 'Celda máxima', value: `${rows[maxCell.i]}, ${columns[maxCell.j]}` },
      ]}
      description={description}
      dataTable={{
        caption: variable,
        columns: ['', ...columns],
        rows: rows.map((r, i) => [r, ...(values[i] ?? []).map((v) => formatNumber(v, 1))]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={(rows.length / Math.max(columns.length, 1)) * 0.9 + 0.15}
        minHeight={220}
        maxHeight={560}
        margins={{ top: LABEL_TOP, right: 12, bottom: LEGEND_SPACE, left: LABEL_LEFT }}
      >
        {(box) => {
          const cw = box.inner.width / columns.length;
          const ch = box.inner.height / rows.length;
          const legendY = box.inner.top + box.inner.height + 14;
          return (
            <g>
              {columns.map((c, j) =>
                columns.length <= 16 || j % Math.ceil(columns.length / 12) === 0 ? (
                  <text
                    key={c}
                    x={box.inner.left + (j + 0.5) * cw}
                    y={box.inner.top - 8}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {c}
                  </text>
                ) : null,
              )}
              {rows.map((r, i) => (
                <text
                  key={r}
                  x={box.inner.left - 8}
                  y={box.inner.top + (i + 0.5) * ch}
                  dy="0.32em"
                  textAnchor="end"
                  className={styles.chartLabel}
                >
                  {r}
                </text>
              ))}
              <g aria-hidden="true">
                {values.slice(0, shown).map((row, i) =>
                  row.map((v, j) => (
                    <g key={`${i}-${j}`}>
                      <rect
                        x={box.inner.left + j * cw}
                        y={box.inner.top + i * ch}
                        width={cw - 1}
                        height={ch - 1}
                        fill={color(v)}
                      />
                      {showNumbers && cw > 26 && (
                        <text
                          x={box.inner.left + (j + 0.5) * cw}
                          y={box.inner.top + (i + 0.5) * ch}
                          dy="0.32em"
                          textAnchor="middle"
                          fontSize={10}
                          fill={(v - min) / (max - min || 1) > 0.55 ? '#fff' : '#111'}
                        >
                          {formatNumber(v, 0)}
                        </text>
                      )}
                    </g>
                  )),
                )}
                {Array.from({ length: LEGEND_STEPS }, (_, k) => {
                  const v = min + ((max - min) * k) / (LEGEND_STEPS - 1);
                  const w = box.inner.width / LEGEND_STEPS;
                  return (
                    <rect
                      key={k}
                      x={box.inner.left + k * w}
                      y={legendY}
                      width={w + 0.5}
                      height={LEGEND_HEIGHT}
                      fill={color(v)}
                    />
                  );
                })}
                <text
                  x={box.inner.left}
                  y={legendY + LEGEND_HEIGHT + 13}
                  className={styles.chartLabel}
                >
                  {formatNumber(min, 1)}
                </text>
                <text
                  x={box.inner.left + box.inner.width}
                  y={legendY + LEGEND_HEIGHT + 13}
                  textAnchor="end"
                  className={styles.chartLabel}
                >
                  {formatNumber(max, 1)}
                </text>
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
