import { useMemo, useState } from 'react';
import { feasiblePolygon, projectOntoPolygon, type HalfPlane } from '../../../lib/multivariable/constraints.ts';
import type { Point } from '../../../lib/optimization/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { num } from '../../core/plane/levels.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FunctionMap } from './FunctionMap.tsx';
import { item, point, pointTex, useFunctionChoice } from './shared.ts';

const ITERATIONS = 40;
const STEPS_PER_SECOND = 3;
const DOT_RADIUS = 5;

interface ConstrainedViewProps {
  title: string;
  ids: readonly string[];
  planes: readonly HalfPlane[];
  start: Point;
  rate: number;
}

/**
 * An optimization problem with linear inequality constraints, solved by
 * projected gradient descent: a gradient step that may leave the feasible
 * region, followed by the projection back onto it, the nearest feasible
 * point. The iterates stay feasible and stop where the pull of the gradient
 * is balanced by the active constraints.
 */
export function ConstrainedView({ title, ids, planes, start, rate }: ConstrainedViewProps) {
  const { parameters, values, fn, start: x0 } = useFunctionChoice(ids, start);
  const region = useMemo(() => feasiblePolygon(planes, [fn.domain.x, fn.domain.y]), [planes, fn]);
  const steps = useMemo(() => {
    const list: { point: Point; gradientPoint: Point }[] = [];
    let current = projectOntoPolygon(x0, planes).point;
    list.push({ point: current, gradientPoint: current });
    for (let k = 0; k < ITERATIONS; k += 1) {
      const g = fn.gradient(current);
      const gradientPoint: Point = [current[0] - rate * g[0], current[1] - rate * g[1]];
      current = projectOntoPolygon(gradientPoint, planes).point;
      list.push({ point: current, gradientPoint });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, planes, rate, x0[0], x0[1]]);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(ITERATIONS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= ITERATIONS,
  });
  const current = item(steps, step);
  const next = item(steps, Math.min(step + 1, ITERATIONS));
  const active = projectOntoPolygon(next.gradientPoint, planes).active;
  const unconstrained = fn.minima[0] ?? null;
  const description =
    `Minimizar ${fn.label} sujeto a ${planes.map((p) => p.label.replace(/\\le/g, '≤').replace(/\\ge/g, '≥')).join(', ')}. ` +
    `Iteración ${step}: punto ${point(current.point, 3)} con f = ${num(fn.f(current.point), 4)}` +
    (unconstrained ? `; el mínimo sin restricciones, ${point(unconstrained)}, ${planes.every((p) => p.a[0] * unconstrained[0] + p.a[1] * unconstrained[1] <= p.c + 1e-9) ? 'es factible' : 'queda fuera de la región'}.` : '.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        { label: 'Iteración k', value: String(step) },
        { label: 'x_k', value: point(current.point, 3), color: DATA_COLORS.highlight },
        { label: 'f(x_k)', value: num(fn.f(current.point), 4) },
        { label: 'Restricciones activas', value: active.length ? active.map((i) => String(i + 1)).join(', ') : 'ninguna' },
      ]}
      legend={[
        { label: 'Región factible', color: DATA_COLORS.primary },
        { label: 'Paso de gradiente', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Punto proyectado', color: DATA_COLORS.highlight, shape: 'circle' },
        { label: 'Mínimo sin restricciones', color: DATA_COLORS.text, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\min_{\\mathbf{x}} f(\\mathbf{x})\\ \\text{ sujeto a }\\ ${planes.map((p) => p.label).join(',\\ ')}`}
      />
      <FormulaLine
        tex={`\\mathbf{x}_{${step + 1}} = P_C\\big(\\mathbf{x}_{${step}} - \\eta\\,\\nabla f(\\mathbf{x}_{${step}})\\big) = P_C${pointTex(next.gradientPoint)} = ${pointTex(next.point)}`}
      />
      <FunctionMap fn={fn} label={description} highlight={fn.f(current.point)}>
        {({ x, y }) => (
          <g aria-hidden="true">
            <polygon points={region.map((p) => `${x(p[0])},${y(p[1])}`).join(' ')} fill={DATA_COLORS.primary} fillOpacity={0.22} stroke={DATA_COLORS.primary} strokeWidth={2} />
            {unconstrained && <circle cx={x(unconstrained[0])} cy={y(unconstrained[1])} r={DOT_RADIUS} fill="none" stroke={DATA_COLORS.text} strokeWidth={2} />}
            <polyline points={steps.slice(0, step + 1).map((s) => `${x(s.point[0])},${y(s.point[1])}`).join(' ')} fill="none" stroke={DATA_COLORS.highlight} strokeWidth={2} />
            <line x1={x(current.point[0])} y1={y(current.point[1])} x2={x(next.gradientPoint[0])} y2={y(next.gradientPoint[1])} stroke={DATA_COLORS.secondary} strokeDasharray="4 3" />
            <line x1={x(next.gradientPoint[0])} y1={y(next.gradientPoint[1])} x2={x(next.point[0])} y2={y(next.point[1])} stroke={DATA_COLORS.text} strokeDasharray="2 3" />
            <circle cx={x(next.gradientPoint[0])} cy={y(next.gradientPoint[1])} r={DOT_RADIUS - 1} fill={DATA_COLORS.secondary} />
            <circle cx={x(current.point[0])} cy={y(current.point[1])} r={DOT_RADIUS} fill={DATA_COLORS.highlight} stroke="var(--color-surface)" strokeWidth={2} />
          </g>
        )}
      </FunctionMap>
    </VizFrame>
  );
}
