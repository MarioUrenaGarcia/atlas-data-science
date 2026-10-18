import { useMemo, useState } from 'react';
import {
  averageLength,
  binaryEntropy,
  blockDistribution,
  huffman,
} from '../../../lib/information/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { bitsText } from './units.ts';

const MAX_BLOCK = 6;
const STEPS_PER_SECOND = 0.8;
const DOT_RADIUS = 6;
const DEFAULT_P = 0.1;

interface SourceViewProps {
  title: string;
  p?: number;
  block?: number;
}

/**
 * Source coding theorem for a binary source with P(1) = p: a Huffman code on
 * blocks of n symbols spends L_n / n bits per symbol, which lies between H and
 * H + 1/n. The animation grows the block length and the points fall onto the
 * entropy line, the limit no lossless code can beat.
 */
export function SourceView({ title, p = DEFAULT_P, block = 1 }: SourceViewProps) {
  const [n, setN] = useState(Math.min(MAX_BLOCK, Math.max(1, block)));
  const playback = usePlayback({
    step: () => setN((value) => Math.min(MAX_BLOCK, value + 1)),
    reset: () => setN(1),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_BLOCK,
  });
  const h = binaryEntropy(p);
  const rates = useMemo(
    () =>
      Array.from({ length: MAX_BLOCK }, (_, k) => {
        const blocks = blockDistribution([1 - p, p], k + 1);
        return averageLength(blocks, huffman(blocks).codes) / (k + 1);
      }),
    [p],
  );
  const rate = rates[n - 1] ?? 1;
  const description =
    `Fuente binaria con P(1) = ${formatNumber(p, 3)} y entropía ${formatNumber(h, 3)} bits por símbolo. ` +
    `Con bloques de ${n} símbolos, Huffman gasta ${formatNumber(rate, 3)} bits por símbolo, ` +
    `cota superior H + 1/n = ${formatNumber(h + 1 / n, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Bloque n', value: String(n) },
        { label: 'Bloques distintos', value: String(2 ** n) },
        { label: 'Entropía H', value: bitsText(h, 3) },
        { label: 'L_n / n', value: bitsText(rate, 3), color: DATA_COLORS.highlight },
        { label: 'H + 1/n', value: bitsText(h + 1 / n, 3) },
      ]}
      legend={[
        { label: 'Entropía H', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Cota H + 1/n', color: DATA_COLORS.muted, shape: 'dashed' },
        { label: 'Huffman por bloques', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`H = ${formatNumber(h, 3)} \\le \\frac{L_{${n}}}{${n}} = ${formatNumber(rate, 3)} < H + \\frac{1}{${n}} = ${formatNumber(h + 1 / n, 3)}\\ \\text{bits por símbolo}`}
      />
      <FunctionPlot
        xDomain={[0.5, MAX_BLOCK + 0.5]}
        yDomain={[0, 1.1]}
        xLabel="tamaño del bloque n"
        label={description}
        curves={[
          { f: () => h, color: DATA_COLORS.primary, width: 2.5 },
          { f: (x) => h + 1 / x, color: DATA_COLORS.muted, width: 1.5, dashed: true },
        ]}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {rates.slice(0, n).map((r, k) => (
              <circle
                key={k}
                cx={x(k + 1)}
                cy={y(r)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
