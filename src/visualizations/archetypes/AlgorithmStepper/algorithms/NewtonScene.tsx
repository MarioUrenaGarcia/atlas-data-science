import { DATA_COLORS } from '../../../core/colors.ts';
import type { SceneProps } from '../types.ts';
import { FunctionScene } from './FunctionScene.tsx';
import type { NewtonState } from './newton.ts';
import { ROOT_FUNCTIONS } from './rootFunctions.ts';

export function NewtonScene({ state, label }: SceneProps<NewtonState>) {
  const fn = ROOT_FUNCTIONS[state.functionId] ?? ROOT_FUNCTIONS.cubica;
  if (!fn) return null;
  const [lo, hi] = fn.window;
  const previous = state.history[state.history.length - 1];
  return (
    <FunctionScene fn={fn} label={label}>
      {({ x, y }) => (
        <g aria-hidden="true">
          {state.history.map((value, index) => (
            <circle
              key={index}
              cx={x(Math.min(hi, Math.max(lo, value)))}
              cy={y(0)}
              r={3}
              fill={DATA_COLORS.neutral}
            />
          ))}
          {previous !== undefined && Number.isFinite(previous) && (
            <>
              {/* Tangent at the previous iterate, extended to where it meets the axis. */}
              <line
                x1={x(lo)}
                x2={x(hi)}
                y1={y(fn.f(previous) + fn.derivative(previous) * (lo - previous))}
                y2={y(fn.f(previous) + fn.derivative(previous) * (hi - previous))}
                stroke={DATA_COLORS.secondary}
                strokeWidth={1.8}
              />
              <line
                x1={x(previous)}
                x2={x(previous)}
                y1={y(0)}
                y2={y(fn.f(previous))}
                stroke={DATA_COLORS.muted}
                strokeDasharray="4 3"
              />
              <circle cx={x(previous)} cy={y(fn.f(previous))} r={5} fill={DATA_COLORS.secondary} />
            </>
          )}
          {Number.isFinite(state.x) && state.x >= lo && state.x <= hi && (
            <circle
              cx={x(state.x)}
              cy={y(0)}
              r={6}
              fill={DATA_COLORS.highlight}
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          )}
        </g>
      )}
    </FunctionScene>
  );
}
