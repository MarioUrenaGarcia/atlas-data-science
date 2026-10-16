import { useMemo } from 'react';
import {
  covariance2,
  ellipsePoints,
  sampleCovariance,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { cholesky, type Vector } from '../../../lib/linalg/index.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel } from './CasePanel.tsx';
import { bivariateDefinitions, loadPreset, num, planeExtent, polyline } from './shared.ts';

const POINTS = 400;
const STEPS_PER_SECOND = 25;
const STEP = 0.02;

interface ConstructionViewProps {
  config: MultivariateConfig;
  conceptId: string;
  title: string;
}

/**
 * The multivariate normal as a linear map of independent standard normals:
 * each point z of a round cloud moves to mu + L z, with L the Cholesky
 * factor of Sigma, and the unit circle becomes the ellipse of Sigma.
 */
export function ConstructionView({ config, conceptId, title }: ConstructionViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...bivariateDefinitions(initial),
      num('avance', 'Avance de la transformación', 't', 0, 1, 0.01, initial.avance ?? 0),
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
  const t = Number(v.avance);
  const sigma = useMemo(() => covariance2(s1, s2, rho), [s1, s2, rho]);
  const lower = cholesky(sigma) ?? [
    [1, 0],
    [0, 1],
  ];
  const l11 = lower[0]?.[0] ?? 1;
  const l21 = lower[1]?.[0] ?? 0;
  const l22 = lower[1]?.[1] ?? 1;

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const zs = useMemo(() => {
    const random = new Random(seed.seed);
    return Array.from({ length: POINTS }, () => [random.normal(), random.normal()] as Vector);
  }, [seed.seed]);
  const map = (z: Vector): Vector => [
    (mu[0] ?? 0) + l11 * (z[0] ?? 0),
    (mu[1] ?? 0) + l21 * (z[0] ?? 0) + l22 * (z[1] ?? 0),
  ];
  const mix = (z: Vector): Vector => {
    const x = map(z);
    return [(1 - t) * (z[0] ?? 0) + t * (x[0] ?? 0), (1 - t) * (z[1] ?? 0) + t * (x[1] ?? 0)];
  };
  const points = zs.map(mix);
  const circle = Array.from({ length: 97 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 96;
    return mix([Math.cos(angle), Math.sin(angle)]);
  });
  // The covariance does not depend on the mean, so the final cloud is measured as L z.
  const finalCov = useMemo(
    () =>
      sampleCovariance(zs.map((z) => [l11 * (z[0] ?? 0), l21 * (z[0] ?? 0) + l22 * (z[1] ?? 0)])),
    [zs, l11, l21, l22],
  );

  const playback = usePlayback({
    step: () => parameters.set('avance', Math.min(1, Number(v.avance) + STEP)),
    reset: () => parameters.set('avance', 0),
    rate: STEPS_PER_SECOND,
    done: t >= 1,
    autoplay: false,
  });

  const stage =
    t <= 0
      ? 'Inicio: normales estándar independientes, una nube redonda alrededor del origen.'
      : t >= 1
        ? 'Final: la nube es N(μ, Σ); el círculo unitario se volvió la elipse de Σ.'
        : 'Cada punto avanza en línea recta desde z hasta μ + L z.';
  const description =
    `Transformación de ${POINTS} puntos normales estándar con L = [${formatNumber(l11)}, 0; ${formatNumber(l21)}, ${formatNumber(l22)}] y μ = (${formatNumber(mu[0] ?? 0)}, ${formatNumber(mu[1] ?? 0)}), avance ${formatNumber(t)}. ` +
    stage;
  const tex = `\\mathbf{x} = \\boldsymbol{\\mu} + \\mathbf{L}\\mathbf{z} = \\begin{pmatrix} ${formatNumber(mu[0] ?? 0)} \\\\ ${formatNumber(mu[1] ?? 0)} \\end{pmatrix} + \\begin{pmatrix} ${formatNumber(l11)} & 0 \\\\ ${formatNumber(l21)} & ${formatNumber(l22)} \\end{pmatrix}\\mathbf{z},\\quad \\mathbf{L}\\mathbf{L}^{\\top} = \\boldsymbol{\\Sigma}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      readouts={[
        { label: 'Avance t', value: formatNumber(t), color: DATA_COLORS.text },
        {
          label: 'L₁₁, L₂₁, L₂₂',
          value: `${formatNumber(l11)}, ${formatNumber(l21)}, ${formatNumber(l22)}`,
        },
        {
          label: 'Σ objetivo: σ₁², σ₁₂, σ₂²',
          value: `${formatNumber(s1 * s1)}, ${formatNumber(rho * s1 * s2)}, ${formatNumber(s2 * s2)}`,
        },
        {
          label: 'Covarianza de la nube final',
          value: `${formatNumber(finalCov[0]?.[0] ?? 0)}, ${formatNumber(finalCov[0]?.[1] ?? 0)}, ${formatNumber(finalCov[1]?.[1] ?? 0)}`,
        },
      ]}
      legend={[
        { label: 'Puntos z en camino a μ + Lz', color: DATA_COLORS.tertiary },
        {
          label: 'Círculo unitario transformado',
          color: DATA_COLORS.secondary,
          shape: 'line' as const,
        },
        { label: 'Elipse final de Σ', color: DATA_COLORS.muted, shape: 'dashed' as const },
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={tex} />
      <p className={styles.stage} aria-live="polite">
        {stage}
      </p>
      <CartesianPlane extent={planeExtent(mu, s1, s2)} label={description}>
        {(plane) => (
          <g aria-hidden="true">
            <polyline
              points={polyline(plane, ellipsePoints(mu, sigma, 1))}
              fill="none"
              stroke={DATA_COLORS.muted}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            {points.map((p, index) => (
              <circle
                key={index}
                cx={plane.x(p[0] ?? 0)}
                cy={plane.y(p[1] ?? 0)}
                r={2.2}
                fill={DATA_COLORS.tertiary}
                fillOpacity={0.6}
              />
            ))}
            <polyline
              points={polyline(plane, circle)}
              fill="none"
              stroke={DATA_COLORS.secondary}
              strokeWidth={2.5}
            />
          </g>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
