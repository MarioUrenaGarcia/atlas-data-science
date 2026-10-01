import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import type { DistributionId } from '../../shared/distributionIds.ts';
import { DISTRIBUTION_SPECS, specValues } from '../../shared/distributionSpecs.ts';
import styles from './AsymptoticTransform.module.css';

const N_MAX = 300;
const SAMPLES_PER_SECOND = 25;
const MAX_SAMPLES = 4000;
const BINS = 40;
const zLo = -4;
const zHi = 4;
const sumHi = 6;

const normalDensity = (sd: number) => (x: number) =>
  Math.exp(-0.5 * (x / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

function densities(values: readonly number[], lo: number, hi: number): number[] {
  const width = (hi - lo) / BINS;
  const counts = new Array<number>(BINS).fill(0);
  for (const value of values) {
    const index = Math.floor((value - lo) / width);
    if (index >= 0 && index < BINS) counts[index] = (counts[index] ?? 0) + 1;
  }
  return counts.map((c) => c / (Math.max(1, values.length) * width));
}

interface SlutskyViewProps {
  title: string;
  variant: 'estadistico-t' | 'contraejemplo';
  population: DistributionId;
  values: Record<string, number> | undefined;
  n: number;
  seed: number;
}

interface Simulation {
  z: number[];
  ratio: number[];
  t: number[];
}

/**
 * Slutsky's theorem. In the t statistic, sqrt(n)(mean - mu)/sigma tends to
 * N(0, 1) and S/sigma tends to the constant 1, so their quotient also tends
 * to N(0, 1) even for non-normal data. The counterexample shows why the
 * second sequence must tend to a constant: X_n and Y_n = -X_n both tend to
 * N(0, 1), yet their sum is always 0.
 */
export function SlutskyView({
  title,
  variant,
  population,
  values: overrides,
  n: initialN,
  seed: initialSeed,
}: SlutskyViewProps) {
  const spec = DISTRIBUTION_SPECS[population];
  const populationValues = useMemo(() => specValues(spec, overrides), [spec, overrides]);
  const distribution = useMemo(() => spec.create(populationValues), [spec, populationValues]);
  const counter = variant === 'contraejemplo';
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      counter
        ? [
            {
              type: 'toggle',
              key: 'dependiente',
              label: 'Usar Yₙ = -Xₙ en lugar de una copia independiente',
              default: true,
            },
          ]
        : [
            {
              type: 'number',
              key: 'n',
              label: 'Tamaño de muestra',
              symbol: 'n',
              min: 2,
              max: N_MAX,
              step: 1,
              default: initialN,
              digits: 0,
            },
          ],
    [counter, initialN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const n = counter ? 1 : Number(values.n);
  const dependent = counter ? Boolean(values.dependiente) : false;
  const mu = distribution.mean;
  const sigma = Math.sqrt(distribution.variance);

  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${n}|${dependent}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [simulation, update] = useResettableState<Simulation>(`${runKey}|${seed.seed}`, () => ({
    z: [],
    ratio: [],
    t: [],
  }));
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const z: number[] = [];
      const ratio: number[] = [];
      const t: number[] = [];
      for (let k = 0; k < count; k += 1) {
        if (counter) {
          const x = generator.normal();
          const y = dependent ? -x : generator.normal();
          z.push(x);
          ratio.push(y);
          t.push(x + y);
          continue;
        }
        const sample = Array.from({ length: n }, () => distribution.sample(generator));
        const m = mean(sample);
        const s = standardDeviation(sample);
        z.push((Math.sqrt(n) * (m - mu)) / sigma);
        ratio.push(s / sigma);
        t.push(s > 0 ? (Math.sqrt(n) * (m - mu)) / s : 0);
      }
      update((previous) => ({
        z: [...previous.z, ...z].slice(0, MAX_SAMPLES),
        ratio: [...previous.ratio, ...ratio].slice(0, MAX_SAMPLES),
        t: [...previous.t, ...t].slice(0, MAX_SAMPLES),
      }));
    },
    [random, counter, dependent, n, distribution, mu, sigma, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: simulation.t.length >= MAX_SAMPLES,
  });

  const zDensities = useMemo(() => densities(simulation.z, zLo, zHi), [simulation.z]);
  const ratioDensities = useMemo(
    () => (counter ? densities(simulation.ratio, zLo, zHi) : densities(simulation.ratio, 0, 2.5)),
    [simulation.ratio, counter],
  );
  const tDensities = useMemo(
    () => (counter ? densities(simulation.t, -sumHi, sumHi) : densities(simulation.t, zLo, zHi)),
    [simulation.t, counter],
  );
  const count = simulation.t.length;
  const sd = (array: readonly number[]) =>
    array.length > 1 ? standardDeviation(array) : Number.NaN;

  if (counter) {
    const description =
      `Xₙ y Yₙ tienen cada una distribución normal estándar. ` +
      (dependent
        ? `Con Yₙ = -Xₙ la suma vale 0 siempre, aunque cada sumando converja en distribución a N(0, 1).`
        : `Con Yₙ independiente la suma tiene distribución N(0, 2).`) +
      ` Desviación observada de la suma: ${formatNumber(sd(simulation.t), 3)} con ${count} simulaciones.`;
    return (
      <VizFrame
        title={title}
        playback={playback}
        seed={seed}
        parameters={{ ...parameters, values }}
        readouts={[
          { label: 'Simulaciones', value: String(count) },
          { label: 'Desviación de Xₙ', value: formatNumber(sd(simulation.z), 3) },
          { label: 'Desviación de Yₙ', value: formatNumber(sd(simulation.ratio), 3) },
          {
            label: 'Desviación de Xₙ + Yₙ',
            value: formatNumber(sd(simulation.t), 3),
            color: DATA_COLORS.secondary,
          },
          { label: 'Desviación si fueran independientes', value: formatNumber(Math.SQRT2, 3) },
        ]}
        legend={[
          { label: 'Histogramas simulados', color: DATA_COLORS.secondary },
          { label: 'Normal estándar', color: DATA_COLORS.primary, shape: 'line' },
          { label: 'N(0, 2), suma de independientes', color: DATA_COLORS.muted, shape: 'dashed' },
        ]}
        description={description}
      >
        <FormulaLine
          tex={
            dependent
              ? "X_n \\xrightarrow{d} Z,\\quad Y_n = -X_n \\xrightarrow{d} Z,\\qquad X_n + Y_n = 0 \\not\\xrightarrow{d} Z + Z'"
              : "X_n \\xrightarrow{d} Z,\\quad Y_n \\xrightarrow{d} Z',\\qquad X_n + Y_n \\sim \\mathcal{N}(0, 2)"
          }
        />
        <div className={styles.pair}>
          <div>
            <p className={styles.panelTitle}>Xₙ</p>
            <DensityHistogram
              start={zLo}
              width={(zHi - zLo) / BINS}
              densities={zDensities}
              curves={[{ f: normalDensity(1), color: DATA_COLORS.primary }]}
              domain={[zLo, zHi]}
              label={`Histograma de X. ${description}`}
              axisLabel="Xₙ"
              aspect={0.7}
            />
          </div>
          <div>
            <p className={styles.panelTitle}>Yₙ</p>
            <DensityHistogram
              start={zLo}
              width={(zHi - zLo) / BINS}
              densities={ratioDensities}
              curves={[{ f: normalDensity(1), color: DATA_COLORS.primary }]}
              domain={[zLo, zHi]}
              label={`Histograma de Y. ${description}`}
              axisLabel="Yₙ"
              aspect={0.7}
            />
          </div>
        </div>
        <p className={styles.panelTitle}>Suma Xₙ + Yₙ</p>
        <DensityHistogram
          start={-sumHi}
          width={(2 * sumHi) / BINS}
          densities={tDensities}
          curves={[{ f: normalDensity(Math.SQRT2), color: DATA_COLORS.muted, dashed: true }]}
          domain={[-sumHi, sumHi]}
          label={`Histograma de la suma. ${description}`}
          axisLabel="Xₙ + Yₙ"
          aspect={0.32}
        />
      </VizFrame>
    );
  }

  const description =
    `Población ${spec.label} con media ${formatNumber(mu, 3)} y desviación ${formatNumber(sigma, 3)}; muestras de tamaño ${n}. ` +
    `S/σ tiene media ${formatNumber(mean(simulation.ratio), 3)} y desviación ${formatNumber(sd(simulation.ratio), 3)}: se concentra en 1. ` +
    `El estadístico t tiene media ${formatNumber(mean(simulation.t), 3)} y desviación ${formatNumber(sd(simulation.t), 3)}.`;
  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Muestras', value: String(count) },
        {
          label: 'Desviación de S/σ',
          value: formatNumber(sd(simulation.ratio), 3),
          color: DATA_COLORS.tertiary,
        },
        {
          label: 'Fracción con |S/σ - 1| > 0.1',
          value: formatNumber(
            count > 0
              ? simulation.ratio.filter((r) => Math.abs(r - 1) > 0.1).length / count
              : Number.NaN,
            3,
          ),
        },
        { label: 'Desviación de Zₙ (σ conocida)', value: formatNumber(sd(simulation.z), 3) },
        {
          label: 'Desviación de Tₙ (σ estimada)',
          value: formatNumber(sd(simulation.t), 3),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Fracción con |Tₙ| > 1.96',
          value: formatNumber(
            count > 0 ? simulation.t.filter((v) => Math.abs(v) > 1.96).length / count : Number.NaN,
            3,
          ),
        },
      ]}
      legend={[
        { label: 'Histogramas simulados', color: DATA_COLORS.secondary },
        { label: 'Zₙ con σ conocida', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Normal estándar', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`T_{${n}} = \\frac{\\sqrt{${n}}\\,(\\bar{X}_{${n}} - \\mu)}{S_{${n}}} = \\underbrace{\\frac{\\sqrt{${n}}\\,(\\bar{X}_{${n}} - \\mu)}{\\sigma}}_{\\xrightarrow{d}\\ \\mathcal{N}(0,1)} \\cdot \\underbrace{\\frac{\\sigma}{S_{${n}}}}_{\\xrightarrow{p}\\ 1}`}
      />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Cociente S/σ</p>
          <DensityHistogram
            start={0}
            width={2.5 / BINS}
            densities={ratioDensities}
            domain={[0, 2.5]}
            label={`Histograma de S entre sigma. ${description}`}
            axisLabel="S/σ"
            aspect={0.7}
            minTop={1}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Estadístico Tₙ</p>
          <DensityHistogram
            start={zLo}
            width={(zHi - zLo) / BINS}
            densities={tDensities}
            outline={zDensities}
            curves={[{ f: normalDensity(1), color: DATA_COLORS.primary }]}
            domain={[zLo, zHi]}
            label={`Histograma del estadístico t. ${description}`}
            axisLabel="Tₙ"
            aspect={0.7}
          />
        </div>
      </div>
    </VizFrame>
  );
}
