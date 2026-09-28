import { expect, test } from '@playwright/test';
import { expectNoHorizontalScroll, generatedConcepts, trackErrors } from './helpers.ts';

const PAGES = [
  { path: '/', heading: 'Atlas de Data Science' },
  { path: '/modulos', heading: 'Módulos' },
  { path: '/modulo/0', heading: 'Fundamentos matemáticos' },
  { path: '/rutas', heading: 'Rutas de aprendizaje' },
  { path: '/rutas/fundamentos-para-todos', heading: 'Fundamentos para todos' },
  { path: '/mapa', heading: 'Mapa del conocimiento' },
  { path: '/buscar', heading: 'Resultados de búsqueda' },
  { path: '/glosario', heading: 'Glosario' },
  { path: '/notacion', heading: 'Notación' },
  { path: '/progreso', heading: 'Progreso' },
  { path: '/acerca', heading: 'Acerca del Atlas' },
  { path: '/una-ruta-que-no-existe', heading: 'Página no encontrada' },
];

for (const { path, heading } of PAGES) {
  test(`la página ${path} carga sin errores`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });
}

test('la navegación principal lleva a cada sección', async ({ page, isMobile }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  const open = async () => {
    if (isMobile) await page.getByRole('button', { name: 'Abrir menú' }).click();
  };
  await open();
  await navigation.getByRole('link', { name: 'Rutas' }).click();
  await expect(page).toHaveURL(/\/rutas$/);
  await open();
  await navigation.getByRole('link', { name: 'Glosario' }).click();
  await expect(page).toHaveURL(/\/glosario$/);
});

test('el tema elegido se conserva al recargar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'En pantallas estrechas el selector de tema está dentro del menú.');
  await page.goto('/');
  await page.getByRole('radio', { name: 'Oscuro' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('una ficha, su ruta y su módulo cargan sin errores', async ({ page }) => {
  const concepts = generatedConcepts();
  test.skip(concepts.length === 0, 'Todavía no hay fichas generadas.');
  const concept = concepts.find((node) => node.prerrequisitos.length > 0) ?? concepts[0];
  if (!concept) return;
  const errors = trackErrors(page);
  await page.goto(`/concepto/${concept.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(concept.titulo);
  await expect(page.getByRole('heading', { name: 'Intuición' })).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.getByRole('link', { name: 'Ver ruta hacia este concepto' }).click();
  await expect(page).toHaveURL(new RegExp(`/roadmap/${concept.id}`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText(concept.titulo);
  await page.getByRole('radio', { name: 'Lista' }).click();
  await expect(
    page.getByRole('main').getByRole('link', { name: concept.titulo }).first(),
  ).toBeVisible();
  await page.goto(`/modulo/${concept.modulo}`);
  await expect(page.getByRole('main').getByRole('link', { name: concept.titulo })).toBeVisible();
  expect(errors).toEqual([]);
});
