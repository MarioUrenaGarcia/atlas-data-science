import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

interface GraphNode {
  id: string;
  titulo: string;
  modulo: number;
  prerrequisitos: string[];
  componente: string;
}

/** Concepts in the generated content, read from disk so tests adapt as content grows. */
export function generatedConcepts(): GraphNode[] {
  const file = join(import.meta.dirname, '..', '..', 'src', 'generated', 'graph.json');
  if (!existsSync(file)) return [];
  return (JSON.parse(readFileSync(file, 'utf8')) as { nodes: GraphNode[] }).nodes;
}

/** For each visualization used only inside the text of a concept, one concept page that shows it. */
export function figureComponents(): Map<string, string> {
  const folder = join(import.meta.dirname, '..', '..', 'src', 'generated', 'modules');
  const result = new Map<string, string>();
  if (!existsSync(folder)) return result;
  for (const file of readdirSync(folder)) {
    const data = JSON.parse(readFileSync(join(folder, file), 'utf8')) as {
      concepts: Record<string, { figuras?: { componente: string }[] }>;
    };
    for (const [id, concept] of Object.entries(data.concepts)) {
      for (const figure of concept.figuras ?? []) {
        if (!result.has(figure.componente)) result.set(figure.componente, id);
      }
    }
  }
  return result;
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
