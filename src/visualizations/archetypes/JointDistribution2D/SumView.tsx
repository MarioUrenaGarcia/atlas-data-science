import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { distributionOf, type JointPmf } from '../../../lib/probability/joint.ts';
import { makePmf, type FinitePmf } from '../../../lib/probability/randomVariable.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from '../RandomVariableLab/PmfChart.tsx';
import { niceStep, type VariableSource } from '../RandomVariableLab/source.ts';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { nearestIndex, resolveJoint } from './source.ts';

const DISCRETE_RATE = 1;
const DENSE_STEPS = 60;
const DENSE_RATE = 10;
const MAX_LISTED = 6;

interface SumViewProps {
  title: string;
  config: JointDistribution2DConfig;
}

/** Distribution of X + Y for a discretized density, regrouped in bins as wide as one grid cell. */
function binnedSum(joint: JointPmf, width: number): FinitePmf {
  const raw = distributionOf(joint, (x, y) => x + y);
  const origin = (joint.xs[0] ?? 0) + (joint.ys[0] ?? 0);
  const values = raw.values.map((s) => origin + Math.round((s - origin) / width) * width);
  return makePmf(values, raw.probs);
}

/**
 * The distribution of S = X + Y read off the joint distribution: the cells
 * with x + y = s lie on an anti-diagonal, and P(S = s) is the sum of their
 * probabilities. Sweeping s builds the whole distribution of the sum at the
 * right; for independent variables this sum along diagonals is the
 * convolution of the marginals.
 */
export function SumView({ title, config }: SumViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const sum = useMemo(
    () => (continuous ? binnedSum(joint, source.cellX) : distributionOf(joint, (x, y) => x + y)),
    [joint, continuous, source.cellX],
  );
  const sMin = sum.values[0] ?? 0;
  const sMax = sum.values.at(-1) ?? 0;
  const gaps = sum.values.slice(1).map((v, k) => v - (sum.values[k] ?? v));
  const step = continuous ? niceStep(sMax - sMin) : gaps.length > 0 ? Math.min(...gaps) : 1;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 's',
        label: 'Valor de la suma',
        symbol: 's',
        min: Number(sMin.toFixed(2)),
        max: Number(sMax.toFixed(2)),
        step: Number(step.toPrecision(3)),
        digits: continuous ? 2 : 0,
        default: config.s ?? sum.values[Math.floor(sum.values.length / 2)] ?? 0,
      },
    ],
    // The range derives from the configuration, which is fixed per figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const s = values.s ?? 0;
  const sweep = continuous ? (sMax - sMin) / DENSE_STEPS : step;
  const playback = usePlayback({
    step: () => parameters.set('s', Math.min(sMax, s + sweep)),
    reset: () => parameters.set('s', sMin),
    rate: continuous ? DENSE_RATE : DISCRETE_RATE,
    done: s >= sMax - sweep / 2,
    autoplay: false,
  });

  const k = nearestIndex(sum.values, s);
  const sValue = sum.values[k] ?? 0;
  const half = continuous ? source.cellX / 2 : 1e-9;
  const onLine = (i: number, j: number) =>
    Math.abs((joint.xs[i] ?? 0) + (joint.ys[j] ?? 0) - sValue) <= half + 1e-12;
  const cells: number[] = [];
  joint.xs.forEach((_x, i) =>
    joint.ys.forEach((_y, j) => {
      const p = joint.p[i]?.[j] ?? 0;
      if (p > 0 && onLine(i, j)) cells.push(p);
    }),
  );
  const pS = sum.probs[k] ?? 0;
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, 3);
  const sText = formatNumber(sValue, continuous ? 2 : 3);
  const header = continuous
    ? `f_{${sx} + ${sy}}(${sText}) = \\int f(x, ${sText} - x)\\, dx \\approx ${f(pS / source.cellX)}`
    : `P(${sx} + ${sy} = ${sText}) = \\sum_x p(x, ${sText} - x) = ${(cells.length > MAX_LISTED ? [...cells.slice(0, 3).map(f), '\\cdots'] : cells.map(f)).join(' + ') || '0'} = ${f(pS)}`;
  const sumSource: VariableSource = {
    pmf: sum,
    label: `${source.labelX} más ${source.labelY}`,
    symbol: `${sx} + ${sy}`,
    continuous,
    cell: source.cellX,
    domain: [sMin - step, sMax + step],
  };
  const mean = sum.values.reduce((a, v, n) => a + v * (sum.probs[n] ?? 0), 0);
  const description =
    `Suma de ${source.labelX} y ${source.labelY}. En s = ${sText}, ` +
    `${continuous ? `densidad ${f(pS / source.cellX)}` : `probabilidad ${f(pS)}`}. Media de la suma ${f(mean)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 's', value: sText, color: DATA_COLORS.highlight },
        {
          label: continuous ? 'Densidad de la suma en s' : 'P(X + Y = s)',
          value: f(continuous ? pS / source.cellX : pS),
          color: DATA_COLORS.secondary,
        },
        { label: 'Celdas sobre la diagonal', value: String(cells.length) },
        { label: 'E[X + Y]', value: f(mean) },
      ]}
      legend={[
        { label: 'Celdas con x + y = s', color: DATA_COLORS.highlight },
        { label: 'Distribución de X + Y', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <JointGrid
          source={source}
          label={description}
          aspect={0.95}
          maxHeight={380}
          paint={(i, j) =>
            onLine(i, j) ? { color: DATA_COLORS.highlight } : { color: DATA_COLORS.primary }
          }
          overlay={({ x, y }) => {
            // The line x + y = s, cut to the part that lies inside the plotting window.
            const [x0, x1] = source.xDomain;
            const [y0, y1] = source.yDomain;
            const from = Math.max(x0, sValue - y1);
            const to = Math.min(x1, sValue - y0);
            if (from > to) return null;
            return (
              <line
                aria-hidden="true"
                x1={x(from)}
                y1={y(sValue - from)}
                x2={x(to)}
                y2={y(sValue - to)}
                stroke={DATA_COLORS.highlight}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            );
          }}
        />
        <PmfChart
          source={sumSource}
          label={description}
          aspect={0.9}
          color={(n) => (n === k ? DATA_COLORS.highlight : DATA_COLORS.secondary)}
          opacity={(n) => ((sum.values[n] ?? 0) <= sValue + 1e-9 ? 0.85 : 0.3)}
          showValues={sum.values.length <= 13}
        />
      </div>
      <p className={styles.caption}>
        La línea punteada une los pares con la misma suma. Al recorrer s, cada diagonal deposita su
        probabilidad en una barra de la distribución de X + Y.
      </p>
    </VizFrame>
  );
}
