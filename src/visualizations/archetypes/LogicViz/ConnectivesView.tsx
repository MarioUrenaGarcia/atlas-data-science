import { useState } from 'react';
import { applyConnective } from '../../../lib/logic/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './LogicViz.module.css';
import { TruthValue as Value } from './TruthValue.tsx';

const ROWS: [boolean, boolean][] = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
];

const CONNECTIVES = [
  { id: 'no-p', latex: '\\lnot p', name: 'Negación', evaluate: (p: boolean) => !p },
  {
    id: 'y',
    latex: 'p \\land q',
    name: 'Conjunción',
    evaluate: (p: boolean, q: boolean) => applyConnective('y', p, q),
  },
  {
    id: 'o',
    latex: 'p \\lor q',
    name: 'Disyunción',
    evaluate: (p: boolean, q: boolean) => applyConnective('o', p, q),
  },
  {
    id: 'xor',
    latex: 'p \\oplus q',
    name: 'Disyunción exclusiva',
    evaluate: (p: boolean, q: boolean) => applyConnective('xor', p, q),
  },
  {
    id: 'implica',
    latex: 'p \\rightarrow q',
    name: 'Condicional',
    evaluate: (p: boolean, q: boolean) => applyConnective('implica', p, q),
  },
  {
    id: 'bicondicional',
    latex: 'p \\leftrightarrow q',
    name: 'Bicondicional',
    evaluate: (p: boolean, q: boolean) => applyConnective('bicondicional', p, q),
  },
] as const;

const ROWS_PER_SECOND = 0.7;

interface ConnectivesViewProps {
  title: string;
  statements: { p: string; q: string };
}

/** Two everyday statements whose truth values feed every connective at once. */
export function ConnectivesView({ title, statements }: ConnectivesViewProps) {
  const [row, setRow] = useState(0);
  const playback = usePlayback({
    step: () => setRow((current) => (current + 1) % ROWS.length),
    reset: () => setRow(0),
    rate: ROWS_PER_SECOND,
  });
  const [p, q] = ROWS[row] ?? [true, true];
  const description =
    `p: "${statements.p}" es ${p ? 'verdadera' : 'falsa'}; q: "${statements.q}" es ${q ? 'verdadera' : 'falsa'}. ` +
    CONNECTIVES.map(
      (connective) => `${connective.name}: ${connective.evaluate(p, q) ? 'verdadera' : 'falsa'}`,
    ).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'p', value: p ? 'verdadera' : 'falsa' },
        { label: 'q', value: q ? 'verdadera' : 'falsa' },
      ]}
      description={description}
      controls={
        <div className={styles.toggles} role="group" aria-label="Valores de verdad">
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={p}
            onClick={() => setRow(ROWS.findIndex(([a, b]) => a === !p && b === q))}
          >
            p es {p ? 'verdadera' : 'falsa'}
          </button>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={q}
            onClick={() => setRow(ROWS.findIndex(([a, b]) => a === p && b === !q))}
          >
            q es {q ? 'verdadera' : 'falsa'}
          </button>
        </div>
      }
    >
      <div className={styles.statements}>
        <div className={p ? `${styles.statement} ${styles.statementTrue}` : styles.statement}>
          <span className={styles.letter}>p</span>
          <span>{statements.p}</span>
          <Value value={p} />
        </div>
        <div className={q ? `${styles.statement} ${styles.statementTrue}` : styles.statement}>
          <span className={styles.letter}>q</span>
          <span>{statements.q}</span>
          <Value value={q} />
        </div>
      </div>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Tabla de los conectivos"
        tabIndex={0}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">
                <Latex tex="p" />
              </th>
              <th scope="col">
                <Latex tex="q" />
              </th>
              {CONNECTIVES.map((connective) => (
                <th key={connective.id} scope="col" title={connective.name}>
                  <Latex tex={connective.latex} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([a, b], index) => (
              <tr key={index} className={index === row ? styles.activeRow : undefined}>
                <td>
                  <Value value={a} />
                </td>
                <td>
                  <Value value={b} />
                </td>
                {CONNECTIVES.map((connective) => (
                  <td key={connective.id}>
                    <Value value={connective.evaluate(a, b)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
