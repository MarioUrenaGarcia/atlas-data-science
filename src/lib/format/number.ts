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

/**
 * Exact-looking fraction for values that come from small rational arithmetic,
 * such as row reduction of integer matrices: the smallest denominator up to
 * maxDenominator that reproduces the value. Falls back to decimals otherwise.
 */
export function formatFraction(value: number, maxDenominator = 60, digits = 3): string {
  if (!Number.isFinite(value)) return formatNumber(value, digits);
  for (let denominator = 1; denominator <= maxDenominator; denominator += 1) {
    const numerator = Math.round(value * denominator);
    if (Math.abs(numerator / denominator - value) < 1e-9) {
      if (numerator === 0) return '0';
      return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
    }
  }
  return formatNumber(value, digits);
}

/** LaTeX version of formatFraction, with \tfrac for proper display. */
export function fractionLatex(value: number, maxDenominator = 60, digits = 3): string {
  const text = formatFraction(value, maxDenominator, digits);
  const match = /^(-?)(\d+)\/(\d+)$/.exec(text);
  return match ? `${match[1]}\tfrac{${match[2]}}{${match[3]}}` : text;
}
