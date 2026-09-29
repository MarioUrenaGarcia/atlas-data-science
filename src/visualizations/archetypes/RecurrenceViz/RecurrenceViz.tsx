import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import {
  characteristicRoots,
  linearRecurrence,
  modulus,
  secondOrderClosedForm,
} from '../../../lib/combinatorics/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './RecurrenceViz.module.css';
import type { RecurrenceVizConfig } from './schema.ts';

const TERMS_PER_SECOND = 3;
const ROOT_PLANE = 1.6;
/** Values beyond this are clipped so a growing sequence does not flatten the rest. */
const CLIP = 1e6;

/** Term c * symbol in LaTeX with its sign, dropping a unit coefficient. */
function signedTerm(c: number, symbol: string, first: boolean): string {
  if (c === 0) return first ? '0' : '';
  const size = Math.abs(c);
  const body = `${size === 1 ? '' : formatNumber(size, 2)}\\,${symbol}`;
  if (first) return c < 0 ? `-${body}` : body;
  return c < 0 ? `- ${body}` : `+ ${body}`;
}

function rootText(re: number, im: number): string {
  if (Math.abs(im) < 1e-12) return formatNumber(re, 3);
  return `${formatNumber(re, 3)} ${im < 0 ? '-' : '+'} ${formatNumber(Math.abs(im), 3)}i`;
}

/**
 * Second-order linear recurrence: the terms are computed one by one and
 * compared with the closed form built from the roots of the characteristic
 * equation r^2 = c1 r + c2. The roots, drawn against the unit circle, decide
 * whether the sequence grows, decays or oscillates.
 */
export default function RecurrenceViz({ params, title }: VisualizationProps) {
  const config = params as unknown as RecurrenceVizConfig;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'c1',
        label: 'Coeficiente de a(n-1)',
        symbol: 'c₁',
        min: -2,
        max: 2,
        step: 0.05,
        default: config.c1,
        digits: 2,
      },
      {
        type: 'number' as const,
        key: 'c2',
        label: 'Coeficiente de a(n-2)',
        symbol: 'c₂',
        min: -1,
        max: 1,
        step: 0.05,
        default: config.c2,
        digits: 2,
      },
      {
        type: 'number' as const,
        key: 'a0',
        label: 'Valor inicial a(0)',
        symbol: 'a₀',
        min: -5,
        max: 5,
        step: 0.5,
        default: config.a0,
        digits: 1,
      },
      {
        type: 'number' as const,
        key: 'a1',
        label: 'Valor inicial a(1)',
        symbol: 'a₁',
        min: -5,
        max: 5,
        step: 0.5,
        default: config.a1,
        digits: 1,
      },
    ],
    [config.c1, config.c2, config.a0, config.a1],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const c1 = Number(values.c1);
  const c2 = Number(values.c2);
  const a0 = Number(values.a0);
  const a1 = Number(values.a1);
  const count = config.terminos ?? 20;
  const terms = linearRecurrence([c1, c2], [a0, a1], count);
  const closed = secondOrderClosedForm(c1, c2, a0, a1);
  const roots = characteristicRoots(c1, c2);
  const dominant = Math.max(modulus(roots[0]), modulus(roots[1]));
  const complex = roots[0].im !== 0;
  const behavior =
    dominant > 1 + 1e-9
      ? complex
        ? 'oscila con amplitud creciente'
        : 'crece en magnitud'
      : dominant < 1 - 1e-9
        ? complex
          ? 'oscila y se amortigua hacia 0'
          : 'decae hacia 0'
        : 'ni crece ni decae: la raíz dominante está sobre el círculo unitario';
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${c1}|${c2}|${a0}|${a1}|${run}`, () => 2);
  const playback = usePlayback({
    step: () => update((value) => Math.min(count, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: TERMS_PER_SECOND,
    done: shown >= count,
  });
  const lastIndex = shown - 1;
  const description =
    `Recurrencia a(n) = ${formatNumber(c1, 2)} a(n-1) + ${formatNumber(c2, 2)} a(n-2) con a(0) = ${a0} y a(1) = ${a1}. ` +
    `Raíces características ${rootText(roots[0].re, roots[0].im)} y ${rootText(roots[1].re, roots[1].im)}; la sucesión ${behavior}. ` +
    `a(${lastIndex}) = ${formatNumber(terms[lastIndex] ?? 0, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: `a(${lastIndex})`,
          value: formatNumber(terms[lastIndex] ?? 0, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: 'Forma cerrada',
          value: formatNumber(closed(lastIndex), 4),
          color: DATA_COLORS.secondary,
        },
        { label: 'Raíz 1', value: rootText(roots[0].re, roots[0].im) },
        { label: 'Raíz 2', value: rootText(roots[1].re, roots[1].im) },
        {
          label: 'Módulo dominante',
          value: formatNumber(dominant, 3),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Términos calculados', color: DATA_COLORS.primary, shape: 'circle' },
        { label: 'Forma cerrada', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Raíces características', color: DATA_COLORS.highlight, shape: 'circle' },
      ]}
      description={description}
      dataTable={{
        caption: 'Términos de la recurrencia',
        columns: ['n', 'a(n)', 'forma cerrada'],
        rows: terms.map((value, n) => [n, formatNumber(value, 4), formatNumber(closed(n), 4)]),
      }}
    >
      <p className={styles.formula}>
        <Latex
          tex={`a_n = ${signedTerm(c1, 'a_{n-1}', true)} ${signedTerm(c2, 'a_{n-2}', false)},\\qquad r^2 = ${signedTerm(c1, 'r', true)} ${c2 === 0 ? '' : c2 < 0 ? `- ${formatNumber(-c2, 2)}` : `+ ${formatNumber(c2, 2)}`}`}
        />
      </p>
      <p className={styles.behavior}>La sucesión {behavior}.</p>
      <div className={styles.charts}>
        <ChartSvg label={description} aspect={0.55} minHeight={240} maxHeight={380}>
          {(box) => {
            const visible = terms
              .slice(0, shown)
              .map((value) => Math.max(-CLIP, Math.min(CLIP, value)));
            const low = Math.min(0, ...visible);
            const high = Math.max(0, ...visible);
            const pad = Math.max(1, high - low) * 0.08;
            const x = scaleLinear()
              .domain([0, count - 1])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const y = scaleLinear()
              .domain([low - pad, high + pad])
              .nice()
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                />
                <Axis scale={x} orientation="bottom" position={y(0)} ticks={8} label="n" />
                <g aria-hidden="true">
                  {visible.map((value, n) => (
                    <circle
                      key={n}
                      cx={x(n)}
                      cy={y(value)}
                      r={n === shown - 1 ? 6 : 4}
                      fill={DATA_COLORS.primary}
                    />
                  ))}
                  {visible.map((_, n) => {
                    const value = Math.max(-CLIP, Math.min(CLIP, closed(n)));
                    return (
                      <circle
                        key={`c${n}`}
                        cx={x(n)}
                        cy={y(value)}
                        r={8}
                        fill="none"
                        stroke={DATA_COLORS.secondary}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg
          label={`Raíces características ${rootText(roots[0].re, roots[0].im)} y ${rootText(roots[1].re, roots[1].im)}`}
          aspect={1}
          minHeight={200}
          maxHeight={260}
          margins={{ top: 12, right: 12, bottom: 12, left: 12 }}
        >
          {(box) => {
            const size = Math.min(box.inner.width, box.inner.height);
            const cx = box.inner.left + box.inner.width / 2;
            const cy = box.inner.top + box.inner.height / 2;
            const scale = size / (2 * ROOT_PLANE);
            const clamp = (value: number) => Math.max(-ROOT_PLANE, Math.min(ROOT_PLANE, value));
            return (
              <g aria-hidden="true">
                <line
                  x1={cx - size / 2}
                  x2={cx + size / 2}
                  y1={cy}
                  y2={cy}
                  stroke="var(--color-border-strong)"
                />
                <line
                  x1={cx}
                  x2={cx}
                  y1={cy - size / 2}
                  y2={cy + size / 2}
                  stroke="var(--color-border-strong)"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={scale}
                  fill="none"
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="5 4"
                />
                <text
                  x={cx + scale + 4}
                  y={cy - 4}
                  className={svgStyles.labelMuted}
                  style={{ fontSize: 10 }}
                >
                  1
                </text>
                {roots.map((root, index) => (
                  <circle
                    key={index}
                    cx={cx + clamp(root.re) * scale}
                    cy={cy - clamp(root.im) * scale}
                    r={7}
                    fill={DATA_COLORS.highlight}
                    stroke={DATA_COLORS.text}
                  />
                ))}
                <text
                  x={box.inner.left}
                  y={box.inner.top + 10}
                  className={svgStyles.labelMuted}
                  style={{ fontSize: 10 }}
                >
                  plano complejo
                </text>
              </g>
            );
          }}
        </ChartSvg>
      </div>
    </VizFrame>
  );
}
