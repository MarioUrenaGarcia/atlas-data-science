import { Dices, Undo2 } from 'lucide-react';
import { useId, useState } from 'react';
import { strings } from '../../app/strings.ts';
import { Button } from '../../components/ui/Button.tsx';
import type { SeedState } from './useSeededRandom.ts';
import styles from './VizFrame.module.css';

export function SeedControl({ seed }: { seed: SeedState }) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft !== null && draft.trim() !== '') seed.setSeed(Number(draft));
    setDraft(null);
  };
  return (
    <div className={styles.seed}>
      <label htmlFor={id} className={styles.controlLabel}>
        {strings.viz.seed}
      </label>
      <div className={styles.seedRow}>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          className={styles.seedInput}
          value={draft ?? String(seed.seed)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
          }}
        />
        <Button
          size="small"
          iconOnly
          onClick={seed.newSeed}
          aria-label={strings.viz.newSeed}
          title={strings.viz.newSeed}
        >
          <Dices size={16} aria-hidden="true" />
        </Button>
        <Button
          size="small"
          iconOnly
          onClick={seed.resetSeed}
          disabled={seed.seed === seed.initialSeed}
          aria-label={strings.viz.resetSeed}
          title={strings.viz.resetSeed}
        >
          <Undo2 size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
