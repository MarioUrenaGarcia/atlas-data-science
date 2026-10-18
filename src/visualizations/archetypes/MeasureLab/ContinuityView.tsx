import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const MAX_N = 12;
const STEPS_PER_SECOND = 1.5;
const ROW_FILL = 0.6;
const LABEL_GAP = 6;

export type ContinuityDirection = 'creciente' | 'decreciente';

interface ContinuityViewProps {
  title: string;
  direction: ContinuityDirection;
}

/** Right end of the n-th set: [0, 1 - 1/n] grows to [0, 1), [0, 1/n] shrinks to {0}. */
const rightEnd = (direction: ContinuityDirection, n: number) =>
  direction === 'creciente' ? 1 - 1 / n : 1 / n;

/**
 * Continuity of a measure along monotone sequences of sets. Each row is one
 * set of the sequence. For increasing sets the measures climb to the measure
 * of the union; for decreasing sets of finite measure they fall to the
 * measure of the intersection.
 */
export function ContinuityView({ title, direction }: ContinuityViewProps) {
  const [n, setN] = useState(1);
  const playback = usePlayback({
    step: () => setN((value) => Math.min(MAX_N, value + 1)),
    reset: () => setN(1),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_N,
  });
  const growing = direction === 'creciente';
  const measure = rightEnd(direction, n);
  const limit = growing ? 1 : 0;
  const setTex = growing
    ? `A_{${n}} = [0, 1 - \\tfrac{1}{${n}}]`
    : `A_{${n}} = [0, \\tfrac{1}{${n}}]`;
  const limitTex = growing
    ? `\\lambda\\Big(\\bigcup_n A_n\\Big) = \\lambda([0, 1)) = 1`
    : `\\lambda\\Big(\\bigcap_n A_n\\Big) = \\lambda(\\{0\\}) = 0`;
  const description =
    `${growing ? 'Conjuntos crecientes' : 'Conjuntos decrecientes'}: el conjunto ${n} mide ${formatNumber(measure, 4)}; ` +
    `las medidas tienden a ${limit}, la medida del ${growing ? 'límite unión, [0, 1)' : 'límite intersección, el punto 0'}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Índice n', value: String(n) },
        { label: 'Medida de A_n', value: formatNumber(measure, 4), color: DATA_COLORS.highlight },
        { label: 'Medida del límite', value: String(limit) },
        { label: 'Diferencia', value: formatNumber(Math.abs(measure - limit), 4) },
      ]}
      legend={[
        { label: 'Conjuntos anteriores', color: DATA_COLORS.primary },
        { label: 'Conjunto actual', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`${setTex},\\quad \\lambda(A_{${n}}) = ${formatNumber(measure, 4)} \\to ${limitTex}`}
      />
      <ChartSvg
        label={description}
        aspect={0.45}
        minHeight={200}
        maxHeight={380}
        margins={{ left: 40, bottom: 36 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, MAX_N])
            .range([box.inner.top, box.inner.top + box.inner.height]);
          return (
            <>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
              />
              <g aria-hidden="true">
                {Array.from({ length: n }, (_, i) => {
                  const end = rightEnd(direction, i + 1);
                  const current = i + 1 === n;
                  return (
                    <g key={i}>
                      <text
                        x={box.inner.left - LABEL_GAP}
                        y={y(i + ROW_FILL / 2) + 4}
                        textAnchor="end"
                        fontSize={11}
                        fill="var(--color-text-muted)"
                      >
                        {i + 1}
                      </text>
                      <rect
                        x={x(0)}
                        width={Math.max(1, x(end) - x(0))}
                        y={y(i)}
                        height={y(ROW_FILL) - y(0)}
                        fill={current ? DATA_COLORS.highlight : DATA_COLORS.primary}
                        fillOpacity={current ? 0.9 : 0.5}
                      />
                    </g>
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
