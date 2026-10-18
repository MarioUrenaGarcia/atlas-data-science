import { useMemo } from 'react';
import { binomial, normal } from '../../../lib/distributions/index.ts';
import { continuityCorrection } from '../../../lib/distributions/families.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Bars } from '../../core/svg/Bars.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import type { FamilyLabConfig } from './schema.ts';

const AREA_STEPS = 80;

interface ContinuityViewProps {
  config: FamilyLabConfig;
  title: string;
}

/**
 * Normal approximation to the binomial with and without continuity
 * correction: the bars from a to b are the exact probability, the light
 * area from a to b the plain approximation and the area from a - 0.5 to
 * b + 0.5 the corrected one, which covers the bars at the ends completely.
 */
export function ContinuityView({ config, title }: ContinuityViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('n', 'Número de ensayos', 'n', 5, 100, 1, initial.n ?? 20, 0),
      num('p', 'Probabilidad de éxito', 'p', 0.05, 0.95, 0.01, initial.p ?? 0.5),
      num('a', 'Desde', 'a', 0, 100, 1, initial.a ?? 8, 0),
      num('b', 'Hasta', 'b', 0, 100, 1, initial.b ?? 12, 0),
      {
        type: 'toggle' as const,
        key: 'corregir',
        label: 'Usar la corrección por continuidad',
        default: true,
      },
    ],
    [initial.n, initial.p, initial.a, initial.b],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number | boolean>;
  const n = Number(v.n);
  const p = Number(v.p);
  const a = Math.min(n, Number(v.a));
  const b = Math.max(a, Math.min(n, Number(v.b)));
  const corrected = Boolean(v.corregir);
  const mean = n * p;
  const sd = Math.sqrt(n * p * (1 - p));
  const exact = binomial(n, p);
  const approx = normal(mean, sd);
  const comparison = continuityCorrection(n, p, a, b);
  const lo = Math.max(0, Math.floor(mean - 4.5 * sd));
  const hi = Math.min(n, Math.ceil(mean + 4.5 * sd));
  const bars = Array.from({ length: hi - lo + 1 }, (_, i) => {
    const k = lo + i;
    return {
      x0: k - 0.5,
      x1: k + 0.5,
      value: exact.pmf(k),
      color: k >= a && k <= b ? DATA_COLORS.primary : DATA_COLORS.light,
    };
  });
  const from = corrected ? a - 0.5 : a;
  const to = corrected ? b + 0.5 : b;
  const approxValue = corrected ? comparison.corrected : comparison.plain;
  const description =
    `Binomial con n = ${n} y p = ${formatNumber(p)} frente a la normal de media ${formatNumber(mean)} y desviación ${formatNumber(sd)}. ` +
    `P(${a} ≤ X ≤ ${b}) exacta = ${formatProbability(comparison.exact)}; sin corrección ${formatProbability(comparison.plain)}; con corrección ${formatProbability(comparison.corrected)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: `Exacta P(${a} ≤ X ≤ ${b})`,
          value: formatProbability(comparison.exact),
          color: DATA_COLORS.primary,
        },
        { label: 'Normal sin corrección', value: formatProbability(comparison.plain) },
        {
          label: 'Normal con corrección',
          value: formatProbability(comparison.corrected),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Error sin corrección',
          value: formatNumber(comparison.plain - comparison.exact, 4),
        },
        {
          label: 'Error con corrección',
          value: formatNumber(comparison.corrected - comparison.exact, 4),
        },
      ]}
      legend={[
        { label: 'Barras de la binomial en el intervalo', color: DATA_COLORS.primary },
        { label: 'Área normal usada', color: DATA_COLORS.secondary },
        { label: 'Densidad normal', color: DATA_COLORS.text, shape: 'line' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine
        tex={
          corrected
            ? `P(${a} \\le X \\le ${b}) \\approx \\Phi\\!\\left(\\frac{${b} + 0.5 - ${formatNumber(mean)}}{${formatNumber(sd)}}\\right) - \\Phi\\!\\left(\\frac{${a} - 0.5 - ${formatNumber(mean)}}{${formatNumber(sd)}}\\right) = ${formatNumber(approxValue, 4)}`
            : `P(${a} \\le X \\le ${b}) \\approx \\Phi\\!\\left(\\frac{${b} - ${formatNumber(mean)}}{${formatNumber(sd)}}\\right) - \\Phi\\!\\left(\\frac{${a} - ${formatNumber(mean)}}{${formatNumber(sd)}}\\right) = ${formatNumber(approxValue, 4)}`
        }
      />
      <FunctionPlot
        xDomain={[lo - 1, hi + 1]}
        label={description}
        xLabel="número de éxitos"
        curves={[{ f: (x) => approx.pdf(x), color: DATA_COLORS.text, width: 2 }]}
        background={({ x, y }) => {
          const points: string[] = [`${x(from)},${y(0)}`];
          for (let i = 0; i <= AREA_STEPS; i += 1) {
            const t = from + ((to - from) * i) / AREA_STEPS;
            points.push(`${x(t)},${y(approx.pdf(t))}`);
          }
          points.push(`${x(to)},${y(0)}`);
          return (
            <g aria-hidden="true">
              <Bars
                bars={bars}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                opacity={0.75}
                gap={2}
              />
              <polygon points={points.join(' ')} fill={DATA_COLORS.secondary} fillOpacity={0.35} />
            </g>
          );
        }}
      />
    </VizFrame>
  );
}
