import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { iteratedLogScale } from '../../../lib/limits/empirical.ts';
import { randomWalk } from '../../../lib/limits/lln.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { TrajectoryCanvas, type Envelope } from '../../shared/TrajectoryCanvas.tsx';
import styles from './LargeNumbers.module.css';

const SWEEP_STEPS = 360;
const STEPS_PER_SECOND = 30;
/** The record of |S_n| / sqrt(2 n log log n) is measured from here on, where the scale is stable. */
const RECORD_START = 100;

interface IteratedLogViewProps {
  title: string;
  count: number;
  horizon: number;
  seed: number;
}

/**
 * Random walks against three growth rates: sqrt(n), the typical size given
 * by the central limit theorem, and sqrt(2 n log log n), the exact size of
 * the largest excursions. The lower panel divides by the latter, so the
 * paths keep coming back near ±1 without ever settling.
 */
export function IteratedLogView({
  title,
  count,
  horizon,
  seed: initialSeed,
}: IteratedLogViewProps) {
  const seed = useSeed(initialSeed);
  const walks = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: count }, () => randomWalk(horizon, random));
  }, [count, horizon, seed.seed]);
  const ratios = useMemo(
    () =>
      walks.map((walk) =>
        walk.map((value, i) => {
          const scale = iteratedLogScale(i + 1);
          return Number.isFinite(scale) ? value / scale : 0;
        }),
      ),
    [walks],
  );

  // Running maximum over all paths of |ratio| from RECORD_START up to each n.
  const records = useMemo(() => {
    const result = new Float64Array(horizon);
    let best = 0;
    for (let i = 0; i < horizon; i += 1) {
      if (i >= RECORD_START - 1) {
        for (const path of ratios) best = Math.max(best, Math.abs(path[i] ?? 0));
      }
      result[i] = best;
    }
    return result;
  }, [ratios, horizon]);

  const [run, setRun] = useState(0);
  const [revealed, update] = useResettableState<number>(`${seed.seed}|${run}`, () => 3);
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
  const envelopes = useMemo<Envelope[]>(
    () => [
      {
        lower: (m) => -iteratedLogScale(Math.max(3, m)),
        upper: (m) => iteratedLogScale(Math.max(3, m)),
        color: DATA_COLORS.highlight,
      },
      {
        lower: (m) => -Math.sqrt(m),
        upper: (m) => Math.sqrt(m),
        color: DATA_COLORS.secondary,
        dashed: true,
      },
    ],
    [],
  );
  const unitBand = useMemo<Envelope[]>(
    () => [{ lower: () => -1, upper: () => 1, color: DATA_COLORS.highlight }],
    [],
  );
  const scaleN = iteratedLogScale(Math.max(3, n));
  const yMax = Math.ceil(iteratedLogScale(horizon) * 1.25);

  const record = n >= RECORD_START ? (records[n - 1] ?? 0) : 0;
  const beyondSqrt = walks.filter((walk) => Math.abs(walk[n - 1] ?? 0) > Math.sqrt(n)).length;
  const first = walks[0]?.[n - 1] ?? 0;
  const firstRatio = ratios[0]?.[n - 1] ?? 0;

  const description =
    `${count} caminatas aleatorias simples hasta n = ${n}. La primera vale S_n = ${first}, ` +
    `que dividida entre la raíz de 2 n log log n = ${formatNumber(scaleN, 1)} da ${formatNumber(firstRatio, 3)}. ` +
    `El mayor cociente en valor absoluto observado desde n = ${RECORD_START} es ${formatNumber(record, 3)}; ` +
    `la ley del logaritmo iterado dice que el límite superior de ese cociente es exactamente 1.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'Sₙ de la primera caminata', value: String(first), color: DATA_COLORS.primary },
        { label: '√(2n log log n)', value: formatNumber(scaleN, 2), color: DATA_COLORS.highlight },
        { label: '√n', value: formatNumber(Math.sqrt(n), 2), color: DATA_COLORS.secondary },
        { label: 'Caminatas con |Sₙ| > √n', value: `${beyondSqrt} de ${count}` },
        { label: 'Mayor |Sₙ| / √(2n log log n) observado', value: formatNumber(record, 3) },
      ]}
      legend={[
        { label: 'Tres caminatas destacadas', color: DATA_COLORS.primary, shape: 'line' },
        { label: '± √(2n log log n)', color: DATA_COLORS.highlight, shape: 'line' },
        { label: '± √n', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
      graphic="canvas"
    >
      <FormulaLine
        tex={`\\frac{S_{${n}}}{\\sqrt{2 \\cdot ${n}\\,\\log\\log ${n}}} = \\frac{${first}}{${formatNumber(scaleN, 2)}} = ${formatNumber(firstRatio, 3)}`}
      />
      <p className={styles.panelTitle}>Caminatas Sₙ y sus envolventes (eje n logarítmico)</p>
      <TrajectoryCanvas
        paths={walks}
        revealed={revealed}
        yDomain={[-yMax, yMax]}
        label={description}
        envelopes={envelopes}
        logX
      />
      <p className={styles.panelTitle}>Cociente Sₙ / √(2n log log n)</p>
      <TrajectoryCanvas
        paths={ratios}
        revealed={revealed}
        yDomain={[-1.6, 1.6]}
        label={`Cocientes normalizados. ${description}`}
        envelopes={unitBand}
        logX
        aspect={0.36}
      />
    </VizFrame>
  );
}
