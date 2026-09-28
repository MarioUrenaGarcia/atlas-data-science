import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useProgress, type ActiveRoute } from '../../store/progress.ts';
import { Button } from '../ui/Button.tsx';
import { ProgressBar } from '../ui/ProgressBar.tsx';
import styles from './ActiveRouteCard.module.css';
import { useActiveRouteSummary } from './useActiveRoute.ts';

export function ActiveRouteCard({ active }: { active: ActiveRoute }) {
  const summary = useActiveRouteSummary(active);
  const setActiveRoute = useProgress((state) => state.setActiveRoute);
  if (!summary) return null;
  return (
    <section className={styles.card} aria-labelledby="titulo-ruta-activa">
      <div className={styles.header}>
        <p className={styles.eyebrow} id="titulo-ruta-activa">
          {strings.home.activeRoute}
        </p>
        <Button
          variant="ghost"
          size="small"
          iconOnly
          aria-label={strings.roadmap.clearActive}
          title={strings.roadmap.clearActive}
          onClick={() => setActiveRoute(null)}
        >
          <X size={16} aria-hidden="true" />
        </Button>
      </div>
      <h2 className={styles.title}>
        <Link to={summary.link}>{summary.title}</Link>
      </h2>
      <ProgressBar value={summary.mastered} max={summary.concepts.length} label={summary.title} />
      <p className={styles.count}>
        {strings.progress.masteredCount(summary.mastered)} / {summary.concepts.length}
      </p>
      {summary.next ? (
        <div className={styles.next}>
          <span className={styles.nextLabel}>{strings.home.nextConcept}</span>
          <Link to={`/concepto/${summary.next.id}`} className={styles.nextLink}>
            {summary.next.titulo}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <p>{strings.home.routeCompleted}</p>
      )}
    </section>
  );
}
