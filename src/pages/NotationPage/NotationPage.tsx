import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { useNotation } from '../../content/loader.ts';
import { slugify } from '../../lib/format/text.ts';
import styles from './NotationPage.module.css';

export default function NotationPage() {
  const notation = useNotation();
  useDocumentTitle(strings.notation.title);
  return (
    <>
      <PageHeader title={strings.notation.title} intro={strings.notation.intro} />
      {notation.grupos.map((group) => (
        <section
          key={group.titulo}
          className={styles.group}
          aria-labelledby={`notacion-${slugify(group.titulo)}`}
        >
          <h2 id={`notacion-${slugify(group.titulo)}`} className={styles.groupTitle}>
            {group.titulo}
          </h2>
          <div
            className={styles.tableWrapper}
            role="region"
            aria-labelledby={`notacion-${slugify(group.titulo)}`}
            // Focusable so keyboard users can scroll the table horizontally on small screens.
            tabIndex={0}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{strings.notation.object}</th>
                  <th scope="col">{strings.notation.symbol}</th>
                  <th scope="col">{strings.notation.note}</th>
                </tr>
              </thead>
              <tbody>
                {group.entradas.map((entry) => (
                  <tr key={entry.objeto}>
                    <th scope="row">{entry.objeto}</th>
                    <td dangerouslySetInnerHTML={{ __html: entry.notacionHtml }} />
                    <td className={styles.note}>{entry.nota ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <section aria-labelledby="convenciones" className={styles.group}>
        <h2 id="convenciones" className={styles.groupTitle}>
          {strings.notation.conventions}
        </h2>
        <ul className={styles.conventions}>
          {notation.convenciones.map((convention) => (
            <li key={convention}>{convention}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
