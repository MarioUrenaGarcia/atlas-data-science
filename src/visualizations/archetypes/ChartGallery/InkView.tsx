import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { dataInkRatio } from '../../../lib/stats/graphics.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FormulaLine } from '../../core/FormulaLine.tsx';

/** The chart is laid out in a fixed virtual canvas so ink can be measured independently of screen size. */
const W = 600;
const H = 360;
const PLOT = { left: 64, right: 580, top: 24, bottom: 316 };
const DEPTH = 12;
const GRID_LINES = 10;
const STEPS_PER_SECOND = 0.8;

const ELEMENTS = [
  { key: 'fondo', label: 'Fondo sombreado' },
  { key: 'sombra', label: 'Efecto de profundidad' },
  { key: 'marco', label: 'Marco grueso' },
  { key: 'rejilla', label: 'Rejilla densa' },
  { key: 'leyenda', label: 'Leyenda redundante' },
  { key: 'contorno', label: 'Contorno de las barras' },
  { key: 'colores', label: 'Un color por barra' },
] as const;

type ElementKey = (typeof ELEMENTS)[number]['key'];

interface InkViewProps {
  title: string;
  categories: readonly string[];
  values: readonly number[];
  variable: string;
}

/**
 * A bar chart loaded with decoration that is erased one element at a time.
 * Ink is measured as painted area times opacity in a fixed canvas, so the
 * data-ink ratio of Tufte rises as each non-data element disappears while the
 * information shown stays the same.
 */
export function InkView({ title, categories, values, variable }: InkViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => ELEMENTS.map((e) => ({ type: 'toggle', key: e.key, label: e.label, default: true })),
    [],
  );
  const parameters = useParameters(definitions);
  const on = (key: ElementKey) => Boolean(parameters.values[key]);
  const remaining = ELEMENTS.filter((e) => on(e.key));
  const playback = usePlayback({
    step: () => {
      const next = remaining[0];
      if (next) parameters.set(next.key, false);
    },
    reset: () => parameters.reset(),
    rate: STEPS_PER_SECOND,
    done: remaining.length === 0,
  });

  // Headroom above the tallest bar keeps the legend clear of the data.
  const max = Math.max(...values) * 1.45;
  const x = scaleBand<number>()
    .domain(categories.map((_, i) => i))
    .range([PLOT.left, PLOT.right])
    .padding(0.3);
  const y = scaleLinear().domain([0, max]).range([PLOT.bottom, PLOT.top]);
  const bw = x.bandwidth();
  const heights = values.map((v) => PLOT.bottom - y(v));
  const plotW = PLOT.right - PLOT.left;
  const plotH = PLOT.bottom - PLOT.top;
  const legendH = categories.length * 18 + 12;

  // Ink of each element: filled area times opacity, or stroke length times width.
  const ink: Record<ElementKey | 'datos' | 'ejes', number> = {
    datos: heights.reduce((t, h) => t + h * bw, 0),
    ejes: plotH + plotW + 6 * 6,
    fondo: plotW * plotH * 0.12,
    sombra: heights.reduce((t, h) => t + (h * DEPTH + bw * DEPTH) * 0.6, 0),
    marco: 2 * (W + H) * 4,
    rejilla: ((GRID_LINES + 1) * plotW + (categories.length + 1) * plotH) * 1.2,
    leyenda: 120 * legendH * 0.15 + 2 * (120 + legendH) * 1.5 + categories.length * 100,
    contorno: heights.reduce((t, h) => t + 2 * (h + bw) * 2.5, 0),
    colores: 0,
  };
  const nonData = ink.ejes + ELEMENTS.reduce((t, e) => t + (on(e.key) ? ink[e.key] : 0), 0);
  const ratio = dataInkRatio(ink.datos, nonData);
  const header = `\\text{proporción de tinta de datos} = \\frac{${formatNumber(ink.datos / 1000, 1)}}{${formatNumber(ink.datos / 1000, 1)} + ${formatNumber(nonData / 1000, 1)}} = ${formatNumber(ratio, 3)}`;
  const last = ELEMENTS.filter((e) => !on(e.key)).at(-1);
  const description =
    `Gráfico de barras de ${variable} con ${remaining.length} adornos: ${remaining.map((e) => e.label.toLowerCase()).join(', ') || 'ninguno'}. ` +
    `Proporción de tinta de datos ${formatNumber(ratio, 3)}.${last ? ` Último elemento borrado: ${last.label.toLowerCase()}.` : ''}`;
  const barColor = (i: number) => (on('colores') ? seriesColor(i) : DATA_COLORS.primary);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Tinta de datos (miles de unidades)', value: formatNumber(ink.datos / 1000, 1) },
        { label: 'Tinta que no es de datos', value: formatNumber(nonData / 1000, 1) },
        {
          label: 'Proporción de tinta de datos',
          value: formatNumber(ratio, 3),
          color: DATA_COLORS.primary,
        },
        { label: 'Adornos restantes', value: String(remaining.length) },
      ]}
      legend={[{ label: variable, color: DATA_COLORS.primary }]}
      description={description}
      dataTable={{
        caption: variable,
        columns: ['Categoría', variable],
        rows: categories.map((c, i) => [c, formatNumber(values[i] ?? 0, 1)]),
      }}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={H / W}
        minHeight={220}
        maxHeight={420}
        margins={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {(box) => {
          const k = Math.min(box.width / W, box.height / H);
          const dx = (box.width - W * k) / 2;
          return (
            <g transform={`translate(${dx},0) scale(${k})`} aria-hidden="true">
              {on('marco') && (
                <rect
                  x={2}
                  y={2}
                  width={W - 4}
                  height={H - 4}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={4}
                />
              )}
              {on('fondo') && (
                <rect
                  x={PLOT.left}
                  y={PLOT.top}
                  width={plotW}
                  height={plotH}
                  fill={DATA_COLORS.text}
                  fillOpacity={0.12}
                />
              )}
              {on('rejilla') && (
                <g stroke={DATA_COLORS.muted} strokeWidth={1.2}>
                  {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
                    const yy = PLOT.top + (plotH * i) / GRID_LINES;
                    return <line key={`h${i}`} x1={PLOT.left} x2={PLOT.right} y1={yy} y2={yy} />;
                  })}
                  {Array.from({ length: categories.length + 1 }, (_, i) => {
                    const xx = PLOT.left + (plotW * i) / categories.length;
                    return <line key={`v${i}`} x1={xx} x2={xx} y1={PLOT.top} y2={PLOT.bottom} />;
                  })}
                </g>
              )}
              {values.map((v, i) => {
                const left = x(i) ?? 0;
                const top = y(v);
                const h = PLOT.bottom - top;
                return (
                  <g key={i}>
                    {on('sombra') && (
                      <>
                        <polygon
                          points={`${left + bw},${top} ${left + bw + DEPTH},${top - DEPTH} ${left + bw + DEPTH},${top + h - DEPTH} ${left + bw},${top + h}`}
                          fill={barColor(i)}
                          fillOpacity={0.6}
                        />
                        <polygon
                          points={`${left},${top} ${left + DEPTH},${top - DEPTH} ${left + bw + DEPTH},${top - DEPTH} ${left + bw},${top}`}
                          fill={barColor(i)}
                          fillOpacity={0.6}
                        />
                      </>
                    )}
                    <rect
                      x={left}
                      y={top}
                      width={bw}
                      height={h}
                      fill={barColor(i)}
                      stroke={on('contorno') ? DATA_COLORS.text : 'none'}
                      strokeWidth={on('contorno') ? 2.5 : 0}
                    />
                  </g>
                );
              })}
              <line
                x1={PLOT.left}
                x2={PLOT.right}
                y1={PLOT.bottom}
                y2={PLOT.bottom}
                stroke={DATA_COLORS.text}
              />
              {categories.map((c, i) => (
                <text
                  key={c}
                  x={(x(i) ?? 0) + bw / 2}
                  y={PLOT.bottom + 18}
                  textAnchor="middle"
                  fontSize={13}
                  fill={DATA_COLORS.muted}
                >
                  {c}
                </text>
              ))}
              {values.map((v, i) => (
                <text
                  key={`v${i}`}
                  x={(x(i) ?? 0) + bw / 2}
                  y={y(v) - (on('sombra') ? DEPTH + 6 : 6)}
                  textAnchor="middle"
                  fontSize={13}
                  fill={DATA_COLORS.text}
                >
                  {formatNumber(v, 1)}
                </text>
              ))}
              {on('leyenda') && (
                <g transform={`translate(${PLOT.right - 130},${PLOT.top + 8})`}>
                  <rect
                    width={120}
                    height={legendH}
                    fill={DATA_COLORS.text}
                    fillOpacity={0.15}
                    stroke={DATA_COLORS.text}
                    strokeWidth={1.5}
                  />
                  {categories.map((c, i) => (
                    <g key={c} transform={`translate(8,${10 + i * 18})`}>
                      <rect width={10} height={10} fill={barColor(i)} />
                      <text x={16} y={9} fontSize={11} fill={DATA_COLORS.text}>
                        {c}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
