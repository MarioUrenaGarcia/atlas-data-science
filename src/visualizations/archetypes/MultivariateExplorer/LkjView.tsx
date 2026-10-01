import { useCallback, useMemo } from 'react';
import {
  ellipsePoints,
  lkjMarginalPdf,
  lkjMarginalShape,
  sampleLkj,
} from '../../../lib/distributions/multivariate.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Matrix } from '../../../lib/linalg/index.ts';
import type { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { MatrixDisplay } from '../../core/MatrixDisplay.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Bars } from '../../core/svg/Bars.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariateConfig } from './schema.ts';
import { CasePanel, QuickSample } from './CasePanel.tsx';
import { loadPreset, num, polyline, useSamples } from './shared.ts';

const MAX_SAMPLES = 3000;
const SAMPLES_PER_SECOND = 30;
const QUICK_SAMPLES = 500;
const BINS = 24;
/** Ellipses of the most recent matrices drawn in the gallery. */
const GALLERY = 30;
/** A tiny ridge keeps the ellipse of a correlation of exactly ±1 drawable. */
const RIDGE = 1e-6;

interface LkjViewProps {
  config: MultivariateConfig;
  conceptId: string;
  title: string;
}

/**
 * LKJ distribution of correlation matrices: the histogram of one
 * correlation r₁₂ against its exact marginal, a beta on (-1, 1), and the
 * ellipses of recent draws, which are circles when the correlation is zero
 * and thin needles when it is close to ±1.
 */
export function LkjView({ config, conceptId, title }: LkjViewProps) {
  const initial = config.valores ?? {};
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      num('d', 'Dimensión de la matriz', 'd', 2, 8, 1, initial.d ?? 3, 0),
      num('eta', 'Concentración', 'η', 0.2, 20, 0.1, initial.eta ?? 1, 1),
    ],
    // The definitions depend only on the frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const v = parameters.values as Record<string, number>;
  const d = Number(v.d);
  const eta = Number(v.eta);
  const b = lkjMarginalShape(d, eta);

  const seed = useSeed(defaultSeed(conceptId, config.semilla));
  const draw = useCallback((random: Random): Matrix => sampleLkj(random, d, eta), [d, eta]);
  const { samples, stepMany, playback } = useSamples(seed, `${d}|${eta}`, draw, {
    max: MAX_SAMPLES,
    rate: SAMPLES_PER_SECOND,
  });
  const r12 = samples.map((m) => m[0]?.[1] ?? 0);
  const bars = useMemo(() => {
    const counts = new Array<number>(BINS).fill(0);
    for (const r of r12) {
      const bin = Math.min(BINS - 1, Math.floor(((r + 1) / 2) * BINS));
      counts[bin] = (counts[bin] ?? 0) + 1;
    }
    const width = 2 / BINS;
    return counts.map((count, i) => ({
      x0: -1 + i * width,
      x1: -1 + (i + 1) * width,
      value: r12.length === 0 ? 0 : count / (r12.length * width),
    }));
  }, [r12]);
  const peak = Math.max(lkjMarginalPdf(0, d, eta), ...bars.map((bar) => bar.value));
  const sampleVariance =
    r12.length === 0 ? Number.NaN : r12.reduce((s, r) => s + r * r, 0) / r12.length;
  const last = samples[samples.length - 1];

  const description =
    `LKJ con dimensión ${d} y concentración ${formatNumber(eta, 1)}. Cada correlación sigue una beta con parámetros ${formatNumber(b, 2)} reescalada a (-1, 1), con varianza ${formatNumber(1 / (2 * b + 1), 3)}. ` +
    `${samples.length} matrices simuladas.`;
  const tex = `p(\\mathbf{R}) \\propto \\det(\\mathbf{R})^{\\eta - 1},\\quad \\eta = ${formatNumber(eta, 1)},\\quad \\frac{r_{12} + 1}{2} \\sim \\operatorname{Beta}(b, b),\\ b = \\eta - 1 + \\tfrac{d}{2} = ${formatNumber(b, 2)}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={{ ...parameters, values: v }}
      controls={<QuickSample count={QUICK_SAMPLES} onClick={() => stepMany(QUICK_SAMPLES)} />}
      readouts={[
        { label: 'Forma b de la marginal', value: formatNumber(b, 2) },
        {
          label: 'Varianza teórica de r₁₂',
          value: formatNumber(1 / (2 * b + 1), 4),
          color: DATA_COLORS.secondary,
        },
        { label: 'Matrices simuladas', value: String(samples.length), color: DATA_COLORS.tertiary },
        {
          label: 'Varianza simulada de r₁₂',
          value: Number.isNaN(sampleVariance) ? 'sin datos' : formatNumber(sampleVariance, 4),
        },
      ]}
      legend={[
        { label: 'Histograma de r₁₂', color: DATA_COLORS.tertiary },
        { label: 'Densidad marginal exacta', color: DATA_COLORS.secondary, shape: 'line' as const },
        {
          label: 'Elipses de correlación recientes',
          color: DATA_COLORS.primary,
          shape: 'line' as const,
        },
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
          <p className={styles.panelTitle}>Una correlación, r₁₂</p>
          <FunctionPlot
            xDomain={[-1, 1]}
            yDomain={[0, Math.max(0.6, peak * 1.1)]}
            label={`Histograma de r₁₂ y su densidad beta con forma ${formatNumber(b, 2)}`}
            xLabel="r₁₂"
            curves={[
              { f: (r) => lkjMarginalPdf(r, d, eta), color: DATA_COLORS.secondary, width: 2.5 },
            ]}
            background={({ x, y }) => (
              <Bars bars={bars} xScale={x} yScale={y} color={DATA_COLORS.tertiary} opacity={0.6} />
            )}
          />
        </div>
        <div>
          <p className={styles.panelTitle}>Elipses de las últimas matrices</p>
          <CartesianPlane
            extent={2}
            label="Elipses de correlación de las matrices simuladas más recientes"
            grid={false}
          >
            {(plane) => (
              <g aria-hidden="true">
                {samples.slice(-GALLERY).map((m, index, recent) => {
                  const r = m[0]?.[1] ?? 0;
                  return (
                    <polyline
                      key={samples.length - recent.length + index}
                      points={polyline(
                        plane,
                        ellipsePoints(
                          [0, 0],
                          [
                            [1 + RIDGE, r],
                            [r, 1 + RIDGE],
                          ],
                          1,
                          64,
                        ),
                      )}
                      fill="none"
                      stroke={DATA_COLORS.primary}
                      strokeWidth={index === recent.length - 1 ? 2.5 : 1}
                      strokeOpacity={index === recent.length - 1 ? 1 : 0.35}
                    />
                  );
                })}
              </g>
            )}
          </CartesianPlane>
        </div>
      </div>
      {last && (
        <div className={styles.matrices}>
          <MatrixDisplay
            matrix={last}
            name="R"
            label={`Última matriz de correlación simulada, de dimensión ${d}`}
            format={(value) => formatNumber(value, 2)}
            heat={{ max: 1 }}
            compact
          />
        </div>
      )}
    </VizFrame>
  );
}
