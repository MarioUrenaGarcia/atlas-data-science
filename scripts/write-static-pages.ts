import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { notFoundPage, staticPages, type StaticPageData } from './content/staticPages.ts';

// Runs after vite build: writes one copy of index.html per route of the site,
// named after the route, and 404.html for unknown paths. The data comes from
// the production content build, which already excludes unpublished concepts.
const distDir = 'dist';
const generatedDir = join('src', 'generated');
const source = join(distDir, 'index.html');

if (!existsSync(source)) {
  console.error('No existe dist/index.html; ejecute primero vite build.');
  process.exit(1);
}

const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(join(generatedDir, file), 'utf8')) as T;
const indexHtml = readFileSync(source, 'utf8');
const data: StaticPageData = {
  nodes: readJson<{ nodes: StaticPageData['nodes'] }>('graph.json').nodes,
  modules: readJson<{ modules: StaticPageData['modules'] }>('modules.json').modules,
  routes: readJson<{ routes: StaticPageData['routes'] }>('routes.json').routes,
};

const pages = staticPages(indexHtml, data);
const allPaths = new Set(pages.map((page) => page.path));
for (const page of pages) {
  // GitHub Pages serves /concepto/x from concepto/x.html with status 200; a
  // folder with index.html would first redirect to /concepto/x/.
  const target = join(distDir, `${page.path}.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page.html, 'utf8');
  // A route that is also the folder of other routes (rutas and rutas/<id>) gets
  // an index.html too, in case the server resolves it as a folder first and
  // redirects to the address with a trailing slash.
  const isFolder = [...allPaths].some((path) => path.startsWith(`${page.path}/`));
  if (isFolder) {
    mkdirSync(join(distDir, page.path), { recursive: true });
    writeFileSync(join(distDir, page.path, 'index.html'), page.html, 'utf8');
  }
}
writeFileSync(join(distDir, '404.html'), notFoundPage(indexHtml), 'utf8');
console.log(`${pages.length} páginas estáticas y dist/404.html creados.`);
