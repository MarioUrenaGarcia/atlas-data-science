import { strings } from '../../app/strings.ts';
import styles from './VizFrame.module.css';

export interface LegendItem {
  label: string;
  color: string;
  shape?: 'square' | 'line' | 'dashed' | 'circle';
}

export function LegendList({ items }: { items: readonly LegendItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className={styles.legend} aria-label={strings.viz.legend}>
      {items.map((item) => (
        <li key={item.label} className={styles.legendItem}>
          <span
            aria-hidden="true"
            className={`${styles.legendMark} ${styles[`legend-${item.shape ?? 'square'}`] ?? ''}`}
            style={{ ['--legend-color' as string]: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
