import { useMemo, useState } from 'react';
import { gammaFunction } from '../../../lib/distributions/special.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';
import { areaPoints } from './shading.ts';

const T_MAX = 12;
const X_RANGE: [number, number] = [0.3, 5];
const SWEEP_STEPS = 94;
const STEPS_PER_SECOND = 10;
const DOT_RADIUS = 5;
const PANEL_ASPECT = 0.42;
const FACTORIALS = [1, 2, 3, 4, 5];

interface GammaViewProps {
  title: string;
  x: number;
}

/**
 * The gamma function as an area: for each x, Γ(x) is the area under
 * t^(x - 1) e^(-t). Below, the values trace the curve Γ, which passes
 * through the factorials, Γ(n + 1) = n!, and fills in between them.
 */
export function GammaView({ title, x: initial }: GammaViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Argumento',
        symbol: 'x',
        min: X_RANGE[0],
        max: X_RANGE[1],
        step: 0.05,
        default: initial,
        digits: 2,
      },
    ],
    [initial],
  );
  const parameters = useParameters(definitions);
  const slider = Number((parameters.values as Record<string, number>).x);
  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => ((value ?? 0) + 1) % (SWEEP_STEPS + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
  });
  const x =
    sweep === null ? slider : X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * sweep) / SWEEP_STEPS;
  const integrand = (t: number) =>
    t <= 0 ? (x < 1 ? NaN : x === 1 ? 1 : 0) : t ** (x - 1) * Math.exp(-t);
  const value = gammaFunction(x);
  const nearInteger = Math.abs(x - Math.round(x)) < 0.026 && Math.round(x) >= 1;
  const description =
    `Γ(${formatNumber(x, 2)}) = ${formatNumber(value, 4)}, el área bajo t^(x - 1) e^(-t).` +
    (nearInteger
      ? ` Como x es casi entero, Γ(${Math.round(x)}) = ${Math.round(x) - 1}! = ${formatNumber(gammaFunction(Math.round(x)), 0)}.`
      : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'x', value: formatNumber(x, 2) },
        {
          label: 'Γ(x), área bajo el integrando',
          value: formatNumber(value, 4),
          color: DATA_COLORS.primary,
        },
        { label: 'x Γ(x) = Γ(x + 1)', value: formatNumber(x * value, 4) },
      ]}
      legend={[
        { label: 'Integrando y su área', color: DATA_COLORS.primary },
        { label: 'Curva Γ(x)', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Factoriales Γ(n + 1) = n!', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\Gamma(${formatNumber(x, 2)}) = \\int_0^{\\infty} t^{${formatNumber(x - 1, 2)}} e^{-t}\\,dt = ${formatNumber(value, 4)}${nearInteger ? ` = ${Math.round(x) - 1}!` : ''}`}
        />
      </p>
      <p className={styles.panelTitle}>Integrando t^(x - 1) e^(-t) y su área</p>
      <FunctionPlot
        xDomain={[0, T_MAX]}
        yDomain={[0, Math.max(0.2, Math.min(3, integrand(Math.max(0.05, x - 1)) * 1.25))]}
        label={description}
        aspect={PANEL_ASPECT}
        minHeight={180}
        xLabel="t"
        curves={[{ f: integrand, color: DATA_COLORS.primary, width: 3, from: 0.001 }]}
        background={({ x: sx, y: sy }) => (
          <polygon
            aria-hidden="true"
            points={areaPoints((t) => Math.min(integrand(t), 50), 0.001, T_MAX, sx, sy, 1)}
            fill={DATA_COLORS.primary}
            fillOpacity={0.3}
          />
        )}
      />
      <p className={styles.panelTitle}>La función Γ(x)</p>
      <FunctionPlot
        xDomain={[0.2, 5.2]}
        yDomain={[0, 26]}
        label={`Curva de la función gamma. ${description}`}
        aspect={PANEL_ASPECT}
        minHeight={180}
        curves={[{ f: gammaFunction, color: DATA_COLORS.secondary, width: 3 }]}
      >
        {(s) => (
          <g aria-hidden="true">
            {FACTORIALS.map((n) => (
              <circle
                key={n}
                cx={s.x(n)}
                cy={s.y(gammaFunction(n))}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
              />
            ))}
            <circle
              cx={s.x(x)}
              cy={s.y(value)}
              r={DOT_RADIUS + 1}
              fill="var(--color-surface)"
              stroke={DATA_COLORS.secondary}
              strokeWidth={3}
            />
          </g>
        )}
      </FunctionPlot>
    </VizFrame>
  );
}
