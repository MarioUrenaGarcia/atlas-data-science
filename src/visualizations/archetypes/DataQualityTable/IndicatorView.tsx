import { useMemo, useState } from 'react';
import { logisticRegression } from '../../../lib/dataprep/logistic.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { mean } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './Quality.module.css';

const APPLICANTS = 400;
const PREVIEW_ROWS = 8;
const STAGES = [
  'Datos con ingresos faltantes',
  'Columna indicadora de faltante',
  'Imputación por la media',
  'Modelo sin indicador',
  'Modelo con indicador',
];
const STAGES_PER_SECOND = 0.6;

interface Applicant {
  income: number;
  missing: boolean;
  defaulted: number;
}

/** Applicants with income, a missing flag and a default outcome that depends on both. */
function simulate(rate: number, effect: number, seed: number): Applicant[] {
  const random = new Random(seed);
  return Array.from({ length: APPLICANTS }, () => {
    const income = Math.max(4, random.normal(18, 6));
    const missing = random.next() < rate;
    const base = 1 / (1 + Math.exp(-(-0.8 - 0.12 * (income - 18))));
    const p = Math.min(0.97, base + (missing ? effect : 0));
    return { income, missing, defaulted: random.next() < p ? 1 : 0 };
  });
}

/**
 * Credit applicants who leave their income blank default more often. Mean
 * imputation erases that signal; a 0/1 column marking the missing value lets
 * a logistic model recover it.
 */
export function IndicatorView({
  title,
  rate,
  effect,
  seed: seed0,
}: {
  title: string;
  rate: number;
  effect: number;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'tasa',
      label: 'Proporción de ingresos faltantes',
      min: 0.05,
      max: 0.6,
      step: 0.05,
      default: rate,
      digits: 2,
    },
    {
      type: 'number',
      key: 'efecto',
      label: 'Riesgo adicional de quien omite el ingreso',
      min: 0,
      max: 0.5,
      step: 0.05,
      default: effect,
      digits: 2,
    },
  ];
  const parameters = useParameters(definitions);
  const missRate = Number(parameters.values.tasa);
  const extra = Number(parameters.values.efecto);
  const seed = useSeed(seed0);
  const data = useMemo(() => simulate(missRate, extra, seed.seed), [missRate, extra, seed.seed]);
  const fill = mean(data.filter((a) => !a.missing).map((a) => a.income));
  const models = useMemo(() => {
    const y = data.map((a) => a.defaulted);
    const imputed = data.map((a) => (a.missing ? fill : a.income));
    const center = (v: number) => (v - fill) / 6;
    const without = logisticRegression(
      imputed.map((v) => [1, center(v)]),
      y,
    );
    const withIndicator = logisticRegression(
      data.map((a, i) => [1, center(imputed[i] ?? fill), a.missing ? 1 : 0]),
      y,
    );
    return { without, withIndicator };
  }, [data, fill]);
  const total = STAGES.length - 1;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState<number>(
    `${seed.seed}|${missRate}|${extra}|${run}`,
    () => (reducedMotion ? total : 0),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= total,
  });
  const missingIdx = data.flatMap((a, i) => (a.missing ? [i] : []));
  const observedIdx = data.flatMap((a, i) => (a.missing ? [] : [i]));
  const rateMissing = mean(missingIdx.map((i) => data[i]?.defaulted ?? 0));
  const rateObserved = mean(observedIdx.map((i) => data[i]?.defaulted ?? 0));
  const predWithout = mean(missingIdx.map((i) => models.without.probabilities[i] ?? 0));
  const predWith = mean(missingIdx.map((i) => models.withIndicator.probabilities[i] ?? 0));
  const indicatorCoef = models.withIndicator.coefficients[2] ?? 0;
  const g = (v: number) => formatNumber(v, 3);
  const headers = [
    `\\text{faltan } ${missingIdx.length} \\text{ de } ${APPLICANTS} \\text{ ingresos}`,
    `M_i = \\mathbf{1}\\{x_i \\text{ falta}\\}`,
    `\\tilde{x}_i = \\bar{x}_{\\text{obs}} = ${formatNumber(fill, 2)} \\text{ si } x_i \\text{ falta}`,
    `P(\\text{impago}) = \\sigma(\\beta_0 + \\beta_1 \\tilde{x}_i),\\quad \\text{pérdida log} = ${g(models.without.logLoss)}`,
    `P(\\text{impago}) = \\sigma(\\beta_0 + \\beta_1 \\tilde{x}_i + \\gamma M_i),\\quad \\hat{\\gamma} = ${formatNumber(indicatorCoef, 2)},\\ \\text{pérdida log} = ${g(models.withIndicator.logLoss)}`,
  ];
  const description =
    `${APPLICANTS} solicitantes, ${missingIdx.length} sin ingreso. Impago real: ${g(rateMissing)} entre quienes omiten el ingreso y ${g(rateObserved)} entre quienes lo reportan. ` +
    `Probabilidad promedio predicha para quienes omiten el ingreso: ${g(predWithout)} sin indicador y ${g(predWith)} con indicador.`;
  const bars = [rateObserved, rateMissing, stage >= 3 ? predWithout : 0, stage >= 4 ? predWith : 0];

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Etapa', value: STAGES[stage] ?? '' },
        {
          label: 'Impago real con ingreso faltante',
          value: g(rateMissing),
          color: DATA_COLORS.highlight,
        },
        { label: 'Impago real con ingreso reportado', value: g(rateObserved) },
        ...(stage >= 3
          ? [{ label: 'Pérdida logarítmica sin indicador', value: g(models.without.logLoss) }]
          : []),
        ...(stage >= 4
          ? [
              {
                label: 'Pérdida logarítmica con indicador',
                value: g(models.withIndicator.logLoss),
              },
              { label: 'Coeficiente del indicador', value: formatNumber(indicatorCoef, 2) },
            ]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      <div className={styles.pair}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Primeras solicitudes"
          tabIndex={0}
        >
          <table className={styles.table}>
            <caption className="visually-hidden">Primeras solicitudes de crédito</caption>
            <thead>
              <tr>
                <th scope="col">Solicitud</th>
                <th scope="col">Ingreso</th>
                {stage >= 1 && <th scope="col">Faltante (M)</th>}
                <th scope="col">Impago</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, PREVIEW_ROWS).map((a, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td
                    className={`${styles.mono} ${a.missing ? (stage >= 2 ? styles.ok : styles.empty) : ''}`}
                  >
                    {a.missing
                      ? stage >= 2
                        ? formatNumber(fill, 1)
                        : 'vacío'
                      : formatNumber(a.income, 1)}
                  </td>
                  {stage >= 1 && (
                    <td className={`${styles.mono} ${a.missing ? styles.active : ''}`}>
                      {a.missing ? 1 : 0}
                    </td>
                  )}
                  <td className={styles.mono}>{a.defaulted ? 'sí' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <HBars
          labels={[
            'Real, ingreso reportado',
            'Real, ingreso faltante',
            'Modelo sin indicador',
            'Modelo con indicador',
          ]}
          values={bars}
          highlight={1}
          axisLabel="Tasa o probabilidad de impago"
          labelWidth={160}
          decimals={3}
          domain={[0, 1]}
          label={description}
        />
      </div>
    </VizFrame>
  );
}
