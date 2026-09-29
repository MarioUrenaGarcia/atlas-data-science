import MiniSearch from 'minisearch';
import type { z } from 'zod';
import {
  conceptFrontmatterSchema,
  LIMITS,
  modulesFileSchema,
  notationFileSchema,
  routesFileSchema,
  SECTION_TITLES,
  synonymsFileSchema,
  type ConceptFrontmatter,
  type ModuleDefinition,
  type NotationFile,
  type RouteDefinition,
} from '../../src/content/schema.ts';
import type {
  ConceptContent,
  ConceptNode,
  GraphData,
  MapLayoutData,
  ModuleContentFile,
  ModulesData,
  NotationData,
  RoutesData,
  SearchData,
} from '../../src/content/types.ts';
import {
  ancestors,
  buildGraph,
  depths,
  descendants,
  findCycle,
  redundantPrerequisites,
  type PrerequisiteGraph,
} from '../../src/lib/graph/index.ts';
import { INDEX_OPTIONS, type SearchDocument } from '../../src/lib/search/config.ts';
import { fileStem, type RawConceptFile, type RawContent } from './load.ts';
import { processConceptBody, renderFormula, type ProcessedBody } from './markdown.ts';
import { computeMapLayout } from './mapLayout.ts';
import { expandRoutes } from './routes.ts';
import type { VisualizationCatalog } from './visualizations.ts';

export type IssueLevel = 'error' | 'warning';

export interface Issue {
  level: IssueLevel;
  file?: string;
  line?: number;
  message: string;
  /** Reference to a concept that has not been written yet; expected while content grows. */
  pending?: boolean;
}

export interface CompileOptions {
  /** Excludes drafts and fails when a published concept depends on a draft. */
  production: boolean;
  /** Turns warnings about references to concepts not written yet into errors. */
  strict: boolean;
  visualizations: VisualizationCatalog;
}

export interface CompiledContent {
  graph: GraphData;
  modules: ModulesData;
  routes: RoutesData;
  notation: NotationData;
  search: SearchData;
  moduleContents: ModuleContentFile[];
  mapLayout: MapLayoutData;
}

export interface CompileResult {
  issues: Issue[];
  output: CompiledContent | null;
  stats: { concepts: number; published: number; drafts: number };
}

interface ParsedConcept {
  file: RawConceptFile;
  meta: ConceptFrontmatter;
  body: ProcessedBody;
  formulaHtml: string | null;
}

function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(raíz)';
    return `${path}: ${issue.message}`;
  });
}

export function submoduleSortKey(key: string): [number, number] {
  const [major, minor] = key.split('.').map(Number);
  return [major ?? 0, minor ?? 0];
}

export function compareConcepts(a: ConceptFrontmatter, b: ConceptFrontmatter): number {
  const [aMajor, aMinor] = submoduleSortKey(a.submodulo);
  const [bMajor, bMinor] = submoduleSortKey(b.submodulo);
  return aMajor - bMajor || aMinor - bMinor || a.orden - b.orden || a.id.localeCompare(b.id);
}

/** Folder names are `NN-slug/N.M-slug`, which keeps the tree sorted in syllabus order. */
function checkLocation(file: RawConceptFile, meta: ConceptFrontmatter, issues: Issue[]) {
  const parts = file.path.split('/');
  if (parts.length !== 4 || parts[0] !== 'conceptos') {
    issues.push({
      level: 'error',
      file: file.path,
      message: 'la ficha debe estar en conceptos/<modulo>/<submodulo>/<id>.md',
    });
    return;
  }
  const moduleFolder = parts[1] ?? '';
  const submoduleFolder = parts[2] ?? '';
  if (!moduleFolder.startsWith(`${String(meta.modulo).padStart(2, '0')}-`)) {
    issues.push({
      level: 'error',
      file: file.path,
      message: `la carpeta ${moduleFolder} no corresponde al módulo ${meta.modulo}`,
    });
  }
  if (!submoduleFolder.startsWith(`${meta.submodulo}-`)) {
    issues.push({
      level: 'error',
      file: file.path,
      message: `la carpeta ${submoduleFolder} no corresponde al submódulo ${meta.submodulo}`,
    });
  }
}

function checkBody(parsed: ParsedConcept, issues: Issue[]) {
  const { file, body } = parsed;
  const lineOf = (line?: number) => (line === undefined ? undefined : line + file.bodyLineOffset);
  for (const issue of body.issues) {
    issues.push({
      level: 'error',
      file: file.path,
      line: lineOf(issue.line),
      message: issue.message,
    });
  }
  const expected = [...SECTION_TITLES] as string[];
  const actual = body.headingTitles;
  const sameStructure =
    actual.length === expected.length && actual.every((title, index) => title === expected[index]);
  if (!sameStructure) {
    const missing = expected.filter((title) => !actual.includes(title));
    const extra = actual.filter((title) => !expected.includes(title));
    const details = [
      missing.length > 0 ? `faltan: ${missing.join(', ')}` : '',
      extra.length > 0 ? `sobran: ${extra.join(', ')}` : '',
      missing.length === 0 && extra.length === 0 ? 'orden incorrecto o secciones repetidas' : '',
    ]
      .filter(Boolean)
      .join('; ');
    issues.push({
      level: 'error',
      file: file.path,
      message: `las secciones deben ser exactamente: ${expected.join(' > ')} (${details})`,
    });
  }
  const limits: [string, { min: number; max: number }][] = [
    ['Intuición', LIMITS.intuitionWords],
    ['Cómo usar la visualización', LIMITS.visualizationGuideWords],
  ];
  for (const [title, range] of limits) {
    const words = body.wordCounts[title];
    if (words === undefined) continue;
    if (words < range.min || words > range.max) {
      issues.push({
        level: 'error',
        file: file.path,
        message: `la sección "${title}" tiene ${words} palabras; debe tener entre ${range.min} y ${range.max}`,
      });
    }
  }
  for (const title of SECTION_TITLES) {
    if (body.headingTitles.includes(title) && (body.wordCounts[title] ?? 0) === 0) {
      const hasContent = body.sections.some(
        (section) => section.titulo === title && section.html.length > 0,
      );
      if (!hasContent) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `la sección "${title}" está vacía`,
        });
      }
    }
  }
}

function checkComponent(
  componente: string,
  parametros: unknown,
  file: string,
  line: number | undefined,
  what: string,
  catalog: VisualizationCatalog,
  issues: Issue[],
) {
  const entry = catalog.get(componente);
  if (!entry) {
    issues.push({
      level: 'error',
      file,
      line,
      message: `la visualización "${componente}" no existe en el registro`,
    });
    return;
  }
  if (entry.schema) {
    const result = entry.schema.safeParse(parametros);
    if (!result.success) {
      for (const message of formatZodIssues(result.error)) {
        issues.push({ level: 'error', file, line, message: `${what}${componente}: ${message}` });
      }
    }
  }
}

function checkVisualization(parsed: ParsedConcept, catalog: VisualizationCatalog, issues: Issue[]) {
  const { componente, parametros } = parsed.meta.visualizacion;
  checkComponent(
    componente,
    parametros,
    parsed.file.path,
    undefined,
    'parámetros de ',
    catalog,
    issues,
  );
  for (const figure of parsed.body.figures) {
    if (!figure.componente) continue;
    checkComponent(
      figure.componente,
      figure.parametros,
      parsed.file.path,
      figure.line,
      'parámetros de la figura ',
      catalog,
      issues,
    );
  }
}

function parseConcepts(
  raw: RawContent,
  macros: Record<string, string>,
  issues: Issue[],
): ParsedConcept[] {
  const parsed: ParsedConcept[] = [];
  for (const file of raw.concepts) {
    if (file.parseError) {
      issues.push({
        level: 'error',
        file: file.path,
        message: `frontmatter ilegible: ${file.parseError}`,
      });
      continue;
    }
    const result = conceptFrontmatterSchema.safeParse(file.data);
    if (!result.success) {
      for (const message of formatZodIssues(result.error)) {
        issues.push({ level: 'error', file: file.path, message });
      }
      continue;
    }
    const meta = result.data;
    if (meta.id !== fileStem(file.path)) {
      issues.push({
        level: 'error',
        file: file.path,
        message: `el id "${meta.id}" no coincide con el nombre del archivo`,
      });
    }
    let formulaHtml: string | null = null;
    if (meta.formula) {
      const rendered = renderFormula(meta.formula, macros);
      if ('error' in rendered) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `fórmula inválida: ${rendered.error}`,
        });
      } else {
        formulaHtml = rendered.html;
      }
    }
    const body = processConceptBody(file.body, macros);
    parsed.push({ file, meta, body, formulaHtml });
  }
  return parsed;
}

function checkReferences(
  concepts: ParsedConcept[],
  byId: Map<string, ParsedConcept>,
  graph: PrerequisiteGraph,
  issues: Issue[],
) {
  for (const concept of concepts) {
    const { meta, file } = concept;
    for (const prerequisite of meta.prerrequisitos) {
      const target = byId.get(prerequisite);
      if (!target) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `prerrequisito inexistente: ${prerequisite}`,
        });
        continue;
      }
      if (compareConcepts(target.meta, meta) > 0) {
        issues.push({
          level: 'warning',
          file: file.path,
          message: `el prerrequisito ${prerequisite} aparece después en el temario (${target.meta.submodulo}, orden ${target.meta.orden})`,
        });
      }
      if (meta.publicado && !target.meta.publicado) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `la ficha publicada depende de ${prerequisite}, que no está publicada`,
        });
      }
    }
    for (const redundant of redundantPrerequisites(graph, meta.id)) {
      issues.push({
        level: 'warning',
        file: file.path,
        message: `el prerrequisito ${redundant} ya está implicado por otro prerrequisito directo`,
      });
    }
    const relationIds = new Set<string>();
    for (const relation of meta.relaciones) {
      if (relation.id === meta.id) {
        issues.push({
          level: 'error',
          file: file.path,
          message: 'una relación apunta a la propia ficha',
        });
      }
      if (relationIds.has(relation.id)) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `relación duplicada con ${relation.id}`,
        });
      }
      relationIds.add(relation.id);
      const target = byId.get(relation.id);
      if (!target) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `relación hacia un id inexistente: ${relation.id}`,
        });
      } else if (meta.publicado && !target.meta.publicado) {
        issues.push({
          level: 'error',
          file: file.path,
          message: `la ficha publicada se relaciona con ${relation.id}, que no está publicada`,
        });
      }
    }
    for (const link of concept.body.links) {
      const target = byId.get(link.id);
      const line = link.line === undefined ? undefined : link.line + file.bodyLineOffset;
      if (!target) {
        issues.push({
          level: 'error',
          file: file.path,
          line,
          message: `enlace interno roto: [[${link.id}]]`,
        });
      } else if (meta.publicado && !target.meta.publicado) {
        issues.push({
          level: 'error',
          file: file.path,
          line,
          message: `enlace hacia ${link.id}, que no está publicada`,
        });
      }
    }
  }
}

function buildNotation(notation: NotationFile, issues: Issue[]): NotationData {
  return {
    convenciones: notation.convenciones,
    grupos: notation.grupos.map((group) => ({
      titulo: group.titulo,
      entradas: group.entradas.map((entry) => {
        const rendered = renderFormula(entry.notacion, notation.macros, false);
        if ('error' in rendered) {
          issues.push({
            level: 'error',
            file: 'notacion.yaml',
            message: `notación inválida para "${entry.objeto}": ${rendered.error}`,
          });
        }
        return {
          objeto: entry.objeto,
          notacionHtml: 'html' in rendered ? rendered.html : '',
          ...(entry.nota ? { nota: entry.nota } : {}),
        };
      }),
    })),
  };
}

function checkModules(
  modules: ModuleDefinition[],
  concepts: ParsedConcept[],
  knownIds: Set<string>,
  options: CompileOptions,
  issues: Issue[],
) {
  const referenceLevel: 'error' | 'warning' = options.strict ? 'error' : 'warning';
  const numbers = modules.map((module) => module.numero);
  if (new Set(numbers).size !== numbers.length) {
    issues.push({
      level: 'error',
      file: 'modulos.yaml',
      message: 'hay números de módulo repetidos',
    });
  }
  const submoduleKeys = new Set<string>();
  for (const module of modules) {
    if (!knownIds.has(module.portada)) {
      issues.push({
        level: referenceLevel,
        pending: true,
        file: 'modulos.yaml',
        message: `la portada del módulo ${module.numero} apunta a un concepto que aún no existe: ${module.portada}`,
      });
    }
    for (const submodule of module.submodulos) {
      if (submoduleKeys.has(submodule.clave)) {
        issues.push({
          level: 'error',
          file: 'modulos.yaml',
          message: `submódulo repetido: ${submodule.clave}`,
        });
      }
      submoduleKeys.add(submodule.clave);
      if (submoduleSortKey(submodule.clave)[0] !== module.numero) {
        issues.push({
          level: 'error',
          file: 'modulos.yaml',
          message: `el submódulo ${submodule.clave} está dentro del módulo ${module.numero}`,
        });
      }
      for (const link of submodule.enlaces) {
        if (!knownIds.has(link)) {
          issues.push({
            level: referenceLevel,
            pending: true,
            file: 'modulos.yaml',
            message: `el submódulo ${submodule.clave} enlaza un concepto que aún no existe: ${link}`,
          });
        }
      }
    }
  }
  const orderKeys = new Map<string, string>();
  for (const { meta, file } of concepts) {
    if (!submoduleKeys.has(meta.submodulo)) {
      issues.push({
        level: 'error',
        file: file.path,
        message: `submódulo desconocido: ${meta.submodulo}`,
      });
    }
    const key = `${meta.submodulo}#${meta.orden}`;
    const previous = orderKeys.get(key);
    if (previous) {
      issues.push({
        level: 'error',
        file: file.path,
        message: `el orden ${meta.orden} del submódulo ${meta.submodulo} ya lo usa ${previous}`,
      });
    }
    orderKeys.set(key, meta.id);
  }
}

function buildSearch(
  nodes: ConceptNode[],
  concepts: Map<string, ParsedConcept>,
  synonyms: string[][],
): SearchData {
  const index = new MiniSearch<SearchDocument>(INDEX_OPTIONS);
  index.addAll(
    nodes.map((node) => {
      const body = concepts.get(node.id)?.body;
      return {
        id: node.id,
        titulo: node.titulo,
        alias: node.alias.join(' '),
        titulo_en: node.titulo_en,
        etiquetas: node.etiquetas.join(' '),
        resumen: node.resumen,
        texto: [body?.plainText['Intuición'] ?? '', body?.plainText['Definición'] ?? ''].join(' '),
      };
    }),
  );
  return { index: index.toJSON(), synonyms };
}

export function compileContent(raw: RawContent, options: CompileOptions): CompileResult {
  const issues: Issue[] = [];
  for (const missing of raw.missingFiles) {
    issues.push({ level: 'error', file: missing, message: 'archivo obligatorio ausente' });
  }

  const modulesResult = modulesFileSchema.safeParse(raw.modules);
  const routesResult = routesFileSchema.safeParse(raw.routes);
  const notationResult = notationFileSchema.safeParse(raw.notation);
  const synonymsResult = synonymsFileSchema.safeParse(raw.synonyms);
  const globalFiles: [string, { success: boolean; error?: z.ZodError }, unknown][] = [
    ['modulos.yaml', modulesResult, raw.modules],
    ['rutas.yaml', routesResult, raw.routes],
    ['notacion.yaml', notationResult, raw.notation],
    ['sinonimos.yaml', synonymsResult, raw.synonyms],
  ];
  for (const [file, result, value] of globalFiles) {
    if (!result.success && value !== undefined && result.error) {
      for (const message of formatZodIssues(result.error)) {
        issues.push({ level: 'error', file, message });
      }
    }
  }

  const macros = notationResult.success ? notationResult.data.macros : {};
  const parsed = parseConcepts(raw, macros, issues);

  const byId = new Map<string, ParsedConcept>();
  for (const concept of parsed) {
    const existing = byId.get(concept.meta.id);
    if (existing) {
      issues.push({
        level: 'error',
        file: concept.file.path,
        message: `id duplicado "${concept.meta.id}", también en ${existing.file.path}`,
      });
      continue;
    }
    byId.set(concept.meta.id, concept);
    checkLocation(concept.file, concept.meta, issues);
    checkBody(concept, issues);
    checkVisualization(concept, options.visualizations, issues);
  }

  const all = [...byId.values()].sort((a, b) => compareConcepts(a.meta, b.meta));
  const fullGraph = buildGraph(
    all.map((c) => ({ id: c.meta.id, prerequisites: c.meta.prerrequisitos })),
  );
  const cycle = findCycle(fullGraph);
  if (cycle) {
    issues.push({ level: 'error', message: `ciclo de prerrequisitos: ${cycle.join(' > ')}` });
  }
  checkReferences(all, byId, fullGraph, issues);

  const knownIds = new Set(byId.keys());
  if (modulesResult.success) {
    checkModules(modulesResult.data.modulos, all, knownIds, options, issues);
  }

  const notation = notationResult.success ? buildNotation(notationResult.data, issues) : null;
  const hasErrors = issues.some((issue) => issue.level === 'error');
  const stats = {
    concepts: all.length,
    published: all.filter((c) => c.meta.publicado).length,
    drafts: all.filter((c) => !c.meta.publicado).length,
  };
  if (
    hasErrors ||
    cycle ||
    !modulesResult.success ||
    !routesResult.success ||
    !notation ||
    !synonymsResult.success
  ) {
    return { issues, output: null, stats };
  }

  const included = options.production ? all.filter((c) => c.meta.publicado) : all;
  const graph = buildGraph(
    included.map((c) => ({ id: c.meta.id, prerequisites: c.meta.prerrequisitos })),
  );
  const depthById = depths(graph);
  const nodes: ConceptNode[] = included.map(({ meta }) => ({
    id: meta.id,
    titulo: meta.titulo,
    titulo_en: meta.titulo_en,
    alias: meta.alias,
    modulo: meta.modulo,
    submodulo: meta.submodulo,
    orden: meta.orden,
    nivel: meta.nivel,
    resumen: meta.resumen.trim(),
    etiquetas: meta.etiquetas,
    prerrequisitos: meta.prerrequisitos,
    relaciones: meta.relaciones,
    dependientes: graph.dependents.get(meta.id) ?? [],
    profundidad: depthById.get(meta.id) ?? 0,
    ancestros: ancestors(graph, meta.id).size,
    descendientes: descendants(graph, meta.id).size,
    componente: meta.visualizacion.componente,
    borrador: !meta.publicado,
  }));
  const includedIds = new Set(nodes.map((node) => node.id));

  const routeIssues: Issue[] = [];
  const routes = expandRoutes(
    routesResult.data.rutas as RouteDefinition[],
    modulesResult.data.modulos,
    nodes,
    graph,
    (message, pending) =>
      routeIssues.push({
        level: options.strict || !pending ? 'error' : 'warning',
        file: 'rutas.yaml',
        message,
        pending,
      }),
  );
  issues.push(...routeIssues);

  const modules: ModulesData = {
    modules: modulesResult.data.modulos.map((module) => ({
      numero: module.numero,
      clave: module.clave,
      titulo: module.titulo,
      descripcion: module.descripcion.trim(),
      portada: includedIds.has(module.portada) ? module.portada : null,
      submodulos: module.submodulos.map((submodule) => ({
        clave: submodule.clave,
        titulo: submodule.titulo,
        nivel: submodule.nivel,
        descripcion: submodule.descripcion.trim(),
        conceptos: nodes
          .filter((node) => node.submodulo === submodule.clave)
          .map((node) => node.id),
        enlaces: submodule.enlaces.filter((id) => includedIds.has(id)),
      })),
    })),
  };

  const moduleContents = modules.modules.map((module) => {
    const concepts: Record<string, ConceptContent> = {};
    for (const concept of included.filter((c) => c.meta.modulo === module.numero)) {
      concepts[concept.meta.id] = {
        id: concept.meta.id,
        formulaHtml: concept.formulaHtml,
        sections: concept.body.sections,
        figuras: concept.body.figures.map(({ componente, parametros }) => ({
          componente,
          parametros,
        })),
        visualizacion: concept.meta.visualizacion,
        referencias: concept.meta.referencias,
      };
    }
    return { modulo: module.numero, concepts };
  });

  const search = buildSearch(nodes, byId, synonymsResult.data.sinonimos);

  return {
    issues,
    stats,
    output: issues.some((issue) => issue.level === 'error')
      ? null
      : {
          graph: { nodes },
          modules,
          routes,
          notation,
          search,
          moduleContents,
          mapLayout: computeMapLayout(
            nodes,
            modules.modules.map((module) => module.numero),
          ),
        },
  };
}
