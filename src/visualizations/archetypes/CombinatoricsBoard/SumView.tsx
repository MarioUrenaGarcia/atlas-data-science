import { useMemo, useState } from 'react';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';

const OPTIONS_PER_SECOND = 2;
const CHIP_HEIGHT = 26;
const CHIP_GAP = 6;
const HEADER_HEIGHT = 30;

interface SumViewProps {
  title: string;
  categories: readonly { nombre: string; opciones: readonly string[] }[];
}

/**
 * Options of each category are counted one by one into a running total. When
 * an option belongs to two active categories, the total of the parts exceeds
 * the number of distinct options and the sum rule no longer applies.
 */
export function SumView({ title, categories }: SumViewProps) {
  const definitions = useMemo(
    () =>
      categories.map((category, index) => ({
        type: 'toggle' as const,
        key: `c${index}`,
        label: `Incluir ${category.nombre}`,
        default: true,
      })),
    [categories],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, boolean>;
  const active = categories.map((_, index) => values[`c${index}`] !== false);
  const sequence = categories.flatMap((category, index) =>
    active[index] ? category.opciones.map((option) => ({ category: index, option })) : [],
  );
  const total = sequence.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${active.join()}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: OPTIONS_PER_SECOND,
    done: shown >= total,
  });

  const counted = sequence.slice(0, shown);
  const distinct = new Set(counted.map((item) => item.option));
  const allDistinct = new Set(sequence.map((item) => item.option));
  const occurrences = new Map<string, number>();
  sequence.forEach((item) => occurrences.set(item.option, (occurrences.get(item.option) ?? 0) + 1));
  const repeated = [...occurrences].filter(([, count]) => count > 1).map(([option]) => option);
  const complete = shown >= total;
  const activeCategories = categories.filter((_, index) => active[index]);
  const sizes = activeCategories.map((category) => category.opciones.length);
  const verdict = !complete
    ? 'Contando opciones.'
    : repeated.length === 0
      ? `Las categorías son disjuntas: el total ${total} es la suma ${sizes.join(' + ')}.`
      : `La suma ${sizes.join(' + ')} = ${total} cuenta dos veces ${repeated.join(', ')}: solo hay ${allDistinct.size} opciones distintas.`;
  const description = `${verdict} Opciones contadas: ${shown} de ${total}.`;
  const tallest = Math.max(...categories.map((category) => category.opciones.length));
  const chartHeight = HEADER_HEIGHT + tallest * (CHIP_HEIGHT + CHIP_GAP) + 16;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        ...activeCategories.map((category) => ({
          label: category.nombre,
          value: String(category.opciones.length),
        })),
        { label: 'Suma de las partes', value: String(shown), color: DATA_COLORS.primary },
        { label: 'Opciones distintas', value: String(distinct.size), color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`|${activeCategories.map((_, index) => `A_{${index + 1}}`).join(' \\cup ') || '\\varnothing'}| = ${sizes.join(' + ') || '0'}\\ \\text{si son disjuntos}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={chartHeight}
        maxHeight={chartHeight}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const columns = categories.length;
          const columnWidth = box.inner.width / columns;
          let order = 0;
          return categories.map((category, column) => {
            const x = box.inner.left + column * columnWidth;
            const color = seriesColor(column);
            const chips = category.opciones.map((option, row) => {
              const index = active[column] ? order++ : -1;
              const visible = index >= 0 && index < shown;
              const isRepeated = active[column] && repeated.includes(option);
              const y = box.inner.top + HEADER_HEIGHT + row * (CHIP_HEIGHT + CHIP_GAP);
              return (
                <g key={option} opacity={active[column] ? 1 : 0.3}>
                  <rect
                    x={x + 8}
                    y={y}
                    width={columnWidth - 16}
                    height={CHIP_HEIGHT}
                    rx={6}
                    fill={visible ? color : 'var(--color-surface)'}
                    fillOpacity={visible ? 0.25 : 1}
                    stroke={isRepeated && complete ? DATA_COLORS.highlight : color}
                    strokeWidth={isRepeated && complete ? 3 : 1}
                    strokeDasharray={visible ? undefined : '4 3'}
                  />
                  <text
                    x={x + columnWidth / 2}
                    y={y + CHIP_HEIGHT / 2}
                    dy="0.35em"
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    {option}
                  </text>
                </g>
              );
            });
            return (
              <g key={category.nombre} aria-hidden="true">
                <text
                  x={x + columnWidth / 2}
                  y={box.inner.top + 14}
                  textAnchor="middle"
                  className={svgStyles.label}
                  style={{ fontWeight: 700, fill: color }}
                >
                  {category.nombre} ({category.opciones.length})
                </text>
                {chips}
              </g>
            );
          });
        }}
      </ChartSvg>
      <p className={styles.verdict}>{verdict}</p>
    </VizFrame>
  );
}
