import { formatNumber } from '../../../lib/format/number.ts';
import type { DesignId, DrawnSample, GridPopulation } from '../../../lib/sampling/index.ts';

const SHOWN_TERMS = 4;

export const DESIGN_LABELS: Record<DesignId, string> = {
  mas: 'Muestreo aleatorio simple',
  estratificado: 'Muestreo estratificado',
  conglomerados: 'Muestreo por conglomerados',
  sistematico: 'Muestreo sistemático',
  multietapa: 'Muestreo en dos etapas',
  pps: 'Probabilidad proporcional al tamaño',
  cuotas: 'Muestreo por cuotas',
  conveniencia: 'Muestreo por conveniencia',
  seleccion: 'Selección sesgada',
  marco: 'Muestreo de un marco incompleto',
  'no-respuesta': 'Muestreo aleatorio con no respuesta',
};

/** Designs whose sample size counts clusters instead of units. */
export const CLUSTER_DESIGNS: readonly DesignId[] = ['conglomerados', 'multietapa'];

export const PROBABILITY_DESIGNS: readonly DesignId[] = [
  'mas',
  'estratificado',
  'conglomerados',
  'sistematico',
  'multietapa',
  'pps',
];

function sumTex(values: readonly number[], digits: number): string {
  if (values.length === 0) return '0';
  const shown = values.slice(0, SHOWN_TERMS).map((v) => formatNumber(v, digits));
  return values.length > SHOWN_TERMS ? `${shown.join(' + ')} + \\dots` : shown.join(' + ');
}

interface HeaderInput {
  design: DesignId;
  population: GridPopulation;
  sample: DrawnSample;
  /** Units of the sample revealed so far. */
  drawn: number;
  estimate: number;
  decimals: number;
  start?: number;
}

/**
 * Formula of the estimator with the numbers of the current sample. While the
 * sample is still being drawn, only the revealed units enter the sums.
 */
export function headerFormula({
  design,
  population,
  sample,
  drawn,
  estimate,
  decimals,
}: HeaderInput): string {
  const units = sample.units.slice(0, drawn);
  const values = units.map((u) => population.values[u] ?? 0);
  const N = population.values.length;
  const n = sample.units.length;
  const complete = drawn >= n;
  const d = decimals;
  const result = complete ? formatNumber(estimate, d + 2) : '\\ ?';
  switch (design) {
    case 'estratificado': {
      const H = population.strataNames.length;
      const parts: string[] = [];
      for (let h = 0; h < H; h += 1) {
        const inStratum = units.filter((u) => population.stratum[u] === h);
        const size = population.stratum.filter((s) => s === h).length;
        const mean =
          inStratum.length === 0
            ? '?'
            : formatNumber(
                inStratum.reduce((a, u) => a + (population.values[u] ?? 0), 0) / inStratum.length,
                d + 1,
              );
        parts.push(`${formatNumber(size / N, 2)}\\,(${mean})`);
      }
      return `\\bar{y}_{st} = \\sum_h W_h\\,\\bar{y}_h = ${parts.join(' + ')} = ${result}`;
    }
    case 'conglomerados': {
      const totals = sample.clusters.map((c) =>
        units
          .filter((u) => population.cluster[u] === c)
          .reduce((a, u) => a + (population.values[u] ?? 0), 0),
      );
      return `\\hat{\\bar{Y}} = \\frac{\\sum_c t_c}{\\sum_c M_c} = \\frac{${sumTex(totals, d)}}{${units.length}} = ${result}`;
    }
    case 'multietapa': {
      const means = sample.clusters
        .map((c) => units.filter((u) => population.cluster[u] === c))
        .filter((members) => members.length > 0)
        .map(
          (members) =>
            members.reduce((a, u) => a + (population.values[u] ?? 0), 0) / members.length,
        );
      return `\\hat{\\bar{Y}} = \\frac{1}{m}\\sum_{c=1}^{m} \\bar{y}_c = \\frac{${sumTex(means, d + 1)}}{${sample.clusters.length}} = ${result}`;
    }
    case 'pps': {
      const total = population.size.reduce((a, b) => a + b, 0);
      const ratios = units.map(
        (u) => (population.values[u] ?? 0) / ((population.size[u] ?? 1) / total),
      );
      return `\\hat{\\bar{Y}}_{HH} = \\frac{1}{N n}\\sum_{i=1}^{n} \\frac{y_i}{p_i} = \\frac{${sumTex(ratios, 0)}}{${N} \\cdot ${n}} = ${result}`;
    }
    case 'sistematico': {
      const k = N / Math.max(1, n);
      return `k = \\frac{N}{n} = ${formatNumber(k, 2)},\\quad \\bar{y}_{sis} = \\frac{${sumTex(values, d)}}{${n}} = ${result}`;
    }
    case 'no-respuesta': {
      const answered = units.filter((u) => sample.responded[sample.units.indexOf(u)]);
      const answeredValues = answered.map((u) => population.values[u] ?? 0);
      return `\\bar{y}_R = \\frac{1}{n_R}\\sum_{i \\in R} y_i = \\frac{${sumTex(answeredValues, d)}}{${answered.length}} = ${result}\\quad (n_R = ${answered.length} \\text{ de } ${drawn})`;
    }
    default:
      return `\\bar{y} = \\frac{1}{n}\\sum_{i=1}^{n} y_i = \\frac{${sumTex(values, d)}}{${n}} = ${result}`;
  }
}

export function stageText(design: DesignId, complete: boolean, samples: number): string {
  if (!complete) {
    switch (design) {
      case 'estratificado':
        return 'Se extrae una muestra aleatoria simple dentro de cada estrato';
      case 'conglomerados':
        return 'Se sortean conglomerados completos y se observan todas sus unidades';
      case 'multietapa':
        return 'Primero se sortean conglomerados y luego unidades dentro de cada uno';
      case 'sistematico':
        return 'Se elige un arranque aleatorio y luego una unidad cada k posiciones';
      case 'pps':
        return 'Cada extracción elige una unidad con probabilidad proporcional a su tamaño';
      case 'cuotas':
        return 'Se llenan las cuotas de cada estrato con las unidades más accesibles';
      case 'conveniencia':
        return 'Se toman las unidades más fáciles de alcanzar, cerca del punto de acceso';
      case 'seleccion':
        return 'Las unidades con valores altos tienen más probabilidad de entrar';
      case 'marco':
        return 'Solo se puede sortear entre las unidades que aparecen en el marco';
      case 'no-respuesta':
        return 'Se sortea la muestra, pero no todas las unidades seleccionadas responden';
      default:
        return 'Cada unidad de la población tiene la misma probabilidad de ser elegida';
    }
  }
  return samples <= 1
    ? 'Muestra completa: el estimador se compara con el valor real de la población'
    : `Se repite el diseño: ${samples} muestras y la distribución de sus estimaciones`;
}
