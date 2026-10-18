import { expect, test } from '@playwright/test';
import { generatedConcepts, trackErrors } from './helpers.ts';

// The preview server answers 200 for any path through its SPA fallback, so the
// status alone proves nothing: the raw HTML must be the copy written for that
// route, recognizable by its own title before any script runs.
test('una ficha profunda se sirve con su propio HTML, título y descripción', async ({
  page,
  request,
}) => {
  const concept = generatedConcepts().at(-1);
  test.skip(!concept, 'Todavía no hay fichas generadas.');
  if (!concept) return;

  const response = await request.get(`/concepto/${concept.id}`);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(`<title>${concept.titulo} | Atlas de Data Science</title>`);
  expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  expect(html).toContain('http-equiv="Content-Security-Policy"');

  // The copy boots the application like the entry point does.
  const errors = trackErrors(page);
  await page.goto(`/concepto/${concept.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(concept.titulo);
  expect(errors).toEqual([]);
});

test('las páginas estáticas y la ruta de un concepto también tienen su copia', async ({
  request,
}) => {
  for (const [path, title] of [
    ['/mapa', 'Mapa del conocimiento'],
    ['/glosario', 'Glosario'],
  ] as const) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain(`<title>${title} | Atlas de Data Science</title>`);
  }
  const concept = generatedConcepts()[0];
  if (concept) {
    const html = await (await request.get(`/roadmap/${concept.id}`)).text();
    expect(html).toContain(`<title>Ruta hacia ${concept.titulo} | Atlas de Data Science</title>`);
  }
});
