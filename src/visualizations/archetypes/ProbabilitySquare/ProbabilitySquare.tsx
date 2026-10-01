import { useMemo, useState } from 'react';
import {
  jointProbabilities,
  normalize,
  posterior,
  totalProbability,
} from '../../../lib/probability/conditional.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { useTween } from '../../core/useTween.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './ProbabilitySquare.module.css';
import type { ProbabilitySquareConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.55;
const RESCALE_MS = 1100;
const GAP = 28;
const MAX_SIDE = 340;
const LABEL_MIN_AREA = 900;
const DIGITS = 3;

const f = (value: number) => formatNumber(value, DIGITS);

/**
 * The unit square as the sample space. Columns are a partition with widths
 * P(A_i); inside each column the lower part has height P(B | A_i), so its
 * area is the joint probability. Conditioning on B keeps only those lower
 * pieces and stretches them to fill a new square, which is Bayes' theorem.
 */
export default function ProbabilitySquare({ params, title }: VisualizationProps) {
  const config = params as unknown as ProbabilitySquareConfig;
  const k = config.particion.length;
  const eventName = config.evento ?? 'B';
  const complementName = config.complemento ?? `no ${eventName}`;
  const labels = config.particion.map((part) => part.etiqueta);
  const definitions = useMemo(
    () => [
      ...(k === 2
        ? [
            {
              type: 'number' as const,
              key: 'p0',
              label: `P(${config.particion[0]?.etiqueta ?? ''})`,
              min: 0.01,
              max: 0.99,
              step: 0.01,
              digits: 2,
              default: config.particion[0]?.prob ?? 0.5,
            },
          ]
        : config.particion.map((part, index) => ({
            type: 'number' as const,
            key: `p${index}`,
            label: `Peso de ${part.etiqueta} (se normaliza)`,
            min: 0.01,
            max: 1,
            step: 0.01,
            digits: 2,
            default: part.prob,
          }))),
      ...config.condicionales.map((value, index) => ({
        type: 'number' as const,
        key: `c${index}`,
        label: `P(${eventName} | ${config.particion[index]?.etiqueta ?? ''})`,
        min: 0,
        max: 1,
        step: 0.01,
        digits: 2,
        default: value,
      })),
    ],
    [config, k, eventName],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const priors =
    k === 2
      ? [values.p0 ?? 0.5, 1 - (values.p0 ?? 0.5)]
      : normalize(labels.map((_, index) => values[`p${index}`] ?? 0));
  const likelihoods = labels.map((_, index) => values[`c${index}`] ?? 0);
  const joint = jointProbabilities(priors, likelihoods);
  const pB = totalProbability(priors, likelihoods);
  const post = posterior(priors, likelihoods);
  const focus = Math.min(config.columna ?? 0, k - 1);

  const lastStage = config.modo === 'total' || config.modo === 'independencia' ? k : 3;
  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${config.modo}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(lastStage, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= lastStage,
  });
  const [rescale = 0] = useTween([config.modo === 'bayes' && stage >= 3 ? 1 : 0], RESCALE_MS);

  // Multi-letter names are set as text so KaTeX does not typeset them as products of variables.
  const tex = (name: string) => (name.length > 1 ? `\\text{${name}}` : name);
  const A = (index: number) => tex(labels[index] ?? '');
  const E = tex(eventName);
  const header = (() => {
    const a = A(focus);
    switch (config.modo) {
      case 'producto':
        return [
          `P(${a} \\cap ${E}) = P(${a})\\,P(${E} \\mid ${a})`,
          `P(${a}) = ${f(priors[focus] ?? 0)} \\quad \\text{(ancho de la columna)}`,
          `P(${E} \\mid ${a}) = ${f(likelihoods[focus] ?? 0)} \\quad \\text{(altura dentro de la columna)}`,
          `P(${a} \\cap ${E}) = ${f(priors[focus] ?? 0)} \\cdot ${f(likelihoods[focus] ?? 0)} = ${f(joint[focus] ?? 0)} \\quad \\text{(área)}`,
        ][stage];
      case 'total': {
        if (stage === 0) return `P(${E}) = \\sum_i P(A_i)\\,P(${E} \\mid A_i)`;
        const terms = joint
          .slice(0, stage)
          .map((_, i) => `${f(priors[i] ?? 0)} \\cdot ${f(likelihoods[i] ?? 0)}`)
          .join(' + ');
        const partial = joint.slice(0, stage).reduce((sum, value) => sum + value, 0);
        return `P(${E}) ${stage < k ? '\\ge' : '='} ${terms} = ${f(partial)}`;
      }
      case 'bayes':
        return [
          `P(${a} \\mid ${E}) = \\frac{P(${a})\\,P(${E} \\mid ${a})}{P(${E})}`,
          `P(${E}) = ${joint.map((value) => f(value)).join(' + ')} = ${f(pB)}`,
          `\\text{Se sabe que ocurrió } ${E}\\text{: se descarta todo lo que está fuera}`,
          `P(${a} \\mid ${E}) = \\frac{${f(joint[focus] ?? 0)}}{${f(pB)}} = ${f(post[focus] ?? 0)}`,
        ][stage];
      case 'independencia': {
        if (stage === 0) return `P(${E}) = ${f(pB)}`;
        const shown = likelihoods
          .slice(0, stage)
          .map((value, i) => `P(${E} \\mid ${A(i)}) = ${f(value)}`)
          .join(',\\; ');
        return `${shown} \\quad P(${E}) = ${f(pB)}`;
      }
    }
  })();

  const independent = likelihoods.every((value) => Math.abs(value - (likelihoods[0] ?? 0)) < 1e-9);
  const description =
    `Cuadrado de probabilidad con columnas ${labels.map((label, i) => `${label} de ancho ${f(priors[i] ?? 0)}`).join(', ')}. ` +
    `Dentro de cada columna, la parte inferior es ${eventName}, con alturas ${likelihoods.map((value) => f(value)).join(', ')}. ` +
    `P(${eventName}) = ${f(pB)}. Probabilidades dado ${eventName}: ${labels.map((label, i) => `${label}, ${f(post[i] ?? 0)}`).join('; ')}.`;

  const highlighted = (index: number, lower: boolean) => {
    switch (config.modo) {
      case 'producto':
        return index === focus && (stage === 1 || (stage >= 2 && lower));
      case 'total':
        return lower && index < stage;
      case 'bayes':
        return lower && stage >= 1;
      case 'independencia':
        return lower && index < stage;
    }
  };
  const faded = (lower: boolean) => config.modo === 'bayes' && stage >= 2 && !lower;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        ...labels.map((label, i) => ({
          label: `P(${label})`,
          value: f(priors[i] ?? 0),
          color: seriesColor(i),
        })),
        { label: `P(${eventName})`, value: f(pB) },
        ...(config.modo === 'bayes' || config.modo === 'total'
          ? labels.map((label, i) => ({
              label: `P(${label} | ${eventName})`,
              value: f(post[i] ?? 0),
            }))
          : []),
        ...(config.modo === 'independencia'
          ? [{ label: 'Independientes', value: independent ? 'sí' : 'no' }]
          : []),
      ]}
      legend={[
        ...labels.map((label, i) => ({ label, color: seriesColor(i) })),
        { label: `${eventName} (parte inferior, color intenso)`, color: DATA_COLORS.muted },
      ]}
      description={description}
    >
      <FormulaLine tex={header ?? ''} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg
        label={description}
        aspect={config.modo === 'bayes' ? 0.5 : 0.62}
        minHeight={240}
        maxHeight={MAX_SIDE + 70}
        margins={{ top: 28, right: 12, bottom: 30, left: 12 }}
      >
        {(box) => {
          const panels = config.modo === 'bayes' ? 2 : 1;
          const side = Math.min(
            MAX_SIDE,
            box.inner.height,
            (box.inner.width - GAP * (panels - 1)) / panels,
          );
          const left = box.inner.left + (box.inner.width - side * panels - GAP * (panels - 1)) / 2;
          const top = box.inner.top;
          const right = left + side + GAP;
          let cumulative = 0;
          let cumulativePost = 0;
          const columns = labels.map((_, index) => {
            const x = cumulative;
            cumulative += priors[index] ?? 0;
            const px = cumulativePost;
            cumulativePost += post[index] ?? 0;
            return { x, width: priors[index] ?? 0, px, pwidth: post[index] ?? 0 };
          });
          const lerp = (a: number, b: number) => a + (b - a) * rescale;
          return (
            <g aria-hidden="true">
              <rect
                x={left}
                y={top}
                width={side}
                height={side}
                fill="none"
                stroke="var(--color-border-strong)"
              />
              {panels === 2 && (
                <>
                  <rect
                    x={right}
                    y={top}
                    width={side}
                    height={side}
                    fill="none"
                    stroke="var(--color-border-strong)"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={right + side / 2}
                    y={top - 10}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    Nuevo espacio: solo {eventName}
                  </text>
                </>
              )}
              {columns.map((column, index) => {
                const color = seriesColor(index);
                const height = likelihoods[index] ?? 0;
                const x = left + column.x * side;
                const width = column.width * side;
                const lowerTop = top + (1 - height) * side;
                const upper = (
                  <rect
                    x={x}
                    y={top}
                    width={width}
                    height={(1 - height) * side}
                    fill={color}
                    fillOpacity={faded(false) ? 0.04 : 0.14}
                    stroke="var(--color-surface)"
                    strokeWidth={1.5}
                  />
                );
                // In Bayes mode the lower piece travels to the right square and fills its height.
                const lx = lerp(x, right + column.px * side);
                const lw = lerp(width, column.pwidth * side);
                const ly = lerp(lowerTop, top);
                const lh = lerp(height * side, side);
                const area = lw * lh;
                return (
                  <g key={index}>
                    {upper}
                    <rect
                      x={lx}
                      y={ly}
                      width={lw}
                      height={lh}
                      fill={color}
                      fillOpacity={0.6}
                      stroke={highlighted(index, true) ? DATA_COLORS.text : 'var(--color-surface)'}
                      strokeWidth={highlighted(index, true) ? 2.5 : 1.5}
                    />
                    {rescale > 0 && (
                      <rect
                        x={x}
                        y={lowerTop}
                        width={width}
                        height={height * side}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    )}
                    {highlighted(index, false) && (
                      <rect
                        x={x}
                        y={top}
                        width={width}
                        height={side}
                        fill="none"
                        stroke={DATA_COLORS.text}
                        strokeWidth={2.5}
                      />
                    )}
                    <text
                      x={x + width / 2}
                      y={top - 10}
                      textAnchor="middle"
                      className={svgStyles.label}
                    >
                      {labels[index]}
                    </text>
                    {area > LABEL_MIN_AREA && (
                      <text
                        x={lx + lw / 2}
                        y={ly + lh / 2}
                        dy="0.35em"
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontWeight: 700 }}
                      >
                        {f(rescale > 0.5 ? (post[index] ?? 0) : (joint[index] ?? 0))}
                      </text>
                    )}
                    {config.modo === 'independencia' && index < stage && (
                      <line
                        x1={x}
                        x2={x + width}
                        y1={lowerTop}
                        y2={lowerTop}
                        stroke={DATA_COLORS.text}
                        strokeWidth={2}
                      />
                    )}
                  </g>
                );
              })}
              {config.modo === 'independencia' && stage >= k && (
                <line
                  x1={left}
                  x2={left + side}
                  y1={top + (1 - pB) * side}
                  y2={top + (1 - pB) * side}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="6 4"
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Parte inferior de cada columna: {eventName}. Parte superior: {complementName}. El ancho de
        cada columna es su probabilidad y la altura de la parte inferior es la probabilidad
        condicional de {eventName}; el área de cada rectángulo es la probabilidad conjunta.
      </p>
    </VizFrame>
  );
}
