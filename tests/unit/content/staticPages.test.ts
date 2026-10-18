import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  documentTitle,
  notFoundPage,
  staticPages,
  withMeta,
} from '../../../scripts/content/staticPages.ts';

const THEME_SCRIPT = "document.documentElement.dataset.theme = 'light';";
const hash = (source: string) =>
  `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;

// Shape of the built index.html: CSP meta with the hash of the inline script.
const INDEX = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' ${hash(THEME_SCRIPT)}" />
    <meta
      name="description"
      content="Descripción general."
    />
    <title>Atlas de Data Science</title>
    <script>${THEME_SCRIPT}</script>
    <script type="module" crossorigin src="/atlas/assets/index-abc.js"></script>
  </head>
  <body><div id="root"></div></body>
</html>`;

const DATA = {
  nodes: [
    {
      id: 'teorema-de-bayes',
      titulo: 'Teorema de Bayes',
      resumen: 'Invierte  condicionales.',
      modulo: 1,
    },
    { id: 'borrador-x', titulo: 'Borrador', resumen: 'No publicado.', modulo: 2, borrador: true },
  ],
  modules: [
    { numero: 1, titulo: 'Probabilidad', descripcion: 'Eventos y probabilidad.' },
    { numero: 2, titulo: 'Distribuciones', descripcion: 'Sin fichas publicadas.' },
  ],
  routes: [
    { id: 'bayesiana', titulo: 'Ruta bayesiana', descripcion: 'Para la inferencia bayesiana.' },
  ],
};

const titleOf = (html: string) => /<title>([^<]*)<\/title>/.exec(html)?.[1];
const descriptionOf = (html: string) => /name="description" content="([^"]*)"/.exec(html)?.[1];
const inlineScripts = (html: string) =>
  [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

describe('staticPages', () => {
  const pages = staticPages(INDEX, DATA);
  const byPath = new Map(pages.map((page) => [page.path, page.html]));

  it('writes one page per real route and no duplicates', () => {
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
    for (const path of [
      'mapa',
      'buscar',
      'glosario',
      'modulo/1',
      'concepto/teorema-de-bayes',
      'roadmap/teorema-de-bayes',
      'rutas/bayesiana',
    ]) {
      expect(byPath.has(path), path).toBe(true);
    }
  });

  it('leaves out unpublished concepts and modules without published concepts', () => {
    expect(byPath.has('concepto/borrador-x')).toBe(false);
    expect(byPath.has('roadmap/borrador-x')).toBe(false);
    expect(byPath.has('modulo/2')).toBe(false);
  });

  it('gives each page its own title and description', () => {
    const concept = byPath.get('concepto/teorema-de-bayes') ?? '';
    expect(titleOf(concept)).toBe('Teorema de Bayes | Atlas de Data Science');
    expect(descriptionOf(concept)).toBe('Invierte condicionales.');
    expect(titleOf(byPath.get('roadmap/teorema-de-bayes') ?? '')).toBe(
      'Ruta hacia Teorema de Bayes | Atlas de Data Science',
    );
    expect(titleOf(byPath.get('modulo/1') ?? '')).toBe(documentTitle('Probabilidad'));
  });

  it('keeps the inline scripts identical, so the CSP hash still matches', () => {
    for (const html of byPath.values()) {
      expect(inlineScripts(html)).toEqual([THEME_SCRIPT]);
      expect(html).toContain(hash(THEME_SCRIPT));
      expect(html).toContain('src="/atlas/assets/index-abc.js"');
    }
  });
});

describe('withMeta', () => {
  it('escapes HTML in the title and the description', () => {
    const html = withMeta(INDEX, 'A < B & "C"', 'x > y');
    expect(titleOf(html)).toBe('A &lt; B &amp; &quot;C&quot;');
    expect(descriptionOf(html)).toBe('x &gt; y');
  });

  it('shortens long descriptions', () => {
    const html = withMeta(INDEX, 'T', 'palabra '.repeat(80));
    expect((descriptionOf(html) ?? '').length).toBeLessThanOrEqual(300);
  });

  it('fails when the entry point lacks the tags it has to replace', () => {
    expect(() => withMeta('<html></html>', 'T', 'D')).toThrow();
  });
});

describe('notFoundPage', () => {
  it('keeps the SPA fallback and asks crawlers not to index it', () => {
    const html = notFoundPage(INDEX);
    expect(titleOf(html)).toBe('Página no encontrada | Atlas de Data Science');
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(inlineScripts(html)).toEqual([THEME_SCRIPT]);
  });
});
