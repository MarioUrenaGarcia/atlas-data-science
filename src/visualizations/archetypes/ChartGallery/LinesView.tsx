import { scaleLinear, scaleLog, scalePoint } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const PERIODS_PER_SECOND = 6;
const DOT = 3.5;
const MAX_LABELS = 12;

interface LinesViewProps {
  title: string;
  periods: readonly string[];
  series: readonly { nombre: string; valores: readonly number[] }[];
  variable: string;
  scale: 'lineal' | 'logaritmica';
  pointsOnly: boolean;
}

function logTicks(lo: number, hi: number): number[] {
  const ticks: number[] = [];
  for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e += 1)
    ticks.push(10 ** e);
  return ticks.filter((t) => t >= lo / 1.01 && t <= hi * 1.01);
}

/**
 * Series over ordered periods drawn as they unfold. The vertical scale can
 * switch to logarithmic, where equal growth rates look like equal slopes.
 */
export function LinesView({
  title,
  periods,
  series,
  variable,
  scale: scale0,
  pointsOnly: points0,
}: LinesViewProps) {
  const positive = series.every((s) => s.valores.every((v) => v > 0));
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(positive
        ? [
            {
              type: 'select' as const,
              key: 'escala',
              label: 'Escala vertical',
              options: [
                { value: 'lineal', label: 'Lineal' },
                { value: 'logaritmica', label: 'Logarítmica' },
              ],
              default: scale0,
            },
          ]
        : []),
      { type: 'toggle', key: 'puntos', label: 'Solo puntos, sin unir', default: points0 },
    ],
    [positive, scale0, points0],
  );
  const parameters = useParameters(definitions);
  const scale = (positive ? String(parameters.values.escala) : 'lineal') as
    'lineal' | 'logaritmica';
  const pointsOnly = Boolean(parameters.values.puntos);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? periods.length : 2);
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(periods.length, v + 1)),
    reset: () => setShown(2),
    rate: PERIODS_PER_SECOND,
    done: shown >= periods.length,
  });
  const all = series.flatMap((s) => s.valores);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const k = shown - 1;
  const g = (v: number) => formatNumber(v, 2);
  const header = series
    .map((s) => {
      const a = s.valores[k - 1] ?? 0;
      const b = s.valores[k] ?? 0;
      return scale === 'logaritmica'
        ? `\\log_{10} \\text{${s.nombre}} = ${g(Math.log10(b))}\\ (\\Delta = ${g(Math.log10(b) - Math.log10(a))})`
        : `\\text{${s.nombre}} = ${g(b)}\\ (\\Delta = ${g(b - a)})`;
    })
    .join(';\\ ');
  const description =
    `${series.length === 1 ? 'Serie' : 'Series'} de ${variable} en ${shown} de ${periods.length} periodos, escala ${scale}. ` +
    series
      .map((s) => `${s.nombre}: de ${g(s.valores[0] ?? 0)} a ${g(s.valores[shown - 1] ?? 0)}`)
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Periodo', value: periods[k] ?? '' },
        ...series.map((s, i) => ({
          label: s.nombre,
          value: g(s.valores[k] ?? 0),
          color: seriesColor(i),
        })),
        ...series.map((s) => ({
          label: `Crecimiento del último periodo, ${s.nombre}`,
          value: `${formatNumber((100 * ((s.valores[k] ?? 0) - (s.valores[k - 1] ?? 0))) / (s.valores[k - 1] || 1), 1)} %`,
        })),
      ]}
      legend={series.map((s, i) => ({
        label: s.nombre,
        color: seriesColor(i),
        shape: pointsOnly ? ('circle' as const) : ('line' as const),
      }))}
      description={description}
      dataTable={{
        caption: variable,
        columns: ['Periodo', ...series.map((s) => s.nombre)],
        rows: periods.map((p, i) => [p, ...series.map((s) => g(s.valores[i] ?? 0))]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={420}
        margins={{ top: 16, right: 20, bottom: 46, left: 64 }}
      >
        {(box) => {
          const x = scalePoint<string>()
            .domain([...periods])
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.3);
          const y =
            scale === 'logaritmica'
              ? scaleLog()
                  .domain([lo * 0.8, hi * 1.25])
                  .range([box.inner.top + box.inner.height, box.inner.top])
              : scaleLinear()
                  .domain([Math.min(0, lo), hi * 1.08])
                  .range([box.inner.top + box.inner.height, box.inner.top]);
          const every = Math.ceil(periods.length / MAX_LABELS);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                {...(scale === 'logaritmica' ? { tickValues: logTicks(lo * 0.8, hi * 1.25) } : {})}
                label={variable}
              />
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={box.inner.top + box.inner.height}
                y2={box.inner.top + box.inner.height}
                stroke="var(--data-axis)"
              />
              {periods.map((p, i) =>
                i % every === 0 ? (
                  <text
                    key={p}
                    x={x(p) ?? 0}
                    y={box.inner.top + box.inner.height + 16}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {p}
                  </text>
                ) : null,
              )}
              {series.map((s, si) => {
                const pts = periods
                  .slice(0, shown)
                  .map((p, i) => [x(p) ?? 0, y(s.valores[i] ?? lo)] as const);
                return (
                  <g key={s.nombre} aria-hidden="true">
                    {!pointsOnly && (
                      <path
                        d={pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px} ${py}`).join(' ')}
                        fill="none"
                        stroke={seriesColor(si)}
                        strokeWidth={2.5}
                      />
                    )}
                    {pts.map(([px, py], i) => (
                      <circle key={i} cx={px} cy={py} r={DOT} fill={seriesColor(si)} />
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
