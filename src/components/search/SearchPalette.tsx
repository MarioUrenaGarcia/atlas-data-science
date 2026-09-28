import { Suspense, useEffect, useRef } from 'react';
import { strings } from '../../app/strings.ts';
import { useUi } from '../../store/ui.ts';
import { Loading } from '../ui/Loading.tsx';
import { useDialogClose } from '../ui/useDialogClose.ts';
import styles from './SearchPalette.module.css';
import { SearchPaletteContent } from './SearchPaletteContent.tsx';

/** Global search dialog opened with Ctrl+K, Cmd+K or "/". */
export default function SearchPalette() {
  const closeSearch = useUi((state) => state.closeSearch);
  const initialQuery = useUi((state) => state.searchInitialQuery);
  const ref = useRef<HTMLDialogElement>(null);
  useDialogClose(ref, closeSearch);

  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={strings.search.dialogLabel}
      onClick={(event) => {
        if (event.target === ref.current) closeSearch();
      }}
    >
      <Suspense fallback={<Loading />}>
        <SearchPaletteContent initialQuery={initialQuery} onClose={closeSearch} />
      </Suspense>
    </dialog>
  );
}
