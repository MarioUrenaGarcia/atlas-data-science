import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({
  items,
  label,
  color,
}: {
  items: Crumb[];
  label: string;
  color?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={styles.nav}
      style={color ? { borderColor: color } : undefined}
    >
      <ol className={styles.list}>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <li aria-hidden="true" className={styles.separator}>
                <ChevronRight size={14} />
              </li>
            )}
            <li className={styles.item}>
              {item.to ? (
                <Link to={item.to} style={color ? { color } : undefined}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
