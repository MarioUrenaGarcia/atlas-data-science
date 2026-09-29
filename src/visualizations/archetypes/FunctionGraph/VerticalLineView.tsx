import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { CURVES, verticalHits, type CurveId } from './curves.ts';
import styles from './FunctionGraph.module.css';
import { planeScales, viewInterval } from './plane.ts';

const SWEEP_STEPS = 90;
const STEPS_PER_SECOND = 15;
const CURVE_SAMPLES = 400;

interface VerticalLineViewProps {
  title: string;
  curves: readonly CurveId[];
}

/**
 * Vertical line test: a curve in the plane is the graph of a function of x
 * exactly when no vertical line meets it more than once, because each input
 * x can have only one output. The line sweeps from left to right and every
 * intersection is marked.
 */
export function VerticalLineView({ title, curves }: VerticalLineViewProps) {
  const definitions = useMemo(
    () =>
      curves.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'curva',
              label: 'Curva',
              options: curves.map((id) => ({ value: id, label: CURVES[id].label })),
              default: curves[0] ?? 'parabola',
            },
          ]
        : [],
    [curves],
  );
  const parameters = useParameters(definitions);
  const id = (
    curves.length > 1 ? String((parameters.values as Record<string, string>).curva) : curves[0]
  ) as CurveId;
  const curve = CURVES[id];
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${id}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(SWEEP_STEPS, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP_STEPS,
  });
  const points = Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) =>
    curve.point(index / CURVE_SAMPLES),
  );
  const xs = points.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const c = minX + ((maxX - minX) * step) / SWEEP_STEPS;
  const hits = verticalHits(curve, c);
  const maxHits = Math.max(
    ...Array.from(
      { length: SWEEP_STEPS + 1 },
      (_, index) => verticalHits(curve, minX + ((maxX - minX) * index) / SWEEP_STEPS).length,
    ),
  );
  const description =
    `Curva ${curve.label}. La recta vertical x = ${formatNumber(c, 2)} la corta ${hits.length} ${hits.length === 1 ? 'vez' : 'veces'}. ` +
    (curve.isFunction
      ? 'Ninguna recta vertical la corta más de una vez: es la gráfica de una función de x.'
      : 'Algunas rectas verticales la cortan dos veces: no es la gráfica de una función de x.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        {
          label: `Cortes con x = ${formatNumber(c, 2)}`,
          value: String(hits.length),
          color: DATA_COLORS.highlight,
        },
        { label: 'Máximo de cortes', value: String(maxHits) },
        {
          label: '¿Es gráfica de una función?',
          value: curve.isFunction ? 'sí' : 'no',
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: 'Curva', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Recta vertical y sus cortes', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={curve.latex} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 14, right: 20, bottom: 30, left: 36 }}
      >
        {(box) => {
          const { x, y } = planeScales(
            box,
            viewInterval(xs),
            viewInterval(points.map((point) => point.y)),
            true,
          );
          const [low, high] = y.domain() as [number, number];
          return (
            <>
              <Axis scale={x} orientation="bottom" position={y(0)} ticks={8} />
              <Axis scale={y} orientation="left" position={x(0)} ticks={6} />
              <CurvePath
                points={points}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                width={3}
                animate={false}
              />
              <g aria-hidden="true">
                <line
                  x1={x(c)}
                  x2={x(c)}
                  y1={y(low)}
                  y2={y(high)}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {hits.map((value) => (
                  <circle
                    key={value}
                    cx={x(c)}
                    cy={y(value)}
                    r={6}
                    fill={hits.length > 1 ? DATA_COLORS.negative : DATA_COLORS.highlight}
                    stroke={DATA_COLORS.text}
                  />
                ))}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
