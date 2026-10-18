import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { normalLogLikelihood } from '../../../lib/inference/sufficiency.ts';
import { mean, sum } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { FactorizationModel } from './schema.ts';
import styles from './SufficiencyLab.module.css';

const SWEEP = 40;
const STEPS_PER_SECOND = 8;
const CURVE_POINTS = 240;

interface ModelSpec {
  symbol: string;
  texSymbol: string;
  statisticName: string;
  /** Value of the sufficient statistic, which also locates the maximum. */
  statistic: (s: readonly number[]) => number;
  maximizer: (s: readonly number[]) => number;
  /** Log-likelihood up to the factor h(x), which cancels in relative curves. */
  logLikelihood: (s: readonly number[], theta: number) => number;
  domain: (all: readonly number[], stats: readonly number[]) => [number, number];
  header: string;
}

function spec(model: FactorizationModel, sigma: number): ModelSpec {
  switch (model) {
    case 'normal':
      return {
        symbol: 'μ',
        texSymbol: '\\mu',
        statisticName: 'media',
        statistic: (s) => mean(s),
        maximizer: (s) => mean(s),
        logLikelihood: (s, mu) => normalLogLikelihood(s, mu, sigma),
        domain: (all, stats) => [
          Math.min(...all, ...stats) - 2 * sigma,
          Math.max(...all, ...stats) + 2 * sigma,
        ],
        header:
          'L(\\mu) = \\underbrace{\\exp\\!\\Big(-\\tfrac{n(\\bar{x} - \\mu)^2}{2\\sigma^2}\\Big)}_{g(\\bar{x},\\,\\mu)} \\cdot \\underbrace{\\exp\\!\\Big(-\\tfrac{\\sum (x_i - \\bar{x})^2}{2\\sigma^2}\\Big)}_{h(\\mathbf{x})}',
      };
    case 'poisson':
      return {
        symbol: 'λ',
        texSymbol: '\\lambda',
        statisticName: 'total',
        statistic: (s) => sum(s),
        maximizer: (s) => mean(s),
        logLikelihood: (s, l) => (sum(s) === 0 ? 0 : sum(s) * Math.log(l)) - s.length * l,
        domain: (all) => [0.01, 2.5 * Math.max(1, mean(all)) + 2],
        header:
          'L(\\lambda) = \\underbrace{e^{-n\\lambda}\\lambda^{\\sum x_i}}_{g(\\sum x_i,\\,\\lambda)} \\cdot \\underbrace{\\frac{1}{\\prod x_i!}}_{h(\\mathbf{x})}',
      };
    case 'uniforme':
      return {
        symbol: 'θ',
        texSymbol: '\\theta',
        statisticName: 'máximo',
        statistic: (s) => Math.max(...s),
        maximizer: (s) => Math.max(...s),
        logLikelihood: (s, t) =>
          t >= Math.max(...s) ? -s.length * Math.log(t) : Number.NEGATIVE_INFINITY,
        domain: (all) => [0, 2 * Math.max(...all)],
        header:
          'L(\\theta) = \\underbrace{\\theta^{-n}\\,\\mathbf{1}\\{x_{(n)} \\le \\theta\\}}_{g(x_{(n)},\\,\\theta)} \\cdot \\underbrace{\\mathbf{1}\\{x_{(1)} \\ge 0\\}}_{h(\\mathbf{x})}',
      };
  }
}

const MODEL_TEXT: Record<FactorizationModel, string> = {
  normal: 'normal con desviación conocida',
  poisson: 'de Poisson',
  uniforme: 'uniforme en (0, θ)',
};

interface FactorizationViewProps {
  title: string;
  samples: number[][];
  sigma: number;
  model: FactorizationModel;
}

/**
 * Likelihood of several samples, each scaled to its maximum. By the
 * factorization theorem it depends on the data only through the sufficient
 * statistic: samples that share it, however different, give coinciding
 * curves, and samples that differ in it give different curves.
 */
export function FactorizationView({ title, samples, sigma, model }: FactorizationViewProps) {
  const m = useMemo(() => spec(model, sigma), [model, sigma]);
  const stats = samples.map((s) => m.statistic(s));
  const [lo, hi] = m.domain(samples.flat(), stats);
  const curves = useMemo(
    () =>
      samples.map((s) => {
        const top = m.logLikelihood(s, m.maximizer(s));
        return Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
          const t = lo + ((hi - lo) * i) / CURVE_POINTS;
          return { t, l: Math.exp(m.logLikelihood(s, t) - top) };
        });
      }),
    [samples, m, lo, hi],
  );
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState<number>(String(run), () =>
    reducedMotion ? SWEEP : 0,
  );
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(SWEEP, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP,
  });
  const theta = lo + ((hi - lo) * step) / SWEEP;
  const relative = samples.map((s) =>
    Math.exp(m.logLikelihood(s, theta) - m.logLikelihood(s, m.maximizer(s))),
  );
  const header = `${m.header},\\quad ${m.texSymbol} = ${formatNumber(theta, 2)}`;
  const description =
    `Verosimilitud ${MODEL_TEXT[model]} para ${samples.length} muestras. ` +
    samples
      .map(
        (s, i) =>
          `Muestra ${i + 1} (${s.join(', ')}): ${m.statisticName} ${formatNumber(stats[i] ?? 0, 2)}`,
      )
      .join('; ') +
    `. Las muestras con el mismo ${m.statisticName} dan la misma curva relativa.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: m.symbol, value: formatNumber(theta, 2) },
        ...samples.map((_, i) => ({
          label: `Muestra ${i + 1}: ${m.statisticName}; L relativa`,
          value: `${formatNumber(stats[i] ?? 0, 2)}; ${formatNumber(relative[i] ?? 0, 3)}`,
          color: seriesColor(i),
        })),
      ]}
      legend={samples.map((s, i) => ({
        label: `Muestra ${i + 1}: ${s.join(', ')}`,
        color: seriesColor(i),
        shape: 'line' as const,
      }))}
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
            .domain([lo, hi])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1.1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const stripY = box.inner.top + box.inner.height - 6;
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Verosimilitud relativa"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={8}
                label={m.symbol}
              />
              <g aria-hidden="true">
                {curves.map((c, i) => (
                  <polyline
                    key={i}
                    points={c.map((p) => `${x(p.t)},${y(p.l)}`).join(' ')}
                    fill="none"
                    stroke={seriesColor(i)}
                    strokeWidth={i === 0 ? 5 : 2.5}
                    strokeOpacity={i === 0 ? 0.5 : 1}
                    strokeDasharray={i === 0 ? undefined : '6 3'}
                  />
                ))}
                {samples.map((s, i) =>
                  s.map((v, k) => (
                    <circle
                      key={`${i}-${k}`}
                      cx={x(v)}
                      cy={stripY - i * 8}
                      r={3}
                      fill={seriesColor(i)}
                    />
                  )),
                )}
                <line
                  x1={x(theta)}
                  x2={x(theta)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="4 3"
                />
              </g>
              <text x={box.inner.left + 6} y={box.inner.top + 14} className={styles.chartLabel}>
                puntos abajo: los datos de cada muestra
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
