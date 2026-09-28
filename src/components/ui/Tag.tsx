import styles from './badges.module.css';

export function Tag({ children }: { children: string }) {
  return <span className={styles.tag}>{children}</span>;
}
