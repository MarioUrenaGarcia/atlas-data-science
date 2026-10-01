import { describe, expect, it } from 'vitest';
import { parseSummary, type SummaryPiece } from '../../../src/lib/format/summary.ts';

/** Compact rendering of the tree: sup as ^[...] and sub as _[...]. */
function show(pieces: SummaryPiece[]): string {
  return pieces
    .map((p) => (p.kind === 'text' ? p.value : `${p.kind === 'sup' ? '^' : '_'}[${show(p.children)}]`))
    .join('');
}

describe('parseSummary', () => {
  it('raises simple tokens', () => {
    expect(show(parseSummary('tiene 2^n, uno por cada'))).toBe('tiene 2^[n], uno por cada');
    expect(show(parseSummary('A = LL^T con L'))).toBe('A = LL^[T] con L');
    expect(show(parseSummary('la pseudoinversa A^+ existe'))).toBe('la pseudoinversa A^[+] existe');
  });

  it('groups parenthesized and braced exponents, with nesting', () => {
    expect(show(parseSummary('e^(-t^2) entre'))).toBe('e^[-t^[2]] entre');
    expect(show(parseSummary('P^{-1}AP'))).toBe('P^[-1]AP');
  });

  it('lowers indices', () => {
    expect(show(parseSummary('a_n x^n / n!'))).toBe('a_[n] x^[n] / n!');
    expect(show(parseSummary('[x]_B = P^{-1}x'))).toBe('[x]_[B] = P^[-1]x');
  });

  it('leaves plain text and isolated marks untouched', () => {
    expect(show(parseSummary('sin marcas'))).toBe('sin marcas');
    expect(show(parseSummary('un ^ suelto'))).toBe('un ^ suelto');
  });
});
