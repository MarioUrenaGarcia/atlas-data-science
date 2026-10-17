import { useMemo } from 'react';
import { normal } from '../../../lib/distributions/index.ts';
import {
  conditionalNormal,
  covariance2,
  ellipsePoints,
  normalEllipseLevel,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Vector } from '../../../lib/linalg/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel } from './CasePanel.tsx';
import { bivariateDefinitions, loadPreset, num, planeExtent, polyline } from './shared.ts';

const LEVELS = [0.5, 0.9, 0.99];
const SNAP = 0.1;
/** Probability of the conditional interval drawn on the cut. */
const BAND = 0.95;

interface ConditionalViewProps {
  config: MultivariateConfig;
  title: string;
}

/**
 * Marginal and conditional distributions of a bivariate normal: a vertical
 * cut at X₁ = a crosses the contours, the regression line marks the
 * conditional mean, and a second chart compares the conditional density of
 * X₂ with its marginal.
 */
export function ConditionalView({ config, title }: ConditionalViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...bivariateDefinitions(initial),
      num('corte', 'Valor observado de X₁', 'a', -6, 6, 0.1, initial.corte ?? 1.5),
    ],
    // The definitions depend only on the frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const mu: Vector = [Number(v.mu1), Number(v.mu2)];
  const s1 = Number(v.sigma1);
  const s2 = Number(v.sigma2);
  const rho = Number(v.rho);
  const a = Number(v.corte);
  const sigma = useMemo(() => covariance2(s1, s2, rho), [s1, s2, rho]);
  const conditional = conditionalNormal(mu, sigma, a);
  const sd = Math.sqrt(conditional.variance);
  const z = normal(0, 1).quantile((1 + BAND) / 2);
  const slope = (rho * s2) / s1;
  const extent = planeExtent(mu, s1, s2);

  const marginal = normal(mu[1] ?? 0, s2);
  const condDist = normal(conditional.mean, sd);
  const yRange: [number, number] = [(mu[1] ?? 0) - 4 * s2, (mu[1] ?? 0) + 4 * s2];

  const description =
    `Normal bivariada con correlación ${formatNumber(rho)}. Con X₁ = ${formatNumber(a)}, X₂ es normal con media ${formatNumber(conditional.mean)} y varianza ${formatNumber(conditional.variance)}, ` +
    `frente a la varianza marginal ${formatNumber(s2 * s2)}. La recta de regresión tiene pendiente ${formatNumber(slope)}.`;
  const tex = `X_2 \\mid X_1 = ${formatNumber(a)} \\;\\sim\\; \\mathcal{N}\\!\\left(${formatNumber(mu[1] ?? 0)} + ${formatNumber(slope)}\\,(${formatNumber(a)} - ${formatNumber(mu[0] ?? 0)}),\\; ${formatNumber(s2 * s2)}(1 - ${formatNumber(rho)}^{2})\\right) = \\mathcal{N}(${formatNumber(conditional.mean)},\\ ${formatNumber(conditional.variance)})`;

  return (
    <VizFrame
      title={title}
      parameters={{ ...parameters, values: v }}
      readouts={[
        {
          label: 'Media condicional E[X₂ | X₁ = a]',
          value: formatNumber(conditional.mean),
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Varianza condicional',
          value: formatNumber(conditional.variance),
          color: DATA_COLORS.secondary,
        },
        { label: 'Varianza marginal de X₂', value: formatNumber(s2 * s2) },
        { label: 'Fracción de varianza que queda, 1 - ρ²', value: formatNumber(1 - rho * rho) },
        { label: 'Pendiente de la regresión ρσ₂/σ₁', value: formatNumber(slope) },
      ]}
      legend={[
        { label: 'Elipses de nivel', color: DATA_COLORS.primary, shape: 'line' as const },
        {
          label: 'Recta de regresión E[X₂ | X₁]',
          color: DATA_COLORS.quaternary,
          shape: 'line' as const,
        },
        {
          label: 'Corte X₁ = a e intervalo del 95 %',
          color: DATA_COLORS.secondary,
          shape: 'line' as const,
        },
        { label: 'Marginal de X₂', color: DATA_COLORS.muted, shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={tex} />
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Distribución conjunta y corte</p>
          <CartesianPlane extent={extent} label={description} interactive>
            {(plane) => {
              const [x0, x1] = plane.xDomain;
              const line = (x: number) => (mu[1] ?? 0) + slope * (x - (mu[0] ?? 0));
              return (
                <>
                  <g aria-hidden="true">
                    {LEVELS.map((q, index) => (
                      <polygon
                        key={q}
                        points={polyline(plane, ellipsePoints(mu, sigma, normalEllipseLevel(q)))}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.06 + 0.06 * index}
                        stroke={DATA_COLORS.primary}
                        strokeWidth={1.5}
                      />
                    ))}
                    <line
                      x1={plane.x(x0)}
                      y1={plane.y(line(x0))}
                      x2={plane.x(x1)}
                      y2={plane.y(line(x1))}
                      stroke={DATA_COLORS.quaternary}
                      strokeWidth={2}
                    />
                    <line
                      x1={plane.x(a)}
                      x2={plane.x(a)}
                      y1={plane.y(plane.yDomain[0])}
                      y2={plane.y(plane.yDomain[1])}
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={plane.x(a)}
                      x2={plane.x(a)}
                      y1={plane.y(conditional.mean - z * sd)}
                      y2={plane.y(conditional.mean + z * sd)}
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                  </g>
                  <DraggablePoint
                    x={plane.x(a)}
                    y={plane.y(conditional.mean)}
                    color={DATA_COLORS.secondary}
                    label="Valor observado de X₁"
                    valueText={`a = ${formatNumber(a)}`}
                    axis="x"
                    step={plane.unit * SNAP}
                    onDrag={(px) =>
                      parameters.set(
                        'corte',
                        Math.max(-6, Math.min(6, Math.round(plane.x.invert(px) / SNAP) * SNAP)),
                      )
                    }
                  />
                </>
              );
            }}
          </CartesianPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>Densidad de X₂: condicional y marginal</p>
          <FunctionPlot
            xDomain={yRange}
            label={`Densidad condicional de X₂ dado X₁ = ${formatNumber(a)} frente a la marginal`}
            xLabel="x₂"
            curves={[
              { f: (x) => marginal.pdf(x), color: DATA_COLORS.muted, dashed: true },
              { f: (x) => condDist.pdf(x), color: DATA_COLORS.secondary, width: 2.5 },
            ]}
          />
        </div>
      </div>
    </VizFrame>
  );
}
