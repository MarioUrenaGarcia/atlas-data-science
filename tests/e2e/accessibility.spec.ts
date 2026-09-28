import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { generatedConcepts } from './helpers.ts';

const concept = generatedConcepts()[0];
const PAGES = [
  '/',
  '/modulos',
  '/modulo/0',
  '/rutas',
  '/mapa',
  '/glosario',
  '/notacion',
  '/progreso',
  '/acerca',
  '/buscar?q=normal',
];
if (concept) PAGES.push(`/concepto/${concept.id}`, `/roadmap/${concept.id}`);

for (const path of PAGES) {
  test(`sin violaciones de accesibilidad en ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }));
    expect(summary).toEqual([]);
  });
}
