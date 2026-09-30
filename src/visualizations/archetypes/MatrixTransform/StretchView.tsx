import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { apply, matLatex, svd2, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { TransformedGrid } from './TransformedGrid.tsx';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

/** Half a turn is enough: v and -v are stretched by the same factor. */
const STEPS = 180;
const STEPS_PER_SECOND = 30;
const CURVE_SAMPLES = 180;
const TICKS = [0, 45, 90, 135, 180];

interface StretchViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * How much A stretches each unit vector. The largest factor is the spectral
 * norm σ₁, the smallest is σ₂, and their ratio is the condition number: the
 * worst-case amplification of relative errors when solving Ax = b.
 */
export function StretchView({ title, matrices }: StretchViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (STEPS + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const angle = step;
  const radians = (angle * Math.PI) / 180;
  const v: Vec2 = [Math.cos(radians), Math.sin(radians)];
  const image = apply(matrix, v);
  const stretch = Math.hypot(image[0], image[1]);
  const { sigma, v: right } = svd2(matrix);
  const frobenius = Math.hypot(sigma[0], sigma[1]);
  const condition = sigma[1] > 1e-12 ? sigma[0] / sigma[1] : Infinity;
  const maxDirection: Vec2 = [right[0][0], right[1][0]];
  const minDirection: Vec2 = [right[0][1], right[1][1]];
  const points = Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) => {
    const theta = (Math.PI * index) / CURVE_SAMPLES;
    const w = apply(matrix, [Math.cos(theta), Math.sin(theta)]);
    return { x: (180 * index) / CURVE_SAMPLES, y: Math.hypot(w[0], w[1]) };
  });
  const description =
    `v a ${angle}° se estira por ${formatNumber(stretch, 3)}. Máximo σ₁ = ${formatNumber(sigma[0], 3)} (norma espectral), mínimo σ₂ = ${formatNumber(sigma[1], 3)}; ` +
    `número de condición ${Number.isFinite(condition) ? formatNumber(condition, 3) : 'infinito'}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Ángulo de v', value: `${angle}°` },
        { label: '|A v|', value: formatNumber(stretch, 3), color: DATA_COLORS.highlight },
        {
          label: 'Máximo: σ₁ = ‖A‖₂',
          value: formatNumber(sigma[0], 3),
          color: DATA_COLORS.primary,
        },
        { label: 'Mínimo: σ₂', value: formatNumber(sigma[1], 3), color: DATA_COLORS.secondary },
        { label: 'Frobenius: raíz de σ₁² + σ₂²', value: formatNumber(frobenius, 3) },
        {
          label: 'κ(A) = σ₁ / σ₂',
          value: Number.isFinite(condition) ? formatNumber(condition, 3) : 'infinito (singular)',
        },
      ]}
      legend={[
        { label: 'Imagen del círculo unitario', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Dirección de estiramiento máximo', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Dirección de estiramiento mínimo', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'v y A v', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A = ${matLatex(matrix)},\\quad \\lVert A \\rVert_2 = \\max_{\\lVert \\mathbf{v} \\rVert = 1} \\lVert A\\mathbf{v} \\rVert = \\sigma_1`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>v recorre el círculo, A v recorre la elipse</p>
          <CartesianPlane
            extent={3.5}
            label={description}
            grid={false}
            aspect={0.9}
            minHeight={240}
            maxHeight={380}
          >
            {(plane) => (
              <>
                <TransformedGrid
                  plane={plane}
                  matrix={matrix}
                  showSquare={false}
                  showCircle
                  showBasis={false}
                />
                <circle
                  aria-hidden="true"
                  cx={plane.x(0)}
                  cy={plane.y(0)}
                  r={plane.unit}
                  fill="none"
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="3 4"
                />
                <VectorArrow
                  plane={plane}
                  to={apply(matrix, maxDirection)}
                  color={DATA_COLORS.primary}
                  width={2}
                  dashed
                />
                <VectorArrow
                  plane={plane}
                  to={apply(matrix, minDirection)}
                  color={DATA_COLORS.secondary}
                  width={2}
                  dashed
                />
                <VectorArrow plane={plane} to={v} color={DATA_COLORS.muted} label="v" width={2.5} />
                <VectorArrow
                  plane={plane}
                  to={image}
                  color={DATA_COLORS.highlight}
                  label="A v"
                  width={3}
                />
              </>
            )}
          </CartesianPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>|A v| según el ángulo de v</p>
          <ChartSvg
            label={description}
            aspect={0.9}
            minHeight={240}
            maxHeight={380}
            margins={{ left: 44, bottom: 36 }}
          >
            {(box) => {
              const x = scaleLinear()
                .domain([0, 180])
                .range([box.inner.left, box.inner.left + box.inner.width]);
              const y = scaleLinear()
                .domain([0, Math.max(1, sigma[0] * 1.1)])
                .nice()
                .range([box.inner.top + box.inner.height, box.inner.top]);
              return (
                <>
                  <Axis
                    scale={y}
                    orientation="left"
                    position={box.inner.left}
                    gridLength={box.inner.width}
                    ticks={5}
                  />
                  <Axis
                    scale={x}
                    orientation="bottom"
                    position={box.inner.top + box.inner.height}
                    tickValues={TICKS}
                    format={(value) => `${value}°`}
                    label="ángulo de v"
                  />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(sigma[0])}
                    y2={y(sigma[0])}
                    stroke={DATA_COLORS.primary}
                    strokeDasharray="6 4"
                  />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(sigma[1])}
                    y2={y(sigma[1])}
                    stroke={DATA_COLORS.secondary}
                    strokeDasharray="6 4"
                  />
                  <CurvePath
                    points={points}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.tertiary}
                    width={2.5}
                  />
                  <circle
                    cx={x(angle)}
                    cy={y(stretch)}
                    r={6}
                    fill={DATA_COLORS.highlight}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                </>
              );
            }}
          </ChartSvg>
        </div>
      </div>
    </VizFrame>
  );
}
