import { useMemo, useState } from 'react';
import { multinomial } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PascalTriangle.module.css';

const CELLS_PER_SECOND = 3;
const MIN_LABEL_WIDTH = 28;

interface MultinomialViewProps {
  title: string;
  n: number;
}

/** Monomial x^i y^j z^k written in LaTeX, omitting unit exponents. */
function monomial(i: number, j: number, k: number): string {
  const part = (variable: string, power: number) =>
    power === 0 ? '' : power === 1 ? variable : `${variable}^{${power}}`;
  return `${part('x', i)}${part('y', j)}${part('z', k)}` || '1';
}

/**
 * Coefficients of (x + y + z)^n on a triangular grid: the term x^i y^j z^k
 * appears once for every word with i x's, j y's and k z's, so its coefficient
 * is the multinomial n! / (i! j! k!). The coefficients add up to 3^n.
 */
export function MultinomialView({ title, n }: MultinomialViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Exponente',
        symbol: 'n',
        min: 1,
        max: 9,
        step: 1,
        default: n,
      },
    ],
    [n],
  );
  const parameters = useParameters(definitions);
  const power = Number((parameters.values as Record<string, number>).n);
  const cells = Array.from({ length: power + 1 }, (_, k) =>
    Array.from({ length: power - k + 1 }, (_, j) => ({
      i: power - k - j,
      j,
      k,
      value: multinomial([power - k - j, j, k]),
    })),
  ).flat();
  const total = cells.length;
  const largest = Math.max(...cells.map((cell) => cell.value));
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${power}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: CELLS_PER_SECOND * Math.max(1, power / 4),
    done: shown >= total,
  });
  const current = shown > 0 ? cells[shown - 1] : undefined;
  const accumulated = cells.slice(0, shown).reduce((sum, cell) => sum + cell.value, 0);
  const example = current
    ? `${'x'.repeat(current.i)}${'y'.repeat(current.j)}${'z'.repeat(current.k)}`
    : '';
  const description =
    `Coeficientes de (x + y + z)^${power}: ${total} términos que suman 3^${power} = ${3 ** power}. ` +
    (current
      ? `El término con i = ${current.i}, j = ${current.j}, k = ${current.k} tiene coeficiente ${current.value}, las palabras distintas que se forman con ${example}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        {
          label: 'Término actual',
          value: current ? `(${current.i}, ${current.j}, ${current.k})` : 'ninguno',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Coeficiente',
          value: current
            ? `${power}!/(${current.i}! ${current.j}! ${current.k}!) = ${current.value}`
            : 'ninguno',
        },
        { label: 'Suma acumulada', value: String(accumulated), color: DATA_COLORS.primary },
        { label: '3ⁿ', value: String(3 ** power), color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`(x + y + z)^{${power}} = \\sum_{i + j + k = ${power}} \\frac{${power}!}{i!\\,j!\\,k!}\\,x^{i} y^{j} z^{k}${current ? `\\qquad ${current.value}\\,${monomial(current.i, current.j, current.k)}` : ''}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={480}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const size = Math.min(box.inner.width / (power + 1), box.inner.height / (power + 1));
          const cx = box.inner.left + box.inner.width / 2;
          return (
            <g aria-hidden="true">
              {cells.map((cell, index) => {
                const x = cx + (cell.j - (power - cell.k) / 2) * size;
                const y = box.inner.top + cell.k * size + size / 2;
                const visible = index < shown;
                const isCurrent = index === shown - 1;
                return (
                  <g key={`${cell.i}-${cell.j}-${cell.k}`} opacity={visible ? 1 : 0.12}>
                    <rect
                      x={x - size / 2 + 1}
                      y={y - size / 2 + 1}
                      width={size - 2}
                      height={size - 2}
                      rx={6}
                      fill={isCurrent ? DATA_COLORS.highlight : DATA_COLORS.primary}
                      fillOpacity={isCurrent ? 0.5 : 0.1 + (0.5 * cell.value) / largest}
                      stroke="var(--color-border)"
                    />
                    {size >= MIN_LABEL_WIDTH && (
                      <text
                        x={x}
                        y={y}
                        dy="0.35em"
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: Math.min(13, size / 3.2) }}
                      >
                        {cell.value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
