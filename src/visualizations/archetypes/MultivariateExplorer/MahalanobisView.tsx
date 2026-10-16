import { useMemo, useState } from 'react';
import {
  covariance2,
  ellipsePoints,
  mahalanobis2,
  normalEllipseLevel,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import type { Vector } from '../../../lib/linalg/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel } from './CasePanel.tsx';
import { bivariateDefinitions, loadPreset, planeExtent, polyline } from './shared.ts';

const LEVELS = [0.5, 0.9, 0.99];
const SNAP = 0.1;
const NAMES = ['A', 'B'];
const DEFAULT_POINTS: Vector[] = [[2, 1]];

interface MahalanobisViewProps {
  config: MultivariateConfig;
  title: string;
}

/**
 * Mahalanobis distance against Euclidean distance: through each draggable
 * point pass a circle (same Euclidean distance to the mean) and an ellipse
 * of the covariance (same Mahalanobis distance). For a bivariate normal the
 * squared Mahalanobis distance is chi-squared with two degrees of freedom.
 */
export function MahalanobisView({ config, title }: MahalanobisViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => bivariateDefinitions(initial),
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
  const sigma = useMemo(() => covariance2(s1, s2, rho), [s1, s2, rho]);
  const startPoints = config.puntos ?? DEFAULT_POINTS;
  const [points, setPoints] = useState<Vector[]>(startPoints.map((p) => [...p]));
  const extent = planeExtent(mu, s1, s2);

  const stats = points.map((p) => {
    const d2 = mahalanobis2(p, mu, sigma);
    const euclid = Math.hypot((p[0] ?? 0) - (mu[0] ?? 0), (p[1] ?? 0) - (mu[1] ?? 0));
    return { d2, dm: Math.sqrt(d2), euclid, percentile: 1 - Math.exp(-d2 / 2) };
  });
  const first = stats[0];
  const description =
    points
      .map(
        (p, i) =>
          `Punto ${NAMES[i]} en (${formatNumber(p[0] ?? 0)}, ${formatNumber(p[1] ?? 0)}): distancia euclidiana ${formatNumber(stats[i]?.euclid ?? 0)}, distancia de Mahalanobis ${formatNumber(stats[i]?.dm ?? 0)}, la elipse que lo contiene encierra ${formatProbability(stats[i]?.percentile ?? 0)} de la probabilidad.`,
      )
      .join(' ') + ` Correlación ${formatNumber(rho)}.`;
  const p0 = points[0] ?? [0, 0];
  const tex = `d_M^{2} = (\\mathbf{x} - \\boldsymbol{\\mu})^{\\top}\\boldsymbol{\\Sigma}^{-1}(\\mathbf{x} - \\boldsymbol{\\mu}) = ${formatNumber(first?.d2 ?? 0, 3)},\\quad \\mathbf{x}_A = (${formatNumber(p0[0] ?? 0)},\\ ${formatNumber(p0[1] ?? 0)})^{\\top},\\quad P(D^{2} \\le d_M^{2}) = 1 - e^{-d_M^{2}/2} = ${formatNumber(first?.percentile ?? 0, 3)}`;

  return (
    <VizFrame
      title={title}
      parameters={{
        ...parameters,
        values: v,
        reset: () => {
          parameters.reset();
          setPoints(startPoints.map((p) => [...p]));
        },
      }}
      readouts={stats.flatMap((s, i) => [
        {
          label: `Distancia euclidiana de ${NAMES[i]}`,
          value: formatNumber(s.euclid),
          color: seriesColor(i + 1),
        },
        {
          label: `Distancia de Mahalanobis de ${NAMES[i]}`,
          value: formatNumber(s.dm),
          color: seriesColor(i + 1),
        },
        { label: `Probabilidad dentro de su elipse`, value: formatProbability(s.percentile) },
      ])}
      legend={[
        { label: 'Elipses del 50, 90 y 99 %', color: DATA_COLORS.primary, shape: 'line' as const },
        {
          label: 'Elipse de Mahalanobis por el punto',
          color: seriesColor(1),
          shape: 'line' as const,
        },
        {
          label: 'Círculo euclidiano por el punto',
          color: DATA_COLORS.muted,
          shape: 'dashed' as const,
        },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={tex} />
      <CartesianPlane extent={extent} label={description} interactive>
        {(plane) => (
          <>
            <g aria-hidden="true">
              {LEVELS.map((q, index) => (
                <polygon
                  key={q}
                  points={polyline(plane, ellipsePoints(mu, sigma, normalEllipseLevel(q)))}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.05 + 0.05 * index}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                />
              ))}
              {stats.map((s, i) => (
                <g key={i}>
                  <circle
                    cx={plane.x(mu[0] ?? 0)}
                    cy={plane.y(mu[1] ?? 0)}
                    r={s.euclid * plane.unit}
                    fill="none"
                    stroke={DATA_COLORS.muted}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                  />
                  {s.d2 > 1e-9 && (
                    <polyline
                      points={polyline(plane, ellipsePoints(mu, sigma, s.d2))}
                      fill="none"
                      stroke={seriesColor(i + 1)}
                      strokeWidth={2.5}
                    />
                  )}
                  <text
                    x={plane.x(points[i]?.[0] ?? 0) + 10}
                    y={plane.y(points[i]?.[1] ?? 0) - 10}
                    className={styles.label}
                    style={{ fontWeight: 700 }}
                  >
                    {NAMES[i]}
                  </text>
                </g>
              ))}
              <circle
                cx={plane.x(mu[0] ?? 0)}
                cy={plane.y(mu[1] ?? 0)}
                r={4}
                fill={DATA_COLORS.text}
              />
            </g>
            {points.map((p, i) => (
              <DraggablePoint
                key={i}
                x={plane.x(p[0] ?? 0)}
                y={plane.y(p[1] ?? 0)}
                color={seriesColor(i + 1)}
                label={`Punto ${NAMES[i]}`}
                valueText={`(${formatNumber(p[0] ?? 0)}, ${formatNumber(p[1] ?? 0)}), distancia de Mahalanobis ${formatNumber(stats[i]?.dm ?? 0)}`}
                step={plane.unit * SNAP}
                onDrag={(px, py) =>
                  setPoints((previous) =>
                    previous.map((q, j) =>
                      j === i
                        ? [
                            Math.round(plane.x.invert(px) / SNAP) * SNAP,
                            Math.round(plane.y.invert(py) / SNAP) * SNAP,
                          ]
                        : q,
                    ),
                  )
                }
              />
            ))}
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
