import { Check, Link2, Pin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { computeRoadmap } from '../../components/roadmap/computeRoadmap.ts';
import { RoadmapView } from '../../components/roadmap/RoadmapView.tsx';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { Switch } from '../../components/ui/Switch.tsx';
import { useAtlas } from '../../content/loader.ts';
import { ancestors } from '../../lib/graph/index.ts';
import { useProgress } from '../../store/progress.ts';
import NotFoundPage from '../NotFoundPage/NotFoundPage.tsx';
import styles from './RoadmapPage.module.css';

export default function RoadmapPage() {
  const { id } = useParams();
  const atlas = useAtlas();
  const [params, setParams] = useSearchParams();
  const statuses = useProgress((state) => state.conceptos);
  const activeRoute = useProgress((state) => state.rutaActiva);
  const setActiveRoute = useProgress((state) => state.setActiveRoute);
  const [copied, setCopied] = useState(false);
  const target = id ? atlas.byId.get(id) : undefined;
  useDocumentTitle(target ? strings.roadmap.title(target.titulo) : null);

  const from = params.get('desde') ?? undefined;
  const hideMastered = params.get('ocultar') === '1';

  const fromOptions = useMemo(
    () =>
      target
        ? [...ancestors(atlas.graph, target.id)]
            .sort(atlas.compare)
            .map((ancestor) => atlas.byId.get(ancestor))
        : [],
    [atlas, target],
  );

  const full = useMemo(
    () => (target ? computeRoadmap(atlas, target.id, { from }) : []),
    [atlas, target, from],
  );
  const mastered = useMemo(
    () => Object.keys(statuses).filter((conceptId) => statuses[conceptId] === 'dominado'),
    [statuses],
  );
  const visible = useMemo(
    () =>
      target && hideMastered ? computeRoadmap(atlas, target.id, { from, known: mastered }) : full,
    [atlas, target, from, hideMastered, mastered, full],
  );

  if (!target) return <NotFoundPage message={strings.concept.notFound} />;

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const isActive =
    activeRoute?.tipo === 'roadmap' &&
    activeRoute.objetivo === target.id &&
    (activeRoute.desde ?? undefined) === from;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        label={strings.concept.breadcrumbLabel}
        color={moduleColor(target.modulo)}
        items={[
          { label: target.titulo, to: `/concepto/${target.id}` },
          { label: strings.roadmap.target },
        ]}
      />
      <PageHeader
        title={strings.roadmap.title(target.titulo)}
        intro={strings.roadmap.intro}
        actions={
          <>
            <Button
              variant={isActive ? 'secondary' : 'primary'}
              pressed={isActive}
              onClick={() =>
                setActiveRoute(
                  isActive
                    ? null
                    : { tipo: 'roadmap', objetivo: target.id, ...(from ? { desde: from } : {}) },
                )
              }
            >
              <Pin size={16} aria-hidden="true" />
              {isActive ? strings.roadmap.activeNow : strings.roadmap.setActive}
            </Button>
            <Button onClick={() => void share()}>
              {copied ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Link2 size={16} aria-hidden="true" />
              )}
              {copied ? strings.roadmap.copied : strings.roadmap.share}
            </Button>
          </>
        }
      />

      <div className={styles.controls}>
        <label className={styles.from}>
          <span>{strings.roadmap.from}</span>
          <select
            value={from ?? ''}
            onChange={(event) => update('desde', event.target.value || null)}
          >
            <option value="">{strings.roadmap.fromNone}</option>
            {fromOptions.map((node) =>
              node ? (
                <option key={node.id} value={node.id}>
                  {node.titulo}
                </option>
              ) : null,
            )}
          </select>
        </label>
        <Switch
          checked={hideMastered}
          onChange={(checked) => update('ocultar', checked ? '1' : null)}
          label={strings.roadmap.hideMastered}
        />
      </div>

      {visible.length === 1 && full.length > 1 && (
        <p className={styles.note}>{strings.roadmap.nothingLeft}</p>
      )}

      <RoadmapView atlas={atlas} concepts={visible} allConcepts={full} target={target.id} />

      <p className={styles.back}>
        <Link to={`/concepto/${target.id}`}>{target.titulo}</Link>
      </p>
    </>
  );
}
