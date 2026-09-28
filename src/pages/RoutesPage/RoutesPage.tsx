import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { useRoutesData } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import styles from './RoutesPage.module.css';

export default function RoutesPage() {
  const { routes } = useRoutesData();
  const statuses = useProgress((state) => state.conceptos);
  useDocumentTitle(strings.routes.title);
  return (
    <>
      <PageHeader title={strings.routes.title} intro={strings.routes.intro} />
      <ol className={styles.grid}>
        {routes.map((route) => {
          const mastered = route.conceptos.filter((id) => statuses[id] === 'dominado').length;
          const percent =
            route.conceptos.length === 0
              ? 0
              : Math.round((100 * mastered) / route.conceptos.length);
          return (
            <li key={route.id} className={styles.card}>
              <p className={styles.profile}>{route.perfil}</p>
              <h2 className={styles.title}>
                <Link to={`/rutas/${route.id}`} className={styles.link}>
                  {route.titulo}
                </Link>
              </h2>
              <p className={styles.description}>{route.descripcion}</p>
              <p className={styles.meta}>
                {strings.routes.conceptCount(route.conceptos.length)} ·{' '}
                {strings.routes.progress(percent)}
              </p>
              <ProgressBar value={mastered} max={route.conceptos.length} label={route.titulo} />
            </li>
          );
        })}
      </ol>
    </>
  );
}
