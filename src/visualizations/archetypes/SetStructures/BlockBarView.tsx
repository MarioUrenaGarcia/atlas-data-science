import { useMemo, useState } from 'react';
import { seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SetStructures.module.css';

const BLOCKS_PER_SECOND = 1.2;
const BAR_HEIGHT = 56;
/** Blocks narrower than this show no text inside. */
const MIN_LABEL_WIDTH = 46;

export interface CountedBlock {
  nombre: string;
  n: number;
  partes?: { nombre: string; n: number }[];
}

interface BlockBarViewProps {
  title: string;
  universe: string;
  blocks: readonly CountedBlock[];
}

/**
 * A population split into blocks drawn as a bar whose segments have widths
 * proportional to their sizes. The blocks appear one at a time and together
 * fill the whole bar exactly once; refining splits every block into parts,
 * and the finer pieces still add up to the same total.
 */
export function BlockBarView({ title, universe, blocks }: BlockBarViewProps) {
  const refinable = blocks.some((block) => block.partes && block.partes.length > 0);
  const definitions = useMemo(
    () =>
      refinable
        ? [
            {
              type: 'toggle' as const,
              key: 'refinar',
              label: 'Refinar cada bloque',
              default: false,
            },
          ]
        : [],
    [refinable],
  );
  const parameters = useParameters(definitions);
  const refine = refinable && Boolean((parameters.values as Record<string, boolean>).refinar);
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${refine}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(blocks.length, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: BLOCKS_PER_SECOND,
    done: shown >= blocks.length,
  });
  const total = blocks.reduce((sum, block) => sum + block.n, 0);
  const placed = blocks.slice(0, shown).reduce((sum, block) => sum + block.n, 0);
  const pieces = refine
    ? blocks.flatMap((block, index) =>
        (block.partes && block.partes.length > 0
          ? block.partes
          : [{ nombre: block.nombre, n: block.n }]
        ).map((part) => ({
          ...part,
          label: `${block.nombre} ${part.nombre}`,
          block: index,
        })),
      )
    : blocks.map((block, index) => ({
        nombre: block.nombre,
        n: block.n,
        label: block.nombre,
        block: index,
      }));
  const description =
    `${universe}: ${total}. Bloques colocados: ${shown} de ${blocks.length}, con ${placed} elementos. ` +
    pieces.map((piece) => `${piece.label}: ${piece.n}`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        {
          label: 'Suma de los bloques colocados',
          value: `${
            blocks
              .slice(0, shown)
              .map((block) => block.n)
              .join(' + ') || '0'
          } = ${placed}`,
        },
        { label: universe, value: String(total) },
        { label: 'Bloques', value: String(refine ? pieces.length : blocks.length) },
      ]}
      legend={blocks.map((block, index) => ({ label: block.nombre, color: seriesColor(index) }))}
      description={description}
      dataTable={{
        caption: 'Tamaño de cada bloque',
        columns: ['Bloque', 'Elementos'],
        rows: pieces.map((piece) => [piece.label, piece.n]),
      }}
    >
      <p className={styles.notation}>
        {universe}: {total} = {blocks.map((block) => block.n).join(' + ')}
      </p>
      <ChartSvg
        label={description}
        aspect={0}
        minHeight={BAR_HEIGHT + 60}
        maxHeight={BAR_HEIGHT + 60}
        margins={{ top: 20, right: 12, bottom: 30, left: 12 }}
      >
        {(box) => {
          let offset = box.inner.left;
          return (
            <g aria-hidden="true">
              <rect
                x={box.inner.left}
                y={box.inner.top}
                width={box.inner.width}
                height={BAR_HEIGHT}
                rx={8}
                fill="var(--color-surface-2)"
                stroke="var(--color-border-strong)"
                strokeDasharray="5 4"
              />
              {pieces.map((piece, index) => {
                const width = (box.inner.width * piece.n) / total;
                const x = offset;
                offset += width;
                const visible = piece.block < shown;
                const lighter =
                  refine && (blocks[piece.block]?.partes?.length ?? 0) > 0 && index % 2 === 1;
                return (
                  <g key={piece.label} opacity={visible ? 1 : 0}>
                    <rect
                      x={x + 1}
                      y={box.inner.top + 1}
                      width={Math.max(0, width - 2)}
                      height={BAR_HEIGHT - 2}
                      rx={6}
                      fill={seriesColor(piece.block)}
                      fillOpacity={lighter ? 0.35 : 0.65}
                    />
                    {width >= MIN_LABEL_WIDTH && (
                      <>
                        <text
                          x={x + width / 2}
                          y={box.inner.top + BAR_HEIGHT / 2 - 6}
                          textAnchor="middle"
                          className={svgStyles.label}
                          style={{ fontSize: 11, fontWeight: 700 }}
                        >
                          {piece.nombre}
                        </text>
                        <text
                          x={x + width / 2}
                          y={box.inner.top + BAR_HEIGHT / 2 + 10}
                          textAnchor="middle"
                          className={svgStyles.label}
                          style={{ fontSize: 11 }}
                        >
                          {piece.n}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
              <text
                x={box.inner.left}
                y={box.inner.top + BAR_HEIGHT + 20}
                className={svgStyles.labelMuted}
              >
                {universe}: {placed} de {total} colocados
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
