import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { VECTOR_POPULATIONS, type VectorPopulationId } from '../../../lib/limits/bivariate.ts';
import { quadraticForm } from '../../../lib/limits/delta.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { binValues, makeBins } from '../../shared/binning.ts';
import styles from './CentralLimit.module.css';
import { CloudPanel } from './CloudPanel.tsx';

const N_MAX = 100;
const SAMPLES_PER_SECOND = 30;
const MAX_SAMPLES = 1500;
const POPULATION_POINTS = 600;
const SPREAD = 3.5;

type Vector = [number, number];

interface MultivariateViewProps {
  title: string;
  population: VectorPopulationId;
  populations: readonly VectorPopulationId[];
  n: number;
  seed: number;
}

/**
 * Left, single centered observations X - mu, whose cloud can have any shape.
 * Right, sqrt(n) (mean - mu): it has the same covariance, and as n grows its
 * cloud fills the covariance ellipses like a bivariate normal. Any projection
 * a^T Z is then univariate normal (Cramér-Wold).
 */
export function MultivariateView({
  title,
  population,
  populations,
  n: initialN,
  seed: initialSeed,
}: MultivariateViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(populations.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'poblacion',
              label: 'Vector aleatorio',
              options: populations.map((id) => ({
                value: id,
                label: VECTOR_POPULATIONS[id].label,
              })),
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
        type: 'number' as const,
        key: 'angulo',
        label: 'Dirección de la proyección',
        symbol: 'θ',
        unit: '°',
        min: 0,
        max: 180,
        step: 1,
        default: 30,
        digits: 0,
      },
    ],
    [populations, population, initialN],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as VectorPopulationId;
  const n = Number(values.n);
  const angle = (Number(values.angulo) * Math.PI) / 180;
  const definition = VECTOR_POPULATIONS[selected];
  const [m1, m2] = definition.mean;
  const sigma = definition.covariance;

  const seed = useSeed(initialSeed);
  const cloud = useMemo(() => {
    const random = new Random(seed.seed + 1);
    return Array.from({ length: POPULATION_POINTS }, (): Vector => {
      const [a, b] = definition.sample(random);
      return [a - m1, b - m2];
    });
  }, [definition, m1, m2, seed.seed]);

  const [run, setRun] = useState(0);
  const runKey = `${selected}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sums, update] = useResettableState<Vector[]>(`${runKey}|${seed.seed}`, () => []);
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws: Vector[] = [];
      for (let k = 0; k < count; k += 1) {
        let s1 = 0;
        let s2 = 0;
        for (let i = 0; i < n; i += 1) {
          const [a, b] = definition.sample(generator);
          s1 += a;
          s2 += b;
        }
        draws.push([Math.sqrt(n) * (s1 / n - m1), Math.sqrt(n) * (s2 / n - m2)]);
      }
      update((previous) => [...previous, ...draws].slice(0, MAX_SAMPLES));
    },
    [random, n, definition, m1, m2, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: sums.length >= MAX_SAMPLES,
  });

  const s1 = Math.sqrt(sigma[0][0]);
  const s2 = Math.sqrt(sigma[1][1]);
  const limits: [number, number, number, number] = [
    -SPREAD * s1,
    SPREAD * s1,
    -SPREAD * s2,
    SPREAD * s2,
  ];
  const direction = useMemo<[number, number]>(() => [Math.cos(angle), Math.sin(angle)], [angle]);
  const projectionSd = Math.sqrt(quadraticForm(direction, sigma));
  const projections = useMemo(
    () => sums.map(([a, b]) => (direction[0] * a + direction[1] * b) / projectionSd),
    [sums, direction, projectionSd],
  );
  const bins = useMemo(() => makeBins(-4, 4, null), []);
  const densities = useMemo(() => binValues(projections, bins), [projections, bins]);

  const count = sums.length;
  const empirical = useMemo(() => {
    if (count < 2) return null;
    const ma = sums.reduce((t, p) => t + p[0], 0) / count;
    const mb = sums.reduce((t, p) => t + p[1], 0) / count;
    let caa = 0;
    let cab = 0;
    let cbb = 0;
    for (const [a, b] of sums) {
      caa += (a - ma) ** 2;
      cab += (a - ma) * (b - mb);
      cbb += (b - mb) ** 2;
    }
    return { caa: caa / (count - 1), cab: cab / (count - 1), cbb: cbb / (count - 1) };
  }, [sums, count]);
  const rho = sigma[0][1] / (s1 * s2);
  const f = (value: number) => formatNumber(value, 3);

  const description =
    `${definition.label}. Matriz de covarianza con varianzas ${f(sigma[0][0])} y ${f(sigma[1][1])} y covarianza ${f(sigma[0][1])}. ` +
    `Se han simulado ${count} vectores √n (media - μ) con n = ${n}` +
    (empirical
      ? `; su covarianza observada es ${f(empirical.caa)}, ${f(empirical.cbb)} y ${f(empirical.cab)}.`
      : '.') +
    ` La proyección en la dirección de ${Math.round((angle * 180) / Math.PI)} grados se compara con la normal estándar.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Vectores simulados', value: String(count) },
        { label: 'Var teórica de cada componente', value: `${f(sigma[0][0])} y ${f(sigma[1][1])}` },
        { label: 'Covarianza teórica', value: f(sigma[0][1]) },
        { label: 'Correlación teórica', value: f(rho) },
        ...(empirical
          ? [
              {
                label: 'Var observadas',
                value: `${f(empirical.caa)} y ${f(empirical.cbb)}`,
                color: DATA_COLORS.secondary,
              },
              {
                label: 'Covarianza observada',
                value: f(empirical.cab),
                color: DATA_COLORS.secondary,
              },
            ]
          : []),
        { label: 'Desviación de aᵀZ', value: f(projectionSd), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Observaciones individuales X - μ', color: DATA_COLORS.muted, shape: 'circle' },
        { label: '√n (X̄ₙ - μ)', color: DATA_COLORS.secondary, shape: 'circle' },
        {
          label: 'Elipses de la covarianza (1 y 2 desviaciones)',
          color: DATA_COLORS.primary,
          shape: 'line',
        },
        { label: 'Dirección de proyección', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${definition.latex},\\qquad \\sqrt{${n}}\\,(\\bar{\\mathbf{X}}_{${n}} - \\boldsymbol{\\mu}) \\approx \\mathcal{N}_2\\!\\left(\\mathbf{0},\\ \\begin{pmatrix} ${f(sigma[0][0])} & ${f(sigma[0][1])} \\\\ ${f(sigma[1][0])} & ${f(sigma[1][1])} \\end{pmatrix}\\right)`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Una observación: X - μ</p>
          <CloudPanel
            points={cloud}
            covariance={sigma}
            limits={limits}
            color={DATA_COLORS.muted}
            label={`Nube de la población. ${description}`}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Media de n observaciones: √n (X̄ₙ - μ)</p>
          <CloudPanel
            points={sums}
            covariance={sigma}
            limits={limits}
            color={DATA_COLORS.secondary}
            angle={angle}
            label={`Nube de medias estandarizadas. ${description}`}
          />
        </div>
      </div>
      <p className={styles.panelTitle}>Proyección aᵀZ / √(aᵀΣa) en la dirección elegida</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        curves={[
          { f: (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI), color: DATA_COLORS.primary },
        ]}
        domain={[-4, 4]}
        label={`Histograma de la proyección. ${description}`}
        axisLabel="aᵀZ / √(aᵀΣa)"
        aspect={0.3}
      />
    </VizFrame>
  );
}
