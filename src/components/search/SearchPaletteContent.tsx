import { CornerDownLeft, Search, Waypoints } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useAtlas } from '../../content/loader.ts';
import { LevelBadge } from '../ui/LevelBadge.tsx';
import { moduleColor } from '../ui/moduleColor.ts';
import { runSearch, suggestConcepts, type SearchHit } from './searchEngine.ts';
import styles from './SearchPalette.module.css';
import { useSearchEngine } from './useSearchEngine.ts';
import { SummaryText } from '../ui/SummaryText.tsx';

const MAX_RESULTS = 24;

interface Group {
  modulo: number;
  titulo: string;
  hits: SearchHit[];
}

interface SearchPaletteContentProps {
  initialQuery: string;
  onClose: () => void;
}

export function SearchPaletteContent({ initialQuery, onClose }: SearchPaletteContentProps) {
  const atlas = useAtlas();
  const { engine, failed } = useSearchEngine();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const hits = useMemo(
    () => (engine && query.trim() ? runSearch(engine, atlas, query).slice(0, MAX_RESULTS) : []),
    [engine, atlas, query],
  );

  // Groups keep the order in which each module first appears in the ranking.
  const groups = useMemo(() => {
    const byModule = new Map<number, Group>();
    for (const hit of hits) {
      const modulo = hit.node.modulo;
      let group = byModule.get(modulo);
      if (!group) {
        group = { modulo, titulo: atlas.moduleByNumber.get(modulo)?.titulo ?? '', hits: [] };
        byModule.set(modulo, group);
      }
      group.hits.push(hit);
    }
    return [...byModule.values()];
  }, [hits, atlas]);

  const ordered = useMemo(() => groups.flatMap((group) => group.hits), [groups]);
  const suggestions = useMemo(
    () => (engine && query.trim() && hits.length === 0 ? suggestConcepts(atlas, query) : []),
    [engine, atlas, query, hits.length],
  );

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, ordered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const hit = ordered[active];
      if (hit) go(event.altKey ? `/roadmap/${hit.node.id}` : `/concepto/${hit.node.id}`);
      else if (query.trim()) go(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  let position = -1;

  return (
    <div className={styles.content}>
      <div className={styles.inputRow}>
        <Search size={20} aria-hidden="true" className={styles.inputIcon} />
        <input
          type="search"
          className={styles.input}
          placeholder={strings.search.placeholder}
          aria-label={strings.search.placeholder}
          aria-describedby="ayuda-busqueda"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className={styles.escape}>Esc</kbd>
      </div>

      <p id="ayuda-busqueda" className="visually-hidden">
        {strings.search.navigationHint}
      </p>
      <p className="visually-hidden" role="status" aria-live="polite">
        {query.trim() && engine ? strings.search.resultCount(hits.length) : ''}
      </p>

      <div className={styles.results}>
        {failed && <p className={styles.message}>{strings.loadError}</p>}
        {!query.trim() && <p className={styles.message}>{strings.search.emptyQuery}</p>}
        {query.trim() && engine && hits.length === 0 && (
          <div className={styles.message}>
            <p>{strings.search.noResults(query.trim())}</p>
            {suggestions.length > 0 && (
              <>
                <p className={styles.suggestionsTitle}>{strings.search.suggestions}</p>
                <ul className={styles.suggestions}>
                  {suggestions.map((node) => (
                    <li key={node.id}>
                      <Link to={`/concepto/${node.id}`} onClick={onClose}>
                        {node.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        {groups.length > 0 && (
          <ul ref={listRef} className={styles.groups}>
            {groups.map((group) => (
              <li key={group.modulo}>
                <p className={styles.groupTitle} style={{ color: moduleColor(group.modulo) }}>
                  {group.titulo}
                </p>
                <ul className={styles.hits}>
                  {group.hits.map((hit) => {
                    position += 1;
                    const index = position;
                    const isActive = index === active;
                    return (
                      <li
                        key={hit.node.id}
                        className={isActive ? `${styles.hit} ${styles.activeHit}` : styles.hit}
                        data-active={isActive}
                        onMouseEnter={() => setActive(index)}
                      >
                        <Link
                          to={`/concepto/${hit.node.id}`}
                          className={styles.hitMain}
                          onClick={onClose}
                        >
                          <span className={styles.hitTitle}>
                            {hit.node.titulo}
                            <LevelBadge level={hit.node.nivel} />
                          </span>
                          <span className={styles.hitSummary}><SummaryText text={hit.node.resumen} /></span>
                        </Link>
                        <Link
                          to={`/roadmap/${hit.node.id}`}
                          className={styles.hitRoadmap}
                          onClick={onClose}
                          aria-label={`${strings.search.goToRoadmap}: ${hit.node.titulo}`}
                          title={strings.search.goToRoadmap}
                        >
                          <Waypoints size={16} aria-hidden="true" />
                        </Link>
                        {isActive && (
                          <CornerDownLeft
                            size={14}
                            aria-hidden="true"
                            className={styles.enterHint}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {query.trim() && (
        <div className={styles.footer}>
          <Link to={`/buscar?q=${encodeURIComponent(query.trim())}`} onClick={onClose}>
            {strings.search.allResults}
          </Link>
          <span className={styles.hint}>{strings.search.navigationHint}</span>
        </div>
      )}
    </div>
  );
}
