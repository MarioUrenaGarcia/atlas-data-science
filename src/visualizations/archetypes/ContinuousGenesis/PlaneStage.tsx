import { DATA_COLORS } from '../../core/colors.ts';
import styles from './ContinuousGenesis.module.css';
import { tex } from './headers.ts';
import { value } from './processes.ts';
import {
  continuousTitle,
  experimentDone,
  revealedEvents,
  type ContinuousStageProps,
} from './stage.ts';

const SPREAD = 3;

/**
 * A point drawn from a 2D normal centered at (nu, 0); its distance to the
 * origin is the recorded value, drawn as a circle through the point.
 */
export function PlaneStage({
  box,
  settings,
  experiment,
  shown,
  completed,
  animate,
}: ContinuousStageProps) {
  const nu = value(settings, 'nu', 0);
  const sigma = value(settings, 'sigma', 1);
  const point = revealedEvents(experiment, shown).find((event) => event.kind === 'point');
  const done = experimentDone(experiment, shown);
  // The view spans three standard deviations around the center and always includes the origin.
  const xLo = Math.min(0, nu) - SPREAD * sigma;
  const xHi = Math.max(0, nu) + SPREAD * sigma;
  const yHalf = SPREAD * sigma;
  const scale = Math.min((box.width - 40) / (xHi - xLo), (box.height - 50) / (2 * yHalf));
  const cx = box.x + box.width / 2 - ((xLo + xHi) / 2) * scale;
  const cy = box.y + 28 + (box.height - 40) / 2;
  const sx = (x: number) => cx + x * scale;
  const sy = (y: number) => cy - y * scale;
  const distance = point?.kind === 'point' ? Math.hypot(point.x, point.y) : 0;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {continuousTitle('Punto', 'Listo para el primer punto', experiment, shown, completed)}
      </text>
      <line x1={sx(xLo)} x2={sx(xHi)} y1={cy} y2={cy} stroke="var(--data-grid)" />
      <line x1={cx} x2={cx} y1={sy(yHalf)} y2={sy(-yHalf)} stroke="var(--data-grid)" />
      {[1, 2].map((m) => (
        <ellipse
          key={m}
          cx={sx(nu)}
          cy={cy}
          rx={m * sigma * scale}
          ry={m * sigma * scale}
          fill="none"
          stroke={DATA_COLORS.primary}
          strokeOpacity={0.35}
          strokeDasharray="4 4"
        />
      ))}
      <circle cx={sx(nu)} cy={cy} r={3} fill={DATA_COLORS.primary} />
      <text x={sx(nu) + 6} y={cy + 14} className={styles.caption}>
        {`centro (${tex(nu, 2)}, 0)`}
      </text>
      <circle cx={cx} cy={cy} r={3} fill="var(--color-text)" />
      <text x={cx - 6} y={cy + 14} textAnchor="end" className={styles.caption}>
        origen
      </text>
      {point?.kind === 'point' && (
        <g key={completed} className={animate && !done ? styles.pop : undefined}>
          <circle
            cx={cx}
            cy={cy}
            r={distance * scale}
            fill="none"
            stroke={DATA_COLORS.highlight}
            strokeWidth={1.5}
          />
          <line
            x1={cx}
            y1={cy}
            x2={sx(point.x)}
            y2={sy(point.y)}
            stroke={DATA_COLORS.highlight}
            strokeWidth={2}
          />
          <circle cx={sx(point.x)} cy={sy(point.y)} r={6} fill={DATA_COLORS.secondary} />
          <text x={sx(point.x) + 8} y={sy(point.y) - 8} className={styles.strong}>
            {`R = ${tex(distance, 2)}`}
          </text>
        </g>
      )}
    </g>
  );
}
