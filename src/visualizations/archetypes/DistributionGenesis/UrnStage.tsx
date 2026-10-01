import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { urnSizes } from './processes.ts';
import { experimentNumber, isDone, revealed, stageTitle, type StageProps } from './stage.ts';

const URN_SHARE = 0.58;
const MAX_BALL = 10;

/**
 * An urn with N balls, K of them marked. Draws move balls to the sample
 * tray; with replacement the ball flashes and stays in the urn.
 */
export function UrnStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const { population, marked, draws } = urnSizes(settings);
  const events = revealed(experiment, shown);
  const drawn = events.flatMap((event) => (event.kind === 'draw' ? [event] : []));
  const number = experimentNumber(experiment, shown, completed);
  const done = isDone(experiment, shown);
  const top = box.y + 30;
  const height = box.height - 40;

  const urnWidth = box.width * URN_SHARE - 20;
  const columns = Math.ceil(Math.sqrt((population * urnWidth) / Math.max(1, height)));
  const rows = Math.ceil(population / columns);
  const radius = Math.max(
    2.5,
    Math.min(MAX_BALL, urnWidth / (columns * 2.4), height / (rows * 2.4)),
  );
  const urnLeft = box.x + 10;

  const trayLeft = box.x + box.width * URN_SHARE + 10;
  const trayWidth = box.width - (trayLeft - box.x) - 10;
  const trayColumns = Math.max(1, Math.ceil(Math.sqrt((draws * trayWidth) / Math.max(1, height))));
  const trayRows = Math.ceil(draws / trayColumns);
  const trayRadius = Math.max(
    2.5,
    Math.min(MAX_BALL, trayWidth / (trayColumns * 2.4), height / (trayRows * 2.4)),
  );

  const removed = new Set(settings.replacement ? [] : drawn.map((event) => event.ball));
  const last = drawn[drawn.length - 1];
  const hits = drawn.filter((event) => event.success).length;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {stageTitle('Muestra', 'Listo para la primera muestra', experiment, shown, completed)}
      </text>
      <text x={trayLeft} y={box.y + 18} className={styles.caption}>
        {`${settings.replacement ? 'con' : 'sin'} reemplazo: ${hits} marcadas de ${drawn.length}`}
      </text>
      <rect
        x={urnLeft - 4}
        y={top - 4}
        width={urnWidth + 8}
        height={height + 8}
        rx={12}
        fill="none"
        stroke="var(--data-axis)"
      />
      {Array.from({ length: population }, (_, ball) => {
        const cx = urnLeft + radius * 1.2 + (ball % columns) * radius * 2.4;
        const cy = top + radius * 1.2 + Math.floor(ball / columns) * radius * 2.4;
        const success = ball < marked;
        const gone = removed.has(ball);
        const flash = settings.replacement && last?.ball === ball && !done;
        return (
          <g key={ball}>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill={gone ? 'none' : success ? DATA_COLORS.secondary : 'var(--color-surface)'}
              stroke={
                gone ? 'var(--data-grid)' : success ? DATA_COLORS.secondary : DATA_COLORS.muted
              }
              strokeDasharray={gone ? '2 2' : undefined}
            />
            {flash && (
              <circle
                key={`${number}-${drawn.length}`}
                className={popClass}
                cx={cx}
                cy={cy}
                r={radius + 3}
                fill="none"
                stroke="var(--color-text)"
                strokeWidth={2}
              />
            )}
          </g>
        );
      })}
      {drawn.map((event, index) => {
        const cx = trayLeft + trayRadius * 1.2 + (index % trayColumns) * trayRadius * 2.4;
        const cy = top + 12 + trayRadius * 1.2 + Math.floor(index / trayColumns) * trayRadius * 2.4;
        return (
          <circle
            key={`${number}-${index}`}
            className={index === drawn.length - 1 && !done ? popClass : undefined}
            cx={cx}
            cy={cy}
            r={trayRadius}
            fill={event.success ? DATA_COLORS.secondary : 'var(--color-surface)'}
            stroke={event.success ? DATA_COLORS.secondary : DATA_COLORS.muted}
          />
        );
      })}
    </g>
  );
}
