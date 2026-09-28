import katex from 'katex';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Root as HastRoot } from 'hast';
import type { Heading, PhrasingContent, Root as MdastRoot, RootContent, Text } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { SECTION_TITLES } from '../../src/content/schema.ts';
import type { ConceptSection } from '../../src/content/types.ts';
import { countWords, slugify } from '../../src/lib/format/text.ts';

export const DIRECTIVES = {
  definicion: 'Definición',
  teorema: 'Teorema',
  demostracion: 'Demostración',
  advertencia: 'Advertencia',
  nota: 'Nota',
} as const;

type DirectiveName = keyof typeof DIRECTIVES;

const WIKI_LINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export interface MarkdownIssue {
  message: string;
  line?: number;
}

export interface ProcessedBody {
  sections: ConceptSection[];
  /** Section titles as they appear, in order, to validate structure. */
  headingTitles: string[];
  /** Word count of each section keyed by title. */
  wordCounts: Record<string, number>;
  /** Plain text of each section keyed by title, used by the search index. */
  plainText: Record<string, string>;
  links: { id: string; line?: number }[];
  issues: MarkdownIssue[];
}

function plainTextOf(nodes: readonly RootContent[]): string {
  const parts: string[] = [];
  for (const node of nodes) {
    visit(node, (child) => {
      if (child.type === 'text' || child.type === 'inlineCode') {
        parts.push((child as Text).value);
      }
    });
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function isDirectiveName(name: string): name is DirectiveName {
  return Object.hasOwn(DIRECTIVES, name);
}

/** Replaces [[id]] and [[id|label]] inside text nodes with links to concept pages. */
function remarkWikiLinks(links: ProcessedBody['links']) {
  return (tree: MdastRoot) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined || !node.value.includes('[[')) return;
      const replacement: PhrasingContent[] = [];
      let lastIndex = 0;
      for (const match of node.value.matchAll(WIKI_LINK)) {
        const [whole, rawId, rawLabel] = match;
        const id = (rawId ?? '').trim();
        const start = match.index;
        if (start > lastIndex) {
          replacement.push({ type: 'text', value: node.value.slice(lastIndex, start) });
        }
        links.push({ id, line: node.position?.start.line });
        replacement.push({
          type: 'link',
          url: `/concepto/${id}`,
          children: [{ type: 'text', value: (rawLabel ?? id).trim() }],
          data: { hProperties: { className: ['concept-link'], dataConcept: id } },
        });
        lastIndex = start + whole.length;
      }
      if (replacement.length === 0) return;
      if (lastIndex < node.value.length) {
        replacement.push({ type: 'text', value: node.value.slice(lastIndex) });
      }
      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}

/** Maps :::name containers to styled boxes; demonstrations become collapsible. */
function remarkAtlasDirectives(issues: MarkdownIssue[]) {
  return (tree: MdastRoot) => {
    visit(tree, (node) => {
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        issues.push({
          message: `directiva no permitida ":${node.name}"; si es texto, agregue un espacio después de los dos puntos`,
          line: node.position?.start.line,
        });
        return;
      }
      if (node.type !== 'containerDirective') return;
      const directive = node as ContainerDirective;
      if (!isDirectiveName(directive.name)) {
        issues.push({
          message: `directiva desconocida ":::${directive.name}"`,
          line: directive.position?.start.line,
        });
        return;
      }
      const first = directive.children[0];
      const hasLabel =
        first?.type === 'paragraph' &&
        Boolean((first.data as { directiveLabel?: boolean } | undefined)?.directiveLabel);
      const labelChildren: PhrasingContent[] =
        hasLabel && first.type === 'paragraph'
          ? first.children
          : [{ type: 'text', value: DIRECTIVES[directive.name] }];
      const body = hasLabel ? directive.children.slice(1) : directive.children;
      const isProof = directive.name === 'demostracion';
      directive.data = {
        hName: isProof ? 'details' : 'aside',
        hProperties: { className: ['directive', `directive-${directive.name}`] },
      };
      directive.children = [
        {
          type: 'paragraph',
          children: labelChildren,
          data: {
            hName: isProof ? 'summary' : 'p',
            hProperties: { className: ['directive-title'] },
          },
        },
        ...body,
      ];
    });
  };
}

function collectSectionData(tree: MdastRoot, result: ProcessedBody) {
  let currentTitle: string | null = null;
  let buffer: RootContent[] = [];
  const flush = () => {
    if (currentTitle !== null) {
      result.plainText[currentTitle] = plainTextOf(buffer);
      result.wordCounts[currentTitle] = countWords(result.plainText[currentTitle] ?? '');
    }
  };
  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      flush();
      currentTitle = plainTextOf((node as Heading).children as RootContent[]);
      result.headingTitles.push(currentTitle);
      buffer = [];
    } else if (node.type === 'heading' && node.depth === 1) {
      result.issues.push({
        message: 'no se permiten encabezados de nivel 1 en el cuerpo',
        line: node.position?.start.line,
      });
    } else {
      if (currentTitle === null && node.type !== 'html') {
        result.issues.push({
          message: 'hay contenido antes de la primera sección',
          line: node.position?.start.line,
        });
      }
      buffer.push(node);
    }
  }
  flush();
}

function textOfHast(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOfHast).join('');
  return '';
}

/** Splits the rendered tree at each h2 so pages can place sections independently. */
function rehypeSplitSections(sections: ConceptSection[], toHtml: (root: HastRoot) => string) {
  return (tree: HastRoot) => {
    let current: { heading: Element; children: ElementContent[] } | null = null;
    const finish = () => {
      if (!current) return;
      const titulo = textOfHast(current.heading).trim();
      sections.push({
        id: slugify(titulo),
        titulo,
        html: toHtml({ type: 'root', children: current.children }).trim(),
      });
    };
    for (const child of tree.children) {
      if (child.type === 'element' && child.tagName === 'h2') {
        finish();
        current = { heading: child, children: [] };
      } else if (current && child.type !== 'doctype' && child.type !== 'comment') {
        current.children.push(child as ElementContent);
      }
    }
    finish();
  };
}

/**
 * Wide formulas and tables scroll horizontally on small screens; making the
 * scroll containers focusable lets keyboard users reach the hidden part.
 */
function rehypeScrollableRegions() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      const classes = node.properties.className;
      if (Array.isArray(classes) && classes.includes('katex-display')) {
        node.properties.tabIndex = 0;
        return;
      }
      if (node.tagName === 'table' && parent && index !== undefined && parent.type === 'element') {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-scroll'],
            tabIndex: 0,
            role: 'region',
            ariaLabel: 'Tabla',
          },
          children: [node],
        };
        parent.children.splice(index, 1, wrapper);
        return index + 1;
      }
      return undefined;
    });
  };
}

function katexMessages(file: VFile): MarkdownIssue[] {
  return file.messages
    .filter((message) => message.source === 'rehype-katex' || /katex/i.test(message.reason))
    .map((message) => ({
      message: `LaTeX inválido: ${message.reason}`,
      line: message.line ?? undefined,
    }));
}

export function katexOptions(macros: Record<string, string>) {
  return {
    macros: { ...macros },
    throwOnError: false,
    strict: 'ignore' as const,
    output: 'htmlAndMathml' as const,
  };
}

export function processConceptBody(
  markdown: string,
  macros: Record<string, string>,
): ProcessedBody {
  const result: ProcessedBody = {
    sections: [],
    headingTitles: [],
    wordCounts: {},
    plainText: {},
    links: [],
    issues: [],
  };

  const stringifier = unified().use(rehypeStringify);
  const toHtml = (root: HastRoot) => stringifier.stringify(root);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDirective)
    .use(remarkWikiLinks, result.links)
    .use(remarkAtlasDirectives, result.issues)
    .use(() => (tree: MdastRoot) => collectSectionData(tree, result))
    .use(remarkRehype)
    .use(rehypeKatex, katexOptions(macros))
    .use(rehypeScrollableRegions)
    .use(rehypeSplitSections, result.sections, toHtml)
    .use(rehypeStringify);

  const file = processor.processSync(markdown);
  result.issues.push(...katexMessages(file));
  return result;
}

export function renderFormula(
  latex: string,
  macros: Record<string, string>,
  displayMode = true,
): { html: string } | { error: string } {
  try {
    const html = katex.renderToString(latex, {
      ...katexOptions(macros),
      throwOnError: true,
      displayMode,
    });
    return { html };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export function expectedSectionIds(): string[] {
  return SECTION_TITLES.map((title) => slugify(title));
}
