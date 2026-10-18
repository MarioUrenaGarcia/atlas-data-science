import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { binomialExpectation } from '../../../lib/inference/sufficiency.ts';
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

const SWEEP = 40;
const STEPS_PER_SECOND = 8;
const CURVE_POINTS = 120;

interface CompletenessViewProps {
  title: string;
  g: number[];
}

/**
 * A function g of a binomial count T and its expected value as a function
 * of p. The expectation is a polynomial in p whose coefficients are fixed by
 * g; it vanishes for every p only when g is zero everywhere, which is what
 * makes the binomial family complete.
 */
export function CompletenessView({ title, g: g0 }: CompletenessViewProps) {
  const n = g0.length - 1;
  const gKey = g0.join(',');
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      gKey
        .split(',')
        .map(Number)
        .map((v, k) => ({
          type: 'number' as const,
          key: `g${k}`,
          label: `Valor de g en T = ${k}`,
          symbol: `g(${k})`,
          min: -3,
          max: 3,
          step: 0.1,
          default: v,
          digits: 1,
        })),
    [gKey],
  );
  const parameters = useParameters(definitions);
  const g = g0.map((_, k) => Number(parameters.values[`g${k}`]));
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [step, setStep] = useResettableState<number>(String(run), () =>
    reducedMotion ? SWEEP : 0,
  );
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(SWEEP, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP,
  });
  const p = step / SWEEP;
  const value = binomialExpectation(g, p);
  const curve = Array.from({ length: CURVE_POINTS + 1 }, (_, i) =>
    binomialExpectation(g, i / CURVE_POINTS),
  );
  const maxAbs = Math.max(...curve.map(Math.abs));
  const allZero = g.every((v) => Math.abs(v) < 1e-9);
  const header = `\\mathbb{E}_p[g(T)] = \\sum_{k=0}^{${n}} g(k)\\binom{${n}}{k}p^k(1-p)^{${n}-k},\\quad p = ${formatNumber(p, 2)}:\\ ${formatNumber(value, 3)}`;
  const description =
    `Función g con valores ${g.map((v) => formatNumber(v, 1)).join(', ')} en T = 0 a ${n}, con T binomial de ${n} ensayos. ` +
    `Su esperanza en p = ${formatNumber(p, 2)} vale ${formatNumber(value, 3)}; el mayor valor absoluto sobre todos los p es ${formatNumber(maxAbs, 3)}` +
    (allZero
      ? ', porque g es cero en todos lados.'
      : ', distinto de cero aunque la curva cruce el cero en algún punto.');
  const yMax = Math.max(1, maxAbs * 1.1);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'p', value: formatNumber(p, 2) },
        { label: 'E[g(T)] en p', value: formatNumber(value, 3), color: DATA_COLORS.secondary },
        { label: 'Máximo de |E[g(T)]|', value: formatNumber(maxAbs, 3) },
        { label: '¿g es cero en todo T?', value: allZero ? 'sí' : 'no' },
      ]}
      legend={[{ label: 'E_p[g(T)] como función de p', color: DATA_COLORS.primary, shape: 'line' }]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={240}
        maxHeight={380}
        margins={{ top: 12, right: 20, bottom: 46, left: 56 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([-yMax, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={6}
                label="E[g(T)]"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={10}
                label="p"
              />
              <g aria-hidden="true">
                <line
                  x1={box.inner.left}
                  x2={box.inner.left + box.inner.width}
                  y1={y(0)}
                  y2={y(0)}
                  stroke={DATA_COLORS.text}
                />
                <polyline
                  points={curve.map((v, i) => `${x(i / CURVE_POINTS)},${y(v)}`).join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                <circle cx={x(p)} cy={y(value)} r={6} fill={DATA_COLORS.secondary} />
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
