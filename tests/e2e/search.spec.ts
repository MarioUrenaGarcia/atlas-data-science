import { expect, test } from '@playwright/test';
import { generatedConcepts } from './helpers.ts';

test('Ctrl+K abre la búsqueda y Escape la cierra', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Atajo de teclado de escritorio.');
  await page.goto('/');
  // Wait for the application to mount so the global shortcut listener exists.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Búsqueda de conceptos' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  // The palette unmounts after closing; reopening is only meaningful once it is gone.
  await expect(page.locator('dialog')).toHaveCount(0);
  await page.keyboard.press('/');
  await expect(dialog).toBeVisible();
});

test('el botón de búsqueda del encabezado abre la paleta', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar conceptos' }).click();
  await expect(page.getByRole('dialog', { name: 'Búsqueda de conceptos' })).toBeVisible();
});

test('la búsqueda encuentra conceptos sin acentos y abre la ficha con Enter', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Navegación con teclado de escritorio.');
  const concept = generatedConcepts()[0];
  test.skip(!concept, 'Todavía no hay fichas generadas.');
  if (!concept) return;
  const query = concept.titulo
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase();
  await page.goto('/');
  // Wait for the application to mount so the global shortcut listener exists.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('searchbox').fill(query);
  await expect(
    dialog.getByRole('link', { name: concept.titulo, exact: false }).first(),
  ).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/concepto\//);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('la página de resultados conserva la consulta en la URL', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');
  await main.getByRole('searchbox').fill('probabilidad');
  await main.getByRole('button', { name: 'Buscar' }).click();
  await expect(page).toHaveURL(/\/buscar\?q=probabilidad/);
  await expect(main.getByText(/resultado/).first()).toBeVisible();
});
