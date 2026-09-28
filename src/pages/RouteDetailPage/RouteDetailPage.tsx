import { Pin } from 'lucide-react';
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { RoadmapView } from '../../components/roadmap/RoadmapView.tsx';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { Switch } from '../../components/ui/Switch.tsx';
import { useAtlas, useRoutesData } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import NotFoundPage from '../NotFoundPage/NotFoundPage.tsx';
import styles from './RouteDetailPage.module.css';

export default function RouteDetailPage() {
  const { id } = useParams();
  const atlas = useAtlas();
  const { routes } = useRoutesData();
  const [params, setParams] = useSearchParams();
  const statuses = useProgress((state) => state.conceptos);
  const activeRoute = useProgress((state) => state.rutaActiva);
  const setActiveRoute = useProgress((state) => state.setActiveRoute);
  const route = routes.find((candidate) => candidate.id === id);
  useDocumentTitle(route?.titulo ?? null);
  const hideMastered = params.get('ocultar') === '1';

  const concepts = useMemo(
    () => route?.conceptos.filter((conceptId) => atlas.byId.has(conceptId)) ?? [],
    [route, atlas],
  );
  const visible = useMemo(
    () =>
      hideMastered ? concepts.filter((conceptId) => statuses[conceptId] !== 'dominado') : concepts,
    [concepts, hideMastered, statuses],
  );

  if (!route) return <NotFoundPage message={strings.routes.notFound} />;

  const mastered = concepts.filter((conceptId) => statuses[conceptId] === 'dominado').length;
  const percent = concepts.length === 0 ? 0 : Math.round((100 * mastered) / concepts.length);
  const isActive = activeRoute?.tipo === 'ruta' && activeRoute.id === route.id;

  return (
    <>
      <Breadcrumbs
        label={strings.concept.breadcrumbLabel}
        items={[{ label: strings.routes.title, to: '/rutas' }, { label: route.titulo }]}
      />
      <PageHeader
        eyebrow={<span className={styles.profile}>{route.perfil}</span>}
        title={route.titulo}
        intro={route.descripcion}
        actions={
          <Button
            variant={isActive ? 'secondary' : 'primary'}
            pressed={isActive}
            onClick={() => setActiveRoute(isActive ? null : { tipo: 'ruta', id: route.id })}
          >
            <Pin size={16} aria-hidden="true" />
            {isActive ? strings.roadmap.activeNow : strings.roadmap.setActive}
          </Button>
        }
      />
      <div className={styles.progress}>
        <p className={styles.percent}>{strings.routes.progress(percent)}</p>
        <ProgressBar value={mastered} max={concepts.length} label={route.titulo} />
      </div>
      <div className={styles.controls}>
        <Switch
          checked={hideMastered}
          onChange={(checked) => {
            const next = new URLSearchParams(params);
            if (checked) next.set('ocultar', '1');
            else next.delete('ocultar');
            setParams(next, { replace: true });
          }}
          label={strings.roadmap.hideMastered}
        />
      </div>
      <RoadmapView atlas={atlas} concepts={visible} allConcepts={concepts} />
    </>
  );
}
