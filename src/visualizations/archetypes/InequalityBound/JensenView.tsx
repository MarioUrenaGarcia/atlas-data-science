import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InequalityBound.module.css';
import { JENSEN_FUNCTIONS, type InequalityBoundConfig } from './schema.ts';

const STAGES_PER_SECOND = 1.2;
const CURVE_POINTS = 200;
const MAX_RADIUS = 12;

type JensenFunction = (typeof JENSEN_FUNCTIONS)[number];

interface FunctionInfo {
  g: (x: number) => number;
  tex: string;
  label: string;
  convex: boolean;
}

const FUNCTIONS: Record<JensenFunction, FunctionInfo> = {
  cuadrado: { g: (x) => x * x, tex: 'x^2', label: 'g(x) = x² (convexa)', convex: true },
  exponencial: { g: (x) => Math.exp(x), tex: 'e^{x}', label: 'g(x) = eˣ (convexa)', convex: true },
  'valor-absoluto': {
    g: (x) => Math.abs(x),
    tex: '|x|',
    label: 'g(x) = |x| (convexa)',
    convex: true,
  },
  logaritmo: {
    g: (x) => Math.log(x),
    tex: '\\log x',
    label: 'g(x) = log x (cóncava)',
    convex: false,
  },
  raiz: { g: (x) => Math.sqrt(x), tex: '\\sqrt{x}', label: 'g(x) = √x (cóncava)', convex: false },
};

interface JensenViewProps {
  title: string;
  config: InequalityBoundConfig;
}

/**
 * Jensen's inequality as geometry: the points (x, g(x)) of the values of X
 * sit on the graph of g, with sizes given by their probabilities. Their
 * weighted average is the point (E[X], E[g(X)]), which lies inside the hull
 * of the points and therefore above a convex curve (below a concave one).
 * The animation adds the points one by one and the running average moves to
 * its final place; the vertical gap to the curve at E[X] is the Jensen gap.
 */
export function JensenView({ title, config }: JensenViewProps) {
  const xs = config.valores ?? [1, 2, 3, 4, 5, 6];
  const weights = config.probabilidades ?? xs.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const probs = weights.map((w) => w / total);
  const positive = xs.every((x) => x > 0);
  const options = JENSEN_FUNCTIONS.filter(
    (id) => positive || (id !== 'logaritmo' && id !== 'raiz'),
  );
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'funcion',
        label: 'Función g',
        options: options.map((id) => ({ value: id, label: FUNCTIONS[id].label })),
        default:
          config.funcion && options.includes(config.funcion)
            ? config.funcion
            : (options[0] ?? 'cuadrado'),
      },
    ],
    // The admissible functions derive from the configuration, which is fixed per figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const id =
    ((parameters.values as Record<string, string>).funcion as JensenFunction) ?? 'cuadrado';
  const info = FUNCTIONS[id];
  const n = xs.length;

  const [run, setRun] = useState(0);
  const [added, update] = useResettableState(`${run}|${id}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(n, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: added >= n,
  });
  const partialWeight = probs.slice(0, added).reduce((a, b) => a + b, 0);
  const avgX =
    added > 0
      ? xs.slice(0, added).reduce((s, x, k) => s + x * (probs[k] ?? 0), 0) / partialWeight
      : 0;
  const avgG =
    added > 0
      ? xs.slice(0, added).reduce((s, x, k) => s + info.g(x) * (probs[k] ?? 0), 0) / partialWeight
      : 0;
  const meanX = xs.reduce((s, x, k) => s + x * (probs[k] ?? 0), 0);
  const meanG = xs.reduce((s, x, k) => s + info.g(x) * (probs[k] ?? 0), 0);
  const gOfMean = info.g(meanX);
  const finished = added >= n;
  const f = (v: number) => formatNumber(v, 3);
  const relation = info.convex ? '\\ge' : '\\le';
  const header = finished
    ? `\\mathbb{E}[g(X)] = ${f(meanG)} \\;${relation}\\; g(\\mathbb{E}[X]) = g(${f(meanX)}) = ${f(gOfMean)}, \\qquad g(x) = ${info.tex}`
    : added === 0
      ? `g \\text{ ${info.convex ? 'convexa' : 'cóncava'}} \\;\\Rightarrow\\; \\mathbb{E}[g(X)] ${relation} g(\\mathbb{E}[X])`
      : `\\text{promedio de ${added} puntos: } (${f(avgX)},\\ ${f(avgG)})`;
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  const pad = (hi - lo) * 0.12 + 0.2;
  const d0 = positive && !info.convex ? Math.max(1e-3, lo - pad) : lo - pad;
  const d1 = hi + pad;
  const curveXs = Array.from(
    { length: CURVE_POINTS + 1 },
    (_, i) => d0 + ((d1 - d0) * i) / CURVE_POINTS,
  );
  const gs = curveXs.map(info.g);
  const yLo = Math.min(...gs, meanG);
  const yHi = Math.max(...gs, meanG);
  const yPad = (yHi - yLo) * 0.08;
  const maxP = Math.max(...probs);
  const description =
    `${info.label}. Valores ${xs.map((x) => formatNumber(x, 2)).join(', ')} con probabilidades ${probs.map(f).join(', ')}. ` +
    `E[g(X)] = ${f(meanG)} y g(E[X]) = ${f(gOfMean)}; diferencia ${f(meanG - gOfMean)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values }}
      readouts={[
        { label: 'E[X]', value: f(meanX) },
        { label: 'E[g(X)]', value: f(meanG), color: DATA_COLORS.secondary },
        { label: 'g(E[X])', value: f(gOfMean), color: DATA_COLORS.primary },
        { label: 'Brecha de Jensen', value: f(meanG - gOfMean), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Gráfica de g', color: DATA_COLORS.text, shape: 'line' },
        {
          label: 'Puntos (x, g(x)), tamaño según probabilidad',
          color: DATA_COLORS.primary,
          shape: 'circle',
        },
        {
          label: 'Promedio ponderado (E[X], E[g(X)])',
          color: DATA_COLORS.secondary,
          shape: 'circle',
        },
        { label: 'Brecha de Jensen', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.55} minHeight={260} maxHeight={400}>
        {(box) => {
          const x = scaleLinear()
            .domain([d0, d1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([yLo - yPad, yHi + yPad])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="g(x)"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="x"
              />
              <CurvePath
                points={curveXs.map((v, i) => ({ x: v, y: gs[i] ?? 0 }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.text}
                width={2.5}
                animate={false}
              />
              <g aria-hidden="true">
                {xs.map((v, k) => (
                  <circle
                    key={k}
                    cx={x(v)}
                    cy={y(info.g(v))}
                    r={Math.max(3, MAX_RADIUS * Math.sqrt((probs[k] ?? 0) / maxP))}
                    fill={DATA_COLORS.primary}
                    fillOpacity={k < added ? 0.85 : 0.25}
                  />
                ))}
                {added > 0 && (
                  <circle cx={x(avgX)} cy={y(avgG)} r={7} fill={DATA_COLORS.secondary} />
                )}
                {finished && (
                  <>
                    <line
                      x1={x(meanX)}
                      x2={x(meanX)}
                      y1={y(gOfMean)}
                      y2={y(meanG)}
                      stroke={DATA_COLORS.highlight}
                      strokeWidth={3}
                    />
                    <circle cx={x(meanX)} cy={y(gOfMean)} r={5} fill={DATA_COLORS.text} />
                  </>
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        El promedio ponderado de puntos sobre una curva convexa queda por encima de la curva, porque
        cae dentro de la figura que encierran los puntos. Con una función cóncava queda por debajo.
      </p>
    </VizFrame>
  );
}
