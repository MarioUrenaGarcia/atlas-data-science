import { useMemo, useState } from 'react';
import { standardNormalCdf } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  chebyshevBound,
  LLN_POPULATIONS,
  runningMeans,
  type LlnPopulationId,
} from '../../../lib/limits/lln.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { pathStatistics } from '../../shared/pathStatistics.ts';
import { SeriesChart, type Series } from '../../shared/SeriesChart.tsx';
import { TrajectoryCanvas, type Envelope } from '../../shared/TrajectoryCanvas.tsx';
import styles from './LargeNumbers.module.css';

const SWEEP_SECONDS = 12;
const SUMMARY_POINTS = 300;

interface MeansViewProps {
  title: string;
  strong: boolean;
  population: LlnPopulationId;
  populations: readonly LlnPopulationId[];
  epsilon: number;
  count: number;
  horizon: number;
  logX: boolean;
  seed: number;
}

/**
 * Running means of many independent sequences. The weak law is read at a
 * fixed n (how many paths are outside the band now); the strong law looks
 * at the whole future of each path (how many will still leave it).
 */
export function MeansView({
  title,
  strong,
  population,
  populations,
  epsilon,
  count,
  horizon,
  logX,
  seed: initialSeed,
}: MeansViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(populations.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'poblacion',
              label: 'Población',
              options: populations.map((id) => ({ value: id, label: LLN_POPULATIONS[id].label })),
              default: population,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'epsilon',
        label: 'Tolerancia',
        symbol: 'ε',
        min: 0.01,
        max: 1.5,
        step: 0.01,
        default: epsilon,
      },
    ],
    [populations, population, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as LlnPopulationId;
  const eps = Number(values.epsilon);
  const definition = LLN_POPULATIONS[selected];
  const hasMean = Number.isFinite(definition.mean);
  const center = hasMean ? definition.mean : 0;
  const finiteVariance = Number.isFinite(definition.sd);

  const seed = useSeed(initialSeed);
  const paths = useMemo(
    () => runningMeans(definition, count, horizon, new Random(seed.seed)),
    [definition, count, horizon, seed.seed],
  );
  const stats = useMemo(() => pathStatistics(paths, eps, center), [paths, eps, center]);

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${selected}|${seed.seed}|${run}`, () => 1);
  // On a logarithmic axis n grows geometrically so every decade takes the same time.
  const growth = horizon ** (1 / SUMMARY_POINTS);
  const advance = (steps: number) =>
    update((value) =>
      Math.min(
        horizon,
        logX ? Math.max(value + steps, Math.ceil(value * growth ** steps)) : value + steps,
      ),
    );
  const playback = usePlayback({
    step: () => advance(1),
    stepMany: advance,
    reset: () => setRun((value) => value + 1),
    rate: (logX ? SUMMARY_POINTS : horizon) / SWEEP_SECONDS,
    done: revealed >= horizon,
  });

  const n = revealed;
  const outside = stats.outside[n - 1] ?? 0;
  const supOutside = stats.supOutside[n - 1] ?? 0;
  const bound = finiteVariance ? chebyshevBound(definition.sd, n, eps) : Number.NaN;
  const normalApprox = finiteVariance
    ? 2 * (1 - standardNormalCdf((eps * Math.sqrt(n)) / definition.sd))
    : Number.NaN;

  const band = useMemo<Envelope[]>(
    () => [
      {
        lower: () => center - eps,
        upper: () => center + eps,
        color: DATA_COLORS.secondary,
        fill: true,
      },
    ],
    [center, eps],
  );
  const alert = useMemo(
    () =>
      strong ? stats.lastExit.map((last) => last !== null && last >= revealed - 1) : undefined,
    [strong, stats.lastExit, revealed],
  );

  const sampleIndices = useMemo(() => {
    const result = new Set<number>();
    for (let k = 0; k <= SUMMARY_POINTS; k += 1) {
      const t = k / SUMMARY_POINTS;
      result.add(logX ? Math.round(horizon ** t) : Math.max(1, Math.round(t * horizon)));
    }
    return [...result].sort((a, b) => a - b);
  }, [horizon, logX]);
  const observed = (array: Float64Array) =>
    sampleIndices.filter((m) => m <= n).map((m) => ({ x: m, y: array[m - 1] ?? 0 }));
  const theory = (f: (m: number) => number) => sampleIndices.map((m) => ({ x: m, y: f(m) }));

  const summary: Series[] = [
    { points: observed(stats.outside), color: DATA_COLORS.text, width: 2 },
    ...(strong
      ? [{ points: observed(stats.supOutside), color: DATA_COLORS.highlight, width: 2.5 }]
      : []),
    ...(!strong && finiteVariance
      ? [
          {
            points: theory((m) => chebyshevBound(definition.sd, m, eps)),
            color: DATA_COLORS.tertiary,
            dashed: true,
          },
          {
            points: theory(
              (m) => 2 * (1 - standardNormalCdf((eps * Math.sqrt(m)) / definition.sd)),
            ),
            color: DATA_COLORS.muted,
            dashed: true,
          },
        ]
      : []),
  ];

  const muTex = hasMean ? formatNumber(definition.mean, 3) : '0';
  const header = strong
    ? `P\\Big(\\sup_{m \\ge ${n}} |\\bar{X}_m - ${muTex}| > ${eps.toFixed(2)}\\Big) \\approx ${formatNumber(supOutside, 3)}`
    : `P(|\\bar{X}_{${n}} - ${muTex}| > ${eps.toFixed(2)}) \\approx ${formatNumber(outside, 3)}` +
      (finiteVariance
        ? `\\ \\le\\ \\frac{\\sigma^2}{n\\varepsilon^2} = ${formatNumber(bound, 3)}`
        : '');

  const meanText = hasMean ? `media ${formatNumber(definition.mean, 3)}` : 'sin media';
  const description =
    `${definition.label} (${meanText}). ${count} trayectorias de la media acumulada hasta n = ${n}. ` +
    `Fuera de la banda de ancho ${eps.toFixed(2)}: ${formatNumber(outside * 100, 1)} %.` +
    (strong ? ` Con alguna salida posterior a n: ${formatNumber(supOutside * 100, 1)} %.` : '') +
    (!hasMean ? ' La población no tiene media: las medias no se estabilizan.' : '') +
    (hasMean && !finiteVariance
      ? ' La varianza es infinita: la media converge, pero lentamente y con saltos.'
      : '');

  const readouts = [
    { label: 'n', value: String(n) },
    {
      label: 'Media poblacional μ',
      value: hasMean ? formatNumber(definition.mean, 4) : 'no existe',
    },
    { label: 'Fuera de la banda en n', value: formatNumber(outside, 3), color: DATA_COLORS.text },
    ...(strong
      ? [
          {
            label: 'Con alguna salida después de n (dentro del horizonte)',
            value: formatNumber(supOutside, 3),
            color: DATA_COLORS.highlight,
          },
        ]
      : [
          {
            label: 'Cota de Chebyshev',
            value: finiteVariance ? formatNumber(bound, 3) : 'no aplica',
            color: DATA_COLORS.tertiary,
          },
          {
            label: 'Aproximación normal',
            value: finiteVariance ? formatNumber(normalApprox, 3) : 'no aplica',
          },
        ]),
  ];

  const legend = [
    { label: 'Tres trayectorias destacadas', color: DATA_COLORS.primary, shape: 'line' as const },
    { label: 'Banda μ ± ε', color: DATA_COLORS.secondary },
    {
      label: 'Fracción observada fuera de la banda',
      color: DATA_COLORS.text,
      shape: 'line' as const,
    },
    ...(strong
      ? [
          {
            label: 'Trayectorias que aún saldrán y fracción con salidas futuras',
            color: DATA_COLORS.highlight,
            shape: 'line' as const,
          },
        ]
      : [
          { label: 'Cota de Chebyshev', color: DATA_COLORS.tertiary, shape: 'dashed' as const },
          { label: 'Aproximación normal', color: DATA_COLORS.muted, shape: 'dashed' as const },
        ]),
  ];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={readouts}
      legend={legend}
      description={description}
      graphic="canvas"
    >
      <FormulaLine tex={header} />
      <p className={styles.panelTitle}>Media acumulada de cada trayectoria</p>
      <TrajectoryCanvas
        paths={paths}
        revealed={revealed}
        yDomain={[center - definition.window, center + definition.window]}
        label={description}
        envelopes={band}
        alert={alert}
        logX={logX}
      />
      <p className={styles.panelTitle}>
        {strong
          ? 'Fracción fuera de la banda en n y fracción que todavía sale de ella después de n'
          : 'Fracción de trayectorias fuera de la banda en cada n'}
      </p>
      <SeriesChart
        series={summary}
        xDomain={[1, horizon]}
        yDomain={[0, 1]}
        logX={logX}
        label={`Resumen por n. ${description}`}
      />
    </VizFrame>
  );
}
