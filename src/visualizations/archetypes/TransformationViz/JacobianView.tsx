import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { transformedDensity } from '../../../lib/probability/transform.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import type { TransformationVizConfig } from './schema.ts';
import { setupTransformation } from './setup.ts';
import styles from './TransformationViz.module.css';

const SWEEP_STEPS = 40;
const STEPS_PER_SECOND = 4;
const SAMPLES_PER_STEP = 60;
const BINS = 40;
const CURVE_POINTS = 200;
/** Width of the moving strip as a fraction of the window of X. */
const STRIP = 0.04;

interface Simulation {
  position: number;
  counts: number[];
  total: number;
}

interface JacobianViewProps {
  title: string;
  conceptId: string;
  config: TransformationVizConfig;
}

/**
 * The change of variables formula. A thin strip [x, x + dx] of X is carried
 * by g to [g(x), g(x + dx)]; the probability is the same, so where g stretches
 * the strip the density of Y is lower, by the factor |dx/dy|. The histogram
 * of simulated values of Y fills in under the formula curve.
 */
export function JacobianView({ title, conceptId, config }: JacobianViewProps) {
  const setup = setupTransformation(config);
  const { x: X, transform, xDomain, yDomain } = setup;
  const maxSamples = config.muestras ?? SWEEP_STEPS * SAMPLES_PER_STEP;
  const binWidth = (yDomain[1] - yDomain[0]) / BINS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, `${run}`);
  const [sim, update] = useResettableState<Simulation>(`${run}|${seed.seed}`, () => ({
    position: 0,
    counts: Array<number>(BINS).fill(0),
    total: 0,
  }));
  const advance = () => {
    const generator = random();
    const draws = Array.from({ length: Math.min(SAMPLES_PER_STEP, maxSamples - sim.total) }, () =>
      transform.g(X.sample(generator)),
    );
    update((previous) => {
      const counts = [...previous.counts];
      for (const value of draws) {
        const bin = Math.floor((value - yDomain[0]) / binWidth);
        if (bin >= 0 && bin < BINS) counts[bin] = (counts[bin] ?? 0) + 1;
      }
      return {
        position: Math.min(SWEEP_STEPS, previous.position + 1),
        counts,
        total: previous.total + draws.length,
      };
    });
  };
  const playback = usePlayback({
    step: advance,
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: sim.position >= SWEEP_STEPS && sim.total >= maxSamples,
  });

  const [x0, x1] = xDomain;
  // The strip sweeps the bulk of X, where its density is positive, not the padded window.
  const s0 = Math.max(x0, X.quantile(0.001));
  const s1 = Math.min(x1, X.quantile(0.999));
  const dx = (s1 - s0) * STRIP;
  const left = s0 + ((s1 - s0 - dx) * sim.position) / SWEEP_STEPS;
  const right = left + dx;
  const gl = transform.g(left);
  const gr = transform.g(right);
  // g can be infinite at the edge of the support (for example -log x at 0), so the image is clipped to the window.
  const clip = (v: number) =>
    Number.isNaN(v) ? yDomain[0] : Math.min(yDomain[1], Math.max(yDomain[0], v));
  const [ylo, yhi] = gl <= gr ? [clip(gl), clip(gr)] : [clip(gr), clip(gl)];
  const mass = X.cdf(right) - X.cdf(left);
  const mid = (left + right) / 2;
  const slope = Math.abs(transform.dg(mid));
  const yMid = transform.g(mid);
  const fy = transformedDensity((t) => X.pdf(t), transform, yMid);
  const f = (v: number) => formatNumber(v, 3);
  const header = `f_Y(${f(yMid)}) = \\sum f_X(x)\\left|\\frac{dx}{dy}\\right| ${transform.monotone ? `= \\frac{f_X(${f(mid)})}{|g'(${f(mid)})|} = \\frac{${f(X.pdf(mid))}}{${f(slope)}}` : ''} = ${f(fy)}`;
  const densities = sim.counts.map((count) => (sim.total > 0 ? count / (sim.total * binWidth) : 0));
  const description =
    `X con distribución ${setup.label}; Y = g(X) con g(x) = ${transform.tex}. La franja de x entre ${f(left)} y ${f(right)}, con probabilidad ${formatNumber(mass, 4)}, ` +
    `se transforma en el intervalo de y entre ${f(ylo)} y ${f(yhi)}. Muestras simuladas de Y: ${sim.total}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        {
          label: 'Probabilidad de la franja',
          value: formatNumber(mass, 4),
          color: DATA_COLORS.highlight,
        },
        { label: 'Ancho en x', value: f(right - left) },
        { label: 'Ancho en y', value: f(yhi - ylo) },
        { label: "|g'(x)|", value: f(slope) },
        { label: 'f_Y(y) en el centro', value: f(fy), color: DATA_COLORS.secondary },
        { label: 'Muestras de Y', value: String(sim.total) },
      ]}
      legend={[
        { label: 'Franja y su imagen', color: DATA_COLORS.highlight },
        { label: 'Histograma simulado de Y', color: DATA_COLORS.secondary },
        { label: 'Densidad por la fórmula', color: DATA_COLORS.text, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.32} minHeight={170} maxHeight={260}>
        {(box) => {
          const sx = scaleLinear()
            .domain(xDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const points = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
            const t = x0 + ((x1 - x0) * i) / CURVE_POINTS;
            return { x: t, y: X.pdf(t) };
          });
          const peak = Math.max(...points.map((p) => p.y).filter(Number.isFinite));
          const sy = scaleLinear()
            .domain([0, peak * 1.15])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={3}
                label="densidad de X"
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="x"
              />
              <CurvePath
                points={points.filter((p) => p.x >= left && p.x <= right)}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.highlight}
                fill
                fillOpacity={0.6}
                animate={false}
              />
              <CurvePath
                points={points.map((p) => ({ x: p.x, y: Math.min(peak * 1.15, p.y) }))}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.text}
                animate={false}
              />
            </>
          );
        }}
      </ChartSvg>
      <DensityHistogram
        start={yDomain[0]}
        width={binWidth}
        densities={densities}
        curves={[
          {
            f: (v) => transformedDensity((t) => X.pdf(t), transform, v),
            color: DATA_COLORS.text,
            dashed: true,
          },
        ]}
        domain={yDomain}
        label={description}
        axisLabel="y"
        aspect={0.32}
      >
        {({ x, box }) => (
          <rect
            aria-hidden="true"
            x={x(ylo)}
            y={box.inner.top}
            width={Math.max(2, x(yhi) - x(ylo))}
            height={box.inner.height}
            fill={DATA_COLORS.highlight}
            fillOpacity={0.3}
          />
        )}
      </DensityHistogram>
      <p className={styles.caption}>
        La franja de arriba y su imagen abajo contienen la misma probabilidad. Donde g estira la
        franja (|g&apos;(x)| grande), la misma probabilidad se reparte en más espacio y la densidad
        de Y baja.
      </p>
    </VizFrame>
  );
}
