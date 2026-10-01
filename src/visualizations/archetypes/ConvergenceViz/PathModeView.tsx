import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { SEQUENCES, type SequenceId } from '../../../lib/limits/sequences.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { pathStatistics } from '../../shared/pathStatistics.ts';
import { SeriesChart, type Series } from '../../shared/SeriesChart.tsx';
import { TrajectoryCanvas, type Envelope } from '../../shared/TrajectoryCanvas.tsx';
import styles from './ConvergenceViz.module.css';
import { SEQUENCE_DISPLAY } from './display.ts';
import { simulateSequencePaths } from './pathStats.ts';
import type { PathMode } from './schema.ts';

/** Seconds that the reveal of the whole horizon takes at 1x speed. */
const SWEEP_SECONDS = 10;
const MEAN_SQUARE_FLOOR = 1e-3;

const yes = (value: boolean) => (value ? 'sí' : 'no');

interface PathModeViewProps {
  title: string;
  mode: PathMode;
  sequence: SequenceId;
  sequences: readonly SequenceId[];
  epsilon: number;
  count: number;
  horizon: number;
  seed: number;
}

/**
 * Many realizations of X_n - X. The mode decides the summary under the
 * paths: the fraction outside the band at each n (in probability), the
 * fraction that will still leave the band after n (almost surely) or the
 * mean squared distance (in mean square).
 */
export function PathModeView({
  title,
  mode,
  sequence,
  sequences,
  epsilon,
  count,
  horizon,
  seed: initialSeed,
}: PathModeViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(sequences.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'sucesion',
              label: 'Sucesión',
              options: sequences.map((id) => ({ value: id, label: SEQUENCES[id].label })),
              default: sequence,
            },
          ]
        : []),
      ...(mode === 'media-cuadratica'
        ? []
        : [
            {
              type: 'number' as const,
              key: 'epsilon',
              label: 'Tolerancia',
              symbol: 'ε',
              min: 0.02,
              max: 0.9,
              step: 0.01,
              default: epsilon,
            },
          ]),
    ],
    [sequences, sequence, mode, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (sequences.length > 1 ? String(values.sucesion) : sequence) as SequenceId;
  const eps = mode === 'media-cuadratica' ? epsilon : Number(values.epsilon);
  const definition = SEQUENCES[selected];
  const display = SEQUENCE_DISPLAY[selected];

  const seed = useSeed(initialSeed);
  const paths = useMemo(
    () => simulateSequencePaths(definition, count, horizon, seed.seed),
    [definition, count, horizon, seed.seed],
  );
  const stats = useMemo(() => pathStatistics(paths, eps), [paths, eps]);

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${selected}|${seed.seed}|${run}`, () => 1);
  const playback = usePlayback({
    step: () => update((value) => Math.min(horizon, value + 1)),
    stepMany: (steps) => update((value) => Math.min(horizon, value + steps)),
    reset: () => setRun((value) => value + 1),
    rate: horizon / SWEEP_SECONDS,
    done: revealed >= horizon,
  });

  const n = revealed;
  const index = n - 1;
  const outside = stats.outside[index] ?? 0;
  const supOutside = stats.supOutside[index] ?? 0;
  const meanSquare = stats.meanSquare[index] ?? 0;
  const theoryOutside = definition.outside?.(n, eps);
  const theoryTail = definition.tailSup?.(n, eps);
  const theoryMeanSquare = definition.meanSquare?.(n);

  const band = useMemo<Envelope[]>(
    () =>
      mode === 'media-cuadratica'
        ? []
        : [{ lower: () => -eps, upper: () => eps, color: DATA_COLORS.secondary, fill: true }],
    [mode, eps],
  );
  const alert = useMemo(
    () =>
      mode === 'casi-segura'
        ? stats.lastExit.map((last) => last !== null && last >= revealed - 1)
        : undefined,
    [mode, stats.lastExit, revealed],
  );
  const markers = mode === 'casi-segura' ? stats.lastExit : undefined;

  const range = (array: Float64Array, upTo: number) =>
    Array.from({ length: upTo }, (_, i) => ({ x: i + 1, y: array[i] ?? 0 }));
  const theoryCurve = (f: ((m: number) => number) | undefined) =>
    f ? Array.from({ length: horizon }, (_, i) => ({ x: i + 1, y: f(i + 1) })) : [];

  let summary: Series[];
  let summaryLabel: string;
  let header: string;
  let yDomain: [number, number] = [0, 1];
  let logY = false;
  if (mode === 'probabilidad') {
    summaryLabel = `Fracción de trayectorias fuera de la banda en cada n`;
    summary = [
      { points: range(stats.outside, n), color: DATA_COLORS.text, width: 2 },
      ...(definition.outside
        ? [
            {
              points: theoryCurve((m) => definition.outside?.(m, eps) ?? 0),
              color: DATA_COLORS.muted,
              dashed: true,
            },
          ]
        : []),
    ];
    header = `P(|X_{${n}} - X| > ${eps.toFixed(2)}) \\approx ${formatNumber(outside, 3)}`;
  } else if (mode === 'casi-segura') {
    summaryLabel =
      'Fracción fuera de la banda en n y fracción que todavía sale de ella después de n';
    summary = [
      { points: range(stats.outside, n), color: DATA_COLORS.text, width: 2 },
      { points: range(stats.supOutside, n), color: DATA_COLORS.highlight, width: 2.5 },
      ...(definition.tailSup
        ? [
            {
              points: theoryCurve((m) => definition.tailSup?.(m, eps) ?? 0),
              color: DATA_COLORS.muted,
              dashed: true,
            },
          ]
        : []),
    ];
    header = `P\\Big(\\sup_{m \\ge ${n}} |X_m - X| > ${eps.toFixed(2)}\\Big) \\approx ${formatNumber(supOutside, 3)}`;
  } else {
    summaryLabel = 'Promedio de (Xₙ - X)² en escala logarítmica';
    const top = Math.max(
      1,
      ...Array.from(stats.meanSquare),
      theoryMeanSquare ?? 0,
      definition.meanSquare?.(horizon) ?? 0,
    );
    yDomain = [MEAN_SQUARE_FLOOR, 10 ** Math.ceil(Math.log10(top * 1.5))];
    logY = true;
    summary = [
      { points: range(stats.meanSquare, n), color: DATA_COLORS.text, width: 2 },
      ...(definition.meanSquare
        ? [{ points: theoryCurve(definition.meanSquare), color: DATA_COLORS.muted, dashed: true }]
        : []),
    ];
    header = `\\mathbb{E}\\big[(X_{${n}} - X)^2\\big] \\approx ${formatNumber(meanSquare, 4)}`;
  }

  const flags = definition.converges;
  const description =
    `${definition.label}. ${count} trayectorias hasta n = ${n}. ` +
    (mode === 'media-cuadratica'
      ? `El promedio de (Xₙ - X)² es ${formatNumber(meanSquare, 4)}.`
      : `Fuera de la banda de ancho ${eps.toFixed(2)}: ${formatNumber(outside * 100, 1)} %. ` +
        (mode === 'casi-segura'
          ? `Todavía salen de la banda en algún momento posterior: ${formatNumber(supOutside * 100, 1)} %.`
          : '')) +
    ` Converge casi seguramente: ${yes(flags.casiSegura)}; en probabilidad: ${yes(flags.probabilidad)}; en media cuadrática: ${yes(flags.mediaCuadratica)}.`;

  const readouts = [
    { label: 'n', value: String(n) },
    ...(mode === 'media-cuadratica'
      ? [
          {
            label: 'Promedio de (Xₙ - X)²',
            value: formatNumber(meanSquare, 4),
            color: DATA_COLORS.text,
          },
          ...(theoryMeanSquare !== undefined
            ? [{ label: 'E[(Xₙ - X)²] exacto', value: formatNumber(theoryMeanSquare, 4) }]
            : []),
        ]
      : [
          {
            label: 'Fuera de la banda en n',
            value: formatNumber(outside, 3),
            color: DATA_COLORS.text,
          },
          ...(theoryOutside !== undefined
            ? [{ label: 'P(|Xₙ - X| > ε) exacta', value: formatNumber(theoryOutside, 4) }]
            : []),
        ]),
    ...(mode === 'casi-segura'
      ? [
          {
            label: 'Con alguna salida después de n (dentro del horizonte)',
            value: formatNumber(supOutside, 3),
            color: DATA_COLORS.highlight,
          },
          ...(theoryTail !== undefined
            ? [{ label: 'P(sup |Xₘ - X| > ε) exacta', value: formatNumber(theoryTail, 4) }]
            : []),
        ]
      : []),
    {
      label:
        mode === 'probabilidad'
          ? 'Converge en probabilidad'
          : mode === 'casi-segura'
            ? 'Converge casi seguramente'
            : 'Converge en media cuadrática',
      value: yes(
        mode === 'probabilidad'
          ? flags.probabilidad
          : mode === 'casi-segura'
            ? flags.casiSegura
            : flags.mediaCuadratica,
      ),
    },
  ];

  const legend = [
    { label: 'Tres trayectorias destacadas', color: DATA_COLORS.primary, shape: 'line' as const },
    { label: 'Resto de las trayectorias', color: DATA_COLORS.neutral, shape: 'line' as const },
    ...(mode === 'media-cuadratica'
      ? []
      : [{ label: 'Banda de tolerancia ± ε', color: DATA_COLORS.secondary }]),
    ...(mode === 'casi-segura'
      ? [
          {
            label: 'Trayectorias que aún saldrán de la banda',
            color: DATA_COLORS.highlight,
            shape: 'line' as const,
          },
          {
            label: 'Última salida de cada trayectoria',
            color: DATA_COLORS.highlight,
            shape: 'circle' as const,
          },
        ]
      : []),
    {
      label:
        mode === 'media-cuadratica'
          ? 'Promedio observado de (Xₙ - X)²'
          : 'Fracción observada fuera de la banda',
      color: DATA_COLORS.text,
      shape: 'line' as const,
    },
    { label: 'Valor exacto', color: DATA_COLORS.muted, shape: 'dashed' as const },
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
      <p className={styles.formula}>
        <Latex tex={`${definition.latex},\\qquad ${definition.limitLatex}`} />
      </p>
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <p className={styles.panelTitle}>Trayectorias de Xₙ - X</p>
      <TrajectoryCanvas
        paths={paths}
        revealed={revealed}
        yDomain={display.y}
        label={description}
        envelopes={band}
        markers={markers}
        alert={alert}
        points={display.spikes}
      />
      <p className={styles.panelTitle}>{summaryLabel}</p>
      <SeriesChart
        series={summary}
        xDomain={[1, horizon]}
        yDomain={yDomain}
        logY={logY}
        label={`${summaryLabel}. ${description}`}
      />
    </VizFrame>
  );
}
