import { useMemo } from 'react';
import { subGaussianBound } from '../../../lib/distributions/families.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import { LogTailChart } from './LogTailChart.tsx';
import { CENTERED } from './populations.ts';
import { SUBGAUSSIAN_IDS, type FamilyLabConfig } from './schema.ts';

const FLOOR = 1e-10;
const X_MAX = 8;
const GRID = 400;

interface SubGaussianViewProps {
  config: FamilyLabConfig;
  title: string;
}

/**
 * The sub-Gaussian bound 2 exp(-t^2 / (2 sigma^2)) against the true tail
 * P(|X| >= t). For sub-Gaussian variables some sigma keeps the bound above
 * the tail for every t; for Laplace or t the tail eventually crosses any
 * Gaussian bound, which the readout reports.
 */
export function SubGaussianView({ config, title }: SubGaussianViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select' as const,
        key: 'dist',
        label: 'Variable',
        options: SUBGAUSSIAN_IDS.map((id) => ({ value: id, label: CENTERED[id].label })),
        default: config.subgaussiana ?? 'normal',
      },
      num('sigma', 'Parámetro de la cota', 'σ', 0.3, 3, 0.05, initial.sigma ?? 1),
      num('t', 'Umbral', 't', 0, X_MAX, 0.1, initial.t ?? 3, 1),
    ],
    [config.subgaussiana, initial.sigma, initial.t],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, string | number>;
  const variable = CENTERED[(v.dist as (typeof SUBGAUSSIAN_IDS)[number]) ?? 'normal'];
  const sigma = Number(v.sigma);
  const t = Number(v.t);
  // First threshold where the tail rises above the bound, if any, on the plotted range.
  let crossing: number | null = null;
  for (let i = 1; i <= GRID; i += 1) {
    const s = (X_MAX * i) / GRID;
    if (variable.tail(s) > subGaussianBound(s, sigma) * (1 + 1e-9)) {
      crossing = s;
      break;
    }
  }
  const tail = variable.tail(t);
  const bound = subGaussianBound(t, sigma);
  const description =
    `${variable.label} con la cota de parámetro ${formatNumber(sigma)}. En t = ${formatNumber(t, 1)} la cola vale ${formatNumber(tail, 6)} y la cota ${formatNumber(bound, 6)}. ` +
    (crossing === null
      ? 'La cota se cumple en todo el rango.'
      : `La cola supera la cota a partir de t ≈ ${formatNumber(crossing, 2)}.`);

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: `Cola P(|X| ≥ ${formatNumber(t, 1)})`,
          value: formatNumber(tail, 6),
          color: DATA_COLORS.primary,
        },
        { label: 'Cota subgaussiana', value: formatNumber(bound, 6), color: DATA_COLORS.secondary },
        {
          label: 'Parámetro mínimo conocido σ²',
          value:
            variable.proxy === null
              ? 'no existe: no es subgaussiana'
              : formatNumber(variable.proxy, 3),
        },
        { label: 'Varianza de la variable', value: formatNumber(variable.variance, 3) },
        {
          label: '¿Se cumple la cota?',
          value:
            crossing === null
              ? 'sí, en todo el rango'
              : `no, desde t ≈ ${formatNumber(crossing, 2)}`,
        },
      ]}
      legend={[
        { label: 'Cola real P(|X| ≥ t)', color: DATA_COLORS.primary, shape: 'line' as const },
        { label: 'Cota 2 exp(-t²/(2σ²))', color: DATA_COLORS.secondary, shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`P(|X| \\ge t) \\le 2\\exp\\!\\left(-\\frac{t^{2}}{2\\sigma^{2}}\\right),\\quad \\sigma = ${formatNumber(sigma)},\\ t = ${formatNumber(t, 1)}`}
      />
      <LogTailChart
        curves={[
          { label: 'Cola', f: variable.tail, color: DATA_COLORS.primary, width: 2.5 },
          {
            label: 'Cota',
            f: (s) => subGaussianBound(s, sigma),
            color: DATA_COLORS.secondary,
            dashed: true,
          },
        ]}
        xDomain={[0, X_MAX]}
        floor={FLOOR}
        marker={t}
        label={description}
        xLabel="t"
      />
    </VizFrame>
  );
}
