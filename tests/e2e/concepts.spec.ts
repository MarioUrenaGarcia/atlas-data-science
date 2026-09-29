import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { figureComponents, generatedConcepts, trackErrors } from './helpers.ts';

const concepts = generatedConcepts();

// Every published concept must render its visualization without console errors.
for (const concept of concepts) {
  test(`la ficha ${concept.id} carga su visualización`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'La prueba de humo completa corre solo en escritorio.');
    const errors = trackErrors(page);
    await page.goto(`/concepto/${concept.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(concept.titulo);
    await expect(page.locator('figure').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

// Accessibility is audited once per visualization component, which covers
// every distinct markup structure without auditing each concept page.
const byComponent = new Map(concepts.map((concept) => [concept.componente, concept.id]));
for (const [component, id] of figureComponents()) {
  if (!byComponent.has(component)) byComponent.set(component, id);
}
for (const [component, id] of byComponent) {
  test(`sin violaciones de accesibilidad en la visualización ${component}`, async ({ page }) => {
    await page.goto(`/concepto/${id}`);
    await expect(page.locator('figure').first()).toBeVisible();
    await page
      .locator('figure[aria-label^="Figura"]')
      .last()
      .scrollIntoViewIfNeeded()
      .catch(() => undefined);
    await page.waitForTimeout(1000);
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
