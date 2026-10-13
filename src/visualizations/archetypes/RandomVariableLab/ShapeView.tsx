import { useMemo, useState } from 'react';
import {
  centralMoment,
  excessKurtosisOf,
  expectationOf,
  medianInterval,
  modesOf,
  rawMoment,
  skewnessOf,
  varianceOf,
} from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import {
  centralFromRaw,
  momentsOf,
  resolveSource,
  snapZero,
  type VariableSource,
} from './source.ts';

const STAGES_PER_SECOND = 0.8;
/** Stages: show the distribution, then the contributions, then the total. */
const LAST_STAGE = 2;
/** Accuracy of skewness and kurtosis from Simpson-integrated moments. */
const SHAPE_TOLERANCE = 1e-6;
/** Accuracy of the parabola-refined mode on windows of unit scale or smaller. */
const MODE_TOLERANCE = 1e-3;

/**
 * Mode of a density approximated on a grid: the highest cell refined by a
 * parabola through it and its neighbors, which removes most of the error of
 * reporting a cell center.
 */
function refinedMode(values: readonly number[], probs: readonly number[], width: number): number {
  let best = 0;
  probs.forEach((p, i) => {
    if (p > (probs[best] ?? 0)) best = i;
  });
  const left = probs[best - 1];
  const right = probs[best + 1];
  const center = probs[best] ?? 0;
  const x = values[best] ?? 0;
  if (left === undefined || right === undefined) return x;
  const curvature = left - 2 * center + right;
  return curvature < 0 ? x + (width * (left - right)) / (2 * curvature) : x;
}

interface ShapeViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * Moments and shape. The upper chart marks mean, median and mode with the
 * band of one standard deviation; the lower chart shows the contribution of
 * each value to the moment of the chosen order, positive above the axis and
 * negative below, so odd central moments reveal which tail weighs more and
 * the fourth reveals how much mass sits far from the center.
 */
export function ShapeView({ title, config }: ShapeViewProps) {
  const source = resolveSource(config);
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'orden',
        label: 'Orden del momento',
        symbol: 'k',
        min: 1,
        max: 6,
        step: 1,
        default: config.orden ?? 3,
      },
      {
        type: 'select' as const,
        key: 'momento',
        label: 'Tipo de momento',
        options: [
          { value: 'central', label: 'Central, alrededor de la media' },
          { value: 'crudo', label: 'Crudo, alrededor de 0' },
        ],
        default: config.momento ?? 'central',
      },
    ],
    [config.orden, config.momento],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const k = Number(values.orden ?? 3);
  const central = values.momento !== 'crudo';
  const { pmf } = source;
  const exact = source.continuous ? source.exact : undefined;
  // Continuous sources take their summaries from the exact density; the plotting grid only
  // draws the contributions.
  const raw = exact ? momentsOf(source, Math.max(4, k)) : undefined;
  const sd = Math.sqrt(raw ? centralFromRaw(raw, 2) : varianceOf(pmf));
  const mean = snapZero(raw ? (raw[0] ?? 0) : expectationOf(pmf), sd);
  const [m0, m1] = exact ? [exact.quantile(0.5), exact.quantile(0.5)] : medianInterval(pmf);
  const median = snapZero((m0 + m1) / 2, sd);
  // A refined mode within the accuracy of the refinement is reported as exactly 0.
  const modes = exact
    ? [snapZero(refinedMode(pmf.values, pmf.probs, source.cell), source.cell, MODE_TOLERANCE)]
    : modesOf(pmf);
  const center = central ? mean : 0;
  const contributions = pmf.values.map(
    (value, index) => (value - center) ** k * (pmf.probs[index] ?? 0),
  );
  const moment = snapZero(
    raw
      ? central
        ? centralFromRaw(raw, k)
        : (raw[k - 1] ?? 0)
      : central
        ? centralMoment(pmf, k)
        : rawMoment(pmf, k),
    (sd + Math.abs(mean)) ** k,
  );
  // Simpson integration of the moments is accurate to about 1e-6, so shape coefficients
  // below that are reported as zero.
  const skew = raw
    ? snapZero(centralFromRaw(raw, 3) / sd ** 3, 1, SHAPE_TOLERANCE)
    : snapZero(skewnessOf(pmf));
  const kurt = raw
    ? snapZero(centralFromRaw(raw, 4) / sd ** 4 - 3, 1, SHAPE_TOLERANCE)
    : snapZero(excessKurtosisOf(pmf));

  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${k}|${central}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });
  const s = source.symbol;
  const symbolTex = central ? `\\mu_{${k}}` : `\\mu'_{${k}}`;
  const sumTex = central ? `\\sum_x (x - \\mu)^{${k}} p(x)` : `\\sum_x x^{${k}} p(x)`;
  const headers = [
    `\\mu = ${formatNumber(mean, 3)}, \\quad \\text{mediana} = ${formatNumber(median, 3)}, \\quad \\sigma = ${formatNumber(sd, 3)}`,
    `${symbolTex} = \\mathbb{E}[(${s}${central ? ' - \\mu' : ''})^{${k}}] = ${sumTex}`,
    k === 3 && central
      ? `\\gamma_1 = \\frac{\\mu_3}{\\sigma^3} = \\frac{${formatNumber(moment, 3)}}{${formatNumber(sd ** 3, 3)}} = ${formatNumber(skew, 3)}`
      : k === 4 && central
        ? `\\gamma_2 = \\frac{\\mu_4}{\\sigma^4} - 3 = \\frac{${formatNumber(moment, 3)}}{${formatNumber(sd ** 4, 3)}} - 3 = ${formatNumber(kurt, 3)}`
        : `${symbolTex} = ${formatNumber(moment, 4)}`,
  ];
  const lo = Math.min(0, ...contributions);
  const hi = Math.max(0, ...contributions);
  const contributionSource: VariableSource = {
    ...source,
    pmf: { values: pmf.values, probs: contributions.map(Math.abs) },
  };
  const description =
    `${source.label}. Media ${formatNumber(mean, 3)}, mediana ${formatNumber(median, 3)}, moda ${modes.map((m) => formatNumber(m, 2)).join(', ')}. ` +
    `Momento ${central ? 'central' : 'crudo'} de orden ${k}: ${formatNumber(moment, 4)}. Asimetría ${formatNumber(skew, 3)}, curtosis en exceso ${formatNumber(kurt, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Media', value: formatNumber(mean, 3), color: DATA_COLORS.secondary },
        {
          label: 'Mediana',
          value:
            m0 === m1 ? formatNumber(m0, 3) : `${formatNumber(m0, 2)} a ${formatNumber(m1, 2)}`,
          color: DATA_COLORS.tertiary,
        },
        {
          label: 'Moda',
          value: modes.length > 3 ? 'varias' : modes.map((m) => formatNumber(m, 2)).join(', '),
          color: DATA_COLORS.highlight,
        },
        {
          label: `Momento ${central ? 'central' : 'crudo'} de orden ${k}`,
          value: formatNumber(moment, 4),
          color: DATA_COLORS.primary,
        },
        { label: 'Asimetría γ₁', value: formatNumber(skew, 3) },
        { label: 'Curtosis en exceso γ₂', value: formatNumber(kurt, 3) },
      ]}
      legend={[
        { label: 'Contribución positiva', color: DATA_COLORS.primary },
        { label: 'Contribución negativa', color: DATA_COLORS.negative },
        { label: 'Banda μ ± σ', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PmfChart
        source={source}
        label={description}
        aspect={0.34}
        color={() => DATA_COLORS.neutral}
        opacity={() => 0.55}
        bands={[{ from: mean - sd, to: mean + sd, color: DATA_COLORS.secondary }]}
        markers={[
          { x: mean, label: 'media', color: DATA_COLORS.secondary },
          { x: median, label: 'mediana', color: DATA_COLORS.tertiary, dashed: true },
          ...(modes.length <= 2
            ? modes.map((m) => ({
                x: m,
                label: 'moda',
                color: DATA_COLORS.highlight,
                dashed: true,
              }))
            : []),
        ]}
        showValues={pmf.values.length <= 8}
      />
      {stage >= 1 && (
        <>
          <PmfChart
            source={contributionSource}
            label={description}
            aspect={0.28}
            yLabel={`|contribución| orden ${k}`}
            color={(index) =>
              (contributions[index] ?? 0) >= 0 ? DATA_COLORS.primary : DATA_COLORS.negative
            }
            markers={
              central ? [{ x: mean, label: '', color: DATA_COLORS.secondary, dashed: true }] : []
            }
            showValues={false}
          />
          <p className={styles.caption}>
            Cada barra es el tamaño de la contribución del valor al momento; el color indica su
            signo. Suma de las positivas:{' '}
            {formatNumber(
              contributions.filter((v) => v > 0).reduce((a, v) => a + v, 0),
              4,
            )}
            . Suma de las negativas:{' '}
            {formatNumber(
              contributions.filter((v) => v < 0).reduce((a, v) => a + v, 0),
              4,
            )}
            .{lo < 0 && hi > 0 ? ' El momento es la suma de ambas.' : ''}
          </p>
        </>
      )}
    </VizFrame>
  );
}
