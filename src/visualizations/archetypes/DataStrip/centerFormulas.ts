import {
  centerMeasure,
  trimCount,
  winsorize,
  type CenterMeasure,
} from '../../../lib/stats/central.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { modes, sorted } from '../../../lib/stats/index.ts';

/** Terms shown before the formula is abbreviated with an ellipsis. */
const MAX_TERMS = 7;

export const MEASURE_NAMES: Record<CenterMeasure, string> = {
  media: 'Media aritmética',
  ponderada: 'Media ponderada',
  geometrica: 'Media geométrica',
  armonica: 'Media armónica',
  cuadratica: 'Media cuadrática',
  recortada: 'Media recortada',
  winsorizada: 'Media winsorizada',
  mediana: 'Mediana',
  moda: 'Moda',
  'rango-medio': 'Rango medio',
};

export const MEASURE_SYMBOLS: Record<CenterMeasure, string> = {
  media: '\\bar{x}',
  ponderada: '\\bar{x}_w',
  geometrica: '\\bar{x}_G',
  armonica: '\\bar{x}_H',
  cuadratica: '\\bar{x}_Q',
  recortada: '\\bar{x}_{\\alpha}',
  winsorizada: '\\bar{x}_{W}',
  mediana: '\\tilde{x}',
  moda: '\\operatorname{Mo}',
  'rango-medio': '\\operatorname{RM}',
};

function list(terms: string[], separator: string): string {
  if (terms.length <= MAX_TERMS) return terms.join(separator);
  return [...terms.slice(0, 3), '\\dots', ...terms.slice(-2)].join(separator);
}

/**
 * LaTeX for the computation of a measure with the current numbers, ending in
 * its value, so the header shows exactly what the chart is drawing.
 */
export function centerFormula(
  measure: CenterMeasure,
  values: readonly number[],
  options: { weights?: readonly number[]; proportion?: number; decimals: number },
): string {
  const d = options.decimals;
  const f = (value: number) => formatNumber(value, d);
  const result = centerMeasure(measure, values, options);
  const symbol = MEASURE_SYMBOLS[measure];
  const n = values.length;
  const end = Number.isNaN(result) ? '\\text{no definida}' : formatNumber(result, d + 2);
  if (n === 0) return `${symbol} = \\text{sin datos}`;
  switch (measure) {
    case 'media':
      return `${symbol} = \\frac{${list(values.map(f), ' + ')}}{${n}} = ${end}`;
    case 'ponderada': {
      const w = options.weights ?? values.map(() => 1);
      const terms = values.map((value, i) => `${f(w[i] ?? 1)} \\cdot ${f(value)}`);
      const total = w.slice(0, n).reduce((a, b) => a + b, 0);
      return `${symbol} = \\frac{${list(terms, ' + ')}}{${f(total)}} = ${end}`;
    }
    case 'geometrica':
      return `${symbol} = \\left(${list(values.map(f), ' \\cdot ')}\\right)^{1/${n}} = ${end}`;
    case 'armonica':
      return `${symbol} = \\frac{${n}}{${list(
        values.map((v) => `\\frac{1}{${f(v)}}`),
        ' + ',
      )}} = ${end}`;
    case 'cuadratica':
      return `${symbol} = \\sqrt{\\frac{${list(
        values.map((v) => `${f(v)}^2`),
        ' + ',
      )}}{${n}}} = ${end}`;
    case 'recortada': {
      const cut = trimCount(n, options.proportion ?? 0.1);
      const kept = sorted(values).slice(cut, n - cut);
      return `${symbol} = \\frac{${list(kept.map(f), ' + ')}}{${kept.length}} = ${end}\\quad(\\text{se quitan ${cut} por lado})`;
    }
    case 'winsorizada': {
      const cut = trimCount(n, options.proportion ?? 0.1);
      const w = sorted(winsorize(values, options.proportion ?? 0.1));
      return `${symbol} = \\frac{${list(w.map(f), ' + ')}}{${n}} = ${end}\\quad(\\text{${cut} por lado sustituidos})`;
    }
    case 'mediana': {
      const x = sorted(values).map(f);
      if (n % 2 === 1) {
        const k = (n + 1) / 2;
        return `${symbol} = x_{(${k})} = ${end}\\quad(\\text{dato central de ${n} ordenados})`;
      }
      const k = n / 2;
      return `${symbol} = \\frac{x_{(${k})} + x_{(${k + 1})}}{2} = \\frac{${x[k - 1]} + ${x[k]}}{2} = ${end}`;
    }
    case 'moda': {
      const found = modes(values);
      const count = values.filter((value) => value === found[0]).length;
      if (count === 1) return `\\text{Todos los valores aparecen una vez: no hay moda}`;
      if (found.length > 1)
        return `\\operatorname{Mo} \\in \\{${found.map(f).join(', ')}\\}\\quad(\\text{cada uno aparece ${count} veces})`;
      return `${symbol} = ${f(found[0] ?? 0)}\\quad(\\text{aparece ${count} veces})`;
    }
    case 'rango-medio':
      return `${symbol} = \\frac{x_{(1)} + x_{(n)}}{2} = \\frac{${f(Math.min(...values))} + ${f(Math.max(...values))}}{2} = ${end}`;
  }
}
