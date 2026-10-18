import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import type { ConceptNode } from '../../content/types.ts';
import styles from './ConceptSideNav.module.css';
import { useScrolledPastViewport } from './useScrolledPastViewport.ts';

interface ConceptSideNavProps {
  previous: ConceptNode | undefined;
  next: ConceptNode | undefined;
}

/**
 * Arrows fixed to the sides of the viewport that move through the Atlas in
 * study order, so the reader can change concept from any point of a long page
 * instead of scrolling down to the pager. On narrow screens they form a bar
 * that sticks to the bottom only once the reader has scrolled past the first
 * viewport: on arrival it stays at the end of the article, so it never covers
 * the main visualization or its controls.
 */
export function ConceptSideNav({ previous, next }: ConceptSideNavProps) {
  const floating = useScrolledPastViewport();
  if (!previous && !next) return null;
  return (
    <nav
      className={floating ? `${styles.nav} ${styles.floating}` : styles.nav}
      aria-label={strings.concept.sideNav}
    >
      {previous && (
        <Link
          to={`/concepto/${previous.id}`}
          className={`${styles.arrow} ${styles.previous}`}
          aria-label={strings.concept.previousConcept(previous.titulo)}
        >
          <ChevronLeft size={24} aria-hidden="true" />
          <span className={styles.label} aria-hidden="true">
            <span className={styles.kicker}>{strings.concept.previousInAtlas}</span>
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
            <span className={styles.kicker}>{strings.concept.nextInAtlas}</span>
            <span className={styles.title}>{next.titulo}</span>
          </span>
          <ChevronRight size={24} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
