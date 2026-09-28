import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ZodType } from 'zod';

export interface VisualizationEntry {
  name: string;
  kind: 'archetypes' | 'custom';
  /** Schema for the parameters accepted from frontmatter, when the component declares one. */
  schema: ZodType | null;
}

export type VisualizationCatalog = Map<string, VisualizationEntry>;

const KINDS = ['archetypes', 'custom'] as const;

/**
 * Each visualization lives in `<kind>/<Name>/` with the component in
 * `<Name>.tsx` and its parameter schema in `schema.ts`. The schema file is
 * plain TypeScript so the content scripts can import it without a bundler.
 */
export async function loadVisualizationCatalog(
  visualizationsDir: string,
): Promise<VisualizationCatalog> {
  const catalog: VisualizationCatalog = new Map();
  for (const kind of KINDS) {
    const kindDir = join(visualizationsDir, kind);
    if (!existsSync(kindDir)) continue;
    for (const name of readdirSync(kindDir).sort()) {
      const folder = join(kindDir, name);
      if (!statSync(folder).isDirectory() || !existsSync(join(folder, `${name}.tsx`))) continue;
      const schemaPath = join(folder, 'schema.ts');
      let schema: ZodType | null = null;
      if (existsSync(schemaPath)) {
        const module = (await import(pathToFileURL(schemaPath).href)) as {
          parametersSchema?: ZodType;
        };
        schema = module.parametersSchema ?? null;
      }
      catalog.set(name, { name, kind, schema });
    }
  }
  return catalog;
}
