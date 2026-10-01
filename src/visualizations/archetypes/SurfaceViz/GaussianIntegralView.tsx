import { useState } from 'react';
import { erf } from '../../../lib/distributions/special.ts';
import type { Point2 } from '../../../lib/multivariable/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { EqualPlane } from '../../core/plane/EqualPlane.tsx';
import { num } from '../../core/plane/levels.ts';
import styles from './SurfaceViz.module.css';

const LIMIT = 2.6;
const PLANE: [Point2, Point2] = [
  [-LIMIT, LIMIT],
  [-LIMIT, LIMIT],
];
const HEAT_CELLS = 40;
/** The disk grows by this radius each step, so each step adds one ring. */
const RING = 0.1;
const STEPS = 26;
const STEPS_PER_SECOND = 3;
const SQRT_PI = Math.sqrt(Math.PI);

/**
 * The Gaussian integral by polar coordinates. The square of the integral of
 * e^(-x²) is a double integral of e^(-(x² + y²)) over the plane; in polar
 * coordinates a disk of radius R contributes π(1 - e^(-R²)). The disk grows
 * ring by ring and its value tends to π, while the square of the
 * one-dimensional integral over [-R, R] tends to the same limit.
 */
export function GaussianIntegralView({ title }: { title: string }) {
  const [step, setStep] = useState(1);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const radius = step * RING;
  const disk = Math.PI * (1 - Math.exp(-radius * radius));
  const line = SQRT_PI * erf(radius);
  const description =
    `Disco de radio ${num(radius, 1)}: la integral doble de e^(-(x² + y²)) vale π(1 - e^(-R²)) = ${num(disk, 4)}. ` +
    `La integral de e^(-x²) en [-R, R] vale ${num(line, 4)} y su cuadrado ${num(line * line, 4)}; ambos tienden a π = ${num(Math.PI, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Radio R', value: num(radius, 1) },
        { label: 'Integral sobre el disco', value: num(disk, 4), color: DATA_COLORS.secondary },
        { label: 'Integral en [-R, R]', value: num(line, 4), color: DATA_COLORS.highlight },
        { label: 'Su cuadrado', value: num(line * line, 4) },
        { label: 'π y √π', value: `${num(Math.PI, 4)} y ${num(SQRT_PI, 4)}` },
      ]}
      legend={[
        { label: 'Disco de radio R', color: DATA_COLORS.secondary },
        { label: 'Área bajo e^(-x²) en [-R, R]', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\iint_{x^2 + y^2 \\le R^2} e^{-(x^2 + y^2)}\\,dA = \\int_0^{2\\pi}\\!\\!\\int_0^{${num(radius, 1)}} e^{-r^2}\\,r\\,dr\\,d\\theta = \\pi\\big(1 - e^{-${num(radius * radius, 2)}}\\big) = ${num(disk, 4)}`}
        />
      </p>
      <p className={styles.formula}>
        <Latex
          tex={`\\left(\\int_{-${num(radius, 1)}}^{${num(radius, 1)}} e^{-x^2}\\,dx\\right)^2 = ${num(line, 4)}^2 = ${num(line * line, 4)} \\ \\to\\ \\pi,\\qquad \\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi} = ${num(SQRT_PI, 4)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>e^(-(x² + y²)) y el disco que crece</p>
          <EqualPlane
            domain={PLANE}
            label={description}
            background={({ left, top, width, height }) => {
              const cw = width / HEAT_CELLS;
              const ch = height / HEAT_CELLS;
              return (
                <g aria-hidden="true">
                  {Array.from({ length: HEAT_CELLS * HEAT_CELLS }, (_, k) => {
                    const i = k % HEAT_CELLS;
                    const j = Math.floor(k / HEAT_CELLS);
                    const px = -LIMIT + ((i + 0.5) * 2 * LIMIT) / HEAT_CELLS;
                    const py = -LIMIT + ((j + 0.5) * 2 * LIMIT) / HEAT_CELLS;
                    return (
                      <rect
                        key={k}
                        x={left + i * cw}
                        y={top + height - (j + 1) * ch}
                        width={cw + 0.5}
                        height={ch + 0.5}
                        fill={DATA_COLORS.primary}
                        fillOpacity={0.05 + 0.6 * Math.exp(-(px * px + py * py))}
                      />
                    );
                  })}
                </g>
              );
            }}
          >
            {({ x, y }) => (
              <g aria-hidden="true">
                <circle cx={x(0)} cy={y(0)} r={x(radius) - x(0)} fill={DATA_COLORS.secondary} fillOpacity={0.25} stroke={DATA_COLORS.secondary} strokeWidth={2} />
                {/* The ring added in the last step, of area about 2πr dr. */}
                <circle
                  cx={x(0)}
                  cy={y(0)}
                  r={x(radius - RING / 2) - x(0)}
                  fill="none"
                  stroke={DATA_COLORS.highlight}
                  strokeOpacity={0.8}
                  strokeWidth={x(RING) - x(0)}
                />
              </g>
            )}
          </EqualPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>La campana de una variable</p>
          <FunctionPlot
            xDomain={[-LIMIT, LIMIT]}
            yDomain={[0, 1.1]}
            label={`Área bajo e^(-x²). ${description}`}
            aspect={0.75}
            curves={[{ f: (t) => Math.exp(-t * t), color: DATA_COLORS.primary, width: 3 }]}
            background={(s) => {
              const samples = 60;
              const points = Array.from({ length: samples + 1 }, (_, i) => {
                const t = -radius + (2 * radius * i) / samples;
                return `${s.x(t)},${s.y(Math.exp(-t * t))}`;
              });
              return (
                <polygon
                  aria-hidden="true"
                  points={[`${s.x(-radius)},${s.y(0)}`, ...points, `${s.x(radius)},${s.y(0)}`].join(' ')}
                  fill={DATA_COLORS.highlight}
                  fillOpacity={0.4}
                />
              );
            }}
          />
        </div>
      </div>
    </VizFrame>
  );
}
