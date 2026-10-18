import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  conditionalSummaries,
  conditionalYGivenX,
  marginalY,
} from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from '../RandomVariableLab/PmfChart.tsx';
import type { VariableSource } from '../RandomVariableLab/source.ts';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { nearestIndex, resolveJoint } from './source.ts';

const DISCRETE_RATE = 1;
const DENSE_RATE = 10;

interface ConditionalViewProps {
  title: string;
  config: JointDistribution2DConfig;
  /** True to draw the regression curve x -> E[Y | X = x] over the joint distribution. */
  regression: boolean;
}

/**
 * Conditioning on X = x keeps one column of the joint distribution and
 * rescales it so it adds up to one: the conditional distribution of Y, shown
 * at the right with its mean E[Y | X = x] and, dashed, the marginal of Y for
 * comparison. With the regression option the means of every column form the
 * curve E[Y | X = x], drawn over the grid.
 */
export function ConditionalView({ title, config, regression }: ConditionalViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const rows = useMemo(() => conditionalSummaries(joint), [joint]);
  const conditionable = rows.map((row) => row.x);
  const first = conditionable[0] ?? 0;
  const last = conditionable.at(-1) ?? 0;
  const gaps = conditionable.slice(1).map((value, n) => value - (conditionable[n] ?? value));
  const step = gaps.length > 0 ? Math.min(...gaps) : 1;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Valor de x en la condición',
        symbol: 'x',
        min: Number(first.toFixed(3)),
        max: Number(last.toFixed(3)),
        step: Number(step.toPrecision(3)),
        digits: continuous ? 2 : 0,
        default: config.x ?? conditionable[Math.floor(conditionable.length / 2)] ?? 0,
      },
    ],
    // The admissible values derive from the configuration, which is fixed per figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const k = nearestIndex(conditionable, values.x ?? 0);
  const i = joint.xs.indexOf(conditionable[k] ?? 0);
  const row = rows[k];
  const playback = usePlayback({
    step: () =>
      parameters.set('x', conditionable[Math.min(conditionable.length - 1, k + 1)] ?? last),
    reset: () => parameters.set('x', first),
    rate: continuous ? DENSE_RATE : DISCRETE_RATE,
    done: k >= conditionable.length - 1,
    autoplay: false,
  });

  const conditional = conditionalYGivenX(joint, i) ?? marginalY(joint);
  const marginal = marginalY(joint);
  const meanY = marginal.values.reduce((s, y, j) => s + y * (marginal.probs[j] ?? 0), 0);
  const xValue = joint.xs[i] ?? 0;
  const px = row?.weight ?? 0;
  const mean = row?.mean ?? 0;
  const sd = Math.sqrt(row?.variance ?? 0);
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, 3);
  const xText = formatNumber(xValue, continuous ? 2 : 3);
  const header = regression
    ? `\\mathbb{E}[${sy} \\mid ${sx} = ${xText}] = ${continuous ? '\\int' : '\\sum_y'} y\\, ${continuous ? 'f' : 'p'}_{${sy}\\mid ${sx}}(y \\mid ${xText})${continuous ? '\\,dy' : ''} = ${f(mean)}`
    : continuous
      ? `f_{${sy}\\mid ${sx}}(y \\mid ${xText}) = \\frac{f(${xText}, y)}{f_{${sx}}(${xText})}, \\qquad f_{${sx}}(${xText}) \\approx ${f(px / source.cellX)}`
      : `p_{${sy}\\mid ${sx}}(y \\mid ${xText}) = \\frac{p(${xText}, y)}{p_{${sx}}(${xText})} = \\frac{p(${xText}, y)}{${f(px)}}`;
  const conditionalSource: VariableSource = {
    pmf: conditional,
    label: `${source.labelY} dado X = ${xText}`,
    symbol: sy,
    continuous,
    cell: source.cellY,
    domain: source.yDomain,
  };
  const marginalPoints = marginal.values.map((y, j) => ({
    x: y,
    y: continuous ? (marginal.probs[j] ?? 0) / source.cellY : (marginal.probs[j] ?? 0),
  }));
  const description =
    `Distribución condicional de ${source.labelY} dado que ${source.labelX} vale ${xText}. ` +
    `Media condicional ${f(mean)}, desviación estándar condicional ${f(sd)}; media sin condicionar ${f(meanY)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: `Condición: x`, value: xText, color: DATA_COLORS.highlight },
        {
          label: continuous ? 'Densidad marginal en x' : 'P(X = x)',
          value: f(continuous ? px / source.cellX : px),
        },
        { label: 'E[Y | X = x]', value: f(mean), color: DATA_COLORS.secondary },
        { label: 'DE(Y | X = x)', value: f(sd) },
        { label: 'E[Y] sin condición', value: f(meanY), color: DATA_COLORS.muted },
      ]}
      legend={[
        { label: 'Columna X = x', color: DATA_COLORS.highlight },
        { label: 'Distribución condicional de Y', color: DATA_COLORS.secondary },
        { label: 'Marginal de Y', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'E[Y] sin condición', color: DATA_COLORS.muted, shape: 'line' },
        ...(regression
          ? [{ label: 'Curva E[Y | X = x]', color: DATA_COLORS.text, shape: 'line' as const }]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <JointGrid
          source={source}
          label={description}
          aspect={0.9}
          maxHeight={380}
          showMarginals={false}
          paint={(ci) =>
            ci === i
              ? { color: DATA_COLORS.highlight }
              : { color: DATA_COLORS.primary, opacity: undefined }
          }
          overlay={({ x, y }) =>
            regression ? (
              <g aria-hidden="true">
                <CurvePath
                  points={rows.map((r) => ({ x: r.x, y: r.mean }))}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.text}
                  width={2.5}
                  animate={false}
                />
                <circle cx={x(xValue)} cy={y(mean)} r={6} fill={DATA_COLORS.secondary} />
              </g>
            ) : (
              <circle
                aria-hidden="true"
                cx={x(xValue)}
                cy={y(mean)}
                r={5}
                fill={DATA_COLORS.secondary}
              />
            )
          }
        />
        <PmfChart
          source={conditionalSource}
          label={description}
          aspect={0.9}
          color={() => DATA_COLORS.secondary}
          markers={[
            { x: mean, label: `E[Y | x] = ${formatNumber(mean, 2)}`, color: DATA_COLORS.secondary },
            // The unconditional mean is named in the legend and the readouts; a second text label
            // next to the conditional one would overlap it whenever the two means are close.
            { x: meanY, label: '', color: DATA_COLORS.muted },
          ]}
          showValues={conditional.values.length <= 8}
          overlay={({ x, y }) => (
            <CurvePath
              points={marginalPoints}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.muted}
              dashed
              step={!continuous}
              animate={false}
            />
          )}
        />
      </div>
      <p className={styles.caption}>
        {regression
          ? 'Cada columna tiene su propia media; la curva las une. La media condicional cambia con x cuando X informa sobre Y.'
          : 'La columna elegida se reescala para sumar 1: esa es la distribución de Y cuando se sabe que X vale x. La línea punteada es la marginal de Y, sin condición.'}
      </p>
    </VizFrame>
  );
}
