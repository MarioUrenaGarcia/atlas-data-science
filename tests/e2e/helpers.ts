import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

interface GraphNode {
  id: string;
  titulo: string;
  modulo: number;
  submodulo: string;
  prerrequisitos: string[];
  componente: string;
  contenido: string;
}

/** Concepts in the generated content, read from disk so tests adapt as content grows. */
export function generatedConcepts(): GraphNode[] {
  const file = join(import.meta.dirname, '..', '..', 'src', 'generated', 'graph.json');
  if (!existsSync(file)) return [];
  return (JSON.parse(readFileSync(file, 'utf8')) as { nodes: GraphNode[] }).nodes;
}

/** For each visualization used only inside the text of a concept, one concept page that shows it. */
export function figureComponents(): Map<string, string> {
  const folder = join(import.meta.dirname, '..', '..', 'src', 'generated', 'concepts');
  const result = new Map<string, string>();
  if (!existsSync(folder)) return result;
  // Syllabus order keeps the chosen page stable as content grows.
  for (const { id, contenido } of generatedConcepts()) {
    const file = join(folder, contenido);
    if (!existsSync(file)) continue;
    const concept = JSON.parse(readFileSync(file, 'utf8')) as {
      figuras?: { componente: string }[];
    };
    for (const figure of concept.figuras ?? []) {
      if (!result.has(figure.componente)) result.set(figure.componente, id);
    }
  }
  return result;
}

/**
 * Waits until every visualization of a concept page has mounted. Each figure is
 * a lazy component that shows a loading status until its chunk arrives, and
 * they arrive in any order, so a locator such as "the first visualization" only
 * points to the main one once no loading status is left.
 */
export async function waitForVisualizations(page: Page): Promise<void> {
  await expect(page.locator('figure').first()).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('status').filter({ hasText: 'Cargando' }),
  ).toHaveCount(0);
}

/** Collects console errors and uncaught exceptions for the lifetime of the page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  return errors;
}

export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}
