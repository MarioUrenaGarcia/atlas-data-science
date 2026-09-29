import { useMemo, useState } from 'react';
import { factorial, multinomial, permutations } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { GroupList } from './GroupList.tsx';
import { enumerationRate } from './pace.ts';

const TILE = 44;
const SUBSCRIPT_ZERO = 0x2080;

/** Replaces the copy numbers in a key such as "A1NA2" by subscript digits. */
function withSubscripts(key: string): string {
  return key.replace(/\d/g, (digit) => String.fromCodePoint(SUBSCRIPT_ZERO + Number(digit)));
}
const TILE_GAP = 8;

interface AnagramViewProps {
  title: string;
  word: string;
}

/**
 * Anagrams of a word with repeated letters. The copies of each letter are
 * first told apart with subscripts, which gives n! arrangements; erasing the
 * subscripts merges them into groups of k1! k2! ... identical words.
 */
export function AnagramView({ title, word }: AnagramViewProps) {
  const letters = [...word];
  const definitions = useMemo(
    () => [
      {
        type: 'toggle' as const,
        key: 'distinguir',
        label: 'Distinguir las letras repetidas',
        default: false,
      },
    ],
    [],
  );
  const parameters = useParameters(definitions);
  const distinguish = Boolean((parameters.values as Record<string, boolean>).distinguir);

  // Subscript of each position among the copies of its letter.
  const copyIndex = letters.map(
    (letter, index) => letters.slice(0, index).filter((other) => other === letter).length + 1,
  );
  const multiplicity = new Map<string, number>();
  letters.forEach((letter) => multiplicity.set(letter, (multiplicity.get(letter) ?? 0) + 1));
  const repeatedLetters = [...multiplicity].filter(([, count]) => count > 1);
  const all = useMemo(() => permutations(word.length), [word.length]);
  const keyOf = (arrangement: readonly number[]) =>
    arrangement
      .map((index) => (distinguish ? `${letters[index]}${copyIndex[index]}` : letters[index]))
      .join('');
  const groupOrder: string[] = [];
  const seen = new Set<string>();
  all.forEach((arrangement) => {
    const key = keyOf(arrangement);
    if (!seen.has(key)) {
      seen.add(key);
      groupOrder.push(key);
    }
  });

  const total = all.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${word}|${distinguish}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(total),
    done: shown >= total,
  });

  const filled = new Map<string, number>();
  all.slice(0, shown).forEach((arrangement) => {
    const key = keyOf(arrangement);
    filled.set(key, (filled.get(key) ?? 0) + 1);
  });
  const current = shown > 0 ? all[shown - 1] : undefined;
  const groupSize = distinguish
    ? 1
    : repeatedLetters.reduce((product, [, count]) => product * factorial(count), 1);
  const distinct = distinguish ? total : multinomial([...multiplicity.values()]);
  const denominator = repeatedLetters
    .map(([letter, count]) => `\\underbrace{${count}!}_{${letter}}`)
    .join('\\,');
  const formula =
    distinguish || repeatedLetters.length === 0
      ? `${letters.length}! = ${total}`
      : `\\frac{${letters.length}!}{${denominator}} = \\frac{${total}}{${groupSize}} = ${distinct}`;
  const colorOf = new Map(
    [...multiplicity.keys()].map((letter, index) => [letter, seriesColor(index)]),
  );
  const description =
    `La palabra ${word} tiene ${letters.length} letras. Con las copias distinguidas hay ${total} ordenaciones; ` +
    `${distinguish ? 'todas son distintas.' : `al borrar los subíndices se agrupan de ${groupSize} en ${groupSize} y quedan ${distinct} anagramas.`} ` +
    `Ordenaciones revisadas: ${shown}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Ordenaciones con subíndices', value: `${letters.length}! = ${total}` },
        { label: 'Copias por anagrama', value: String(groupSize) },
        { label: 'Anagramas distintos', value: String(distinct), color: DATA_COLORS.primary },
        { label: 'Revisadas', value: `${shown} de ${total}` },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={formula} />
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={TILE + 28}
        maxHeight={TILE + 28}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const start = box.inner.left + (box.inner.width - letters.length * (TILE + TILE_GAP)) / 2;
          return (
            <g aria-hidden="true">
              {(current ?? letters.map((_, index) => index)).map((index, position) => {
                const x = start + position * (TILE + TILE_GAP);
                const letter = letters[index] ?? '';
                const color = colorOf.get(letter) ?? DATA_COLORS.primary;
                return (
                  <g key={position}>
                    <rect
                      x={x}
                      y={box.inner.top}
                      width={TILE}
                      height={TILE}
                      rx={8}
                      fill={color}
                      fillOpacity={0.2}
                      stroke={color}
                    />
                    <text
                      x={x + TILE / 2 - 4}
                      y={box.inner.top + TILE / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      className={svgStyles.label}
                      style={{ fontSize: 20, fontWeight: 700 }}
                    >
                      {letter}
                    </text>
                    {(multiplicity.get(letter) ?? 1) > 1 && (
                      <text
                        x={x + TILE / 2 + 10}
                        y={box.inner.top + TILE / 2 + 10}
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 12, opacity: distinguish ? 1 : 0.35 }}
                      >
                        {copyIndex[index]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
      <GroupList
        label="Anagramas y ordenaciones que los producen"
        current={current ? keyOf(current) : undefined}
        groups={groupOrder.map((key) => ({
          key,
          title: distinguish ? withSubscripts(key) : key,
          filled: filled.get(key) ?? 0,
          capacity: groupSize,
        }))}
      />
    </VizFrame>
  );
}
