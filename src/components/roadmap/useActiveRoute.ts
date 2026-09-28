import { strings } from '../../app/strings.ts';
import { useAtlas, useRoutesData } from '../../content/loader.ts';
import type { ConceptNode } from '../../content/types.ts';
import { useProgress, type ActiveRoute } from '../../store/progress.ts';
import { computeRoadmap } from './computeRoadmap.ts';

export interface ActiveRouteSummary {
  title: string;
  link: string;
  concepts: string[];
  mastered: number;
  next: ConceptNode | null;
}

function useRouteConcepts(
  active: ActiveRoute,
): { title: string; link: string; concepts: string[] } | null {
  const atlas = useAtlas();
  const routes = useRoutesData();
  if (active.tipo === 'ruta') {
    const route = routes.routes.find((candidate) => candidate.id === active.id);
    if (!route) return null;
    return { title: route.titulo, link: `/rutas/${route.id}`, concepts: route.conceptos };
  }
  const target = atlas.byId.get(active.objetivo);
  if (!target) return null;
  const query = active.desde ? `?desde=${encodeURIComponent(active.desde)}` : '';
  return {
    title: strings.roadmap.title(target.titulo),
    link: `/roadmap/${target.id}${query}`,
    concepts: computeRoadmap(atlas, target.id, { from: active.desde }),
  };
}

/** Summary of the active route: its concepts, how many are mastered and the next one to study. */
export function useActiveRouteSummary(active: ActiveRoute): ActiveRouteSummary | null {
  const atlas = useAtlas();
  const statuses = useProgress((state) => state.conceptos);
  const route = useRouteConcepts(active);
  if (!route) return null;
  const mastered = route.concepts.filter((id) => statuses[id] === 'dominado').length;
  const nextId = route.concepts.find((id) => statuses[id] !== 'dominado');
  return { ...route, mastered, next: nextId ? (atlas.byId.get(nextId) ?? null) : null };
}
