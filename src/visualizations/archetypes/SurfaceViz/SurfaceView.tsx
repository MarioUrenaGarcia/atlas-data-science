import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { ContourMap } from './ContourMap.tsx';
import { fieldRange } from './levels.ts';
import { SurfacePanel } from './SurfacePanel.tsx';
import styles from './SurfaceViz.module.css';
import { fieldName, useFieldChoice } from './useFieldChoice.ts';

const DOT_RADIUS = 6;
const START: [number, number] = [0.8, 0.6];
const LEVEL_STEPS = 60;
const STEPS_PER_SECOND = 12;

interface SurfaceViewProps {
  title: string;
  ids: readonly string[];
  /** Emphasize level curves: a horizontal plane sweeps the heights and cuts the surface. */
  levels: boolean;
}

/**
 * A function of two variables seen two ways: as a surface z = f(x, y) in
 * space and as a map of level curves seen from above. A point moves on both
 * at once; with the level mode, a horizontal plane z = c sweeps upward and
 * the curve it cuts is highlighted on the map.
 */
export function SurfaceView({ title, ids, levels }: SurfaceViewProps) {
  const { parameters, values, field, point } = useFieldChoice(ids, START);
  const range = useMemo(() => fieldRange(field.f, field.domain), [field]);
  const [step, setStep] = useState(LEVEL_STEPS / 2);
  const playback = usePlayback({
    step: () => setStep((value) => (value + 1) % (LEVEL_STEPS + 1)),
    reset: () => setStep(LEVEL_STEPS / 2),
    rate: STEPS_PER_SECOND,
  });
  const [x, y] = point;
  const value = field.f(x, y);
  const level = levels ? range.min + ((range.max - range.min) * step) / LEVEL_STEPS : value;
  const description =
    `f(x, y) = ${fieldName(field.id)}. En (${formatNumber(x, 2)}, ${formatNumber(y, 2)}) vale ${formatNumber(value, 3)}.` +
    (levels
      ? ` Curva de nivel resaltada: f(x, y) = ${formatNumber(level, 3)}.`
      : ' La curva resaltada del mapa pasa por el punto: todos sus puntos tienen el mismo valor.');

  return (
    <VizFrame
      title={title}
      playback={levels ? playback : undefined}
      parameters={{ ...parameters, values: values as Record<string, unknown> }}
      readouts={[
        {
          label: 'Punto (x₀, y₀)',
          value: `(${formatNumber(x, 2)}, ${formatNumber(y, 2)})`,
          color: DATA_COLORS.highlight,
        },
        { label: 'f(x₀, y₀)', value: formatNumber(value, 4) },
        {
          label: levels ? 'Nivel c del plano' : 'Nivel de la curva resaltada',
          value: formatNumber(level, 4),
        },
        {
          label: 'Rango mostrado',
          value: `${formatNumber(range.min, 2)} a ${formatNumber(range.max, 2)}`,
        },
      ]}
      legend={[
        { label: 'Más alto = color más intenso', color: DATA_COLORS.primary },
        {
          label: levels ? 'Curva f = c' : 'Curva de nivel del punto',
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`f(x, y) = ${field.latex},\\qquad ${levels ? `\\{(x, y) : f(x, y) = ${formatNumber(level, 3)}\\}` : `f(${formatNumber(x, 2)}, ${formatNumber(y, 2)}) = ${formatNumber(value, 3)}`}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Superficie z = f(x, y)</p>
          <SurfacePanel
            f={field.f}
            domain={field.domain}
            range={range}
            label={`Superficie. ${description}`}
          >
            {({ screen, at }) => {
              const p = screen.at(at(x, y, value));
              const [[x0, x1], [y0, y1]] = field.domain;
              const plane = [
                at(x0, y0, level),
                at(x1, y0, level),
                at(x1, y1, level),
                at(x0, y1, level),
              ].map((v) => screen.at(v));
              return (
                <g aria-hidden="true">
                  {levels && (
                    <polygon
                      points={plane.map((c) => `${c.x},${c.y}`).join(' ')}
                      fill={DATA_COLORS.highlight}
                      fillOpacity={0.22}
                      stroke={DATA_COLORS.highlight}
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={DOT_RADIUS}
                    fill={DATA_COLORS.highlight}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                </g>
              );
            }}
          </SurfacePanel>
        </div>
        <div>
          <p className={styles.panelTitle}>Curvas de nivel vistas desde arriba</p>
          <ContourMap
            f={field.f}
            domain={field.domain}
            range={range}
            highlight={level}
            label={`Mapa de curvas de nivel. ${description}`}
          >
            {(s) => (
              <circle
                aria-hidden="true"
                cx={s.x(x)}
                cy={s.y(y)}
                r={DOT_RADIUS}
                fill={DATA_COLORS.highlight}
                stroke="var(--color-surface)"
                strokeWidth={2}
              />
            )}
          </ContourMap>
        </div>
      </div>
    </VizFrame>
  );
}
