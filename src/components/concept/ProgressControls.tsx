import { CircleCheck, Eye } from 'lucide-react';
import { strings } from '../../app/strings.ts';
import { useProgress } from '../../store/progress.ts';
import { Button } from '../ui/Button.tsx';
import styles from './ProgressControls.module.css';

export function ProgressControls({ conceptId }: { conceptId: string }) {
  const status = useProgress((state) => state.conceptos[conceptId]);
  const toggle = useProgress((state) => state.toggleStatus);
  return (
    <div className={styles.controls} role="group" aria-label={strings.progress.groupLabel}>
      <Button
        size="small"
        pressed={status === 'visto' || status === 'dominado'}
        onClick={() => toggle(conceptId, 'visto')}
        disabled={status === 'dominado'}
      >
        <Eye size={16} aria-hidden="true" />
        {strings.progress.seen}
      </Button>
      <Button
        size="small"
        pressed={status === 'dominado'}
        onClick={() => toggle(conceptId, 'dominado')}
      >
        <CircleCheck size={16} aria-hidden="true" />
        {strings.progress.mastered}
      </Button>
    </div>
  );
}
