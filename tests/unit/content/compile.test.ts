import { join } from 'node:path';
import MiniSearch from 'minisearch';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { compileContent, type CompileResult } from '../../../scripts/content/compile.ts';
import { loadContent, type RawContent } from '../../../scripts/content/load.ts';
import type { VisualizationCatalog } from '../../../scripts/content/visualizations.ts';
import { INDEX_OPTIONS } from '../../../src/lib/search/config.ts';
import { expandQuery } from '../../../src/lib/search/synonyms.ts';

const FIXTURE = join(import.meta.dirname, '..', '..', 'fixtures', 'contenido-valido');

const catalog: VisualizationCatalog = new Map([
  [
    'FixtureViz',
    {
      name: 'FixtureViz',
      kind: 'archetypes',
      schema: z.object({ tamano: z.number().int().min(1).max(100).optional() }).strict(),
    },
  ],
]);

function load(): RawContent {
  return loadContent(FIXTURE);
}

function compile(raw: RawContent, production = true): CompileResult {
  return compileContent(raw, { production, strict: false, visualizations: catalog });
}

function errors(result: CompileResult): string[] {
  return result.issues.filter((issue) => issue.level === 'error').map((issue) => issue.message);
}

function conceptFile(raw: RawContent, id: string) {
  const file = raw.concepts.find((concept) => concept.data.id === id);
  if (!file) throw new Error(`fixture ${id} not found`);
  return file;
}

describe('compileContent with valid content', () => {
  const result = compile(load());

  it('reports no errors or warnings', () => {
    expect(result.issues).toEqual([]);
    expect(result.output).not.toBeNull();
  });

  it('builds graph metadata', () => {
    const nodes = result.output?.graph.nodes ?? [];
    expect(nodes.map((node) => node.id)).toEqual([
      'concepto-alfa',
      'concepto-beta',
      'concepto-gamma',
    ]);
    const alfa = nodes[0];
    expect(alfa?.dependientes).toEqual(['concepto-beta']);
    expect(alfa?.descendientes).toBe(2);
    expect(nodes[2]?.profundidad).toBe(2);
    expect(nodes[2]?.ancestros).toBe(2);
  });

  it('expands routes with the prerequisite closure in order', () => {
    const routes = result.output?.routes.routes ?? [];
    expect(routes[0]?.conceptos).toEqual(['concepto-alfa', 'concepto-beta', 'concepto-gamma']);
    expect(routes[1]?.conceptos).toEqual(routes[0]?.conceptos);
  });

  it('renders sections, directives, links and formulas', () => {
    const content = result.output?.moduleContents[0]?.concepts['concepto-gamma'];
    expect(content?.sections.map((section) => section.id)).toEqual([
      'intuicion',
      'definicion',
      'como-usar-la-visualizacion',
      'ejemplo',
      'propiedades',
      'errores-comunes',
      'conexiones',
    ]);
    const html = content?.sections.map((section) => section.html).join('\n') ?? '';
    expect(html).toContain('class="katex');
    expect(html).toContain('<math');
    expect(html).toContain('<details class="directive directive-demostracion">');
    expect(html).toContain('<summary class="directive-title">Demostración</summary>');
    expect(html).toContain('<aside class="directive directive-definicion">');
    expect(html).toContain('data-concept="concepto-alfa"');
    expect(html).toContain('href="/concepto/concepto-beta"');
    const alfa = result.output?.moduleContents[0]?.concepts['concepto-alfa'];
    expect(alfa?.formulaHtml).toContain('katex-display');
  });

  it('uses custom link labels', () => {
    const beta = result.output?.moduleContents[0]?.concepts['concepto-beta'];
    const connections = beta?.sections.find((section) => section.id === 'conexiones');
    expect(connections?.html).toContain('>el concepto alfa</a>');
  });

  it('renders the notation table', () => {
    expect(result.output?.notation.grupos[0]?.entradas[0]?.notacionHtml).toContain('katex');
  });

  it('builds a search index tolerant to accents, typos and synonyms', () => {
    const data = result.output?.search;
    expect(data).toBeDefined();
    const index = MiniSearch.loadJSON(JSON.stringify(data?.index), INDEX_OPTIONS);
    const top = (query: string) => index.search(query)[0]?.id;
    expect(top('alfa')).toBe('concepto-alfa');
    expect(top('ALFA')).toBe('concepto-alfa');
    expect(top('alpha concept')).toBe('concepto-alfa');
    expect(top('generalizacion')).toBe('concepto-gamma');
    expect(top('generalización')).toBe('concepto-gamma');
    expect(top('consepto gama')).toBe('concepto-gamma');
    expect(top('primer concepto')).toBe('concepto-alfa');
    const variants = expandQuery('CA', data?.synonyms ?? []);
    expect(variants).toContain('concepto alfa');
  });
});

describe('compileContent with invalid content', () => {
  it('rejects duplicated ids and ids that differ from the file name', () => {
    const raw = load();
    const beta = conceptFile(raw, 'concepto-beta');
    beta.data.id = 'concepto-alfa';
    beta.data.prerrequisitos = [];
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.includes('id duplicado'))).toBe(true);
    expect(messages.some((message) => message.includes('no coincide con el nombre'))).toBe(true);
  });

  it('rejects missing prerequisites and relations', () => {
    const raw = load();
    conceptFile(raw, 'concepto-beta').data.prerrequisitos = ['no-existe'];
    conceptFile(raw, 'concepto-gamma').data.relaciones = [{ tipo: 'relacionado', id: 'tampoco' }];
    const messages = errors(compile(raw));
    expect(messages).toContain('prerrequisito inexistente: no-existe');
    expect(messages).toContain('relación hacia un id inexistente: tampoco');
  });

  it('rejects prerequisite cycles', () => {
    const raw = load();
    conceptFile(raw, 'concepto-alfa').data.prerrequisitos = ['concepto-gamma'];
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.startsWith('ciclo de prerrequisitos'))).toBe(true);
  });

  it('rejects missing or reordered sections', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    file.body = file.body.replace('## Ejemplo', '## Ejemplos');
    const beta = conceptFile(raw, 'concepto-beta');
    const [before, after] = beta.body.split('## Errores comunes');
    beta.body =
      (before ?? '').replace('## Propiedades', '## Errores comunes') +
      '## Propiedades' +
      (after ?? '');
    const messages = errors(compile(raw));
    expect(
      messages.filter((message) => message.startsWith('las secciones deben ser')),
    ).toHaveLength(2);
  });

  it('enforces word limits', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    file.body = file.body.replace(/## Intuición\n\n[^\n]+/, '## Intuición\n\nDemasiado breve.');
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.includes('"Intuición" tiene 2 palabras'))).toBe(true);
  });

  it('rejects unknown visualizations and invalid parameters', () => {
    const raw = load();
    conceptFile(raw, 'concepto-alfa').data.visualizacion = { componente: 'NoExiste' };
    conceptFile(raw, 'concepto-beta').data.visualizacion = {
      componente: 'FixtureViz',
      parametros: { tamano: 1000 },
    };
    const messages = errors(compile(raw));
    expect(messages).toContain('la visualización "NoExiste" no existe en el registro');
    expect(messages.some((message) => message.startsWith('parámetros de FixtureViz: tamano'))).toBe(
      true,
    );
  });

  it('rejects LaTeX that KaTeX cannot render', () => {
    const raw = load();
    conceptFile(raw, 'concepto-alfa').data.formula = '\\frac{1}{';
    const beta = conceptFile(raw, 'concepto-beta');
    beta.body = beta.body.replace('## Ejemplo\n', '## Ejemplo\n\n$\\comandoinexistente{x}$\n');
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.startsWith('fórmula inválida'))).toBe(true);
    expect(messages.some((message) => message.startsWith('LaTeX inválido'))).toBe(true);
  });

  it('rejects broken internal links and unknown directives', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    file.body = file.body.replace(
      '## Ejemplo\n',
      '## Ejemplo\n\nVer [[perdido]].\n\n:::misterio\nTexto.\n:::\n',
    );
    const result = compile(raw);
    const messages = errors(result);
    expect(messages).toContain('enlace interno roto: [[perdido]]');
    expect(messages).toContain('directiva desconocida ":::misterio"');
    const broken = result.issues.find((issue) => issue.message.includes('[[perdido]]'));
    expect(broken?.line).toBeGreaterThan(20);
  });

  it('rejects bibliography keys outside the list and too many tags', () => {
    const raw = load();
    conceptFile(raw, 'concepto-alfa').data.referencias = [{ clave: 'libro-inventado' }];
    conceptFile(raw, 'concepto-beta').data.etiquetas = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
    ];
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.startsWith('referencias.0.clave'))).toBe(true);
    expect(messages.some((message) => message.startsWith('etiquetas'))).toBe(true);
  });

  it('fails when a published concept depends on a draft and excludes drafts in production', () => {
    const raw = load();
    conceptFile(raw, 'concepto-alfa').data.publicado = false;
    const messages = errors(compile(raw));
    expect(messages).toContain(
      'la ficha publicada depende de concepto-alfa, que no está publicada',
    );

    const onlyDraftLeaf = load();
    conceptFile(onlyDraftLeaf, 'concepto-gamma').data.publicado = false;
    const production = compile(onlyDraftLeaf, true);
    expect(production.output?.graph.nodes.map((node) => node.id)).toEqual([
      'concepto-alfa',
      'concepto-beta',
    ]);
    const development = compile(onlyDraftLeaf, false);
    expect(development.output?.graph.nodes).toHaveLength(3);
    expect(development.output?.graph.nodes[2]?.borrador).toBe(true);
  });

  it('reports inline text directives that would swallow text', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    file.body = file.body.replace('## Ejemplo\n', '## Ejemplo\n\nRazón:alta.\n');
    const messages = errors(compile(raw));
    expect(messages.some((message) => message.startsWith('directiva no permitida ":alta"'))).toBe(
      true,
    );
  });

  it('embeds figures and validates their parameters', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    const fence = '```';
    const figure = [
      ':::figura[Pie con $x$]{componente="FixtureViz"}',
      `${fence}yaml`,
      'tamano: 5',
      fence,
      ':::',
      '',
    ].join('\n');
    file.body = file.body.replace('## Ejemplo\n', `## Ejemplo\n\n${figure}\n`);
    const valid = compile(raw);
    expect(errors(valid)).toEqual([]);
    const content = valid.output?.moduleContents[0]?.concepts['concepto-alfa'];
    expect(content?.figuras).toEqual([{ componente: 'FixtureViz', parametros: { tamano: 5 } }]);
    const example = content?.sections.find((section) => section.titulo === 'Ejemplo');
    expect(example?.html).toContain(
      '<figure class="concept-figure" data-figura="0"><figcaption>Pie con',
    );

    file.body = file.body.replace('tamano: 5', 'tamano: 5000');
    const messages = errors(compile(raw));
    expect(
      messages.some((message) => message.startsWith('parámetros de la figura FixtureViz')),
    ).toBe(true);
  });

  it('rejects figures nested inside other blocks', () => {
    const raw = load();
    const file = conceptFile(raw, 'concepto-alfa');
    const nested = ['::::nota', ':::figura{componente="FixtureViz"}', ':::', '::::', ''].join('\n');
    file.body = file.body.replace('## Ejemplo\n', `## Ejemplo\n\n${nested}\n`);
    expect(errors(compile(raw))).toContain(
      'una figura debe estar al nivel principal de su sección',
    );
  });
});
