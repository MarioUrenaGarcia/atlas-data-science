import styles from './PseudocodePanel.module.css';

interface PseudocodePanelProps {
  lines: readonly string[];
  active: number;
}

/** Pseudocode with the line executed in the last step highlighted. */
export function PseudocodePanel({ lines, active }: PseudocodePanelProps) {
  return (
    <div className={styles.panel}>
      <ol className={styles.code} aria-label="Pseudocódigo">
        {lines.map((line, index) => (
          <li
            key={index}
            className={index === active ? styles.active : undefined}
            aria-current={index === active ? 'step' : undefined}
          >
            <code>{line}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
