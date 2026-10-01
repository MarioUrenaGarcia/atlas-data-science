import { formatNumber } from '../../../lib/format/number.ts';
import { spreadMeasure, type SpreadMeasure } from '../../../lib/stats/dispersion.ts';
import { mean, median, quantile, sorted } from '../../../lib/stats/index.ts';

const MAX_TERMS = 6;

export const SPREAD_NAMES: Record<SpreadMeasure, string> = {
  rango: 'Rango',
  varianza: 'Varianza muestral s²',
  'varianza-n': 'Varianza con denominador n',
  desviacion: 'Desviación estándar s',
  cv: 'Coeficiente de variación',
  riq: 'Rango intercuartílico',
  mad: 'Desviación absoluta mediana',
  dam: 'Desviación absoluta media',
  suma: 'Suma de desviaciones con signo',
};

function list(terms: string[]): string {
  if (terms.length <= MAX_TERMS) return terms.join(' + ');
  return [...terms.slice(0, 3), '\\dots', ...terms.slice(-2)].join(' + ');
}

/** Center from which the deviations of a measure are taken. */
export function spreadCenter(measure: SpreadMeasure, values: readonly number[]): number {
  return measure === 'mad' ? median(values) : mean(values);
}

/**
 * LaTeX with the computation of a spread measure using the deviations
 * revealed so far; the last term is the value drawn in the chart.
 */
export function spreadFormula(
  measure: SpreadMeasure,
  values: readonly number[],
  revealed: number,
  decimals: number,
): string {
  const f = (value: number) => formatNumber(value, decimals);
  const g = (value: number) => formatNumber(value, decimals + 2);
  const n = values.length;
  const shown = values.slice(0, revealed);
  const center = spreadCenter(measure, values);
  const pending = revealed < n ? ' + \\dots' : '';
  const value = spreadMeasure(measure, values);
  switch (measure) {
    case 'rango':
      return `R = x_{(n)} - x_{(1)} = ${f(Math.max(...values))} - ${f(Math.min(...values))} = ${g(value)}`;
    case 'varianza':
    case 'varianza-n':
    case 'desviacion': {
      const terms = shown.map((x) => `(${f(x)} - ${g(center)})^2`);
      const denominator = measure === 'varianza-n' ? `${n}` : `${n} - 1`;
      const sumSquares = shown.reduce((total, x) => total + (x - center) ** 2, 0);
      const body = `\\frac{${list(terms)}${pending}}{${denominator}}`;
      if (revealed < n)
        return `${measure === 'desviacion' ? 's = \\sqrt{' + body + '}' : 's^2 = ' + body},\\quad \\text{suma parcial} = ${g(sumSquares)}`;
      return measure === 'desviacion'
        ? `s = \\sqrt{${body}} = \\sqrt{${g(value * value)}} = ${g(value)}`
        : `${measure === 'varianza-n' ? '\\hat{\\sigma}^2_n' : 's^2'} = ${body} = \\frac{${g(sumSquares)}}{${denominator}} = ${g(value)}`;
    }
    case 'cv': {
      const s = spreadMeasure('desviacion', values);
      return `\\mathrm{CV} = \\frac{s}{\\bar{x}} = \\frac{${g(s)}}{${g(center)}} = ${formatNumber(value, 3)} = ${formatNumber(value * 100, 1)}\\,\\%`;
    }
    case 'riq':
      return `\\mathrm{RIQ} = Q_3 - Q_1 = ${g(quantile(values, 0.75))} - ${g(quantile(values, 0.25))} = ${g(value)}`;
    case 'mad': {
      const abs = shown.map((x) => `|${f(x)} - ${g(center)}|`);
      if (revealed < n)
        return `\\mathrm{MAD} = \\operatorname{mediana}\\{${list(abs).replace(/ \+ /g, ',\\ ')}${revealed < n ? ',\\ \\dots' : ''}\\}`;
      const deviations = sorted(values.map((x) => Math.abs(x - center)));
      return `\\mathrm{MAD} = \\operatorname{mediana}\\{${list(deviations.map(g)).replace(/ \+ /g, ',\\ ')}\\} = ${g(value)}`;
    }
    case 'suma': {
      const terms = shown.map((x) => `(${g(x - center)})`);
      const partial = shown.reduce((total, x) => total + (x - center), 0);
      return `\\sum_i (x_i - \\bar{x}) =${list(terms)}${pending} = ${g(Math.abs(partial) < 1e-9 ? 0 : partial)}`;
    }
    case 'dam': {
      const abs = shown.map((x) => `|${f(x)} - ${g(center)}|`);
      return `\\mathrm{DAM} = \\frac{${list(abs)}${pending}}{${n}}${revealed < n ? '' : ` = ${g(value)}`}`;
    }
  }
}
