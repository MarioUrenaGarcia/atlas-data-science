import { useMemo, useState } from 'react';
import { standardNormalCdf } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { binValues, makeBins } from '../../shared/binning.ts';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { TrajectoryCanvas } from '../../shared/TrajectoryCanvas.tsx';
import styles from './EmpiricalProcessViz.module.css';

const SHOWN_PATHS = 25;
const REPLICAS = 2000;
const STEPS_PER_SECOND = 1.5;
const MAX_LEVEL = 11;
const MAX_DOMAIN: [number, number] = [0, 3.5];

interface DonskerWalkViewProps {
  title: string;
  level: number;
  seed: number;
}

/**
 * Donsker's invariance principle for random walks. The walk with n steps of
 * ±1, compressed into [0, 1] and divided by sqrt(n), looks more and more like
 * Brownian motion; functionals such as its maximum converge to those of
 * Brownian motion, whose maximum on [0, 1] has density 2 phi(x).
 */
export function DonskerWalkView({ title, level, seed: initialSeed }: DonskerWalkViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'k',
        label: 'Pasos n = 2ᵏ',
        symbol: 'k',
        min: 1,
        max: MAX_LEVEL,
        step: 1,
        default: level,
        digits: 0,
      },
    ],
    [level],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(MAX_LEVEL, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= MAX_LEVEL,
  });
  const k = sweep ?? Number(values.k);
  const n = 2 ** k;

  const seed = useSeed(initialSeed);
  // Only the displayed walks are kept; the rest contribute their maximum.
  const { scaled, maxima } = useMemo(() => {
    const random = new Random(seed.seed);
    const shown: Float64Array[] = [];
    const tops: number[] = [];
    for (let r = 0; r < REPLICAS; r += 1) {
      const path = new Float64Array(n + 1);
      let top = 0;
      for (let i = 1; i <= n; i += 1) {
        path[i] = (path[i - 1] ?? 0) + (random.bernoulli(0.5) ? 1 : -1);
        top = Math.max(top, path[i] ?? 0);
      }
      tops.push(top / Math.sqrt(n));
      if (r < SHOWN_PATHS) shown.push(path.map((value) => value / Math.sqrt(n)));
    }
    return { scaled: shown, maxima: tops };
  }, [seed.seed, n]);
  const bins = useMemo(
    () => makeBins(MAX_DOMAIN[0], MAX_DOMAIN[1], { spacing: 1 / Math.sqrt(n), origin: 0 }),
    [n],
  );
  const densities = useMemo(() => binValues(maxima, bins), [maxima, bins]);
  const beyond = maxima.filter((m) => m > 1).length / REPLICAS;
  const brownianBeyond = 2 * (1 - standardNormalCdf(1));

  const description =
    `${SHOWN_PATHS} caminatas de n = ${n} pasos reescaladas a [0, 1] y divididas entre √n. ` +
    `En ${REPLICAS} caminatas, el máximo supera 1 con frecuencia ${formatNumber(beyond, 3)}; para el movimiento browniano esa probabilidad es ${formatNumber(brownianBeyond, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        {
          label: 'P(máximo > 1) observada',
          value: formatNumber(beyond, 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'P(máx Bₜ > 1) = 2(1 - Φ(1))',
          value: formatNumber(brownianBeyond, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Media del máximo observada',
          value: formatNumber(maxima.reduce((t, m) => t + m, 0) / REPLICAS, 3),
        },
        {
          label: 'Media del máximo browniano √(2/π)',
          value: formatNumber(Math.sqrt(2 / Math.PI), 3),
        },
      ]}
      legend={[
        { label: 'Tres caminatas destacadas', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Histograma del máximo', color: DATA_COLORS.secondary },
        { label: 'Densidad del máximo browniano', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
      graphic="canvas"
    >
      <FormulaLine
        tex={`W_{${n}}(t) = \\frac{S_{\\lfloor ${n} t \\rfloor}}{\\sqrt{${n}}},\\qquad W_{${n}} \\xrightarrow{d} B \\ \\text{(movimiento browniano en } [0, 1])`}
      />
      <p className={styles.panelTitle}>Caminatas reescaladas</p>
      <TrajectoryCanvas
        paths={scaled}
        revealed={n + 1}
        yDomain={[-3, 3]}
        label={description}
        xRange={[0, 1]}
        xLabel="t"
        aspect={0.42}
      />
      <p className={styles.panelTitle}>Máximo de cada caminata reescalada</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        curves={[
          {
            f: (x) => (x >= 0 ? (2 * Math.exp(-0.5 * x * x)) / Math.sqrt(2 * Math.PI) : 0),
            color: DATA_COLORS.primary,
          },
        ]}
        domain={MAX_DOMAIN}
        label={`Histograma del máximo. ${description}`}
        axisLabel="máx W(t)"
        aspect={0.3}
      />
    </VizFrame>
  );
}
