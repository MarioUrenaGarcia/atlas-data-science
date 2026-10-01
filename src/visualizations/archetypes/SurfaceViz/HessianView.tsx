import { useMemo, useState } from 'react';
import { eigenSym2, type Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from '../../core/plane/ContourMap.tsx';
import { fieldRange, num } from '../../core/plane/levels.ts';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: Point2 = [0.6, 0.3];
const STEPS = 72;
const STEPS_PER_SECOND = 8;
/** Half length of the slice through the point, as a fraction of the domain width. */
const SLICE = 0.3;
const AXIS = 0.45;
const DOT_RADIUS = 5;

interface HessianViewProps {
  title: string;
  ids: readonly string[];
  /** Initial point; the sliders start here. */
  start?: Point2;
}

/**
 * The Hessian as the curvature in every direction. A line through the point
 * turns around it; on the right, the slice of f along the line is compared
 * with its quadratic approximation, whose curvature is uᵀHu. That curvature
 * moves between the two eigenvalues of H, reached along the eigenvectors.
 */
export function HessianView({ title, ids, start }: HessianViewProps) {
  const [sx, sy] = start ?? START;
  const initial = useMemo((): Point2 => [sx, sy], [sx, sy]);
  const { parameters, values, field, point } = useFieldChoice(ids, initial);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % STEPS),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const [[x0, x1]] = field.domain;
  const [a, b] = point;
  const f0 = field.f(a, b);
  const [gx, gy] = field.grad(a, b);
  const h = field.hess(a, b);
  const { values: eigen, vectors } = eigenSym2(h);
  const angle = (Math.PI * step) / STEPS;
  const u: Point2 = [Math.cos(angle), Math.sin(angle)];
  const slope = gx * u[0] + gy * u[1];
  const curvature = u[0] * (h[0][0] * u[0] + h[0][1] * u[1]) + u[1] * (h[1][0] * u[0] + h[1][1] * u[1]);
  const reach = SLICE * (x1 - x0);
  const slice = (t: number) => field.f(a + t * u[0], b + t * u[1]);
  const quadratic = (t: number) => f0 + slope * t + 0.5 * curvature * t * t;
  const degrees = (angle * 180) / Math.PI;
  const description =
    `${fieldName(field.id)} en (${num(a, 2)}, ${num(b, 2)}). Hessiana con valores propios ${num(eigen[0], 3)} y ${num(eigen[1], 3)}. ` +
    `En la dirección a ${num(degrees, 0)} grados la curvatura uᵀHu vale ${num(curvature, 3)}, entre los dos valores propios.`;
  const matrix = `\\begin{pmatrix} ${num(h[0][0], 3)} & ${num(h[0][1], 3)} \\\\ ${num(h[1][0], 3)} & ${num(h[1][1], 3)} \\end{pmatrix}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Ángulo de u', value: `${num(degrees, 0)}°` },
        { label: 'Curvatura uᵀHu', value: num(curvature, 3), color: DATA_COLORS.highlight },
        { label: 'λ₁, mayor', value: num(eigen[0], 3), color: DATA_COLORS.secondary },
        { label: 'λ₂, menor', value: num(eigen[1], 3), color: DATA_COLORS.tertiary },
        { label: 'det H', value: num(eigen[0] * eigen[1], 3) },
      ]}
      legend={[
        { label: 'Dirección u', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Vector propio de λ₁', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Vector propio de λ₂', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Aproximación cuadrática', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`\\mathbf{H}(${num(a, 2)}, ${num(b, 2)}) = ${matrix},\\qquad \\lambda_1 = ${num(eigen[0], 3)},\\quad \\lambda_2 = ${num(eigen[1], 3)}`} />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\mathbf{u} = (${num(u[0], 3)}, ${num(u[1], 3)}):\\quad \\mathbf{u}^\\top \\mathbf{H}\\,\\mathbf{u} = ${num(curvature, 3)} \\in [\\lambda_2, \\lambda_1]`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Ejes propios y línea que gira</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={f0} label={description}>
            {({ x, y, unit }) => (
              <g aria-hidden="true">
                <line
                  x1={x(a - reach * u[0])}
                  y1={y(b - reach * u[1])}
                  x2={x(a + reach * u[0])}
                  y2={y(b + reach * u[1])}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={3}
                />
                {vectors.map((v, index) => (
                  <Arrow
                    key={index}
                    x1={x(a)}
                    y1={y(b)}
                    x2={x(a) + v[0] * AXIS * unit}
                    y2={y(b) - v[1] * AXIS * unit}
                    color={index === 0 ? DATA_COLORS.secondary : DATA_COLORS.tertiary}
                    width={2.5}
                  />
                ))}
                <circle cx={x(a)} cy={y(b)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>Corte de f a lo largo de u y su parábola</p>
          <FunctionPlot
            xDomain={[-reach, reach]}
            xLabel="t, distancia sobre la línea"
            label={`Corte de la función y aproximación cuadrática. ${description}`}
            aspect={0.75}
            curves={[
              { f: slice, color: DATA_COLORS.primary, width: 3 },
              { f: quadratic, color: DATA_COLORS.highlight, width: 2, dashed: true },
            ]}
          >
            {(s) => <circle aria-hidden="true" cx={s.x(0)} cy={s.y(f0)} r={DOT_RADIUS} fill={DATA_COLORS.highlight} />}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
