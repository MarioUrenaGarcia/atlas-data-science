import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { VisualizationProps } from './types.ts';

type VisualizationModule = { default: ComponentType<VisualizationProps> };
type LazyVisualization = LazyExoticComponent<ComponentType<VisualizationProps>>;

// Each visualization lives in <kind>/<Name>/<Name>.tsx; helper files in the same
// folder are excluded by requiring the file name to match the folder name.
const loaders = import.meta.glob<VisualizationModule>(['./archetypes/*/*.tsx', './custom/*/*.tsx']);

/**
 * Lazy components are created once at module load: React.lazy does not fetch
 * anything until the component renders, and stable identities keep React from
 * remounting a visualization on every parent render.
 */
export const VISUALIZATIONS: Readonly<Record<string, LazyVisualization>> = Object.fromEntries(
  Object.entries(loaders).flatMap(([path, loader]) => {
    const [, folder, file] = /\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\.tsx$/.exec(path) ?? [];
    return folder && folder === file ? [[folder, lazy(loader)]] : [];
  }),
);

export function visualizationNames(): string[] {
  return Object.keys(VISUALIZATIONS).sort();
}
