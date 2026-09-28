import type { BibliographyKey } from './bibliography.ts';
import type { Level, RelationType } from './schema.ts';

export type { Level, RelationType } from './schema.ts';

/** Concept metadata shared by the graph, the search and every listing page. */
export interface ConceptNode {
  id: string;
  titulo: string;
  titulo_en: string;
  alias: string[];
  modulo: number;
  submodulo: string;
  orden: number;
  nivel: Level;
  resumen: string;
  etiquetas: string[];
  prerrequisitos: string[];
  relaciones: { tipo: RelationType; id: string }[];
  /** Concepts that list this one as a direct prerequisite. */
  dependientes: string[];
  /** Longest prerequisite chain from a root concept. */
  profundidad: number;
  /** Number of transitive prerequisites. */
  ancestros: number;
  /** Number of concepts that transitively depend on this one. */
  descendientes: number;
  componente: string;
  /** True for drafts, which only exist in development builds. */
  borrador: boolean;
}

export interface GraphData {
  nodes: ConceptNode[];
}

export interface ConceptSection {
  id: string;
  titulo: string;
  html: string;
}

export interface ConceptContent {
  id: string;
  formulaHtml: string | null;
  sections: ConceptSection[];
  visualizacion: { componente: string; parametros: Record<string, unknown> };
  referencias: { clave: BibliographyKey; capitulo?: string }[];
}

export interface ModuleContentFile {
  modulo: number;
  concepts: Record<string, ConceptContent>;
}

export interface SubmoduleInfo {
  clave: string;
  titulo: string;
  nivel: Level[];
  descripcion: string;
  conceptos: string[];
  enlaces: string[];
}

export interface ModuleInfo {
  numero: number;
  clave: string;
  titulo: string;
  descripcion: string;
  portada: string | null;
  submodulos: SubmoduleInfo[];
}

export interface ModulesData {
  modules: ModuleInfo[];
}

export interface RouteInfo {
  id: string;
  titulo: string;
  descripcion: string;
  perfil: string;
  conceptos: string[];
}

export interface RoutesData {
  routes: RouteInfo[];
}

export interface NotationEntry {
  objeto: string;
  notacionHtml: string;
  nota?: string;
}

export interface NotationData {
  grupos: { titulo: string; entradas: NotationEntry[] }[];
  convenciones: string[];
}

export interface SearchData {
  /** Serialized MiniSearch index. */
  index: unknown;
  synonyms: string[][];
}
