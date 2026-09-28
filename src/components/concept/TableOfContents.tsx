import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  label: string;
  items: { id: string; titulo: string }[];
}

/** Section index that highlights the section currently in view. */
export function TableOfContents({ label, items }: TableOfContentsProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={styles.toc}>
      <p className={styles.label}>{label}</p>
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={item.id === active ? `${styles.link} ${styles.active}` : styles.link}
              aria-current={item.id === active ? 'location' : undefined}
            >
              {item.titulo}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
