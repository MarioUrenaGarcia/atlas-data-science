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
import styles from './SufficiencyLab.module.css';

const SWEEP = 40;
const STEPS_PER_SECOND = 8;
const CURVE_POINTS = 160;

interface FactorizationViewProps {
  title: string;
  samples: number[][];
  sigma: number;
}

/**
 * Normal likelihood of mu for several samples with known sigma. By the
 * factorization theorem it depends on the data only through the sample
 * mean: samples with the same mean, however different, give curves that
 * coincide once each is scaled to its maximum.
 */
export function FactorizationView({ title, samples, sigma }: FactorizationViewProps) {
  const means = samples.map((s) => mean(s));
  const all = samples.flat();
  const lo = Math.min(...all, ...means) - 2 * sigma;
  const hi = Math.max(...all, ...means) + 2 * sigma;
  const curves = useMemo(
    () =>
      samples.map((s) => {
        const xs = Array.from(
          { length: CURVE_POINTS + 1 },
          (_, i) => lo + ((hi - lo) * i) / CURVE_POINTS,
        );
        const ll = xs.map((mu) => normalLogLikelihood(s, mu, sigma));
        const top = Math.max(...ll);
        return xs.map((mu, i) => ({ mu, l: Math.exp((ll[i] ?? top) - top) }));
      }),
    [samples, sigma, lo, hi],
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
  const mu = lo + ((hi - lo) * step) / SWEEP;
  const relative = samples.map((s, i) =>
    Math.exp(normalLogLikelihood(s, mu, sigma) - normalLogLikelihood(s, means[i] ?? mu, sigma)),
  );
  const header = `L(\\mu) = \\underbrace{\\exp\\!\\Big(-\\tfrac{n(\\bar{x} - \\mu)^2}{2\\sigma^2}\\Big)}_{g(\\bar{x},\\,\\mu)} \\cdot \\underbrace{\\exp\\!\\Big(-\\tfrac{\\sum (x_i - \\bar{x})^2}{2\\sigma^2}\\Big)}_{h(\\mathbf{x})},\\quad \\mu = ${formatNumber(mu, 2)}`;
  const description =
    `Verosimilitud normal de mu con sigma igual a ${formatNumber(sigma, 2)} para ${samples.length} muestras. ` +
    samples
      .map(
        (s, i) =>
          `Muestra ${i + 1}: media ${formatNumber(means[i] ?? 0, 2)}, suma de cuadrados respecto a su media ${formatNumber(sum(s.map((x) => (x - (means[i] ?? 0)) ** 2)), 2)}`,
      )
      .join('; ') +
    '. Las muestras con la misma media dan la misma curva relativa.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'μ', value: formatNumber(mu, 2) },
        ...samples.map((_, i) => ({
          label: `Muestra ${i + 1}: media; L relativa`,
          value: `${formatNumber(means[i] ?? 0, 2)}; ${formatNumber(relative[i] ?? 0, 3)}`,
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
                label="μ"
              />
              <g aria-hidden="true">
                {curves.map((c, i) => (
                  <polyline
                    key={i}
                    points={c.map((p) => `${x(p.mu)},${y(p.l)}`).join(' ')}
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
                  x1={x(mu)}
                  x2={x(mu)}
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
