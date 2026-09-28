/**
 * Number formatting for readouts: decimal point, no thousands separator for
 * values up to five digits and a comma separator beyond that, following the
 * Atlas notation conventions.
 */
export function formatNumber(value: number, digits = 3): string {
  if (Number.isNaN(value)) return 'no definido';
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e9)) {
    const [mantissa, exponent] = value.toExponential(Math.max(0, digits - 1)).split('e');
    return `${mantissa} × 10^${Number(exponent)}`;
  }
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(digits);
  const [integer = '', decimals] = fixed.split('.');
  const sign = integer.startsWith('-') ? '-' : '';
  const digitsOnly = sign ? integer.slice(1) : integer;
  const grouped =
    digitsOnly.length > 5 ? digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : digitsOnly;
  return decimals === undefined ? `${sign}${grouped}` : `${sign}${grouped}.${decimals}`;
}

/** Percentage with the given decimals, for probabilities shown to readers. */
export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)} %`;
}

/** Probability in [0, 1] with enough digits for small values. */
export function formatProbability(value: number): string {
  if (value !== 0 && Math.abs(value) < 0.001) return formatNumber(value, 2);
  return value.toFixed(4);
}
