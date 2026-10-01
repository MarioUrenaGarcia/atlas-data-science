import { useState } from 'react';
import { SegmentedControl } from '../../../components/ui/SegmentedControl.tsx';
import type { VisualizationProps } from '../../types.ts';
import ContinuousGenesis from '../ContinuousGenesis/ContinuousGenesis.tsx';
import DistributionExplorer from '../DistributionExplorer/DistributionExplorer.tsx';
import DistributionGenesis from '../DistributionGenesis/DistributionGenesis.tsx';
import styles from './DistributionStudio.module.css';
import type { DistributionStudioConfig } from './schema.ts';

type Tab = 'distribucion' | 'genesis';

const TABS = [
  { value: 'distribucion' as const, label: 'Distribución' },
  { value: 'genesis' as const, label: 'Ver cómo surge' },
];

/**
 * A distribution seen two ways: a still view with the mass or density, the
 * cdf, probability regions, cases and a worked example, and a second tab with
 * the random construction that generates it, which starts only on request.
 */
export default function DistributionStudio({ params, conceptId, title }: VisualizationProps) {
  const config = params as unknown as DistributionStudioConfig;
  const [tab, setTab] = useState<Tab>(
    config.genesis ? (config.pestana ?? 'distribucion') : 'distribucion',
  );
  const genesis = config.genesis;
  return (
    <div className={styles.studio}>
      {genesis && (
        <div className={styles.tabs}>
          <SegmentedControl
            label="Vista de la distribución"
            value={tab}
            options={TABS}
            onChange={setTab}
          />
        </div>
      )}
      {tab === 'distribucion' || !genesis ? (
        <DistributionExplorer params={config.explorador} conceptId={conceptId} title={title} />
      ) : genesis.componente === 'DistributionGenesis' ? (
        <DistributionGenesis
          params={genesis.parametros}
          conceptId={conceptId}
          title={`${title}: cómo surge`}
        />
      ) : (
        <ContinuousGenesis
          params={genesis.parametros}
          conceptId={conceptId}
          title={`${title}: cómo surge`}
        />
      )}
    </div>
  );
}
