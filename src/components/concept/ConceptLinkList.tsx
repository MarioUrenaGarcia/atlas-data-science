import { Link } from 'react-router-dom';
import type { ConceptNode } from '../../content/types.ts';
import { useProgress } from '../../store/progress.ts';
import { StatusIcon } from '../ui/StatusIcon.tsx';
import styles from './ConceptLinkList.module.css';

interface ConceptLinkListProps {
  concepts: { concept: ConceptNode; note?: string }[];
}

export function ConceptLinkList({ concepts }: ConceptLinkListProps) {
  const statuses = useProgress((state) => state.conceptos);
  return (
    <ul className={styles.list}>
      {concepts.map(({ concept, note }) => (
        <li key={concept.id} className={styles.item}>
          <StatusIcon status={statuses[concept.id]} />
          <span className={styles.text}>
            {note && <span className={styles.note}>{note}</span>}
            <Link to={`/concepto/${concept.id}`}>{concept.titulo}</Link>
          </span>
        </li>
      ))}
    </ul>
  );
}
