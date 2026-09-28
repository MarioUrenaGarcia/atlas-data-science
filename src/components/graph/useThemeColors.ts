import { useEffect, useState } from 'react';

const MODULE_COUNT = 18;

export interface ThemeColors {
  modules: string[];
  text: string;
  textMuted: string;
  surface: string;
  border: string;
  accent: string;
  success: string;
  background: string;
}

function readColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string) => style.getPropertyValue(name).trim();
  return {
    modules: Array.from({ length: MODULE_COUNT }, (_, index) => value(`--module-${index}`)),
    text: value('--color-text'),
    textMuted: value('--color-text-muted'),
    surface: value('--color-surface'),
    border: value('--color-border-strong'),
    accent: value('--color-accent'),
    success: value('--color-success'),
    background: value('--color-bg'),
  };
}

/**
 * Canvas drawing cannot use CSS variables directly, so the resolved theme
 * colors are read from the root element and refreshed when the theme changes.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(readColors);
  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  return colors;
}
