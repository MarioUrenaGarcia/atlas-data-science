import { useMemo, useState } from 'react';
import { CALC_FUNCTIONS } from '../../../lib/calculus/catalog.ts';
import { integrate } from '../../../lib/calculus/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { autoYDomain } from '../../core/svg/plotDomain.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const SWEEP_STEPS = 120;
const STEPS_PER_SECOND = 15;
const DOT_RADIUS = 5;
const GRID = 160;
const PANEL_ASPECT = 0.42;

interface AccumulationViewProps {
  title: string;
  id: string;
  from: number;
  to: number;
  scale: number;
  name: string;
}

/**
 * The fundamental theorem of calculus: the accumulated area F(x) under f from
 * a to x is drawn below as x advances. The slope of F at x equals the height
 * f(x), and the area between two points is the difference of F.
 */
export function AccumulationView({ title, id, from, to, scale, name }: AccumulationViewProps) {
  const fn = CALC_FUNCTIONS[id] ?? CALC_FUNCTIONS.coseno;
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(SWEEP_STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP_STEPS,
  });
  // Cumulative integral on a grid, so the lower panel is cheap to redraw.
  const table = useMemo(() => {
    if (!fn) return [];
    const points: { x: number; F: number }[] = [{ x: from, F: 0 }];
    for (let i = 1; i <= GRID; i += 1) {
      const x0 = from + ((to - from) * (i - 1)) / GRID;
      const x1 = from + ((to - from) * i) / GRID;
      points.push({
        x: x1,
        F: (points[i - 1]?.F ?? 0) + scale * integrate(fn.f, x0, x1, 1e-9, 12),
      });
    }
    return points;
  }, [fn, from, to, scale]);
  if (!fn) return null;
  const F = (x: number) => {
    const position = ((x - from) / (to - from)) * GRID;
    const i = Math.max(0, Math.min(GRID - 1, Math.floor(position)));
    const p0 = table[i];
    const p1 = table[i + 1];
    if (!p0 || !p1) return NaN;
    return p0.F + (p1.F - p0.F) * (position - i);
  };
  const x = from + ((to - from) * step) / SWEEP_STEPS;
  const height = scale * fn.f(x);
  const value = F(x);
  const Fdomain = autoYDomain([{ f: F, color: '' }], [from, to]);
  const description =
    `${name}(x) acumula el área bajo ${scale === 1 ? 'f' : `${formatNumber(scale, 3)} f`} desde ${formatNumber(from, 2)}. ` +
    `En x = ${formatNumber(x, 2)}: ${name}(x) = ${formatNumber(value, 4)} y su pendiente es ${formatNumber(height, 4)}, la altura de la función en ese punto.`;
  const scaleLatex = scale === 1 ? '' : `${formatNumber(scale, 4)}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'x', value: formatNumber(x, 3) },
        {
          label: `${name}(x), área acumulada`,
          value: formatNumber(value, 4),
          color: DATA_COLORS.secondary,
        },
        {
          label: `Pendiente de ${name} = altura de la función`,
          value: formatNumber(height, 4),
          color: DATA_COLORS.primary,
        },
      ]}
      legend={[
        { label: 'Función integrada', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Área acumulada', color: DATA_COLORS.primary },
        { label: `${name}(x)`, color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${name}(x) = ${scaleLatex}\\int_{${formatNumber(from, 2)}}^{x} ${fn.latex.replace(/x/g, 't')}\\,dt,\\qquad ${name}(${formatNumber(x, 2)}) = ${formatNumber(value, 4)},\\quad ${name}'(${formatNumber(x, 2)}) = ${formatNumber(height, 4)}`}
        />
      </p>
      <p className={styles.panelTitle}>
        La función y el área desde {formatNumber(from, 2)} hasta x
      </p>
      <FunctionPlot
        xDomain={[from, to]}
        yDomain={autoYDomain([{ f: (t) => scale * fn.f(t), color: '' }], [from, to])}
        label={description}
        aspect={PANEL_ASPECT}
        minHeight={190}
        xLabel="t"
        curves={[{ f: (t) => scale * fn.f(t), color: DATA_COLORS.primary, width: 3 }]}
        background={({ x: sx, y: sy }) => (
          <g aria-hidden="true">
            <polygon
              points={areaPoints((t) => scale * fn.f(t), from, x, sx, sy, 1)}
              fill={DATA_COLORS.primary}
              fillOpacity={0.3}
            />
            <polygon
              points={areaPoints((t) => scale * fn.f(t), from, x, sx, sy, -1)}
              fill={DATA_COLORS.quaternary}
              fillOpacity={0.3}
            />
          </g>
        )}
      >
        {(s) => (
          <line
            aria-hidden="true"
            x1={s.x(x)}
            x2={s.x(x)}
            y1={s.y(0)}
            y2={s.y(height)}
            stroke={DATA_COLORS.highlight}
            strokeWidth={3}
          />
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>{name}(x): el área acumulada</p>
      <FunctionPlot
        xDomain={[from, to]}
        yDomain={Fdomain}
        label={`Función acumulada. ${description}`}
        aspect={PANEL_ASPECT}
        minHeight={190}
        curves={[
          { f: F, color: DATA_COLORS.secondary, width: 1.5, dashed: true },
          { f: F, color: DATA_COLORS.secondary, width: 3, to: x },
          {
            f: (t) => value + height * (t - x),
            color: DATA_COLORS.highlight,
            width: 2,
            from: x - (to - from) / 8,
            to: x + (to - from) / 8,
          },
        ]}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(x)}
            cy={s.y(value)}
            r={DOT_RADIUS}
            fill={DATA_COLORS.secondary}
          />
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
