import { useCallback, useMemo, useState } from 'react';
import { standardNormalCdf } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  CLT_POPULATIONS,
  kolmogorovToNormal,
  type CltPopulationId,
} from '../../../lib/limits/clt.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { binMasses, binValues } from '../../shared/binning.ts';
import styles from './CentralLimit.module.css';
import { PopulationPanel } from './PopulationPanel.tsx';
import { useCltPopulation, Z_DOMAIN } from './useCltPopulation.ts';

const N_MAX = 60;
const SAMPLES_PER_SECOND = 20;
const MAX_SAMPLES = 5000;

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

interface ClassicViewProps {
  title: string;
  population: CltPopulationId;
  populations: readonly CltPopulationId[];
  n: number;
  exact: boolean;
  seed: number;
}

interface Simulation {
  z: number[];
  lastSample: number[];
  lastSum: number;
}

/**
 * Repeated samples of size n: each one gives a standardized sum Z_n, which
 * lands in the histogram. Whatever the population, the histogram approaches
 * the standard normal density as n grows.
 */
export function ClassicView({
  title,
  population,
  populations,
  n: initialN,
  exact,
  seed: initialSeed,
}: ClassicViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(populations.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'poblacion',
              label: 'Población',
              options: populations.map((id) => ({ value: id, label: CLT_POPULATIONS[id].label })),
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
      {
        type: 'toggle' as const,
        key: 'exacta',
        label: 'Mostrar la distribución exacta de Zₙ',
        default: exact,
      },
    ],
    [populations, population, initialN, exact],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string | boolean>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as CltPopulationId;
  const n = Number(values.n);
  const {
    population: definition,
    moments,
    standardized,
    bins: binsFor,
  } = useCltPopulation(selected, N_MAX);
  const sd = Math.sqrt(moments.variance);

  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${selected}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    z: [],
    lastSample: [],
    lastSum: Number.NaN,
  }));
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const z: number[] = [];
      let lastSample: number[] = [];
      let lastSum = 0;
      for (let k = 0; k < count; k += 1) {
        lastSample = Array.from({ length: n }, () => definition.sample(generator));
        lastSum = lastSample.reduce((total, value) => total + value, 0);
        z.push((lastSum - n * moments.mean) / (sd * Math.sqrt(n)));
      }
      update((previous) => ({
        z: [...previous.z, ...z].slice(0, MAX_SAMPLES),
        lastSample,
        lastSum,
      }));
    },
    [random, n, definition, moments.mean, sd, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.z.length >= MAX_SAMPLES,
  });

  const bins = useMemo(() => binsFor(n), [binsFor, n]);
  const points = useMemo(() => standardized(n), [standardized, n]);
  const densities = useMemo(() => binValues(simulation.z, bins), [simulation.z, bins]);
  const outline = useMemo(
    () => (values.exacta ? binMasses(points, bins) : null),
    [values.exacta, points, bins],
  );
  const distance = useMemo(
    () => kolmogorovToNormal(points, definition.lattice).distance,
    [points, definition.lattice],
  );

  const zs = simulation.z;
  const lastZ = zs.length > 0 ? (zs[zs.length - 1] ?? Number.NaN) : Number.NaN;
  const within =
    zs.length > 0 ? zs.filter((z) => Math.abs(z) <= 1.96).length / zs.length : Number.NaN;
  const header = Number.isFinite(lastZ)
    ? `Z_{${n}} = \\frac{S_{${n}} - n\\mu}{\\sigma\\sqrt{n}} = \\frac{${formatNumber(simulation.lastSum, 2)} - ${n}\\cdot ${formatNumber(moments.mean, 2)}}{${formatNumber(sd, 2)}\\sqrt{${n}}} = ${formatNumber(lastZ, 3)}`
    : `Z_{${n}} = \\frac{S_{${n}} - n\\mu}{\\sigma\\sqrt{n}}`;

  const description =
    `${definition.label}: media ${formatNumber(moments.mean, 3)} y desviación estándar ${formatNumber(sd, 3)}. ` +
    `Se han extraído ${zs.length} muestras de tamaño ${n}; los valores de Zₙ tienen media ${formatNumber(mean(zs), 3)} ` +
    `y desviación estándar ${formatNumber(zs.length > 1 ? standardDeviation(zs) : Number.NaN, 3)}. ` +
    `La distancia máxima entre la distribución exacta de Zₙ y la normal estándar es ${formatNumber(distance, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras extraídas', value: String(zs.length) },
        { label: 'Zₙ de la última muestra', value: formatNumber(lastZ, 3) },
        {
          label: 'Media de los Zₙ',
          value: formatNumber(mean(zs), 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Desviación estándar de los Zₙ',
          value: formatNumber(zs.length > 1 ? standardDeviation(zs) : Number.NaN, 3),
        },
        { label: 'Fracción con |Zₙ| ≤ 1.96', value: formatNumber(within, 3) },
        {
          label: 'Valor normal de esa fracción',
          value: formatNumber(2 * standardNormalCdf(1.96) - 1, 3),
        },
        {
          label: 'sup |P(Zₙ ≤ z) - Φ(z)|',
          value: formatNumber(distance, 4),
          color: DATA_COLORS.tertiary,
        },
        { label: 'Asimetría de Zₙ', value: formatNumber(moments.skewness / Math.sqrt(n), 3) },
      ]}
      legend={[
        { label: 'Población', color: DATA_COLORS.primary },
        { label: 'Valores de la última muestra', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Histograma de Zₙ', color: DATA_COLORS.secondary },
        ...(values.exacta
          ? [
              {
                label: 'Distribución exacta de Zₙ',
                color: DATA_COLORS.tertiary,
                shape: 'line' as const,
              },
            ]
          : []),
        { label: 'Normal estándar', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.panelTitle}>Población: {definition.label}</p>
      <PopulationPanel
        population={definition}
        sample={simulation.lastSample}
        label={`Población. ${description}`}
      />
      <p className={styles.panelTitle}>Suma estandarizada de cada muestra</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        outline={outline}
        curves={[{ f: normalPdf, color: DATA_COLORS.primary }]}
        domain={Z_DOMAIN}
        label={description}
        axisLabel="Zₙ"
      />
    </VizFrame>
  );
}
