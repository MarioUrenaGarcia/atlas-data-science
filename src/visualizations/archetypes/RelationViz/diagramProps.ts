/** Data every drawing of a relation receives. */
export interface RelationDiagramProps {
  elements: readonly number[];
  matrix: readonly (readonly boolean[])[];
  /** Pairs revealed so far, in row order (a, b) with a the row. */
  filled: number;
  /** Pairs "i,j" that are counterexamples of a property. */
  witnessCells: ReadonlySet<string>;
  classOf: ReadonlyMap<number, number>;
  colorByClass: boolean;
  label: string;
}
