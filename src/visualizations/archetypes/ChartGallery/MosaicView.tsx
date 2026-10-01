import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { contingencySummary } from '../../../lib/stats/association.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const GAP = 4;
const STAGES_PER_SECOND = 0.8;

interface MosaicViewProps {
  title: string;
  rows: { nombre: string; categorias: readonly string[] };
  columns: { nombre: string; categorias: readonly string[] };
  counts: readonly (readonly number[])[];
}

/**
 * A mosaic plot: the width of each column is the share of a row category and
 * the heights inside it are the conditional shares of the other variable, so
 * every rectangle's area is proportional to its count. Without association,
 * all columns would be cut at the same heights.
 */
export function MosaicView({ title, rows, columns, counts }: MosaicViewProps) {
  const summary = contingencySummary(counts);
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(reducedMotion ? 2 : 0);
  const playback = usePlayback({
    step: () => setStage((v) => Math.min(2, v + 1)),
    reset: () => setStage(0),
    rate: STAGES_PER_SECOND,
    done: stage >= 2,
  });
  const n = summary.total;
  const f = (v: number) => formatNumber(v, 1);
  const header = [
    `\\text{anchos: } ${rows.categorias.map((_, i) => `\\frac{${summary.rowTotals[i]}}{${n}}`).join(',\\ ')}`,
    `\\text{alturas: proporciones de ${columns.nombre.toLowerCase()} dentro de cada categoría de ${rows.nombre.toLowerCase()}}`,
    `\\text{líneas: cortes esperados sin asociación};\\ V = ${formatNumber(summary.cramersV, 3)}`,
  ][stage];
  const description =
    `Mosaico de ${rows.nombre} por ${columns.nombre} con ${n} observaciones. ` +
    rows.categorias
      .map(
        (c, i) =>
          `${c}: ` +
          columns.categorias
            .map(
              (d, j) => `${d} ${f((100 * (counts[i]?.[j] ?? 0)) / (summary.rowTotals[i] || 1))} %`,
            )
            .join(', '),
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Observaciones', value: String(n) },
        ...rows.categorias.map((c, i) => ({
          label: `Ancho de ${c}`,
          value: `${f((100 * (summary.rowTotals[i] ?? 0)) / n)} %`,
        })),
        { label: 'V de Cramér', value: formatNumber(summary.cramersV, 3) },
      ]}
      legend={columns.categorias.map((c, j) => ({
        label: `${columns.nombre}: ${c}`,
        color: seriesColor(j),
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header ?? ''} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 10, right: 10, bottom: 34, left: 10 }}
      >
        {(box) => {
          const usable = box.inner.width - GAP * (rows.categorias.length - 1);
          const usableH = box.inner.height - GAP * (columns.categorias.length - 1);
          const overall = summary.columnTotals.map((c) => c / n);
          let left = box.inner.left;
          return (
            <g>
              {rows.categorias.map((cat, i) => {
                const width = (usable * (summary.rowTotals[i] ?? 0)) / n;
                const x0 = left;
                left += width + GAP;
                let top = box.inner.top;
                return (
                  <g key={cat}>
                    <text
                      x={x0 + width / 2}
                      y={box.inner.top + box.inner.height + 18}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {cat}
                    </text>
                    {columns.categorias.map((col, j) => {
                      const share =
                        stage >= 1
                          ? (counts[i]?.[j] ?? 0) / (summary.rowTotals[i] || 1)
                          : 1 / columns.categorias.length;
                      const h = usableH * share;
                      const y0 = top;
                      top += h + GAP;
                      return (
                        <rect
                          key={col}
                          x={x0}
                          y={y0}
                          width={Math.max(0, width)}
                          height={Math.max(0, h)}
                          fill={seriesColor(j)}
                          fillOpacity={stage >= 1 ? 0.85 : 0.25}
                          aria-hidden="true"
                        />
                      );
                    })}
                    {stage >= 2 &&
                      overall.slice(0, -1).map((_, j) => {
                        const y =
                          box.inner.top +
                          overall.slice(0, j + 1).reduce((a, b) => a + b, 0) * usableH +
                          GAP * (j + 0.5);
                        return (
                          <line
                            key={j}
                            x1={x0}
                            x2={x0 + width}
                            y1={y}
                            y2={y}
                            stroke="var(--color-text)"
                            strokeDasharray="4 3"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        );
                      })}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
