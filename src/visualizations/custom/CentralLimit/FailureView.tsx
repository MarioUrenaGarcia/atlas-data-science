import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { LLN_POPULATIONS } from '../../../lib/limits/lln.ts';
import { interquartileRange, mean } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram, type HistogramCurve } from '../../shared/DensityHistogram.tsx';
import { binValues, makeBins } from '../../shared/binning.ts';
import styles from './CentralLimit.module.css';
import type { FailurePopulationId } from './schema.ts';

const N_MAX = 1000;
const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 3000;

/** Window for the sample means and the reference curve that applies to each population. */
const SETTINGS: Record<FailurePopulationId, { domain: [number, number]; latex: string }> = {
  cauchy: {
    domain: [-6, 6],
    latex: '\\bar{X}_n \\sim \\operatorname{Cauchy}(0, 1)\\ \\text{para todo } n',
  },
  pareto: { domain: [1, 7], latex: '\\mathbb{E}[X] = 3,\\quad \\operatorname{Var}(X) = \\infty' },
  exponencial: { domain: [0, 3], latex: '\\bar{X}_n \\approx \\mathcal{N}(1,\\ 1/n)' },
};

const cauchyPdf = (x: number) => 1 / (Math.PI * (1 + x * x));

interface FailureViewProps {
  title: string;
  population: FailurePopulationId;
  populations: readonly FailurePopulationId[];
  n: number;
  seed: number;
}

interface Simulation {
  means: number[];
  shares: number[];
}

/**
 * Sample means of heavy tailed populations. For Cauchy data the mean of n
 * observations has exactly the same law as one observation, so it never
 * concentrates; with infinite variance a single huge observation can carry
 * most of the sum. The exponential population is the well-behaved contrast.
 */
export function FailureView({
  title,
  population,
  populations,
  n: initialN,
  seed: initialSeed,
}: FailureViewProps) {
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
        key: 'n',
        label: 'Tamaño de cada muestra',
        symbol: 'n',
        min: 1,
        max: N_MAX,
        step: 1,
        default: initialN,
        digits: 0,
      },
    ],
    [populations, population, initialN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as FailurePopulationId;
  const n = Number(values.n);
  const definition = LLN_POPULATIONS[selected];
  const settings = SETTINGS[selected];

  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${selected}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    means: [],
    shares: [],
  }));
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const means: number[] = [];
      const shares: number[] = [];
      for (let k = 0; k < count; k += 1) {
        let total = 0;
        let absolute = 0;
        let largest = 0;
        for (let i = 0; i < n; i += 1) {
          const x = definition.sample(generator);
          total += x;
          absolute += Math.abs(x);
          largest = Math.max(largest, Math.abs(x));
        }
        means.push(total / n);
        shares.push(absolute > 0 ? largest / absolute : 0);
      }
      update((previous) => ({
        means: [...previous.means, ...means].slice(0, MAX_SAMPLES),
        shares: [...previous.shares, ...shares].slice(0, MAX_SAMPLES),
      }));
    },
    [random, n, definition, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.means.length >= MAX_SAMPLES,
  });

  const [lo, hi] = settings.domain;
  const bins = useMemo(() => makeBins(lo, hi, null), [lo, hi]);
  const densities = useMemo(() => binValues(simulation.means, bins), [simulation.means, bins]);
  const shareBins = useMemo(() => makeBins(0, 1, null), []);
  const shareDensities = useMemo(
    () => binValues(simulation.shares, shareBins),
    [simulation.shares, shareBins],
  );
  const curves = useMemo<HistogramCurve[]>(() => {
    if (selected === 'cauchy') return [{ f: cauchyPdf, color: DATA_COLORS.primary }];
    if (selected === 'exponencial') {
      const sd = 1 / Math.sqrt(n);
      return [
        {
          f: (x) => Math.exp(-0.5 * ((x - 1) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI)),
          color: DATA_COLORS.primary,
        },
      ];
    }
    return [];
  }, [selected, n]);

  const count = simulation.means.length;
  const iqr = count > 3 ? interquartileRange(simulation.means) : Number.NaN;
  const meanShare = count > 0 ? mean(simulation.shares) : Number.NaN;
  const description =
    `${definition.label}. Se han extraído ${count} muestras de tamaño ${n}. ` +
    `El rango intercuartílico de las medias es ${formatNumber(iqr, 3)}` +
    (selected === 'cauchy' ? ', igual que el de una sola observación (2) sin importar n. ' : '. ') +
    `En promedio, la observación más grande en valor absoluto aporta ${formatNumber(meanShare * 100, 1)} % de la suma de valores absolutos.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras extraídas', value: String(count) },
        {
          label: 'Rango intercuartílico de X̄ₙ',
          value: formatNumber(iqr, 3),
          color: DATA_COLORS.secondary,
        },
        ...(selected === 'cauchy'
          ? [{ label: 'Rango intercuartílico de Cauchy(0, 1)', value: '2' }]
          : []),
        ...(selected === 'exponencial'
          ? [
              {
                label: 'Rango intercuartílico normal 1.349/√n',
                value: formatNumber(1.349 / Math.sqrt(n), 3),
              },
            ]
          : []),
        {
          label: 'Peso medio del mayor término',
          value: formatNumber(meanShare, 3),
          color: DATA_COLORS.highlight,
        },
        { label: 'Peso si todos fueran iguales, 1/n', value: formatNumber(1 / n, 4) },
      ]}
      legend={[
        { label: 'Histograma de las medias', color: DATA_COLORS.secondary },
        ...(curves.length > 0
          ? [
              {
                label:
                  selected === 'cauchy'
                    ? 'Densidad de Cauchy(0, 1)'
                    : 'Aproximación normal del TCL',
                color: DATA_COLORS.primary,
                shape: 'line' as const,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\bar{X}_{${n}} = \\frac{1}{${n}}\\sum_{i=1}^{${n}} X_i,\\qquad ${settings.latex}`}
        />
      </p>
      <p className={styles.panelTitle}>Media de cada muestra de tamaño {n}</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        curves={curves}
        domain={settings.domain}
        label={description}
        axisLabel="X̄ₙ"
        minTop={0.3}
      />
      <p className={styles.panelTitle}>Fracción de la suma que aporta el término más grande</p>
      <DensityHistogram
        start={shareBins.start}
        width={shareBins.width}
        densities={shareDensities}
        domain={[0, 1]}
        label={`Peso del mayor término. ${description}`}
        axisLabel="máx |Xᵢ| / Σ |Xᵢ|"
        aspect={0.28}
        minTop={1}
      />
    </VizFrame>
  );
}
