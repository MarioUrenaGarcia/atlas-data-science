import { scaleBand, scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { choose, words } from '../../../lib/combinatorics/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PascalTriangle.module.css';

const MIN_WORDS_PER_SECOND = 2;
const TARGET_SECONDS = 20;

interface BinomialViewProps {
  title: string;
  n: number;
  a: number;
  b: number;
}

/**
 * Expanding (a + b)^n picks a or b from each of the n factors. The 2^n words
 * of choices are sorted by how many b's they contain; there are C(n, k) words
 * with k b's, each worth a^(n-k) b^k, and the bars add up to (a + b)^n.
 */
export function BinomialView({ title, n, a, b }: BinomialViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Exponente',
        symbol: 'n',
        min: 1,
        max: 8,
        step: 1,
        default: n,
      },
      {
        type: 'number' as const,
        key: 'a',
        label: 'Valor de a',
        symbol: 'a',
        min: -3,
        max: 3,
        step: 0.1,
        default: a,
        digits: 1,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Valor de b',
        symbol: 'b',
        min: -3,
        max: 3,
        step: 0.1,
        default: b,
        digits: 1,
      },
    ],
    [n, a, b],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const power = Number(values.n);
  const x = Number(values.a);
  const y = Number(values.b);
  const all = useMemo(() => words(2, power), [power]);
  const total = all.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${power}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_WORDS_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const countB = (word: readonly number[]) => word.filter((letter) => letter === 1).length;
  const text = (word: readonly number[]) =>
    word.map((letter) => (letter === 1 ? 'b' : 'a')).join('');
  const terms = Array.from(
    { length: power + 1 },
    (_, k) => choose(power, k) * x ** (power - k) * y ** k,
  );
  const placed = Array.from({ length: power + 1 }, () => 0);
  all.slice(0, shown).forEach((word) => {
    const k = countB(word);
    placed[k] = (placed[k] ?? 0) + 1;
  });
  const partial = terms.reduce(
    (sum, term, k) => sum + ((placed[k] ?? 0) / choose(power, k)) * term,
    0,
  );
  const exact = (x + y) ** power;
  const expansion = Array.from({ length: power + 1 }, (_, k) => {
    const coefficient = choose(power, k);
    const aPart = power - k === 0 ? '' : power - k === 1 ? 'a' : `a^{${power - k}}`;
    const bPart = k === 0 ? '' : k === 1 ? 'b' : `b^{${k}}`;
    return `${coefficient === 1 ? '' : coefficient}${aPart}${bPart}`;
  }).join(' + ');
  const current = shown > 0 ? all[shown - 1] : undefined;
  const description =
    `(a + b)^${power} = ${expansion.replace(/[{}^]/g, '')}. Con a = ${formatNumber(x, 1)} y b = ${formatNumber(y, 1)} la suma de los términos es ${formatNumber(exact, 4)}. ` +
    `Palabras repartidas: ${shown} de ${total}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: 'Palabra actual',
          value: current ? text(current) : 'ninguna',
          color: DATA_COLORS.highlight,
        },
        { label: 'Suma acumulada', value: formatNumber(partial, 4), color: DATA_COLORS.primary },
        { label: '(a + b)ⁿ', value: formatNumber(exact, 4), color: DATA_COLORS.secondary },
      ]}
      description={description}
      dataTable={{
        caption: 'Términos del desarrollo',
        columns: ['k', 'C(n, k)', 'término'],
        rows: terms.map((term, k) => [k, choose(power, k), formatNumber(term, 4)]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={`(a + b)^{${power}} = ${expansion}`} />
      </p>
      <ChartSvg label={description} aspect={0.4} minHeight={200} maxHeight={320}>
        {(box) => {
          const band = scaleBand<number>()
            .domain(terms.map((_, k) => k))
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.25);
          const extent = Math.max(1e-9, ...terms.map(Math.abs));
          const low = Math.min(0, ...terms);
          const scale = scaleLinear()
            .domain([low < 0 ? -extent : 0, extent])
            .nice()
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={scale}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
              />
              <g aria-hidden="true">
                {terms.map((term, k) => {
                  const fraction = (placed[k] ?? 0) / choose(power, k);
                  const left = band(k) ?? 0;
                  const top = Math.min(scale(term * fraction), scale(0));
                  const full = Math.min(scale(term), scale(0));
                  return (
                    <g key={k}>
                      <rect
                        x={left}
                        y={full}
                        width={band.bandwidth()}
                        height={Math.abs(scale(term) - scale(0))}
                        fill="none"
                        stroke={DATA_COLORS.primary}
                        strokeDasharray="4 3"
                      />
                      <rect
                        x={left}
                        y={top}
                        width={band.bandwidth()}
                        height={Math.abs(scale(term * fraction) - scale(0))}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.7}
                      />
                      <text
                        x={left + band.bandwidth() / 2}
                        y={box.inner.top + box.inner.height + 16}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                      >
                        k = {k}
                      </text>
                    </g>
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <div className={styles.columns}>
        {Array.from({ length: power + 1 }, (_, k) => (
          <section key={k} className={styles.column} aria-label={`Palabras con ${k} letras b`}>
            <span className={styles.columnTitle}>
              {k} b: {placed[k]} de {choose(power, k)}
            </span>
            <ul className={styles.words}>
              {all.slice(0, shown).map((word, index) =>
                countB(word) === k ? (
                  <li
                    key={index}
                    className={
                      index === shown - 1 ? `${styles.word} ${styles.wordCurrent}` : styles.word
                    }
                  >
                    {text(word)}
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
