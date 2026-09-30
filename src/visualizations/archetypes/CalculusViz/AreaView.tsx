import { useMemo, useState } from 'react';
import { CALC_FUNCTIONS } from '../../../lib/calculus/catalog.ts';
import { integrate } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const FILL_STEPS = 60;
const STEPS_PER_SECOND = 20;

interface AreaViewProps {
  title: string;
  id: string;
  interval: [number, number];
}

/**
 * The definite integral as signed area. The region fills from a to b; the
 * part above the axis counts positive and the part below counts negative,
 * so the integral can be smaller than the total shaded area, or even zero.
 */
export function AreaView({ title, id, interval }: AreaViewProps) {
  const fn = CALC_FUNCTIONS[id] ?? CALC_FUNCTIONS.seno;
  const [lo, hi] = fn?.domain ?? [-3, 3];
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'a',
        label: 'Límite inferior',
        symbol: 'a',
        min: lo,
        max: hi,
        step: (hi - lo) / 200,
        default: interval[0],
        digits: 2,
      },
      {
        type: 'number' as const,
        key: 'b',
        label: 'Límite superior',
        symbol: 'b',
        min: lo,
        max: hi,
        step: (hi - lo) / 200,
        default: interval[1],
        digits: 2,
      },
    ],
    [lo, hi, interval],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const a = Math.min(Number(values.a), Number(values.b));
  const b = Math.max(Number(values.a), Number(values.b));
  const [step, setStep] = useState(FILL_STEPS);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(FILL_STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= FILL_STEPS,
  });
  if (!fn) return null;
  const end = a + ((b - a) * step) / FILL_STEPS;
  const positive = integrate((t) => Math.max(0, fn.f(t)), a, end);
  const negative = integrate((t) => Math.min(0, fn.f(t)), a, end);
  const integral = positive + negative;
  const description =
    `Integral de ${formatNumber(a, 2)} a ${formatNumber(end, 2)}: área sobre el eje ${formatNumber(positive, 4)}, bajo el eje ${formatNumber(-negative, 4)}; ` +
    `integral con signo ${formatNumber(integral, 4)} y área total ${formatNumber(positive - negative, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        {
          label: 'Área sobre el eje',
          value: formatNumber(positive, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Área bajo el eje',
          value: formatNumber(-negative, 4),
          color: DATA_COLORS.secondary,
        },
        { label: 'Integral (área con signo)', value: formatNumber(integral, 4) },
        { label: 'Área total sin signo', value: formatNumber(positive - negative, 4) },
      ]}
      legend={[
        { label: 'Área que suma', color: DATA_COLORS.primary },
        { label: 'Área que resta', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\int_{${formatNumber(a, 2)}}^{${formatNumber(end, 2)}} ${fn.latex}\\,dx = ${formatNumber(positive, 4)} - ${formatNumber(-negative, 4)} = ${formatNumber(integral, 4)}`}
        />
      </p>
      <FunctionPlot
        xDomain={fn.domain}
        yDomain={autoYDomain([{ f: fn.f, color: '' }], fn.domain)}
        label={description}
        curves={[{ f: fn.f, color: DATA_COLORS.text, width: 2.5 }]}
        background={({ x, y }) => (
          <g aria-hidden="true">
            <polygon
              points={areaPoints(fn.f, a, end, x, y, 1)}
              fill={DATA_COLORS.primary}
              fillOpacity={0.35}
            />
            <polygon
              points={areaPoints(fn.f, a, end, x, y, -1)}
              fill={DATA_COLORS.secondary}
              fillOpacity={0.35}
            />
          </g>
        )}
      >
        {(s) => (
          <g aria-hidden="true">
            <line
              x1={s.x(a)}
              x2={s.x(a)}
              y1={s.box.inner.top}
              y2={s.box.inner.top + s.box.inner.height}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
            <line
              x1={s.x(b)}
              x2={s.x(b)}
              y1={s.box.inner.top}
              y2={s.box.inner.top + s.box.inner.height}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
