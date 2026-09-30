import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { dieRange } from './processes.ts';
import { experimentNumber, revealed, type StageProps } from './stage.ts';

const MAX_TILE = 44;
const TILE_GAP = 6;

/** One tile per possible value; the value of each roll lights up its tile. */
export function DieStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const { low, high } = dieRange(settings);
  const faces = high - low + 1;
  const roll = revealed(experiment, shown).find((event) => event.kind === 'roll');
  const number = experimentNumber(experiment, shown, completed);
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
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {number > 0 ? `Tirada ${number}` : 'Listo para la primera tirada'}
      </text>
      {Array.from({ length: faces }, (_, index) => {
        const value = low + index;
        const active = roll?.kind === 'roll' && roll.value === value;
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
