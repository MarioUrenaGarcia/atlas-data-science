import { Waypoints } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { ConceptListItem } from '../../components/concept/ConceptListItem.tsx';
import { runSearch, suggestConcepts } from '../../components/search/searchEngine.ts';
import { SearchForm } from '../../components/search/SearchForm.tsx';
import { useSearchEngine } from '../../components/search/useSearchEngine.ts';
import { Loading } from '../../components/ui/Loading.tsx';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { useAtlas } from '../../content/loader.ts';
import { LEVEL_ORDER } from '../../content/levels.ts';
import type { Level } from '../../content/types.ts';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const atlas = useAtlas();
  const { engine, failed } = useSearchEngine();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const moduleFilter = params.get('modulo');
  const levelFilter = params.get('nivel') as Level | null;
  useDocumentTitle(
    query ? `${strings.search.resultsTitle}: ${query}` : strings.search.resultsTitle,
  );

  const hits = useMemo(
    () => (engine && query.trim() ? runSearch(engine, atlas, query) : []),
    [engine, atlas, query],
  );
  const filtered = hits.filter(
    (hit) =>
      (moduleFilter === null || String(hit.node.modulo) === moduleFilter) &&
      (levelFilter === null || hit.node.nivel === levelFilter),
  );
  const suggestions = useMemo(
    () => (engine && query.trim() && hits.length === 0 ? suggestConcepts(atlas, query) : []),
    [engine, atlas, query, hits.length],
  );

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader title={strings.search.resultsTitle} />
      <SearchForm
        key={query}
        initialQuery={query}
        autoFocus={!query}
        onSubmit={(value) => update('q', value || null)}
      />

      <div className={styles.filters}>
        <label className={styles.filter}>
          <span>{strings.search.filterModule}</span>
          <select
            value={moduleFilter ?? ''}
            onChange={(event) => update('modulo', event.target.value || null)}
          >
            <option value="">{strings.search.allModules}</option>
            {atlas.modules.map((module) => (
              <option key={module.numero} value={module.numero}>
                {module.numero}. {module.titulo}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.filter}>
          <span>{strings.search.filterLevel}</span>
          <select
            value={levelFilter ?? ''}
            onChange={(event) => update('nivel', event.target.value || null)}
          >
            <option value="">{strings.search.allLevels}</option>
            {LEVEL_ORDER.map((level) => (
              <option key={level} value={level}>
                {strings.levels[level]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {failed && <p role="alert">{strings.loadError}</p>}
      {!query.trim() && <p className={styles.empty}>{strings.search.emptyQuery}</p>}
      {query.trim() && !engine && !failed && <Loading />}
      {query.trim() && engine && (
        <section aria-labelledby="conteo-resultados">
          <p id="conteo-resultados" className={styles.count} role="status">
            {strings.search.resultCount(filtered.length)}
          </p>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>{strings.search.noResults(query)}</p>
              {suggestions.length > 0 && (
                <>
                  <p className={styles.suggestionsTitle}>{strings.search.suggestions}</p>
                  <ul>
                    {suggestions.map((node) => (
                      <li key={node.id}>
                        <Link to={`/concepto/${node.id}`}>{node.titulo}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          <ol className={styles.results}>
            {filtered.map((hit) => (
              <li key={hit.node.id} className={styles.result}>
                <ConceptListItem concept={hit.node} />
                <Link
                  to={`/roadmap/${hit.node.id}`}
                  className={styles.roadmap}
                  aria-label={`${strings.search.goToRoadmap}: ${hit.node.titulo}`}
                >
                  <Waypoints size={16} aria-hidden="true" />
                  <span>{strings.search.goToRoadmap}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
