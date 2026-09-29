import { seriesColor } from '../../core/colors.ts';
import styles from './SetPartitionsViz.module.css';

interface PartitionChipProps {
  blocks: readonly (readonly number[])[];
  current: boolean;
}

/** Compact text form of a set partition, with each block tinted by its color. */
export function PartitionChip({ blocks, current }: PartitionChipProps) {
  return (
    <li className={current ? `${styles.item} ${styles.itemCurrent}` : styles.item}>
      {blocks.map((block, index) => (
        <span
          key={index}
          className={styles.block}
          style={{ boxShadow: `inset 0 -3px 0 ${seriesColor(index)}` }}
        >
          {block.map((element) => element + 1).join(',')}
        </span>
      ))}
    </li>
  );
}
