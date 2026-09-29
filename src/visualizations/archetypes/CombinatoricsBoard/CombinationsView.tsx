import { useMemo, useState } from 'react';
import {
  choose,
  factorial,
  fallingFactorial,
  permutations,
} from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CombinatoricsBoard.module.css';
import { GroupList } from './GroupList.tsx';
import { enumerationRate } from './pace.ts';

interface CombinationsViewProps {
  title: string;
  objects: readonly string[];
  k: number;
}

/**
 * Ordered selections of k objects are listed and dropped into the subset they
 * use. Every subset receives exactly k! orders, so the number of subsets is
 * the number of ordered selections divided by k!.
 */
export function CombinationsView({ title, objects, k }: CombinationsViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Objetos',
        symbol: 'n',
        min: 2,
        max: objects.length,
        step: 1,
        default: objects.length,
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Tamaño del grupo',
        symbol: 'k',
        min: 1,
        max: objects.length,
        step: 1,
        default: k,
      },
    ],
    [objects.length, k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Number(values.n);
  const size = Math.min(n, Number(values.k));
  const ordered = useMemo(() => permutations(n, size), [n, size]);
  const keyOf = (selection: readonly number[]) => [...selection].sort((a, b) => a - b).join(',');
  const order: string[] = [];
  const seen = new Set<string>();
  ordered.forEach((selection) => {
    const key = keyOf(selection);
    if (!seen.has(key)) {
      seen.add(key);
      order.push(key);
    }
  });
  order.sort((a, b) => {
    const x = a.split(',').map(Number);
    const y = b.split(',').map(Number);
    for (let i = 0; i < x.length; i += 1) if (x[i] !== y[i]) return (x[i] ?? 0) - (y[i] ?? 0);
    return 0;
  });

  const total = ordered.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${n}|${size}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: enumerationRate(total),
    done: shown >= total,
  });
  const members = new Map<string, string[]>();
  ordered.slice(0, shown).forEach((selection) => {
    const key = keyOf(selection);
    const list = members.get(key) ?? [];
    list.push(selection.map((index) => objects[index]).join('-'));
    members.set(key, list);
  });
  const current = shown > 0 ? ordered[shown - 1] : undefined;
  const subsets = choose(n, size);
  const orders = factorial(size);
  const description =
    `Hay ${fallingFactorial(n, size)} selecciones ordenadas de ${size} entre ${n}; cada grupo de ${size} aparece en ${orders} órdenes, así que hay ${subsets} grupos. ` +
    `Selecciones revisadas: ${shown}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Selecciones ordenadas', value: `${n}!/${n - size}! = ${total}` },
        { label: 'Órdenes de cada grupo', value: `${size}! = ${orders}` },
        {
          label: 'Grupos distintos',
          value: `C(${n}, ${size}) = ${subsets}`,
          color: DATA_COLORS.primary,
        },
        { label: 'Revisadas', value: `${shown} de ${total}` },
      ]}
      description={description}
      graphic="html"
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\binom{${n}}{${size}} = \\frac{${n}!}{${size}!\\,(${n} - ${size})!} = \\frac{${total}}{${orders}} = ${subsets}`}
        />
      </p>
      <GroupList
        label="Grupos y las selecciones ordenadas que los forman"
        wide
        current={current ? keyOf(current) : undefined}
        groups={order.map((key) => ({
          key,
          title: `{${key
            .split(',')
            .map((index) => objects[Number(index)])
            .join(', ')}}`,
          members: (members.get(key) ?? []).join(', '),
          filled: members.get(key)?.length ?? 0,
          capacity: orders,
        }))}
      />
    </VizFrame>
  );
}
