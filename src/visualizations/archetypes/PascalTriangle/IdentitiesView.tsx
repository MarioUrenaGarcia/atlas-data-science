import { useMemo, useState } from 'react';
import { choose, combinations } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PascalTriangle.module.css';
import type { IDENTITIES } from './schema.ts';

type Identity = (typeof IDENTITIES)[number];

const IDENTITY_LABELS: Record<Identity, string> = {
  pascal: 'Regla de Pascal',
  vandermonde: 'Identidad de Vandermonde',
  simetria: 'Simetría',
  'suma-de-fila': 'Suma de una fila',
};

const MIN_ITEMS_PER_SECOND = 2;
const TARGET_SECONDS = 20;

interface Item {
  column: number;
  text: string;
}

interface Layout {
  columns: string[];
  items: Item[];
  formula: string;
  summary: string;
}

const subsetText = (subset: readonly number[]) => `{${subset.map((x) => x + 1).join(',')}}`;

/** Builds the objects counted by each side of the identity and the column where each one goes. */
function layoutFor(
  identity: Identity,
  n: number,
  k: number,
  m: number,
  p: number,
  r: number,
): Layout {
  switch (identity) {
    case 'pascal': {
      const items = combinations(n, k).map((subset) => ({
        column: subset.includes(n - 1) ? 1 : 0,
        text: subsetText(subset),
      }));
      return {
        columns: [
          `No contienen a ${n}: C(${n - 1}, ${k}) = ${choose(n - 1, k)}`,
          `Contienen a ${n}: C(${n - 1}, ${k - 1}) = ${choose(n - 1, k - 1)}`,
        ],
        items,
        formula: `\\binom{${n}}{${k}} = \\binom{${n - 1}}{${k}} + \\binom{${n - 1}}{${k - 1}} = ${choose(n - 1, k)} + ${choose(n - 1, k - 1)} = ${choose(n, k)}`,
        summary: `Los ${choose(n, k)} subconjuntos de tamaño ${k} de {1, ..., ${n}} se separan según contengan o no al ${n}.`,
      };
    }
    case 'simetria': {
      const items = combinations(n, k).flatMap((subset) => {
        const complement = Array.from({ length: n }, (_, x) => x).filter(
          (x) => !subset.includes(x),
        );
        return [
          { column: 0, text: subsetText(subset) },
          { column: 1, text: subsetText(complement) },
        ];
      });
      return {
        columns: [`Elegidos (${k})`, `Dejados fuera (${n - k})`],
        items,
        formula: `\\binom{${n}}{${k}} = \\binom{${n}}{${n - k}} = ${choose(n, k)}`,
        summary: `Elegir los ${k} que entran equivale a elegir los ${n - k} que se quedan fuera: cada subconjunto se empareja con su complemento.`,
      };
    }
    case 'suma-de-fila': {
      const items = Array.from({ length: n + 1 }, (_, size) =>
        combinations(n, size).map((subset) => ({
          column: size,
          text: subset.length === 0 ? '∅' : subsetText(subset),
        })),
      ).flat();
      return {
        columns: Array.from({ length: n + 1 }, (_, size) => `Tamaño ${size}: ${choose(n, size)}`),
        items,
        formula: `${Array.from({ length: n + 1 }, (_, size) => `\\binom{${n}}{${size}}`).join(' + ')} = ${2 ** n}`,
        summary: `Los ${2 ** n} subconjuntos de {1, ..., ${n}} se agrupan por tamaño.`,
      };
    }
    case 'vandermonde': {
      const people = [
        ...Array.from({ length: m }, (_, index) => `a${index + 1}`),
        ...Array.from({ length: p }, (_, index) => `b${index + 1}`),
      ];
      const items = combinations(m + p, r).map((committee) => ({
        column: committee.filter((index) => index < m).length,
        text: committee.map((index) => people[index]).join(''),
      }));
      const terms = Array.from({ length: r + 1 }, (_, j) => j);
      return {
        columns: terms.map((j) => `${j} de A y ${r - j} de B: ${choose(m, j) * choose(p, r - j)}`),
        items,
        formula: `\\binom{${m + p}}{${r}} = ${terms.map((j) => `\\binom{${m}}{${j}}\\binom{${p}}{${r - j}}`).join(' + ')} = ${choose(m + p, r)}`,
        summary: `Comités de ${r} personas tomadas de un grupo A de ${m} y un grupo B de ${p}, separados por cuántos miembros vienen de A.`,
      };
    }
  }
}

interface IdentitiesViewProps {
  title: string;
  identity: Identity;
  identities: readonly Identity[];
  n: number;
  k: number;
  groups: readonly [number, number];
}

/**
 * Combinatorial proofs of binomial identities: the objects counted by the left
 * side are listed one by one and placed in the column of the term on the right
 * side that counts them.
 */
export function IdentitiesView({ title, identity, identities, n, k, groups }: IdentitiesViewProps) {
  const definitions = useMemo(
    () => [
      ...(identities.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'identidad',
              label: 'Identidad',
              options: identities.map((id) => ({ value: id, label: IDENTITY_LABELS[id] })),
              default: identity,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Elementos',
        symbol: 'n',
        min: 2,
        max: 7,
        step: 1,
        default: n,
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Tamaño elegido',
        symbol: 'k',
        min: 0,
        max: 7,
        step: 1,
        default: k,
      },
      {
        type: 'number' as const,
        key: 'm',
        label: 'Tamaño del grupo A',
        symbol: 'm',
        min: 1,
        max: 6,
        step: 1,
        default: groups[0],
      },
      {
        type: 'number' as const,
        key: 'p',
        label: 'Tamaño del grupo B',
        symbol: 'p',
        min: 1,
        max: 6,
        step: 1,
        default: groups[1],
      },
    ],
    [identities, identity, n, k, groups],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const chosen = (identities.length > 1 ? String(values.identidad) : identity) as Identity;
  const size = Number(values.n);
  // Pascal's rule needs 1 <= k <= n; the other identities accept 0 <= k <= n.
  const picked = Math.min(size, Math.max(chosen === 'pascal' ? 1 : 0, Number(values.k)));
  const m = Number(values.m);
  const p = Number(values.p);
  const committee = Math.min(m + p, picked);
  const layout = useMemo(
    () => layoutFor(chosen, size, picked, m, p, committee),
    [chosen, size, picked, m, p, committee],
  );
  const total = layout.items.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${chosen}|${size}|${picked}|${m}|${p}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_ITEMS_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const disabled = chosen === 'vandermonde' ? ['n'] : ['m', 'p'];
  const description = `${layout.summary} Objetos colocados: ${shown} de ${total}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values, disabled }}
      readouts={[
        ...layout.columns.map((column, index) => ({
          label: column.split(':')[0] ?? column,
          value: String(
            layout.items.slice(0, shown).filter((item) => item.column === index).length,
          ),
        })),
        { label: 'Total colocado', value: `${shown} de ${total}`, color: DATA_COLORS.primary },
      ]}
      description={description}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex tex={layout.formula} />
      </p>
      <div className={styles.columns}>
        {layout.columns.map((column, index) => (
          <section key={column} className={styles.column} aria-label={column}>
            <span className={styles.columnTitle}>{column}</span>
            <ul className={styles.words}>
              {layout.items.slice(0, shown).map((item, position) =>
                item.column === index ? (
                  <li
                    key={position}
                    className={
                      position === shown - 1 ? `${styles.word} ${styles.wordCurrent}` : styles.word
                    }
                  >
                    {item.text}
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
