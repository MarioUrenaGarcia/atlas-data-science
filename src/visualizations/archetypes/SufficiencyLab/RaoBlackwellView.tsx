import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { raoBlackwellPoissonZero } from '../../../lib/inference/sufficiency.ts';
import { mean, variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, type SeedState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SufficiencyLab.module.css';

const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 2000;
const BINS = 25;

interface Sim {
  naive: number[];
  improved: number[];
}

interface RaoBlackwellViewProps {
  title: string;
  lambda: number;
  n: number;
  seed: SeedState;
}

/**
 * Estimating the probability of zero events, exp(-lambda), from a Poisson
 * sample. The crude estimator looks only at whether the first observation is
 * zero; conditioning it on the sufficient statistic, the total, gives
 * ((n - 1) / n)^T. Both are unbiased, but the conditioned one has far
 * smaller variance.
 */
export function RaoBlackwellView({ title, lambda: l0, n: n0, seed }: RaoBlackwellViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'lambda',
        label: 'Tasa de la Poisson',
        symbol: 'λ',
        min: 0.2,
        max: 5,
        step: 0.1,
        default: l0,
        digits: 1,
      },
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 2,
        max: 50,
        step: 1,
        default: n0,
      },
    ],
    [l0, n0],
  );
  const parameters = useParameters(definitions);
  const lambda = Number(parameters.values.lambda);
  const n = Number(parameters.values.n);
  const [run, setRun] = useState(0);
  const runKey = `${lambda}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sim, update] = useResettableState<Sim>(`${runKey}|${seed.seed}`, () => ({
    naive: [],
    improved: [],
  }));
  const draw = (count: number) => {
    const g = random();
    const naive: number[] = [];
    const improved: number[] = [];
    for (let k = 0; k < count; k += 1) {
      const sample = Array.from({ length: n }, () => g.poisson(lambda));
      naive.push(sample[0] === 0 ? 1 : 0);
      improved.push(
        raoBlackwellPoissonZero(
          n,
          sample.reduce((t, x) => t + x, 0),
        ),
      );
    }
    update((prev) => ({
      naive: [...prev.naive, ...naive].slice(0, MAX_SAMPLES),
      improved: [...prev.improved, ...improved].slice(0, MAX_SAMPLES),
    }));
  };
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((v) => v + 1),
    rate: SAMPLES_PER_SECOND,
    done: sim.naive.length >= MAX_SAMPLES,
  });
  const truth = Math.exp(-lambda);
  const f = (v: number) => formatNumber(v, 4);
  const stat = (xs: number[]) => (xs.length > 1 ? { m: mean(xs), v: variance(xs) } : null);
  const a = stat(sim.naive);
  const b = stat(sim.improved);
  const header = `\\tilde{\\theta} = \\mathbf{1}\\{X_1 = 0\\}\\ \\longrightarrow\\ \\hat{\\theta} = \\mathbb{E}\\big[\\tilde{\\theta} \\mid T\\big] = \\Big(\\frac{n - 1}{n}\\Big)^{T},\\quad e^{-\\lambda} = ${f(truth)}`;
  const description =
    `Poisson con lambda ${formatNumber(lambda, 1)} y muestras de tamaño ${n}; valor verdadero de P(X = 0) igual a ${f(truth)}. ` +
    (a && b
      ? `Tras ${sim.naive.length} muestras, el estimador burdo tiene media ${f(a.m)} y varianza ${f(a.v)}; el mejorado, media ${f(b.m)} y varianza ${f(b.v)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Valor verdadero e^{-λ}', value: f(truth) },
        {
          label: 'Burdo: media; varianza',
          value: a ? `${f(a.m)}; ${f(a.v)}` : 'sin datos',
          color: DATA_COLORS.neutral,
        },
        {
          label: 'Mejorado: media; varianza',
          value: b ? `${f(b.m)}; ${f(b.v)}` : 'sin datos',
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Reducción de varianza',
          value: a && b && a.v > 0 ? `${formatNumber(a.v / b.v, 1)} veces` : 'sin datos',
        },
      ]}
      legend={[
        { label: 'Estimador burdo 1{X₁ = 0}', color: DATA_COLORS.neutral },
        { label: 'Estimador de Rao-Blackwell', color: DATA_COLORS.secondary },
        { label: 'Valor verdadero', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={380}
        margins={{ top: 12, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const width = 1 / BINS;
          const hist = (xs: number[]) => {
            const c = new Array<number>(BINS).fill(0);
            for (const v of xs) {
              const k = Math.min(BINS - 1, Math.floor(v / width));
              c[k] = (c[k] ?? 0) + 1;
            }
            return c.map((v) => (xs.length ? v / xs.length : 0));
          };
          const ha = hist(sim.naive);
          const hb = hist(sim.improved);
          const y = scaleLinear()
            .domain([0, Math.max(0.05, ...ha, ...hb) * 1.05])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Proporción de muestras"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={10}
                label="Estimación de P(X = 0)"
              />
              <g aria-hidden="true">
                {ha.map((v, k) => (
                  <rect
                    key={`a${k}`}
                    x={x(k * width)}
                    y={y(v)}
                    width={Math.max(0, x(width) - x(0) - 1)}
                    height={y(0) - y(v)}
                    fill={DATA_COLORS.neutral}
                    fillOpacity={0.5}
                  />
                ))}
                {hb.map((v, k) => (
                  <rect
                    key={`b${k}`}
                    x={x(k * width) + 2}
                    y={y(v)}
                    width={Math.max(0, x(width) - x(0) - 5)}
                    height={y(0) - y(v)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.8}
                  />
                ))}
                <line
                  x1={x(truth)}
                  x2={x(truth)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.text}
                  strokeWidth={2}
                />
              </g>
              <text x={x(0) + 4} y={box.inner.top + 14} className={styles.chartLabel}>
                el estimador burdo solo vale 0 o 1
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
