import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { diceCount, dieRange } from './processes.ts';
import { experimentNumber, isDone, revealed, stageTitle, type StageProps } from './stage.ts';

const MAX_TILE = 44;
const MAX_DIE = 64;
const TILE_GAP = 6;
const DIE_GAP = 34;

/**
 * With one die, one tile per possible value lights up at each roll. With
 * several dice, each die shows its value and the sum is written at the end.
 */
export function DieStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const { low, high } = dieRange(settings);
  const faces = high - low + 1;
  const dice = diceCount(settings);
  const rolls = revealed(experiment, shown).flatMap((event) =>
    event.kind === 'roll' ? [event.value] : [],
  );
  const done = isDone(experiment, shown);
  const number = experimentNumber(experiment, shown, completed);
  const title = (
    <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
      {stageTitle('Tirada', 'Listo para la primera tirada', experiment, shown, completed)}
    </text>
  );

  if (dice > 1) {
    const size = Math.max(
      24,
      Math.min(MAX_DIE, (box.width - 140 - (dice - 1) * DIE_GAP) / dice, box.height - 60),
    );
    const rowWidth = dice * size + (dice - 1) * DIE_GAP;
    const left = box.x + (box.width - rowWidth - 90) / 2;
    const top = box.y + (box.height - size) / 2 + 8;
    return (
      <g aria-hidden="true">
        {title}
        {Array.from({ length: dice }, (_, index) => {
          const value = rolls[index];
          const x = left + index * (size + DIE_GAP);
          return (
            <g key={value === undefined ? `empty-${index}` : `${number}-${index}`}>
              {index > 0 && (
                <text
                  x={x - DIE_GAP / 2}
                  y={top + size / 2 + 6}
                  textAnchor="middle"
                  className={styles.strong}
                  style={{ fontSize: 20 }}
                >
                  +
                </text>
              )}
              <g
                className={
                  value !== undefined && index === rolls.length - 1 && !done ? popClass : undefined
                }
              >
                <rect
                  x={x}
                  y={top}
                  width={size}
                  height={size}
                  rx={8}
                  fill={value === undefined ? 'none' : DATA_COLORS.primary}
                  stroke={value === undefined ? 'var(--data-grid)' : DATA_COLORS.primary}
                  strokeDasharray={value === undefined ? '4 4' : undefined}
                  strokeWidth={1.5}
                />
                {value !== undefined && (
                  <text
                    x={x + size / 2}
                    y={top + size / 2 + size * 0.14}
                    textAnchor="middle"
                    className={styles.coinText}
                    style={{ fontSize: size * 0.4 }}
                    fill="var(--color-surface)"
                  >
                    {value}
                  </text>
                )}
              </g>
            </g>
          );
        })}
        <text
          x={left + rowWidth + 14}
          y={top + size / 2 + 7}
          className={styles.strong}
          style={{ fontSize: 20 }}
        >
          {done ? `= ${experiment?.value ?? ''}` : '='}
        </text>
      </g>
    );
  }

  const roll = rolls[0];
  const perRow = Math.min(faces, 11);
  const rows = Math.ceil(faces / perRow);
  const tile = Math.max(
    14,
    Math.min(MAX_TILE, (box.width - 24) / perRow - TILE_GAP, (box.height - 50) / rows - TILE_GAP),
  );
  const rowWidth = perRow * (tile + TILE_GAP) - TILE_GAP;
  const left = box.x + (box.width - rowWidth) / 2;
  const top = box.y + 36;

  return (
    <g aria-hidden="true">
      {title}
      {Array.from({ length: faces }, (_, index) => {
        const value = low + index;
        const active = roll === value;
        const x = left + (index % perRow) * (tile + TILE_GAP);
        const y = top + Math.floor(index / perRow) * (tile + TILE_GAP);
        return (
          <g key={active ? `${value}-${number}` : value} className={active ? popClass : undefined}>
            <rect
              x={x}
              y={y}
              width={tile}
              height={tile}
              rx={6}
              fill={active ? DATA_COLORS.primary : 'var(--color-surface)'}
              stroke={active ? DATA_COLORS.primary : DATA_COLORS.muted}
              strokeWidth={1.5}
            />
            <text
              x={x + tile / 2}
              y={y + tile / 2 + 5}
              textAnchor="middle"
              className={styles.coinText}
              style={{ fontSize: Math.max(10, tile * 0.38) }}
              fill={active ? 'var(--color-surface)' : 'var(--color-text)'}
            >
              {value}
            </text>
          </g>
        );
      })}
    </g>
  );
}
