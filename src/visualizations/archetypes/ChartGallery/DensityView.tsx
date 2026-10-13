import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  histogram,
  kernelValue,
  silvermanBandwidth,
  type Kernel,
} from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const POINTS = 160;
const MAX_BUMPS = 60;
const STEPS = 30;
const STEPS_PER_SECOND = 6;
const BINS = 24;

const KERNEL_NAMES: Record<Kernel, string> = {
  gaussian: 'Gaussiano',
  epanechnikov: 'Epanechnikov',
  uniform: 'Uniforme (rectangular)',
  triangular: 'Triangular',
};

interface DensityViewProps {
  title: string;
  values: readonly number[];
  label: string;
  kernel: Kernel;
  bandwidth?: number;
}

/**
 * A kernel density estimate assembled bump by bump: each observation adds a
 * small kernel and the estimate is their average. The bandwidth decides how
 * smooth the result is.
 */
export function DensityView({
  title,
  values,
  label,
  kernel: kernel0,
  bandwidth,
}: DensityViewProps) {
  const silverman = silvermanBandwidth(values);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'h',
        label: 'Ancho de banda',
        symbol: 'h',
        min: Number((silverman / 5).toPrecision(2)),
        max: Number((silverman * 4).toPrecision(2)),
        step: Number((silverman / 20).toPrecision(2)),
        default: Number((bandwidth ?? silverman).toPrecision(2)),
      },
      {
        type: 'select',
        key: 'nucleo',
        label: 'Núcleo',
        options: (Object.keys(KERNEL_NAMES) as Kernel[]).map((value) => ({
          value,
          label: KERNEL_NAMES[value],
        })),
        default: kernel0,
      },
      { type: 'toggle', key: 'histograma', label: 'Histograma de fondo', default: true },
    ],
    [silverman, bandwidth, kernel0],
  );
  const parameters = useParameters(definitions);
  const h = Number(parameters.values.h);
  const kernel = String(parameters.values.nucleo) as Kernel;
  const showHistogram = Boolean(parameters.values.histograma);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${values.length}|${run}`, () =>
    reducedMotion ? STEPS : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const n = values.length;
  const used = values.slice(0, Math.max(1, Math.round((n * step) / STEPS)));
  const lo = Math.min(...values) - 3 * h;
  const hi = Math.max(...values) + 3 * h;
  const grid = Array.from({ length: POINTS }, (_, i) => lo + ((hi - lo) * i) / (POINTS - 1));
  const estimate = (x: number) =>
    used.reduce((t, v) => t + kernelValue(kernel, (x - v) / h), 0) / (used.length * h);
  const curve = grid.map(estimate);
  const peak = Math.max(...curve);
  const bins = histogram(values, BINS, [Math.min(...values), Math.max(...values)]);
  const binWidth = (Math.max(...values) - Math.min(...values)) / BINS || 1;
  const f = (v: number) => formatNumber(v, 3);
  const header = `\\hat{f}_h(x) = \\frac{1}{n h}\\sum_{i=1}^{n} K\\!\\left(\\frac{x - x_i}{h}\\right),\\quad n = ${used.length},\\ h = ${f(h)}\\ (\\text{Silverman: } ${f(silverman)})`;
  const description =
    `Estimación de densidad de ${label} con núcleo ${KERNEL_NAMES[kernel].toLowerCase()}, ancho de banda ${f(h)} y ${used.length} datos. ` +
    `La densidad estimada alcanza su máximo cerca de ${f(grid[curve.indexOf(peak)] ?? 0)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Datos sumados', value: `${used.length} de ${n}` },
        { label: 'Ancho de banda h', value: f(h), color: DATA_COLORS.secondary },
        { label: 'Ancho de Silverman', value: f(silverman) },
      ]}
      legend={[
        { label: 'Densidad estimada', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Núcleo de cada dato', color: DATA_COLORS.primary, shape: 'line' },
        ...(showHistogram
          ? [{ label: 'Histograma como densidad', color: DATA_COLORS.tertiary }]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={400}
        margins={{ top: 16, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([lo, hi])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const histPeak = Math.max(...bins.map((b) => b.count)) / (n * binWidth);
          const y = scaleLinear()
            .domain([0, Math.max(peak, showHistogram ? histPeak : 0) * 1.1 || 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const path = (ys: number[]) =>
            ys.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(grid[i] ?? 0)} ${y(v)}`).join(' ');
          const bumps = used.slice(-MAX_BUMPS);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Densidad"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={label}
              />
              {showHistogram && (
                <Bars
                  bars={bins.map((b) => ({ x0: b.x0, x1: b.x1, value: b.count / (n * binWidth) }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.tertiary}
                  opacity={0.3}
                  animate={false}
                />
              )}
              <g aria-hidden="true">
                {bumps.map((v, i) => (
                  <path
                    key={i}
                    d={path(grid.map((g) => kernelValue(kernel, (g - v) / h) / (used.length * h)))}
                    fill="none"
                    stroke={DATA_COLORS.primary}
                    strokeOpacity={0.35}
                    strokeWidth={1}
                  />
                ))}
                {used.map((v, i) => (
                  <line
                    key={`r${i}`}
                    x1={x(v)}
                    x2={x(v)}
                    y1={box.inner.top + box.inner.height}
                    y2={box.inner.top + box.inner.height - 6}
                    stroke={DATA_COLORS.text}
                    strokeOpacity={0.6}
                  />
                ))}
                <path d={path(curve)} fill="none" stroke={DATA_COLORS.secondary} strokeWidth={3} />
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
