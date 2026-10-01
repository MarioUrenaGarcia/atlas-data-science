import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { kolmogorovCdf, kolmogorovPdf, ksDistance } from '../../../lib/limits/empirical.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { binValues, makeBins } from '../../shared/binning.ts';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { TrajectoryCanvas } from '../../shared/TrajectoryCanvas.tsx';
import styles from './EmpiricalProcessViz.module.css';

const N_MAX = 2000;
const SHOWN = 20;
const GRID = 200;
const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 2000;
const KS_DOMAIN: [number, number] = [0, 2.5];
const uniformCdf = (u: number) => Math.min(1, Math.max(0, u));

/** sqrt(n) (F_n(u) - u) on a grid of u for one uniform sample. */
function empiricalProcess(sample: readonly number[]): Float64Array {
  const sorted = [...sample].sort((a, b) => a - b);
  const n = sorted.length;
  const path = new Float64Array(GRID + 1);
  let k = 0;
  for (let i = 0; i <= GRID; i += 1) {
    const u = i / GRID;
    while (k < n && (sorted[k] ?? 0) <= u) k += 1;
    path[i] = Math.sqrt(n) * (k / n - u);
  }
  return path;
}

interface DonskerEmpiricalViewProps {
  title: string;
  n: number;
  seed: number;
}

/**
 * Donsker's theorem for the empirical process. With uniform data,
 * sqrt(n)(F_n(u) - u) behaves like a Brownian bridge: it starts and ends at
 * 0 and wanders in between. Its largest absolute value, sqrt(n) D_n, follows
 * the Kolmogorov distribution whatever the continuous population.
 */
export function DonskerEmpiricalView({
  title,
  n: initialN,
  seed: initialSeed,
}: DonskerEmpiricalViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 5,
        max: N_MAX,
        step: 5,
        default: initialN,
        digits: 0,
      },
    ],
    [initialN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Number(values.n);

  const seed = useSeed(initialSeed);
  const shown = useMemo(() => {
    const random = new Random(seed.seed + 7);
    return Array.from({ length: SHOWN }, () =>
      empiricalProcess(Array.from({ length: n }, () => random.uniform())),
    );
  }, [seed.seed, n]);

  const [run, setRun] = useState(0);
  const runKey = `${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [statistics, update] = useResettableState<number[]>(`${runKey}|${seed.seed}`, () => []);
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws = Array.from({ length: count }, () => {
        const sample = Array.from({ length: n }, () => generator.uniform());
        return Math.sqrt(n) * ksDistance(sample, uniformCdf).distance;
      });
      update((previous) => [...previous, ...draws].slice(0, MAX_SAMPLES));
    },
    [random, n, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: statistics.length >= MAX_SAMPLES,
  });
  const bins = useMemo(() => makeBins(KS_DOMAIN[0], KS_DOMAIN[1], null), []);
  const densities = useMemo(() => binValues(statistics, bins), [statistics, bins]);
  const count = statistics.length;
  const beyond = count > 0 ? statistics.filter((v) => v > 1.358).length / count : Number.NaN;

  const description =
    `${SHOWN} procesos empíricos √n (Fₙ(u) - u) con n = ${n} observaciones uniformes. ` +
    `En ${count} muestras, √n Dₙ supera 1.358 con frecuencia ${formatNumber(beyond, 3)}; la distribución de Kolmogorov da ${formatNumber(1 - kolmogorovCdf(1.358), 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras para √n Dₙ', value: String(count) },
        {
          label: 'P(√n Dₙ > 1.358) observada',
          value: formatNumber(beyond, 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'P(K > 1.358), Kolmogorov',
          value: formatNumber(1 - kolmogorovCdf(1.358), 3),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Media observada de √n Dₙ',
          value: formatNumber(
            count > 0 ? statistics.reduce((t, v) => t + v, 0) / count : Number.NaN,
            3,
          ),
        },
        {
          label: 'Media de Kolmogorov √(π/2) log 2',
          value: formatNumber(Math.sqrt(Math.PI / 2) * Math.LN2, 3),
        },
      ]}
      legend={[
        { label: 'Tres procesos destacados', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Histograma de √n Dₙ', color: DATA_COLORS.secondary },
        { label: 'Densidad de Kolmogorov', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
      graphic="canvas"
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\sqrt{${n}}\\,\\big(F_{${n}}(u) - u\\big) \\xrightarrow{d} \\mathbb{B}(u),\\qquad \\sqrt{n}\\,D_n \\xrightarrow{d} \\sup_u |\\mathbb{B}(u)|`}
        />
      </p>
      <p className={styles.panelTitle}>Procesos empíricos: se parecen a puentes brownianos</p>
      <TrajectoryCanvas
        paths={shown}
        revealed={GRID + 1}
        yDomain={[-2, 2]}
        label={description}
        xRange={[0, 1]}
        xLabel="u = F(x)"
        aspect={0.42}
      />
      <p className={styles.panelTitle}>Distancia de Kolmogorov-Smirnov reescalada</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        curves={[{ f: kolmogorovPdf, color: DATA_COLORS.primary }]}
        domain={KS_DOMAIN}
        label={`Histograma de raíz de n por D. ${description}`}
        axisLabel="√n Dₙ"
        aspect={0.3}
      />
    </VizFrame>
  );
}
