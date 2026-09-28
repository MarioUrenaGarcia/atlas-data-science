import { expect, test } from '@playwright/test';

test('la página de inicio muestra el nombre del Atlas', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Atlas de Data Science');
  expect(errors).toEqual([]);
});
