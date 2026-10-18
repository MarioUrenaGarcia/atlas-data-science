import { useMemo, useState } from 'react';
import { ODE_CASES } from '../../../lib/numerics/functions.ts';
import { ODE_ORDER, solveOde, type OdeMethod } from '../../../lib/numerics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { exact, sci } from './format.ts';

const STEPS_PER_SECOND = 4;
const DOT_RADIUS = 4;
const H_MIN = 0.01;
const H_MAX = 1;
/** Vertical limit, as a multiple of the exact solution's range, beyond which points are clipped. */
const CLIP = 3;

const INFO: Record<OdeMethod, { name: string; color: string; latex: string }> = {
  euler: { name: 'Euler', color: DATA_COLORS.secondary, latex: 'y_{k+1} = y_k + h\\,f(t_k, y_k)' },
  rk2: {
    name: 'Runge-Kutta 2 (Heun)',
    color: DATA_COLORS.tertiary,
    latex: 'y_{k+1} = y_k + \\tfrac{h}{2}(k_1 + k_2)',
  },
  rk4: {
    name: 'Runge-Kutta 4',
    color: DATA_COLORS.quaternary,
    latex: 'y_{k+1} = y_k + \\tfrac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
  },
};

interface OdeViewProps {
  title: string;
  id: string;
  h: number;
  methods: readonly OdeMethod[];
}

/**
 * Euler and Runge-Kutta steps for y' = f(t, y) against the exact solution. The
 * animation advances one step at a time; the error at the end shrinks like
 * h for Euler, h^2 for Heun and h^4 for the classical Runge-Kutta method, and
 * a step that is too large makes Euler unstable on a fast decay.
 */
export function OdeView({ title, id, h, methods }: OdeViewProps) {
  const ode = ODE_CASES[id] ?? ODE_CASES.decaimiento;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'h',
        label: 'Paso',
        min: H_MIN,
        max: H_MAX,
        step: 0.01,
        default: h,
        symbol: 'h',
        digits: 2,
      },
    ],
    [h],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, unknown>;
  const step = Number(values.h);
  const totalSteps = ode ? Math.max(1, Math.round((ode.tEnd - ode.t0) / step)) : 1;
  const [k, setK] = useState(totalSteps);
  const playback = usePlayback({
    step: () => setK((value) => Math.min(totalSteps, value + 1)),
    reset: () => setK(0),
    rate: STEPS_PER_SECOND,
    done: k >= totalSteps,
  });
  if (!ode) return null;
  const shownSteps = Math.min(k, totalSteps);
  const solutions = methods.map((method) =>
    solveOde(ode.f, ode.t0, ode.y0, step, totalSteps, method),
  );
  const [y0, y1] = autoYDomain([{ f: ode.exact, color: '' }], [ode.t0, ode.tEnd]);
  const span = y1 - y0 || 1;
  const clip = (v: number) => Math.max(y0 - CLIP * span, Math.min(y1 + CLIP * span, v));
  const t = ode.t0 + shownSteps * step;
  const exactNow = ode.exact(t);
  const errors = solutions.map((points) => Math.abs((points[shownSteps]?.y ?? 0) - exactNow));
  const description =
    `${id} con h = ${step}: paso ${shownSteps} de ${totalSteps}, t = ${exact(Number(t.toFixed(6)))}. Solución exacta ${exact(exactNow)}. ` +
    methods
      .map(
        (m, i) =>
          `${INFO[m].name}: ${exact(solutions[i]?.[shownSteps]?.y ?? 0)}, error ${sci(errors[i] ?? 0)}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Paso k', value: `${shownSteps} de ${totalSteps}` },
        { label: 'Solución exacta', value: exact(exactNow), color: DATA_COLORS.primary },
        ...methods.map((m, i) => ({
          label: `Error de ${INFO[m].name} (orden ${ODE_ORDER[m]})`,
          value: sci(errors[i] ?? 0),
          color: INFO[m].color,
        })),
      ]}
      legend={[
        { label: 'Solución exacta', color: DATA_COLORS.primary, shape: 'line' },
        ...methods.map((m) => ({
          label: INFO[m].name,
          color: INFO[m].color,
          shape: 'circle' as const,
        })),
      ]}
      description={description}
    >
      <FormulaLine
        tex={`${ode.latex},\\qquad ${methods.length === 1 ? `${INFO[methods[0] ?? 'euler'].latex},\\quad ` : ''}h = ${step},\\quad y(${exact(Number(t.toFixed(4)), true)}) = ${exact(exactNow, true)}`}
      />
      <FunctionPlot
        xDomain={[ode.t0, ode.tEnd]}
        yDomain={[y0 - span * 0.15, y1 + span * 0.15]}
        xLabel="t"
        label={description}
        curves={[{ f: ode.exact, color: DATA_COLORS.primary, width: 3 }]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {solutions.map((points, i) => {
              const method = methods[i] ?? 'euler';
              const shown = points.slice(0, shownSteps + 1);
              return (
                <g key={method}>
                  <polyline
                    points={shown.map((p) => `${x(p.t)},${y(clip(p.y))}`).join(' ')}
                    fill="none"
                    stroke={INFO[method].color}
                    strokeWidth={1.8}
                  />
                  {shown.map((p, j) => (
                    <circle
                      key={j}
                      cx={x(p.t)}
                      cy={y(clip(p.y))}
                      r={DOT_RADIUS}
                      fill={INFO[method].color}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
