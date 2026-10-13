import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { oscillation, randomSignSeries } from '../../../lib/limits/tail.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import { TrajectoryCanvas } from '../../shared/TrajectoryCanvas.tsx';
import styles from './TailEventsViz.module.css';

const PATHS = 30;
const SWEEP_STEPS = 240;
const STEPS_PER_SECOND = 24;
const GRID_POINTS = 40;
/** Oscillation below which a path counts as settled at the end of the horizon. */
const SETTLED = 0.25;

interface ZeroOneViewProps {
  title: string;
  exponent: number;
  horizon: number;
  seed: number;
}

/**
 * Kolmogorov's zero-one law with the random series sum eps_i / i^a.
 * Whether the series converges does not depend on any finite number of
 * signs, so it is a tail event and has probability 0 or 1: every path
 * settles when a > 1/2 and none does when a <= 1/2. Paths are colored by
 * the first sign, an event that is not in the tail, to show it plays no role.
 */
export function ZeroOneView({ title, exponent, horizon, seed: initialSeed }: ZeroOneViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'a',
        label: 'Exponente de los pesos',
        symbol: 'a',
        min: 0.3,
        max: 1.2,
        step: 0.05,
        default: exponent,
      },
    ],
    [exponent],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = Number(values.a);

  const seed = useSeed(initialSeed);
  const paths = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: PATHS }, () => randomSignSeries(horizon, a, random));
  }, [seed.seed, horizon, a]);
  const firstPositive = useMemo(() => paths.map((path) => (path[0] ?? 0) > 0), [paths]);
  const grid = useMemo(
    () => [
      ...new Set(
        Array.from({ length: GRID_POINTS }, (_, k) =>
          Math.max(1, Math.round((horizon / 2) ** (k / (GRID_POINTS - 1)))),
        ),
      ),
    ],
    [horizon],
  );
  const oscillations = useMemo(
    () => grid.map((n) => ({ n, values: paths.map((path) => oscillation(path, n)) })),
    [grid, paths],
  );

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${seed.seed}|${a}|${run}`, () => 1);
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

  const visible = oscillations.filter((o) => 2 * o.n <= revealed);
  const meanOsc = visible.map((o) => ({ x: o.n, y: o.values.reduce((t, v) => t + v, 0) / PATHS }));
  const maxOsc = visible.map((o) => ({ x: o.n, y: Math.max(...o.values) }));
  const finalOsc = oscillations[oscillations.length - 1]?.values ?? [];
  const settled = revealed >= horizon ? finalOsc.filter((v) => v < SETTLED).length : null;
  const converges = a > 0.5;
  const yMax = Math.max(1, ...paths.map((path) => Math.max(...Array.from(path, Math.abs)))) * 1.05;
  const plusSettled =
    revealed >= horizon ? finalOsc.filter((v, i) => v < SETTLED && firstPositive[i]).length : null;

  const description =
    `Serie aleatoria con pesos 1/i^${formatNumber(a, 2)} hasta n = ${revealed}. ` +
    (converges
      ? 'Como a > 1/2, la suma de las varianzas es finita y la serie converge con probabilidad 1: todas las trayectorias se estabilizan.'
      : 'Como a ≤ 1/2, la serie diverge con probabilidad 1: ninguna trayectoria se estabiliza.') +
    (settled !== null
      ? ` Al final del horizonte, ${settled} de ${PATHS} trayectorias oscilan menos de ${SETTLED} en la última mitad.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(revealed) },
        { label: 'Suma de varianzas Σ 1/i^(2a)', value: 2 * a > 1 ? 'finita' : 'infinita' },
        {
          label: 'P(la serie converge)',
          value: converges ? '1' : '0',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Trayectorias estabilizadas',
          value: settled === null ? 'al terminar' : `${settled} de ${PATHS}`,
        },
        {
          label: 'De ellas, con primer signo +',
          value:
            plusSettled === null
              ? 'al terminar'
              : `${plusSettled} de ${firstPositive.filter(Boolean).length}`,
        },
      ]}
      legend={[
        { label: 'Trayectorias con primer signo +', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Trayectorias con primer signo -', color: DATA_COLORS.neutral, shape: 'line' },
        { label: 'Oscilación media en [n, 2n]', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Oscilación máxima en [n, 2n]', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
      graphic="canvas"
    >
      <FormulaLine
        tex={`S_n = \\sum_{i=1}^{n} \\frac{\\varepsilon_i}{i^{${formatNumber(a, 2)}}},\\quad P\\Big(\\lim_{n\\to\\infty} S_n \\text{ existe}\\Big) = ${converges ? 1 : 0}`}
      />
      <p className={styles.panelTitle}>Sumas parciales de {PATHS} series con signos al azar</p>
      <TrajectoryCanvas
        paths={paths}
        revealed={revealed}
        yDomain={[-yMax, yMax]}
        label={description}
        alert={firstPositive}
        highlighted={0}
        logX
      />
      <p className={styles.panelTitle}>Oscilación de las sumas parciales entre n y 2n</p>
      <SeriesChart
        series={[
          { points: meanOsc, color: DATA_COLORS.primary, width: 2.5 },
          { points: maxOsc, color: DATA_COLORS.secondary, width: 2 },
        ]}
        xDomain={[1, Math.max(2, horizon / 2)]}
        yDomain={[0.001, Math.max(10, yMax * 2)]}
        logX
        logY
        label={`Oscilación. ${description}`}
        aspect={0.32}
      />
    </VizFrame>
  );
}
