import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  analyzeFunction,
  preimages,
  REAL_FUNCTIONS,
  sampleFunction,
} from '../../../lib/sets/realFunctions.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FunctionGraph.module.css';
import { functionName, intervalText as interval } from './names.ts';
import { planeScales, viewInterval } from './plane.ts';
import type { RestrictedFunction } from './schema.ts';

/** Positions of the horizontal line during one sweep of the codomain. */
const SWEEP_STEPS = 80;
const STEPS_PER_SECOND = 14;
const BRACKET_OFFSET = 10;

interface ClassificationViewProps {
  title: string;
  functions: readonly RestrictedFunction[];
}

/**
 * Horizontal line test on the graph of a function restricted to a domain and
 * a codomain. A horizontal line at height c meets the graph once for every
 * solution of f(x) = c: more than once breaks injectivity, and a height of
 * the codomain the graph never reaches breaks surjectivity. The line sweeps
 * the codomain and can also be dragged by its handle on the vertical axis.
 */
export function ClassificationView({ title, functions }: ClassificationViewProps) {
  const definitions = useMemo(
    () =>
      functions.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'funcion',
              label: 'Función',
              options: functions.map((item, index) => ({
                value: String(index),
                label: functionName(item),
              })),
              default: '0',
            },
          ]
        : [],
    [functions],
  );
  const parameters = useParameters(definitions);
  const chosen =
    functions.length > 1 ? Number((parameters.values as Record<string, string>).funcion) : 0;
  const item = functions[chosen] ?? functions[0];
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState<number>(`${chosen}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(SWEEP_STEPS, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= SWEEP_STEPS,
  });
  if (!item) return null;
  const fn = REAL_FUNCTIONS[item.funcion];
  const [a, b] = item.dominio;
  const [c0, c1] = item.codominio;
  const analysis = analyzeFunction(fn, item.dominio, item.codominio);
  const level = c0 + ((c1 - c0) * step) / SWEEP_STEPS;
  const roots = preimages(fn.f, item.dominio, level);
  const graph = sampleFunction(fn.f, item.dominio, 400);
  const verdict = (ok: boolean) => (ok ? 'sí' : 'no');
  const injectiveText = analysis.injective
    ? 'sí: cada altura corta la gráfica a lo más una vez'
    : `no: f(${formatNumber(analysis.collision?.[0] ?? 0, 2)}) = f(${formatNumber(analysis.collision?.[1] ?? 0, 2)})`;
  const surjectiveText = analysis.surjective
    ? 'sí: toda altura del codominio se alcanza'
    : `no: ${formatNumber(analysis.missed ?? 0, 2)} no tiene preimagen`;
  const description =
    `${fn.label} con dominio ${interval(item.dominio)} y codominio ${interval(item.codominio)}. ` +
    (analysis.intoCodomain
      ? ''
      : 'La gráfica sale del codominio, así que f no es una función hacia ese codominio. ') +
    `La recta horizontal y = ${formatNumber(level, 2)} corta la gráfica ${roots.length} ${roots.length === 1 ? 'vez' : 'veces'}. ` +
    `Inyectiva: ${verdict(analysis.injective)}. Suprayectiva: ${verdict(analysis.surjective)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        {
          label: `Soluciones de f(x) = ${formatNumber(level, 2)}`,
          value: String(roots.length),
          color: DATA_COLORS.highlight,
        },
        { label: 'Imagen', value: interval(analysis.range), color: DATA_COLORS.tertiary },
        { label: 'Inyectiva', value: injectiveText },
        {
          label: 'Suprayectiva',
          value: analysis.intoCodomain ? surjectiveText : 'la gráfica sale del codominio',
        },
        {
          label: 'Biyectiva',
          value: verdict(analysis.injective && analysis.surjective && analysis.intoCodomain),
        },
      ]}
      legend={[
        { label: 'Gráfica en el dominio', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Codominio', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Imagen', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Recta horizontal y sus cortes', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`${fn.latex},\\qquad f: [${a}, ${b}] \\to [${c0}, ${c1}]`} />
      </p>
      <ChartSvg
        interactive
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={440}
        margins={{ top: 14, right: 48, bottom: 30, left: 40 }}
      >
        {(box) => {
          const plane = planeScales(
            box,
            viewInterval([a, b]),
            viewInterval([c0, c1, analysis.range[0], analysis.range[1]]),
          );
          const { x, y } = plane;
          const segmentsOf = () => {
            if (!fn.discontinuous) return [graph];
            const pieces: { x: number; y: number }[][] = [];
            graph.forEach((point, index) => {
              const previous = graph[index - 1];
              if (!previous || previous.y !== point.y) pieces.push([]);
              pieces.at(-1)?.push(point);
            });
            return pieces;
          };
          const axisX = x(0);
          const rightEdge = box.inner.left + box.inner.width;
          return (
            <>
              <Axis scale={x} orientation="bottom" position={y(0)} ticks={8} />
              <Axis scale={y} orientation="left" position={axisX} ticks={6} />
              <g aria-hidden="true">
                <line
                  x1={x(a)}
                  x2={x(b)}
                  y1={y(0) + BRACKET_OFFSET}
                  y2={y(0) + BRACKET_OFFSET}
                  stroke={DATA_COLORS.primary}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={0.7}
                />
                <line
                  x1={rightEdge + BRACKET_OFFSET}
                  x2={rightEdge + BRACKET_OFFSET}
                  y1={y(c0)}
                  y2={y(c1)}
                  stroke={DATA_COLORS.secondary}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={0.7}
                />
                <line
                  x1={rightEdge + 2 * BRACKET_OFFSET}
                  x2={rightEdge + 2 * BRACKET_OFFSET}
                  y1={y(analysis.range[0])}
                  y2={y(analysis.range[1])}
                  stroke={DATA_COLORS.tertiary}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                {!analysis.surjective && analysis.intoCodomain && analysis.missed !== null && (
                  <circle
                    cx={rightEdge + BRACKET_OFFSET}
                    cy={y(analysis.missed)}
                    r={6}
                    fill="none"
                    stroke={DATA_COLORS.negative}
                    strokeWidth={2.5}
                  />
                )}
              </g>
              {segmentsOf().map((points, index) => (
                <CurvePath
                  key={index}
                  points={points}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.primary}
                  width={3}
                  animate={false}
                />
              ))}
              <g aria-hidden="true">
                <line
                  x1={x(a)}
                  x2={rightEdge + BRACKET_OFFSET}
                  y1={y(level)}
                  y2={y(level)}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                {roots.map((root) => (
                  <g key={root}>
                    <line
                      x1={x(root)}
                      x2={x(root)}
                      y1={y(level)}
                      y2={y(0)}
                      stroke={DATA_COLORS.highlight}
                      strokeDasharray="2 3"
                    />
                    <circle
                      cx={x(root)}
                      cy={y(level)}
                      r={6}
                      fill={DATA_COLORS.highlight}
                      stroke={DATA_COLORS.text}
                    />
                  </g>
                ))}
                {analysis.collision && !analysis.injective && step >= SWEEP_STEPS && (
                  <text
                    x={x(analysis.collision[1])}
                    y={y(fn.f(analysis.collision[1])) - 12}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    mismo valor
                  </text>
                )}
              </g>
              <DraggablePoint
                x={axisX}
                y={y(level)}
                color={DATA_COLORS.highlight}
                label="Altura de la recta horizontal"
                valueText={`y = ${formatNumber(level, 2)}`}
                axis="y"
                onDrag={(_, py) => {
                  playback.pause();
                  const value = Math.min(c1, Math.max(c0, y.invert(py)));
                  update(() => Math.round(((value - c0) / (c1 - c0)) * SWEEP_STEPS));
                }}
              />
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
