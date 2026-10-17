import { useMemo } from 'react';
import { EXPONENTIAL_FAMILIES } from '../../../lib/distributions/families.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Bars } from '../../core/svg/Bars.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CasePanel } from '../MultivariateExplorer/CasePanel.tsx';
import { loadPreset, num } from '../MultivariateExplorer/shared.ts';
import styles from './FamilyLab.module.css';
import { EXPONENTIAL_IDS, type FamilyLabConfig } from './schema.ts';

const FORMS: Record<(typeof EXPONENTIAL_IDS)[number], string> = {
  bernoulli:
    'p(x \\mid \\eta) = \\exp\\!\\big(\\eta x - \\log(1 + e^{\\eta})\\big),\\quad x \\in \\{0, 1\\}',
  poisson: 'p(x \\mid \\eta) = \\frac{1}{x!}\\exp\\!\\big(\\eta x - e^{\\eta}\\big)',
  normal:
    'p(x \\mid \\eta) = \\frac{e^{-x^{2}/2}}{\\sqrt{2\\pi}}\\exp\\!\\big(\\eta x - \\tfrac{\\eta^{2}}{2}\\big)',
  exponencial: 'p(x \\mid \\eta) = \\exp\\!\\big(\\eta x + \\log(-\\eta)\\big),\\quad \\eta < 0',
};

interface ExponentialViewProps {
  config: FamilyLabConfig;
  title: string;
}

/**
 * A one-parameter exponential family in natural form: the density for the
 * chosen natural parameter, and next to it the log partition function A,
 * whose slope at that point is the mean of T(X) and whose curvature is its
 * variance.
 */
export function ExponentialView({ config, title }: ExponentialViewProps) {
  const initial = config.valores ?? {};
  const family = EXPONENTIAL_FAMILIES[config.familia ?? 'poisson'];
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num(
        'eta',
        'Parámetro natural',
        'η',
        family.etaRange[0],
        family.etaRange[1],
        0.05,
        initial.eta ?? (family.etaRange[0] + family.etaRange[1]) / 2,
      ),
    ],
    [family, initial.eta],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const eta = Number(v.eta);
  const a = family.logPartition(eta);
  const mean = family.mean(eta);
  const variance = family.variance(eta);
  const usual = family.usual(eta);
  const window = family.window(eta);

  const bars = family.discrete
    ? Array.from({ length: Math.floor(window[1]) + 1 }, (_, k) => ({
        x0: k - 0.35,
        x1: k + 0.35,
        value: family.density(k, eta),
      }))
    : [];

  const description =
    `${family.label} en forma natural con η = ${formatNumber(eta)}, que corresponde a ${usual.name} = ${formatNumber(usual.value, 3)}. ` +
    `A(η) = ${formatNumber(a, 3)}; su pendiente, ${formatNumber(mean, 3)}, es la media de T(X), y su curvatura, ${formatNumber(variance, 3)}, la varianza.`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        { label: 'Parámetro natural η', value: formatNumber(eta), color: DATA_COLORS.text },
        { label: `Parámetro usual ${usual.name}`, value: formatNumber(usual.value, 3) },
        { label: 'Función de partición A(η)', value: formatNumber(a, 3) },
        {
          label: "Media de T(X) = A'(η)",
          value: formatNumber(mean, 3),
          color: DATA_COLORS.secondary,
        },
        { label: "Varianza de T(X) = A''(η)", value: formatNumber(variance, 3) },
      ]}
      legend={[
        { label: family.discrete ? 'Función de masa' : 'Densidad', color: DATA_COLORS.primary },
        { label: 'Función A(η)', color: DATA_COLORS.primary, shape: 'line' as const },
        {
          label: "Tangente con pendiente A'(η)",
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
      <FormulaLine tex={FORMS[family.id]} />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>
            {family.discrete ? 'Masa para este η' : 'Densidad para este η'}
          </p>
          <FunctionPlot
            xDomain={window}
            label={description}
            xLabel="x"
            curves={
              family.discrete
                ? []
                : [{ f: (x) => family.density(x, eta), color: DATA_COLORS.primary, width: 2.5 }]
            }
            background={({ x, y }) =>
              family.discrete ? (
                <Bars bars={bars} xScale={x} yScale={y} color={DATA_COLORS.primary} />
              ) : null
            }
            yDomain={
              family.discrete ? [0, Math.max(...bars.map((bar) => bar.value)) * 1.15] : undefined
            }
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Función de partición A(η) y su pendiente</p>
          <FunctionPlot
            xDomain={family.etaRange}
            label={`Función A de la familia ${family.label} con su tangente en η = ${formatNumber(eta)}`}
            xLabel="η"
            curves={[
              { f: family.logPartition, color: DATA_COLORS.primary, width: 2.5 },
              { f: (e) => a + mean * (e - eta), color: DATA_COLORS.secondary, dashed: true },
            ]}
          >
            {({ x, y }) => (
              <circle cx={x(eta)} cy={y(a)} r={5} fill={DATA_COLORS.secondary} aria-hidden="true" />
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
