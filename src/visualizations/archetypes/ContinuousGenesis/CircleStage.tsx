import { DATA_COLORS } from '../../core/colors.ts';
import styles from './ContinuousGenesis.module.css';
import { tex } from './headers.ts';
import { value } from './processes.ts';
import { continuousTitle, revealedEvents, type ContinuousStageProps } from './stage.ts';

const COMPASS = [
  { angle: 0, label: '0' },
  { angle: Math.PI / 2, label: 'π/2' },
  { angle: Math.PI, label: 'π' },
  { angle: -Math.PI / 2, label: '-π/2' },
];

/** Directions drawn on a circle, with the mean direction marked; angles grow counterclockwise. */
export function CircleStage({
  box,
  settings,
  experiment,
  shown,
  completed,
  animate,
}: ContinuousStageProps) {
  const mu = value(settings, 'mu', 0);
  const angle = revealedEvents(experiment, shown).find((event) => event.kind === 'angle');
  const radius = Math.max(30, Math.min(box.height / 2 - 30, box.width / 2 - 60));
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2 + 10;
  const point = (theta: number, r = radius) => ({
    x: cx + r * Math.cos(theta),
    y: cy - r * Math.sin(theta),
  });
  const meanTip = point(mu, radius + 12);

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {continuousTitle(
          'Dirección',
          'Lista para la primera dirección',
          experiment,
          shown,
          completed,
        )}
      </text>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--data-axis)" />
      {COMPASS.map(({ angle: theta, label }) => {
        const p = point(theta, radius + 16);
        return (
          <text key={label} x={p.x} y={p.y + 4} textAnchor="middle" className={styles.caption}>
            {label}
          </text>
        );
      })}
      <line
        x1={cx}
        y1={cy}
        x2={meanTip.x}
        y2={meanTip.y}
        stroke={DATA_COLORS.primary}
        strokeDasharray="5 4"
      />
      <text x={meanTip.x} y={meanTip.y - 6} textAnchor="middle" className={styles.caption}>
        {`μ = ${tex(mu, 2)}`}
      </text>
      {angle?.kind === 'angle' && (
        <g key={completed} className={animate ? styles.pop : undefined}>
          <line
            x1={cx}
            y1={cy}
            x2={point(angle.theta).x}
            y2={point(angle.theta).y}
            stroke={DATA_COLORS.highlight}
            strokeWidth={3}
          />
          <circle
            cx={point(angle.theta).x}
            cy={point(angle.theta).y}
            r={6}
            fill={DATA_COLORS.secondary}
          />
        </g>
      )}
    </g>
  );
}
