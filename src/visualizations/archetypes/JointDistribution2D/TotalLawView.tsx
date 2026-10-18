import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  conditionalSummaries,
  marginalY,
  varianceDecomposition,
} from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './JointDistribution2D.module.css';
import type { JointDistribution2DConfig } from './schema.ts';
import { resolveJoint } from './source.ts';

const DISCRETE_RATE = 1.2;
const DENSE_RATE = 16;
const MAX_LISTED = 4;
/** Radius of the point of the most probable value of X; the others scale by area. */
const MAX_RADIUS = 11;
const BAR_HEIGHT = 26;

interface TotalLawViewProps {
  title: string;
  config: JointDistribution2DConfig;
  /** True for the law of total variance; false for the law of total expectation. */
  variance: boolean;
}

/**
 * The laws of total expectation and total variance. Each value x of X
 * contributes its conditional mean E[Y | X = x] (a point whose area is
 * P(X = x)) with a bar of one conditional standard deviation. The animation
 * adds the terms P(X = x) E[Y | X = x], which build E[Y]; with the variance
 * option a final bar splits Var(Y) into the spread of the conditional means
 * and the average spread inside each value of X.
 */
export function TotalLawView({ title, config, variance }: TotalLawViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const rows = useMemo(() => conditionalSummaries(joint), [joint]);
  const decomposition = useMemo(() => varianceDecomposition(joint), [joint]);
  const marginal = marginalY(joint);
  const meanY = marginal.values.reduce((s, y, j) => s + y * (marginal.probs[j] ?? 0), 0);
  const n = rows.length;
  const total = variance ? n + 1 : n;

  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: continuous ? DENSE_RATE : DISCRETE_RATE,
    done: stage >= total,
  });
  const added = Math.min(stage, n);
  const partial = rows.slice(0, added).reduce((s, row) => s + row.weight * row.mean, 0);
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, 3);
  const finished = stage > n;
  const header = (() => {
    if (variance && finished) {
      return `\\operatorname{Var}(${sy}) = \\underbrace{\\operatorname{Var}(\\mathbb{E}[${sy} \\mid ${sx}])}_{${f(decomposition.explained)}} + \\underbrace{\\mathbb{E}[\\operatorname{Var}(${sy} \\mid ${sx})]}_{${f(decomposition.unexplained)}} = ${f(decomposition.total)}`;
    }
    if (added === 0) {
      return variance
        ? `\\operatorname{Var}(${sy}) = \\operatorname{Var}(\\mathbb{E}[${sy} \\mid ${sx}]) + \\mathbb{E}[\\operatorname{Var}(${sy} \\mid ${sx})]`
        : `\\mathbb{E}[${sy}] = \\mathbb{E}\\big[\\mathbb{E}[${sy} \\mid ${sx}]\\big] = \\sum_x P(${sx} = x)\\, \\mathbb{E}[${sy} \\mid ${sx} = x]`;
    }
    const terms = rows
      .slice(0, added)
      .map((row) => `${f(row.weight)} \\cdot ${formatNumber(row.mean, 2)}`);
    const listed =
      terms.length > MAX_LISTED ? [...terms.slice(0, 2), '\\cdots', ...terms.slice(-1)] : terms;
    return `\\mathbb{E}[${sy}] ${added < n ? '\\approx' : '='} ${listed.join(' + ')}${added < n ? ' + \\cdots' : ''} = ${f(added < n ? partial : meanY)}`;
  })();
  const description =
    `${source.labelY} según ${source.labelX}. ` +
    `E[Y] = ${f(meanY)}. Var(Y) = ${f(decomposition.total)}: ${f(decomposition.explained)} entre valores de X y ${f(decomposition.unexplained)} dentro de cada valor.`;
  const maxWeight = Math.max(1e-12, ...rows.map((row) => row.weight));
  const spread = rows.flatMap((row) => [
    row.mean - Math.sqrt(row.variance),
    row.mean + Math.sqrt(row.variance),
  ]);
  const yLo = Math.min(source.yDomain[0], ...spread);
  const yHi = Math.max(source.yDomain[1], ...spread);

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'E[Y]', value: f(meanY), color: DATA_COLORS.secondary },
        { label: 'Suma parcial', value: f(partial) },
        ...(variance
          ? [
              {
                label: 'Var(E[Y | X])',
                value: f(decomposition.explained),
                color: DATA_COLORS.primary,
              },
              {
                label: 'E[Var(Y | X)]',
                value: f(decomposition.unexplained),
                color: DATA_COLORS.highlight,
              },
              { label: 'Var(Y)', value: f(decomposition.total) },
            ]
          : []),
      ]}
      legend={[
        { label: 'E[Y | X = x], área según P(X = x)', color: DATA_COLORS.primary, shape: 'circle' },
        {
          label: 'Más y menos una desviación condicional',
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
        { label: 'E[Y]', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Resumen por valor de X',
        columns: ['x', 'P(X = x)', 'E[Y | X = x]', 'Var(Y | X = x)'],
        rows: rows.map((row) => [
          formatNumber(row.x, 2),
          f(row.weight),
          f(row.mean),
          f(row.variance),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.45} minHeight={240} maxHeight={360}>
        {(box) => {
          const x = scaleLinear()
            .domain(source.xDomain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([yLo, yHi])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={sy.replace(/[_^{}]/g, '')}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                tickValues={continuous || rows.length > 12 ? undefined : rows.map((row) => row.x)}
                label={sx.replace(/[_^{}]/g, '')}
              />
              <g aria-hidden="true">
                {rows.map((row, k) => {
                  const active = k < added;
                  const sd = Math.sqrt(row.variance);
                  const r = MAX_RADIUS * Math.sqrt(row.weight / maxWeight);
                  return (
                    <g key={k} opacity={active ? 1 : 0.3}>
                      <line
                        x1={x(row.x)}
                        x2={x(row.x)}
                        y1={y(row.mean - sd)}
                        y2={y(row.mean + sd)}
                        stroke={DATA_COLORS.highlight}
                        strokeWidth={continuous ? 1.5 : 3}
                      />
                      <circle
                        cx={x(row.x)}
                        cy={y(row.mean)}
                        r={Math.max(continuous ? 1.5 : 3, r)}
                        fill={DATA_COLORS.primary}
                      />
                    </g>
                  );
                })}
                {added >= n && (
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(meanY)}
                    y2={y(meanY)}
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
      {variance && (
        <ChartSvg
          label={description}
          aspect={0.08}
          minHeight={BAR_HEIGHT + 52}
          maxHeight={BAR_HEIGHT + 52}
          margins={{ top: 6, right: 20, bottom: 46, left: 52 }}
        >
          {(box) => {
            const scale = scaleLinear()
              .domain([0, Math.max(1e-12, decomposition.total)])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const shown = finished ? 1 : 0;
            const split = scale(decomposition.explained);
            return (
              <>
                <Axis
                  scale={scale}
                  orientation="bottom"
                  position={box.inner.top + BAR_HEIGHT}
                  ticks={5}
                  label="Var(Y)"
                />
                <g aria-hidden="true" opacity={shown ? 1 : 0.15}>
                  <rect
                    x={box.inner.left}
                    y={box.inner.top}
                    width={Math.max(0, split - box.inner.left)}
                    height={BAR_HEIGHT}
                    fill={DATA_COLORS.primary}
                  />
                  <rect
                    x={split}
                    y={box.inner.top}
                    width={Math.max(0, scale(decomposition.total) - split)}
                    height={BAR_HEIGHT}
                    fill={DATA_COLORS.highlight}
                  />
                </g>
              </>
            );
          }}
        </ChartSvg>
      )}
      <p className={styles.caption}>
        {variance
          ? 'Las barras verticales miden la dispersión de Y dentro de cada valor de X; la separación entre los puntos mide la dispersión de las medias. La barra de abajo reparte Var(Y) entre las dos partes.'
          : 'Cada punto es la media de Y en un valor de X, con área proporcional a su probabilidad. Promediar los puntos con esos pesos da exactamente E[Y], la línea punteada.'}
      </p>
    </VizFrame>
  );
}
