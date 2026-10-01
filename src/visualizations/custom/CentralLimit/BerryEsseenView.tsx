import { useMemo, useState } from 'react';
import { standardNormalCdf } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  BERRY_ESSEEN_CONSTANT,
  berryEsseenBound,
  CLT_POPULATIONS,
  kolmogorovToNormal,
  type CltPopulationId,
} from '../../../lib/limits/clt.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import styles from './CentralLimit.module.css';
import { useCltPopulation, Z_DOMAIN } from './useCltPopulation.ts';

const STEPS_PER_SECOND = 3;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.42;

interface BerryEsseenViewProps {
  title: string;
  population: CltPopulationId;
  populations: readonly CltPopulationId[];
  nMax: number;
}

/**
 * Distribution function of Z_n against Phi, with the largest vertical gap
 * marked, and that gap as a function of n next to the Berry-Esseen bound
 * C rho / (sigma^3 sqrt n) on logarithmic axes, where both are lines of
 * slope -1/2.
 */
export function BerryEsseenView({ title, population, populations, nMax }: BerryEsseenViewProps) {
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
        default: 4,
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
  const { population: definition, moments, standardized } = useCltPopulation(selected, nMax);

  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(nMax, (value ?? 0) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= nMax,
  });
  const n = sweep ?? Number(values.n);

  const table = useMemo(
    () =>
      Array.from({ length: nMax }, (_, i) => {
        const m = i + 1;
        return {
          n: m,
          gap: kolmogorovToNormal(standardized(m), definition.lattice),
          bound: berryEsseenBound(moments, m),
        };
      }),
    [nMax, standardized, definition.lattice, moments],
  );
  const row = table[n - 1] ?? table[0];
  const gap = row?.gap.distance ?? Number.NaN;
  const at = row?.gap.at ?? 0;
  const bound = berryEsseenBound(moments, n);
  const points = useMemo(() => standardized(n), [standardized, n]);
  // Step function of Z_n for lattice laws, a smooth interpolation otherwise.
  const cdf = useMemo(() => {
    const zs = points.map((p) => p.z);
    const cumulative: number[] = [];
    let total = 0;
    for (const p of points) {
      total += p.mass;
      cumulative.push(total);
    }
    return (z: number) => {
      let lo = 0;
      let hi = zs.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if ((zs[mid] ?? 0) <= z) lo = mid + 1;
        else hi = mid;
      }
      if (definition.lattice) return lo === 0 ? 0 : (cumulative[lo - 1] ?? 1);
      const mass = lo > 0 ? (points[lo - 1]?.mass ?? 0) : 0;
      return lo === 0 ? 0 : (cumulative[lo - 1] ?? 1) - mass / 2;
    };
  }, [points, definition.lattice]);
  const sigma3 = moments.variance ** 1.5;
  const lowest = Math.min(...table.map((r) => r.gap.distance).filter((d) => d > 0), bound);

  const description =
    `${definition.label}. Con n = ${n}, la mayor distancia vertical entre la distribución de Zₙ y Φ es ${formatNumber(gap, 4)} ` +
    `(en z = ${formatNumber(at, 2)}); la cota de Berry-Esseen es ${formatNumber(bound, 4)}. ` +
    `Ambas decrecen como 1/√n.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'ρ = E|X - μ|³', value: formatNumber(moments.absoluteThird, 4) },
        { label: 'σ³', value: formatNumber(sigma3, 4) },
        {
          label: 'Distancia sup |Fₙ - Φ|',
          value: formatNumber(gap, 4),
          color: DATA_COLORS.tertiary,
        },
        {
          label: 'Cota C ρ / (σ³ √n)',
          value: formatNumber(bound, 4),
          color: DATA_COLORS.highlight,
        },
        { label: 'Distancia · √n', value: formatNumber(gap * Math.sqrt(n), 3) },
      ]}
      legend={[
        { label: 'Distribución de Zₙ', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Φ, normal estándar', color: DATA_COLORS.primary, shape: 'dashed' },
        { label: 'Cota de Berry-Esseen', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\sup_z |F_{${n}}(z) - \\Phi(z)| = ${formatNumber(gap, 4)}\\ \\le\\ \\frac{${BERRY_ESSEEN_CONSTANT}\\cdot ${formatNumber(moments.absoluteThird, 3)}}{${formatNumber(sigma3, 3)}\\sqrt{${n}}} = ${formatNumber(bound, 4)}`}
      />
      <p className={styles.panelTitle}>Función de distribución de Zₙ frente a Φ</p>
      <FunctionPlot
        xDomain={Z_DOMAIN}
        yDomain={[-0.03, 1.05]}
        label={description}
        aspect={PANEL_ASPECT}
        xLabel="z"
        curves={[
          { f: (z) => standardNormalCdf(z), color: DATA_COLORS.primary, dashed: true, width: 2 },
          { f: cdf, color: DATA_COLORS.tertiary, width: 2.5 },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <line
              x1={s.x(at)}
              x2={s.x(at)}
              y1={s.y(standardNormalCdf(at))}
              y2={s.y(standardNormalCdf(at) + (cdf(at) >= standardNormalCdf(at) ? gap : -gap))}
              stroke={DATA_COLORS.negative}
              strokeWidth={3}
            />
            <circle
              cx={s.x(at)}
              cy={s.y(standardNormalCdf(at))}
              r={DOT_RADIUS - 1}
              fill={DATA_COLORS.negative}
            />
          </g>
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>Distancia y cota según n (ejes logarítmicos)</p>
      <SeriesChart
        series={[
          {
            points: table.map((r) => ({ x: r.n, y: r.gap.distance })),
            color: DATA_COLORS.tertiary,
            width: 2,
          },
          {
            points: table.map((r) => ({ x: r.n, y: r.bound })),
            color: DATA_COLORS.highlight,
            width: 2,
          },
        ]}
        xDomain={[1, nMax]}
        yDomain={[10 ** Math.floor(Math.log10(lowest * 0.9)), 1]}
        logX
        logY
        label={`Distancia de Kolmogorov y cota de Berry-Esseen. ${description}`}
        aspect={0.34}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(gap)}
            r={DOT_RADIUS}
            fill={DATA_COLORS.tertiary}
          />
        )}
      </SeriesChart>
    </VizFrame>
  );
}
