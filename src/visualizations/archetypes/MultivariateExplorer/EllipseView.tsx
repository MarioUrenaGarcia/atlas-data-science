import { useCallback, useMemo } from 'react';
import { fisherF, normal } from '../../../lib/distributions/index.ts';
import {
  covariance2,
  ellipsePoints,
  mahalanobis2,
  normalEllipseLevel,
  principalAxes,
  sampleMvn,
  sampleMvt,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber, formatProbability } from '../../../lib/format/number.ts';
import type { Vector } from '../../../lib/linalg/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel, QuickSample } from './CasePanel.tsx';
import {
  bivariateDefinitions,
  loadPreset,
  num,
  planeExtent,
  polyline,
  useSamples,
} from './shared.ts';

const MAX_SAMPLES = 3000;
const SAMPLES_PER_SECOND = 40;
const QUICK_SAMPLES = 500;
const DEFAULT_LEVELS = [0.5, 0.9, 0.99];
const SNAP = 0.1;
/** Level whose ellipse sets the length drawn for the principal axes. */
const AXIS_LEVEL = 0.9;

interface EllipseViewProps {
  config: MultivariateConfig;
  conceptId: string;
  title: string;
}

/**
 * Bivariate normal (or t) seen through its elliptical contours: the mean as
 * a draggable center, the covariance as the shape and orientation of the
 * ellipses, the principal axes and samples that fill the levels.
 */
export function EllipseView({ config, conceptId, title }: EllipseViewProps) {
  const mode = config.modo;
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...bivariateDefinitions(initial),
      ...(mode === 'elipse'
        ? [num('nivel', 'Nivel de confianza', 'q', 0.5, 0.995, 0.001, initial.nivel ?? 0.95, 3)]
        : []),
      ...(mode === 't' ? [num('nu', 'Grados de libertad', 'ν', 1, 30, 1, initial.nu ?? 3, 0)] : []),
      {
        type: 'toggle' as const,
        key: 'ejes',
        label: 'Ejes principales',
        default: config.ejes ?? true,
      },
      ...(mode === 'elipse'
        ? [
            {
              type: 'toggle' as const,
              key: 'caja',
              label: 'Rectángulo de intervalos marginales',
              default: config.caja ?? false,
            },
          ]
        : []),
      ...(mode === 't'
        ? [
            {
              type: 'toggle' as const,
              key: 'comparar',
              label: 'Superponer la normal con la misma Σ',
              default: true,
            },
          ]
        : []),
    ],
    // The definitions depend only on the frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, config.ejes, config.caja],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number | boolean>;
  const mu: Vector = [Number(v.mu1), Number(v.mu2)];
  const s1 = Number(v.sigma1);
  const s2 = Number(v.sigma2);
  const rho = Number(v.rho);
  const nu = Number(v.nu ?? 3);
  const level = Number(v.nivel ?? 0.95);
  const sigma = useMemo(() => covariance2(s1, s2, rho), [s1, s2, rho]);
  const axes = principalAxes(sigma);
  const det = s1 * s1 * s2 * s2 * (1 - rho * rho);

  const levels = mode === 'elipse' ? [level] : (config.niveles ?? DEFAULT_LEVELS);
  // For the t, the ellipse holding probability q has squared radius 2 F^{-1}_{2, nu}(q).
  const tLevel = useCallback((q: number) => 2 * fisherF(2, nu).quantile(q), [nu]);
  const levelValue = (q: number) => (mode === 't' ? tLevel(q) : normalEllipseLevel(q));

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const muKey = mu.join(',');
  const draw = useCallback(
    (random: Random) =>
      mode === 't'
        ? sampleMvt(random, muKey.split(',').map(Number), sigma, nu)
        : sampleMvn(random, muKey.split(',').map(Number), sigma),
    [mode, muKey, sigma, nu],
  );
  const { samples, stepMany, playback } = useSamples(
    seed,
    `${muKey}|${s1}|${s2}|${rho}|${nu}`,
    draw,
    {
      max: MAX_SAMPLES,
      rate: SAMPLES_PER_SECOND,
    },
  );

  const share = (c: number) =>
    samples.length === 0
      ? null
      : samples.filter((p) => mahalanobis2(p, mu, sigma) <= c).length / samples.length;
  // Marginal intervals mu_i +- z sigma_i with z the (1 + q)/2 normal quantile.
  const boxQuantile = normal(0, 1).quantile((1 + level) / 2);
  const inBox = (p: Vector) =>
    Math.abs((p[0] ?? 0) - (mu[0] ?? 0)) <= boxQuantile * s1 &&
    Math.abs((p[1] ?? 0) - (mu[1] ?? 0)) <= boxQuantile * s2;

  const c = levelValue(levels[levels.length - 1] ?? 0.9);
  const readouts = [
    { label: 'Varianzas σ₁², σ₂²', value: `${formatNumber(s1 * s1)}, ${formatNumber(s2 * s2)}` },
    { label: 'Covarianza σ₁₂', value: formatNumber(rho * s1 * s2) },
    { label: 'Determinante |Σ|', value: formatNumber(det) },
    {
      label: 'Valores propios λ₁, λ₂',
      value: `${formatNumber(axes.values[0])}, ${formatNumber(axes.values[1])}`,
    },
    ...(mode === 'elipse'
      ? [
          { label: 'Radio al cuadrado c', value: formatNumber(c, 3), color: DATA_COLORS.secondary },
          {
            label: 'Semiejes √(cλ₁), √(cλ₂)',
            value: `${formatNumber(Math.sqrt(c * axes.values[0]))}, ${formatNumber(Math.sqrt(c * axes.values[1]))}`,
          },
          { label: 'Área π c √|Σ|', value: formatNumber(Math.PI * c * Math.sqrt(det)) },
        ]
      : []),
    { label: 'Muestras', value: String(samples.length), color: DATA_COLORS.tertiary },
    ...levels.map((q) => {
      const value = share(levelValue(q));
      return {
        label: `Dentro de la elipse del ${formatNumber(q * 100, 1)} %`,
        value: value === null ? 'sin datos' : formatProbability(value),
      };
    }),
    ...(mode === 'elipse' && v.caja
      ? [
          {
            label: 'Dentro del rectángulo marginal',
            value:
              samples.length === 0
                ? 'sin datos'
                : formatProbability(samples.filter(inBox).length / samples.length),
          },
        ]
      : []),
    ...(mode === 't'
      ? [
          {
            label: 'Fuera de la elipse normal del 99 %',
            value:
              samples.length === 0
                ? 'sin datos'
                : formatProbability(
                    samples.filter((p) => mahalanobis2(p, mu, sigma) > normalEllipseLevel(0.99))
                      .length / samples.length,
                  ),
          },
        ]
      : []),
  ];

  const extent = planeExtent(mu, s1, s2);
  const kind = mode === 't' ? `t bivariada con ν = ${nu}` : 'normal bivariada';
  const description =
    `${kind} con media (${formatNumber(mu[0] ?? 0)}, ${formatNumber(mu[1] ?? 0)}), desviaciones ${formatNumber(s1)} y ${formatNumber(s2)} y correlación ${formatNumber(rho)}. ` +
    `Las elipses son curvas de nivel; el eje mayor apunta en la dirección (${formatNumber(axes.vectors[0][0] ?? 0)}, ${formatNumber(axes.vectors[0][1] ?? 0)}). ` +
    `${samples.length} muestras simuladas.`;

  const header =
    mode === 't'
      ? `\\mathbf{X} = \\boldsymbol{\\mu} + \\frac{\\mathbf{L}\\mathbf{Z}}{\\sqrt{W/\\nu}},\\quad \\nu = ${nu},\\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} ${formatNumber(s1 * s1)} & ${formatNumber(rho * s1 * s2)} \\\\ ${formatNumber(rho * s1 * s2)} & ${formatNumber(s2 * s2)} \\end{pmatrix}`
      : mode === 'elipse'
        ? `(\\mathbf{x} - \\boldsymbol{\\mu})^{\\top}\\boldsymbol{\\Sigma}^{-1}(\\mathbf{x} - \\boldsymbol{\\mu}) \\le c = -2\\log(1 - ${formatNumber(level, 3)}) = ${formatNumber(c, 3)}`
        : `\\boldsymbol{\\mu} = \\begin{pmatrix} ${formatNumber(mu[0] ?? 0)} \\\\ ${formatNumber(mu[1] ?? 0)} \\end{pmatrix},\\quad \\boldsymbol{\\Sigma} = \\begin{pmatrix} ${formatNumber(s1 * s1)} & ${formatNumber(rho * s1 * s2)} \\\\ ${formatNumber(rho * s1 * s2)} & ${formatNumber(s2 * s2)} \\end{pmatrix}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={readouts}
      legend={[
        {
          label: mode === 't' ? 'Elipses de la t' : 'Elipses de nivel',
          color: DATA_COLORS.primary,
          shape: 'line' as const,
        },
        ...(mode === 't' && v.comparar
          ? [{ label: 'Elipses de la normal', color: DATA_COLORS.muted, shape: 'dashed' as const }]
          : []),
        ...(v.ejes
          ? [{ label: 'Ejes principales', color: DATA_COLORS.secondary, shape: 'line' as const }]
          : []),
        ...(mode === 'elipse' && v.caja
          ? [
              {
                label: 'Rectángulo marginal',
                color: DATA_COLORS.quaternary,
                shape: 'dashed' as const,
              },
            ]
          : []),
        { label: 'Muestras', color: DATA_COLORS.tertiary },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={header} />
      <CartesianPlane extent={extent} label={description} interactive>
        {(plane) => (
          <>
            <g aria-hidden="true">
              {levels
                .slice()
                .sort((a, b) => b - a)
                .map((q, index, sorted) => (
                  <polygon
                    key={q}
                    points={polyline(plane, ellipsePoints(mu, sigma, levelValue(q)))}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.08 + (0.1 * index) / Math.max(1, sorted.length - 1)}
                    stroke={DATA_COLORS.primary}
                    strokeWidth={mode === 'elipse' ? 2.5 : 1.5}
                  />
                ))}
              {mode === 't' &&
                v.comparar &&
                levels.map((q) => (
                  <polyline
                    key={`n${q}`}
                    points={polyline(plane, ellipsePoints(mu, sigma, normalEllipseLevel(q)))}
                    fill="none"
                    stroke={DATA_COLORS.muted}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                  />
                ))}
              {mode === 'elipse' && v.caja && (
                <rect
                  x={plane.x((mu[0] ?? 0) - boxQuantile * s1)}
                  y={plane.y((mu[1] ?? 0) + boxQuantile * s2)}
                  width={plane.unit * 2 * boxQuantile * s1}
                  height={plane.unit * 2 * boxQuantile * s2}
                  fill="none"
                  stroke={DATA_COLORS.quaternary}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              )}
              {samples.map((p, index) => (
                <circle
                  key={index}
                  cx={plane.x(p[0] ?? 0)}
                  cy={plane.y(p[1] ?? 0)}
                  r={2}
                  fill={DATA_COLORS.tertiary}
                  fillOpacity={0.55}
                />
              ))}
              {v.ejes &&
                axes.vectors.map((vector, index) => {
                  const length = Math.sqrt(levelValue(AXIS_LEVEL) * (axes.values[index] ?? 0));
                  const end: Vector = [
                    (mu[0] ?? 0) + length * (vector[0] ?? 0),
                    (mu[1] ?? 0) + length * (vector[1] ?? 0),
                  ];
                  return (
                    <g key={index}>
                      <line
                        x1={plane.x(mu[0] ?? 0)}
                        y1={plane.y(mu[1] ?? 0)}
                        x2={plane.x(end[0] ?? 0)}
                        y2={plane.y(end[1] ?? 0)}
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={2.5}
                      />
                      <text
                        x={plane.x(end[0] ?? 0) + 6}
                        y={plane.y(end[1] ?? 0) - 6}
                        className={styles.label}
                      >
                        {index === 0 ? 'λ₁' : 'λ₂'}
                      </text>
                    </g>
                  );
                })}
            </g>
            <DraggablePoint
              x={plane.x(mu[0] ?? 0)}
              y={plane.y(mu[1] ?? 0)}
              color={DATA_COLORS.primary}
              label="Media μ"
              valueText={`μ = (${formatNumber(mu[0] ?? 0)}, ${formatNumber(mu[1] ?? 0)})`}
              step={plane.unit * SNAP}
              onDrag={(px, py) => {
                const clamp = (value: number) =>
                  Math.max(-3, Math.min(3, Math.round(value / SNAP) * SNAP));
                parameters.set('mu1', clamp(plane.x.invert(px)));
                parameters.set('mu2', clamp(plane.y.invert(py)));
              }}
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
