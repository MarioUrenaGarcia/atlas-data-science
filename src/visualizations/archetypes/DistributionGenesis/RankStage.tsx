import { zipf } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import styles from './DistributionGenesis.module.css';
import { experimentNumber, revealed, type StageProps } from './stage.ts';

/** Ranks drawn as labelled bars; beyond this many only the bars are shown. */
const LABELLED_RANKS = 12;

/**
 * Items ordered by rank with bars proportional to k^(-s). Each draw lights
 * up the chosen item, which is almost always one of the first ranks.
 */
export function RankStage({ box, settings, experiment, shown, completed, animate }: StageProps) {
  const popClass = animate ? styles.pop : undefined;
  const count = Math.round(settings.values.N ?? 30);
  const distribution = zipf(count, settings.values.s ?? 1);
  const pick = revealed(experiment, shown).find((event) => event.kind === 'pick');
  const number = experimentNumber(experiment, shown, completed);
  const top = box.y + 32;
  const height = box.height - 58;
  const left = box.x + 16;
  const width = box.width - 32;
  const step = width / count;
  const peak = distribution.pmf(1);
  const picked = pick?.kind === 'pick' ? pick.rank : null;
  const label = (rank: number) => settings.rankLabels[rank - 1] ?? `${rank}`;

  return (
    <g aria-hidden="true">
      <text x={box.x + 8} y={box.y + 18} className={styles.strong}>
        {number > 0 ? `Extracción ${number}` : 'Listo para la primera extracción'}
      </text>
      {picked !== null && (
        <text x={box.x + box.width - 8} y={box.y + 18} textAnchor="end" className={styles.strong}>
          {`elegido: ${label(picked)} (rango ${picked})`}
        </text>
      )}
      {Array.from({ length: count }, (_, index) => {
        const rank = index + 1;
        const barHeight = (distribution.pmf(rank) / peak) * height;
        const active = rank === picked;
        const x = left + index * step;
        return (
          <g key={active ? `${rank}-${number}` : rank} className={active ? popClass : undefined}>
            <rect
              x={x + step * 0.1}
              y={top + height - barHeight}
              width={Math.max(1, step * 0.8)}
              height={Math.max(1, barHeight)}
              fill={active ? DATA_COLORS.secondary : DATA_COLORS.primary}
              fillOpacity={active ? 1 : 0.45}
            />
            {rank <= LABELLED_RANKS && step >= 22 && (
              <text
                x={x + step / 2}
                y={top + height + 14}
                textAnchor="middle"
                className={active ? styles.strong : styles.caption}
              >
                {label(rank)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
