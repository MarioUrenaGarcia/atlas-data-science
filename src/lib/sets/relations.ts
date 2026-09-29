/** Binary relations on a finite set given as a boolean matrix: related[i][j] means i R j. */

export type RelationMatrix = boolean[][];

export function relationMatrix(
  elements: readonly number[],
  rule: (a: number, b: number) => boolean,
): RelationMatrix {
  return elements.map((a) => elements.map((b) => rule(a, b)));
}

export interface PropertyCheck {
  holds: boolean;
  /** Indices of a counterexample: one index for reflexivity, two for symmetry, three for transitivity. */
  witness: number[] | null;
}

export function reflexive(matrix: RelationMatrix): PropertyCheck {
  const index = matrix.findIndex((row, i) => !row[i]);
  return { holds: index < 0, witness: index < 0 ? null : [index] };
}

export function symmetric(matrix: RelationMatrix): PropertyCheck {
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix.length; j += 1) {
      if (matrix[i]?.[j] && !matrix[j]?.[i]) return { holds: false, witness: [i, j] };
    }
  }
  return { holds: true, witness: null };
}

export function antisymmetric(matrix: RelationMatrix): PropertyCheck {
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix.length; j += 1) {
      if (i !== j && matrix[i]?.[j] && matrix[j]?.[i]) return { holds: false, witness: [i, j] };
    }
  }
  return { holds: true, witness: null };
}

export function transitive(matrix: RelationMatrix): PropertyCheck {
  const n = matrix.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (!matrix[i]?.[j]) continue;
      for (let k = 0; k < n; k += 1) {
        if (matrix[j]?.[k] && !matrix[i]?.[k]) return { holds: false, witness: [i, j, k] };
      }
    }
  }
  return { holds: true, witness: null };
}

/** Equivalence classes as lists of indices; meaningful only for equivalence relations. */
export function equivalenceClasses(matrix: RelationMatrix): number[][] {
  const assigned = new Set<number>();
  const classes: number[][] = [];
  for (let i = 0; i < matrix.length; i += 1) {
    if (assigned.has(i)) continue;
    const members = (matrix[i] ?? []).flatMap((related, j) => (related ? [j] : []));
    members.forEach((j) => assigned.add(j));
    assigned.add(i);
    classes.push(members.includes(i) ? members : [i, ...members]);
  }
  return classes;
}
