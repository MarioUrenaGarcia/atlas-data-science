import { useEffect, useState } from 'react';
import { loadSearchEngine, type SearchEngine } from './searchEngine.ts';

/** Loads the search index the first time a search interface is shown. */
export function useSearchEngine(): { engine: SearchEngine | null; failed: boolean } {
  const [engine, setEngine] = useState<SearchEngine | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    loadSearchEngine().then(
      (loaded) => {
        if (active) setEngine(loaded);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  return { engine, failed };
}
