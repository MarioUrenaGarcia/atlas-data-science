import { basename, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { CONTENT_ROOT, runPipeline, VISUALIZATIONS_ROOT, writeOutput } from './pipeline.ts';
import { printIssues } from './report.ts';

/**
 * Regenerates src/generated when the dev server starts and whenever a content
 * file or a visualization parameter schema changes, then reloads the page.
 */
export function contentPlugin(): Plugin {
  let running: Promise<void> | null = null;
  let queued = false;

  async function rebuild(): Promise<boolean> {
    const result = await runPipeline({ production: false, strict: false });
    printIssues(result.issues);
    if (!result.output) return false;
    writeOutput(result.output);
    return true;
  }

  function isRelevant(file: string): boolean {
    const full = resolve(file);
    if (full.startsWith(CONTENT_ROOT)) return true;
    return full.startsWith(VISUALIZATIONS_ROOT) && basename(full) === 'schema.ts';
  }

  return {
    name: 'atlas-content',
    apply: 'serve',
    async configureServer(server) {
      await rebuild();
      server.watcher.add(CONTENT_ROOT);
      const schedule = (file: string) => {
        if (!isRelevant(file)) return;
        if (running) {
          queued = true;
          return;
        }
        running = rebuild()
          .then((ok) => {
            if (ok) server.ws.send({ type: 'full-reload' });
          })
          .finally(() => {
            running = null;
            if (queued) {
              queued = false;
              schedule(file);
            }
          });
      };
      server.watcher.on('change', schedule);
      server.watcher.on('add', schedule);
      server.watcher.on('unlink', schedule);
    },
  };
}
