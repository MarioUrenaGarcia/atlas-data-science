import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  analyzeFunction,
  REAL_FUNCTIONS,
  sampleFunction,
} from '../../../lib/sets/realFunctions.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FunctionGraph.module.css';
import { functionName } from './names.ts';
import { planeScales, viewInterval } from './plane.ts';
import type { RestrictedFunction } from './schema.ts';

const FRAMES = 60;
const FRAMES_PER_SECOND = 20;

/** Formula of the inverse on the natural restriction where it exists. */
const INVERSE_LATEX: Partial<Record<keyof typeof REAL_FUNCTIONS, string>> = {
  identidad: 'f^{-1}(x) = x',
  lineal: 'f^{-1}(x) = \\tfrac{x - 1}{2}',
  cuadrado: 'f^{-1}(x) = \\sqrt{x}',
  cubo: 'f^{-1}(x) = \\sqrt[3]{x}',
  exponencial: 'f^{-1}(x) = \\log x',
  logaritmo: 'f^{-1}(x) = e^{x}',
  raiz: 'f^{-1}(x) = x^2',
  arcotangente: 'f^{-1}(x) = \\tan x',
  seno: 'f^{-1}(x) = \\arcsen x',
};

interface InverseViewProps {
  title: string;
  functions: readonly RestrictedFunction[];
}

/**
 * The graph of the inverse is the reflection of the graph of f across the
 * line y = x: every point (x, f(x)) moves to (f(x), x). When f is not
 * injective the reflected curve fails the vertical line test, so it is not
 * the graph of any function.
 */
export function InverseView({ title, functions }: InverseViewProps) {
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
  const [frame, update] = useResettableState<number>(`${chosen}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(FRAMES, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: FRAMES_PER_SECOND,
    done: frame >= FRAMES,
  });
  if (!item) return null;
  const fn = REAL_FUNCTIONS[item.funcion];
  const analysis = analyzeFunction(fn, item.dominio, item.codominio);
  const invertible = analysis.injective && analysis.surjective && analysis.intoCodomain;
  const t = frame / FRAMES;
  const graph = sampleFunction(fn.f, item.dominio, 300);
  const moving = graph.map((point) => ({
    x: point.x + (point.y - point.x) * t,
    y: point.y + (point.x - point.y) * t,
  }));
  const collisionValue = analysis.collision ? fn.f(analysis.collision[0]) : null;
  const inverseLatex = INVERSE_LATEX[item.funcion];
  const description =
    `Reflexión de la gráfica de ${fn.label} respecto a la recta y = x, avance ${Math.round(t * 100)} %. ` +
    (invertible
      ? 'La función es biyectiva y la curva reflejada es la gráfica de su inversa.'
      : analysis.injective
        ? 'La función es inyectiva pero no suprayectiva sobre el codominio: la inversa solo está definida en la imagen.'
        : `La función no es inyectiva: la recta vertical x = ${formatNumber(collisionValue ?? 0, 2)} corta la curva reflejada dos veces, así que no es gráfica de una función.`);
  const all = [...item.dominio, ...item.codominio, analysis.range[0], analysis.range[1]];

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'Inyectiva', value: analysis.injective ? 'sí' : 'no' },
        {
          label: 'Suprayectiva',
          value: analysis.surjective && analysis.intoCodomain ? 'sí' : 'no',
        },
        {
          label: 'Inversa',
          value: invertible ? 'existe' : analysis.injective ? 'solo sobre la imagen' : 'no existe',
          color: DATA_COLORS.secondary,
        },
      ]}
      legend={[
        { label: 'Gráfica de f', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Curva reflejada', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Recta y = x', color: DATA_COLORS.muted, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={`${fn.latex}${invertible && inverseLatex ? `,\\qquad ${inverseLatex}` : ''}`} />
      </p>
      <ChartSvg
        label={description}
        aspect={0.62}
        minHeight={260}
        maxHeight={440}
        margins={{ top: 14, right: 20, bottom: 30, left: 36 }}
      >
        {(box) => {
          const range = viewInterval(all);
          const { x, y } = planeScales(box, range, range, true);
          const [low, high] = x.domain() as [number, number];
          return (
            <>
              <Axis scale={x} orientation="bottom" position={y(0)} ticks={8} />
              <Axis scale={y} orientation="left" position={x(0)} ticks={6} />
              <g aria-hidden="true">
                <line
                  x1={x(low)}
                  y1={y(low)}
                  x2={x(high)}
                  y2={y(high)}
                  stroke={DATA_COLORS.muted}
                  strokeDasharray="6 5"
                />
              </g>
              <CurvePath
                points={graph}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                width={2.5}
                animate={false}
              />
              {frame > 0 && (
                <CurvePath
                  points={moving}
                  xScale={x}
                  yScale={y}
                  color={DATA_COLORS.secondary}
                  width={3}
                  animate={false}
                />
              )}
              {frame >= FRAMES && !analysis.injective && collisionValue !== null && (
                <g aria-hidden="true">
                  <line
                    x1={x(collisionValue)}
                    x2={x(collisionValue)}
                    y1={y(high)}
                    y2={y(low)}
                    stroke={DATA_COLORS.highlight}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                  />
                  {analysis.collision?.map((value) => (
                    <circle
                      key={value}
                      cx={x(collisionValue)}
                      cy={y(value)}
                      r={6}
                      fill={DATA_COLORS.highlight}
                      stroke={DATA_COLORS.text}
                    />
                  ))}
                </g>
              )}
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
