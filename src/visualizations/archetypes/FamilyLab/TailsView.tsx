import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import { LogTailChart } from './LogTailChart.tsx';
import { survival, TAILS } from './populations.ts';
import type { FamilyLabConfig, TAIL_IDS } from './schema.ts';

const DEFAULT_TAILS: (typeof TAIL_IDS)[number][] = ['normal', 'exponencial', 'lognormal', 'pareto'];
const FLOOR = 1e-8;

interface TailsViewProps {
  config: FamilyLabConfig;
  title: string;
}

/** Scientific notation that keeps tiny tail probabilities readable. */
function formatTail(value: number): string {
  if (value === 0) return '0';
  if (value >= 0.001) return formatNumber(value, 4);
  const exponent = Math.floor(Math.log10(value));
  return `${formatNumber(value / 10 ** exponent, 2)} × 10^${exponent}`;
}

/**
 * Survival functions P(X > t) on a logarithmic axis: the normal falls
 * faster than any straight line, the exponential is a straight line and
 * power-law tails such as Pareto stay up, so extreme values remain likely.
 */
export function TailsView({ config, title }: TailsViewProps) {
  const ids = config.distribuciones ?? DEFAULT_TAILS;
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('t', 'Umbral', 't', 0.5, 30, 0.5, initial.t ?? 6, 1),
      num('limite', 'Ancho del eje', 'x', 5, 60, 1, initial.limite ?? 20, 0),
    ],
    [initial.t, initial.limite],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const t = Number(v.t);
  const limit = Number(v.limite);
  const curves = ids.map((id, index) => ({
    label: TAILS[id].label,
    f: (x: number) => survival(TAILS[id], x),
    color: seriesColor(index),
    width: 2.5,
  }));
  const description =
    `Probabilidad de superar el umbral ${formatNumber(t, 1)}: ` +
    curves.map((curve) => `${curve.label} ${formatTail(curve.f(t))}`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={curves.map((curve) => ({
        label: `${curve.label}: P(X > ${formatNumber(t, 1)})`,
        value: formatTail(curve.f(t)),
        color: curve.color,
      }))}
      legend={curves.map((curve) => ({
        label: curve.label,
        color: curve.color,
        shape: 'line' as const,
      }))}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={`\\bar{F}(t) = P(X > t),\\quad t = ${formatNumber(t, 1)},\\quad \\text{eje vertical en escala logarítmica}`}
      />
      <LogTailChart
        curves={curves}
        xDomain={[0, limit]}
        floor={FLOOR}
        marker={t}
        label={description}
        xLabel="t"
      />
    </VizFrame>
  );
}
