import { useState } from 'react';
import {
  MEASURE_FUNCTIONS,
  regionWhere,
  type MeasureFunctionId,
} from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

/** The band moves in steps of 1/80 so that interval ends written with two decimals are nodes. */
const STEP_SIZE = 0.0125;
const STEPS_PER_SECOND = 6;
/** Grid used to locate the preimage; fine enough for three correct decimals at the ends. */
const PREIMAGE_CELLS = 20000;
const DEFAULT_INTERVAL: [number, number] = [0.25, 0.5];
const Y_RANGE: [number, number] = [-0.08, 1.05];
const STRIP = 0.03;

interface PreimageViewProps {
  title: string;
  id: MeasureFunctionId;
  interval?: [number, number];
}

/**
 * A function is measurable when the preimage of every interval is a
 * measurable set. The band on the vertical axis is an interval B of values;
 * the thick segments on the horizontal axis are f^-1(B), the points sent into
 * B. The animation slides B upward and the preimage changes shape, always a
 * finite union of intervals here, with a length that defines the image measure.
 */
export function PreimageView({ title, id, interval = DEFAULT_INTERVAL }: PreimageViewProps) {
  const fn = MEASURE_FUNCTIONS[id];
  const width = Math.max(0.02, interval[1] - interval[0]);
  const top = 1 - width;
  const steps = Math.floor(top / STEP_SIZE + 1e-9);
  const first = Math.round(Math.min(top, Math.max(0, interval[0])) / STEP_SIZE);
  const [step, setStep] = useState(first);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(steps, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= steps,
  });
  const a = step * STEP_SIZE;
  const b = a + width;
  const pieces = regionWhere(
    (x) => {
      const v = fn.f(x);
      return v >= a && v <= b;
    },
    0,
    1,
    PREIMAGE_CELLS,
  );
  const measure = pieces.reduce((s, [l, r]) => s + (r - l), 0);
  const piecesText =
    pieces.length === 0
      ? 'vacía'
      : pieces.map(([l, r]) => `[${formatNumber(l, 3)}, ${formatNumber(r, 3)}]`).join(' ∪ ');
  const description =
    `B = [${formatNumber(a, 2)}, ${formatNumber(b, 2)}]: la preimagen bajo f(x) es ${piecesText}, ` +
    `con longitud ${formatNumber(measure, 3)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Intervalo B', value: `[${formatNumber(a, 2)}, ${formatNumber(b, 2)}]` },
        { label: 'Piezas de la preimagen', value: String(pieces.length) },
        { label: 'λ(f⁻¹(B))', value: formatNumber(measure, 3), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'f(x)', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Intervalo B de valores', color: DATA_COLORS.secondary },
        { label: 'Preimagen f⁻¹(B)', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`f(x) = ${fn.tex},\\quad f^{-1}([${formatNumber(a, 2)}, ${formatNumber(b, 2)}]) = \\{x : ${formatNumber(a, 2)} \\le f(x) \\le ${formatNumber(b, 2)}\\},\\quad \\lambda = ${formatNumber(measure, 3)}`}
      />
      <FunctionPlot
        xDomain={[0, 1]}
        yDomain={Y_RANGE}
        label={description}
        curves={[
          {
            f: fn.f,
            color: DATA_COLORS.primary,
            width: 3,
            breaks: id === 'escalon' ? [0.5] : undefined,
          },
        ]}
        background={({ x, y, box }) => (
          <g aria-hidden="true">
            <rect
              x={box.inner.left}
              width={box.inner.width}
              y={y(b)}
              height={y(a) - y(b)}
              fill={DATA_COLORS.secondary}
              fillOpacity={0.15}
            />
            {pieces.map(([l, r], i) => (
              <rect
                key={i}
                x={x(l)}
                width={Math.max(1, x(r) - x(l))}
                y={y(a)}
                height={y(Y_RANGE[0] + STRIP) - y(a)}
                fill={DATA_COLORS.highlight}
                fillOpacity={0.12}
              />
            ))}
          </g>
        )}
      >
        {({ x, y }) => (
          <g aria-hidden="true">
            {pieces.map(([l, r], i) => (
              <line
                key={i}
                x1={x(l)}
                x2={x(r)}
                y1={y(Y_RANGE[0] + STRIP)}
                y2={y(Y_RANGE[0] + STRIP)}
                stroke={DATA_COLORS.highlight}
                strokeWidth={6}
                strokeLinecap="butt"
              />
            ))}
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
