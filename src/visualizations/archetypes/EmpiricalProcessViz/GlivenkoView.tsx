import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { ksDistance } from '../../../lib/limits/empirical.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { DistributionId } from '../../shared/distributionIds.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import { plotWindow } from '../../shared/plotWindow.ts';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import styles from './EmpiricalProcessViz.module.css';

const SWEEP_STEPS = 200;
const STEPS_PER_SECOND = 20;
const GRID_POINTS = 80;
const REPLICAS = 20;
/** Limit of E[sqrt(n) D_n]: sqrt(pi / 2) log 2. */
const KS_MEAN = Math.sqrt(Math.PI / 2) * Math.LN2;
const DOT_RADIUS = 5;

interface GlivenkoViewProps {
  title: string;
  populations: readonly DistributionId[];
  population: DistributionId;
  values: Record<string, number> | undefined;
  horizon: number;
  seed: number;
}

/**
 * Glivenko-Cantelli: the empirical distribution function of a growing sample
 * approaches the true one uniformly. The largest vertical gap D_n is marked;
 * on log-log axes it falls like 1/sqrt(n).
 */
export function GlivenkoView({
  title,
  populations,
  population,
  values: overrides,
  horizon,
  seed: initialSeed,
}: GlivenkoViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      populations.length > 1
        ? [
            {
              type: 'select',
              key: 'poblacion',
              label: 'Población',
              options: populations.map((id) => ({
                value: id,
                label: DISTRIBUTION_SPECS[id].label,
              })),
              default: population,
            },
          ]
        : [],
    [populations, population],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as DistributionId;
  const spec = DISTRIBUTION_SPECS[selected];
  const distribution = useMemo(
    () => spec.create(specValues(spec, selected === population ? overrides : undefined)),
    [spec, selected, population, overrides],
  );
  const xWindow = useMemo(
    () => plotWindow([distribution], spec.domain, spec.discrete),
    [distribution, spec],
  );

  const seed = useSeed(initialSeed);
  const samples = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: REPLICAS }, () =>
      Array.from({ length: horizon }, () => distribution.sample(random)),
    );
  }, [seed.seed, horizon, distribution]);
  const grid = useMemo(
    () => [
      ...new Set(
        Array.from({ length: GRID_POINTS }, (_, k) =>
          Math.max(1, Math.round(horizon ** (k / (GRID_POINTS - 1)))),
        ),
      ),
    ],
    [horizon],
  );
  const distances = useMemo(
    () =>
      grid.map((n) => {
        const all = samples.map(
          (sample) => ksDistance(sample.slice(0, n), distribution.cdf).distance,
        );
        return { n, first: all[0] ?? 0, mean: all.reduce((t, d) => t + d, 0) / all.length };
      }),
    [grid, samples, distribution],
  );

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${seed.seed}|${selected}|${run}`, () => 1);
  const growth = horizon ** (1 / SWEEP_STEPS);
  const advance = (steps: number) =>
    update((value) =>
      Math.min(horizon, Math.max(value + steps, Math.ceil(value * growth ** steps))),
    );
  const playback = usePlayback({
    step: () => advance(1),
    stepMany: advance,
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: revealed >= horizon,
  });

  const n = revealed;
  const sample = useMemo(
    () => [...(samples[0] ?? []).slice(0, n)].sort((a, b) => a - b),
    [samples, n],
  );
  const gap = useMemo(() => ksDistance(sample, distribution.cdf), [sample, distribution]);
  const ecdf = (x: number) => {
    let lo = 0;
    let hi = sample.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((sample[mid] ?? 0) <= x) lo = mid + 1;
      else hi = mid;
    }
    return lo / Math.max(1, sample.length);
  };
  const atF = distribution.cdf(gap.at);
  const atEcdf = ecdf(gap.at);
  const before = Math.max(0, sample.indexOf(gap.at)) / Math.max(1, sample.length);
  const otherEnd = Math.abs(atEcdf - atF) >= Math.abs(before - atF) ? atEcdf : before;

  const description =
    `Muestra de una población ${spec.label} con n = ${n} observaciones. La mayor distancia vertical entre la función de distribución empírica y la verdadera es D_n = ${formatNumber(gap.distance, 4)}, ` +
    `en x = ${formatNumber(gap.at, 3)}. √n D_n = ${formatNumber(Math.sqrt(n) * gap.distance, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        {
          label: 'Dₙ = sup |Fₙ(x) - F(x)|',
          value: formatNumber(gap.distance, 4),
          color: DATA_COLORS.highlight,
        },
        { label: '√n Dₙ', value: formatNumber(Math.sqrt(n) * gap.distance, 3) },
        { label: 'Valor típico de √n Dₙ', value: formatNumber(KS_MEAN, 3) },
      ]}
      legend={[
        { label: 'Fₙ, distribución empírica', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'F, distribución de la población', color: DATA_COLORS.primary, shape: 'dashed' },
        { label: 'Mayor distancia Dₙ', color: DATA_COLORS.highlight, shape: 'line' },
        {
          label: `Promedio de Dₙ en ${REPLICAS} muestras`,
          color: DATA_COLORS.tertiary,
          shape: 'line',
        },
        { label: '0.87 / √n', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`D_{${n}} = \\sup_x |F_{${n}}(x) - F(x)| = ${formatNumber(gap.distance, 4)}\\ \\xrightarrow{\\text{c.s.}}\\ 0`}
      />
      <p className={styles.panelTitle}>Distribución empírica frente a la verdadera</p>
      <FunctionPlot
        xDomain={xWindow}
        yDomain={[-0.03, 1.05]}
        label={description}
        aspect={0.45}
        curves={[
          { f: (x) => distribution.cdf(x), color: DATA_COLORS.primary, dashed: true, width: 2 },
          { f: ecdf, color: DATA_COLORS.secondary, width: 2 },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <line
              x1={s.x(gap.at)}
              x2={s.x(gap.at)}
              y1={s.y(atF)}
              y2={s.y(otherEnd)}
              stroke={DATA_COLORS.highlight}
              strokeWidth={3}
            />
            <circle
              cx={s.x(gap.at)}
              cy={s.y(atF)}
              r={DOT_RADIUS - 1}
              fill={DATA_COLORS.highlight}
            />
            {n <= 60 &&
              sample.map((value, i) => (
                <line
                  key={i}
                  x1={s.x(value)}
                  x2={s.x(value)}
                  y1={s.box.inner.top + s.box.inner.height}
                  y2={s.box.inner.top + s.box.inner.height - 8}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={1.5}
                />
              ))}
          </g>
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>Dₙ según n (ejes logarítmicos)</p>
      <SeriesChart
        series={[
          {
            points: distances.filter((d) => d.n <= n).map((d) => ({ x: d.n, y: d.first })),
            color: DATA_COLORS.highlight,
            width: 2,
          },
          {
            points: distances.map((d) => ({ x: d.n, y: d.mean })),
            color: DATA_COLORS.tertiary,
            width: 2,
          },
          {
            points: distances.map((d) => ({ x: d.n, y: KS_MEAN / Math.sqrt(d.n) })),
            color: DATA_COLORS.muted,
            dashed: true,
          },
        ]}
        xDomain={[1, horizon]}
        yDomain={[10 ** Math.floor(Math.log10(KS_MEAN / Math.sqrt(horizon) / 2)), 1]}
        logX
        logY
        label={`Distancia según n. ${description}`}
        aspect={0.32}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(Math.max(1e-6, gap.distance))}
            r={DOT_RADIUS}
            fill={DATA_COLORS.highlight}
          />
        )}
      </SeriesChart>
    </VizFrame>
  );
}
