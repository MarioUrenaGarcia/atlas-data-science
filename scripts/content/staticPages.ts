import { strings } from '../../src/app/strings.ts';

/**
 * GitHub Pages answers 404 for any path without a file, and the SPA only
 * recovers through 404.html, so crawlers and the browser console see an error
 * on every deep link. Writing a copy of index.html for each real route lets the
 * server answer 200, and each copy carries its own title and description.
 * Only the title and the description change: the inline scripts stay byte for
 * byte identical, so the hashes in the Content Security Policy still match.
 */

export interface StaticPageData {
  nodes: readonly {
    id: string;
    titulo: string;
    resumen: string;
    modulo: number;
    borrador?: boolean;
  }[];
  modules: readonly { numero: number; titulo: string; descripcion: string }[];
  routes: readonly { id: string; titulo: string; descripcion: string }[];
}

export interface StaticPage {
  /** Path relative to the site root, without leading or trailing slashes. */
  path: string;
  html: string;
}

const TITLE = /<title>[\s\S]*?<\/title>/;
const DESCRIPTION = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;
const MAX_DESCRIPTION = 300;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plain(text: string): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return collapsed.length <= MAX_DESCRIPTION
    ? collapsed
    : `${collapsed.slice(0, MAX_DESCRIPTION - 3).trimEnd()}...`;
}

/** Same format as useDocumentTitle, so the title does not change after mounting. */
export function documentTitle(title: string | null): string {
  return title ? `${title} | ${strings.appName}` : strings.appName;
}

export function withMeta(html: string, title: string, description: string, extraHead = ''): string {
  if (!TITLE.test(html) || !DESCRIPTION.test(html)) {
    throw new Error('index.html no tiene <title> o <meta name="description">.');
  }
  // Replacement functions, not strings: a string replacement would expand
  // patterns such as $& or $' if a title or a summary ever contained them.
  const titleTag = `<title>${escapeHtml(title)}</title>`;
  const descriptionTag = `<meta name="description" content="${escapeHtml(plain(description))}" />${extraHead}`;
  return html.replace(TITLE, () => titleTag).replace(DESCRIPTION, () => descriptionTag);
}

export function staticPages(indexHtml: string, data: StaticPageData): StaticPage[] {
  const page = (path: string, title: string | null, description: string): StaticPage => ({
    path,
    html: withMeta(indexHtml, documentTitle(title), description),
  });
  const concepts = data.nodes.filter((node) => !node.borrador);
  // A module without published concepts would only show its header, so it
  // keeps going through the SPA fallback instead of being offered to crawlers.
  const publishedModules = new Set(concepts.map((node) => node.modulo));
  return [
    page('modulos', strings.modules.title, strings.modules.intro),
    page('mapa', strings.map.title, strings.map.intro),
    page('rutas', strings.routes.title, strings.routes.intro),
    page('buscar', strings.search.resultsTitle, strings.search.description),
    page('glosario', strings.glossary.title, strings.glossary.intro),
    page('notacion', strings.notation.title, strings.notation.intro),
    page('progreso', strings.progress.title, strings.progress.intro),
    page('acerca', strings.about.title, strings.about.what[0] ?? strings.home.intro),
    ...data.modules
      .filter((module) => publishedModules.has(module.numero))
      .map((module) => page(`modulo/${module.numero}`, module.titulo, module.descripcion)),
    ...concepts.map((node) => page(`concepto/${node.id}`, node.titulo, node.resumen)),
    ...concepts.map((node) =>
      page(
        `roadmap/${node.id}`,
        strings.roadmap.title(node.titulo),
        `${strings.roadmap.intro} ${node.resumen}`,
      ),
    ),
    ...data.routes.map((route) => page(`rutas/${route.id}`, route.titulo, route.descripcion)),
  ];
}

/** 404.html stays the fallback for unknown paths and asks crawlers not to index it. */
export function notFoundPage(indexHtml: string): string {
  return withMeta(
    indexHtml,
    documentTitle(strings.notFound.title),
    strings.notFound.body,
    '\n    <meta name="robots" content="noindex" />',
  );
}
