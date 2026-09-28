import type { Matrix } from '../../../lib/linalg/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import styles from '../../core/svg/svg.module.css';
import { useTransitionProgress } from '../../core/useTransitionProgress.ts';

interface StateGraphProps {
  states: readonly string[];
  transition: Matrix;
  current: number;
  previous: number | null;
  /** Number of steps taken; each change animates the token along the last edge. */
  stepCount: number;
  tokenDuration: number;
  label: string;
}

const NODE_RADIUS = 24;
const MIN_PROBABILITY = 0.005;

/** Control point of the curve between two states, bent to the right of the direction of travel. */
function control(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: mx + (-dy / length) * bend, y: my + (dx / length) * bend };
}

function pointOnQuadratic(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

export function StateGraph({
  states,
  transition,
  current,
  previous,
  stepCount,
  tokenDuration,
  label,
}: StateGraphProps) {
  const progress = useTransitionProgress(stepCount, tokenDuration);
  return (
    <ChartSvg
      label={label}
      aspect={0.62}
      minHeight={260}
      maxHeight={440}
      margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      {(box) => {
        const cx = box.inner.left + box.inner.width / 2;
        const cy = box.inner.top + box.inner.height / 2;
        const radius = Math.max(
          40,
          Math.min(box.inner.width, box.inner.height) / 2 - NODE_RADIUS - 26,
        );
        const positions = states.map((_, index) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * index) / states.length;
          return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
        });
        const token = (() => {
          const target = positions[current];
          if (!target) return { x: cx, y: cy };
          if (previous === null || progress >= 1) return target;
          const origin = positions[previous];
          if (!origin) return target;
          if (previous === current) {
            const angle = Math.atan2(target.y - cy, target.x - cx);
            const loop = {
              x: target.x + Math.cos(angle) * (NODE_RADIUS + 14),
              y: target.y + Math.sin(angle) * (NODE_RADIUS + 14),
            };
            const theta = progress * 2 * Math.PI;
            return {
              x: loop.x - Math.cos(angle + theta) * 14,
              y: loop.y - Math.sin(angle + theta) * 14,
            };
          }
          return pointOnQuadratic(origin, control(origin, target, 28), target, progress);
        })();
        return (
          <>
            <defs>
              <marker
                id="markov-head"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={DATA_COLORS.muted} />
              </marker>
            </defs>
            {transition.map((row, i) =>
              row.map((probability, j) => {
                if (probability < MIN_PROBABILITY) return null;
                const from = positions[i];
                const to = positions[j];
                if (!from || !to) return null;
                const width = 1 + probability * 4;
                if (i === j) {
                  const angle = Math.atan2(from.y - cy, from.x - cx);
                  const loopX = from.x + Math.cos(angle) * (NODE_RADIUS + 14);
                  const loopY = from.y + Math.sin(angle) * (NODE_RADIUS + 14);
                  return (
                    <g key={`${i}-${j}`} aria-hidden="true">
                      <circle
                        cx={loopX}
                        cy={loopY}
                        r={14}
                        fill="none"
                        stroke={DATA_COLORS.muted}
                        strokeWidth={width}
                        strokeOpacity={0.55}
                      />
                      <text
                        x={loopX + Math.cos(angle) * 24}
                        y={loopY + Math.sin(angle) * 24}
                        textAnchor="middle"
                        dy="0.32em"
                        className={styles.labelMuted}
                      >
                        {probability.toFixed(2)}
                      </text>
                    </g>
                  );
                }
                const c = control(from, to, 28);
                // Shorten the curve so the arrow head stops at the node border.
                const end = pointOnQuadratic(
                  from,
                  c,
                  to,
                  1 - NODE_RADIUS / Math.max(1, Math.hypot(to.x - from.x, to.y - from.y)),
                );
                const middle = pointOnQuadratic(from, c, to, 0.5);
                return (
                  <g key={`${i}-${j}`} aria-hidden="true">
                    <path
                      d={`M${from.x},${from.y} Q${c.x},${c.y} ${end.x},${end.y}`}
                      fill="none"
                      stroke={DATA_COLORS.muted}
                      strokeWidth={width}
                      strokeOpacity={0.55}
                      markerEnd="url(#markov-head)"
                    />
                    <text
                      x={middle.x}
                      y={middle.y}
                      textAnchor="middle"
                      dy="0.32em"
                      className={styles.labelMuted}
                    >
                      {probability.toFixed(2)}
                    </text>
                  </g>
                );
              }),
            )}
            {positions.map((position, index) => (
              <g key={states[index]} aria-hidden="true">
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={NODE_RADIUS}
                  fill={index === current ? seriesColor(index) : 'var(--color-surface)'}
                  fillOpacity={index === current ? 0.22 : 1}
                  stroke={seriesColor(index)}
                  strokeWidth={index === current ? 4 : 2}
                />
                <text
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dy="0.32em"
                  className={styles.label}
                >
                  {states[index]}
                </text>
              </g>
            ))}
            {/* The token is drawn only while it travels; at rest the current state is filled. */}
            {previous !== null && progress < 1 && (
              <circle
                cx={token.x}
                cy={token.y}
                r={8}
                fill={DATA_COLORS.text}
                stroke="var(--color-surface)"
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
