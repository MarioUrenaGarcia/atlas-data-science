/** Data every drawing of a relation receives. */
export interface RelationDiagramProps {
  elements: readonly number[];
  /** Text shown for each element, such as a time for a number of minutes. */
  labels: readonly string[];
  matrix: readonly (readonly boolean[])[];
  /** Pairs revealed so far, in row order (a, b) with a the row. */
  filled: number;
  /** Pairs "i,j" that are counterexamples of a property. */
  witnessCells: ReadonlySet<string>;
  classOf: ReadonlyMap<number, number>;
  colorByClass: boolean;
  label: string;
}
