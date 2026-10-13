import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { histogram, pearson } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const CELLS_PER_SECOND = 3;
const GAP = 6;
const LABEL_SPACE = 22;
const DOT = 2;
const BINS = 10;

interface SplomViewProps {
  title: string;
  variables: readonly { nombre: string; valores: readonly number[] }[];
  groups?: readonly number[];
  groupNames?: readonly string[];
}

/**
 * Every pair of variables in a grid of small scatter plots, with the
 * histogram of each variable on the diagonal. Cells are drawn one at a time.
 */
export function SplomView({ title, variables, groups, groupNames }: SplomViewProps) {
  const p = variables.length;
  const total = p * p;
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? total : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(total, v + 1)),
    reset: () => setShown(1),
    rate: CELLS_PER_SECOND,
    done: shown >= total,
  });
  const current = shown - 1;
  const ci = Math.floor(current / p);
  const cj = current % p;
  const rowVar = variables[ci];
  const colVar = variables[cj];
  const header =
    ci === cj
      ? `\\text{diagonal: histograma de ${rowVar?.nombre ?? ''}}`
      : `r(\\text{${rowVar?.nombre ?? ''}}, \\text{${colVar?.nombre ?? ''}}) = ${formatNumber(pearson(colVar?.valores ?? [], rowVar?.valores ?? []), 3)}`;
  const description =
    `Matriz de diagramas de dispersión de ${p} variables. ` +
    variables
      .flatMap((a, i) =>
        variables
          .slice(i + 1)
          .map(
            (b) =>
              `${a.nombre} y ${b.nombre}: r = ${formatNumber(pearson(a.valores, b.valores), 2)}`,
          ),
      )
      .join('; ') +
    '.';
  const domains = variables.map((v) => {
    const lo = Math.min(...v.valores);
    const hi = Math.max(...v.valores);
    const pad = (hi - lo) * 0.08 || 1;
    return [lo - pad, hi + pad] as [number, number];
  });

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Celdas dibujadas', value: `${shown} de ${total}` },
        ...variables.flatMap((a, i) =>
          variables.slice(i + 1).map((b) => ({
            label: `r de ${a.nombre} y ${b.nombre}`,
            value: formatNumber(pearson(a.valores, b.valores), 3),
          })),
        ),
      ]}
      legend={
        groupNames
          ? groupNames.map((name, k) => ({
              label: name,
              color: seriesColor(k),
              shape: 'circle' as const,
            }))
          : [{ label: 'Observación', color: DATA_COLORS.primary, shape: 'circle' }]
      }
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={1}
        minHeight={320}
        maxHeight={620}
        margins={{ top: LABEL_SPACE, right: 8, bottom: 8, left: LABEL_SPACE }}
      >
        {(box) => {
          const size = Math.min(box.inner.width, box.inner.height);
          const cell = (size - GAP * (p - 1)) / p;
          return (
            <g>
              {variables.map((v, k) => (
                <g key={v.nombre}>
                  <text
                    x={box.inner.left + k * (cell + GAP) + cell / 2}
                    y={box.inner.top - 8}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {v.nombre}
                  </text>
                  <text
                    transform={`translate(${box.inner.left - 8},${box.inner.top + k * (cell + GAP) + cell / 2}) rotate(-90)`}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {v.nombre}
                  </text>
                </g>
              ))}
              {Array.from({ length: shown }, (_, index) => {
                const i = Math.floor(index / p);
                const j = index % p;
                const left = box.inner.left + j * (cell + GAP);
                const top = box.inner.top + i * (cell + GAP);
                const sx = scaleLinear()
                  .domain(domains[j] ?? [0, 1])
                  .range([left, left + cell]);
                const sy = scaleLinear()
                  .domain(domains[i] ?? [0, 1])
                  .range([top + cell, top]);
                const active = index === current;
                return (
                  <g key={index} aria-hidden="true">
                    <rect
                      x={left}
                      y={top}
                      width={cell}
                      height={cell}
                      fill="none"
                      stroke={active ? DATA_COLORS.highlight : 'var(--color-border)'}
                      strokeWidth={active ? 2.5 : 1}
                    />
                    {i === j
                      ? (() => {
                          const bins = histogram(variables[i]?.valores ?? [], BINS, domains[i]);
                          const top2 = Math.max(1, ...bins.map((b) => b.count));
                          return bins.map((b, k) => (
                            <rect
                              key={k}
                              x={sx(b.x0)}
                              y={top + cell - (cell * 0.9 * b.count) / top2}
                              width={Math.max(0, sx(b.x1) - sx(b.x0) - 1)}
                              height={(cell * 0.9 * b.count) / top2}
                              fill={DATA_COLORS.tertiary}
                              fillOpacity={0.7}
                            />
                          ));
                        })()
                      : (variables[j]?.valores ?? []).map((xv, k) => (
                          <circle
                            key={k}
                            cx={sx(xv)}
                            cy={sy(variables[i]?.valores[k] ?? 0)}
                            r={DOT}
                            fill={groups ? seriesColor(groups[k] ?? 0) : DATA_COLORS.primary}
                            fillOpacity={0.7}
                          />
                        ))}
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
