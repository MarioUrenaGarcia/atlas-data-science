import { useMemo, useState } from 'react';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { defaultSeed } from '../../core/defaultSeed.ts';
import { Latex } from '../../core/Latex.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SetStructures.module.css';

const ELEMENTS_PER_SECOND = 2;
const CHIP_RADIUS = 15;

interface PartitionViewProps {
  title: string;
  conceptId: string;
  elements: readonly number[];
  modulus: number;
  seed?: number;
}

/**
 * Elements are sent one at a time to their block. With the remainder
 * criterion the blocks are the classes of "same remainder modulo k"; with the
 * random criterion any assignment works, which shows that a partition only
 * requires nonempty, disjoint blocks that cover the set.
 */
export function PartitionView({ title, conceptId, elements, modulus, seed }: PartitionViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'criterio',
        label: 'Criterio de agrupación',
        options: [
          { value: 'residuo', label: 'Mismo residuo al dividir entre k' },
          { value: 'azar', label: 'Asignación al azar en k bloques' },
        ],
        default: 'residuo',
      },
      {
        type: 'number' as const,
        key: 'k',
        label: 'Número de bloques',
        symbol: 'k',
        min: 1,
        max: 6,
        step: 1,
        default: modulus,
      },
    ],
    [modulus],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const criterion = String(values.criterio);
  const k = Number(values.k);
  const seedState = useSeed(defaultSeed(conceptId, seed));
  const assignment = useMemo(() => {
    if (criterion === 'residuo') return elements.map((x) => ((x % k) + k) % k);
    const random = new Random(seedState.seed);
    return elements.map(() => random.int(0, k - 1));
  }, [criterion, elements, k, seedState.seed]);
  const [run, setRun] = useState(0);
  const [placed, update] = useResettableState<number>(
    `${criterion}|${k}|${seedState.seed}|${run}`,
    () => 0,
  );
  const playback = usePlayback({
    step: () => update((value) => Math.min(elements.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ELEMENTS_PER_SECOND,
    done: placed >= elements.length,
  });
  const blocks = Array.from({ length: k }, (_, block) =>
    elements.filter((_, index) => index < placed && assignment[index] === block),
  );
  const complete = placed >= elements.length;
  const nonEmpty = blocks.filter((block) => block.length > 0).length;
  const isPartition = complete && nonEmpty === k;
  const verdict = !complete
    ? 'Aún hay elementos sin asignar'
    : isPartition
      ? 'Es una partición: bloques no vacíos, disjuntos y que cubren el conjunto'
      : `No es una partición en ${k} bloques: ${k - nonEmpty} bloque quedó vacío`;
  const description = `${verdict}. ${blocks.map((block, index) => `Bloque ${index + 1}: ${block.length === 0 ? 'vacío' : block.join(', ')}`).join('; ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={criterion === 'azar' ? seedState : undefined}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Elementos asignados', value: `${placed} de ${elements.length}` },
        { label: 'Bloques no vacíos', value: `${nonEmpty} de ${k}` },
        {
          label: 'Resultado',
          value: complete ? (isPartition ? 'partición' : 'no es partición') : 'en proceso',
        },
      ]}
      description={description}
    >
      <p className={styles.notation}>
        <Latex
          tex={
            'A_i \\neq \\varnothing,\\quad A_i \\cap A_j = \\varnothing\\ (i \\neq j),\\quad \\bigcup_i A_i = S'
          }
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {(box) => {
          const poolHeight = box.inner.height * 0.3;
          const blockTop = box.inner.top + poolHeight + 10;
          const blockWidth = box.inner.width / k;
          const blockHeight = box.inner.height - poolHeight - 10;
          const perRow = Math.max(1, Math.floor((blockWidth - 16) / (CHIP_RADIUS * 2.4)));
          const poolPerRow = Math.max(1, Math.floor(box.inner.width / (CHIP_RADIUS * 2.4)));
          const slots = new Array<number>(k).fill(0);
          return (
            <>
              {Array.from({ length: k }, (_, block) => (
                <g key={block} aria-hidden="true">
                  <rect
                    x={box.inner.left + block * blockWidth + 4}
                    y={blockTop}
                    width={blockWidth - 8}
                    height={blockHeight}
                    rx={12}
                    fill={seriesColor(block)}
                    fillOpacity={0.08}
                    stroke={seriesColor(block)}
                    strokeWidth={2}
                    strokeDasharray={
                      complete && (blocks[block]?.length ?? 0) === 0 ? '6 4' : undefined
                    }
                  />
                  <text
                    x={box.inner.left + block * blockWidth + 14}
                    y={blockTop + 16}
                    className={svgStyles.label}
                    style={{ fontWeight: 700 }}
                  >
                    {criterion === 'residuo' ? `residuo ${block}` : `A${block + 1}`}
                  </text>
                </g>
              ))}
              {elements.map((x, index) => {
                let px: number;
                let py: number;
                if (index < placed) {
                  const block = assignment[index] ?? 0;
                  const slot = slots[block] ?? 0;
                  slots[block] = slot + 1;
                  px =
                    box.inner.left + block * blockWidth + 22 + (slot % perRow) * CHIP_RADIUS * 2.4;
                  py = blockTop + 44 + Math.floor(slot / perRow) * CHIP_RADIUS * 2.4;
                } else {
                  px = box.inner.left + CHIP_RADIUS + (index % poolPerRow) * CHIP_RADIUS * 2.4;
                  py =
                    box.inner.top +
                    CHIP_RADIUS +
                    4 +
                    Math.floor(index / poolPerRow) * CHIP_RADIUS * 2.4;
                }
                const color =
                  index < placed ? seriesColor(assignment[index] ?? 0) : 'var(--color-surface-2)';
                return (
                  <g
                    key={x}
                    className={svgStyles.movable}
                    style={{ transform: `translate(${px}px, ${py}px)` }}
                    aria-hidden="true"
                  >
                    <circle
                      r={CHIP_RADIUS}
                      fill={color}
                      fillOpacity={index < placed ? 0.3 : 1}
                      stroke={
                        index === placed - 1 ? DATA_COLORS.text : 'var(--color-border-strong)'
                      }
                      strokeWidth={index === placed - 1 ? 2.5 : 1}
                    />
                    <text textAnchor="middle" dy="0.35em" className={svgStyles.label}>
                      {x}
                    </text>
                  </g>
                );
              })}
            </>
          );
        }}
      </ChartSvg>
      <p className={isPartition ? styles.ok : styles.muted}>{verdict}.</p>
    </VizFrame>
  );
}
