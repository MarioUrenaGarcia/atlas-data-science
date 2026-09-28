import { strings } from '../../app/strings.ts';
import styles from './Loading.module.css';

export function Loading({ label = strings.loading }: { label?: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
