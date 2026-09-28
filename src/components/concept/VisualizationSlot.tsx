import { Suspense } from 'react';
import { VISUALIZATIONS } from '../../visualizations/registry.ts';
import { ErrorBoundary } from '../ui/ErrorBoundary.tsx';
import { Loading } from '../ui/Loading.tsx';
import styles from './VisualizationSlot.module.css';

interface VisualizationSlotProps {
  component: string;
  params: Record<string, unknown>;
  conceptId: string;
  title: string;
}

export function VisualizationSlot({ component, params, conceptId, title }: VisualizationSlotProps) {
  const Visualization = VISUALIZATIONS[component];
  if (!Visualization) return null;
  return (
    <div className={styles.slot}>
      <ErrorBoundary resetKey={conceptId}>
        <Suspense fallback={<Loading />}>
          <Visualization params={params} conceptId={conceptId} title={title} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
