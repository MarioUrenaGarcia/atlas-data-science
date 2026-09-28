import type { Issue } from './compile.ts';

function dedupe(issues: readonly Issue[]): Issue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.level}|${issue.file ?? ''}|${issue.line ?? ''}|${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Prints issues sorted by severity and location. Warnings about concepts that
 * have not been written yet are collapsed into one line unless `detailed` is set.
 */
export function printIssues(issues: readonly Issue[], detailed = false): void {
  const unique = dedupe(issues);
  const pendingWarnings = unique.filter((issue) => issue.pending && issue.level === 'warning');
  const visible = detailed
    ? unique
    : unique.filter((issue) => !(issue.pending && issue.level === 'warning'));
  const sorted = [...visible].sort(
    (a, b) =>
      (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1) ||
      (a.file ?? '').localeCompare(b.file ?? '') ||
      (a.line ?? 0) - (b.line ?? 0),
  );
  for (const issue of sorted) {
    const location = issue.file
      ? `${issue.file}${issue.line ? `:${issue.line}` : ''}`
      : 'contenido';
    const label = issue.level === 'error' ? 'ERROR' : 'aviso';
    const stream = issue.level === 'error' ? console.error : console.warn;
    stream(`${label}  ${location}  ${issue.message}`);
  }
  if (!detailed && pendingWarnings.length > 0) {
    console.warn(
      `aviso  ${pendingWarnings.length} referencia(s) en modulos.yaml o rutas.yaml a conceptos aún no escritos (use --detalle para listarlas).`,
    );
  }
}

export function summarize(issues: readonly Issue[]): { errors: number; warnings: number } {
  const unique = dedupe(issues);
  return {
    errors: unique.filter((issue) => issue.level === 'error').length,
    warnings: unique.filter((issue) => issue.level === 'warning').length,
  };
}
