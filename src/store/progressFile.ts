import { z } from 'zod';
import type { ActiveRoute, ConceptStatus } from './progress.ts';

const statusSchema = z.enum(['visto', 'dominado']);

const activeRouteSchema = z.union([
  z.object({
    tipo: z.literal('roadmap'),
    objetivo: z.string().min(1),
    desde: z.string().min(1).optional(),
  }),
  z.object({ tipo: z.literal('ruta'), id: z.string().min(1) }),
]);

export const progressExportSchema = z.object({
  formato: z.literal('atlas-progreso'),
  version: z.literal(1),
  exportado: z.string(),
  conceptos: z.record(z.string(), statusSchema),
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
  try {
    const result = progressExportSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
