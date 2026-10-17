import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
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

const SLOW_SAMPLES = 12;
const SLOW_RATE = 2;
const FAST_RATE = 60;
const DEFAULT_SAMPLES = 3000;
const SHOWN_ARROWS = 12;
const BINS = 30;
const CURVE_POINTS = 200;

interface Pair {
  x: number;
  u: number;
}

interface Simulation {
  pairs: Pair[];
  xCounts: number[];
  uCounts: number[];
  total: number;
}

interface QuantileMapViewProps {
  title: string;
  conceptId: string;
  config: TransformationVizConfig;
  /** True for inverse transform sampling (U to X); false for the probability integral transform (X to U). */
  inverse: boolean;
}

/**
 * The distribution function as a two-way map between X and a uniform U. In
 * the probability integral transform each sample of X goes up to the curve
 * and across to U = F(X), which turns out uniform. In inverse transform
 * sampling each uniform U goes across to the curve and down to X = F^{-1}(U),
 * which has the target distribution.
 */
export function QuantileMapView({ title, conceptId, config, inverse }: QuantileMapViewProps) {
  const setup = setupTransformation(config);
  const { x: X, xDomain } = setup;
  const [x0, x1] = xDomain;
  const maxSamples = config.muestras ?? DEFAULT_SAMPLES;
  const xWidth = (x1 - x0) / BINS;
  const uWidth = 1 / BINS;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const [run, setRun] = useState(0);
  const random = useRandomSource(seed.seed, `${run}`);
  const [sim, update] = useResettableState<Simulation>(`${run}|${seed.seed}`, () => ({
    pairs: [],
    xCounts: Array<number>(BINS).fill(0),
    uCounts: Array<number>(BINS).fill(0),
    total: 0,
  }));
  const draw = (count: number) => {
    const generator = random();
    const pairs = Array.from({ length: Math.min(count, maxSamples - sim.total) }, (): Pair => {
      if (inverse) {
        const u = generator.uniform();
        return { u, x: X.quantile(u) };
      }
      const x = X.sample(generator);
      return { x, u: X.cdf(x) };
    });
    update((previous) => {
      const xCounts = [...previous.xCounts];
      const uCounts = [...previous.uCounts];
      for (const pair of pairs) {
        const xb = Math.floor((pair.x - x0) / xWidth);
        if (xb >= 0 && xb < BINS) xCounts[xb] = (xCounts[xb] ?? 0) + 1;
        const ub = Math.min(BINS - 1, Math.floor(pair.u / uWidth));
        uCounts[ub] = (uCounts[ub] ?? 0) + 1;
      }
      return {
        pairs: [...previous.pairs, ...pairs].slice(-SHOWN_ARROWS),
        xCounts,
        uCounts,
        total: previous.total + pairs.length,
      };
    });
  };
  const slow = sim.total < SLOW_SAMPLES;
  const playback = usePlayback({
    step: () => draw(1),
    stepMany: draw,
    reset: () => setRun((value) => value + 1),
    rate: slow ? SLOW_RATE : FAST_RATE,
    done: sim.total >= maxSamples,
  });

  const last = sim.pairs.at(-1);
  const f = (v: number) => formatNumber(v, 3);
  const header = last
    ? inverse
      ? `U = ${f(last.u)} \\;\\Rightarrow\\; X = F^{-1}(${f(last.u)}) = ${f(last.x)}`
      : `X = ${f(last.x)} \\;\\Rightarrow\\; U = F(${f(last.x)}) = ${f(last.u)}`
    : inverse
      ? `U \\sim \\operatorname{Uniforme}(0, 1) \\;\\Rightarrow\\; F^{-1}(U) \\sim ${setup.notation}`
      : `X \\sim ${setup.notation} \\;\\Rightarrow\\; F(X) \\sim \\operatorname{Uniforme}(0, 1)`;
  const description =
    `${inverse ? 'Muestreo por transformada inversa' : 'Transformada integral de probabilidad'} con la distribución ${setup.label}. ` +
    `${sim.total} muestras.` +
    (last ? ` Última pareja: x = ${f(last.x)}, u = ${f(last.u)}.` : '');
  const densities = (counts: number[], width: number) =>
    counts.map((count) => (sim.total > 0 ? count / (sim.total * width) : 0));

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Muestras', value: String(sim.total) },
        { label: 'Último x', value: last ? f(last.x) : 'sin datos', color: DATA_COLORS.primary },
        { label: 'Último u', value: last ? f(last.u) : 'sin datos', color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Función de distribución F', color: DATA_COLORS.text, shape: 'line' },
        {
          label: inverse ? 'Recorrido de U a X' : 'Recorrido de X a U',
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
        { label: 'Histogramas de X y de U', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.45} minHeight={220} maxHeight={330}>
        {(box) => {
          const sx = scaleLinear()
            .domain(xDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
            const t = x0 + ((x1 - x0) * i) / CURVE_POINTS;
            return { x: t, y: X.cdf(t) };
          });
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="u = F(x)"
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="x"
              />
              <CurvePath
                points={curve}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.text}
                width={2.5}
                animate={false}
              />
              <g aria-hidden="true">
                {sim.pairs.map((pair, index) => {
                  const recent = index === sim.pairs.length - 1;
                  const cx = sx(Math.min(x1, Math.max(x0, pair.x)));
                  const cy = sy(pair.u);
                  return (
                    <g key={index} opacity={recent ? 1 : 0.35}>
                      <line
                        x1={cx}
                        x2={cx}
                        y1={sy(0)}
                        y2={cy}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={recent ? 2 : 1}
                      />
                      <line
                        x1={box.inner.left}
                        x2={cx}
                        y1={cy}
                        y2={cy}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={recent ? 2 : 1}
                      />
                      <circle cx={cx} cy={cy} r={recent ? 5 : 3} fill={DATA_COLORS.highlight} />
                      <circle cx={cx} cy={sy(0)} r={recent ? 4 : 2} fill={DATA_COLORS.primary} />
                      <circle
                        cx={box.inner.left}
                        cy={cy}
                        r={recent ? 4 : 2}
                        fill={DATA_COLORS.secondary}
                      />
                    </g>
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        {inverse
          ? 'Cada u uniforme en el eje vertical viaja horizontalmente hasta la curva y baja al eje x.'
          : 'Cada x simulada sube hasta la curva y viaja horizontalmente al eje vertical, donde queda u = F(x).'}
      </p>
      <div className={styles.panels}>
        <DensityHistogram
          start={x0}
          width={xWidth}
          densities={densities(sim.xCounts, xWidth)}
          curves={[{ f: (v) => X.pdf(v), color: DATA_COLORS.text, dashed: true }]}
          domain={xDomain}
          label={description}
          axisLabel="x"
          aspect={0.6}
        />
        <DensityHistogram
          start={0}
          width={uWidth}
          densities={densities(sim.uCounts, uWidth)}
          curves={[{ f: (v) => (v >= 0 && v <= 1 ? 1 : 0), color: DATA_COLORS.text, dashed: true }]}
          domain={[0, 1]}
          label={description}
          axisLabel="u"
          aspect={0.6}
          minTop={1.6}
        />
      </div>
    </VizFrame>
  );
}
