/**
 * Data colors from the colorblind-safe palette defined in themes.css. SVG
 * accepts the CSS variables directly; canvas code must resolve them with
 * resolveColor.
 */
export const DATA_COLORS = {
  primary: 'var(--data-1)',
  secondary: 'var(--data-2)',
  tertiary: 'var(--data-3)',
  quaternary: 'var(--data-4)',
  highlight: 'var(--data-5)',
  light: 'var(--data-6)',
  olive: 'var(--data-7)',
  neutral: 'var(--data-neutral)',
  positive: 'var(--data-positive)',
  negative: 'var(--data-negative)',
  text: 'var(--color-text)',
  muted: 'var(--color-text-muted)',
  grid: 'var(--data-grid)',
} as const;

export const SERIES_COLORS = [
  'var(--data-1)',
  'var(--data-2)',
  'var(--data-3)',
  'var(--data-4)',
  'var(--data-5)',
  'var(--data-6)',
  'var(--data-7)',
  'var(--data-8)',
] as const;

export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length] ?? 'var(--data-1)';
}

/** Resolves "var(--name)" to its computed value for canvas drawing. */
export function resolveColor(color: string, element: Element = document.documentElement): string {
  const match = /^var\((--[\w-]+)\)$/.exec(color);
  if (!match?.[1]) return color;
  return getComputedStyle(element).getPropertyValue(match[1]).trim() || '#888';
}
