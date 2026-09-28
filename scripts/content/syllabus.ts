import type { Level } from '../../src/content/schema.ts';
import { conceptIdFromName, normalizeText } from '../../src/lib/format/text.ts';

export interface SyllabusConcept {
  id: string;
  titulo: string;
  modulo: number;
  submodulo: string;
  orden: number;
  nivel: Level;
}

export interface SyllabusReference {
  submodulo: string;
  titulo: string;
  target: string;
}

export interface SyllabusSubmodule {
  clave: string;
  titulo: string;
  niveles: Level[];
}

export interface Syllabus {
  modules: { numero: number; titulo: string }[];
  submodules: SyllabusSubmodule[];
  concepts: SyllabusConcept[];
  references: SyllabusReference[];
}

const LEVEL_WORDS: Record<string, Level> = {
  basico: 'basico',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
};

function parseLevels(text: string): Level[] {
  return normalizeText(text)
    .split(/\s+a\s+|\s+/)
    .map((word) => LEVEL_WORDS[word])
    .filter((level): level is Level => level !== undefined);
}

/**
 * Parses the syllabus outline: "## Módulo N. Title", "### N.M Title",
 * "Nivel: ..." and one "- Concept [Level]" line per concept. Lines with
 * "(ref: X)" point to a concept defined elsewhere and create no entry.
 */
export function parseSyllabus(text: string): Syllabus {
  const syllabus: Syllabus = { modules: [], submodules: [], concepts: [], references: [] };
  let currentModule: number | null = null;
  let currentSubmodule: SyllabusSubmodule | null = null;
  let order = 0;
  const usedIds = new Set<string>();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    const moduleMatch = /^## M[oó]dulo (\d+)\.\s+(.+)$/.exec(line);
    if (moduleMatch) {
      currentModule = Number(moduleMatch[1]);
      syllabus.modules.push({ numero: currentModule, titulo: (moduleMatch[2] ?? '').trim() });
      currentSubmodule = null;
      continue;
    }
    if (line.startsWith('## ')) {
      currentModule = null;
      currentSubmodule = null;
      continue;
    }
    const submoduleMatch = /^### (\d+\.\d+)\s+(.+)$/.exec(line);
    if (submoduleMatch && currentModule !== null) {
      currentSubmodule = {
        clave: submoduleMatch[1] ?? '',
        titulo: (submoduleMatch[2] ?? '').trim(),
        niveles: [],
      };
      syllabus.submodules.push(currentSubmodule);
      order = 0;
      continue;
    }
    if (!currentSubmodule || currentModule === null) continue;
    const levelMatch = /^Nivel:\s*(.+)$/.exec(line);
    if (levelMatch) {
      currentSubmodule.niveles = parseLevels(levelMatch[1] ?? '');
      continue;
    }
    if (!line.startsWith('- ')) continue;
    let name = line.slice(2).trim();
    const reference = /\(ref:\s*([^)]+(?:\([^)]*\))?[^)]*)\)\s*$/.exec(name);
    if (reference) {
      syllabus.references.push({
        submodulo: currentSubmodule.clave,
        titulo: name.slice(0, reference.index).trim(),
        target: (reference[1] ?? '').trim(),
      });
      continue;
    }
    let nivel: Level = currentSubmodule.niveles[0] ?? 'basico';
    const marker = /\s*\[(B[aá]sico|Intermedio|Avanzado)\]\s*$/i.exec(name);
    if (marker) {
      nivel = LEVEL_WORDS[normalizeText(marker[1] ?? '')] ?? nivel;
      name = name.slice(0, marker.index).trim();
    }
    order += 1;
    let id = conceptIdFromName(name);
    if (usedIds.has(id)) {
      id = `${id}-${currentSubmodule.clave.replace('.', '-')}`;
    }
    usedIds.add(id);
    syllabus.concepts.push({
      id,
      titulo: name,
      modulo: currentModule,
      submodulo: currentSubmodule.clave,
      orden: order,
      nivel,
    });
  }
  return syllabus;
}

/** Resolves a "(ref: Title)" target to the id of the concept with that title. */
export function resolveReference(syllabus: Syllabus, target: string): string | null {
  const normalized = normalizeText(target);
  const exact = syllabus.concepts.find((concept) => normalizeText(concept.titulo) === normalized);
  if (exact) return exact.id;
  const byId = conceptIdFromName(target);
  const sameId = syllabus.concepts.find((concept) => concept.id === byId);
  if (sameId) return sameId.id;
  // Acronym references such as "GEV" match the parenthetical of the full title.
  const acronym = syllabus.concepts.find((concept) =>
    normalizeText(concept.titulo).includes(`(${normalized})`),
  );
  return acronym?.id ?? null;
}
