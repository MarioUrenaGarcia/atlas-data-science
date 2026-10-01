import { expect, test } from '@playwright/test';
import { generatedConcepts, trackErrors } from './helpers.ts';

/** Concepts examined per module while looking for an animation with a final state. */
const CANDIDATES_PER_MODULE = 15;
const FINISH_TIMEOUT_MS = 20000;

const byModule = new Map<number, string[]>();
for (const concept of generatedConcepts()) {
  byModule.set(concept.modulo, [...(byModule.get(concept.modulo) ?? []), concept.id]);
}

// One concept per module: the first whose main visualization offers the
// skip-to-end button must reach its final state without console errors.
for (const [module, ids] of byModule) {
  test(`saltar al final funciona en una ficha del módulo ${module}`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Se verifica en escritorio.');
    const errors = trackErrors(page);
    for (const id of ids.slice(0, CANDIDATES_PER_MODULE)) {
      await page.goto(`/concepto/${id}`);
      const frame = page.locator('[aria-label^="Visualización interactiva"]').first();
      await expect(frame).toBeVisible();
      const skip = frame.getByRole('button', { name: 'Saltar al final' });
      if ((await skip.count()) === 0) continue;
      await skip.click();
      await expect(frame.getByText('Simulación terminada')).toBeVisible({
        timeout: FINISH_TIMEOUT_MS,
      });
      await expect(skip).toBeDisabled();
      await frame.getByRole('button', { name: 'Reiniciar' }).click();
      await expect(skip).toBeEnabled();
      expect(errors).toEqual([]);
      return;
    }
    throw new Error(`Ninguna de las primeras fichas del módulo ${module} ofrece saltar al final.`);
  });
}
