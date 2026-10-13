import { scaleLinear } from 'd3-scale';
import { useCallback, useId, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  BIVARIATE_TRANSFORMS,
  quadraticForm,
  sampleBivariateNormal,
  type BivariateTransformId,
} from '../../../lib/limits/delta.ts';
import { standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import styles from './AsymptoticTransform.module.css';

const N_MAX = 400;
const SAMPLES_PER_SECOND = 30;
const MAX_SAMPLES = 1500;
const WINDOW_SDS = 3.5;
const BINS = 40;
const LEVELS = [-2, -1, 0, 1, 2];

type Point = [number, number];

interface BivariateDeltaViewProps {
  title: string;
  means: [number, number];
  sds: [number, number];
  rho: number;
  transform: BivariateTransformId;
  transforms: readonly BivariateTransformId[];
  n: number;
  seed: number;
}

/**
 * Multivariate delta method. The pair of means scatters in an ellipse around
 * mu; g changes, to first order, only along its gradient, so the spread of
 * g(means) is the spread of the cloud projected on the gradient:
 * grad g^T Sigma grad g / n.
 */
export function BivariateDeltaView({
  title,
  means,
  sds,
  rho,
  transform,
  transforms,
  n: initialN,
  seed: initialSeed,
}: BivariateDeltaViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(transforms.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'transformacion',
              label: 'Función g',
              options: transforms.map((id) => ({
                value: id,
                label: BIVARIATE_TRANSFORMS[id].label,
              })),
              default: transform,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 2,
        max: N_MAX,
        step: 1,
        default: initialN,
        digits: 0,
      },
      {
        type: 'number' as const,
        key: 'rho',
        label: 'Correlación entre X e Y',
        symbol: 'ρ',
        min: -0.9,
        max: 0.9,
        step: 0.05,
        default: rho,
      },
    ],
    [transforms, transform, initialN, rho],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    transforms.length > 1 ? String(values.transformacion) : transform
  ) as BivariateTransformId;
  const n = Number(values.n);
  const correlation = Number(values.rho);
  const g = BIVARIATE_TRANSFORMS[selected];
  const covariance = useMemo(
    () =>
      [
        [sds[0] ** 2, correlation * sds[0] * sds[1]],
        [correlation * sds[0] * sds[1], sds[1] ** 2],
      ] as const,
    [sds, correlation],
  );
  const gradient = g.gradient(means[0], means[1]);
  const deltaSd = Math.sqrt(quadraticForm(gradient, covariance) / n);
  const center = g.g(means[0], means[1]);

  const clip = `delta-clip-${useId().replace(/:/g, '')}`;
  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${n}|${correlation}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [pairs, update] = useResettableState<Point[]>(`${runKey}|${seed.seed}`, () => []);
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws: Point[] = [];
      for (let k = 0; k < count; k += 1) {
        let sx = 0;
        let sy = 0;
        for (let i = 0; i < n; i += 1) {
          const [x, y] = sampleBivariateNormal(generator, means, sds, correlation);
          sx += x;
          sy += y;
        }
        draws.push([sx / n, sy / n]);
      }
      update((previous) => [...previous, ...draws].slice(0, MAX_SAMPLES));
    },
    [random, n, means, sds, correlation, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: pairs.length >= MAX_SAMPLES,
  });

  const se: [number, number] = [sds[0] / Math.sqrt(n), sds[1] / Math.sqrt(n)];
  const gValues = useMemo(() => pairs.map(([x, y]) => g.g(x, y)), [pairs, g]);
  const lo = center - 4 * deltaSd;
  const hi = center + 4 * deltaSd;
  const hist = useMemo(() => {
    const width = (hi - lo) / BINS;
    const counts = new Array<number>(BINS).fill(0);
    for (const value of gValues) {
      const index = Math.floor((value - lo) / width);
      if (index >= 0 && index < BINS) counts[index] = (counts[index] ?? 0) + 1;
    }
    return counts.map((c) => c / (Math.max(1, gValues.length) * width));
  }, [gValues, lo, hi]);
  const observedSd = gValues.length > 1 ? standardDeviation(gValues) : Number.NaN;
  const f = (value: number) => formatNumber(value, 3);

  const description =
    `${g.label} de las medias de X e Y, con medias ${f(means[0])} y ${f(means[1])}, desviaciones ${f(sds[0])} y ${f(sds[1])} y correlación ${f(correlation)}. ` +
    `Gradiente en μ: (${f(gradient[0])}, ${f(gradient[1])}). Desviación predicha de g ${formatNumber(deltaSd, 4)}; observada ${formatNumber(observedSd, 4)} con ${pairs.length} pares simulados.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Pares simulados', value: String(pairs.length) },
        {
          label: '∇g(μ)',
          value: `(${f(gradient[0])}, ${f(gradient[1])})`,
          color: DATA_COLORS.highlight,
        },
        { label: 'g(μ)', value: formatNumber(center, 4) },
        {
          label: 'Desviación de g por el método delta',
          value: formatNumber(deltaSd, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Desviación observada',
          value: formatNumber(observedSd, 4),
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Pares de medias (X̄ₙ, Ȳₙ)', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Gradiente de g en μ', color: DATA_COLORS.highlight, shape: 'line' },
        {
          label: 'Curvas de nivel de la aproximación lineal',
          color: DATA_COLORS.muted,
          shape: 'dashed',
        },
        { label: 'Normal del método delta', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`${g.latex},\\qquad g(\\bar{X}_{${n}}, \\bar{Y}_{${n}}) \\approx \\mathcal{N}\\Big(g(\\boldsymbol{\\mu}),\\ \\frac{\\nabla g^\\top \\boldsymbol{\\Sigma}\\, \\nabla g}{n}\\Big) = \\mathcal{N}\\big(${formatNumber(center, 3)},\\ ${formatNumber(deltaSd, 3)}^2\\big)`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Pares de medias alrededor de μ</p>
          <ChartSvg
            label={description}
            aspect={0.9}
            minHeight={240}
            maxHeight={360}
            margins={{ left: 50, right: 12 }}
          >
            {(box) => {
              const x = scaleLinear()
                .domain([means[0] - WINDOW_SDS * se[0], means[0] + WINDOW_SDS * se[0]])
                .range([box.inner.left, box.inner.left + box.inner.width]);
              const y = scaleLinear()
                .domain([means[1] - WINDOW_SDS * se[1], means[1] + WINDOW_SDS * se[1]])
                .range([box.inner.top + box.inner.height, box.inner.top]);
              const squared = gradient[0] ** 2 + gradient[1] ** 2 || 1;
              // Level lines of the linearization g(mu) + grad g . (p - mu) = g(mu) + k * deltaSd
              // pass through mu + k deltaSd grad g / |grad g|^2 and run perpendicular to the gradient.
              const reach = (10 * Math.max(se[0], se[1])) / Math.sqrt(squared);
              const levelLines = LEVELS.map((k) => {
                const px = means[0] + (k * deltaSd * gradient[0]) / squared;
                const py = means[1] + (k * deltaSd * gradient[1]) / squared;
                return {
                  k,
                  x1: x(px - reach * gradient[1]),
                  y1: y(py + reach * gradient[0]),
                  x2: x(px + reach * gradient[1]),
                  y2: y(py - reach * gradient[0]),
                };
              });
              const ax = x(means[0] + gradient[0]) - x(means[0]);
              const ay = y(means[1] + gradient[1]) - y(means[1]);
              const arrowScale =
                (Math.min(box.inner.width, box.inner.height) * 0.3) / (Math.hypot(ax, ay) || 1);
              return (
                <>
                  <Axis
                    scale={y}
                    orientation="left"
                    position={box.inner.left}
                    gridLength={box.inner.width}
                    ticks={5}
                  />
                  <Axis
                    scale={x}
                    orientation="bottom"
                    position={box.inner.top + box.inner.height}
                    ticks={4}
                    label="X̄ₙ"
                  />
                  <defs>
                    <clipPath id={clip}>
                      <rect
                        x={box.inner.left}
                        y={box.inner.top}
                        width={box.inner.width}
                        height={box.inner.height}
                      />
                    </clipPath>
                  </defs>
                  <g aria-hidden="true" clipPath={`url(#${clip})`}>
                    {pairs.map(([px, py], i) => (
                      <circle
                        key={i}
                        cx={x(px)}
                        cy={y(py)}
                        r={2}
                        fill={DATA_COLORS.secondary}
                        fillOpacity={0.5}
                      />
                    ))}
                    {levelLines.map(({ k, x1, y1, x2, y2 }) => (
                      <line
                        key={k}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={DATA_COLORS.muted}
                        strokeDasharray={k === 0 ? undefined : '5 4'}
                        strokeWidth={k === 0 ? 1.5 : 1}
                      />
                    ))}
                  </g>
                  <Arrow
                    x1={x(means[0])}
                    y1={y(means[1])}
                    x2={x(means[0]) + ax * arrowScale}
                    y2={y(means[1]) + ay * arrowScale}
                    color={DATA_COLORS.highlight}
                    width={2.5}
                  />
                </>
              );
            }}
          </ChartSvg>
        </div>
        <div>
          <p className={styles.panelTitle}>Valores de g(X̄ₙ, Ȳₙ)</p>
          <DensityHistogram
            start={lo}
            width={(hi - lo) / BINS}
            densities={hist}
            curves={[
              {
                f: (v) =>
                  Math.exp(-0.5 * ((v - center) / deltaSd) ** 2) /
                  (deltaSd * Math.sqrt(2 * Math.PI)),
                color: DATA_COLORS.primary,
              },
            ]}
            domain={[lo, hi]}
            label={`Histograma de g. ${description}`}
            axisLabel="g(X̄ₙ, Ȳₙ)"
            aspect={0.9}
            minTop={0}
          />
        </div>
      </div>
    </VizFrame>
  );
}
