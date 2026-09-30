import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { experimentNumber, fitRadius, isDone, revealed, type StageProps } from './stage.ts';

const PER_ROW = 20;
const PATH_HEIGHT_SHARE = 0.45;

/**
 * Random signs as tokens marked +1 or -1. With several signs a small path
 * shows the running sum, which is a simple random walk.
 */
export function SignsStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const n = Math.round(settings.values.n ?? 1);
  const signs = revealed(experiment, shown).flatMap((event) =>
    event.kind === 'sign' ? [event.value] : [],
  );
  const number = experimentNumber(experiment, shown, completed);
  const top = box.y + 18;
  const walk = n > 1;
  const tokensHeight = (box.height - 30) * (walk ? 1 - PATH_HEIGHT_SHARE : 1);
  const perRow = Math.min(PER_ROW, n);
  const rows = Math.ceil(n / perRow);
  const radius = fitRadius(box.width - 24, tokensHeight, perRow, rows, n === 1 ? 32 : 15);
  const spacing = radius * 2.5;
  const left = box.x + (box.width - (perRow - 1) * spacing) / 2;
  const tokensTop = top + 12;

  const pathTop = tokensTop + rows * spacing + 10;
  const pathHeight = box.y + box.height - pathTop - 8;
  const pathLeft = box.x + 48;
  const pathWidth = box.width - 72;
  const px = (step: number) => pathLeft + (step / n) * pathWidth;
  const py = (sum: number) => pathTop + pathHeight / 2 - (sum / n) * (pathHeight / 2);
  const partial: number[] = [0];
  signs.forEach((sign) => partial.push((partial[partial.length - 1] ?? 0) + sign));

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={top} className={styles.strong}>
        {number > 0 ? `Experimento ${number}` : 'Listo para el primer experimento'}
      </text>
      {walk && (
        <text x={box.x + box.width - 8} y={top} textAnchor="end" className={styles.caption}>
          {`suma parcial: ${partial[partial.length - 1] ?? 0}`}
        </text>
      )}
      {Array.from({ length: n }, (_, index) => {
        const cx = left + (index % perRow) * spacing;
        const cy = tokensTop + radius + Math.floor(index / perRow) * spacing;
        const sign = signs[index];
        if (sign === undefined)
          return (
            <circle
              key={`empty-${index}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="var(--data-grid)"
              strokeDasharray="3 3"
            />
          );
        const fresh = index === signs.length - 1 && !isDone(experiment, shown);
        const color = sign > 0 ? DATA_COLORS.primary : DATA_COLORS.secondary;
        return (
          <g key={`${number}-${index}`} className={fresh ? popClass : undefined}>
            <circle cx={cx} cy={cy} r={radius} fill={color} />
            {radius >= 9 && (
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                className={styles.coinText}
                fill="var(--color-surface)"
                style={n === 1 ? { fontSize: 20 } : undefined}
              >
                {sign > 0 ? '+1' : '-1'}
              </text>
            )}
          </g>
        );
      })}
      {walk && pathHeight > 20 && (
        <g>
          <line
            x1={pathLeft}
            x2={pathLeft + pathWidth}
            y1={py(0)}
            y2={py(0)}
            stroke="var(--data-grid)"
          />
          <text x={pathLeft - 6} y={py(0) + 4} textAnchor="end" className={styles.caption}>
            0
          </text>
          <text x={pathLeft - 6} y={pathTop + 8} textAnchor="end" className={styles.caption}>
            {`+${n}`}
          </text>
          <text
            x={pathLeft - 6}
            y={pathTop + pathHeight}
            textAnchor="end"
            className={styles.caption}
          >
            {`-${n}`}
          </text>
          <polyline
            points={partial.map((sum, step) => `${px(step)},${py(sum)}`).join(' ')}
            fill="none"
            stroke={DATA_COLORS.tertiary}
            strokeWidth={2}
          />
          <circle
            cx={px(partial.length - 1)}
            cy={py(partial[partial.length - 1] ?? 0)}
            r={4}
            fill={DATA_COLORS.tertiary}
          />
        </g>
      )}
    </g>
  );
}
