import { Button } from '../../../components/ui/Button.tsx';
import styles from './DistributionExplorer.module.css';
import type { DistributionExplorerConfig, ExplorerPreset } from './schema.ts';

interface PresetPanelProps {
  cases: readonly ExplorerPreset[];
  example: DistributionExplorerConfig['ejemplo'];
  /** Index of the loaded case, or "ejemplo" when the worked example is loaded. */
  active: number | 'ejemplo' | null;
  onLoadCase: (index: number) => void;
  onLoadExample: () => void;
  /** Live answer of the worked example, shown once it is loaded. */
  answer: string | null;
}

/**
 * Buttons that load cases with real context into the chart, and the worked
 * example with its question and a button that loads it.
 */
export function PresetPanel({
  cases,
  example,
  active,
  onLoadCase,
  onLoadExample,
  answer,
}: PresetPanelProps) {
  const loaded = typeof active === 'number' ? cases[active] : undefined;
  return (
    <div className={styles.presets}>
      {cases.length > 0 && (
        <div className={styles.caseRow} role="group" aria-label="Casos con contexto">
          <span className={styles.caseLabel}>Casos:</span>
          {cases.map((item, index) => (
            <Button
              key={item.nombre}
              size="small"
              variant="secondary"
              pressed={active === index}
              onClick={() => onLoadCase(index)}
            >
              {item.nombre}
            </Button>
          ))}
        </div>
      )}
      {loaded && (
        <p className={styles.note} aria-live="polite">
          {loaded.descripcion}
        </p>
      )}
      {example && (
        <div className={styles.example}>
          <p className={styles.exampleTitle}>{`Ejemplo: ${example.titulo}`}</p>
          <p className={styles.exampleText}>{example.contexto}</p>
          <p className={styles.exampleText}>{example.pregunta}</p>
          <div className={styles.caseRow}>
            <Button
              size="small"
              variant="secondary"
              pressed={active === 'ejemplo'}
              onClick={onLoadExample}
            >
              Cargar el ejemplo en la visualización
            </Button>
            {active === 'ejemplo' && answer && (
              <p className={styles.answer} aria-live="polite">
                {answer}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
