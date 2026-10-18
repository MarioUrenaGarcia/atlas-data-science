import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { binarySequences, sequenceProbability } from '../../../lib/inference/sufficiency.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PARTITIONS, type PartitionId } from './schema.ts';
import styles from './SufficiencyLab.module.css';

const P_STEPS = 16;
const STEPS_PER_SECOND = 3;
const DOT = 6;
const ROW = 22;
const BAR_WIDTH = 120;

const NAMES: Record<PartitionId, string> = {
  suma: 'Número de éxitos T = ΣX (suficiente mínimo)',
  'suma-y-primero': 'Éxitos y primer resultado (suficiente, no mínimo)',
  completa: 'Secuencia completa (suficiente, sin reducir)',
  primero: 'Solo el primer resultado (no suficiente)',
};

function groupKey(seq: readonly number[], partition: PartitionId): string {
  const k = seq.reduce((t, x) => t + x, 0);
  switch (partition) {
    case 'suma':
      return `T = ${k}`;
    case 'suma-y-primero':
      return `T = ${k}, X₁ = ${seq[0]}`;
    case 'completa':
      return seq.join('');
    case 'primero':
      return `X₁ = ${seq[0]}`;
  }
}

/** Largest change, over a grid of p, of the conditional probability of any sequence given its group. */
function conditionalSpread(sequences: readonly number[][], partition: PartitionId): number {
  let worst = 0;
  for (const seq of sequences) {
    const group = sequences.filter((s) => groupKey(s, partition) === groupKey(seq, partition));
    const values = [0.15, 0.35, 0.5, 0.65, 0.85].map(
      (p) => sequenceProbability(seq, p) / group.reduce((t, s) => t + sequenceProbability(s, p), 0),
    );
    worst = Math.max(worst, Math.max(...values) - Math.min(...values));
  }
  return worst;
}

interface SequencesViewProps {
  title: string;
  n: number;
  partition: PartitionId;
}

/**
 * Every possible sequence of n Bernoulli trials, grouped by the value of a
 * statistic. As p sweeps from 0.1 to 0.9 the probability of each sequence
 * changes, but for a sufficient statistic the probability of a sequence
 * within its group does not: once the statistic is known, the rest of the
 * data says nothing more about p.
 */
export function SequencesView({ title, n: n0, partition: part0 }: SequencesViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Número de ensayos',
        symbol: 'n',
        min: 2,
        max: 5,
        step: 1,
        default: n0,
      },
      {
        type: 'select',
        key: 'particion',
        label: 'Estadístico que agrupa las secuencias',
        options: PARTITIONS.map((value) => ({ value, label: NAMES[value] })),
        default: part0,
      },
    ],
    [n0, part0],
  );
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const partition = String(parameters.values.particion) as PartitionId;
  const sequences = useMemo(() => binarySequences(n), [n]);
  const groups = useMemo(() => {
    const map = new Map<string, number[][]>();
    for (const seq of [...sequences].sort(
      (a, b) => a.reduce((t, x) => t + x, 0) - b.reduce((t, x) => t + x, 0),
    )) {
      const key = groupKey(seq, partition);
      map.set(key, [...(map.get(key) ?? []), seq]);
    }
    return [...map.entries()];
  }, [sequences, partition]);
  const spread = useMemo(() => conditionalSpread(sequences, partition), [sequences, partition]);
  const sufficient = spread < 1e-9;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState<number>(String(run), () =>
    reducedMotion ? P_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(P_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= P_STEPS,
  });
  const p = 0.1 + (0.8 * step) / P_STEPS;
  const header = sufficient
    ? `p = ${formatNumber(p, 2)}:\\quad P(\\mathbf{x} \\mid \\text{grupo})\\ \\text{no depende de } p`
    : `p = ${formatNumber(p, 2)}:\\quad P(\\mathbf{x} \\mid \\text{grupo})\\ \\text{cambia con } p\\ (\\text{hasta } ${formatNumber(spread, 3)})`;
  const description =
    `${2 ** n} secuencias de ${n} ensayos agrupadas por ${NAMES[partition].toLowerCase()}, con p = ${formatNumber(p, 2)}. ` +
    (sufficient
      ? 'Dentro de cada grupo las probabilidades condicionales no dependen de p: el estadístico es suficiente.'
      : `Las probabilidades condicionales dentro de los grupos cambian con p (hasta ${formatNumber(spread, 3)}): el estadístico no es suficiente.`);
  const rows = groups.reduce((t, [, list]) => t + list.length, 0) + groups.length;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Probabilidad de éxito p', value: formatNumber(p, 2) },
        { label: 'Grupos', value: String(groups.length) },
        {
          label: '¿Suficiente?',
          value: sufficient ? 'sí' : 'no',
          color: sufficient ? DATA_COLORS.positive : DATA_COLORS.negative,
        },
      ]}
      legend={[
        { label: 'Éxito', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Probabilidad de la secuencia', color: DATA_COLORS.neutral },
        { label: 'Probabilidad dentro de su grupo', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.7}
        minHeight={rows * ROW * 0.5 + 40}
        maxHeight={rows * ROW + 40}
        margins={{ top: 20, right: 12, bottom: 8, left: 12 }}
      >
        {(box) => {
          const rowH = Math.min(ROW, box.inner.height / rows);
          const seqX = box.inner.left + 110;
          const barX = seqX + n * (DOT * 2 + 4) + 16;
          const barW = Math.min(BAR_WIDTH, (box.inner.left + box.inner.width - barX - 20) / 2);
          const maxProb = Math.max(...sequences.map((s) => sequenceProbability(s, p)));
          let y = box.inner.top;
          return (
            <g>
              <text x={barX} y={box.inner.top - 6} className={styles.chartLabel}>
                P(secuencia), relativa a la mayor
              </text>
              <text x={barX + barW + 16} y={box.inner.top - 6} className={styles.chartLabel}>
                P(secuencia | grupo)
              </text>
              {groups.map(([key, list], gi) => {
                const total = list.reduce((t, s) => t + sequenceProbability(s, p), 0);
                const top = y;
                y += rowH * (list.length + 1);
                return (
                  <g key={key}>
                    <text x={box.inner.left} y={top + rowH * 0.7} className={styles.chartLabel}>
                      {key}
                    </text>
                    <g aria-hidden="true">
                      {list.map((seq, si) => {
                        const cy = top + rowH * (si + 0.5);
                        const prob = sequenceProbability(seq, p);
                        const cond = prob / total;
                        return (
                          <g key={seq.join('')}>
                            {seq.map((x, i) => (
                              <circle
                                key={i}
                                cx={seqX + i * (DOT * 2 + 4)}
                                cy={cy}
                                r={DOT * 0.8}
                                fill={x ? DATA_COLORS.primary : 'none'}
                                stroke={seriesColor(gi % 6)}
                                strokeWidth={1.5}
                              />
                            ))}
                            <rect
                              x={barX}
                              y={cy - rowH * 0.35}
                              width={(barW * prob) / maxProb}
                              height={rowH * 0.7}
                              fill={DATA_COLORS.neutral}
                              fillOpacity={0.7}
                            />
                            <rect
                              x={barX + barW + 16}
                              y={cy - rowH * 0.35}
                              width={barW * cond}
                              height={rowH * 0.7}
                              fill={DATA_COLORS.secondary}
                              fillOpacity={0.8}
                            />
                          </g>
                        );
                      })}
                    </g>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
