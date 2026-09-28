import { DATA_COLORS } from '../../../core/colors.ts';
import type { SceneProps } from '../types.ts';
import type { BisectionState } from './bisection.ts';
import { FunctionScene } from './FunctionScene.tsx';
import { ROOT_FUNCTIONS } from './rootFunctions.ts';

export function BisectionScene({ state, label }: SceneProps<BisectionState>) {
  const fn = ROOT_FUNCTIONS[state.functionId] ?? ROOT_FUNCTIONS.cubica;
  if (!fn) return null;
  return (
    <FunctionScene fn={fn} label={label}>
      {({ x, y, top, bottom }) => (
        <g aria-hidden="true">
          {/* Previous brackets, stacked under the axis, show how the interval halves. */}
          {state.history.map(([a, b], index) => (
            <rect
              key={index}
              x={x(a)}
              y={bottom - 6 - index * 5}
              width={Math.max(1, x(b) - x(a))}
              height={3}
              fill={DATA_COLORS.neutral}
              fillOpacity={0.5}
            />
          ))}
          <rect
            x={x(state.a)}
            y={top}
            width={Math.max(1, x(state.b) - x(state.a))}
            height={bottom - top}
            fill={DATA_COLORS.highlight}
            fillOpacity={0.14}
          />
          <line
            x1={x(state.a)}
            x2={x(state.a)}
            y1={top}
            y2={bottom}
            stroke={DATA_COLORS.highlight}
            strokeWidth={1.5}
          />
          <line
            x1={x(state.b)}
            x2={x(state.b)}
            y1={top}
            y2={bottom}
            stroke={DATA_COLORS.highlight}
            strokeWidth={1.5}
          />
          <circle
            cx={x(state.a)}
            cy={y(state.fa)}
            r={5}
            fill={state.fa < 0 ? DATA_COLORS.negative : DATA_COLORS.positive}
          />
          <circle
            cx={x(state.b)}
            cy={y(state.fb)}
            r={5}
            fill={state.fb < 0 ? DATA_COLORS.negative : DATA_COLORS.positive}
          />
          {state.m !== null && (
            <>
              <line
                x1={x(state.m)}
                x2={x(state.m)}
                y1={y(0)}
                y2={y(state.fm ?? 0)}
                stroke={DATA_COLORS.secondary}
                strokeDasharray="4 3"
              />
              <circle
                cx={x(state.m)}
                cy={y(state.fm ?? 0)}
                r={6}
                fill={DATA_COLORS.secondary}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            </>
          )}
        </g>
      )}
    </FunctionScene>
  );
}
