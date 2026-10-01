import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean } from '../../../lib/stats/index.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const ROWS_PER_SECOND = 8;
const DIM_OPACITY = 0.08;

interface ParallelViewProps {
  title: string;
  variables: readonly string[];
  rows: readonly { grupo: string; valores: readonly number[] }[];
}

/**
 * Each observation is a polyline that crosses one vertical axis per variable.
 * Groups form bundles; lines that cross between neighboring axes reveal
 * negative associations. A group can be highlighted.
 */
export function ParallelView({ title, variables, rows }: ParallelViewProps) {
  const groups = useMemo(() => [...new Set(rows.map((r) => r.grupo))], [rows]);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'resaltar',
        label: 'Resaltar grupo',
        options: [
          { value: 'todos', label: 'Todos' },
          ...groups.map((g) => ({ value: g, label: g })),
        ],
        default: 'todos',
      },
    ],
    [groups],
  );
  const parameters = useParameters(definitions);
  const highlight = String(parameters.values.resaltar);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? rows.length : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(rows.length, v + 1)),
    reset: () => setShown(1),
    rate: ROWS_PER_SECOND,
    done: shown >= rows.length,
  });
  const ranges = variables.map((_, j) => {
    const col = rows.map((r) => r.valores[j] ?? 0);
    return [Math.min(...col), Math.max(...col)] as [number, number];
  });
  const groupMeans = groups.map((g) =>
    variables.map((_, j) => mean(rows.filter((r) => r.grupo === g).map((r) => r.valores[j] ?? 0))),
  );
  const last = rows[shown - 1];
  const header = last
    ? `\\text{${last.grupo}: } ${last.valores.map((v, j) => `\\text{${variables[j]}} = ${formatNumber(v, 1)}`).join(',\\ ')}`
    : '';
  const description =
    `Coordenadas paralelas de ${shown} observaciones en ${variables.length} variables. ` +
    groups
      .map((g, i) => `Medias de ${g}: ${groupMeans[i]?.map((v) => formatNumber(v, 1)).join(', ')}`)
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Observaciones dibujadas', value: `${shown} de ${rows.length}` },
        ...groups.map((g, i) => ({
          label: `${g}, número de observaciones`,
          value: String(rows.filter((r) => r.grupo === g).length),
          color: seriesColor(i),
        })),
      ]}
      legend={groups.map((g, i) => ({ label: g, color: seriesColor(i), shape: 'line' as const }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 28, right: 30, bottom: 30, left: 30 }}
      >
        {(box) => {
          const xs = variables.map(
            (_, j) => box.inner.left + (box.inner.width * j) / (variables.length - 1),
          );
          const ys = ranges.map(([lo, hi]) =>
            scaleLinear()
              .domain([lo, hi])
              .range([box.inner.top + box.inner.height, box.inner.top]),
          );
          return (
            <g>
              {variables.map((v, j) => (
                <g key={v}>
                  <line
                    x1={xs[j]}
                    x2={xs[j]}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke="var(--data-axis)"
                    strokeWidth={1.5}
                  />
                  <text
                    x={xs[j]}
                    y={box.inner.top - 10}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {v}
                  </text>
                  <text
                    x={xs[j]}
                    y={box.inner.top + box.inner.height + 16}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {formatNumber(ranges[j]?.[0] ?? 0, 1)}
                  </text>
                  <text x={(xs[j] ?? 0) + 4} y={box.inner.top + 4} className={styles.chartLabel}>
                    {formatNumber(ranges[j]?.[1] ?? 0, 1)}
                  </text>
                </g>
              ))}
              <g aria-hidden="true">
                {rows.slice(0, shown).map((r, i) => {
                  const gi = groups.indexOf(r.grupo);
                  const dim = highlight !== 'todos' && r.grupo !== highlight;
                  return (
                    <polyline
                      key={i}
                      points={r.valores.map((v, j) => `${xs[j]},${ys[j]?.(v) ?? 0}`).join(' ')}
                      fill="none"
                      stroke={seriesColor(gi)}
                      strokeOpacity={dim ? DIM_OPACITY : 0.65}
                      strokeWidth={i === shown - 1 ? 3 : 1.5}
                    />
                  );
                })}
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
