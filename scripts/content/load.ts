import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';

export interface RawConceptFile {
  /** Path relative to the content root, with forward slashes. */
  path: string;
  data: Record<string, unknown>;
  body: string;
  /** Line where the body starts, to translate body line numbers into file lines. */
  bodyLineOffset: number;
  parseError?: string;
}

export interface RawContent {
  root: string;
  concepts: RawConceptFile[];
  modules: unknown;
  routes: unknown;
  notation: unknown;
  synonyms: unknown;
  missingFiles: string[];
}

function walk(directory: string): string[] {
  if (!existsSync(directory)) return [];
  const entries = readdirSync(directory).sort();
  return entries.flatMap((entry) => {
    const full = join(directory, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function toPosix(path: string): string {
  return path.split(sep).join('/');
}

function readYaml(root: string, name: string, missing: string[]): unknown {
  const path = join(root, name);
  if (!existsSync(path)) {
    missing.push(name);
    return undefined;
  }
  return parseYaml(readFileSync(path, 'utf8'));
}

export function readConceptFile(root: string, file: string): RawConceptFile {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const path = toPosix(relative(root, file));
  try {
    // An empty options object disables gray-matter's cache, which would
    // otherwise return stale data for identical strings across rebuilds.
    const parsed = matter(text, {});
    const bodyStart = text.length - parsed.content.length;
    const bodyLineOffset = text.slice(0, bodyStart).split('\n').length - 1;
    return { path, data: parsed.data, body: parsed.content, bodyLineOffset };
  } catch (error) {
    return {
      path,
      data: {},
      body: '',
      bodyLineOffset: 0,
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

export function loadContent(root: string): RawContent {
  const missingFiles: string[] = [];
  const conceptFiles = walk(join(root, 'conceptos')).filter((file) => file.endsWith('.md'));
  return {
    root,
    concepts: conceptFiles.map((file) => readConceptFile(root, file)),
    modules: readYaml(root, 'modulos.yaml', missingFiles),
    routes: readYaml(root, 'rutas.yaml', missingFiles),
    notation: readYaml(root, 'notacion.yaml', missingFiles),
    synonyms: readYaml(root, 'sinonimos.yaml', missingFiles),
    missingFiles,
  };
}

export function fileStem(path: string): string {
  return basename(path, '.md');
}
