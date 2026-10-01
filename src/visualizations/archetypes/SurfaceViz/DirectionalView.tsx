import { useMemo, useState } from 'react';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { fieldRange, num } from './levels.ts';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const START: Point2 = [0.8, 0.4];
const STEPS = 144;
const STEPS_PER_SECOND = 18;
const ARROW = 0.6;
const DOT_RADIUS = 5;

interface DirectionalViewProps {
  title: string;
  ids: readonly string[];
}

/**
 * The directional derivative D_u f = ∇f · u. A unit vector u turns around the
 * point; on the right, the rate of change in its direction is plotted against
 * the angle. It is a cosine wave: largest along the gradient, zero along the
 * level curve and most negative against the gradient.
 */
export function DirectionalView({ title, ids }: DirectionalViewProps) {
  const { parameters, values, field, point } = useFieldChoice(ids, START);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % STEPS),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
  });
  const degrees = (360 * step) / STEPS;
  const angle = (degrees * Math.PI) / 180;
  const u: Point2 = [Math.cos(angle), Math.sin(angle)];
  const [gx, gy] = field.grad(point[0], point[1]);
  const size = Math.hypot(gx, gy);
  const rate = gx * u[0] + gy * u[1];
  const gradAngle = ((Math.atan2(gy, gx) * 180) / Math.PI + 360) % 360;
  const curve = (d: number) => gx * Math.cos((d * Math.PI) / 180) + gy * Math.sin((d * Math.PI) / 180);
  const description =
    `En (${num(point[0], 2)}, ${num(point[1], 2)}) de ${fieldName(field.id)}, la dirección a ${num(degrees, 0)} grados da D_u f = ${num(rate, 3)}. ` +
    `El máximo, ${num(size, 3)}, se alcanza a ${num(gradAngle, 0)} grados, la dirección del gradiente.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Ángulo de u', value: `${num(degrees, 0)}°` },
        { label: 'u', value: `(${num(u[0], 3)}, ${num(u[1], 3)})`, color: DATA_COLORS.tertiary },
        { label: '∇f', value: `(${num(gx, 3)}, ${num(gy, 3)})`, color: DATA_COLORS.secondary },
        { label: 'D_u f = ∇f · u', value: num(rate, 3), color: DATA_COLORS.highlight },
        { label: 'Máximo |∇f| a', value: `${num(gradAngle, 0)}°` },
      ]}
      legend={[
        { label: 'Dirección u', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Gradiente', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = (${num(gx, 2)})(${num(u[0], 3)}) + (${num(gy, 2)})(${num(u[1], 3)}) = ${num(rate, 3)}`} />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>La dirección gira alrededor del punto</p>
          <ContourMap f={field.f} domain={field.domain} range={range} highlight={field.f(point[0], point[1])} label={description}>
            {({ x, y, unit }) => (
              <g aria-hidden="true">
                {size > 1e-9 && (
                  <Arrow x1={x(point[0])} y1={y(point[1])} x2={x(point[0]) + (gx / size) * ARROW * unit} y2={y(point[1]) - (gy / size) * ARROW * unit} color={DATA_COLORS.secondary} width={2.5} dashed />
                )}
                <Arrow x1={x(point[0])} y1={y(point[1])} x2={x(point[0]) + u[0] * ARROW * unit} y2={y(point[1]) - u[1] * ARROW * unit} color={DATA_COLORS.tertiary} width={3} />
                <circle cx={x(point[0])} cy={y(point[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </ContourMap>
        </div>
        <div>
          <p className={styles.panelTitle}>D_u f según el ángulo de u</p>
          <FunctionPlot
            xDomain={[0, 360]}
            yDomain={[-(size || 1) * 1.2, (size || 1) * 1.2]}
            xLabel="ángulo de u (grados)"
            label={`Derivada direccional según el ángulo. ${description}`}
            aspect={0.75}
            curves={[{ f: curve, color: DATA_COLORS.highlight, width: 3 }]}
          >
            {(s) => (
              <g aria-hidden="true">
                <line x1={s.x(gradAngle)} x2={s.x(gradAngle)} y1={s.box.inner.top} y2={s.box.inner.top + s.box.inner.height} stroke={DATA_COLORS.secondary} strokeDasharray="4 4" />
                <circle cx={s.x(degrees)} cy={s.y(rate)} r={DOT_RADIUS + 1} fill={DATA_COLORS.tertiary} />
              </g>
            )}
          </FunctionPlot>
        </div>
      </div>
    </VizFrame>
  );
}
