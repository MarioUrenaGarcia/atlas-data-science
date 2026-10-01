import { useCallback, useMemo } from 'react';
import {
  covariance2,
  ellipsePoints,
  sampleInverseWishart,
  sampleMvn,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { cholesky, type Matrix, type Vector } from '../../../lib/linalg/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel, QuickSample } from './CasePanel.tsx';
import { loadPreset, num, polyline, useSamples } from './shared.ts';

const MAX_MATRICES = 80;
const MATRICES_PER_SECOND = 3;
const QUICK_MATRICES = 20;
const DIMENSION = 2;

interface Draw {
  /** The matrix rescaled so that its mean is the scale matrix shown as reference. */
  scaled: Matrix;
  /** Vectors whose outer products were added, for the Wishart construction. */
  vectors: Vector[];
}

interface WishartViewProps {
  config: MultivariateConfig;
  conceptId: string;
  title: string;
}

function isPositiveDefinite(matrix: Matrix): boolean {
  return cholesky(matrix) !== null;
}

/**
 * Random covariance matrices drawn as ellipses. A Wishart matrix is the sum
 * of nu outer products x xᵀ with x ~ N(0, V); dividing by nu gives a
 * matrix whose mean is V. The inverse Wishart, rescaled by nu - d - 1, has
 * mean Psi. Few degrees of freedom give ellipses of very different shapes;
 * many give ellipses close to the reference.
 */
export function WishartView({ config, conceptId, title }: WishartViewProps) {
  const inverseMode = config.inversa ?? false;
  const initial = config.valores ?? {};
  const minNu = inverseMode ? DIMENSION + 2 : DIMENSION;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('nu', 'Grados de libertad', 'ν', minNu, 40, 1, Math.max(minNu, initial.nu ?? 5), 0),
      num(
        'sigma1',
        inverseMode ? 'Escala de la variable 1' : 'Desviación de la variable 1',
        'σ₁',
        0.4,
        2.5,
        0.05,
        initial.sigma1 ?? 1.5,
      ),
      num(
        'sigma2',
        inverseMode ? 'Escala de la variable 2' : 'Desviación de la variable 2',
        'σ₂',
        0.4,
        2.5,
        0.05,
        initial.sigma2 ?? 1,
      ),
      num('rho', 'Correlación de la escala', 'ρ', -0.9, 0.9, 0.05, initial.rho ?? 0.5),
    ],
    // The definitions depend only on the frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inverseMode],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const nu = Number(v.nu);
  const s1 = Number(v.sigma1);
  const s2 = Number(v.sigma2);
  const rho = Number(v.rho);
  const scale = useMemo(() => covariance2(s1, s2, rho), [s1, s2, rho]);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback(
    (random: Random): Draw => {
      if (inverseMode) {
        const w = sampleInverseWishart(random, nu, scale);
        return {
          scaled: w.map((row) => row.map((value) => value * (nu - DIMENSION - 1))),
          vectors: [],
        };
      }
      const vectors = Array.from({ length: nu }, () => sampleMvn(random, [0, 0], scale));
      const sum: Matrix = [
        [0, 0],
        [0, 0],
      ];
      for (const x of vectors) {
        for (let i = 0; i < 2; i += 1) {
          const row = sum[i];
          if (row)
            for (let j = 0; j < 2; j += 1) row[j] = (row[j] ?? 0) + (x[i] ?? 0) * (x[j] ?? 0);
        }
      }
      return { scaled: sum.map((row) => row.map((value) => value / nu)), vectors };
    },
    [inverseMode, nu, scale],
  );
  const { samples, stepMany, playback } = useSamples(seed, `${nu}|${s1}|${s2}|${rho}`, draw, {
    max: MAX_MATRICES,
    rate: MATRICES_PER_SECOND,
  });
  const last = samples[samples.length - 1];
  const average = samples.length
    ? [0, 1].map((i) =>
        [0, 1].map(
          (j) => samples.reduce((s, d) => s + (d.scaled[i]?.[j] ?? 0), 0) / samples.length,
        ),
      )
    : null;
  const extent = Math.max(4, Math.ceil(3 * Math.max(s1, s2)));
  const name = inverseMode ? 'Wishart inversa' : 'Wishart';
  const description =
    `${name} con ${nu} grados de libertad y escala con desviaciones ${formatNumber(s1)} y ${formatNumber(s2)} y correlación ${formatNumber(rho)}. ` +
    `${samples.length} matrices simuladas, dibujadas como elipses; la elipse punteada es la media.`;
  const entries = (m: Matrix) =>
    `${formatNumber(m[0]?.[0] ?? 0)}, ${formatNumber(m[0]?.[1] ?? 0)}, ${formatNumber(m[1]?.[1] ?? 0)}`;
  const tex = inverseMode
    ? `\\mathbf{W}^{-1} \\sim \\mathcal{W}^{-1}(\\boldsymbol{\\Psi}, ${nu}),\\quad \\mathbb{E}[\\mathbf{W}^{-1}] = \\frac{\\boldsymbol{\\Psi}}{\\nu - d - 1} = \\frac{\\boldsymbol{\\Psi}}{${nu - DIMENSION - 1}}`
    : `\\mathbf{W} = \\sum_{i=1}^{${nu}} \\mathbf{x}_i\\mathbf{x}_i^{\\top} \\sim \\mathcal{W}(\\mathbf{V}, ${nu}),\\quad \\mathbb{E}\\!\\left[\\tfrac{1}{\\nu}\\mathbf{W}\\right] = \\mathbf{V}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_MATRICES} onClick={() => stepMany(QUICK_MATRICES)} />}
      readouts={[
        {
          label: inverseMode ? 'Escala Ψ: entradas 11, 12, 22' : 'Escala V: entradas 11, 12, 22',
          value: entries(scale),
          color: DATA_COLORS.text,
        },
        { label: 'Matrices simuladas', value: String(samples.length), color: DATA_COLORS.tertiary },
        ...(last
          ? [
              {
                label: inverseMode ? 'Última (ν - 3) W⁻¹' : 'Última W/ν',
                value: entries(last.scaled),
                color: DATA_COLORS.secondary,
              },
            ]
          : []),
        { label: 'Promedio de las simuladas', value: average ? entries(average) : 'sin datos' },
        ...(last && !isPositiveDefinite(last.scaled)
          ? [{ label: 'Aviso', value: 'matriz singular' }]
          : []),
      ]}
      legend={[
        { label: 'Matrices simuladas', color: DATA_COLORS.tertiary, shape: 'line' as const },
        { label: 'Última matriz', color: DATA_COLORS.secondary, shape: 'line' as const },
        {
          label: inverseMode ? 'Escala Ψ' : 'Escala V',
          color: DATA_COLORS.text,
          shape: 'dashed' as const,
        },
        ...(inverseMode
          ? []
          : [{ label: 'Vectores de la última suma', color: DATA_COLORS.quaternary }]),
      ]}
      description={description}
    >
      <CasePanel
        cases={config.casos ?? []}
        onLoad={(preset) => loadPreset(preset, definitions, parameters.set)}
      />
      <FormulaLine tex={tex} />
      <CartesianPlane extent={extent} label={description}>
        {(plane) => (
          <g aria-hidden="true">
            {samples.map((d, index) =>
              isPositiveDefinite(d.scaled) ? (
                <polyline
                  key={index}
                  points={polyline(plane, ellipsePoints([0, 0], d.scaled, 1, 64))}
                  fill="none"
                  stroke={
                    index === samples.length - 1 ? DATA_COLORS.secondary : DATA_COLORS.tertiary
                  }
                  strokeWidth={index === samples.length - 1 ? 2.5 : 1}
                  strokeOpacity={index === samples.length - 1 ? 1 : 0.35}
                />
              ) : null,
            )}
            {last?.vectors.map((x, index) => (
              <circle
                key={index}
                cx={plane.x(x[0] ?? 0)}
                cy={plane.y(x[1] ?? 0)}
                r={3}
                fill={DATA_COLORS.quaternary}
              />
            ))}
            <polyline
              points={polyline(plane, ellipsePoints([0, 0], scale, 1))}
              fill="none"
              stroke={DATA_COLORS.text}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          </g>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
