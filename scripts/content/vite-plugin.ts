import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { CONCEPT_FILES_FOLDER } from '../../src/content/files.ts';
import {
  CONCEPT_FILES_DIR,
  CONTENT_ROOT,
  GENERATED_ROOT,
  runPipeline,
  VISUALIZATIONS_ROOT,
  writeOutput,
} from './pipeline.ts';
import { printIssues } from './report.ts';

// Concept id, a 10 character content hash and the extension. Anything else,
// including path separators or "..", never reaches the file system.
const CONCEPT_FILE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[0-9a-f]{10}\.json$/;

/**
 * Concept bodies live in src/generated as one JSON file each and are not
 * imported by any module, so this plugin serves them during development and
 * copies them into the build under the same public folder.
 */
export function conceptFilesPlugin(): Plugin {
  const source = join(GENERATED_ROOT, CONCEPT_FILES_DIR);
  return {
    name: 'atlas-concept-files',
    configureServer(server) {
      const prefix = `${server.config.base}${CONCEPT_FILES_FOLDER}/`;
      server.middlewares.use((request, response, next) => {
        const path = (request.url ?? '').split('?')[0] ?? '';
        if (!path.startsWith(prefix)) {
          next();
          return;
        }
        const name = path.slice(prefix.length);
        const file = join(source, name);
        if (!CONCEPT_FILE_NAME.test(name) || !existsSync(file)) {
          response.statusCode = 404;
          response.end();
          return;
        }
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(readFileSync(file));
      });
    },
    generateBundle() {
      if (!existsSync(source)) return;
      for (const name of readdirSync(source)) {
        if (!CONCEPT_FILE_NAME.test(name)) continue;
        this.emitFile({
          type: 'asset',
          fileName: `${CONCEPT_FILES_FOLDER}/${name}`,
          source: readFileSync(join(source, name)),
        });
      }
    },
  };
}

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
