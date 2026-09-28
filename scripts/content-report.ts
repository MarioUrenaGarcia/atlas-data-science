import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONTENT_ROOT } from './content/pipeline.ts';
import { loadContent } from './content/load.ts';
import { parseSyllabus, resolveReference } from './content/syllabus.ts';

// The syllabus outline is a working document outside the repository; its path
// comes from the first argument or from ATLAS_SYLLABUS.
const args = process.argv.slice(2);
const jsonIndex = args.indexOf('--json');
const jsonTarget = jsonIndex >= 0 ? args[jsonIndex + 1] : undefined;
const showMissing = args.includes('--faltantes');
const positional = args.filter(
  (arg, index) => !arg.startsWith('--') && (jsonIndex < 0 || index !== jsonIndex + 1),
);
const syllabusPath = positional[0] ?? process.env.ATLAS_SYLLABUS;

if (!syllabusPath || !existsSync(syllabusPath)) {
  console.log('Sin temario de referencia: se omite el reporte de cobertura.');
  process.exit(0);
}

const syllabus = parseSyllabus(readFileSync(resolve(syllabusPath), 'utf8'));
const content = loadContent(CONTENT_ROOT);
const existing = new Map<string, boolean>();
for (const file of content.concepts) {
  const id = typeof file.data.id === 'string' ? file.data.id : null;
  if (id) existing.set(id, file.data.publicado === true);
}

if (jsonTarget) {
  const references = syllabus.references.map((reference) => ({
    ...reference,
    id: resolveReference(syllabus, reference.target),
  }));
  writeFileSync(jsonTarget, JSON.stringify({ ...syllabus, references }, null, 2), 'utf8');
  console.log(`Temario exportado a ${jsonTarget}.`);
}

let totalPublished = 0;
let totalExisting = 0;
console.log('Módulo  Conceptos  Existentes  Publicados');
for (const module of syllabus.modules) {
  const concepts = syllabus.concepts.filter((concept) => concept.modulo === module.numero);
  const present = concepts.filter((concept) => existing.has(concept.id)).length;
  const published = concepts.filter((concept) => existing.get(concept.id) === true).length;
  totalExisting += present;
  totalPublished += published;
  console.log(
    `${String(module.numero).padStart(6)}  ${String(concepts.length).padStart(9)}  ${String(present).padStart(10)}  ${String(published).padStart(10)}  ${module.titulo}`,
  );
}
const total = syllabus.concepts.length;
const percent = total === 0 ? 0 : (100 * totalPublished) / total;
console.log(
  `\nTotal: ${total} conceptos, ${totalExisting} con ficha, ${totalPublished} publicados (${percent.toFixed(1)} %).`,
);

const unresolved = syllabus.references.filter(
  (reference) => !resolveReference(syllabus, reference.target),
);
for (const reference of unresolved) {
  console.warn(`Referencia sin destino en ${reference.submodulo}: ${reference.target}`);
}

const extra = [...existing.keys()].filter(
  (id) => !syllabus.concepts.some((concept) => concept.id === id),
);
if (extra.length > 0) {
  console.warn(`\nFichas que no corresponden a ningún concepto del temario: ${extra.join(', ')}`);
}

if (showMissing) {
  const missing = syllabus.concepts.filter((concept) => existing.get(concept.id) !== true);
  console.log(`\nConceptos sin publicar (${missing.length}):`);
  for (const concept of missing) console.log(`  ${concept.submodulo}  ${concept.id}`);
}
