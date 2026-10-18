import { scaleLinear, scaleLog } from 'd3-scale';
import { line } from 'd3-shape';
import { useMemo, useState } from 'react';
import { lassoPath } from '../../../lib/dataprep/selection.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { cropData } from './cropData.ts';

const POINTS = 60;
const POINTS_PER_SECOND = 8;

/**
 * Lasso selects variables while it fits: as the penalty lambda decreases,
 * coefficients leave zero one by one. The path shows the order in which
 * the variables enter and which ones remain exactly at zero.
 */
export function EmbeddedView({ title, seed: seed0 }: { title: string; seed: number }) {
  const seed = useSeed(seed0);
  const data = useMemo(() => cropData(seed.seed), [seed.seed]);
  const path = useMemo(() => lassoPath(data, POINTS), [data]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${run}`, () =>
    reducedMotion ? POINTS : 1,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(POINTS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: POINTS_PER_SECOND,
    done: shown >= POINTS,
  });
  const current = path[shown - 1] ?? path[0];
  if (!current) return null;
  const active = current.coefficients.map((c, j) => (c !== 0 ? j : -1)).filter((j) => j >= 0);
  const g = (v: number) => formatNumber(v, 3);
  const header = `\\min_{\\boldsymbol\\beta}\\ \\frac{1}{2n}\\lVert \\mathbf{y} - \\mathbf{X}\\boldsymbol\\beta \\rVert_2^2 + \\lambda \\lVert \\boldsymbol\\beta \\rVert_1,\\quad \\lambda = ${g(current.lambda)},\\ ${active.length} \\text{ coeficientes distintos de cero}`;
  const description =
    `Trayectoria de lasso. Con lambda ${g(current.lambda)} hay ${active.length} variables con coeficiente distinto de cero: ` +
    `${active.map((j) => `${data.names[j]} ${g(current.coefficients[j] ?? 0)}`).join(', ') || 'ninguna'}.`;
  const all = path.flatMap((p) => p.coefficients);

  return (
    <VizFrame
      title={title}
      playback={playback}
      seed={seed}
      readouts={[
        { label: 'Penalización λ', value: g(current.lambda) },
        {
          label: 'Variables seleccionadas',
          value: String(active.length),
          color: DATA_COLORS.highlight,
        },
        ...data.names.map((n, j) => ({
          label: n,
          value: g(current.coefficients[j] ?? 0),
          color: seriesColor(j),
        })),
      ]}
      legend={data.names.map((n, j) => ({
        label: n,
        color: seriesColor(j),
        shape: 'line' as const,
      }))}
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={0.6}
        minHeight={260}
        maxHeight={400}
        margins={{ top: 12, right: 16, bottom: 46, left: 56 }}
      >
        {(box) => {
          const { left, top, width, height } = box.inner;
          const lambdas = path.map((p) => p.lambda);
          // Lambda decreases from left to right, the direction in which variables enter.
          const x = scaleLog()
            .domain([Math.max(...lambdas), Math.min(...lambdas)])
            .range([left, left + width]);
          const y = scaleLinear()
            .domain([Math.min(0, ...all) - 0.1, Math.max(...all) + 0.1])
            .nice()
            .range([top + height, top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={left}
                gridLength={width}
                ticks={5}
                label="Coeficiente estandarizado"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={top + height}
                tickValues={[0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5].filter(
                  (v) => v >= Math.min(...lambdas) && v <= Math.max(...lambdas),
                )}
                format={(v) => formatNumber(v, 2)}
                label="Penalización λ (escala logarítmica, decreciente)"
              />
              <g aria-hidden="true">
                <line x1={left} x2={left + width} y1={y(0)} y2={y(0)} stroke={DATA_COLORS.muted} />
                {data.names.map((_, j) => {
                  const d =
                    line<(typeof path)[number]>()
                      .x((p) => x(p.lambda))
                      .y((p) => y(p.coefficients[j] ?? 0))(path.slice(0, shown)) ?? '';
                  return <path key={j} d={d} fill="none" stroke={seriesColor(j)} strokeWidth={2} />;
                })}
                <line
                  x1={x(current.lambda)}
                  x2={x(current.lambda)}
                  y1={top}
                  y2={top + height}
                  stroke={DATA_COLORS.highlight}
                  strokeDasharray="5 3"
                  strokeWidth={2}
                />
              </g>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
