import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import type { ConceptNode } from '../../content/types.ts';
import styles from './ConceptSideNav.module.css';

interface ConceptSideNavProps {
  previous: ConceptNode | undefined;
  next: ConceptNode | undefined;
}

/**
 * Arrows fixed to the sides of the viewport that move through the Atlas in
 * study order, so the reader can change concept from any point of a long page
 * instead of scrolling down to the pager.
 */
export function ConceptSideNav({ previous, next }: ConceptSideNavProps) {
  if (!previous && !next) return null;
  return (
    <nav className={styles.nav} aria-label={strings.concept.sideNav}>
      {previous && (
        <Link
          to={`/concepto/${previous.id}`}
          className={`${styles.arrow} ${styles.previous}`}
          aria-label={strings.concept.previousConcept(previous.titulo)}
        >
          <ChevronLeft size={24} aria-hidden="true" />
          <span className={styles.label} aria-hidden="true">
            <span className={styles.kicker}>{strings.concept.previous}</span>
            <span className={styles.title}>{previous.titulo}</span>
          </span>
        </Link>
      )}
      {next && (
        <Link
          to={`/concepto/${next.id}`}
          className={`${styles.arrow} ${styles.next}`}
          aria-label={strings.concept.nextConcept(next.titulo)}
        >
          <span className={styles.label} aria-hidden="true">
            <span className={styles.kicker}>{strings.concept.next}</span>
            <span className={styles.title}>{next.titulo}</span>
          </span>
          <ChevronRight size={24} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
