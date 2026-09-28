import { useEffect } from 'react';
import { resolveTheme, usePreferences } from '../../store/preferences.ts';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Keeps data-theme on the root element in sync with the preference and the system setting. */
export function useThemeEffect(): void {
  const preference = usePreferences((state) => state.theme);
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(preference, media.matches);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [preference]);
}
