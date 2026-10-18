import { useState } from 'react';
import {
  averageLength,
  entropy,
  huffman,
  kraftSum,
  normalize,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InformationViz.module.css';
import { bitsText } from './units.ts';

const STEPS_PER_SECOND = 0.8;

interface HuffmanViewProps {
  title: string;
  weights: readonly number[];
  labels?: readonly string[];
}

interface Group {
  symbols: number[];
  weight: number;
}

/**
 * Huffman's algorithm replayed merge by merge: the two lightest groups are
 * joined, the symbols of one receive a leading 0 and those of the other a
 * leading 1. When a single group remains, every symbol has its codeword and
 * the average length lies between H and H + 1.
 */
export function HuffmanView({ title, weights, labels }: HuffmanViewProps) {
  const p = normalize(weights);
  const names = labels ?? p.map((_, i) => String.fromCharCode(65 + i));
  const { codes, merges } = huffman(p);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(merges.length, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= merges.length,
  });

  let groups: Group[] = p.map((w, i) => ({ symbols: [i], weight: w }));
  const partial = p.map(() => '');
  for (const merge of merges.slice(0, step)) {
    for (const s of merge.left) partial[s] = `0${partial[s] ?? ''}`;
    for (const s of merge.right) partial[s] = `1${partial[s] ?? ''}`;
    const joined = [...merge.left, ...merge.right];
    groups = [
      ...groups.filter((g) => !g.symbols.some((s) => joined.includes(s))),
      { symbols: joined, weight: merge.weight },
    ];
  }
  const next = merges[step];
  const isNext = (g: Group) =>
    next !== undefined && (sameSet(g.symbols, next.left) || sameSet(g.symbols, next.right));
  const finished = step >= merges.length;
  const h = entropy(p);
  const length = averageLength(p, codes);
  const description = finished
    ? `Código terminado: ${names.map((n, i) => `${n} = ${codes[i]}`).join(', ')}. Longitud media ${formatNumber(length, 3)} bits, entropía ${formatNumber(h, 3)} bits.`
    : `Paso ${step} de ${merges.length}: grupos ${groups.map((g) => `${g.symbols.map((s) => names[s]).join('')} (${formatNumber(g.weight, 3)})`).join(', ')}. ` +
      (next ? `Se unen los dos más ligeros, de peso total ${formatNumber(next.weight, 3)}.` : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Uniones hechas', value: `${step} de ${merges.length}` },
        { label: 'Entropía H', value: bitsText(h, 3) },
        {
          label: 'Longitud media L',
          value: finished ? bitsText(length, 3) : 'en construcción',
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Suma de Kraft',
          value: finished ? formatNumber(kraftSum(codes), 3) : 'en construcción',
        },
      ]}
      legend={[{ label: 'Grupos que se unen en el siguiente paso', color: DATA_COLORS.highlight }]}
      description={description}
      graphic="html"
    >
      <FormulaLine
        tex={
          finished
            ? `L = \\sum_i p_i\\,\\ell_i = ${p.map((pi, i) => `${formatNumber(pi, 3)}\\cdot ${codes[i]?.length ?? 0}`).join(' + ')} = ${formatNumber(length, 3)},\\quad H = ${formatNumber(h, 3)} \\le L < H + 1`
            : next
              ? `\\text{se unen } ${formatNumber(sumOf(p, next.left), 3)} + ${formatNumber(sumOf(p, next.right), 3)} = ${formatNumber(next.weight, 3)}`
              : `H = ${formatNumber(h, 3)}`
        }
      />
      <div className={styles.codes} aria-hidden="true">
        {groups.map((g) => (
          <span
            key={g.symbols.join('-')}
            className={`${styles.group} ${isNext(g) ? styles.groupActive : ''}`}
          >
            {g.symbols.map((s) => names[s]).join('')}: {formatNumber(g.weight, 3)}
          </span>
        ))}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Probabilidad</th>
            <th>Código</th>
            <th>Longitud</th>
          </tr>
        </thead>
        <tbody>
          {p.map((pi, i) => (
            <tr key={i}>
              <th>{names[i]}</th>
              <td>{formatNumber(pi, 3)}</td>
              <td>{partial[i] === '' ? '·' : partial[i]}</td>
              <td>{partial[i]?.length ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </VizFrame>
  );
}

function sameSet(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((s) => b.includes(s));
}

function sumOf(p: readonly number[], symbols: readonly number[]): number {
  return symbols.reduce((s, i) => s + (p[i] ?? 0), 0);
}
