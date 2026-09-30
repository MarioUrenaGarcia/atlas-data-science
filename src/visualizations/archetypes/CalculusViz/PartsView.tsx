import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { PARTS_CASES } from '../../../lib/calculus/cases.ts';
import { integrate } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const STEPS = 60;
const STEPS_PER_SECOND = 15;
const SAMPLES = 120;
const MARGIN = 1.12;

interface PartsViewProps {
  title: string;
  cases: readonly string[];
}

/**
 * Integration by parts as a picture in the (u, v) plane. The curve traced by
 * (u(x), v(x)) splits the rectangle up to (u, v) into the area under it, the
 * integral of v du, and the area to its left, the integral of u dv. Together
 * they make the change of uv, so knowing one gives the other.
 */
export function PartsView({ title, cases }: PartsViewProps) {
  const definitions = useMemo(
    () =>
      cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Integral',
              options: cases.map((id) => ({ value: id, label: id.replace(/-/g, ' ') })),
              default: cases[0] ?? 'x-exponencial',
            },
          ]
        : [],
    [cases],
  );
  const parameters = useParameters(definitions);
  const id =
    cases.length > 1
      ? String((parameters.values as Record<string, string>).caso)
      : (cases[0] ?? 'x-exponencial');
  const c = PARTS_CASES[id] ?? PARTS_CASES['x-exponencial'];
  const [step, setStep] = useState(STEPS);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  if (!c) return null;
  const t = c.a + ((c.b - c.a) * step) / STEPS;
  const udv = integrate((s) => c.u(s) * c.dv(s), c.a, t);
  const vdu = integrate((s) => c.v(s) * c.du(s), c.a, t);
  const change = c.u(t) * c.v(t) - c.u(c.a) * c.v(c.a);
  const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const s = c.a + ((t - c.a) * i) / SAMPLES;
    return [c.u(s), c.v(s)] as const;
  });
  const full = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const s = c.a + ((c.b - c.a) * i) / SAMPLES;
    return [c.u(s), c.v(s)] as const;
  });
  const uMax = Math.max(...full.map(([u]) => u), 0) * MARGIN;
  const vMax = Math.max(...full.map(([, v]) => v), 0) * MARGIN;
  const description =
    `Hasta x = ${formatNumber(t, 3)}: integral de u dv = ${formatNumber(udv, 4)}, integral de v du = ${formatNumber(vdu, 4)}, ` +
    `y su suma es el cambio de uv, ${formatNumber(change, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'x', value: formatNumber(t, 3) },
        {
          label: '∫ u dv (área a la izquierda de la curva)',
          value: formatNumber(udv, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: '∫ v du (área bajo la curva)',
          value: formatNumber(vdu, 4),
          color: DATA_COLORS.secondary,
        },
        { label: 'Cambio de u v', value: formatNumber(change, 4) },
      ]}
      legend={[
        { label: '∫ u dv', color: DATA_COLORS.primary },
        { label: '∫ v du', color: DATA_COLORS.secondary },
        { label: 'Curva (u(x), v(x))', color: DATA_COLORS.text, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${c.integralLatex},\\quad ${c.choiceLatex},\\qquad \\int u\\,dv = uv\\Big| - \\int v\\,du:\\ ${formatNumber(udv, 4)} = ${formatNumber(change, 4)} - ${formatNumber(vdu, 4)}`}
        />
      </p>
      <ChartSvg
        label={description}
        aspect={0.7}
        minHeight={260}
        maxHeight={420}
        margins={{ left: 46, bottom: 38 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([0, uMax || 1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, vMax || 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const path = curve.map(([u, v]) => `${x(u)},${y(v)}`).join(' ');
          const [uStart, vStart] = curve[0] ?? [0, 0];
          const [uEnd, vEnd] = curve[curve.length - 1] ?? [0, 0];
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="v"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="u"
              />
              <g aria-hidden="true">
                <polygon
                  points={`${x(0)},${y(vStart)} ${path} ${x(0)},${y(vEnd)}`}
                  fill={DATA_COLORS.primary}
                  fillOpacity={0.35}
                />
                <polygon
                  points={`${x(uStart)},${y(0)} ${path} ${x(uEnd)},${y(0)}`}
                  fill={DATA_COLORS.secondary}
                  fillOpacity={0.35}
                />
                <polyline
                  points={full.map(([u, v]) => `${x(u)},${y(v)}`).join(' ')}
                  fill="none"
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 4"
                />
                <polyline points={path} fill="none" stroke={DATA_COLORS.text} strokeWidth={2.5} />
                <rect
                  x={x(0)}
                  y={y(vEnd)}
                  width={x(uEnd) - x(0)}
                  height={y(0) - y(vEnd)}
                  fill="none"
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
