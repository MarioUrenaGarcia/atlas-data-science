import { strings } from '../../app/strings.ts';
import styles from './VizFrame.module.css';

export interface Readout {
  label: string;
  value: string;
  /** Optional color swatch linking the value to a mark in the chart. */
  color?: string;
}

export function Readouts({ items }: { items: readonly Readout[] }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.section} aria-label={strings.viz.readouts}>
      <h3 className={styles.sectionTitle}>{strings.viz.readouts}</h3>
      <dl className={styles.readouts}>
        {items.map((item) => (
          <div key={item.label} className={styles.readout}>
            <dt>
              {item.color && (
                <span
                  className={styles.swatch}
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
              )}
              {item.label}
            </dt>
            <dd className="mono">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
