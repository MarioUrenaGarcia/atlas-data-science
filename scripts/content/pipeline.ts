import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { compileContent, type CompiledContent, type CompileResult } from './compile.ts';
import { loadContent } from './load.ts';
import { loadVisualizationCatalog } from './visualizations.ts';

export const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
export const CONTENT_ROOT = join(PROJECT_ROOT, 'content');
export const GENERATED_ROOT = join(PROJECT_ROOT, 'src', 'generated');
export const VISUALIZATIONS_ROOT = join(PROJECT_ROOT, 'src', 'visualizations');

export interface PipelineOptions {
  production: boolean;
  strict: boolean;
  contentRoot?: string;
  visualizationsRoot?: string;
}

export async function runPipeline(options: PipelineOptions): Promise<CompileResult> {
  const raw = loadContent(options.contentRoot ?? CONTENT_ROOT);
  const visualizations = await loadVisualizationCatalog(
    options.visualizationsRoot ?? VISUALIZATIONS_ROOT,
  );
  return compileContent(raw, {
    production: options.production,
    strict: options.strict,
    visualizations,
  });
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value)}\n`, 'utf8');
}

/** Folder inside src/generated that holds one JSON file per concept body. */
export const CONCEPT_FILES_DIR = 'concepts';

export function writeOutput(output: CompiledContent, target = GENERATED_ROOT): void {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(join(target, CONCEPT_FILES_DIR), { recursive: true });
  writeJson(join(target, 'graph.json'), output.graph);
  writeJson(join(target, 'modules.json'), output.modules);
  writeJson(join(target, 'routes.json'), output.routes);
  writeJson(join(target, 'notation.json'), output.notation);
  writeJson(join(target, 'search-index.json'), output.search);
  writeJson(join(target, 'map-layout.json'), output.mapLayout);
  // One file per concept: a concept page downloads only its own content
  // instead of the whole module, which reaches several megabytes.
  for (const file of output.conceptFiles) {
    writeFileSync(
      join(target, CONCEPT_FILES_DIR, file.fileName),
      `${file.json}
`,
      'utf8',
    );
  }
}
