import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const CATEGORIES_PER_SECOND = 2;
const LABEL_WIDTH = 120;

interface BarsPieViewProps {
  title: string;
  categories: readonly string[];
  values: readonly number[];
  variable: string;
  view: 'barras' | 'pastel' | 'ambas';
  sort: boolean;
  horizontal: boolean;
}

function arc(cx: number, cy: number, r: number, start: number, end: number): string {
  const x0 = cx + r * Math.sin(start);
  const y0 = cy - r * Math.cos(start);
  const x1 = cx + r * Math.sin(end);
  const y1 = cy - r * Math.cos(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

/**
 * Category totals as bars and as a pie, appearing one category at a time. The
 * bars compare lengths on a common baseline; the pie compares angles.
 */
export function BarsPieView({
  title,
  categories,
  values,
  variable,
  view: view0,
  sort: sort0,
  horizontal,
}: BarsPieViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'vista',
        label: 'Gráfico',
        options: [
          { value: 'barras', label: 'Barras' },
          { value: 'pastel', label: 'Pastel' },
          { value: 'ambas', label: 'Ambos, lado a lado' },
        ],
        default: view0,
      },
      { type: 'toggle', key: 'ordenar', label: 'Ordenar de mayor a menor', default: sort0 },
    ],
    [view0, sort0],
  );
  const parameters = useParameters(definitions);
  const view = String(parameters.values.vista) as BarsPieViewProps['view'];
  const sort = Boolean(parameters.values.ordenar);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? categories.length : 1);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(categories.length, v + 1)),
    reset: () => setShown(1),
    rate: CATEGORIES_PER_SECOND,
    done: shown >= categories.length,
  });
  const items = categories.map((name, i) => ({
    name,
    value: values[i] ?? 0,
    color: seriesColor(i),
  }));
  const ordered = sort ? [...items].sort((a, b) => b.value - a.value) : items;
  const total = items.reduce((t, it) => t + it.value, 0);
  const visible = ordered.slice(0, shown);
  const last = visible[visible.length - 1];
  const header = last
    ? `\\text{${last.name}}: \\frac{${formatNumber(last.value, 1)}}{${formatNumber(total, 1)}} = ${formatNumber((100 * last.value) / total, 1)}\\,\\%${view !== 'barras' ? `\\ \\Rightarrow\\ ${formatNumber((360 * last.value) / total, 1)}^\\circ` : ''}`
    : '';
  const description =
    `${variable} por categoría: ` +
    ordered
      .map(
        (it) =>
          `${it.name} ${formatNumber(it.value, 1)} (${formatNumber((100 * it.value) / total, 1)} %)`,
      )
      .join('; ') +
    '.';

  const bars = (
    <ChartSvg
      label={description}
      aspect={horizontal ? 0.06 * categories.length + 0.2 : view === 'ambas' ? 0.8 : 0.6}
      minHeight={220}
      maxHeight={420}
      margins={{
        top: 12,
        right: 20,
        bottom: horizontal ? 40 : 70,
        left: horizontal ? LABEL_WIDTH : 56,
      }}
    >
      {(box) => {
        const band = scaleBand<string>()
          .domain(ordered.map((it) => it.name))
          .range(
            horizontal
              ? [box.inner.top, box.inner.top + box.inner.height]
              : [box.inner.left, box.inner.left + box.inner.width],
          )
          .padding(0.2);
        const max = Math.max(...items.map((it) => it.value)) * 1.08;
        const len = scaleLinear()
          .domain([0, max])
          .range(
            horizontal
              ? [box.inner.left, box.inner.left + box.inner.width]
              : [box.inner.top + box.inner.height, box.inner.top],
          );
        return (
          <g>
            {horizontal ? (
              <Axis
                scale={len}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                gridLength={box.inner.height}
                ticks={5}
                label={variable}
              />
            ) : (
              <Axis
                scale={len}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={variable}
              />
            )}
            {ordered.map((it) => {
              const pos = band(it.name) ?? 0;
              const on = visible.includes(it);
              return (
                <g key={it.name}>
                  {horizontal ? (
                    <text
                      x={box.inner.left - 8}
                      y={pos + band.bandwidth() / 2}
                      dy="0.32em"
                      textAnchor="end"
                      className={styles.chartLabel}
                    >
                      {it.name}
                    </text>
                  ) : (
                    <text
                      transform={`translate(${pos + band.bandwidth() / 2},${box.inner.top + box.inner.height + 12}) rotate(-30)`}
                      textAnchor="end"
                      className={styles.chartLabel}
                    >
                      {it.name}
                    </text>
                  )}
                  {on &&
                    (horizontal ? (
                      <rect
                        x={box.inner.left}
                        y={pos}
                        width={len(it.value) - box.inner.left}
                        height={band.bandwidth()}
                        fill={view === 'barras' ? DATA_COLORS.primary : it.color}
                        aria-hidden="true"
                      />
                    ) : (
                      <rect
                        x={pos}
                        y={len(it.value)}
                        width={band.bandwidth()}
                        height={box.inner.top + box.inner.height - len(it.value)}
                        fill={view === 'barras' ? DATA_COLORS.primary : it.color}
                        aria-hidden="true"
                      />
                    ))}
                </g>
              );
            })}
          </g>
        );
      }}
    </ChartSvg>
  );

  const pie = (
    <ChartSvg
      label={description}
      aspect={0.8}
      minHeight={240}
      maxHeight={400}
      margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      {(box) => {
        const r = Math.min(box.inner.width, box.inner.height) / 2 - 6;
        const cx = box.inner.left + box.inner.width / 2;
        const cy = box.inner.top + box.inner.height / 2;
        let angle = 0;
        return (
          <g aria-hidden="true">
            {visible.map((it) => {
              const start = angle;
              angle += (2 * Math.PI * it.value) / total;
              return (
                <path
                  key={it.name}
                  d={arc(cx, cy, r, start, angle)}
                  fill={it.color}
                  stroke="var(--color-surface)"
                  strokeWidth={1.5}
                />
              );
            })}
          </g>
        );
      }}
    </ChartSvg>
  );

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={ordered.map((it) => ({
        label: it.name,
        value: `${formatNumber((100 * it.value) / total, 1)} %`,
        ...(view !== 'barras' ? { color: it.color } : {}),
      }))}
      legend={
        view === 'barras'
          ? [{ label: variable, color: DATA_COLORS.primary }]
          : items.map((it) => ({ label: it.name, color: it.color }))
      }
      description={description}
      dataTable={{
        caption: variable,
        columns: ['Categoría', variable, 'Porcentaje'],
        rows: ordered.map((it) => [
          it.name,
          formatNumber(it.value, 1),
          `${formatNumber((100 * it.value) / total, 1)} %`,
        ]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      {view === 'ambas' ? (
        <div className={styles.pair}>
          {bars}
          {pie}
        </div>
      ) : view === 'barras' ? (
        bars
      ) : (
        pie
      )}
    </VizFrame>
  );
}
