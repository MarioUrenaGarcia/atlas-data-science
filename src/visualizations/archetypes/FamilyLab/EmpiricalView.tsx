import { useCallback, useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel, QuickSample } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num, useSamples } from '../MultivariateExplorer/shared.ts';
import { EMPIRICAL } from './populations.ts';
import { EMPIRICAL_IDS, type FamilyLabConfig } from './schema.ts';

const MAX_SAMPLES = 2000;
const SAMPLES_PER_SECOND = 4;
const QUICK_SAMPLES = 50;
const INITIAL_SAMPLES = 10;

interface EmpiricalViewProps {
  config: FamilyLabConfig;
  conceptId: string;
  title: string;
}

/**
 * The empirical distribution of a sample: a staircase that jumps 1/n at
 * every observation, drawn against the true distribution function. A
 * vertical cut reads F_n(x), and the largest gap between both curves is
 * the Kolmogorov distance D_n.
 */
export function EmpiricalView({ config, conceptId, title }: EmpiricalViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select' as const,
        key: 'poblacion',
        label: 'Población',
        options: EMPIRICAL_IDS.map((id) => ({ value: id, label: EMPIRICAL[id].label })),
        default: config.poblacion ?? 'normal',
      },
      num('x', 'Punto donde se lee', 'x', -3, 4, 0.05, initial.x ?? 0.5),
    ],
    [config.poblacion, initial.x],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, string | number>;
  const population = EMPIRICAL[(v.poblacion as (typeof EMPIRICAL_IDS)[number]) ?? 'normal'];
  const dist = population.distribution;
  const x0 = Number(v.x);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random) => dist.sample(random), [dist]);
  const { samples, stepMany, playback } = useSamples(seed, population.label, draw, {
    max: MAX_SAMPLES,
    rate: SAMPLES_PER_SECOND,
    initial: INITIAL_SAMPLES,
  });
  const sorted = useMemo(() => [...samples].sort((a, b) => a - b), [samples]);
  const n = sorted.length;
  const ecdf = (x: number) => {
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((sorted[mid] ?? 0) <= x) lo = mid + 1;
      else hi = mid;
    }
    return n === 0 ? 0 : lo / n;
  };
  // The supremum of |F_n - F| is attained at the jumps, just before or just after.
  let dn = 0;
  sorted.forEach((value, i) => {
    const f = dist.cdf(value);
    dn = Math.max(dn, Math.abs((i + 1) / n - f), Math.abs(f - i / n));
  });
  const domain: [number, number] = [
    Math.min(dist.quantile(0.002), x0 - 0.5),
    Math.max(dist.quantile(0.998), x0 + 0.5),
  ];
  const description =
    `${n} observaciones de la población ${population.label}. En x = ${formatNumber(x0)}, F_n(x) = ${formatNumber(ecdf(x0), 3)} y F(x) = ${formatNumber(dist.cdf(x0), 3)}. ` +
    `La mayor distancia entre ambas curvas es D_n = ${formatNumber(dn, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={[
        { label: 'Tamaño de muestra n', value: String(n), color: DATA_COLORS.tertiary },
        {
          label: `F_n(${formatNumber(x0)})`,
          value: formatNumber(ecdf(x0), 3),
          color: DATA_COLORS.primary,
        },
        {
          label: `F(${formatNumber(x0)})`,
          value: formatNumber(dist.cdf(x0), 3),
          color: DATA_COLORS.muted,
        },
        { label: 'Distancia máxima D_n', value: formatNumber(dn, 3), color: DATA_COLORS.secondary },
        {
          label: 'Escala típica 1/√n',
          value: n === 0 ? 'sin datos' : formatNumber(1 / Math.sqrt(n), 3),
        },
      ]}
      legend={[
        { label: 'Distribución empírica F_n', color: DATA_COLORS.primary, shape: 'line' as const },
        { label: 'Distribución verdadera F', color: DATA_COLORS.muted, shape: 'dashed' as const },
        { label: 'Observaciones', color: DATA_COLORS.tertiary },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`F_n(x) = \\frac{1}{n}\\sum_{i=1}^{n} \\mathbf{1}\\{X_i \\le x\\},\\quad n = ${n},\\quad F_n(${formatNumber(x0)}) = ${formatNumber(ecdf(x0), 3)}`}
      />
      <FunctionPlot
        xDomain={domain}
        yDomain={[0, 1.05]}
        label={description}
        xLabel="x"
        curves={[
          { f: (x) => dist.cdf(x), color: DATA_COLORS.muted, dashed: true, width: 2 },
          { f: ecdf, color: DATA_COLORS.primary, width: 2.5, breaks: sorted.slice(0, 300) },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {sorted.map((value, i) => (
              <circle
                key={i}
                cx={x(value)}
                cy={y(0)}
                r={2.5}
                fill={DATA_COLORS.tertiary}
                fillOpacity={0.7}
              />
            ))}
            <line
              x1={x(x0)}
              x2={x(x0)}
              y1={y(0)}
              y2={y(1)}
              stroke={DATA_COLORS.secondary}
              strokeDasharray="4 3"
            />
            <circle cx={x(x0)} cy={y(ecdf(x0))} r={4.5} fill={DATA_COLORS.primary} />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
