import { useCallback, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  diagnostics,
  sampleStandardizedSum,
  SCENARIOS,
  type ScenarioId,
} from '../../../lib/limits/lindeberg.ts';
import { mean, standardDeviation } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useRandomSource, useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import { binValues, makeBins } from '../../shared/binning.ts';
import styles from './CentralLimit.module.css';
import { ShareBars } from './ShareBars.tsx';
import { Z_DOMAIN } from './useCltPopulation.ts';

const N_MAX = 300;
const SAMPLES_PER_SECOND = 25;
const MAX_SAMPLES = 4000;
const DIAGNOSTIC_POINTS = 120;
const DOT_RADIUS = 5;

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

interface TriangularViewProps {
  title: string;
  lindebergMode: boolean;
  scenario: ScenarioId;
  scenarios: readonly ScenarioId[];
  n: number;
  epsilon: number;
  seed: number;
}

/**
 * Sums of independent summands with different laws. The histogram of
 * S_n / s_n is compared with N(0, 1), and the panel below tracks the
 * condition that guarantees the limit: Lyapunov's ratio or Lindeberg's sum.
 */
export function TriangularView({
  title,
  lindebergMode,
  scenario,
  scenarios,
  n: initialN,
  epsilon,
  seed: initialSeed,
}: TriangularViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(scenarios.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'escenario',
              label: 'Sumandos',
              options: scenarios.map((id) => ({ value: id, label: SCENARIOS[id].label })),
              default: scenario,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Número de sumandos',
        symbol: 'n',
        min: 1,
        max: N_MAX,
        step: 1,
        default: initialN,
        digits: 0,
      },
      ...(lindebergMode
        ? [
            {
              type: 'number' as const,
              key: 'epsilon',
              label: 'Umbral relativo',
              symbol: 'ε',
              min: 0.02,
              max: 1,
              step: 0.01,
              default: epsilon,
            },
          ]
        : []),
    ],
    [scenarios, scenario, initialN, lindebergMode, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (scenarios.length > 1 ? String(values.escenario) : scenario) as ScenarioId;
  const n = Number(values.n);
  const eps = lindebergMode ? Number(values.epsilon) : epsilon;
  const definition = SCENARIOS[selected];
  const current = useMemo(() => diagnostics(definition, n, eps), [definition, n, eps]);
  const sn = Math.sqrt(current.variance);

  const seed = useSeed(initialSeed);
  const [run, setRun] = useState(0);
  const runKey = `${selected}|${n}|${run}`;
  const random = useRandomSource(seed.seed, runKey);
  const [sums, update] = useResettableState<number[]>(`${runKey}|${seed.seed}`, () => []);
  const stepMany = useCallback(
    (count: number) => {
      const generator = random();
      const draws = Array.from({ length: count }, () =>
        sampleStandardizedSum(definition, n, sn, generator),
      );
      update((previous) => [...previous, ...draws].slice(0, MAX_SAMPLES));
    },
    [random, definition, n, sn, update],
  );
  const playback = usePlayback({
    step: () => stepMany(1),
    stepMany,
    reset: () => setRun((value) => value + 1),
    rate: SAMPLES_PER_SECOND,
    done: sums.length >= MAX_SAMPLES,
  });

  const bins = useMemo(() => makeBins(Z_DOMAIN[0], Z_DOMAIN[1], null), []);
  const densities = useMemo(() => binValues(sums, bins), [sums, bins]);
  const history = useMemo(() => {
    const ns = Array.from(
      new Set(
        Array.from({ length: DIAGNOSTIC_POINTS }, (_, k) =>
          Math.max(1, Math.round((N_MAX * (k + 1)) / DIAGNOSTIC_POINTS)),
        ),
      ),
    );
    return ns.map((m) => ({ n: m, d: diagnostics(definition, m, eps) }));
  }, [definition, eps]);

  const quantity = lindebergMode ? current.lindeberg : current.lyapunov;
  const header = lindebergMode
    ? `L_{${n}}(${eps.toFixed(2)}) = \\frac{1}{s_{${n}}^2}\\sum_{i=1}^{${n}} \\mathbb{E}\\big[(X_i - \\mu_i)^2\\,\\mathbf{1}\\{|X_i - \\mu_i| > ${eps.toFixed(2)}\\, s_{${n}}\\}\\big] = ${formatNumber(quantity, 4)}`
    : `\\frac{1}{s_{${n}}^{3}}\\sum_{i=1}^{${n}} \\mathbb{E}|X_i - \\mu_i|^{3} = ${formatNumber(quantity, 4)},\\qquad s_{${n}} = ${formatNumber(sn, 3)}`;

  const description =
    `${definition.label}. Con n = ${n}, s_n = ${formatNumber(sn, 3)}. ` +
    (lindebergMode
      ? `La suma de Lindeberg con ε = ${eps.toFixed(2)} vale ${formatNumber(current.lindeberg, 4)} y el mayor sumando aporta ${formatNumber(current.maxShare * 100, 1)} % de la varianza. `
      : `El cociente de Lyapunov vale ${formatNumber(current.lyapunov, 4)}. `) +
    (definition.normalLimit
      ? 'Las sumas estandarizadas tienden a la normal estándar.'
      : 'Las sumas estandarizadas no tienden a la normal: unos pocos sumandos dominan.');

  const series = lindebergMode
    ? [
        {
          points: history.map((h) => ({ x: h.n, y: h.d.lindeberg })),
          color: DATA_COLORS.highlight,
          width: 2,
        },
        {
          points: history.map((h) => ({ x: h.n, y: h.d.maxShare })),
          color: DATA_COLORS.muted,
          dashed: true,
        },
      ]
    : [
        {
          points: history.map((h) => ({ x: h.n, y: h.d.lyapunov })),
          color: DATA_COLORS.highlight,
          width: 2,
        },
      ];
  const top = Math.max(0.1, ...series.flatMap((s) => s.points.map((p) => p.y))) * 1.1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'sₙ, desviación de la suma', value: formatNumber(sn, 3) },
        lindebergMode
          ? {
              label: 'Suma de Lindeberg Lₙ(ε)',
              value: formatNumber(current.lindeberg, 4),
              color: DATA_COLORS.highlight,
            }
          : {
              label: 'Cociente de Lyapunov',
              value: formatNumber(current.lyapunov, 4),
              color: DATA_COLORS.highlight,
            },
        { label: 'Mayor fracción de la varianza', value: formatNumber(current.maxShare, 4) },
        { label: 'Sumas simuladas', value: String(sums.length) },
        {
          label: 'Media y desviación de Sₙ/sₙ',
          value: `${formatNumber(mean(sums), 3)} y ${formatNumber(sums.length > 1 ? standardDeviation(sums) : Number.NaN, 3)}`,
        },
        { label: 'Límite normal', value: definition.normalLimit ? 'sí' : 'no' },
      ]}
      legend={[
        { label: 'Histograma de Sₙ/sₙ', color: DATA_COLORS.secondary },
        { label: 'Normal estándar', color: DATA_COLORS.primary, shape: 'line' },
        ...(lindebergMode
          ? [
              { label: 'Varianza que aporta cada sumando', color: DATA_COLORS.neutral },
              { label: 'Parte más allá de ε sₙ', color: DATA_COLORS.highlight },
              {
                label: 'Mayor fracción de la varianza',
                color: DATA_COLORS.muted,
                shape: 'dashed' as const,
              },
            ]
          : [
              {
                label: 'Cociente de Lyapunov según n',
                color: DATA_COLORS.highlight,
                shape: 'line' as const,
              },
            ]),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={definition.latex} />
      </p>
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <p className={styles.panelTitle}>Suma estandarizada Sₙ / sₙ</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={densities}
        curves={[{ f: normalPdf, color: DATA_COLORS.primary }]}
        domain={Z_DOMAIN}
        label={description}
        axisLabel="Sₙ / sₙ"
        aspect={0.38}
      />
      {lindebergMode && (
        <>
          <p className={styles.panelTitle}>Fracción de la varianza que aporta cada sumando</p>
          <ShareBars
            shares={current.shares}
            tails={current.tailShares}
            label={`Aportes a la varianza. ${description}`}
          />
        </>
      )}
      <p className={styles.panelTitle}>
        {lindebergMode
          ? 'Suma de Lindeberg y mayor fracción de la varianza según n'
          : 'Cociente de Lyapunov según n'}
      </p>
      <SeriesChart
        series={series}
        xDomain={[1, N_MAX]}
        yDomain={[0, top]}
        label={`Condición según n. ${description}`}
        aspect={0.3}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(Math.min(top, quantity))}
            r={DOT_RADIUS}
            fill={lindebergMode ? DATA_COLORS.highlight : DATA_COLORS.highlight}
          />
        )}
      </SeriesChart>
    </VizFrame>
  );
}
