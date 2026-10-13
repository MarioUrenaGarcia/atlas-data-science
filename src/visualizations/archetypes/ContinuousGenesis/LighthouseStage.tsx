import { DATA_COLORS } from '../../core/colors.ts';
import styles from './ContinuousGenesis.module.css';
import { tex } from './headers.ts';
import { value } from './processes.ts';
import { continuousTitle, revealedEvents, type ContinuousStageProps } from './stage.ts';

/** Half width of the visible coast, in multiples of the distance gamma. */
const VIEW_GAMMAS = 8;

/**
 * A lighthouse at distance gamma from a straight coast turns its beam to a
 * uniformly random angle; the point where the beam hits the coast is Cauchy.
 */
export function LighthouseStage({
  box,
  settings,
  experiment,
  shown,
  completed,
}: ContinuousStageProps) {
  const x0 = value(settings, 'x0', 0);
  const gamma = value(settings, 'gamma', 1);
  const angle = revealedEvents(experiment, shown).find((event) => event.kind === 'angle');
  const half = VIEW_GAMMAS * gamma;
  const left = box.x + 20;
  const right = box.x + box.width - 20;
  const coastY = box.y + box.height - 34;
  const unit = (right - left) / (2 * half);
  const towerY = Math.max(box.y + 40, coastY - gamma * unit);
  const px = (x: number) => left + (x - (x0 - half)) * unit;
  const hit = angle?.kind === 'angle' ? x0 + gamma * Math.tan(angle.theta) : null;
  const visible = hit !== null && Math.abs(hit - x0) <= half;
  // When the hit point is off screen the beam is cut where its line crosses the border of the view.
  let beamEnd: { x: number; y: number } | null = null;
  if (hit !== null) {
    const target = px(hit);
    const border = hit > x0 ? right : left;
    const fraction = visible ? 1 : (border - px(x0)) / (target - px(x0));
    beamEnd = { x: visible ? target : border, y: towerY + fraction * (coastY - towerY) };
  }

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {continuousTitle('Destello', 'Listo para el primer destello', experiment, shown, completed)}
      </text>
      <line
        x1={left}
        x2={right}
        y1={coastY}
        y2={coastY}
        stroke="var(--data-axis)"
        strokeWidth={2}
      />
      {[-half, -half / 2, 0, half / 2, half].map((offset) => (
        <text
          key={offset}
          x={px(x0 + offset)}
          y={coastY + 16}
          textAnchor="middle"
          className={styles.caption}
        >
          {tex(x0 + offset, 2)}
        </text>
      ))}
      <line
        x1={px(x0)}
        x2={px(x0)}
        y1={towerY}
        y2={coastY}
        stroke="var(--data-grid)"
        strokeDasharray="4 4"
      />
      <text x={px(x0) + 6} y={(towerY + coastY) / 2} className={styles.caption}>
        {`γ = ${tex(gamma, 2)}`}
      </text>
      {beamEnd && (
        <line
          key={completed}
          x1={px(x0)}
          y1={towerY}
          x2={beamEnd.x}
          y2={beamEnd.y}
          stroke={DATA_COLORS.highlight}
          strokeWidth={2}
        />
      )}
      <rect
        x={px(x0) - 7}
        y={towerY - 16}
        width={14}
        height={16}
        fill={DATA_COLORS.primary}
        rx={2}
      />
      {hit !== null &&
        (visible ? (
          <circle cx={px(hit)} cy={coastY} r={6} fill={DATA_COLORS.secondary} />
        ) : (
          <text
            x={hit > x0 ? right : left}
            y={coastY - 10}
            textAnchor={hit > x0 ? 'end' : 'start'}
            className={styles.strong}
          >
            {`fuera de la vista: ${tex(hit, 2)}`}
          </text>
        ))}
    </g>
  );
}
