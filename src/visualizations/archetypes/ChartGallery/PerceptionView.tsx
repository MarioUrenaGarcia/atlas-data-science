import { interpolateRgb } from 'd3-interpolate';
import { type ReactNode, useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { perceivedRatio } from '../../../lib/stats/graphics.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './ChartGallery.module.css';

const ENCODINGS = [
  'Posición sobre una escala común',
  'Posición en escalas no alineadas',
  'Longitud',
  'Ángulo',
  'Área',
  'Intensidad del color',
] as const;
const COLUMNS = 2;
const PANELS_PER_SECOND = 0.8;
const MAX = 100;
/** Stevens's exponent for perceived area; length is perceived almost linearly. */
const AREA_EXPONENT = 0.7;
const SHADE = interpolateRgb('#e8eef6', '#08306b');

interface PerceptionViewProps {
  title: string;
  a: number;
  b: number;
}

/**
 * The same two numbers encoded in six ways, ordered from the most to the
 * least accurately judged according to Cleveland and McGill. Hiding the
 * values invites a guess of the ratio before revealing it.
 */
export function PerceptionView({ title, a: a0, b: b0 }: PerceptionViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'a',
        label: 'Valor A',
        min: 5,
        max: 100,
        step: 1,
        default: a0,
        digits: 0,
      },
      {
        type: 'number',
        key: 'b',
        label: 'Valor B',
        min: 5,
        max: 100,
        step: 1,
        default: b0,
        digits: 0,
      },
      { type: 'toggle', key: 'valores', label: 'Mostrar los valores', default: false },
    ],
    [a0, b0],
  );
  const parameters = useParameters(definitions);
  const a = Number(parameters.values.a);
  const b = Number(parameters.values.b);
  const showValues = Boolean(parameters.values.valores);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(String(run), () =>
    reducedMotion ? ENCODINGS.length : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(ENCODINGS.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: PANELS_PER_SECOND,
    done: shown >= ENCODINGS.length,
  });
  const small = Math.min(a, b);
  const large = Math.max(a, b);
  const ratio = small / large;
  const areaRatio = perceivedRatio(ratio, AREA_EXPONENT);
  const header = showValues
    ? `\\frac{\\min(A, B)}{\\max(A, B)} = \\frac{${small}}{${large}} = ${formatNumber(ratio, 3)}\\qquad \\text{en área se percibe } ${formatNumber(ratio, 3)}^{0.7} = ${formatNumber(areaRatio, 3)}`
    : `\\text{¿Qué fracción del mayor es el menor?}`;
  const description =
    `Dos valores, A y B, codificados de ${shown} formas: ${ENCODINGS.slice(0, shown).join(', ').toLowerCase()}. ` +
    (showValues
      ? `A vale ${a} y B vale ${b}; el menor es ${formatNumber(100 * ratio, 1)} % del mayor.`
      : 'Los valores están ocultos.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={
        showValues
          ? [
              { label: 'A', value: String(a) },
              { label: 'B', value: String(b) },
              { label: 'Menor entre mayor', value: formatNumber(ratio, 3) },
              {
                label: 'Cociente percibido en área (β = 0.7)',
                value: formatNumber(areaRatio, 3),
                color: DATA_COLORS.secondary,
              },
            ]
          : [{ label: 'Codificaciones mostradas', value: `${shown} de ${ENCODINGS.length}` }]
      }
      legend={[
        { label: 'A', color: DATA_COLORS.primary },
        { label: 'B', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.95}
        minHeight={480}
        maxHeight={680}
        margins={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        {(box) => {
          const rows = Math.ceil(ENCODINGS.length / COLUMNS);
          const cw = box.inner.width / COLUMNS;
          const ch = box.inner.height / rows;
          const pad = 14;
          return (
            <g>
              {ENCODINGS.slice(0, shown).map((name, k) => {
                const left = box.inner.left + (k % COLUMNS) * cw + pad;
                const top = box.inner.top + Math.floor(k / COLUMNS) * ch + 22;
                const w = cw - 2 * pad;
                const h = ch - 22 - pad - 16;
                const bottom = top + h;
                const unit = (v: number) => (h * v) / MAX;
                let body: ReactNode;
                if (k === 0) {
                  body = (
                    <>
                      <line
                        x1={left + 6}
                        x2={left + 6}
                        y1={top}
                        y2={bottom}
                        stroke={DATA_COLORS.muted}
                      />
                      <circle
                        cx={left + w * 0.35}
                        cy={bottom - unit(a)}
                        r={6}
                        fill={DATA_COLORS.primary}
                      />
                      <circle
                        cx={left + w * 0.7}
                        cy={bottom - unit(b)}
                        r={6}
                        fill={DATA_COLORS.secondary}
                      />
                    </>
                  );
                } else if (k === 1) {
                  const offB = h * 0.25;
                  body = (
                    <>
                      <line
                        x1={left + w * 0.2}
                        x2={left + w * 0.2}
                        y1={top}
                        y2={bottom}
                        stroke={DATA_COLORS.muted}
                      />
                      <circle
                        cx={left + w * 0.35}
                        cy={bottom - unit(a) * 0.75}
                        r={6}
                        fill={DATA_COLORS.primary}
                      />
                      <line
                        x1={left + w * 0.55}
                        x2={left + w * 0.55}
                        y1={top - offB * 0.5}
                        y2={bottom - offB}
                        stroke={DATA_COLORS.muted}
                      />
                      <circle
                        cx={left + w * 0.7}
                        cy={bottom - offB - unit(b) * 0.75}
                        r={6}
                        fill={DATA_COLORS.secondary}
                      />
                    </>
                  );
                } else if (k === 2) {
                  const len = (v: number) => (w * 0.7 * v) / MAX;
                  body = (
                    <>
                      <rect
                        x={left + w * 0.05}
                        y={top + h * 0.3}
                        width={len(a)}
                        height={12}
                        fill={DATA_COLORS.primary}
                      />
                      <rect
                        x={left + w * 0.25}
                        y={top + h * 0.65}
                        width={len(b)}
                        height={12}
                        fill={DATA_COLORS.secondary}
                      />
                    </>
                  );
                } else if (k === 3) {
                  const r = Math.min(w * 0.22, h * 0.45);
                  const wedge = (cx: number, cy: number, v: number) => {
                    const angle = (Math.PI * v) / MAX;
                    return `M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(angle)} ${cy - r * Math.sin(angle)} Z`;
                  };
                  body = (
                    <>
                      <path
                        d={wedge(left + w * 0.25 - r / 2, bottom - h * 0.2, a)}
                        fill={DATA_COLORS.primary}
                      />
                      <path
                        d={wedge(left + w * 0.72 - r / 2, bottom - h * 0.2, b)}
                        fill={DATA_COLORS.secondary}
                      />
                    </>
                  );
                } else if (k === 4) {
                  const R = Math.min(w * 0.24, h * 0.48);
                  body = (
                    <>
                      <circle
                        cx={left + w * 0.27}
                        cy={top + h / 2}
                        r={R * Math.sqrt(a / MAX)}
                        fill={DATA_COLORS.primary}
                      />
                      <circle
                        cx={left + w * 0.73}
                        cy={top + h / 2}
                        r={R * Math.sqrt(b / MAX)}
                        fill={DATA_COLORS.secondary}
                      />
                    </>
                  );
                } else {
                  const side = Math.min(w * 0.35, h * 0.8);
                  body = (
                    <>
                      <rect
                        x={left + w * 0.27 - side / 2}
                        y={top + (h - side) / 2}
                        width={side}
                        height={side}
                        fill={SHADE(a / MAX)}
                        stroke={DATA_COLORS.primary}
                        strokeWidth={2}
                      />
                      <rect
                        x={left + w * 0.73 - side / 2}
                        y={top + (h - side) / 2}
                        width={side}
                        height={side}
                        fill={SHADE(b / MAX)}
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={2}
                      />
                    </>
                  );
                }
                return (
                  <g key={name}>
                    <text x={left} y={top - 8} className={styles.chartLabel}>
                      {k + 1}. {name}
                    </text>
                    <g aria-hidden="true">{body}</g>
                    <text
                      x={left + w * 0.3}
                      y={bottom + 14}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      A{showValues ? ` = ${a}` : ''}
                    </text>
                    <text
                      x={left + w * 0.72}
                      y={bottom + 14}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      B{showValues ? ` = ${b}` : ''}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
