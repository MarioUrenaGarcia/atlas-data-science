import { useMemo, useState } from 'react';
import {
  conjugatePartition,
  integerPartitions,
  partitionCount,
} from '../../../lib/combinatorics/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import { Ferrers } from './Ferrers.tsx';
import styles from './IntegerPartitionsViz.module.css';
import type { IntegerPartitionsVizConfig } from './schema.ts';

type View = 'ferrers' | 'euler';

const VIEWS = [
  { value: 'ferrers', label: 'Diagramas de Ferrers' },
  { value: 'euler', label: 'Partes distintas y partes impares' },
] as const;

const MIN_PER_SECOND = 1;
const TARGET_SECONDS = 25;

const written = (parts: readonly number[]) => parts.join(' + ');

/**
 * Partitions of a positive integer drawn as Ferrers diagrams. Reading the
 * diagram by columns gives the conjugate partition. The second view pairs the
 * partitions into distinct parts with those into odd parts, which Euler
 * showed are equally many.
 */
export default function IntegerPartitionsViz({ params, title }: VisualizationProps) {
  const config = params as unknown as IntegerPartitionsVizConfig;
  const [view, setView] = useState<View>(config.vista ?? 'ferrers');
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'n',
        label: 'Número a partir',
        symbol: 'n',
        min: 1,
        max: 12,
        step: 1,
        default: config.n ?? 6,
      },
    ],
    [config.n],
  );
  const parameters = useParameters(definitions);
  const n = Number((parameters.values as Record<string, number>).n);
  const all = useMemo(() => integerPartitions(n), [n]);
  const distinct = all.filter((parts) => new Set(parts).size === parts.length);
  const odd = all.filter((parts) => parts.every((part) => part % 2 === 1));
  const total = view === 'ferrers' ? all.length : Math.max(distinct.length, odd.length);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${view}|${n}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: Math.max(MIN_PER_SECOND, total / TARGET_SECONDS),
    done: shown >= total,
  });
  const current = shown > 0 ? all[shown - 1] : undefined;
  const conjugate = current ? conjugatePartition(current) : [];
  const description =
    view === 'ferrers'
      ? `El número ${n} tiene p(${n}) = ${partitionCount(n)} particiones. Listadas: ${shown}.` +
        (current ? ` La actual es ${written(current)} y su conjugada ${written(conjugate)}.` : '')
      : `${n} tiene ${distinct.length} particiones en partes distintas y ${odd.length} en partes impares. Listadas: ${Math.min(shown, distinct.length)} y ${Math.min(shown, odd.length)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      views={{ options: VIEWS, value: view, onChange: (next) => setView(next as View) }}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={
        view === 'ferrers'
          ? [
              { label: `p(${n})`, value: String(partitionCount(n)), color: DATA_COLORS.primary },
              {
                label: 'Actual',
                value: current ? written(current) : 'ninguna',
                color: DATA_COLORS.highlight,
              },
              {
                label: 'Conjugada',
                value: current ? written(conjugate) : 'ninguna',
                color: DATA_COLORS.secondary,
              },
              { label: 'Listadas', value: `${shown} de ${all.length}` },
            ]
          : [
              {
                label: 'Partes distintas',
                value: String(distinct.length),
                color: DATA_COLORS.primary,
              },
              { label: 'Partes impares', value: String(odd.length), color: DATA_COLORS.secondary },
              { label: 'Todas las particiones', value: String(all.length) },
            ]
      }
      description={description}
      graphic={view === 'euler' ? 'html' : 'svg'}
      dataTable={{
        caption: 'Número de particiones',
        columns: ['n', 'p(n)'],
        rows: Array.from({ length: 12 }, (_, index) => [index + 1, partitionCount(index + 1)]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            view === 'ferrers'
              ? `\\sum_{n \\ge 0} p(n)\\,x^n = \\prod_{k \\ge 1} \\frac{1}{1 - x^k},\\qquad p(${n}) = ${partitionCount(n)}`
              : `\\prod_{k \\ge 1} (1 + x^k) = \\prod_{k \\ge 1} \\frac{1}{1 - x^{2k-1}}`
          }
        />
      </p>
      {view === 'ferrers' ? (
        <ChartSvg
          label={description}
          aspect={0.45}
          minHeight={220}
          maxHeight={360}
          margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          {(box) => {
            const half = box.inner.width / 2;
            return (
              <g aria-hidden="true">
                {current && (
                  <>
                    <Ferrers
                      parts={current}
                      x={box.inner.left + 8}
                      y={box.inner.top}
                      width={half - 24}
                      height={box.inner.height}
                      color={DATA_COLORS.primary}
                      caption={`Partición: ${written(current)}`}
                    />
                    <Ferrers
                      parts={conjugate}
                      x={box.inner.left + half + 8}
                      y={box.inner.top}
                      width={half - 24}
                      height={box.inner.height}
                      color={DATA_COLORS.secondary}
                      caption={`Conjugada: ${written(conjugate)}`}
                    />
                  </>
                )}
              </g>
            );
          }}
        </ChartSvg>
      ) : null}
      <div className={view === 'euler' ? styles.columns : undefined}>
        {view === 'ferrers' ? (
          <ul className={styles.list} aria-label="Particiones listadas">
            {all.slice(0, shown).map((parts, index) => (
              <li
                key={index}
                className={
                  index === shown - 1 ? `${styles.item} ${styles.itemCurrent}` : styles.item
                }
              >
                {written(parts)}
              </li>
            ))}
          </ul>
        ) : (
          [
            { name: 'Partes distintas', items: distinct },
            { name: 'Partes impares', items: odd },
          ].map((group) => (
            <section key={group.name} className={styles.column} aria-label={group.name}>
              <span className={styles.columnTitle}>
                {group.name}: {Math.min(shown, group.items.length)} de {group.items.length}
              </span>
              <ul className={styles.list}>
                {group.items.slice(0, shown).map((parts, index) => (
                  <li
                    key={index}
                    className={
                      index === shown - 1 ? `${styles.item} ${styles.itemCurrent}` : styles.item
                    }
                  >
                    {written(parts)}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </VizFrame>
  );
}
