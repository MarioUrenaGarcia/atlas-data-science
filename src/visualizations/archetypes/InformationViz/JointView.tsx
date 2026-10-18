import { useState } from 'react';
import { jointInformation, marginals } from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InformationViz.module.css';

const STEPS = 20;
const STEPS_PER_SECOND = 4;
/** Vertical positions, in plot units, of the H(X) bar, the H(Y) bar and the joint bar. */
const ROW_X = 2.4;
const ROW_Y = 1.4;
const ROW_JOINT = 0.4;
const BAR_HEIGHT = 0.6;
const DIM = 0.25;

export type JointFocus = 'conjunta' | 'condicional' | 'mutua';

interface JointViewProps {
  title: string;
  table: readonly (readonly number[])[];
  focus: JointFocus;
  rows?: readonly string[];
  columns?: readonly string[];
}

/**
 * A joint distribution of two discrete variables and its information
 * diagram: H(X) and H(Y) overlap in I(X; Y), the parts outside the overlap are
 * the conditional entropies and the whole is H(X, Y). The animation goes from
 * the independent table with the same marginals to the given one, so the
 * overlap grows from zero to the mutual information.
 */
export function JointView({ title, table, focus, rows, columns }: JointViewProps) {
  const total = table.flat().reduce((a, b) => a + b, 0) || 1;
  const target = table.map((row) => row.map((v) => v / total));
  const { px, py } = marginals(target);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const t = step / STEPS;
  const joint = target.map((row, i) =>
    row.map((v, j) => (1 - t) * (px[i] ?? 0) * (py[j] ?? 0) + t * v),
  );
  const info = jointInformation(joint);
  const rowNames = rows ?? px.map((_, i) => `x${i + 1}`);
  const colNames = columns ?? py.map((_, j) => `y${j + 1}`);
  // The width is fixed at H(X) + H(Y), the joint entropy under independence, so the bars visibly shrink as dependence grows.
  const span = info.hx + info.hy || 1;
  const strength = (part: JointFocus | 'x' | 'y') =>
    focus === 'conjunta' || part === focus || (focus === 'condicional' && part === 'x') ? 1 : DIM;
  const header =
    focus === 'mutua'
      ? `I(X;Y) = H(X) + H(Y) - H(X,Y) = ${formatNumber(info.hx, 3)} + ${formatNumber(info.hy, 3)} - ${formatNumber(info.hxy, 3)} = ${formatNumber(info.mutual, 3)}`
      : focus === 'condicional'
        ? `H(X \\mid Y) = H(X,Y) - H(Y) = ${formatNumber(info.hxy, 3)} - ${formatNumber(info.hy, 3)} = ${formatNumber(info.hxGivenY, 3)}`
        : `H(X,Y) = -\\sum_{x,y} p(x,y)\\log_2 p(x,y) = ${formatNumber(info.hxy, 3)}\\ \\le\\ H(X) + H(Y) = ${formatNumber(info.hx + info.hy, 3)}`;
  const description =
    `Dependencia ${Math.round(t * 100)} %: H(X) = ${formatNumber(info.hx, 3)}, H(Y) = ${formatNumber(info.hy, 3)}, H(X,Y) = ${formatNumber(info.hxy, 3)}, ` +
    `H(X|Y) = ${formatNumber(info.hxGivenY, 3)}, H(Y|X) = ${formatNumber(info.hyGivenX, 3)}, I(X;Y) = ${formatNumber(info.mutual, 3)} bits.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'H(X)', value: formatNumber(info.hx, 3), color: DATA_COLORS.primary },
        { label: 'H(Y)', value: formatNumber(info.hy, 3), color: DATA_COLORS.secondary },
        { label: 'H(X, Y)', value: formatNumber(info.hxy, 3) },
        { label: 'H(X | Y)', value: formatNumber(info.hxGivenY, 3) },
        { label: 'H(Y | X)', value: formatNumber(info.hyGivenX, 3) },
        { label: 'I(X; Y)', value: formatNumber(info.mutual, 3), color: DATA_COLORS.highlight },
        { label: 'Del independiente a la tabla', value: `${Math.round(t * 100)} %` },
      ]}
      legend={[
        { label: 'H(X | Y), solo X', color: DATA_COLORS.primary },
        { label: 'I(X; Y), compartida', color: DATA_COLORS.highlight },
        { label: 'H(Y | X), solo Y', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={`${header}\\ \\text{bits}`} />
      <div className={styles.pair}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>X \ Y</th>
              {colNames.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th>p(x)</th>
            </tr>
          </thead>
          <tbody>
            {joint.map((row, i) => (
              <tr key={i}>
                <th>{rowNames[i]}</th>
                {row.map((v, j) => (
                  <td key={j}>{formatNumber(v, 3)}</td>
                ))}
                <td>{formatNumber(px[i] ?? 0, 3)}</td>
              </tr>
            ))}
            <tr>
              <th>p(y)</th>
              {py.map((v, j) => (
                <td key={j}>{formatNumber(v, 3)}</td>
              ))}
              <td>1</td>
            </tr>
          </tbody>
        </table>
        <FunctionPlot
          xDomain={[0, span]}
          yDomain={[0, 3.2]}
          xLabel="bits"
          label={`Diagrama de información. ${description}`}
          curves={[]}
          aspect={0.55}
        >
          {({ x, y }) => {
            const bar = (
              from: number,
              to: number,
              row: number,
              color: string,
              opacity: number,
              key: string,
            ) => (
              <rect
                key={key}
                x={x(from)}
                width={Math.max(0, x(to) - x(from))}
                y={y(row + BAR_HEIGHT)}
                height={y(row) - y(row + BAR_HEIGHT)}
                fill={color}
                fillOpacity={0.8 * opacity}
              />
            );
            const a = info.hxGivenY;
            const b = info.hxGivenY + info.mutual;
            return (
              <g aria-hidden="true">
                {bar(0, a, ROW_X, DATA_COLORS.primary, strength('x'), 'xa')}
                {bar(a, b, ROW_X, DATA_COLORS.highlight, strength('mutua'), 'xb')}
                {bar(a, b, ROW_Y, DATA_COLORS.highlight, strength('mutua'), 'yb')}
                {bar(b, info.hxy, ROW_Y, DATA_COLORS.secondary, strength('y'), 'yc')}
                {bar(0, a, ROW_JOINT, DATA_COLORS.primary, strength('conjunta'), 'ja')}
                {bar(a, b, ROW_JOINT, DATA_COLORS.highlight, strength('conjunta'), 'jb')}
                {bar(b, info.hxy, ROW_JOINT, DATA_COLORS.secondary, strength('conjunta'), 'jc')}
                <text x={x(0)} y={y(ROW_X + BAR_HEIGHT) - 4} fontSize={12} fill="var(--color-text)">
                  H(X)
                </text>
                <text x={x(a)} y={y(ROW_Y + BAR_HEIGHT) - 4} fontSize={12} fill="var(--color-text)">
                  H(Y)
                </text>
                <text
                  x={x(0)}
                  y={y(ROW_JOINT + BAR_HEIGHT) - 4}
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  H(X, Y)
                </text>
              </g>
            );
          }}
        </FunctionPlot>
      </div>
    </VizFrame>
  );
}
