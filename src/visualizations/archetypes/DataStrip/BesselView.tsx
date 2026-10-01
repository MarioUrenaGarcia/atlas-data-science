import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';

const MAX_SAMPLES = 400;
const SAMPLES_PER_SECOND = 12;
const SEED_STRIDE = 7919;
const SAMPLE_DOT = 2.5;

interface BesselViewProps {
  title: string;
  n: number;
  mu: number;
  sigma: number;
  variable: string;
  seed: number;
}

interface History {
  biased: number[];
  unbiased: number[];
}

/**
 * Repeated samples from a population with known variance. The running
 * averages of the variance with denominator n and with n - 1 converge to
 * different values: only the second one is centered on sigma squared.
 */
export function BesselView({ title, n: n0, mu, sigma, variable, seed: seed0 }: BesselViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'n',
      label: 'Tamaño de cada muestra',
      symbol: 'n',
      min: 2,
      max: 30,
      step: 1,
      default: n0,
    },
  ];
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const seed = useSeed(seed0);
  const [run, setRun] = useState(0);
  const [history, update] = useResettableState<History>(`${n}|${seed.seed}|${run}`, () => ({
    biased: [],
    unbiased: [],
  }));
  const count = history.unbiased.length;
  const playback = usePlayback({
    step: () =>
      update((previous) => {
        const random = new Random(seed.seed + SEED_STRIDE * (previous.unbiased.length + 1) + run);
        const sample = Array.from({ length: n }, () => random.normal(mu, sigma));
        return {
          biased: [...previous.biased, variance(sample, true)],
          unbiased: [...previous.unbiased, variance(sample)],
        };
      }),
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: count >= MAX_SAMPLES,
  });
  const average = (values: number[]) =>
    values.length === 0 ? Number.NaN : values.reduce((a, b) => a + b, 0) / values.length;
  const running = (values: number[]) => {
    let total = 0;
    return values.map((value, i) => {
      total += value;
      return total / (i + 1);
    });
  };
  const sigma2 = sigma * sigma;
  const biasedMean = average(history.biased);
  const unbiasedMean = average(history.unbiased);
  const expectedBiased = ((n - 1) / n) * sigma2;
  const f = (value: number) => (Number.isNaN(value) ? '?' : formatNumber(value, 3));
  const header =
    `\\overline{\\hat{\\sigma}^2_n} = ${f(biasedMean)} \\approx \\tfrac{n-1}{n}\\sigma^2 = \\tfrac{${n - 1}}{${n}} \\cdot ${f(sigma2)} = ${f(expectedBiased)}` +
    `\\qquad \\overline{s^2} = ${f(unbiasedMean)} \\approx \\sigma^2 = ${f(sigma2)}`;
  const description =
    `${count} muestras de tamaño ${n} de una población con varianza ${f(sigma2)}. ` +
    `Promedio de la varianza con denominador n: ${f(biasedMean)}; con denominador n - 1: ${f(unbiasedMean)}.`;
  const runningBiased = running(history.biased);
  const runningUnbiased = running(history.unbiased);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Muestras', value: String(count) },
        { label: 'Varianza poblacional σ²', value: f(sigma2), color: DATA_COLORS.text },
        {
          label: 'Promedio de las varianzas con n - 1',
          value: f(unbiasedMean),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Promedio de las varianzas con n',
          value: f(biasedMean),
          color: DATA_COLORS.secondary,
        },
        { label: 'Factor (n - 1)/n', value: formatNumber((n - 1) / n, 3) },
      ]}
      legend={[
        { label: 'σ², varianza de la población', color: DATA_COLORS.text, shape: 'dashed' },
        { label: 'Promedio acumulado con n - 1', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Promedio acumulado con n', color: DATA_COLORS.secondary, shape: 'line' },
        {
          label: 'Varianza con n - 1 de cada muestra',
          color: DATA_COLORS.primary,
          shape: 'circle',
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={400}
        margins={{ top: 16, right: 20, bottom: 44, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([1, Math.max(20, count)])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, sigma2 * 2])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const path = (values: number[]) =>
            values
              .map(
                (value, i) =>
                  `${i === 0 ? 'M' : 'L'} ${x(i + 1)} ${y(Math.min(sigma2 * 2, value))}`,
              )
              .join(' ');
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={`Varianza de ${variable}`}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="Número de muestras"
              />
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={y(sigma2)}
                y2={y(sigma2)}
                stroke={DATA_COLORS.text}
                strokeDasharray="6 4"
                strokeWidth={2}
              />
              {history.unbiased.map((value, i) => (
                <circle
                  key={i}
                  cx={x(i + 1)}
                  cy={y(Math.min(sigma2 * 2, value))}
                  r={SAMPLE_DOT}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.25}
                  aria-hidden="true"
                />
              ))}
              <path
                d={path(runningUnbiased)}
                fill="none"
                stroke={DATA_COLORS.primary}
                strokeWidth={2.5}
              />
              <path
                d={path(runningBiased)}
                fill="none"
                stroke={DATA_COLORS.secondary}
                strokeWidth={2.5}
              />
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
