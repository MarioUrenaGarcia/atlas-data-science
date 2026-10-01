import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { ANSCOMBE } from '../../../lib/stats/anscombe.ts';
import { linearRegression, mean, pearson, variance } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './AnscombeQuartet.module.css';
import type { AnscombeQuartetConfig } from './schema.ts';

const X_DOMAIN: [number, number] = [2, 20];
const Y_DOMAIN: [number, number] = [2, 14];
const RESIDUAL_DOMAIN: [number, number] = [-4, 4];
const STAGES_PER_SECOND = 0.8;
/** Table, four panels, fitted lines, residuals. */
const LAST_STAGE = 6;
const PANEL_GAP = 28;
const DOT = 4.5;

const SET_NAMES = ['I', 'II', 'III', 'IV'] as const;
const SET_STORIES = [
  'relación lineal con ruido',
  'curva sin ruido: la recta no es el modelo adecuado',
  'recta exacta con un punto atípico en y',
  'x casi constante con un punto de alta palanca',
] as const;

type View = 'cuarteto' | 'conjunto';

interface Stats {
  mx: number;
  my: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  b: number;
  r2: number;
  residuals: number[];
}

function statsOf(x: readonly number[], y: readonly number[]): Stats {
  const fit = linearRegression(x, y);
  return {
    mx: mean(x),
    my: mean(y),
    vx: variance(x),
    vy: variance(y),
    r: pearson(x, y),
    a: fit.intercept,
    b: fit.slope,
    r2: fit.rSquared,
    residuals: fit.residuals,
  };
}

function statsTex(label: string, s: Stats): string {
  return (
    `\\text{${label}}:\\ \\bar{x} = ${formatNumber(s.mx, 2)},\\ s_x^2 = ${formatNumber(s.vx, 2)},\\ ` +
    `\\bar{y} = ${formatNumber(s.my, 2)},\\ s_y^2 = ${formatNumber(s.vy, 2)},\\ r = ${formatNumber(s.r, 3)},\\ ` +
    `\\hat{y} = ${formatNumber(s.a, 2)} + ${formatNumber(s.b, 3)}\\,x`
  );
}

/**
 * Anscombe's quartet: four sets of eleven points with the same means,
 * variances, correlation and least squares line, revealed one by one so that
 * the identical summary comes first and the very different pictures after.
 */
export default function AnscombeQuartet({ params, title }: VisualizationProps) {
  const config = params as unknown as AnscombeQuartetConfig;
  const [view, setView] = useState<View>(config.vista ?? 'cuarteto');
  const definitions = useMemo<ParameterDefinition[]>(
    () =>
      view === 'conjunto'
        ? [
            {
              type: 'select',
              key: 'conjunto',
              label: 'Conjunto',
              options: SET_NAMES.map((name, i) => ({
                value: String(i + 1),
                label: `Conjunto ${name}`,
              })),
              default: String(config.conjunto ?? 1),
            },
          ]
        : [],
    [view, config.conjunto],
  );
  const parameters = useParameters(definitions);
  const chosen = Math.max(0, Math.min(3, Number(parameters.values.conjunto ?? 1) - 1));
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, setStage] = useResettableState<number>(`${view}|${run}`, () =>
    reducedMotion || view === 'conjunto' ? LAST_STAGE : 0,
  );
  const [moved, setMoved] = useResettableState<number[]>(`${chosen}|${run}`, () => [
    ...(ANSCOMBE[chosen]?.y ?? []),
  ]);
  const playback = usePlayback({
    step: () => setStage((v) => Math.min(LAST_STAGE, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });

  const all = ANSCOMBE.map((d) => statsOf(d.x, d.y));
  const chosenX = ANSCOMBE[chosen]?.x ?? [];
  const live = statsOf(chosenX, moved);
  const revealed = Math.min(4, stage);
  const header =
    view === 'conjunto'
      ? statsTex(`Conjunto ${SET_NAMES[chosen]}`, live)
      : stage === 0 || stage > 4
        ? statsTex('Los cuatro conjuntos', all[0] as Stats)
        : statsTex(`Conjunto ${SET_NAMES[stage - 1]}`, all[stage - 1] as Stats);
  const description =
    view === 'conjunto'
      ? `Conjunto ${SET_NAMES[chosen]} (${SET_STORIES[chosen]}). Media de y ${formatNumber(live.my, 2)}, correlación ${formatNumber(live.r, 3)}, recta ${formatNumber(live.a, 2)} + ${formatNumber(live.b, 3)} x, R cuadrada ${formatNumber(live.r2, 3)}.`
      : `Cuarteto de Anscombe. Los cuatro conjuntos tienen media de x 9, varianza de x 11, media de y 7.50, varianza de y 4.12 o 4.13, correlación 0.816 y recta 3.00 + 0.500 x. ` +
        `Se han mostrado ${revealed} de 4 diagramas: ${SET_NAMES.slice(0, revealed)
          .map((name, i) => `${name}, ${SET_STORIES[i]}`)
          .join('; ')}.`;

  const panel = (
    i: number,
    left: number,
    top: number,
    width: number,
    height: number,
    ys: readonly number[],
    s: Stats,
    showPoints: boolean,
    showLine: boolean,
    showResiduals: boolean,
    draggable: boolean,
  ) => {
    const xs = ANSCOMBE[i]?.x ?? [];
    const x = scaleLinear()
      .domain(X_DOMAIN)
      .range([left, left + width]);
    const y = scaleLinear()
      .domain(Y_DOMAIN)
      .range([top + height, top]);
    const color = seriesColor(i);
    return (
      <g key={i}>
        <Axis scale={y} orientation="left" position={left} gridLength={width} ticks={4} label="y" />
        <Axis scale={x} orientation="bottom" position={top + height} ticks={5} label="x" />
        <text x={left + 8} y={top + 16} className={styles.panelLabel}>
          {SET_NAMES[i]}
        </text>
        {!showPoints && (
          <text
            x={left + width / 2}
            y={top + height / 2}
            textAnchor="middle"
            dy="0.32em"
            className={styles.hidden}
          >
            ?
          </text>
        )}
        <g aria-hidden={!draggable}>
          {showLine && (
            <line
              x1={x(X_DOMAIN[0])}
              x2={x(X_DOMAIN[1])}
              y1={y(s.a + s.b * X_DOMAIN[0])}
              y2={y(s.a + s.b * X_DOMAIN[1])}
              stroke={DATA_COLORS.text}
              strokeWidth={2}
            />
          )}
          {showResiduals &&
            xs.map((xv, k) => (
              <line
                key={`r${k}`}
                x1={x(xv)}
                x2={x(xv)}
                y1={y(ys[k] ?? 0)}
                y2={y(s.a + s.b * xv)}
                stroke={DATA_COLORS.secondary}
                strokeWidth={1.5}
                strokeDasharray="3 2"
              />
            ))}
          {showPoints &&
            xs.map((xv, k) =>
              draggable ? (
                <DraggablePoint
                  key={k}
                  x={x(xv)}
                  y={y(ys[k] ?? 0)}
                  radius={DOT + 1.5}
                  color={color}
                  axis="y"
                  label={`Punto ${k + 1} del conjunto ${SET_NAMES[i]}`}
                  valueText={`x = ${xv}, y = ${formatNumber(ys[k] ?? 0, 2)}`}
                  onDrag={(_, py) =>
                    setMoved((prev) =>
                      prev.map((v, j) =>
                        j === k ? Math.max(Y_DOMAIN[0], Math.min(Y_DOMAIN[1], y.invert(py))) : v,
                      ),
                    )
                  }
                />
              ) : (
                <circle key={k} cx={x(xv)} cy={y(ys[k] ?? 0)} r={DOT} fill={color} />
              ),
            )}
        </g>
      </g>
    );
  };

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      views={{
        options: [
          { value: 'cuarteto', label: 'Los cuatro conjuntos' },
          { value: 'conjunto', label: 'Un conjunto y sus residuos' },
        ],
        value: view,
        onChange: (value) => setView(value as View),
      }}
      readouts={
        view === 'conjunto'
          ? [
              { label: 'Media de y', value: formatNumber(live.my, 2) },
              { label: 'Varianza de y', value: formatNumber(live.vy, 2) },
              { label: 'Correlación r', value: formatNumber(live.r, 3) },
              { label: 'Pendiente', value: formatNumber(live.b, 3) },
              { label: 'Ordenada', value: formatNumber(live.a, 2) },
              { label: 'R cuadrada', value: formatNumber(live.r2, 3) },
            ]
          : all.map((s, i) => ({
              label: `Conjunto ${SET_NAMES[i]}: r`,
              value: formatNumber(s.r, 3),
              color: seriesColor(i),
            }))
      }
      legend={[
        {
          label: 'Observación',
          color: seriesColor(view === 'conjunto' ? chosen : 0),
          shape: 'circle',
        },
        { label: 'Recta de mínimos cuadrados', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Residuo', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
      dataTable={{
        caption: 'Datos del cuarteto de Anscombe',
        columns: ['Punto', 'x I a III', 'y I', 'y II', 'y III', 'x IV', 'y IV'],
        rows: (ANSCOMBE[0]?.x ?? []).map((_, k) => [
          String(k + 1),
          String(ANSCOMBE[0]?.x[k] ?? ''),
          String(ANSCOMBE[0]?.y[k] ?? ''),
          String(ANSCOMBE[1]?.y[k] ?? ''),
          String(ANSCOMBE[2]?.y[k] ?? ''),
          String(ANSCOMBE[3]?.x[k] ?? ''),
          String(ANSCOMBE[3]?.y[k] ?? ''),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      {view === 'cuarteto' ? (
        <>
          <ChartSvg
            label={description}
            aspect={0.75}
            minHeight={340}
            maxHeight={560}
            margins={{ top: 8, right: 12, bottom: 40, left: 44 }}
          >
            {(box) => {
              const w = (box.inner.width - PANEL_GAP - 30) / 2;
              const h = (box.inner.height - PANEL_GAP - 30) / 2;
              return (
                <g>
                  {ANSCOMBE.map((d, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    return panel(
                      i,
                      box.inner.left + col * (w + PANEL_GAP + 30),
                      box.inner.top + row * (h + PANEL_GAP + 30),
                      w,
                      h,
                      d.y,
                      all[i] as Stats,
                      stage > i,
                      stage >= 5,
                      stage >= 6,
                      false,
                    );
                  })}
                </g>
              );
            }}
          </ChartSvg>
          {
            <table className={styles.table}>
              <caption>Resumen numérico de cada conjunto</caption>
              <thead>
                <tr>
                  <th scope="col">Conjunto</th>
                  <th scope="col">Media de x</th>
                  <th scope="col">Varianza de x</th>
                  <th scope="col">Media de y</th>
                  <th scope="col">Varianza de y</th>
                  <th scope="col">r</th>
                  <th scope="col">Recta</th>
                </tr>
              </thead>
              <tbody>
                {all.map((s, i) => (
                  <tr key={i}>
                    <th scope="row">{SET_NAMES[i]}</th>
                    <td>{formatNumber(s.mx, 2)}</td>
                    <td>{formatNumber(s.vx, 2)}</td>
                    <td>{formatNumber(s.my, 2)}</td>
                    <td>{formatNumber(s.vy, 2)}</td>
                    <td>{formatNumber(s.r, 3)}</td>
                    <td>
                      {formatNumber(s.a, 2)} + {formatNumber(s.b, 3)} x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </>
      ) : (
        <>
          <ChartSvg
            label={description}
            aspect={0.6}
            minHeight={260}
            maxHeight={400}
            margins={{ top: 8, right: 16, bottom: 40, left: 44 }}
          >
            {(box) =>
              panel(
                chosen,
                box.inner.left,
                box.inner.top,
                box.inner.width,
                box.inner.height,
                moved,
                live,
                true,
                true,
                true,
                true,
              )
            }
          </ChartSvg>
          <ChartSvg
            label={`Residuos del conjunto ${SET_NAMES[chosen]} frente a x.`}
            aspect={0.28}
            minHeight={140}
            maxHeight={200}
            margins={{ top: 8, right: 16, bottom: 40, left: 44 }}
          >
            {(box) => {
              const x = scaleLinear()
                .domain(X_DOMAIN)
                .range([box.inner.left, box.inner.left + box.inner.width]);
              const y = scaleLinear()
                .domain(RESIDUAL_DOMAIN)
                .range([box.inner.top + box.inner.height, box.inner.top]);
              return (
                <g>
                  <Axis
                    scale={y}
                    orientation="left"
                    position={box.inner.left}
                    gridLength={box.inner.width}
                    ticks={4}
                    label="residuo"
                  />
                  <Axis
                    scale={x}
                    orientation="bottom"
                    position={box.inner.top + box.inner.height}
                    ticks={5}
                    label="x"
                  />
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(0)}
                    y2={y(0)}
                    stroke={DATA_COLORS.text}
                    strokeWidth={1.5}
                  />
                  <g aria-hidden="true">
                    {chosenX.map((xv, k) => (
                      <circle
                        key={k}
                        cx={x(xv)}
                        cy={y(
                          Math.max(
                            RESIDUAL_DOMAIN[0],
                            Math.min(RESIDUAL_DOMAIN[1], live.residuals[k] ?? 0),
                          ),
                        )}
                        r={DOT}
                        fill={DATA_COLORS.secondary}
                      />
                    ))}
                  </g>
                </g>
              );
            }}
          </ChartSvg>
          <p className={styles.caption}>
            Conjunto {SET_NAMES[chosen]}: {SET_STORIES[chosen]}. Los puntos se arrastran en
            vertical.
          </p>
        </>
      )}
    </VizFrame>
  );
}
