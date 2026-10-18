import { editDistance } from '../format/text.ts';

export type CleaningStep = 'espacios' | 'minusculas' | 'acentos' | 'puntuacion';

/** Applies one text cleaning step. */
export function applyCleaningStep(value: string, step: CleaningStep): string {
  switch (step) {
    case 'espacios':
      return value.trim().replace(/\s+/g, ' ');
    case 'minusculas':
      return value.toLowerCase();
    case 'acentos':
      // NFD splits each accented letter into the base letter and combining marks (Unicode category M).
      return value.normalize('NFD').replace(/\p{M}/gu, '');
    case 'puntuacion':
      return value
        .replace(/[.,;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
  }
}

/** Applies the steps in order, then maps the result through a dictionary of known variants. */
export function standardize(
  value: string,
  steps: readonly CleaningStep[],
  dictionary: Readonly<Record<string, string>> = {},
): string {
  const cleaned = steps.reduce((acc, step) => applyCleaningStep(acc, step), value);
  return dictionary[cleaned] ?? cleaned;
}

/** Number of distinct values in a list. */
export function distinctValues(values: readonly string[]): number {
  return new Set(values).size;
}

/** Similarity in [0, 1]: one minus the edit distance over the length of the longer string. */
export function stringSimilarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - editDistance(a, b) / longest;
}

/**
 * Groups records whose keys are at least `threshold` similar, joining pairs
 * transitively (single linkage with union find). Returns a group id per record.
 */
export function duplicateGroups(keys: readonly string[], threshold: number): number[] {
  const parent = keys.map((_, i) => i);
  const find = (i: number): number => {
    let r = i;
    while (parent[r] !== r) r = parent[r] ?? r;
    return r;
  };
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      if (stringSimilarity(keys[i] ?? '', keys[j] ?? '') >= threshold) {
        const a = find(i);
        const b = find(j);
        if (a !== b) parent[Math.max(a, b)] = Math.min(a, b);
      }
    }
  }
  return keys.map((_, i) => find(i));
}

/** Records that remain after keeping the first record of each group. */
export function dedupedCount(groups: readonly number[]): number {
  return new Set(groups).size;
}

export type FieldRule =
  | { kind: 'requerido' }
  | { kind: 'entero' }
  | { kind: 'rango'; min: number; max: number }
  | { kind: 'patron'; pattern: string; description: string }
  | { kind: 'valores'; allowed: readonly string[] };

export interface FieldSchema {
  name: string;
  rules: readonly FieldRule[];
}

/** Human readable description of a rule. */
export function describeRule(rule: FieldRule): string {
  switch (rule.kind) {
    case 'requerido':
      return 'obligatorio';
    case 'entero':
      return 'número entero';
    case 'rango':
      return `entre ${rule.min} y ${rule.max}`;
    case 'patron':
      return rule.description;
    case 'valores':
      return `uno de: ${rule.allowed.join(', ')}`;
  }
}

/** Returns the rules a cell violates. Empty cells only fail the "required" rule. */
export function checkCell(value: string, field: FieldSchema): FieldRule[] {
  const empty = value.trim() === '';
  return field.rules.filter((rule) => {
    if (rule.kind === 'requerido') return empty;
    if (empty) return false;
    switch (rule.kind) {
      case 'entero':
        return !/^-?\d+$/.test(value.trim());
      case 'rango': {
        const n = Number(value);
        return !Number.isFinite(n) || n < rule.min || n > rule.max;
      }
      case 'patron':
        return !new RegExp(rule.pattern).test(value);
      case 'valores':
        return !rule.allowed.includes(value);
    }
  });
}
