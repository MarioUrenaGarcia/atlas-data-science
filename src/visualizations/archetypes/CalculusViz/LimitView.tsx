import { useMemo, useState } from 'react';
import { LIMIT_CASES, type LimitCase } from '../../../lib/calculus/cases.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './CalculusViz.module.css';

const STEPS = 14;
const SHRINK = 0.62;
const STEPS_PER_SECOND = 1.5;
const DOT_RADIUS = 6;
const DELTA_CANDIDATES = 60;
const DELTA_SAMPLES = 40;

const CASE_NAMES: Record<string, string> = {
  continua: 'Continua',
  removible: 'Hueco (discontinuidad evitable)',
  'removible-redefinida': 'Punto fuera de lugar (evitable)',
  salto: 'Salto',
  infinito: 'Asíntota vertical',
  'infinito-signos': 'Asíntota con signos opuestos',
  oscilante: 'Oscilación sin límite',
  'seno-sobre-x': 'sen x / x',
  'valor-absoluto': '|x| / x',
};

const limitText = (value: number) =>
  Number.isNaN(value)
    ? 'no existe'
    : value === Infinity
      ? '+∞'
      : value === -Infinity
        ? '-∞'
        : formatNumber(value, 3);

function classify(c: LimitCase): string {
  const sameSides = c.left === c.right;
  if (Number.isNaN(c.left) || Number.isNaN(c.right))
    return 'esencial: la función oscila y no tiene límite';
  if (!Number.isFinite(c.left) || !Number.isFinite(c.right)) return 'infinita: asíntota vertical';
  if (!sameSides) return 'de salto: los límites laterales son distintos';
  if (Number.isNaN(c.value) || c.value !== c.left)
    return 'evitable: el límite existe pero no coincide con f(a)';
  return 'ninguna: la función es continua en a';
}

/** Largest δ from a shrinking list such that every sampled x with 0 < |x - a| < δ lands within ε of L. */
function findDelta(c: LimitCase, epsilon: number): number | null {
  const L = c.left;
  const width = (c.domain[1] - c.domain[0]) / 2;
  for (let i = 0; i < DELTA_CANDIDATES; i += 1) {
    const delta = width * SHRINK ** i;
    let ok = true;
    for (let j = 1; j <= DELTA_SAMPLES && ok; j += 1) {
      const offset = (delta * j) / DELTA_SAMPLES;
      ok =
        Math.abs(c.f(c.point - offset) - L) < epsilon &&
        Math.abs(c.f(c.point + offset) - L) < epsilon;
    }
    if (ok) return delta;
  }
  return null;
}

interface LimitViewProps {
  title: string;
  cases: readonly string[];
  epsilon: boolean;
}

/**
 * Points approach a from both sides and the values f(a - h), f(a + h) are
 * recorded. The limit exists when both sides settle on the same number; the
 * value f(a) itself plays no role. Optionally, an ε band around the limit
 * shows the δ that keeps every nearby value inside it.
 */
export function LimitView({ title, cases, epsilon }: LimitViewProps) {
  const definitions = useMemo(
    () => [
      ...(cases.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'caso',
              label: 'Función',
              options: cases.map((id) => ({ value: id, label: CASE_NAMES[id] ?? id })),
              default: cases[0] ?? 'continua',
            },
          ]
        : []),
      ...(epsilon
        ? [
            {
              type: 'number' as const,
              key: 'epsilon',
              label: 'Tolerancia',
              symbol: 'ε',
              min: 0.02,
              max: 1,
              step: 0.02,
              default: 0.3,
              digits: 2,
            },
          ]
        : []),
    ],
    [cases, epsilon],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const c =
    LIMIT_CASES[cases.length > 1 ? String(values.caso) : (cases[0] ?? 'continua')] ??
    LIMIT_CASES.continua;
  const eps = Number(values.epsilon ?? 0.3);
  const [step, setStep] = useState(0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(STEPS, value + 1)),
    reset: () => setStep(0),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  if (!c) return null;
  const hBase = (c.domain[1] - c.domain[0]) / 4;
  const h = hBase * SHRINK ** step;
  const left = c.f(c.point - h);
  const right = c.f(c.point + h);
  const limitExists = c.left === c.right && Number.isFinite(c.left);
  const continuous = limitExists && c.value === c.left;
  const delta = epsilon && limitExists ? findDelta(c, eps) : null;
  const description =
    `Con h = ${formatNumber(h, 4)}: f(a - h) = ${formatNumber(left, 4)} y f(a + h) = ${formatNumber(right, 4)}. ` +
    `Límite por la izquierda ${limitText(c.left)}, por la derecha ${limitText(c.right)}, f(a) ${Number.isNaN(c.value) ? 'no está definido' : `= ${formatNumber(c.value, 3)}`}. Discontinuidad ${classify(c)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'h', value: formatNumber(h, 4) },
        { label: 'f(a - h)', value: formatNumber(left, 4), color: DATA_COLORS.secondary },
        { label: 'f(a + h)', value: formatNumber(right, 4), color: DATA_COLORS.tertiary },
        { label: 'Límite por la izquierda', value: limitText(c.left) },
        { label: 'Límite por la derecha', value: limitText(c.right) },
        { label: 'f(a)', value: Number.isNaN(c.value) ? 'no definido' : formatNumber(c.value, 3) },
        { label: '¿Continua en a?', value: continuous ? 'sí' : 'no' },
        ...(epsilon
          ? [
              {
                label: 'δ que funciona para ε',
                value: delta === null ? 'ninguno' : formatNumber(delta, 4),
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Acercamiento por la izquierda', color: DATA_COLORS.secondary, shape: 'circle' },
        { label: 'Acercamiento por la derecha', color: DATA_COLORS.tertiary, shape: 'circle' },
        ...(epsilon
          ? [{ label: 'Banda L ± ε y ventana a ± δ', color: DATA_COLORS.highlight }]
          : []),
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${c.latex},\\quad a = ${formatNumber(c.point, 2)},\\quad h = ${formatNumber(h, 4)}:\\ \\ f(a - h) = ${formatNumber(left, 4)},\\ \\ f(a + h) = ${formatNumber(right, 4)}`}
        />
      </p>
      <p className={styles.stage}>Discontinuidad {classify(c)}.</p>
      <FunctionPlot
        xDomain={c.domain}
        label={description}
        curves={[{ f: c.f, color: DATA_COLORS.primary, width: 2.5, breaks: [c.point] }]}
        background={({ x, y, box }) =>
          epsilon && limitExists ? (
            <g aria-hidden="true">
              <rect
                x={box.inner.left}
                y={y(c.left + eps)}
                width={box.inner.width}
                height={Math.abs(y(c.left - eps) - y(c.left + eps))}
                fill={DATA_COLORS.highlight}
                fillOpacity={0.15}
              />
              {delta !== null && (
                <rect
                  x={x(c.point - delta)}
                  y={box.inner.top}
                  width={x(c.point + delta) - x(c.point - delta)}
                  height={box.inner.height}
                  fill={DATA_COLORS.highlight}
                  fillOpacity={0.15}
                />
              )}
            </g>
          ) : null
        }
      >
        {({ x, y, box }) => {
          const clampY = (value: number) =>
            Math.max(box.inner.top - 20, Math.min(box.inner.top + box.inner.height + 20, y(value)));
          return (
            <g aria-hidden="true">
              <line
                x1={x(c.point)}
                x2={x(c.point)}
                y1={box.inner.top}
                y2={box.inner.top + box.inner.height}
                stroke={DATA_COLORS.muted}
                strokeDasharray="4 4"
              />
              {Number.isFinite(c.left) && (
                <circle
                  cx={x(c.point)}
                  cy={y(c.left)}
                  r={DOT_RADIUS}
                  fill="var(--color-surface)"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                />
              )}
              {Number.isFinite(c.right) && c.right !== c.left && (
                <circle
                  cx={x(c.point)}
                  cy={y(c.right)}
                  r={DOT_RADIUS}
                  fill="var(--color-surface)"
                  stroke={DATA_COLORS.primary}
                  strokeWidth={2}
                />
              )}
              {!Number.isNaN(c.value) && (
                <circle cx={x(c.point)} cy={y(c.value)} r={DOT_RADIUS} fill={DATA_COLORS.primary} />
              )}
              {Number.isFinite(left) && (
                <circle
                  cx={x(c.point - h)}
                  cy={clampY(left)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.secondary}
                />
              )}
              {Number.isFinite(right) && (
                <circle
                  cx={x(c.point + h)}
                  cy={clampY(right)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.tertiary}
                />
              )}
            </g>
          );
        }}
      </FunctionPlot>
    </VizFrame>
  );
}
