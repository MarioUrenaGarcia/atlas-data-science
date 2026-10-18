import { useMemo, useState } from 'react';
import { DENSITIES, dyadicRatios, type DensityId } from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const MAX_K = 7;
const STEPS_PER_SECOND = 0.8;
const Y_MAX = 2.2;
/** Point whose cell is followed in the readouts. */
const PROBE = 0.3;

interface RadonViewProps {
  title: string;
  density: DensityId;
}

/**
 * The measure nu(A) = integral over A of g, compared with the Lebesgue measure mu
 * on dyadic cells. On each cell the bar is the ratio nu(I) / mu(I); as the cells
 * shrink the bars approach the curve g, which is the Radon-Nikodym derivative
 * dnu/dmu. The readouts follow the cell that contains x = 0.3.
 */
export function RadonView({ title, density }: RadonViewProps) {
  const { g, tex } = DENSITIES[density];
  const [k, setK] = useState(0);
  const playback = usePlayback({
    step: () => setK((value) => Math.min(MAX_K, value + 1)),
    reset: () => setK(0),
    rate: STEPS_PER_SECOND,
    done: k >= MAX_K,
  });
  const cells = useMemo(() => dyadicRatios(g, k), [g, k]);
  const probe = cells.find((c) => PROBE >= c.a && PROBE < c.b) ??
    cells[0] ?? { a: 0, b: 1, ratio: 1 };
  const nu = probe.ratio * (probe.b - probe.a);
  const description =
    `${cells.length} celdas de ancho 1/${cells.length}. En la celda [${formatNumber(probe.a, 4)}, ${formatNumber(probe.b, 4)}], ` +
    `ν(I)/μ(I) = ${formatNumber(probe.ratio, 4)}, frente a g(0.3) = ${formatNumber(g(PROBE), 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Celdas', value: String(cells.length) },
        {
          label: 'Celda con x = 0.3',
          value: `[${formatNumber(probe.a, 4)}, ${formatNumber(probe.b, 4)}]`,
        },
        { label: 'ν(I)', value: formatNumber(nu, 5) },
        { label: 'μ(I)', value: formatNumber(probe.b - probe.a, 5) },
        { label: 'ν(I)/μ(I)', value: formatNumber(probe.ratio, 4), color: DATA_COLORS.highlight },
        { label: 'g(0.3)', value: formatNumber(g(PROBE), 4) },
      ]}
      legend={[
        { label: 'Cociente ν(I)/μ(I) en cada celda', color: DATA_COLORS.secondary },
        { label: 'Derivada g = dν/dμ', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Celda que contiene a 0.3', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\nu(A) = \\int_A ${tex}\\,d\\mu,\\qquad \\frac{\\nu(I)}{\\mu(I)} = \\frac{${formatNumber(nu, 5)}}{${formatNumber(probe.b - probe.a, 5)}} = ${formatNumber(probe.ratio, 4)} \\;\\to\\; \\frac{d\\nu}{d\\mu}(0.3) = ${formatNumber(g(PROBE), 4)}`}
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, Y_MAX]}
        label={description}
        curves={[
          {
            f: g,
            color: DATA_COLORS.primary,
            width: 3,
            breaks: density === 'escalon' ? [0.5] : undefined,
          },
        ]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            {cells.map((c, i) => {
              const isProbe = c === probe;
              return (
                <rect
                  key={i}
                  x={x(c.a)}
                  width={x(c.b) - x(c.a)}
                  y={y(c.ratio)}
                  height={y(0) - y(c.ratio)}
                  fill={isProbe ? DATA_COLORS.highlight : DATA_COLORS.secondary}
                  fillOpacity={isProbe ? 0.7 : 0.4}
                  stroke="var(--color-surface)"
                  strokeWidth={cells.length > 64 ? 0 : 1}
                />
              );
            })}
          </g>
        )}
      />
    </VizFrame>
  );
}
