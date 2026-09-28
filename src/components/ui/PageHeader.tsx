import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  intro?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, intro, eyebrow, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  );
}
