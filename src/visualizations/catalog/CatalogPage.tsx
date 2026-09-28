import { useSearchParams } from 'react-router-dom';
import { VisualizationSlot } from '../../components/concept/VisualizationSlot.tsx';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { visualizationNames } from '../registry.ts';
import styles from './CatalogPage.module.css';
import { CATALOG_EXAMPLES } from './examples.ts';

/** Development-only page to review each visualization in isolation. */
export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const index = Math.min(CATALOG_EXAMPLES.length - 1, Math.max(0, Number(params.get('i') ?? 0)));
  const example = CATALOG_EXAMPLES[index];
  const registered = new Set(visualizationNames());
  return (
    <>
      <PageHeader
        title="Catálogo de visualizaciones"
        intro={`${registered.size} componentes registrados.`}
      />
      <div className={styles.layout}>
        <nav aria-label="Ejemplos" className={styles.list}>
          <ol>
            {CATALOG_EXAMPLES.map((entry, position) => (
              <li key={`${entry.component}-${entry.title}`}>
                <button
                  type="button"
                  className={position === index ? styles.active : undefined}
                  onClick={() => setParams({ i: String(position) })}
                >
                  {entry.component}: {entry.title}
                  {!registered.has(entry.component) && ' (sin registrar)'}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.stage}>
          {example && (
            <VisualizationSlot
              key={index}
              component={example.component}
              params={example.params}
              conceptId={`catalogo-${index}`}
              title={`${example.component}: ${example.title}`}
            />
          )}
        </div>
      </div>
    </>
  );
}
