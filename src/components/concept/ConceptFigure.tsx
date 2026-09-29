import { UrlSyncContext } from '../../visualizations/core/urlSync.ts';
import styles from './ConceptFigure.module.css';
import { VisualizationSlot } from './VisualizationSlot.tsx';

interface ConceptFigureProps {
  number: number;
  componente: string;
  parametros: Record<string, unknown>;
  captionHtml: string;
  conceptId: string;
  conceptTitle: string;
}

/** An interactive visualization placed inside the text of a concept, with its caption. */
export function ConceptFigure({
  number,
  componente,
  parametros,
  captionHtml,
  conceptId,
  conceptTitle,
}: ConceptFigureProps) {
  const label = `Figura ${number}`;
  return (
    <figure className={styles.figure} aria-label={label}>
      <UrlSyncContext.Provider value={false}>
        <VisualizationSlot
          component={componente}
          params={parametros}
          conceptId={`${conceptId}-figura-${number}`}
          title={`${conceptTitle}, ${label.toLowerCase()}`}
          compact
        />
      </UrlSyncContext.Provider>
      {captionHtml && (
        <figcaption className={styles.caption}>
          <strong>{label}.</strong> <span dangerouslySetInnerHTML={{ __html: captionHtml }} />
        </figcaption>
      )}
    </figure>
  );
}
