import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  deltaApproximation,
  TRANSFORMS,
  transformLatex,
  type TransformId,
} from '../../../lib/limits/delta.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram, type HistogramCurve } from '../../shared/DensityHistogram.tsx';
import type { DistributionId } from '../../shared/distributionIds.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import styles from './AsymptoticTransform.module.css';

const N_MAX = 400;
const SAMPLES_PER_SECOND = 25;
const MAX_SAMPLES = 3000;
const WINDOW_SDS = 4;
const BINS = 40;
const DOT_RADIUS = 5;

const normalDensity = (center: number, sd: number) => (x: number) =>
  Math.exp(-0.5 * ((x - center) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

interface DeltaViewProps {
  title: string;
  population: DistributionId;
  values: Record<string, number> | undefined;
  transform: TransformId;
  transforms: readonly TransformId[];
  n: number;
  seed: number;
}

interface Simulation {
  means: number[];
}

function histogram(values: readonly number[], lo: number, hi: number) {
  const width = (hi - lo) / BINS;
  const counts = new Array<number>(BINS).fill(0);
  for (const value of values) {
    const index = Math.floor((value - lo) / width);
    if (index >= 0 && index < BINS) counts[index] = (counts[index] ?? 0) + 1;
  }
  return {
    start: lo,
    width,
    densities: counts.map((c) => c / (Math.max(1, values.length) * width)),
  };
}

/**
 * The delta method. Sample means are close to mu and nearly normal; near mu
 * a smooth g is almost its tangent line, so g(mean) is nearly normal with
 * standard deviation |g'(mu)| sigma / sqrt(n). When g'(mu) = 0 the tangent is
 * flat and the second order term takes over.
 */
export function DeltaView({
  title,
  population,
  values: overrides,
  transform,
  transforms,
  n: initialN,
  seed: initialSeed,
}: DeltaViewProps) {
  const spec = DISTRIBUTION_SPECS[population];
  const populationValues = useMemo(() => specValues(spec, overrides), [spec, overrides]);
  const distribution = useMemo(() => spec.create(populationValues), [spec, populationValues]);
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(transforms.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'transformacion',
              label: 'Transformación g',
              options: transforms.map((id) => ({ value: id, label: TRANSFORMS[id].label })),
              default: transform,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 1,
        max: N_MAX,
        step: 1,
        default: initialN,
        digits: 0,
      },
    ],
    [transforms, transform, initialN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    transforms.length > 1 ? String(values.transformacion) : transform
  ) as TransformId;
  const n = Number(values.n);
  const g = TRANSFORMS[selected];
  const mu = distribution.mean;
  const sigma = Math.sqrt(distribution.variance);
  const approx = deltaApproximation(g, mu, sigma, n);
  const slope = g.d1(mu);

  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    means: [],
  }));
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const means = Array.from({ length: count }, () => {
        let total = 0;
        for (let i = 0; i < n; i += 1) total += distribution.sample(generator);
        return total / n;
      });
      update((previous) => ({ means: [...previous.means, ...means].slice(0, MAX_SAMPLES) }));
    },
    [random, n, distribution, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.means.length >= MAX_SAMPLES,
  });

  const se = sigma / Math.sqrt(n);
  const xLo = Math.max(g.domain[0] + 1e-6, mu - WINDOW_SDS * se);
  const xHi = Math.min(g.domain[1] - 1e-6, mu + WINDOW_SDS * se);
  const transformed = useMemo(
    () => simulation.means.filter((m) => m > g.domain[0] && m < g.domain[1]).map((m) => g.g(m)),
    [simulation.means, g],
  );
  const gValues = [g.g(xLo), g.g(xHi), g.g(mu)];
  let yLo = Math.min(...gValues);
  let yHi = Math.max(...gValues);
  if (!approx.firstOrder) {
    // A flat tangent concentrates g(mean) on one side of g(mu).
    const spread = (Math.abs(g.d2(mu)) * se * se * WINDOW_SDS * WINDOW_SDS) / 2;
    yLo = Math.min(yLo, g.g(mu) - spread);
    yHi = Math.max(yHi, g.g(mu) + spread);
  }
  const pad = (yHi - yLo) * 0.05 || 0.1;
  yLo -= pad;
  yHi += pad;

  const meanHist = useMemo(
    () => histogram(simulation.means, xLo, xHi),
    [simulation.means, xLo, xHi],
  );
  const gHist = useMemo(() => histogram(transformed, yLo, yHi), [transformed, yLo, yHi]);
  const gCurves = useMemo<HistogramCurve[]>(() => {
    if (approx.firstOrder)
      return [{ f: normalDensity(approx.center, approx.sd), color: DATA_COLORS.primary }];
    // n (g(mean) - g(mu)) tends to g''(mu) sigma^2 / 2 times a chi-square with one degree of freedom.
    const scale = (g.d2(mu) * sigma * sigma) / (2 * n);
    return [
      {
        f: (y) => {
          const u = (y - approx.center) / scale;
          return u > 0 ? Math.exp(-u / 2) / Math.sqrt(2 * Math.PI * u) / Math.abs(scale) : 0;
        },
        color: DATA_COLORS.primary,
      },
    ];
  }, [approx.firstOrder, approx.center, approx.sd, g, mu, sigma, n]);

  const count = simulation.means.length;
  const last = count > 0 ? (simulation.means[count - 1] ?? Number.NaN) : Number.NaN;
  const observedSd = transformed.length > 1 ? standardDeviation(transformed) : Number.NaN;
  const gTex = (arg: string) => transformLatex(g, arg);
  const header = approx.firstOrder
    ? `${gTex('\\bar{X}_{' + n + '}')} \\approx \\mathcal{N}\\Big(${gTex('\\mu')},\\ \\frac{g'(\\mu)^2\\sigma^2}{n}\\Big) = \\mathcal{N}\\big(${formatNumber(approx.center, 3)},\\ ${formatNumber(approx.sd, 3)}^2\\big)`
    : `g'(\\mu) = 0:\\quad n\\big(g(\\bar{X}_{${n}}) - g(\\mu)\\big) \\to \\frac{g''(\\mu)\\,\\sigma^2}{2}\\,\\chi^2_1`;

  const description =
    `Población ${spec.label} con media ${formatNumber(mu, 3)} y desviación estándar ${formatNumber(sigma, 3)}; g = ${g.label}. ` +
    `Con n = ${n} se han simulado ${count} medias. ` +
    (approx.firstOrder
      ? `El método delta predice una desviación estándar de ${formatNumber(approx.sd, 4)} para g de la media; la observada es ${formatNumber(observedSd, 4)}.`
      : `La derivada de g se anula en μ, así que g de la media se acumula de un solo lado de g(μ).`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Medias simuladas', value: String(count) },
        {
          label: 'μ y σ de la población',
          value: `${formatNumber(mu, 3)} y ${formatNumber(sigma, 3)}`,
        },
        { label: "g'(μ)", value: formatNumber(slope, 4), color: DATA_COLORS.highlight },
        { label: 'Desviación de X̄ₙ, σ/√n', value: formatNumber(se, 4) },
        {
          label: 'Desviación de g(X̄ₙ) por el método delta',
          value: formatNumber(approx.sd, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Desviación observada de g(X̄ₙ)',
          value: formatNumber(observedSd, 4),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Media observada de g(X̄ₙ)',
          value: formatNumber(transformed.length > 0 ? mean(transformed) : Number.NaN, 4),
        },
      ]}
      legend={[
        { label: 'Curva g', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Recta tangente en μ', color: DATA_COLORS.highlight, shape: 'dashed' },
        { label: 'Histogramas simulados', color: DATA_COLORS.secondary },
        { label: 'Aproximación teórica', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <p className={styles.panelTitle}>La curva g cerca de μ y su recta tangente</p>
      <FunctionPlot
        xDomain={[xLo, xHi]}
        yDomain={[yLo, yHi]}
        label={description}
        aspect={0.42}
        xLabel="x̄"
        curves={[
          { f: (x) => g.g(x), color: DATA_COLORS.tertiary, width: 2.5 },
          {
            f: (x) => g.g(mu) + slope * (x - mu),
            color: DATA_COLORS.highlight,
            dashed: true,
            width: 2,
          },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <circle cx={s.x(mu)} cy={s.y(g.g(mu))} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />
            {Number.isFinite(last) && last > xLo && last < xHi && (
              <>
                <line
                  x1={s.x(last)}
                  x2={s.x(last)}
                  y1={s.box.inner.top + s.box.inner.height}
                  y2={s.y(g.g(last))}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="4 3"
                />
                <line
                  x1={s.box.inner.left}
                  x2={s.x(last)}
                  y1={s.y(g.g(last))}
                  y2={s.y(g.g(last))}
                  stroke={DATA_COLORS.secondary}
                  strokeDasharray="4 3"
                />
                <circle
                  cx={s.x(last)}
                  cy={s.y(g.g(last))}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.secondary}
                />
              </>
            )}
          </g>
        )}
      </FunctionPlot>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Medias X̄ₙ</p>
          <DensityHistogram
            start={meanHist.start}
            width={meanHist.width}
            densities={meanHist.densities}
            curves={[{ f: normalDensity(mu, se), color: DATA_COLORS.primary }]}
            domain={[xLo, xHi]}
            label={`Histograma de las medias. ${description}`}
            axisLabel="X̄ₙ"
            aspect={0.7}
            minTop={0}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Transformadas g(X̄ₙ)</p>
          <DensityHistogram
            start={gHist.start}
            width={gHist.width}
            densities={gHist.densities}
            curves={gCurves}
            domain={[yLo, yHi]}
            label={`Histograma de g de las medias. ${description}`}
            axisLabel="g(X̄ₙ)"
            aspect={0.7}
            minTop={0}
          />
        </div>
      </div>
    </VizFrame>
  );
}
