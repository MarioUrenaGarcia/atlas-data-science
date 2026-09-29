import styles from './LogicViz.module.css';

/** A truth value shown as V or F with its color. */
export function TruthValue({ value }: { value: boolean }) {
  return <span className={value ? styles.true : styles.false}>{value ? 'V' : 'F'}</span>;
}
