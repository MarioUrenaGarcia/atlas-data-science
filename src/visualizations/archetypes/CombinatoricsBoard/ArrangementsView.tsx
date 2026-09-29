import { useMemo, useState } from 'react';
import { fallingFactorial, permutations, words } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { enumerationRate } from './pace.ts';

/** Largest listing drawn chip by chip; longer ones would not fit a readable panel. */
const MAX_LISTED = 1296;
const SLOT_WIDTH = 64;
const SLOT_HEIGHT = 46;

interface ArrangementsViewProps {
  title: string;
  objects: readonly string[];
  k?: number;
  repetition: boolean;
  allowRepetition: boolean;
}

/**
 * Ordered arrangements of k positions filled from n objects. The slots show
 * how many choices remain for each position, and every arrangement is added
 * to the list so the product can be checked by counting.
 */
export function ArrangementsView({
  title,
  objects,
  k,
  repetition,
  allowRepetition,
}: ArrangementsViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Objetos disponibles',
        symbol: 'n',
        min: 2,
        max: objects.length,
        step: 1,
        default: objects.length,
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Posiciones',
        symbol: 'k',
        min: 1,
        max: objects.length,
        step: 1,
        default: k ?? objects.length,
      },
      ...(allowRepetition
        ? [
            {
              type: 'toggle' as const,
              key: 'repeticion',
              label: 'Permitir repetir objetos',
              default: repetition,
            },
          ]
        : []),
    ],
    [objects.length, k, repetition, allowRepetition],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | boolean>;
  const n = Number(values.n);
  const withRepetition = allowRepetition ? Boolean(values.repeticion) : repetition;
  const positions = withRepetition ? Number(values.k) : Math.min(Number(values.k), n);
  const total = withRepetition ? n ** positions : fallingFactorial(n, positions);
  const listed = useMemo(
    () =>
      total > MAX_LISTED ? [] : withRepetition ? words(n, positions) : permutations(n, positions),
    [n, positions, total, withRepetition],
  );
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${n}|${positions}|${withRepetition}|${run}`,
    () => 0,
  );
  const limit = listed.length;
  const playback = usePlayback({
    step: () => update((value) => Math.min(limit, value + 1)),
    stepMany: (count) => update((value) => Math.min(limit, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(limit),
    done: shown >= limit,
  });

  const current = shown > 0 ? listed[shown - 1] : undefined;
  const choices = Array.from({ length: positions }, (_, index) => (withRepetition ? n : n - index));
  const label = (arrangement: readonly number[]) =>
    arrangement.map((index) => objects[index]).join(' ');
  const formula = withRepetition
    ? `${n}^{${positions}} = ${total}`
    : `${choices.join(' \\cdot ')} = ${positions === n ? `${n}!\\ = ` : `\\frac{${n}!}{${n - positions}!} = `}${total}`;
  const description =
    `${positions} posiciones con ${n} objetos ${withRepetition ? 'que pueden repetirse' : 'sin repetir'}: ${choices.join(' por ')} igual a ${total} ordenaciones. ` +
    (current ? `Van ${shown}; la última es ${label(current)}.` : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Opciones por posición', value: choices.join(' · ') },
        { label: 'Total', value: String(total), color: DATA_COLORS.primary },
        {
          label: 'Listadas',
          value: total > MAX_LISTED ? 'demasiadas para listar' : `${shown} de ${total}`,
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={formula} />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={SLOT_HEIGHT + 56}
        maxHeight={SLOT_HEIGHT + 56}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const width = Math.min(SLOT_WIDTH, (box.inner.width - 8 * positions) / positions);
          const start = box.inner.left + (box.inner.width - positions * (width + 8)) / 2;
          return (
            <g aria-hidden="true">
              {choices.map((count, index) => {
                const x = start + index * (width + 8);
                const value = current?.[index];
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={box.inner.top}
                      width={width}
                      height={SLOT_HEIGHT}
                      rx={8}
                      fill={value === undefined ? 'var(--color-surface)' : DATA_COLORS.primary}
                      fillOpacity={value === undefined ? 1 : 0.2}
                      stroke={DATA_COLORS.primary}
                    />
                    <text
                      x={x + width / 2}
                      y={box.inner.top + SLOT_HEIGHT / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontWeight: 700 }}
                    >
                      {value === undefined ? '' : objects[value]}
                    </text>
                    <text
                      x={x + width / 2}
                      y={box.inner.top + SLOT_HEIGHT + 20}
                      textAnchor="middle"
                      className={svgStyles.labelMuted}
                    >
                      {count} opc.
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      {total <= MAX_LISTED && (
        <ul className={styles.chips} aria-label="Ordenaciones listadas">
          {listed.slice(0, shown).map((arrangement, index) => (
            <li
              key={index}
              className={index === shown - 1 ? `${styles.chip} ${styles.chipCurrent}` : styles.chip}
            >
              {label(arrangement)}
            </li>
          ))}
        </ul>
      )}
    </VizFrame>
  );
}
