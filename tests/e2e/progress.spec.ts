import { readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { generatedConcepts } from './helpers.ts';

test('marcar progreso persiste tras recargar', async ({ page }) => {
  const concept = generatedConcepts()[0];
  test.skip(!concept, 'Todavía no hay fichas generadas.');
  if (!concept) return;
  await page.goto(`/concepto/${concept.id}`);
  const controls = page.getByRole('group', { name: 'Progreso del concepto' });
  await controls.getByRole('button', { name: 'Dominado' }).click();
  await expect(controls.getByRole('button', { name: 'Dominado' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.reload();
  await expect(
    page
      .getByRole('group', { name: 'Progreso del concepto' })
      .getByRole('button', { name: 'Dominado' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('exportar e importar progreso', async ({ page }, testInfo) => {
  await page.goto('/progreso');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar progreso' }).click(),
  ]);
  const exported = JSON.parse(readFileSync(await download.path(), 'utf8')) as { formato: string };
  expect(exported.formato).toBe('atlas-progreso');

  const valid = testInfo.outputPath('progreso.json');
  writeFileSync(
    valid,
    JSON.stringify({
      formato: 'atlas-progreso',
      version: 1,
      exportado: new Date().toISOString(),
      conceptos: { 'concepto-de-prueba': 'dominado' },
      rutaActiva: null,
    }),
  );
  await page.locator('input[type="file"]').setInputFiles(valid);
  await expect(page.getByText('Se importaron 1 marcas de progreso.')).toBeVisible();

  const invalid = testInfo.outputPath('invalido.json');
  writeFileSync(invalid, JSON.stringify({ otro: true }));
  await page.locator('input[type="file"]').setInputFiles(invalid);
  await expect(
    page.getByText('El archivo no tiene el formato de progreso del Atlas.'),
  ).toBeVisible();
});

test('borrar progreso pide confirmación', async ({ page }) => {
  await page.goto('/progreso');
  await page.getByRole('button', { name: 'Borrar progreso' }).click();
  const dialog = page.getByRole('dialog', { name: 'Borrar todo el progreso' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Borrar', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Se borró el progreso.')).toBeVisible();
});
