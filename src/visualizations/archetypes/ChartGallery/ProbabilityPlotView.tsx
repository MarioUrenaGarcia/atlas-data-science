import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { standardNormalCdf, standardNormalQuantile } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, pearson, sorted, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const STEPS = 25;
const STEPS_PER_SECOND = 6;
const DOT = 3.5;

interface ProbabilityPlotViewProps {
  title: string;
  kind: 'qq' | 'pp';
  values: readonly number[];
  label: string;
}

/**
 * Normal Q-Q or P-P plot. Points are added from the smallest to the largest
 * datum; if the data were normal they would follow the reference line, and
 * the way they bend away shows skewness or heavy tails.
 */
export function ProbabilityPlotView({ title, kind, values, label }: ProbabilityPlotViewProps) {
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${values.length}|${kind}|${run}`, () =>
    reducedMotion ? STEPS : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const xs = sorted(values);
  const n = xs.length;
  const m = mean(xs);
  const s = standardDeviation(xs);
  const points = xs.map((v, i) => {
    const p = (i + 0.5) / n;
    return kind === 'qq'
      ? { tx: standardNormalQuantile(p), ty: v }
      : { tx: standardNormalCdf((v - m) / s), ty: p };
  });
  const shown = points.slice(0, Math.max(1, Math.round((n * step) / STEPS)));
  const fit = pearson(
    points.map((p) => p.tx),
    points.map((p) => p.ty),
  );
  const f = (v: number) => formatNumber(v, 3);
  const last = shown[shown.length - 1];
  const index = shown.length;
  const header =
    kind === 'qq'
      ? `x_{(${index})} = ${f(last?.ty ?? 0)}\\ \\text{frente a}\\ z_{(${index})} = \\Phi^{-1}\\!\\left(\\frac{${index} - 0.5}{${n}}\\right) = ${f(last?.tx ?? 0)}`
      : `\\frac{${index} - 0.5}{${n}} = ${f(last?.ty ?? 0)}\\ \\text{frente a}\\ \\Phi\\!\\left(\\frac{x_{(${index})} - \\bar{x}}{s}\\right) = ${f(last?.tx ?? 0)}`;
  const description =
    `Gráfico ${kind === 'qq' ? 'Q-Q' : 'P-P'} normal de ${n} datos de ${label}. ` +
    `La correlación de los puntos con la recta de referencia es ${f(fit)}; valores cercanos a 1 son compatibles con normalidad.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Puntos dibujados', value: `${shown.length} de ${n}` },
        { label: 'Media', value: f(m) },
        { label: 'Desviación estándar', value: f(s) },
        { label: 'Correlación del gráfico', value: f(fit), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Datos ordenados', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Referencia normal', color: DATA_COLORS.text, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={440}
        margins={{ top: 16, right: 20, bottom: 46, left: 60 }}
      >
        {(box) => {
          const txs = points.map((p) => p.tx);
          const tys = points.map((p) => p.ty);
          const xDomain: [number, number] =
            kind === 'qq' ? [Math.min(...txs) - 0.2, Math.max(...txs) + 0.2] : [0, 1];
          const yPad = (Math.max(...tys) - Math.min(...tys)) * 0.05 || 1;
          const yDomain: [number, number] =
            kind === 'qq' ? [Math.min(...tys) - yPad, Math.max(...tys) + yPad] : [0, 1];
          const x = scaleLinear()
            .domain(xDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain(yDomain)
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const line = kind === 'qq' ? (t: number) => m + s * t : (t: number) => t;
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={kind === 'qq' ? `Cuantil muestral de ${label}` : 'Proporción empírica'}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={7}
                label={
                  kind === 'qq' ? 'Cuantil de la normal estándar' : 'Probabilidad normal ajustada'
                }
              />
              <line
                x1={x(xDomain[0])}
                x2={x(xDomain[1])}
                y1={y(line(xDomain[0]))}
                y2={y(line(xDomain[1]))}
                stroke={DATA_COLORS.text}
                strokeDasharray="6 4"
                strokeWidth={2}
                aria-hidden="true"
              />
              {shown.map((p, i) => (
                <circle
                  key={i}
                  cx={x(p.tx)}
                  cy={y(p.ty)}
                  r={DOT}
                  fill={i === shown.length - 1 ? DATA_COLORS.highlight : DATA_COLORS.primary}
                  fillOpacity={0.8}
                  aria-hidden="true"
                />
              ))}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
