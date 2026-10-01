import { useState } from 'react';
import { Button } from '../../../components/ui/Button.tsx';
import styles from './MultivariateExplorer.module.css';
import type { MultivariatePreset } from './schema.ts';

export function QuickSample({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button size="small" variant="secondary" onClick={onClick}>
      {`Simular ${count} muestras`}
    </Button>
  );
}

interface CasePanelProps {
  cases: readonly MultivariatePreset[];
  onLoad: (preset: MultivariatePreset) => void;
}

/** Buttons that load cases with real context; the loaded one shows its explanation. */
export function CasePanel({ cases, onLoad }: CasePanelProps) {
  const [active, setActive] = useState<number | null>(null);
  if (cases.length === 0) return null;
  const loaded = active === null ? undefined : cases[active];
  return (
    <div className={styles.cases}>
      <div className={styles.caseRow} role="group" aria-label="Casos con contexto">
        <span className={styles.caseLabel}>Casos:</span>
        {cases.map((item, index) => (
          <Button
            key={item.nombre}
            size="small"
            variant="secondary"
            pressed={active === index}
            onClick={() => {
              onLoad(item);
              setActive(index);
            }}
          >
            {item.nombre}
          </Button>
        ))}
      </div>
      {loaded && (
        <p className={styles.note} aria-live="polite">
          {loaded.descripcion}
        </p>
      )}
    </div>
  );
}
