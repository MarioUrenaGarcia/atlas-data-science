import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataStrip.module.css';

const STAGES = 5;
const STAGES_PER_SECOND = 0.5;
const MARGIN = 28;
const SEGMENT_WIDTH = 4;
const DOT = 4;
const MAX_VALUE = 20;

const COLORS = {
  aritmetica: DATA_COLORS.primary,
  geometrica: DATA_COLORS.tertiary,
  armonica: DATA_COLORS.quaternary,
  cuadratica: DATA_COLORS.olive,
} as const;

/**
 * The classical construction of the four means of two positive numbers a and
 * b on a semicircle of diameter a + b. Each mean is a segment, and the order
 * of their lengths is the inequality between means.
 */
export function SemicircleView({
  title,
  a: a0,
  b: b0,
  variable,
}: {
  title: string;
  a: number;
  b: number;
  variable?: string;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'a',
      label: 'Primer valor',
      symbol: 'a',
      min: 0.5,
      max: MAX_VALUE,
      step: 0.5,
      default: a0,
      digits: 1,
    },
    {
      type: 'number',
      key: 'b',
      label: 'Segundo valor',
      symbol: 'b',
      min: 0.5,
      max: MAX_VALUE,
      step: 0.5,
      default: b0,
      digits: 1,
    },
  ];
  const parameters = useParameters(definitions);
  const a = Number(parameters.values.a);
  const b = Number(parameters.values.b);
  const [stage, setStage] = useState(0);
  const playback = usePlayback({
    step: () => setStage((value) => Math.min(STAGES - 1, value + 1)),
    reset: () => setStage(0),
    rate: STAGES_PER_SECOND,
    done: stage >= STAGES - 1,
  });
  const am = (a + b) / 2;
  const gm = Math.sqrt(a * b);
  const hm = (2 * a * b) / (a + b);
  const qm = Math.sqrt((a * a + b * b) / 2);
  const f = (value: number) => formatNumber(value, 3);
  const headers = [
    `A = \\frac{a + b}{2} = \\frac{${f(a)} + ${f(b)}}{2} = ${f(am)}\\quad(\\text{radio})`,
    `G = \\sqrt{a\\,b} = \\sqrt{${f(a)} \\cdot ${f(b)}} = ${f(gm)}\\quad(\\text{altura sobre el corte})`,
    `H = \\frac{2ab}{a + b} = \\frac{G^2}{A} = \\frac{${f(gm * gm)}}{${f(am)}} = ${f(hm)}`,
    `Q = \\sqrt{\\frac{a^2 + b^2}{2}} = \\sqrt{\\frac{${f(a * a)} + ${f(b * b)}}{2}} = ${f(qm)}`,
    `H = ${f(hm)} \\le G = ${f(gm)} \\le A = ${f(am)} \\le Q = ${f(qm)}`,
  ];
  const description =
    `Con a = ${f(a)} y b = ${f(b)}: media armónica ${f(hm)}, geométrica ${f(gm)}, aritmética ${f(am)} y cuadrática ${f(qm)}.` +
    (a === b ? ' Como a = b, las cuatro medias coinciden.' : '');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Media armónica H', value: f(hm), color: COLORS.armonica },
        { label: 'Media geométrica G', value: f(gm), color: COLORS.geometrica },
        { label: 'Media aritmética A', value: f(am), color: COLORS.aritmetica },
        { label: 'Media cuadrática Q', value: f(qm), color: COLORS.cuadratica },
        { label: 'Diferencia A - G', value: f(am - gm) },
      ]}
      legend={[
        { label: 'Aritmética (radio)', color: COLORS.aritmetica, shape: 'line' },
        { label: 'Geométrica', color: COLORS.geometrica, shape: 'line' },
        { label: 'Armónica', color: COLORS.armonica, shape: 'line' },
        { label: 'Cuadrática', color: COLORS.cuadratica, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={headers[stage] ?? ''} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.55}
        minHeight={240}
        maxHeight={420}
        margins={{ top: MARGIN, right: MARGIN, bottom: MARGIN + 10, left: MARGIN }}
      >
        {(box) => {
          const scale = Math.min(box.inner.width / (a + b), box.inner.height / am);
          const left = box.inner.left + (box.inner.width - (a + b) * scale) / 2;
          const base = box.inner.top + box.inner.height;
          const px = (u: number) => left + u * scale;
          const py = (v: number) => base - v * scale;
          const o = am;
          const c = a;

          // E is the foot of the perpendicular from C to the radius OD, so DE = G^2 / A = H.
          const t = hm / am;
          const ex = c + (o - c) * t;
          const ey = gm - gm * t;
          const segment = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            color: string,
            show: boolean,
          ) =>
            show ? (
              <line
                x1={px(x1)}
                y1={py(y1)}
                x2={px(x2)}
                y2={py(y2)}
                stroke={color}
                strokeWidth={SEGMENT_WIDTH}
                strokeLinecap="round"
              />
            ) : null;
          return (
            <g>
              <path
                d={`M ${px(0)} ${py(0)} A ${am * scale} ${am * scale} 0 0 1 ${px(a + b)} ${py(0)}`}
                fill="none"
                stroke={DATA_COLORS.muted}
                strokeWidth={1.5}
              />
              <line
                x1={px(0)}
                x2={px(a + b)}
                y1={py(0)}
                y2={py(0)}
                stroke={DATA_COLORS.text}
                strokeWidth={2}
              />
              {stage >= 2 && (
                <line
                  x1={px(o)}
                  y1={py(0)}
                  x2={px(c)}
                  y2={py(gm)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 3"
                />
              )}
              {stage >= 2 && (
                <line
                  x1={px(c)}
                  y1={py(0)}
                  x2={px(ex)}
                  y2={py(ey)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="4 3"
                />
              )}
              {segment(o, 0, o, am, COLORS.aritmetica, stage >= 0)}
              {segment(c, 0, c, gm, COLORS.geometrica, stage >= 1)}
              {segment(c, gm, ex, ey, COLORS.armonica, stage >= 2)}
              {segment(c, 0, o, am, COLORS.cuadratica, stage >= 3)}
              {[0, c, o, a + b].map((u, index) => (
                <circle key={index} cx={px(u)} cy={py(0)} r={DOT} fill={DATA_COLORS.text} />
              ))}
              <text
                x={px(c / 2)}
                y={py(0) + 18}
                textAnchor="middle"
                className={styles.pointLabel}
              >{`a = ${f(a)}`}</text>
              <text
                x={px(c + b / 2)}
                y={py(0) + 18}
                textAnchor="middle"
                className={styles.pointLabel}
              >{`b = ${f(b)}`}</text>
              {variable && (
                <text x={box.inner.left} y={box.inner.top - 10} className={styles.pointLabel}>
                  {variable}
                </text>
              )}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
