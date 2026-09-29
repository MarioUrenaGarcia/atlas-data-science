import { useMemo, useState } from 'react';
import { exponentialProduct, words } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CoefficientBars } from './CoefficientBars.tsx';
import styles from './GeneratingFunctionViz.module.css';
import type { LetterRule } from './schema.ts';

const FACTORS_PER_SECOND = 0.6;
/** Longest word length checked by listing every word. */
const MAX_CHECKED_LENGTH = 7;

const RULES: Record<
  LetterRule,
  { label: string; latex: string; allows: (count: number) => boolean }
> = {
  cualquiera: { label: 'cualquier número de veces', latex: 'e^{x}', allows: () => true },
  par: { label: 'un número par de veces', latex: '\\cosh x', allows: (count) => count % 2 === 0 },
  impar: {
    label: 'un número impar de veces',
    latex: '\\sinh x',
    allows: (count) => count % 2 === 1,
  },
  'al-menos-uno': {
    label: 'al menos una vez',
    latex: '(e^{x} - 1)',
    allows: (count) => count >= 1,
  },
  'a-lo-mas-uno': { label: 'a lo más una vez', latex: '(1 + x)', allows: (count) => count <= 1 },
};

interface ExponentialViewProps {
  title: string;
  letters: readonly { letra: string; regla: LetterRule }[];
  n: number;
}

/**
 * Words whose letters must appear a restricted number of times. Positions in
 * a word are labelled, so the exponential generating functions of the letters
 * multiply: the coefficient of x^n / n! in the product counts the words of
 * length n. Each count is also checked by listing all words.
 */
export function ExponentialView({ title, letters, n }: ExponentialViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Longitud máxima',
        symbol: 'n',
        min: 3,
        max: 8,
        step: 1,
        default: n,
      },
    ],
    [n],
  );
  const parameters = useParameters(definitions);
  const maxLength = Number((parameters.values as Record<string, number>).n);
  const products = useMemo(() => {
    const result: number[][] = [];
    let current = [1, ...Array.from({ length: maxLength }, () => 0)];
    for (const letter of letters) {
      const sequence = Array.from({ length: maxLength + 1 }, (_, count) =>
        RULES[letter.regla].allows(count) ? 1 : 0,
      );
      current = exponentialProduct(current, sequence, maxLength);
      result.push(current);
    }
    return result;
  }, [letters, maxLength]);
  const [run, setRun] = useState(0);
  const [applied, update] = useResettableState<number>(`${maxLength}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(letters.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: FACTORS_PER_SECOND,
    done: applied >= letters.length,
  });
  const initial = [1, ...Array.from({ length: maxLength }, () => 0)];
  const counts = applied === 0 ? initial : (products[applied - 1] ?? initial);
  const previous = applied <= 1 ? initial : products[applied - 2];
  const used = letters.slice(0, applied);
  const checkLength = Math.min(maxLength, MAX_CHECKED_LENGTH);
  const listed = useMemo(() => {
    const included = letters.slice(0, applied);
    if (included.length === 0) return checkLength === 0 ? 1 : 0;
    return words(included.length, checkLength).filter((word) =>
      included.every((letter, index) =>
        RULES[letter.regla].allows(word.filter((symbol) => symbol === index).length),
      ),
    ).length;
  }, [letters, applied, checkLength]);
  const product =
    used.length === 0 ? '1' : used.map((letter) => RULES[letter.regla].latex).join('\\,');
  const description =
    `Letras incluidas: ${used.map((letter) => `${letter.letra} ${RULES[letter.regla].label}`).join('; ') || 'ninguna'}. ` +
    `Palabras de longitud ${checkLength}: ${counts[checkLength] ?? 0} según la función generadora y ${listed} al listarlas.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        ...letters.map((letter, index) => ({
          label: `Letra ${letter.letra}`,
          value: `${RULES[letter.regla].label}${index < applied ? '' : ' (pendiente de multiplicar)'}`,
        })),
        {
          label: `Palabras de longitud ${checkLength}`,
          value: String(counts[checkLength] ?? 0),
          color: DATA_COLORS.primary,
        },
        { label: 'Comprobación por listado', value: String(listed), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Palabras de cada longitud', color: DATA_COLORS.primary },
        { label: 'Antes de la última letra', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
      dataTable={{
        caption: 'Número de palabras por longitud',
        columns: ['n', 'palabras'],
        rows: counts.map((value, index) => [index, value]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={`\\hat{G}(x) = \\sum_{n \\ge 0} a_n \\frac{x^n}{n!} = ${product}`} />
      </p>
      <CoefficientBars
        coefficients={counts}
        previous={applied === 0 ? undefined : previous}
        highlight={checkLength}
        label={description}
        axisLabel="longitud de la palabra"
      />
    </VizFrame>
  );
}
