import { Link } from 'react-router-dom';
import type { ConceptNode } from '../../content/types.ts';
import { useProgress } from '../../store/progress.ts';
import { LevelBadge } from '../ui/LevelBadge.tsx';
import { StatusIcon } from '../ui/StatusIcon.tsx';
import styles from './ConceptListItem.module.css';

interface ConceptListItemProps {
  concept: ConceptNode;
  showSummary?: boolean;
  prefix?: string;
}

export function ConceptListItem({ concept, showSummary = true, prefix }: ConceptListItemProps) {
  const status = useProgress((state) => state.conceptos[concept.id]);
  return (
    <div className={styles.item}>
      <span className={styles.status}>
        <StatusIcon status={status} />
      </span>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <Link to={`/concepto/${concept.id}`} className={styles.title}>
            {concept.titulo}
          </Link>
          <LevelBadge level={concept.nivel} />
        </div>
        {showSummary && <p className={styles.summary}>{concept.resumen}</p>}
      </div>
    </div>
  );
}
