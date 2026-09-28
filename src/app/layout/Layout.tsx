import { lazy, Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary.tsx';
import { Loading } from '../../components/ui/Loading.tsx';
import { useUi } from '../../store/ui.ts';
import { strings } from '../strings.ts';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import styles from './Layout.module.css';
import { useGlobalShortcuts } from './useGlobalShortcuts.ts';
import { useThemeEffect } from './useThemeEffect.ts';

const SearchPalette = lazy(() => import('../../components/search/SearchPalette.tsx'));

export function Layout() {
  useThemeEffect();
  useGlobalShortcuts();
  const searchOpen = useUi((state) => state.searchOpen);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Moves focus to the main region after client-side navigation so screen
  // readers announce the new page, and restores the scroll position to the top
  // unless the URL targets an anchor.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!location.hash) {
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className={styles.app}>
      <a href="#contenido" className={styles.skipLink}>
        {strings.skipToContent}
      </a>
      <Header />
      <main id="contenido" ref={mainRef} tabIndex={-1} className={styles.main}>
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchPalette />
        </Suspense>
      )}
    </div>
  );
}
