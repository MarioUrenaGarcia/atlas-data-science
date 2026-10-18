import { useMemo, useState } from 'react';
import {
  integrate,
  MEASURE_FUNCTIONS,
  regionWhere,
  simpleApproximation,
  type MeasureFunctionId,
} from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const MAX_N = 6;
const STEPS_PER_SECOND = 0.7;

export type SimpleFocus = 'lebesgue' | 'riemann';

interface SimpleViewProps {
  title: string;
  id: MeasureFunctionId;
  focus: SimpleFocus;
  n?: number;
}

/**
 * Two ways of approximating the area under f from below. Lebesgue slices the
 * range: the value axis is cut into levels of height 2^-n and each level
 * contributes its height times the measure of the set where f exceeds it.
 * Riemann slices the domain: [0, 1] is cut into 2^n cells and each cell
 * contributes its width times the minimum of f on it. The animation refines n.
 */
export function SimpleView({ title, id, focus, n: initial = 1 }: SimpleViewProps) {
  const fn = MEASURE_FUNCTIONS[id];
  const [n, setN] = useState(Math.min(MAX_N, Math.max(1, initial)));
  const playback = usePlayback({
    step: () => setN((value) => Math.min(MAX_N, value + 1)),
    reset: () => setN(1),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_N,
  });
  const lebesgue = focus === 'lebesgue';
  const step = 2 ** -n;
  const phi = useMemo(() => simpleApproximation(fn.f, n), [fn, n]);
  const levels = useMemo(() => {
    if (!lebesgue) return [];
    const count = Math.floor(1 / step);
    return Array.from({ length: count }, (_, k) => {
      const t = (k + 1) * step;
      return { t, pieces: regionWhere((x) => fn.f(x) >= t, 0, 1) };
    });
  }, [fn, lebesgue, step]);
  const cells = useMemo(() => {
    if (lebesgue) return [];
    const count = 2 ** n;
    return Array.from({ length: count }, (_, i) => {
      const a = i / count;
      const b = (i + 1) / count;
      let low = Infinity;
      for (let j = 0; j <= 20; j += 1) low = Math.min(low, fn.f(a + ((b - a) * j) / 20));
      return { a, b, low };
    });
  }, [fn, lebesgue, n]);
  const approx = lebesgue
    ? integrate(phi, 0, 1)
    : cells.reduce((s, c) => s + c.low * (c.b - c.a), 0);
  const gap = fn.integral - approx;
  const description = lebesgue
    ? `Nivel n = ${n}: la función simple redondea f(x) = ${fn.name} hacia abajo a múltiplos de 1/${2 ** n}; su integral es ${formatNumber(approx, 4)} frente a ${formatNumber(fn.integral, 4)}.`
    : `Nivel n = ${n}: ${2 ** n} celdas verticales con el mínimo de f(x) = ${fn.name} en cada una; la suma inferior es ${formatNumber(approx, 4)} frente a ${formatNumber(fn.integral, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Nivel n', value: String(n) },
        { label: lebesgue ? 'Altura de cada franja' : 'Ancho de cada celda', value: `1/${2 ** n}` },
        {
          label: lebesgue ? '∫ φₙ dλ' : 'Suma inferior',
          value: formatNumber(approx, 4),
          color: DATA_COLORS.highlight,
        },
        { label: '∫ f dλ', value: formatNumber(fn.integral, 4) },
        { label: 'Falta', value: formatNumber(gap, 4) },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        {
          label: lebesgue ? 'Franjas horizontales de la función simple' : 'Rectángulos verticales',
          color: DATA_COLORS.secondary,
        },
      ]}
      description={description}
    >
      <FormulaLine
        tex={
          lebesgue
            ? `\\int \\varphi_{${n}}\\,d\\lambda = \\sum_{k=1}^{${2 ** n}} \\tfrac{1}{${2 ** n}}\\,\\lambda\\big(\\{f \\ge \\tfrac{k}{${2 ** n}}\\}\\big) = ${formatNumber(approx, 4)} \\le \\int f\\,d\\lambda = ${formatNumber(fn.integral, 4)}`
            : `L_{${2 ** n}} = \\sum_{i=1}^{${2 ** n}} \\tfrac{1}{${2 ** n}} \\min_{x \\in I_i} f(x) = ${formatNumber(approx, 4)} \\le \\int_0^1 f(x)\\,dx = ${formatNumber(fn.integral, 4)}`
        }
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={[0, 1.05]}
        label={description}
        curves={[
          {
            f: fn.f,
            color: DATA_COLORS.primary,
            width: 3,
            breaks: id === 'escalon' ? [0.5] : undefined,
          },
        ]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            {lebesgue
              ? levels.flatMap(({ t, pieces }, k) =>
                  pieces.map(([a, b], j) => (
                    <rect
                      key={`${k}-${j}`}
                      x={x(a)}
                      width={Math.max(0.5, x(b) - x(a))}
                      y={y(t)}
                      height={y(t - step) - y(t)}
                      fill={DATA_COLORS.secondary}
                      fillOpacity={k % 2 === 0 ? 0.25 : 0.55}
                      stroke={DATA_COLORS.secondary}
                      strokeWidth={0.5}
                    />
                  )),
                )
              : cells.map((c, i) => (
                  <rect
                    key={i}
                    x={x(c.a)}
                    width={x(c.b) - x(c.a)}
                    y={y(c.low)}
                    height={y(0) - y(c.low)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.45}
                    stroke="var(--color-surface)"
                    strokeWidth={1}
                  />
                ))}
          </g>
        )}
      />
    </VizFrame>
  );
}
