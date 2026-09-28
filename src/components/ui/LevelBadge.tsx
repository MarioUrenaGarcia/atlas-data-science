import { strings } from '../../app/strings.ts';
import type { Level } from '../../content/types.ts';
import styles from './badges.module.css';

const LEVEL_DOTS: Record<Level, number> = { basico: 1, intermedio: 2, avanzado: 3 };

export function LevelBadge({ level }: { level: Level }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span className={`${styles.badge} ${styles[level]}`}>
      <span className={styles.dots} aria-hidden="true">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className={dot <= filled ? styles.dotFilled : styles.dot} />
        ))}
      </span>
      {strings.levels[level]}
    </span>
  );
}
