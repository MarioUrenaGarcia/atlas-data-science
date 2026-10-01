import { Link } from 'react-router-dom';
import type { ConceptNode } from '../../content/types.ts';
import { LevelBadge } from '../ui/LevelBadge.tsx';
import { moduleColor } from '../ui/moduleColor.ts';
import styles from './ConceptCard.module.css';
import { SummaryText } from '../ui/SummaryText.tsx';

export function ConceptCard({ concept }: { concept: ConceptNode }) {
  return (
    <Link
      to={`/concepto/${concept.id}`}
      className={styles.card}
      style={{ borderTopColor: moduleColor(concept.modulo) }}
    >
      <span className={styles.title}>{concept.titulo}</span>
      <span className={styles.summary}><SummaryText text={concept.resumen} /></span>
      <span className={styles.meta}>
        <LevelBadge level={concept.nivel} />
      </span>
    </Link>
  );
}
