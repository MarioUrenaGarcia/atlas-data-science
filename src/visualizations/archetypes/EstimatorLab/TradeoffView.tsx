import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const STEPS = 50;
const STEPS_PER_SECOND = 10;
const CURVE_POINTS = 100;

interface TradeoffViewProps {
  title: string;
  n: number;
  theta: number;
  sigma: number;
}

/**
 * The shrunken mean c times the sample mean, for c from 0 to 1. Shrinking
 * adds bias (1 - c) theta but cuts the variance to c squared times sigma
 * squared over n; the mean squared error, their sum, is minimized at an
 * intermediate c, not at the unbiased c = 1.
 */
export function TradeoffView({ title, n: n0, theta: t0, sigma: s0 }: TradeoffViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 1,
        max: 100,
        step: 1,
        default: n0,
      },
      {
        type: 'number',
        key: 'theta',
        label: 'Media verdadera',
        symbol: 'μ',
        min: 0.1,
        max: 5,
        step: 0.1,
        default: t0,
        digits: 1,
      },
      {
        type: 'number',
        key: 'sigma',
        label: 'Desviación de los datos',
        symbol: 'σ',
        min: 0.5,
        max: 10,
        step: 0.5,
        default: s0,
        digits: 1,
      },
    ],
    [n0, t0, s0],
  );
  const parameters = useParameters(definitions);
  const n = Number(parameters.values.n);
  const theta = Number(parameters.values.theta);
  const sigma = Number(parameters.values.sigma);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState<number>(String(run), () =>
    reducedMotion ? STEPS : 0,
  );
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const v0 = (sigma * sigma) / n;
  const bias2 = (c: number) => ((1 - c) * theta) ** 2;
  const variance = (c: number) => c * c * v0;
  const mse = (c: number) => bias2(c) + variance(c);
  const cStar = (theta * theta) / (theta * theta + v0);
  const c = step >= STEPS ? cStar : step / STEPS;
  const f = (v: number) => formatNumber(v, 4);
  const header = `c = ${formatNumber(c, 3)}:\\quad \\text{ECM} = \\underbrace{${f(variance(c))}}_{c^2\\sigma^2/n} + \\underbrace{${f(bias2(c))}}_{(1 - c)^2\\mu^2} = ${f(mse(c))},\\qquad c^{*} = \\frac{\\mu^2}{\\mu^2 + \\sigma^2/n} = ${formatNumber(cStar, 3)}`;
  const description =
    `Estimador c por la media muestral con n = ${n}, media ${formatNumber(theta, 1)} y desviación ${formatNumber(sigma, 1)}. ` +
    `Con c = ${formatNumber(c, 3)} la varianza es ${f(variance(c))}, el sesgo al cuadrado ${f(bias2(c))} y el error cuadrático medio ${f(mse(c))}. ` +
    `El mínimo está en c = ${formatNumber(cStar, 3)} con error ${f(mse(cStar))}, frente a ${f(mse(1))} del estimador insesgado.`;
  const yMax = Math.max(mse(0), mse(1)) * 1.1;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Factor c', value: formatNumber(c, 3) },
        { label: 'Varianza', value: f(variance(c)), color: DATA_COLORS.primary },
        { label: 'Sesgo al cuadrado', value: f(bias2(c)), color: DATA_COLORS.secondary },
        { label: 'ECM', value: f(mse(c)), color: DATA_COLORS.text },
        { label: 'ECM del insesgado (c = 1)', value: f(mse(1)) },
        { label: 'ECM mínimo', value: f(mse(cStar)), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Varianza', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Sesgo al cuadrado', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Error cuadrático medio', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Factor óptimo', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 12, right: 20, bottom: 46, left: 64 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const line = (g: (c: number) => number) =>
            Array.from(
              { length: CURVE_POINTS + 1 },
              (_, i) => `${x(i / CURVE_POINTS)},${y(g(i / CURVE_POINTS))}`,
            ).join(' ');
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="Error"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={10}
                label="Factor de contracción c"
              />
              <g aria-hidden="true">
                <polyline
                  points={line(variance)}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                />
                <polyline
                  points={line(bias2)}
                  fill="none"
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={2}
                />
                <polyline
                  points={line(mse)}
                  fill="none"
                  stroke={DATA_COLORS.text}
                  strokeWidth={3}
                />
                {step >= STEPS && (
                  <line
                    x1={x(cStar)}
                    x2={x(cStar)}
                    y1={box.inner.top}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.highlight}
                    strokeDasharray="5 3"
                    strokeWidth={2}
                  />
                )}
                <circle cx={x(c)} cy={y(mse(c))} r={6} fill={DATA_COLORS.text} />
                <circle cx={x(c)} cy={y(variance(c))} r={4} fill={DATA_COLORS.primary} />
                <circle cx={x(c)} cy={y(bias2(c))} r={4} fill={DATA_COLORS.secondary} />
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
