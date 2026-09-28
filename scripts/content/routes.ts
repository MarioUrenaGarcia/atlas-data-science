import type {
  Level,
  ModuleDefinition,
  RouteDefinition,
  RouteSelector,
} from '../../src/content/schema.ts';
import type { ConceptNode, RoutesData } from '../../src/content/types.ts';
import { ancestors, topologicalOrder, type PrerequisiteGraph } from '../../src/lib/graph/index.ts';

function submoduleValue(key: string): number {
  const [major, minor] = key.split('.').map(Number);
  return (major ?? 0) * 100 + (minor ?? 0);
}

export function conceptOrder(nodes: readonly ConceptNode[]): (a: string, b: string) => number {
  const position = new Map<string, number>();
  [...nodes]
    .sort(
      (a, b) =>
        submoduleValue(a.submodulo) - submoduleValue(b.submodulo) ||
        a.orden - b.orden ||
        a.id.localeCompare(b.id),
    )
    .forEach((node, index) => position.set(node.id, index));
  return (a, b) => (position.get(a) ?? 0) - (position.get(b) ?? 0);
}

/**
 * Expands each route into an ordered concept list: selectors pick concepts,
 * every transitive prerequisite is added, and the result is sorted
 * topologically with syllabus order as the tie breaker.
 */
export function expandRoutes(
  definitions: readonly RouteDefinition[],
  modules: readonly ModuleDefinition[],
  nodes: readonly ConceptNode[],
  graph: PrerequisiteGraph,
  report: (message: string, pending: boolean) => void,
): RoutesData {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const submoduleKeys = new Set(modules.flatMap((module) => module.submodulos.map((s) => s.clave)));
  const moduleNumbers = new Set(modules.map((module) => module.numero));
  const compare = conceptOrder(nodes);

  const matchesLevel = (node: ConceptNode, levels?: Level[]) =>
    !levels || levels.includes(node.nivel);

  function select(selector: RouteSelector, routeId: string, stack: string[]): Set<string> {
    if ('ruta' in selector) {
      const nested = definitionsById.get(selector.ruta);
      if (!nested) {
        report(`la ruta ${routeId} incluye una ruta inexistente: ${selector.ruta}`, false);
        return new Set();
      }
      if (stack.includes(selector.ruta)) {
        report(`las rutas forman un ciclo: ${[...stack, selector.ruta].join(' > ')}`, false);
        return new Set();
      }
      const selected = selectRoute(nested, [...stack, selector.ruta]);
      if (!selector.hasta_submodulo) return selected;
      const limit = submoduleValue(selector.hasta_submodulo);
      return new Set(
        [...selected].filter((id) => submoduleValue(byId.get(id)?.submodulo ?? '99.99') <= limit),
      );
    }
    if ('modulo' in selector) {
      if (!moduleNumbers.has(selector.modulo)) {
        report(`la ruta ${routeId} incluye un módulo inexistente: ${selector.modulo}`, false);
      }
      return new Set(
        nodes
          .filter((node) => node.modulo === selector.modulo && matchesLevel(node, selector.niveles))
          .map((node) => node.id),
      );
    }
    if ('submodulo' in selector) {
      if (!submoduleKeys.has(selector.submodulo)) {
        report(`la ruta ${routeId} incluye un submódulo inexistente: ${selector.submodulo}`, false);
      }
      let limit = Number.POSITIVE_INFINITY;
      if (selector.hasta) {
        const last = byId.get(selector.hasta);
        if (last) {
          limit = last.orden;
        } else {
          report(
            `la ruta ${routeId} corta el submódulo ${selector.submodulo} en un concepto que aún no existe: ${selector.hasta}`,
            true,
          );
        }
      }
      return new Set(
        nodes
          .filter(
            (node) =>
              node.submodulo === selector.submodulo &&
              node.orden <= limit &&
              matchesLevel(node, selector.niveles),
          )
          .map((node) => node.id),
      );
    }
    if (!byId.has(selector.concepto)) {
      report(
        `la ruta ${routeId} incluye un concepto que aún no existe: ${selector.concepto}`,
        true,
      );
      return new Set();
    }
    return new Set([selector.concepto]);
  }

  function selectRoute(definition: RouteDefinition, stack: string[]): Set<string> {
    const selected = new Set<string>();
    for (const selector of definition.incluye) {
      for (const id of select(selector, definition.id, stack)) selected.add(id);
    }
    return selected;
  }

  const ids = definitions.map((definition) => definition.id);
  if (new Set(ids).size !== ids.length) report('hay identificadores de ruta repetidos', false);

  return {
    routes: definitions.map((definition) => {
      const selected = selectRoute(definition, [definition.id]);
      const closure = new Set(selected);
      for (const id of selected) {
        for (const ancestor of ancestors(graph, id)) closure.add(ancestor);
      }
      return {
        id: definition.id,
        titulo: definition.titulo,
        descripcion: definition.descripcion.trim(),
        perfil: definition.perfil,
        conceptos: topologicalOrder(graph, closure, compare),
      };
    }),
  };
}
