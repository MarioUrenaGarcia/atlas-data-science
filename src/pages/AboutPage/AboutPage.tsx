import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { BIBLIOGRAPHY } from '../../content/bibliography.ts';
import styles from './AboutPage.module.css';

const bibliography = Object.values(BIBLIOGRAPHY).sort((a, b) =>
  a.autores.localeCompare(b.autores, 'es'),
);

export default function AboutPage() {
  useDocumentTitle(strings.about.title);
  return (
    <div className={styles.page}>
      <PageHeader title={strings.about.title} />

      <section aria-labelledby="acerca-que">
        <h2 id="acerca-que">{strings.about.whatHeading}</h2>
        {strings.about.what.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section aria-labelledby="acerca-como">
        <h2 id="acerca-como">{strings.about.howHeading}</h2>
        <ul>
          {strings.about.how.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="acerca-atajos">
        <h2 id="acerca-atajos">{strings.about.shortcutsHeading}</h2>
        <dl className={styles.shortcuts}>
          {strings.about.shortcuts.map(([keys, action]) => (
            <div key={keys}>
              <dt>
                <kbd>{keys}</kbd>
              </dt>
              <dd>{action}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="acerca-bibliografia">
        <h2 id="acerca-bibliografia">{strings.about.bibliographyHeading}</h2>
        <ul className={styles.bibliography}>
          {bibliography.map((entry) => (
            <li key={`${entry.autores}-${entry.titulo}`}>
              {entry.autores}. <cite>{entry.titulo}</cite>.
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="acerca-privacidad">
        <h2 id="acerca-privacidad">{strings.about.privacyHeading}</h2>
        <p>{strings.about.privacy}</p>
      </section>

      <section aria-labelledby="acerca-licencias">
        <h2 id="acerca-licencias">{strings.about.licensesHeading}</h2>
        {strings.about.licenses.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}
