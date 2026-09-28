import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { useAtlas } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import styles from './ModulesPage.module.css';

export default function ModulesPage() {
  const atlas = useAtlas();
  const statuses = useProgress((state) => state.conceptos);
  return (
    <>
      <PageHeader title={strings.modules.title} intro={strings.modules.intro} />
      <ol className={styles.grid}>
        {atlas.modules.map((module) => {
          const ids = module.submodulos.flatMap((submodule) => submodule.conceptos);
          const mastered = ids.filter((id) => statuses[id] === 'dominado').length;
          return (
            <li
              key={module.numero}
              className={styles.card}
              style={{ borderTopColor: moduleColor(module.numero) }}
            >
              <p className={styles.number}>{strings.modules.moduleLabel(module.numero)}</p>
              <h2 className={styles.title}>
                <Link to={`/modulo/${module.numero}`} className={styles.link}>
                  {module.titulo}
                </Link>
              </h2>
              <p className={styles.description}>{module.descripcion}</p>
              <p className={styles.meta}>
                {strings.modules.submoduleCount(module.submodulos.length)} ·{' '}
                {strings.modules.conceptCount(ids.length)}
              </p>
              {ids.length > 0 && (
                <>
                  <ProgressBar
                    value={mastered}
                    max={ids.length}
                    label={`${module.titulo}: ${strings.progress.masteredCount(mastered)}`}
                  />
                  <p className={styles.progress}>{strings.progress.masteredCount(mastered)}</p>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
