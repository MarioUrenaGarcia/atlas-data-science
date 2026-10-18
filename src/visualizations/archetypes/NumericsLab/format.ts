/**
 * Number formatting for numerical analysis views, where the exact digits of a
 * stored value and errors spanning many orders of magnitude both matter.
 */

const trimZeros = (s: string) => (s.includes('.') ? s.replace(/\.?0+$/, '') : s);

function power(mantissa: string, exponent: number, tex: boolean): string {
  return tex ? `${mantissa} \\times 10^{${exponent}}` : `${mantissa} × 10^${exponent}`;
}

/**
 * Significant digits of a double; the default 17 is enough to tell two stored
 * values apart, fewer digits suit values that are not about representation.
 */
export function exact(value: number, tex = false, digits = 17): string {
  if (Number.isNaN(value)) return tex ? '\\text{NaN}' : 'NaN';
  if (!Number.isFinite(value))
    return tex ? (value > 0 ? '\\infty' : '-\\infty') : value > 0 ? '∞' : '-∞';
  const text = value.toPrecision(digits);
  if (text.includes('e')) {
    const [mantissa = '0', exponent = '0'] = text.split('e');
    return power(trimZeros(mantissa), Number(exponent), tex);
  }
  return trimZeros(text);
}

/** Scientific notation with three significant digits, for errors and step sizes. */
export function sci(value: number, tex = false): string {
  if (Number.isNaN(value)) return tex ? '\\text{NaN}' : 'NaN';
  if (!Number.isFinite(value))
    return tex ? (value > 0 ? '\\infty' : '-\\infty') : value > 0 ? '∞' : '-∞';
  if (value === 0) return '0';
  const [mantissa = '0', exponent = '0'] = value.toExponential(2).split('e');
  const e = Number(exponent);
  if (e >= -2 && e <= 3) return trimZeros(value.toFixed(Math.max(0, 3 - e)));
  return power(mantissa, e, tex);
}
