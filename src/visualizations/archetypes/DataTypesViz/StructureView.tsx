import { useState, type ReactNode } from 'react';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';
import { STRUCTURE_CASES, type StructureCaseId } from './structureCases.ts';

const FIELDS_PER_SECOND = 0.5;

function highlight(source: string, fragment: string | null, key: string): ReactNode {
  if (!fragment) return source;
  const at = source.indexOf(fragment);
  if (at < 0) return source;
  return (
    <>
      {source.slice(0, at)}
      <mark key={key} className={`${styles.token} ${styles.tokenActive}`}>
        {fragment}
      </mark>
      {source.slice(at + fragment.length)}
    </>
  );
}

/**
 * One record in three forms. Each step fills a column of the table by
 * locating the value in the tagged record, where a key names it, and in the
 * free text, where it has to be read and interpreted.
 */
export function StructureView({ title, caseId }: { title: string; caseId: StructureCaseId }) {
  const item = STRUCTURE_CASES[caseId];
  const [filled, setFilled] = useState(0);
  const playback = usePlayback({
    step: () => setFilled((value) => Math.min(item.fields.length, value + 1)),
    reset: () => setFilled(0),
    rate: FIELDS_PER_SECOND,
    done: filled >= item.fields.length,
  });
  const current = filled > 0 ? item.fields[filled - 1] : undefined;
  const description =
    `${item.name}. Se han llenado ${filled} de ${item.fields.length} columnas de la tabla. ` +
    (current
      ? `La columna ${current.column} vale ${current.value}; ` +
        (current.json
          ? `en el registro etiquetado aparece como ${current.json}; `
          : 'el registro etiquetado no la incluye; ') +
        (current.text
          ? `en el texto se expresa como "${current.text}".`
          : 'el texto no la menciona.')
      : '');

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Columnas llenadas', value: `${filled} de ${item.fields.length}` },
        {
          label: 'Campos con clave en el registro etiquetado',
          value: String(item.fields.filter((field) => field.json !== null).length),
        },
        {
          label: 'Campos que solo aparecen en el texto',
          value: String(item.fields.filter((field) => field.json === null).length),
        },
      ]}
      description={description}
    >
      <p className={styles.stage}>
        {current
          ? `Columna "${current.column}": ${current.json ? 'en el registro, una etiqueta señala dónde está el dato' : 'el registro no tiene esa clave'}; en el texto hay que interpretar "${current.text ?? ''}".`
          : `${item.name}: la misma información en tres formas.`}
      </p>
      <h4 className={styles.panelTitle}>Estructurado: tabla con columnas fijas</h4>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Tabla estructurada"
        tabIndex={0}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              {item.fields.map((field) => (
                <th key={field.column} scope="col">
                  {field.column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {item.fields.map((field, index) => (
                <td
                  key={field.column}
                  className={index === filled - 1 ? styles.cellHighlight : undefined}
                >
                  {index < filled ? field.value : ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Semiestructurado: registro con etiquetas</h4>
          <pre className={styles.code}>
            {item.jsonLines.map((line, index) => (
              <span key={index}>
                {highlight(line, current?.json ?? null, `j${index}`)}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>
        <div>
          <h4 className={styles.panelTitle}>No estructurado: {item.textKind.toLowerCase()}</h4>
          <p className={styles.code}>{highlight(item.text, current?.text ?? null, 'texto')}</p>
        </div>
      </div>
    </VizFrame>
  );
}
