import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { classifyPairs, distanceCorrelation } from '../../../lib/stats/association.ts';
import {
  covariance,
  kendallTau,
  linearRegression,
  mean,
  pearson,
  ranks,
  spearman,
  standardDeviation,
} from '../../../lib/stats/index.ts';
import { generatePairs } from '../../../lib/stats/pairs.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';
import { paddedDomain } from './pairDomain.ts';
import { PairPlot } from './PairPlot.tsx';
import { MEASURE_NAMES } from './measureNames.ts';
import type { GeneratorSpec, PairMeasure } from './schema.ts';

const STEPS_PER_SECOND = 2.5;
const PAIRS_PER_SECOND = 4;
const RANK_MORPH_STEPS = 8;
const DOT_RADIUS = 6;
const RECT_OPACITY = 0.16;
const MAX_TERMS = 5;

interface CorrelationViewProps {
  title: string;
  measure: PairMeasure;
  readouts: readonly PairMeasure[];
  points?: readonly [number, number][];
  generator?: GeneratorSpec;
  names: { x: string; y: string };
  line: boolean;
  decimals: number;
  seed: number;
}

function value(measure: PairMeasure, x: number[], y: number[]): number {
  if (x.length < 3) return Number.NaN;
  switch (measure) {
    case 'covarianza':
      return covariance(x, y);
    case 'pearson':
      return pearson(x, y);
    case 'spearman':
      return spearman(x, y);
    case 'kendall':
      return kendallTau(x, y);
    case 'distancia':
      return distanceCorrelation(x, y).dCor;
  }
}

function list(terms: string[]): string {
  return terms.length <= MAX_TERMS
    ? terms.join(' + ')
    : [...terms.slice(0, 3), '\\dots', ...terms.slice(-1)].join(' + ');
}

/**
 * A scatter of draggable points with the computation of one association
 * measure animated: rectangles of products for the covariance, a morph to
 * ranks for Spearman, pairs judged one by one for Kendall.
 */
export function CorrelationView(props: CorrelationViewProps) {
  const { title, measure, names, line, decimals } = props;
  const seed = useSeed(props.seed);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const key = `${JSON.stringify(props.points ?? props.generator)}|${seed.seed}|${run}`;
  const initialPoints = () =>
    props.points
      ? props.points.map(([px, py]) => [px, py] as [number, number])
      : props.generator
        ? generatePairs(
            {
              shape: props.generator.tipo,
              n: props.generator.n,
              ...(props.generator.ruido === undefined ? {} : { noise: props.generator.ruido }),
              ...(props.generator.pendiente === undefined
                ? {}
                : { slope: props.generator.pendiente }),
            },
            new Random(seed.seed),
          )
        : [];
  const n0 = props.points?.length ?? props.generator?.n ?? 0;
  const totalSteps =
    measure === 'kendall'
      ? (n0 * (n0 - 1)) / 2
      : measure === 'spearman'
        ? 2 + RANK_MORPH_STEPS
        : n0;
  const [state, update] = useResettableState(key, () => ({
    points: initialPoints(),
    step: reducedMotion ? totalSteps : 0,
  }));
  const playback = usePlayback({
    step: () =>
      update((previous) => ({ ...previous, step: Math.min(totalSteps, previous.step + 1) })),
    reset: () => setRun((v) => v + 1),
    rate: measure === 'kendall' ? PAIRS_PER_SECOND : STEPS_PER_SECOND,
    done: state.step >= totalSteps,
  });
  const xs = state.points.map((p) => p[0]);
  const ys = state.points.map((p) => p[1]);
  const n = xs.length;
  const mx = mean(xs);
  const my = mean(ys);
  const step = state.step;
  const f = (v: number) => formatNumber(v, decimals);
  const g = (v: number) => formatNumber(v, 3);

  const rx = ranks(xs);
  const ry = ranks(ys);
  const morph =
    measure === 'spearman' ? Math.max(0, Math.min(1, (step - 2) / RANK_MORPH_STEPS)) : 0;
  const display = state.points.map(([px, py], i) => [
    px + ((rx[i] ?? 0) - px) * morph,
    py + ((ry[i] ?? 0) - py) * morph,
  ]);
  const xDomain = morph > 0 ? paddedDomain([...xs, 1, n]) : paddedDomain(xs);
  const yDomain = morph > 0 ? paddedDomain([...ys, 1, n]) : paddedDomain(ys);

  const pairs = measure === 'kendall' ? classifyPairs(xs, ys) : [];
  const judged = pairs.slice(0, step);
  const concordant = judged.filter((p) => p.kind === 'concordante').length;
  const discordant = judged.filter((p) => p.kind === 'discordante').length;
  const currentPair =
    measure === 'kendall' && step > 0 && step <= pairs.length ? pairs[step - 1] : undefined;

  const products = xs.map((x, i) => (x - mx) * ((ys[i] ?? 0) - my));
  const shownProducts = products.slice(0, step);
  const partial = shownProducts.reduce((a, b) => a + b, 0);
  const dcor = measure === 'distancia' && n >= 3 ? distanceCorrelation(xs, ys) : null;

  let header = '';
  if (measure === 'covarianza' || measure === 'pearson') {
    const terms = shownProducts.map((p) => `(${g(p)})`);
    const cov = covariance(xs, ys);
    header =
      step < n
        ? `\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = ${list(terms) || '0'}${step < n ? ' + \\dots' : ''} = ${g(partial)}`
        : measure === 'covarianza'
          ? `s_{xy} = \\frac{${g(partial)}}{${n} - 1} = ${g(cov)}`
          : `r = \\frac{s_{xy}}{s_x s_y} = \\frac{${g(cov)}}{${g(standardDeviation(xs))} \\cdot ${g(standardDeviation(ys))}} = ${g(pearson(xs, ys))}`;
  } else if (measure === 'spearman') {
    header =
      step < 2
        ? `\\text{rangos de } x:\\ ${rx
            .slice(0, 8)
            .map((v) => formatNumber(v, 1))
            .join(',\\ ')}${n > 8 ? ',\\ \\dots' : ''}`
        : `r_s = r(\\operatorname{rango}(x), \\operatorname{rango}(y)) = ${g(spearman(xs, ys))}\\quad\\text{frente a } r = ${g(pearson(xs, ys))}`;
  } else if (measure === 'kendall') {
    const total = (n * (n - 1)) / 2;
    header = `\\tau = \\frac{C - D}{\\binom{n}{2}} \\approx \\frac{${concordant} - ${discordant}}{${total}}${step >= total ? ` \\Rightarrow \\tau_b = ${g(kendallTau(xs, ys))}` : `\\quad(${step} \\text{ de } ${total} \\text{ pares})`}`;
  } else if (dcor) {
    header = `\\operatorname{dCor} = \\sqrt{\\frac{\\operatorname{dCov}^2}{\\sqrt{\\operatorname{dVar}_x\\,\\operatorname{dVar}_y}}} = \\sqrt{\\frac{${g(dcor.dCov2)}}{\\sqrt{${g(dcor.dVarX)} \\cdot ${g(dcor.dVarY)}}}} = ${g(dcor.dCor)}\\quad(r = ${g(pearson(xs, ys))})`;
  }

  const fit = n >= 3 ? linearRegression(xs, ys) : null;
  const readoutMeasures = props.readouts.includes(measure)
    ? props.readouts
    : [measure, ...props.readouts];
  const description =
    `${n} puntos de ${names.x} y ${names.y}. ` +
    readoutMeasures
      .map((m) => `${MEASURE_NAMES[m]}: ${formatNumber(value(m, xs, ys), 3)}`)
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      {...(props.generator ? { seed } : {})}
      readouts={[
        { label: 'Puntos', value: String(n) },
        ...readoutMeasures.map((m) => ({
          label: MEASURE_NAMES[m],
          value: formatNumber(value(m, xs, ys), 3),
          ...(m === measure ? { color: DATA_COLORS.highlight } : {}),
        })),
        ...(measure === 'kendall'
          ? [
              {
                label: 'Pares concordantes',
                value: String(concordant),
                color: DATA_COLORS.positive,
              },
              {
                label: 'Pares discordantes',
                value: String(discordant),
                color: DATA_COLORS.negative,
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Observación (arrastrable)', color: DATA_COLORS.text, shape: 'circle' },
        ...(measure === 'covarianza' || measure === 'pearson'
          ? [
              { label: 'Producto positivo', color: DATA_COLORS.positive },
              { label: 'Producto negativo', color: DATA_COLORS.negative },
            ]
          : []),
        ...(measure === 'kendall'
          ? [
              { label: 'Par concordante', color: DATA_COLORS.positive, shape: 'line' as const },
              { label: 'Par discordante', color: DATA_COLORS.negative, shape: 'line' as const },
            ]
          : []),
        ...(line
          ? [
              {
                label: 'Recta de mínimos cuadrados',
                color: DATA_COLORS.primary,
                shape: 'line' as const,
              },
            ]
          : []),
      ]}
      description={description}
      dataTable={{
        caption: `Valores de ${names.x} y ${names.y}`,
        columns: [
          names.x,
          names.y,
          ...(measure === 'spearman' ? ['Rango de x', 'Rango de y'] : []),
        ],
        rows: state.points.map(([px, py], i) => [
          f(px),
          f(py),
          ...(measure === 'spearman'
            ? [formatNumber(rx[i] ?? 0, 1), formatNumber(ry[i] ?? 0, 1)]
            : []),
        ]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <PairPlot
        xDomain={xDomain}
        yDomain={yDomain}
        xLabel={morph > 0.5 ? `Rango de ${names.x}` : names.x}
        yLabel={morph > 0.5 ? `Rango de ${names.y}` : names.y}
        label={description}
        interactive
      >
        {({ x, y, left, right, top, bottom }) => (
          <g>
            {(measure === 'covarianza' || measure === 'pearson') && (
              <g aria-hidden="true">
                {state.points.slice(0, step).map(([px, py], i) => {
                  const positive = (products[i] ?? 0) >= 0;
                  return (
                    <rect
                      key={i}
                      x={Math.min(x(px), x(mx))}
                      y={Math.min(y(py), y(my))}
                      width={Math.abs(x(px) - x(mx))}
                      height={Math.abs(y(py) - y(my))}
                      fill={positive ? DATA_COLORS.positive : DATA_COLORS.negative}
                      fillOpacity={RECT_OPACITY}
                      stroke={positive ? DATA_COLORS.positive : DATA_COLORS.negative}
                      strokeOpacity={0.6}
                    />
                  );
                })}
                <line
                  x1={x(mx)}
                  x2={x(mx)}
                  y1={top}
                  y2={bottom}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="5 4"
                />
                <line
                  x1={left}
                  x2={right}
                  y1={y(my)}
                  y2={y(my)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="5 4"
                />
                <text x={x(mx) + 4} y={top + 12} className={styles.chartLabel}>
                  x̄
                </text>
                <text x={right - 14} y={y(my) - 6} className={styles.chartLabel}>
                  ȳ
                </text>
              </g>
            )}
            {judged.length > 0 && (
              <g aria-hidden="true">
                {currentPair && (
                  <line
                    x1={x(display[currentPair.i]?.[0] ?? 0)}
                    y1={y(display[currentPair.i]?.[1] ?? 0)}
                    x2={x(display[currentPair.j]?.[0] ?? 0)}
                    y2={y(display[currentPair.j]?.[1] ?? 0)}
                    stroke={
                      currentPair.kind === 'concordante'
                        ? DATA_COLORS.positive
                        : currentPair.kind === 'discordante'
                          ? DATA_COLORS.negative
                          : DATA_COLORS.muted
                    }
                    strokeWidth={3}
                  />
                )}
              </g>
            )}
            {line && fit && morph === 0 && (
              <line
                x1={left}
                x2={right}
                y1={y(fit.intercept + fit.slope * x.invert(left))}
                y2={y(fit.intercept + fit.slope * x.invert(right))}
                stroke={DATA_COLORS.primary}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
            {display.map(([px = 0, py = 0], i) => (
              <DraggablePoint
                key={i}
                x={x(px)}
                y={y(py)}
                radius={DOT_RADIUS}
                color={DATA_COLORS.text}
                label={`Punto ${i + 1}`}
                valueText={`${names.x} ${f(state.points[i]?.[0] ?? 0)}, ${names.y} ${f(state.points[i]?.[1] ?? 0)}`}
                onDrag={(sx, sy) => {
                  if (morph > 0) return;
                  playback.pause();
                  const nx = Number(x.invert(sx).toFixed(decimals));
                  const ny = Number(y.invert(sy).toFixed(decimals));
                  update((previous) => ({
                    ...previous,
                    points: previous.points.map((p, j) => (j === i ? [nx, ny] : p)),
                  }));
                }}
              />
            ))}
          </g>
        )}
      </PairPlot>
    </VizFrame>
  );
}
