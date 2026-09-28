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

export function writeOutput(output: CompiledContent, target = GENERATED_ROOT): void {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(join(target, 'modules'), { recursive: true });
  writeJson(join(target, 'graph.json'), output.graph);
  writeJson(join(target, 'modules.json'), output.modules);
  writeJson(join(target, 'routes.json'), output.routes);
  writeJson(join(target, 'notation.json'), output.notation);
  writeJson(join(target, 'search-index.json'), output.search);
  for (const moduleContent of output.moduleContents) {
    writeJson(join(target, 'modules', `module-${moduleContent.modulo}.json`), moduleContent);
  }
}
