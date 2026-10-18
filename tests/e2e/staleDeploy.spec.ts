import { expect, test } from '@playwright/test';

// A deploy removes the chunks of the previous build. Answering 404 for the map
// chunk reproduces what an open tab sees when it navigates after the deploy.
test('recarga una sola vez cuando falta un módulo por un despliegue nuevo', async ({
  page,
  isMobile,
}) => {
  await page.route(/\/assets\/MapPage-[^/]+\.js$/, (route) =>
    route.fulfill({ status: 404, body: 'Not found' }),
  );
  const documents: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') documents.push(new URL(request.url()).pathname);
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  if (isMobile) await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', {
      name: 'Mapa',
    })
    .click();

  // The reload loads /mapa from the server; the chunk is still missing, so the
  // second failure shows the error instead of reloading again.
  await expect(page.getByRole('alert')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(documents.filter((path) => path.endsWith('/mapa'))).toHaveLength(1);
  expect(documents).toHaveLength(2);
});

test('sin fallos de carga la navegación no recarga la página', async ({ page, isMobile }) => {
  const documents: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') documents.push(request.url());
  });
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', {
      name: 'Mapa',
    })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mapa del conocimiento');
  expect(documents).toHaveLength(1);
});

// Concept bodies are JSON files named after a hash of their content, so a tab
// opened before a deploy asks for a name the new deploy no longer serves.
test('recarga una sola vez cuando falta el contenido de una ficha', async ({ page }) => {
  await page.route(/\/contenido\/[^/]+\.json$/, (route) =>
    route.fulfill({ status: 404, body: 'Not found' }),
  );
  const documents: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') documents.push(new URL(request.url()).pathname);
  });

  await page.goto('/glosario');
  await page.locator('main a[href*="/concepto/"]').first().click();

  await expect(page.getByRole('alert')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(documents).toHaveLength(2);
  expect(documents[1]).toMatch(/\/concepto\//);
});
