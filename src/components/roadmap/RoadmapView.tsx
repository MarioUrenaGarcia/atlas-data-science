import { List, Network } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { strings } from '../../app/strings.ts';
import type { AtlasData } from '../../content/loader.ts';
import { studyMinutes } from '../../lib/format/time.ts';
import { usePreferences } from '../../store/preferences.ts';
import { useProgress } from '../../store/progress.ts';
import { Loading } from '../ui/Loading.tsx';
import { SegmentedControl } from '../ui/SegmentedControl.tsx';
import { RoadmapList } from './RoadmapList.tsx';
import styles from './RoadmapView.module.css';

const RoadmapDiagram = lazy(() => import('./RoadmapDiagram.tsx'));

interface RoadmapViewProps {
  atlas: AtlasData;
  /** Concepts to display, already ordered for study. */
  concepts: string[];
  /** Full list before hiding mastered concepts; used for totals. */
  allConcepts?: string[];
  target?: string;
}

const VIEW_OPTIONS = [
  {
    value: 'diagrama',
    label: strings.roadmap.diagramView,
    icon: <Network size={16} aria-hidden="true" />,
  },
  { value: 'lista', label: strings.roadmap.listView, icon: <List size={16} aria-hidden="true" /> },
] as const;

export function RoadmapView({ atlas, concepts, allConcepts = concepts, target }: RoadmapViewProps) {
  const view = usePreferences((state) => state.roadmapView);
  const setView = usePreferences((state) => state.setRoadmapView);
  const statuses = useProgress((state) => state.conceptos);

  const mastered = allConcepts.filter((id) => statuses[id] === 'dominado').length;
  const pendingLevels = allConcepts
    .filter((id) => statuses[id] !== 'dominado')
    .map((id) => atlas.byId.get(id)?.nivel)
    .filter((level) => level !== undefined);

  return (
    <div>
      <div className={styles.bar}>
        <dl className={styles.stats}>
          <div>
            <dt>{strings.roadmap.total}</dt>
            <dd className="mono">{allConcepts.length}</dd>
          </div>
          <div>
            <dt>{strings.roadmap.mastered}</dt>
            <dd className="mono">{mastered}</dd>
          </div>
          <div>
            <dt>{strings.roadmap.estimate}</dt>
            <dd className="mono">{strings.time.minutes(studyMinutes(pendingLevels))}</dd>
          </div>
        </dl>
        <SegmentedControl
          label={strings.roadmap.viewLabel}
          value={view}
          options={VIEW_OPTIONS}
          onChange={setView}
        />
      </div>
      {concepts.length === 0 ? null : view === 'diagrama' ? (
        <Suspense fallback={<Loading />}>
          <RoadmapDiagram atlas={atlas} concepts={concepts} target={target} />
        </Suspense>
      ) : (
        <RoadmapList atlas={atlas} concepts={concepts} target={target} />
      )}
    </div>
  );
}
