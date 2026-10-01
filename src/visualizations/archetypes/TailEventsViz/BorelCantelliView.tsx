import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  eventProbability,
  independentTailUnion,
  simulateEvents,
} from '../../../lib/limits/tail.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import { EventRaster } from './EventRaster.tsx';
import styles from './TailEventsViz.module.css';

const RUNS = 30;
const SWEEP_STEPS = 240;
const STEPS_PER_SECOND = 24;
const SUMMARY_POINTS = 120;

interface BorelCantelliViewProps {
  title: string;
  dependent: boolean;
  exponent: number;
  scale: number;
  horizon: number;
  seed: number;
}

/**
 * Borel-Cantelli lemmas. With independent events of probability c / n^s,
 * the occurrences stop for good when the probabilities are summable (s > 1)
 * and keep appearing forever otherwise. The dependent case A_n = {U < 1/n}
 * has a divergent sum and still only finitely many occurrences, which is why
 * the second lemma needs independence.
 */
export function BorelCantelliView({
  title,
  dependent,
  exponent,
  scale,
  horizon,
  seed: initialSeed,
}: BorelCantelliViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      dependent
        ? []
        : [
            {
              type: 'number',
              key: 's',
              label: 'Exponente',
              symbol: 's',
              min: 0.5,
              max: 2.5,
              step: 0.05,
              default: exponent,
            },
            {
              type: 'number',
              key: 'c',
              label: 'Constante',
              symbol: 'c',
              min: 0.2,
              max: 3,
              step: 0.1,
              default: scale,
            },
          ],
    [dependent, exponent, scale],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const s = dependent ? 1 : Number(values.s);
  const c = dependent ? 1 : Number(values.c);

  const seed = useSeed(initialSeed);
  const runs = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: RUNS }, () => simulateEvents(horizon, c, s, dependent, random));
  }, [seed.seed, horizon, c, s, dependent]);
  const tailTheory = useMemo(
    () =>
      dependent
        ? Float64Array.from({ length: horizon }, (_, i) => 1 / (i + 1))
        : independentTailUnion(horizon, c, s),
    [dependent, horizon, c, s],
  );
  // The simulation only sees events up to the horizon, so it is compared with
  // P(some A_m occurs for n <= m <= horizon); the infinite-horizon value is a readout.
  const horizonTail = useMemo(() => {
    if (dependent) return tailTheory;
    const result = new Float64Array(horizon);
    let logSurvival = 0;
    for (let n = horizon; n >= 1; n -= 1) {
      logSurvival += Math.log1p(-Math.min(1 - 1e-15, eventProbability(n, c, s)));
      result[n - 1] = 1 - Math.exp(logSurvival);
    }
    return result;
  }, [dependent, tailTheory, horizon, c, s]);
  const expected = useMemo(() => {
    const result = new Float64Array(horizon);
    let total = 0;
    for (let n = 1; n <= horizon; n += 1) {
      total += dependent ? 1 / n : eventProbability(n, c, s);
      result[n - 1] = total;
    }
    return result;
  }, [dependent, horizon, c, s]);

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${seed.seed}|${c}|${s}|${run}`, () => 1);
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

  const grid = useMemo(
    () => [
      ...new Set(
        Array.from({ length: SUMMARY_POINTS + 1 }, (_, k) =>
          Math.round(horizon ** (k / SUMMARY_POINTS)),
        ),
      ),
    ],
    [horizon],
  );
  const lastHits = runs.map((hits) => hits[hits.length - 1] ?? -1);
  const observedTail = grid
    .filter((n) => n <= revealed)
    .map((n) => ({ x: n, y: lastHits.filter((last) => last >= n - 1).length / RUNS }));
  const observedCount = grid
    .filter((n) => n <= revealed)
    .map((n) => ({
      x: n,
      y: runs.reduce((total, hits) => total + hits.filter((i) => i < n).length, 0) / RUNS,
    }));
  const countNow =
    runs.reduce((total, hits) => total + hits.filter((i) => i < revealed).length, 0) / RUNS;
  const stillHitting = lastHits.filter((last) => last >= revealed - 1).length;
  const sumNow = expected[revealed - 1] ?? 0;
  const maxCount = Math.max(1, expected[horizon - 1] ?? 1) * 1.1;

  const header = dependent
    ? `A_n = \\{U < 1/n\\}:\\quad \\sum_{k=1}^{${revealed}} P(A_k) = ${formatNumber(sumNow, 3)} \\to \\infty,\\quad P(A_n \\text{ infinitas veces}) = 0`
    : `P(A_n) = \\frac{${formatNumber(c, 1)}}{n^{${formatNumber(s, 2)}}},\\quad \\sum_{k=1}^{${revealed}} P(A_k) = ${formatNumber(sumNow, 3)}\\ ${s > 1 ? '\\to\\ \\text{finita}' : '\\to\\ \\infty'}`;
  const verdict = dependent || s > 1 ? 'solo ocurren finitos eventos' : 'ocurren infinitos eventos';
  const description =
    (dependent
      ? 'Eventos dependientes A_n = {U < 1/n} con un solo U uniforme. '
      : `Eventos independientes con probabilidad ${formatNumber(c, 1)}/n^${formatNumber(s, 2)}. `) +
    `Hasta n = ${revealed}, la suma de probabilidades es ${formatNumber(sumNow, 3)} y cada corrida tuvo en promedio ${formatNumber(countNow, 2)} eventos. ` +
    `${stillHitting} de ${RUNS} corridas tienen eventos en n o después (dentro del horizonte). Con probabilidad 1 ${verdict}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(revealed) },
        {
          label: 'Suma de P(Aₖ) hasta n',
          value: formatNumber(sumNow, 3),
          color: DATA_COLORS.muted,
        },
        {
          label: 'Eventos promedio por corrida',
          value: formatNumber(countNow, 3),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Corridas con eventos desde n',
          value: `${stillHitting} de ${RUNS}`,
          color: DATA_COLORS.highlight,
        },
        {
          label: 'P(algún evento entre n y el horizonte)',
          value: formatNumber(horizonTail[revealed - 1] ?? 0, 4),
        },
        {
          label: 'P(algún evento desde n, sin límite)',
          value: formatNumber(tailTheory[revealed - 1] ?? 0, 4),
        },
        { label: 'Conclusión', value: verdict },
      ]}
      legend={[
        { label: 'Ocurrencia de Aₙ', color: DATA_COLORS.primary },
        { label: 'Última ocurrencia de la corrida', color: DATA_COLORS.highlight },
        { label: 'Valor exacto', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
      graphic="canvas"
    >
      <FormulaLine tex={header} />
      <p className={styles.panelTitle}>Ocurrencias de Aₙ en {RUNS} corridas independientes</p>
      <EventRaster runs={runs} length={horizon} revealed={revealed} label={description} />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>
            Fracción de corridas con algún evento entre n y el horizonte
          </p>
          <SeriesChart
            series={[
              { points: observedTail, color: DATA_COLORS.highlight, width: 2.5 },
              {
                points: grid.map((n) => ({ x: n, y: horizonTail[n - 1] ?? 0 })),
                color: DATA_COLORS.muted,
                dashed: true,
              },
            ]}
            xDomain={[1, horizon]}
            yDomain={[0, 1.02]}
            logX
            label={`Fracción con eventos futuros. ${description}`}
            aspect={0.7}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Eventos acumulados y suma de probabilidades</p>
          <SeriesChart
            series={[
              { points: observedCount, color: DATA_COLORS.primary, width: 2.5 },
              {
                points: grid.map((n) => ({ x: n, y: expected[n - 1] ?? 0 })),
                color: DATA_COLORS.muted,
                dashed: true,
              },
            ]}
            xDomain={[1, horizon]}
            yDomain={[0, maxCount]}
            logX
            label={`Número medio de eventos frente a la suma de probabilidades. ${description}`}
            aspect={0.7}
          />
        </div>
      </div>
    </VizFrame>
  );
}
