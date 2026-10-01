import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  CLT_POPULATIONS,
  kolmogorovToNormal,
  type CltPopulationId,
} from '../../../lib/limits/clt.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { DensityHistogram } from '../../shared/DensityHistogram.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import { binMasses } from '../../shared/binning.ts';
import styles from './CentralLimit.module.css';
import { PopulationPanel } from './PopulationPanel.tsx';
import { useCltPopulation, Z_DOMAIN } from './useCltPopulation.ts';

const STEPS_PER_SECOND = 2;
const DOT_RADIUS = 5;

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

interface ConvolutionViewProps {
  title: string;
  population: CltPopulationId;
  populations: readonly CltPopulationId[];
  nMax: number;
}

/**
 * The exact law of sqrt(n) (mean - mu) / sigma for i.i.d. copies, obtained
 * by convolving the population with itself. As n grows the shape loses the
 * features of the population (skewness, modes, gaps) and becomes normal.
 */
export function ConvolutionView({ title, population, populations, nMax }: ConvolutionViewProps) {
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
        label: 'Número de sumandos',
        symbol: 'n',
        min: 1,
        max: nMax,
        step: 1,
        default: 1,
        digits: 0,
      },
    ],
    [populations, population, nMax],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    populations.length > 1 ? String(values.poblacion) : population
  ) as CltPopulationId;
  const {
    population: definition,
    moments,
    standardized,
    bins: binsFor,
  } = useCltPopulation(selected, nMax);

  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(nMax, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= nMax,
  });
  const n = sweep ?? Number(values.n);

  const bins = useMemo(() => binsFor(n), [binsFor, n]);
  const points = useMemo(() => standardized(n), [standardized, n]);
  const exact = useMemo(() => binMasses(points, bins), [points, bins]);
  const distances = useMemo(
    () =>
      Array.from({ length: nMax }, (_, i) => ({
        x: i + 1,
        y: kolmogorovToNormal(standardized(i + 1), definition.lattice).distance,
      })),
    [nMax, standardized, definition.lattice],
  );
  const distance = distances[n - 1]?.y ?? Number.NaN;
  // Symmetric populations give a skewness of order 1e-16 from rounding; it is shown as 0.
  const skewness = Math.abs(moments.skewness) < 1e-9 ? 0 : moments.skewness;
  const skew = skewness / Math.sqrt(n);

  const description =
    `${definition.label}. Distribución exacta de la suma estandarizada de ${n} copias independientes. ` +
    `Asimetría ${formatNumber(skew, 3)}; distancia máxima a la normal estándar ${formatNumber(distance, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'Media poblacional μ', value: formatNumber(moments.mean, 4) },
        { label: 'Desviación poblacional σ', value: formatNumber(Math.sqrt(moments.variance), 4) },
        { label: 'Asimetría de la población', value: formatNumber(skewness, 3) },
        { label: 'Asimetría de Zₙ = γ/√n', value: formatNumber(skew, 3) },
        {
          label: 'sup |P(Zₙ ≤ z) - Φ(z)|',
          value: formatNumber(distance, 4),
          color: DATA_COLORS.tertiary,
        },
      ]}
      legend={[
        { label: 'Distribución exacta de Zₙ', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Normal estándar', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`Z_{${n}} = \\sqrt{${n}}\\;\\frac{\\bar{X}_{${n}} - ${formatNumber(moments.mean, 3)}}{${formatNumber(Math.sqrt(moments.variance), 3)}},\\qquad \\sup_z |F_{Z_{${n}}}(z) - \\Phi(z)| = ${formatNumber(distance, 4)}`}
      />
      <p className={styles.panelTitle}>Población: {definition.label}</p>
      <PopulationPanel population={definition} label={`Población. ${description}`} />
      <p className={styles.panelTitle}>Distribución exacta de Zₙ con n = {n}</p>
      <DensityHistogram
        start={bins.start}
        width={bins.width}
        densities={exact}
        outline={exact}
        curves={[{ f: normalPdf, color: DATA_COLORS.primary }]}
        domain={Z_DOMAIN}
        label={description}
        axisLabel="Zₙ"
      />
      <p className={styles.panelTitle}>Distancia a la normal según n</p>
      <SeriesChart
        series={[{ points: distances, color: DATA_COLORS.tertiary, width: 2 }]}
        xDomain={[1, nMax]}
        yDomain={[0, Math.max(0.05, ...distances.map((d) => d.y)) * 1.1]}
        label={`Distancia de Kolmogorov entre Zₙ y la normal para cada n. ${description}`}
        aspect={0.3}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(distance)}
            r={DOT_RADIUS}
            fill={DATA_COLORS.tertiary}
          />
        )}
      </SeriesChart>
    </VizFrame>
  );
}
