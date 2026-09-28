/** Props every registered visualization receives from a concept page. */
export interface VisualizationProps {
  /** Parameters from the concept frontmatter, already validated against the component schema. */
  params: Record<string, unknown>;
  conceptId: string;
  /** Concept title, used for accessible labels and exported file names. */
  title: string;
}
