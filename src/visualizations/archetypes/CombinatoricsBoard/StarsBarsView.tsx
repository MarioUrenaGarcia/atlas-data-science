import { useMemo, useState } from 'react';
import { multisetCount, multisets } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { enumerationRate } from './pace.ts';

const SYMBOL_WIDTH = 30;
const STAR_RADIUS = 10;
const ROW_HEIGHT = 120;

interface StarsBarsViewProps {
  title: string;
  types: readonly string[];
  k: number;
}

/** Text form of a selection: one "*" per item and "|" between consecutive types. */
function starsAndBars(counts: readonly number[]): string {
  return counts.map((count) => '*'.repeat(count)).join('|');
}

/**
 * Selections of k items from n types where order does not matter and types
 * may repeat. Each selection is a row of k stars split by n - 1 bars, so
 * counting selections is choosing where the bars go among k + n - 1 symbols.
 */
export function StarsBarsView({ title, types, k }: StarsBarsViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Tipos',
        symbol: 'n',
        min: 2,
        max: types.length,
        step: 1,
        default: types.length,
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Objetos elegidos',
        symbol: 'k',
        min: 0,
        max: 8,
        step: 1,
        default: k,
      },
    ],
    [types.length, k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Number(values.n);
  const items = Number(values.k);
  const all = useMemo(() => multisets(n, items), [n, items]);
  const total = all.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${n}|${items}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(total),
    done: shown >= total,
  });
  const countsOf = (multiset: readonly number[]) =>
    Array.from({ length: n }, (_, type) => multiset.filter((value) => value === type).length);
  const current = shown > 0 ? all[shown - 1] : undefined;
  const counts = current ? countsOf(current) : Array.from({ length: n }, () => 0);
  const symbols = starsAndBars(counts);
  const description =
    `Elegir ${items} objetos de ${n} tipos con repetición equivale a acomodar ${items} estrellas y ${n - 1} barras: ` +
    `${multisetCount(n, items)} maneras. Van ${shown}${current ? `; la última es ${counts.map((count, type) => `${count} de ${types[type]}`).join(', ')}` : ''}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Símbolos', value: `${items} estrellas + ${n - 1} barras = ${items + n - 1}` },
        { label: 'Selecciones', value: String(total), color: DATA_COLORS.primary },
        {
          label: 'Actual',
          value: current ? symbols || 'ninguna' : 'ninguna',
          color: DATA_COLORS.highlight,
        },
        { label: 'Listadas', value: `${shown} de ${total}` },
      ]}
      legend={types
        .slice(0, n)
        .map((type, index) => ({
          label: type,
          color: seriesColor(index),
          shape: 'circle' as const,
        }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\binom{k + n - 1}{n - 1} = \\binom{${items + n - 1}}{${n - 1}} = ${multisetCount(n, items)}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={ROW_HEIGHT}
        maxHeight={ROW_HEIGHT}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const length = items + n - 1;
          const width = Math.min(SYMBOL_WIDTH, box.inner.width / Math.max(1, length));
          const start = box.inner.left + (box.inner.width - length * width) / 2;
          const middle = box.inner.top + 34;
          let position = 0;
          const marks: React.ReactNode[] = [];
          counts.forEach((count, type) => {
            for (let i = 0; i < count; i += 1) {
              const x = start + (position + 0.5) * width;
              marks.push(
                <circle
                  key={`s${type}-${i}`}
                  cx={x}
                  cy={middle}
                  r={Math.min(STAR_RADIUS, width / 2 - 2)}
                  fill={seriesColor(type)}
                />,
              );
              position += 1;
            }
            if (type < n - 1) {
              const x = start + (position + 0.5) * width;
              marks.push(
                <line
                  key={`b${type}`}
                  x1={x}
                  x2={x}
                  y1={middle - 20}
                  y2={middle + 20}
                  stroke={DATA_COLORS.text}
                  strokeWidth={3}
                />,
              );
              position += 1;
            }
          });
          return (
            <g aria-hidden="true">
              {marks}
              {counts.map((count, type) => (
                <text
                  key={`t${type}`}
                  x={box.inner.left + (box.inner.width * (type + 0.5)) / n}
                  y={box.inner.top + 88}
                  textAnchor="middle"
                  className={svgStyles.label}
                  style={{ fill: seriesColor(type), fontWeight: 700 }}
                >
                  {types[type]}: {count}
                </text>
              ))}
            </g>
          );
        }}
      </ChartSvg>
      <ul className={styles.chips} aria-label="Selecciones listadas">
        {all.slice(0, shown).map((multiset, index) => (
          <li
            key={index}
            className={index === shown - 1 ? `${styles.chip} ${styles.chipCurrent}` : styles.chip}
          >
            {starsAndBars(countsOf(multiset)) || '(vacía)'}
          </li>
        ))}
      </ul>
    </VizFrame>
  );
}
