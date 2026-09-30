import { seriesColor } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { categoryProbabilities } from './processes.ts';
import { experimentNumber, isDone, revealed, type StageProps } from './stage.ts';

const BOX_GAP = 14;
const MAX_BALL = 11;

/**
 * Balls fall one at a time into boxes chosen with the category
 * probabilities; the counts per box form the multinomial vector.
 */
export function BinsStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const probabilities = categoryProbabilities(settings);
  const k = probabilities.length;
  const n = Math.round(settings.values.n ?? 8);
  const events = revealed(experiment, shown);
  const balls = events.flatMap((event) => (event.kind === 'ball' ? [event.category] : []));
  const number = experimentNumber(experiment, shown, completed);
  const top = box.y + 44;
  const bottom = box.y + box.height - 22;
  const boxWidth = Math.max(24, Math.min(120, (box.width - 24 - (k - 1) * BOX_GAP) / k));
  const left = box.x + (box.width - (k * boxWidth + (k - 1) * BOX_GAP)) / 2;
  const perRow = Math.max(1, Math.floor(boxWidth / (2 * MAX_BALL + 2)));
  const rowsNeeded = Math.ceil(n / perRow);
  const radius = Math.max(
    2.5,
    Math.min(MAX_BALL, (bottom - top) / (rowsNeeded * 2.2), boxWidth / (perRow * 2.3)),
  );
  const counts = probabilities.map(() => 0);
  const done = isDone(experiment, shown);

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {number > 0
          ? `Experimento ${number}: ${balls.length} de ${n} bolas`
          : 'Listo para el primer experimento'}
      </text>
      {probabilities.map((p, index) => {
        const x = left + index * (boxWidth + BOX_GAP);
        const focus = index === settings.focus;
        return (
          <g key={index}>
            <path
              d={`M${x},${top} V${bottom} H${x + boxWidth} V${top}`}
              fill="none"
              stroke={focus ? 'var(--color-text)' : 'var(--data-axis)'}
              strokeWidth={focus ? 2 : 1}
            />
            <text
              x={x + boxWidth / 2}
              y={bottom + 15}
              textAnchor="middle"
              className={focus ? styles.strong : styles.caption}
            >
              {`${settings.categories[index]?.label ?? index + 1} (${p.toFixed(2)})`}
            </text>
          </g>
        );
      })}
      {balls.map((category, index) => {
        const slot = counts[category] ?? 0;
        counts[category] = slot + 1;
        const x = left + category * (boxWidth + BOX_GAP);
        const columns = Math.max(1, Math.floor(boxWidth / (radius * 2.3)));
        const cx = x + radius * 1.2 + (slot % columns) * radius * 2.3;
        const cy = bottom - radius * 1.1 - Math.floor(slot / columns) * radius * 2.2;
        const fresh = index === balls.length - 1 && !done;
        return (
          <circle
            key={`${number}-${index}`}
            className={fresh ? popClass : undefined}
            cx={cx}
            cy={cy}
            r={radius}
            fill={seriesColor(category)}
          />
        );
      })}
      {probabilities.map((_, index) => (
        <text
          key={`count-${index}`}
          x={left + index * (boxWidth + BOX_GAP) + boxWidth / 2}
          y={top - 4}
          textAnchor="middle"
          className={styles.strong}
        >
          {counts[index] ?? 0}
        </text>
      ))}
    </g>
  );
}
