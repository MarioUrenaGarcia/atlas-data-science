import { scaleBand } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { correlationMatrix } from '../../../lib/stats/association.ts';
import { pearson } from '../../../lib/stats/index.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './EdaWorkflow.module.css';
import { cleanRows, type NumericVariable, VARIABLE_NAMES, ZONES } from './homes.ts';
import { ScatterPanel } from './marks.tsx';

type MultiView = 'color' | 'paneles' | 'correlaciones';

const BATCHES = 20;
const BATCHES_PER_SECOND = 6;
const PANEL_GAP = 16;
const NUMERIC: NumericVariable[] = ['superficie', 'habitaciones', 'antiguedad', 'precio'];
const SHORT: Record<NumericVariable, string> = {
  superficie: 'Superficie',
  habitaciones: 'Habitaciones',
  antiguedad: 'Antigüedad',
  precio: 'Precio',
};

const NAMES: Record<MultiView, string> = {
  color: 'Tercera variable como color',
  paneles: 'Un panel por zona',
  correlaciones: 'Matriz de correlaciones',
};

const rows = cleanRows();
const zoneOf = (z: string) => ZONES.indexOf(z as (typeof ZONES)[number]);
const logR = (zone?: string) => {
  const g = zone ? rows.filter((h) => h.zona === zone) : rows;
  return pearson(
    g.map((h) => Math.log(h.superficie)),
    g.map((h) => Math.log(h.precio)),
  );
};

/**
 * Three or more variables at once: a third variable as color, small
 * multiples conditioned on the zone, and the correlation matrix of the
 * numeric variables on complete cases.
 */
export function MultivariateView({ title, view: v0 }: { title: string; view: MultiView }) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'vista',
        label: 'Vista',
        options: (Object.keys(NAMES) as MultiView[]).map((value) => ({
          value,
          label: NAMES[value],
        })),
        default: v0,
      },
    ],
    [v0],
  );
  const parameters = useParameters(definitions);
  const view = String(parameters.values.vista) as MultiView;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(`${view}|${run}`, () =>
    reducedMotion ? BATCHES : 1,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(BATCHES, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: BATCHES_PER_SECOND,
    done: shown >= BATCHES,
  });
  const visible = rows.slice(0, Math.round((rows.length * shown) / BATCHES));
  const complete = visible.filter((h) => h.antiguedad !== null);
  const matrix = useMemo(
    () =>
      complete.length > 3
        ? correlationMatrix(NUMERIC.map((v) => complete.map((h) => h[v] as number)))
        : null,
    [complete],
  );
  const allPoints = rows.map((h) => ({ x: h.superficie, y: h.precio }));
  const f = (x: number) => formatNumber(x, 3);
  const header =
    view === 'correlaciones'
      ? `n = ${complete.length}\\ \\text{casos completos}`
      : `r_{\\log}(\\text{todas}) = ${f(logR())},\\quad ` +
        ZONES.map((z) => `r_{\\text{${z}}} = ${f(logR(z))}`).join(',\\ ');
  const description =
    view === 'correlaciones'
      ? `Matriz de correlaciones de ${NUMERIC.length} variables numéricas en ${complete.length} casos completos.`
      : `${NAMES[view]}: superficie y precio de ${visible.length} viviendas en escalas logarítmicas. Correlación de los logaritmos ${f(logR())} con todas las zonas juntas; dentro de cada zona ${ZONES.map((z) => `${z} ${f(logR(z))}`).join(', ')}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Viviendas mostradas', value: `${visible.length} de ${rows.length}` },
        { label: 'r de los logaritmos, todas', value: f(logR()) },
        ...ZONES.map((z, i) => ({
          label: `r de los logaritmos, ${z}`,
          value: f(logR(z)),
          color: seriesColor(i),
        })),
      ]}
      legend={
        view === 'correlaciones'
          ? [
              { label: 'Correlación positiva', color: DATA_COLORS.primary },
              { label: 'Correlación negativa', color: DATA_COLORS.secondary },
            ]
          : ZONES.map((z, i) => ({ label: z, color: seriesColor(i), shape: 'circle' as const }))
      }
      description={description}
    >
      <FormulaLine tex={header} />
      <ChartSvg
        label={description}
        aspect={view === 'paneles' ? 0.45 : 0.6}
        minHeight={260}
        maxHeight={420}
        margins={{ top: 12, right: 16, bottom: 46, left: view === 'correlaciones' ? 96 : 56 }}
      >
        {(box) => {
          if (view === 'color') {
            const pts = visible.map((h) => ({
              x: h.superficie,
              y: h.precio,
              color: seriesColor(zoneOf(h.zona)),
            }));
            return (
              <ScatterPanel
                box={box}
                points={pts}
                extentOf={allPoints}
                xLabel="Superficie (m², escala log)"
                yLabel="Precio (millones, escala log)"
                log
              />
            );
          }
          if (view === 'paneles') {
            const w = (box.inner.width - PANEL_GAP * (ZONES.length - 1)) / ZONES.length;
            return (
              <g>
                {ZONES.map((z, i) => {
                  const left = box.inner.left + i * (w + PANEL_GAP);
                  const sub = { ...box, inner: { ...box.inner, left, width: w } };
                  const pts = visible
                    .filter((h) => h.zona === z)
                    .map((h) => ({ x: h.superficie, y: h.precio, color: seriesColor(i) }));
                  return (
                    <g key={z}>
                      <text
                        x={left + w / 2}
                        y={box.inner.top + 4}
                        textAnchor="middle"
                        className={styles.chartLabel}
                      >
                        {z}
                      </text>
                      <ScatterPanel
                        box={sub}
                        points={pts}
                        extentOf={allPoints}
                        xLabel="Superficie"
                        yLabel={i === 0 ? 'Precio' : ''}
                        log
                        radius={2.5}
                      />
                    </g>
                  );
                })}
              </g>
            );
          }
          const x = scaleBand<string>()
            .domain(NUMERIC)
            .range([box.inner.left, box.inner.left + box.inner.width])
            .padding(0.04);
          const y = scaleBand<string>()
            .domain(NUMERIC)
            .range([box.inner.top, box.inner.top + box.inner.height])
            .padding(0.04);
          return (
            <g>
              {NUMERIC.map((v) => (
                <g key={v}>
                  <text
                    x={(x(v) ?? 0) + x.bandwidth() / 2}
                    y={box.inner.top + box.inner.height + 18}
                    textAnchor="middle"
                    className={styles.chartLabel}
                  >
                    {SHORT[v]}
                  </text>
                  <text
                    x={box.inner.left - 8}
                    y={(y(v) ?? 0) + y.bandwidth() / 2}
                    dy="0.32em"
                    textAnchor="end"
                    className={styles.chartLabel}
                  >
                    {SHORT[v]}
                  </text>
                </g>
              ))}
              {matrix &&
                NUMERIC.map((a, i) =>
                  NUMERIC.map((b, j) => {
                    const r = matrix[i]?.[j] ?? 0;
                    return (
                      <g key={`${a}-${b}`}>
                        <rect
                          x={x(b)}
                          y={y(a)}
                          width={x.bandwidth()}
                          height={y.bandwidth()}
                          fill={r >= 0 ? DATA_COLORS.primary : DATA_COLORS.secondary}
                          fillOpacity={0.08 + 0.8 * Math.abs(r)}
                          aria-hidden="true"
                        />
                        <text
                          x={(x(b) ?? 0) + x.bandwidth() / 2}
                          y={(y(a) ?? 0) + y.bandwidth() / 2}
                          dy="0.32em"
                          textAnchor="middle"
                          className={styles.cellLabel}
                          fill={Math.abs(r) > 0.55 ? 'var(--color-surface)' : 'var(--color-text)'}
                        >
                          {formatNumber(r, 2)}
                        </text>
                      </g>
                    );
                  }),
                )}
            </g>
          );
        }}
      </ChartSvg>
      {view !== 'correlaciones' && (
        <p className={styles.caption}>
          {VARIABLE_NAMES.zona} como tercera variable; se excluyen los dos errores de captura.
        </p>
      )}
    </VizFrame>
  );
}
