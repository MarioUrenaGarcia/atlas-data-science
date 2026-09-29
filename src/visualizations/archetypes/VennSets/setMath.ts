import type { SetOperation } from './schema.ts';

/** Regions of a two-set diagram (bit 0: in A, bit 1: in B) that make up each operation. */
export const OPERATION_REGIONS: Record<SetOperation, number[]> = {
  union: [1, 2, 3],
  interseccion: [3],
  complemento: [0, 2],
  diferencia: [1],
  'diferencia-simetrica': [1, 2],
};

export function operationLatex(operation: SetOperation, a: string, b: string): string {
  switch (operation) {
    case 'union':
      return `${a} \\cup ${b}`;
    case 'interseccion':
      return `${a} \\cap ${b}`;
    case 'complemento':
      return `${a}^{c}`;
    case 'diferencia':
      return `${a} \\setminus ${b}`;
    case 'diferencia-simetrica':
      return `${a} \\,\\triangle\\, ${b}`;
  }
}

export const OPERATION_LABELS: Record<SetOperation, string> = {
  union: 'Unión',
  interseccion: 'Intersección',
  complemento: 'Complemento',
  diferencia: 'Diferencia',
  'diferencia-simetrica': 'Diferencia simétrica',
};

export function membershipMask(element: number, sets: readonly (readonly number[])[]): number {
  return sets.reduce((mask, set, index) => (set.includes(element) ? mask | (1 << index) : mask), 0);
}

export function formatSet(elements: readonly number[]): string {
  return elements.length === 0 ? '∅' : `{${elements.join(', ')}}`;
}

/** Plain-language membership of a region, such as "en A y en C, no en B". */
export function describeRegion(mask: number, labels: readonly string[]): string {
  const inside = labels.filter((_, index) => (mask >> index) & 1);
  const outside = labels.filter((_, index) => !((mask >> index) & 1));
  if (inside.length === 0) return `fuera de ${labels.join(', ')}`;
  if (outside.length === 0) return `en ${inside.join(', ')}`;
  return `en ${inside.join(' y ')}, no en ${outside.join(' ni en ')}`;
}

/** Region of a Venn diagram written as an intersection of sets and complements. */
export function regionLatex(mask: number, labels: readonly string[]): string {
  return labels
    .map((label, index) => ((mask >> index) & 1 ? label : `${label}^{c}`))
    .join(' \\cap ');
}
