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

test('las flechas laterales recorren el Atlas en orden de estudio', async ({ page }) => {
  const concepts = generatedConcepts();
  // The last concept of the first submodule checks that the arrows cross boundaries.
  const index = concepts.findIndex(
    (node, position) => position > 0 && concepts[position - 1]?.submodulo !== node.submodulo,
  );
  test.skip(index < 1, 'Hace falta más de un submódulo con fichas.');
  const current = concepts[index - 1];
  const next = concepts[index];
  if (!current || !next) return;
  const errors = trackErrors(page);
  await page.goto(`/concepto/${current.id}`);
  await page.mouse.wheel(0, 3000);
  const arrow = page.getByRole('link', { name: `Siguiente en el Atlas: ${next.titulo}` });
  await expect(arrow).toBeInViewport();
  await arrow.click();
  await expect(page).toHaveURL(new RegExp(`/concepto/${next.id}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(next.titulo);
  await page.getByRole('link', { name: `Anterior en el Atlas: ${current.titulo}` }).click();
  await expect(page).toHaveURL(new RegExp(`/concepto/${current.id}$`));
  expect(errors).toEqual([]);
});

test('el mapa dibuja los conceptos y la vista por módulos abre un módulo', async ({ page }) => {
  test.skip(generatedConcepts().length === 0, 'Todavía no hay fichas generadas.');
  const errors = trackErrors(page);
  await page.goto('/mapa');
  const canvas = page.getByRole('img', { name: 'Mapa interactivo de conceptos' });
  const painted = () =>
    canvas.evaluate((element) => {
      const target = element as HTMLCanvasElement;
      const context = target.getContext('2d');
      if (!context) return 0;
      const data = context.getImageData(0, 0, target.width, target.height).data;
      let count = 0;
      for (let index = 3; index < data.length; index += 4) if (data[index]) count += 1;
      return count;
    });
  await expect.poll(painted).toBeGreaterThan(0);
  await page.getByRole('radio', { name: 'Por módulos' }).click();
  await expect.poll(painted).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
