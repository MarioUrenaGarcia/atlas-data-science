import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { cantorIntervals, totalLength } from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const MAX_LEVEL = 8;
const STEPS_PER_SECOND = 0.8;
const ROW_HEIGHT = 0.55;
const LABEL_GAP = 6;

interface CantorViewProps {
  title: string;
  level?: number;
}

/**
 * Construction of the Cantor set: at each level the open middle third of every
 * remaining interval is removed. Each row is one level. After k levels there
 * are 2^k intervals of length 3^-k, with total length (2/3)^k, which tends to
 * zero: the limit set has Lebesgue measure zero although it is uncountable.
 */
export function CantorView({ title, level = 0 }: CantorViewProps) {
  const [k, setK] = useState(Math.min(MAX_LEVEL, level));
  const playback = usePlayback({
    step: () => setK((value) => Math.min(MAX_LEVEL, value + 1)),
    reset: () => setK(0),
    rate: STEPS_PER_SECOND,
    done: k >= MAX_LEVEL,
  });
  const rows = Array.from({ length: k + 1 }, (_, i) => cantorIntervals(i));
  const length = totalLength(rows[k] ?? []);
  const description =
    `Nivel ${k}: quedan ${2 ** k} intervalos de longitud 1/${3 ** k} cada uno, con longitud total ${formatNumber(length, 4)}; ` +
    `se ha quitado ${formatNumber(1 - length, 4)} del intervalo [0, 1].`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Nivel k', value: String(k) },
        { label: 'Intervalos 2^k', value: String(2 ** k) },
        {
          label: 'Longitud total (2/3)^k',
          value: formatNumber(length, 4),
          color: DATA_COLORS.highlight,
        },
        { label: 'Longitud quitada', value: formatNumber(1 - length, 4) },
      ]}
      legend={[
        { label: 'Intervalos que quedan', color: DATA_COLORS.primary },
        { label: 'Nivel actual', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\lambda(C_{${k}}) = 2^{${k}} \\cdot 3^{-${k}} = \\left(\\tfrac{2}{3}\\right)^{${k}} = ${formatNumber(length, 4)} \\xrightarrow{k\\to\\infty} 0`}
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
            .domain([0, MAX_LEVEL + 1])
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
                {rows.map((intervals, level) => (
                  <g key={level}>
                    <text
                      x={box.inner.left - LABEL_GAP}
                      y={y(level + ROW_HEIGHT / 2) + 4}
                      textAnchor="end"
                      fontSize={11}
                      fill="var(--color-text-muted)"
                    >
                      {level}
                    </text>
                    {intervals.map(([a, b], i) => (
                      <rect
                        key={i}
                        x={x(a)}
                        width={Math.max(0.6, x(b) - x(a))}
                        y={y(level)}
                        height={y(ROW_HEIGHT) - y(0)}
                        fill={level === k ? DATA_COLORS.highlight : DATA_COLORS.primary}
                        fillOpacity={0.85}
                      />
                    ))}
                  </g>
                ))}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
