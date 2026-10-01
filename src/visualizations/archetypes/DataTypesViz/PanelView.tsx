import { scaleLinear, scalePoint } from 'd3-scale';
import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataTypesViz.module.css';

type PanelLayout = 'transversal' | 'longitudinal' | 'panel';

const STEPS_PER_SECOND = 0.8;
const POINT_RADIUS = 4;
const LINE_WIDTH = 2.5;

const LAYOUT_NAMES: Record<PanelLayout, string> = {
  transversal: 'Transversal: todas las unidades en un periodo',
  longitudinal: 'Longitudinal: una unidad en todos los periodos',
  panel: 'Panel: todas las unidades en todos los periodos',
};

interface PanelViewProps {
  title: string;
  units: readonly string[];
  periods: readonly string[];
  variable: string;
  values: readonly (readonly number[])[];
  layout: PanelLayout;
  missing: readonly [number, number][];
}

/**
 * A units by periods table. A cross section is one column, a longitudinal
 * record is one row and a panel is the whole table; the chart shows the
 * slice being read.
 */
export function PanelView({
  title,
  units,
  periods,
  variable,
  values,
  layout,
  missing,
}: PanelViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'vista',
      label: 'Tipo de datos',
      options: (Object.keys(LAYOUT_NAMES) as PanelLayout[]).map((value) => ({
        value,
        label: LAYOUT_NAMES[value],
      })),
      default: layout,
    },
  ];
  const parameters = useParameters(definitions);
  const view = String(parameters.values.vista) as PanelLayout;
  const [cursor, setCursor] = useState(0);
  const length = view === 'transversal' ? periods.length : units.length;
  const playback = usePlayback({
    step: () =>
      setCursor((value) => (view === 'panel' ? Math.min(length, value + 1) : (value + 1) % length)),
    reset: () => setCursor(0),
    rate: STEPS_PER_SECOND,
    done: view === 'panel' && cursor >= length,
  });
  const index = Math.min(cursor, length - 1);
  const isMissing = (unit: number, period: number) =>
    missing.some(([u, p]) => u === unit && p === period);
  const inSlice = (unit: number, period: number) =>
    view === 'transversal'
      ? period === index
      : view === 'longitudinal'
        ? unit === index
        : unit < cursor;
  const observed = values.flatMap((row, u) => row.filter((_, p) => !isMissing(u, p)));
  const lo = Math.min(...observed);
  const hi = Math.max(...observed);
  const pad = (hi - lo) * 0.1 || 1;
  const sliceCount = values.reduce(
    (total, row, u) => total + row.filter((_, p) => inSlice(u, p) && !isMissing(u, p)).length,
    0,
  );
  const balanced = missing.length === 0;
  const description =
    view === 'transversal'
      ? `Corte transversal del periodo ${periods[index]}: ${units.length} unidades observadas una vez.`
      : view === 'longitudinal'
        ? `Registro longitudinal de ${units[index]}: ${periods.length} periodos de la misma unidad.`
        : `Panel con ${Math.min(cursor, units.length)} de ${units.length} unidades seguidas durante ${periods.length} periodos` +
          (balanced
            ? '; el panel está balanceado.'
            : `; faltan ${missing.length} celdas, el panel no está balanceado.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Unidades', value: String(units.length) },
        { label: 'Periodos', value: String(periods.length) },
        { label: 'Observaciones en la selección', value: String(sliceCount) },
        { label: 'Panel balanceado', value: balanced ? 'sí' : `no (${missing.length} faltantes)` },
      ]}
      description={description}
      dataTable={{
        caption: `${variable} por unidad y periodo`,
        columns: ['Unidad', ...periods],
        rows: units.map((unit, u) => [
          unit,
          ...periods.map((_, p) =>
            isMissing(u, p) ? 'faltante' : formatNumber(values[u]?.[p] ?? 0, 2),
          ),
        ]),
      }}
    >
      <p className={styles.stage}>{LAYOUT_NAMES[view]}</p>
      <div className={styles.stack}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label={`Tabla de ${variable}`}
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Unidad</th>
                {periods.map((period) => (
                  <th key={period} scope="col">
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((unit, u) => (
                <tr key={unit}>
                  <th scope="row">{unit}</th>
                  {periods.map((period, p) => (
                    <td
                      key={period}
                      className={[
                        inSlice(u, p) ? styles.cellHighlight : '',
                        isMissing(u, p) ? styles.cellMissing : '',
                      ].join(' ')}
                    >
                      {isMissing(u, p) ? 'falta' : formatNumber(values[u]?.[p] ?? 0, 1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ChartSvg
          label={description}
          aspect={0.42}
          minHeight={220}
          maxHeight={320}
          margins={{ top: 16, right: 16, bottom: 44, left: 52 }}
        >
          {(box) => {
            const categories = view === 'transversal' ? units : periods;
            const x = scalePoint<string>()
              .domain([...categories])
              .range([box.inner.left, box.inner.left + box.inner.width])
              .padding(0.4);
            const y = scaleLinear()
              // Bars must start at zero to keep lengths proportional to the values.
              .domain(view === 'transversal' ? [Math.min(0, lo), hi + pad] : [lo - pad, hi + pad])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const series =
              view === 'transversal'
                ? [
                    {
                      key: 'corte',
                      color: DATA_COLORS.highlight,
                      points: units.map((unit, u) => ({
                        c: unit,
                        v: values[u]?.[index],
                        miss: isMissing(u, index),
                      })),
                    },
                  ]
                : units
                    .map((_, u) => u)
                    .filter((u) => (view === 'longitudinal' ? u === index : u < cursor))
                    .map((u) => ({
                      key: String(u),
                      color: view === 'longitudinal' ? DATA_COLORS.highlight : seriesColor(u),
                      points: periods.map((period, p) => ({
                        c: period,
                        v: values[u]?.[p],
                        miss: isMissing(u, p),
                      })),
                    }));
            return (
              <g>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label={variable}
                />
                <g aria-hidden="true">
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={box.inner.top + box.inner.height}
                    y2={box.inner.top + box.inner.height}
                    stroke={DATA_COLORS.muted}
                  />
                  {categories.map((c) => (
                    <text
                      key={c}
                      x={x(c) ?? 0}
                      y={box.inner.top + box.inner.height + 16}
                      textAnchor="middle"
                      className={styles.chartLabel}
                    >
                      {c}
                    </text>
                  ))}
                </g>
                {series.map((s) => {
                  const pts = s.points.filter((point) => !point.miss && point.v !== undefined);
                  return (
                    <g key={s.key}>
                      {view !== 'transversal' &&
                        s.points.slice(1).map((point, i) => {
                          const previous = s.points[i];
                          // A missing period breaks the line instead of joining its neighbors.
                          if (!previous || previous.miss || point.miss) return null;
                          return (
                            <line
                              key={point.c}
                              x1={x(previous.c) ?? 0}
                              y1={y(previous.v ?? 0)}
                              x2={x(point.c) ?? 0}
                              y2={y(point.v ?? 0)}
                              stroke={s.color}
                              strokeWidth={LINE_WIDTH}
                            />
                          );
                        })}
                      {pts.map((point) =>
                        view === 'transversal' ? (
                          <rect
                            key={point.c}
                            x={(x(point.c) ?? 0) - x.step() * 0.3}
                            y={y(point.v ?? 0)}
                            width={x.step() * 0.6}
                            height={box.inner.top + box.inner.height - y(point.v ?? 0)}
                            fill={s.color}
                            fillOpacity={0.8}
                          />
                        ) : (
                          <circle
                            key={point.c}
                            cx={x(point.c) ?? 0}
                            cy={y(point.v ?? 0)}
                            r={POINT_RADIUS}
                            fill={s.color}
                          />
                        ),
                      )}
                    </g>
                  );
                })}
              </g>
            );
          }}
        </ChartSvg>
      </div>
    </VizFrame>
  );
}
