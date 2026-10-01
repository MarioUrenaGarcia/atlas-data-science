import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { determinant, eigen, eigenText, matLatex, trace, type Mat2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { TransformedGrid } from './TransformedGrid.tsx';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const SWEEP_STEPS = 240;
const STEPS_PER_SECOND = 30;
const CURVE_SAMPLES = 160;
/** Margin added around the eigenvalues when choosing the λ range. */
const RANGE_PADDING = 1.5;
/** |p(λ)| below this marks λ as a root. */
const ROOT_TOLERANCE = 1e-9;

const polynomial = (tr: number, det: number, lambda: number) => lambda * lambda - tr * lambda + det;

const signed = (value: number) =>
  value < 0 ? `- ${formatNumber(-value, 2)}` : `+ ${formatNumber(value, 2)}`;

interface CharacteristicViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * λ sweeps along the real line. For each value the right panel shows the map
 * A - λI and the left panel the signed area it gives the unit square, which
 * is p(λ) = det(A - λI). At the roots the map flattens the plane onto a line:
 * there a nonzero vector goes to zero, so it is an eigenvector.
 */
export function CharacteristicView({ title, matrices }: CharacteristicViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const tr = trace(matrix);
  const det = determinant(matrix);
  const { real, imaginary } = eigen(matrix);
  const center = tr / 2;
  const halfWidth = Math.max(
    2.5,
    Math.abs(real[0] - center) + RANGE_PADDING,
    Math.abs(imaginary[0]) + RANGE_PADDING,
  );
  const lo = center - halfWidth;
  const hi = center + halfWidth;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(SWEEP_STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP_STEPS,
  });
  const stepWidth = (hi - lo) / SWEEP_STEPS;
  const raw = lo + stepWidth * step;
  const roots = imaginary[0] === 0 ? [real[0], real[1]] : [];
  // The sweep lands exactly on a root when it passes within half a step, so the flattening is always visible.
  const lambda = roots.find((root) => Math.abs(root - raw) <= stepWidth / 2) ?? raw;
  const value = polynomial(tr, det, lambda);
  const shifted: Mat2 = [
    [matrix[0][0] - lambda, matrix[0][1]],
    [matrix[1][0], matrix[1][1] - lambda],
  ];
  const atRoot = Math.abs(value) < ROOT_TOLERANCE;
  const points = Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) => {
    const x = lo + ((hi - lo) * index) / CURVE_SAMPLES;
    return { x, y: polynomial(tr, det, x) };
  });
  const yValues = points.map((point) => point.y);
  const yLo = Math.min(-1, ...yValues);
  const yHi = Math.max(1, ...yValues);
  const description =
    `p(λ) = λ² ${signed(-tr)} λ ${signed(det)}. Con λ = ${formatNumber(lambda, 2)}, det(A - λI) = ${formatNumber(value, 3)}` +
    (atRoot ? ': A - λI aplasta el plano y λ es valor propio.' : '.') +
    ` Raíces: ${eigenText(matrix)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Traza de A', value: formatNumber(tr, 3) },
        { label: 'det A', value: formatNumber(det, 3) },
        { label: 'λ', value: formatNumber(lambda, 2), color: DATA_COLORS.highlight },
        {
          label: 'p(λ) = det(A - λI)',
          value: formatNumber(value, 3),
          color: atRoot ? DATA_COLORS.highlight : undefined,
        },
        { label: 'Discriminante tr² - 4 det', value: formatNumber(tr * tr - 4 * det, 3) },
        { label: 'Raíces (valores propios)', value: eigenText(matrix) },
      ]}
      legend={[
        { label: 'p(λ)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Raíces reales', color: DATA_COLORS.negative, shape: 'circle' },
        { label: 'λ actual', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\mathbf{A} = ${matLatex(matrix)},\\quad p(\\lambda) = \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = \\lambda^2 ${signed(-tr)}\\,\\lambda ${signed(det)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>p(λ) = det(A - λI)</p>
          <ChartSvg
            label={description}
            aspect={0.8}
            minHeight={220}
            maxHeight={360}
            margins={{ left: 44, bottom: 36 }}
          >
            {(box) => {
              const x = scaleLinear()
                .domain([lo, hi])
                .range([box.inner.left, box.inner.left + box.inner.width]);
              const y = scaleLinear()
                .domain([yLo, yHi])
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
                    ticks={6}
                    label="λ"
                  />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(0)}
                    y2={y(0)}
                    stroke={DATA_COLORS.muted}
                    strokeWidth={1.2}
                  />
                  <CurvePath
                    points={points}
                    xScale={x}
                    yScale={y}
                    color={DATA_COLORS.primary}
                    width={2.5}
                  />
                  {roots.map((root, index) => (
                    <circle key={index} cx={x(root)} cy={y(0)} r={6} fill={DATA_COLORS.negative} />
                  ))}
                  <line
                    x1={x(lambda)}
                    x2={x(lambda)}
                    y1={y(0)}
                    y2={y(value)}
                    stroke={DATA_COLORS.highlight}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                  />
                  <circle
                    cx={x(lambda)}
                    cy={y(value)}
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
        <div>
          <p className={styles.panelTitle}>B = A - λI actuando sobre el plano</p>
          <CartesianPlane
            extent={3.5}
            label={description}
            grid={false}
            aspect={0.8}
            minHeight={220}
            maxHeight={360}
          >
            {(plane) => <TransformedGrid plane={plane} matrix={shifted} name="B" />}
          </CartesianPlane>
        </div>
      </div>
    </VizFrame>
  );
}
