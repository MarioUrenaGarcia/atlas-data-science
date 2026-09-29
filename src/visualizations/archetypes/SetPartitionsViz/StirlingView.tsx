import { useMemo, useState } from 'react';
import { setPartitions, stirling2, stirling2Table } from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PartitionChip } from './PartitionChip.tsx';
import { PartitionDiagram } from './PartitionDiagram.tsx';
import styles from './SetPartitionsViz.module.css';

const MIN_PER_SECOND = 1;
const TARGET_SECONDS = 25;

interface StirlingViewProps {
  title: string;
  n: number;
  k: number;
}

/**
 * Partitions of {1, ..., n} into exactly k blocks, split by what happens to
 * the last element: alone in its block (a partition of the others into k - 1
 * blocks) or added to one of the k blocks of a partition of the others. This
 * is the recurrence S(n, k) = S(n - 1, k - 1) + k S(n - 1, k).
 */
export function StirlingView({ title, n, k }: StirlingViewProps) {
  const definitions = useMemo(
    () => [
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
        label: 'Bloques',
        symbol: 'k',
        min: 1,
        max: 7,
        step: 1,
        default: k,
      },
    ],
    [n, k],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const size = Number(values.n);
  const blocks = Math.min(size, Number(values.k));
  const last = size - 1;
  const all = useMemo(
    () => setPartitions(size).filter((partition) => partition.length === blocks),
    [size, blocks],
  );
  const total = all.length;
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${size}|${blocks}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const alone = (partition: readonly (readonly number[])[]) =>
    partition.some((block) => block.length === 1 && block[0] === last);
  const listed = all.slice(0, shown);
  const current = shown > 0 ? all[shown - 1] : undefined;
  const aloneCount = stirling2(size - 1, blocks - 1);
  const sharedCount = blocks * stirling2(size - 1, blocks);
  const table = stirling2Table(7);
  const description = `S(${size}, ${blocks}) = ${total}: ${aloneCount} particiones con ${size} solo en su bloque y ${sharedCount} con ${size} dentro de uno de los ${blocks} bloques. Listadas: ${shown}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: `S(${size}, ${blocks})`, value: String(total), color: DATA_COLORS.primary },
        { label: `${size} solo`, value: `${listed.filter(alone).length} de ${aloneCount}` },
        {
          label: `${size} acompañado`,
          value: `${listed.filter((partition) => !alone(partition)).length} de ${sharedCount}`,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Números de Stirling de segunda especie S(n, k)',
        columns: ['n', ...Array.from({ length: 7 }, (_, index) => `k = ${index + 1}`)],
        rows: table
          .slice(1)
          .map((row, index) => [
            index + 1,
            ...Array.from({ length: 7 }, (_, column) => row[column + 1] ?? 0),
          ]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={`S(${size}, ${blocks}) = S(${size - 1}, ${blocks - 1}) + ${blocks}\\,S(${size - 1}, ${blocks}) = ${aloneCount} + ${blocks} \\cdot ${stirling2(size - 1, blocks)} = ${total}`}
        />
      </p>
      <PartitionDiagram n={size} blocks={current ?? []} marked={last} label={description} />
      <div className={styles.columns}>
        {[
          {
            name: `${size} solo en su bloque`,
            test: (partition: readonly (readonly number[])[]) => alone(partition),
          },
          {
            name: `${size} en un bloque con otros`,
            test: (partition: readonly (readonly number[])[]) => !alone(partition),
          },
        ].map((group) => (
          <section key={group.name} className={styles.column} aria-label={group.name}>
            <span className={styles.columnTitle}>{group.name}</span>
            <ul className={styles.list}>
              {listed.map((partition, index) =>
                group.test(partition) ? (
                  <PartitionChip key={index} blocks={partition} current={index === shown - 1} />
                ) : null,
              )}
            </ul>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
