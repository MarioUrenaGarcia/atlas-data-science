import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { LevelBadge } from '../../components/ui/LevelBadge.tsx';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { useAtlas } from '../../content/loader.ts';
import type { ConceptNode } from '../../content/types.ts';
import { normalizeText } from '../../lib/format/text.ts';
import styles from './GlossaryPage.module.css';

function initial(title: string): string {
  const letter = normalizeText(title).charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
}

export default function GlossaryPage() {
  const atlas = useAtlas();
  const [filter, setFilter] = useState('');
  const deferred = useDeferredValue(filter);
  useDocumentTitle(strings.glossary.title);

  const sorted = useMemo(
    () =>
      [...atlas.nodes].sort((a, b) =>
        a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }),
      ),
    [atlas.nodes],
  );

  const groups = useMemo(() => {
    const needle = normalizeText(deferred.trim());
    const matches = needle
      ? sorted.filter((node) =>
          [node.titulo, node.titulo_en, ...node.alias].some((name) =>
            normalizeText(name).includes(needle),
          ),
        )
      : sorted;
    const byLetter = new Map<string, ConceptNode[]>();
    for (const node of matches) {
      const letter = initial(node.titulo);
      const list = byLetter.get(letter) ?? [];
      list.push(node);
      byLetter.set(letter, list);
    }
    return [...byLetter.entries()];
  }, [sorted, deferred]);

  const total = groups.reduce((count, [, nodes]) => count + nodes.length, 0);

  return (
    <>
      <PageHeader title={strings.glossary.title} intro={strings.glossary.intro} />
      <div className={styles.tools}>
        <label className={styles.filter}>
          <span className="visually-hidden">{strings.glossary.filter}</span>
          <input
            type="search"
            placeholder={strings.glossary.filter}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </label>
        <p className={styles.count} role="status">
          {strings.glossary.count(total)}
        </p>
      </div>
      <nav aria-label={strings.glossary.lettersLabel} className={styles.letters}>
        {groups.map(([letter]) => (
          <a key={letter} href={`#letra-${letter}`}>
            {letter}
          </a>
        ))}
      </nav>
      {groups.map(([letter, nodes]) => (
        <section
          key={letter}
          id={`letra-${letter}`}
          className={styles.group}
          aria-labelledby={`titulo-letra-${letter}`}
        >
          <h2 id={`titulo-letra-${letter}`} className={styles.letter}>
            {letter}
          </h2>
          <dl className={styles.list}>
            {nodes.map((node) => (
              <div key={node.id} className={styles.entry}>
                <dt className={styles.term}>
                  <Link to={`/concepto/${node.id}`}>{node.titulo}</Link>
                  <span className={styles.english} lang="en">
                    {node.titulo_en}
                  </span>
                  <LevelBadge level={node.nivel} />
                </dt>
                <dd className={styles.definition}>{node.resumen}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
