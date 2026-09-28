import { useEffect } from 'react';
import { useUi } from '../../store/ui.ts';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/** Ctrl+K, Cmd+K and "/" open the search palette from anywhere in the site. */
export function useGlobalShortcuts(): void {
  const openSearch = useUi((state) => state.openSearch);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifierK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      const slash =
        event.key === '/' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTypingTarget(event.target);
      if (modifierK || slash) {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openSearch]);
}
