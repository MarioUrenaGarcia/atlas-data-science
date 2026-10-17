import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import { BASES } from './populations.ts';
import { BASE_IDS, type FamilyLabConfig } from './schema.ts';

const QUARTILES = [0.25, 0.5, 0.75];
const X_DOMAIN: [number, number] = [-10, 10];
/** Height of the quartile marks as a fraction of the plotted maximum. */
const MARK_HEIGHT = 0.08;

interface LocationScaleViewProps {
  config: FamilyLabConfig;
  title: string;
}

/**
 * A location and scale family: the standard member (dashed) and the
 * member X = mu + sigma Z (solid). Quartiles travel with the same rule,
 * so the shape never changes; only its place and its width do.
 */
export function LocationScaleView({ config, title }: LocationScaleViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select' as const,
        key: 'base',
        label: 'Familia',
        options: BASE_IDS.map((id) => ({ value: id, label: BASES[id].label })),
        default: config.base ?? 'normal',
      },
      num('mu', 'Localización', 'μ', -5, 5, 0.1, initial.mu ?? 2),
      num('sigma', 'Escala', 'σ', 0.2, 3, 0.05, initial.sigma ?? 1.5),
    ],
    [config.base, initial.mu, initial.sigma],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, string | number>;
  const base = BASES[(v.base as (typeof BASE_IDS)[number]) ?? 'normal'];
  const mu = Number(v.mu);
  const sigma = Number(v.sigma);
  const z = base.distribution;
  const transformed = (x: number) => z.pdf((x - mu) / sigma) / sigma;
  const quartiles = QUARTILES.map((q) => z.quantile(q));
  const peak = Math.max(z.pdf(z.quantile(0.5)), transformed(mu + sigma * z.quantile(0.5)));
  const hasMean = Number.isFinite(z.mean);
  const description =
    `${base.label} transformada en X = ${formatNumber(mu)} + ${formatNumber(sigma)} Z. Su mediana pasa de ${formatNumber(quartiles[1] ?? 0)} a ${formatNumber(mu + sigma * (quartiles[1] ?? 0))} ` +
    `y su rango intercuartílico se multiplica por ${formatNumber(sigma)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: 'Mediana μ + σ m₀',
          value: formatNumber(mu + sigma * (quartiles[1] ?? 0)),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Rango intercuartílico σ · RIC₀',
          value: formatNumber(sigma * ((quartiles[2] ?? 0) - (quartiles[0] ?? 0))),
        },
        {
          label: 'Media μ + σ E[Z]',
          value: hasMean ? formatNumber(mu + sigma * z.mean) : 'no existe',
        },
        {
          label: 'Desviación σ · sd(Z)',
          value: Number.isFinite(z.variance)
            ? formatNumber(sigma * Math.sqrt(z.variance))
            : 'no existe',
        },
      ]}
      legend={[
        { label: 'Miembro estándar Z', color: DATA_COLORS.muted, shape: 'dashed' as const },
        { label: 'X = μ + σZ', color: DATA_COLORS.primary, shape: 'line' as const },
        {
          label: 'Cuartiles que se trasladan',
          color: DATA_COLORS.secondary,
          shape: 'line' as const,
        },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`f_X(x) = \\frac{1}{\\sigma} f_Z\\!\\left(\\frac{x - \\mu}{\\sigma}\\right) = \\frac{1}{${formatNumber(sigma)}} f_Z\\!\\left(\\frac{x - ${formatNumber(mu)}}{${formatNumber(sigma)}}\\right)`}
      />
      <FunctionPlot
        xDomain={X_DOMAIN}
        yDomain={[0, peak * 1.15]}
        label={description}
        xLabel="x"
        curves={[
          { f: (x) => z.pdf(x), color: DATA_COLORS.muted, dashed: true },
          { f: transformed, color: DATA_COLORS.primary, width: 2.5 },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {quartiles.map((q) => {
              const target = mu + sigma * q;
              const top = y(peak * MARK_HEIGHT);
              return (
                <g key={q}>
                  <line
                    x1={x(q)}
                    x2={x(target)}
                    y1={top}
                    y2={y(0)}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={1.5}
                  />
                  <circle cx={x(target)} cy={y(0)} r={3.5} fill={DATA_COLORS.secondary} />
                </g>
              );
            })}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
