import { useMemo, useState } from 'react';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SetStructures.module.css';

const PAIRS_PER_SECOND = 2;

interface ProductViewProps {
  title: string;
  a: readonly string[];
  b: readonly string[];
  names: readonly [string, string];
}

/** The ordered pairs of A x B fill a grid row by row; swapping the order transposes it. */
export function ProductView({ title, a, b, names }: ProductViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'na',
        label: `Elementos de ${names[0]}`,
        min: 1,
        max: a.length,
        step: 1,
        default: a.length,
      },
      {
        type: 'number' as const,
        key: 'nb',
        label: `Elementos de ${names[1]}`,
        min: 1,
        max: b.length,
        step: 1,
        default: b.length,
      },
      {
        type: 'toggle' as const,
        key: 'invertir',
        label: `Mostrar ${names[1]} × ${names[0]}`,
        default: false,
      },
    ],
    [a.length, b.length, names],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const swap = Boolean(values.invertir);
  const first = swap ? b.slice(0, Number(values.nb)) : a.slice(0, Number(values.na));
  const second = swap ? a.slice(0, Number(values.na)) : b.slice(0, Number(values.nb));
  const [nameFirst, nameSecond] = swap ? [names[1], names[0]] : [names[0], names[1]];
  const total = first.length * second.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${first.join()}|${second.join()}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: PAIRS_PER_SECOND,
    done: shown >= total,
  });
  const last = shown > 0 ? shown - 1 : -1;
  const lastPair =
    last >= 0
      ? `(${first[Math.floor(last / second.length)]}, ${second[last % second.length]})`
      : 'ninguno';
  const description =
    `${nameFirst} × ${nameSecond} tiene ${first.length} por ${second.length} igual a ${total} pares ordenados. ` +
    `Se han formado ${shown}; el último es ${lastPair}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: `|${nameFirst}|`, value: String(first.length) },
        { label: `|${nameSecond}|`, value: String(second.length) },
        {
          label: `|${nameFirst} × ${nameSecond}|`,
          value: `${first.length} · ${second.length} = ${total}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Pares formados', value: String(shown) },
      ]}
      description={description}
    >
      <p className={styles.notation}>
        <Latex
          tex={`${nameFirst} \\times ${nameSecond} = \\{(x, y) : x \\in ${nameFirst},\\ y \\in ${nameSecond}\\}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={240}
        maxHeight={420}
        margins={{ top: 34, right: 12, bottom: 12, left: 60 }}
      >
        {(box) => {
          const cellWidth = box.inner.width / second.length;
          const cellHeight = Math.min(box.inner.height / first.length, 56);
          return (
            <>
              {second.map((element, column) => (
                <text
                  key={`c${element}`}
                  x={box.inner.left + cellWidth * (column + 0.5)}
                  y={box.inner.top - 12}
                  textAnchor="middle"
                  className={svgStyles.label}
                  style={{ fill: DATA_COLORS.secondary, fontWeight: 700 }}
                >
                  {element}
                </text>
              ))}
              {first.map((element, row) => (
                <text
                  key={`r${element}`}
                  x={box.inner.left - 12}
                  y={box.inner.top + cellHeight * (row + 0.5)}
                  textAnchor="end"
                  dy="0.35em"
                  className={svgStyles.label}
                  style={{ fill: DATA_COLORS.primary, fontWeight: 700 }}
                >
                  {element}
                </text>
              ))}
              {first.flatMap((x, row) =>
                second.map((y, column) => {
                  const index = row * second.length + column;
                  const visible = index < shown;
                  return (
                    <g key={`${x}-${y}`} aria-hidden="true">
                      <rect
                        x={box.inner.left + cellWidth * column + 2}
                        y={box.inner.top + cellHeight * row + 2}
                        width={cellWidth - 4}
                        height={cellHeight - 4}
                        rx={6}
                        fill={index === last ? DATA_COLORS.highlight : DATA_COLORS.light}
                        fillOpacity={visible ? 0.35 : 0.06}
                        stroke="var(--color-border)"
                      />
                      {visible && (
                        <text
                          x={box.inner.left + cellWidth * (column + 0.5)}
                          y={box.inner.top + cellHeight * (row + 0.5)}
                          textAnchor="middle"
                          dy="0.35em"
                          className={svgStyles.label}
                        >
                          ({x}, {y})
                        </text>
                      )}
                    </g>
                  );
                }),
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
