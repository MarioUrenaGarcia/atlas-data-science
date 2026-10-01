import { quantileRank } from '../../../lib/stats/dispersion.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { quantile, sorted, type QuantileMethod } from '../../../lib/stats/index.ts';

export const METHOD_NAMES: Record<QuantileMethod, string> = {
  1: 'Tipo 1: inversa de la función de distribución empírica',
  2: 'Tipo 2: inversa con promedio en los saltos',
  4: 'Tipo 4: interpolación de la función empírica',
  5: 'Tipo 5: posición n p + 1/2',
  6: 'Tipo 6: posición (n + 1) p',
  7: 'Tipo 7: posición (n - 1) p + 1',
  8: 'Tipo 8: aproximadamente insesgado en la mediana',
  9: 'Tipo 9: aproximadamente insesgado para datos normales',
};

/**
 * LaTeX that locates the p quantile among the order statistics: the rank h,
 * the two neighbors x_(j), x_(j+1) and the interpolation weight g.
 */
export function quantileFormula(
  values: readonly number[],
  p: number,
  method: QuantileMethod,
  decimals: number,
): string {
  const x = sorted(values);
  const n = x.length;
  const f = (value: number) => formatNumber(value, decimals);
  const g4 = (value: number) => formatNumber(value, decimals + 2);
  const q = quantile(values, p, method);
  const symbol = `Q(${formatNumber(p, 2)})`;
  if (method === 1 || method === 2) {
    const np = n * p;
    return `n p = ${n} \\cdot ${formatNumber(p, 2)} = ${formatNumber(np, 2)} \\ \\Rightarrow\\ ${symbol} = ${g4(q)}`;
  }
  const h = quantileRank(n, p, method);
  const j = Math.floor(h);
  if (j < 1)
    return `h = ${formatNumber(h, 3)} < 1 \\ \\Rightarrow\\ ${symbol} = x_{(1)} = ${f(x[0] ?? 0)}`;
  if (j >= n)
    return `h = ${formatNumber(h, 3)} \\ge n \\ \\Rightarrow\\ ${symbol} = x_{(n)} = ${f(x[n - 1] ?? 0)}`;
  const g = h - j;
  return (
    `h = ${formatNumber(h, 3)},\\ ${symbol} = x_{(${j})} + ${formatNumber(g, 3)}\\,\\big(x_{(${j + 1})} - x_{(${j})}\\big)` +
    ` = ${f(x[j - 1] ?? 0)} + ${formatNumber(g, 3)}\\,(${f(x[j] ?? 0)} - ${f(x[j - 1] ?? 0)}) = ${g4(q)}`
  );
}
