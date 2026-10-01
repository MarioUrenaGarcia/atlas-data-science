import { z } from 'zod';
import { conceptIdSchema } from '../content/schema.ts';
import type { ActiveRoute, ConceptStatus } from './progress.ts';

/**
 * Upper bound for an imported file. A full export of every concept is far
 * below it; anything larger is rejected before parsing so a crafted file
 * cannot exhaust memory or the localStorage quota.
 */
export const MAX_PROGRESS_FILE_BYTES = 1024 * 1024;

const statusSchema = z.enum(['visto', 'dominado']);

const activeRouteSchema = z.union([
  z.object({
    tipo: z.literal('roadmap'),
    objetivo: conceptIdSchema,
    desde: conceptIdSchema.optional(),
  }),
  z.object({ tipo: z.literal('ruta'), id: conceptIdSchema }),
]);

export const progressExportSchema = z.object({
  formato: z.literal('atlas-progreso'),
  version: z.literal(1),
  exportado: z.string().max(64),
  conceptos: z.record(conceptIdSchema, statusSchema),
  rutaActiva: activeRouteSchema.nullable(),
});

export type ProgressExport = z.infer<typeof progressExportSchema>;

interface ProgressSnapshot {
  conceptos: Record<string, ConceptStatus>;
  rutaActiva: ActiveRoute | null;
}

export function exportProgress(state: ProgressSnapshot, now = new Date()): ProgressExport {
  return {
    formato: 'atlas-progreso',
    version: 1,
    exportado: now.toISOString(),
    conceptos: { ...state.conceptos },
    rutaActiva: state.rutaActiva,
  };
}

export function parseProgressFile(text: string): ProgressExport | null {
  if (text.length > MAX_PROGRESS_FILE_BYTES) return null;
  try {
    const result = progressExportSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
