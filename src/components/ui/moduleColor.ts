/** CSS color of a module accent, defined in themes.css for both themes. */
export function moduleColor(moduleNumber: number): string {
  return `var(--module-${moduleNumber})`;
}
