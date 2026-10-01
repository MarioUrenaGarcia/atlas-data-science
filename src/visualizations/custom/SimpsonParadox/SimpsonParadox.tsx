import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatPercent } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { VisualizationProps } from '../../types.ts';
import styles from './SimpsonParadox.module.css';
import type { SimpsonParadoxConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.5;
const LAST_STAGE = 3;

const pct = (value: number) => formatPercent(value, 1);
// In LaTeX a bare percent sign starts a comment.
const pctTex = (value: number) => pct(value).replace(' %', '\\,\\%');

/**
 * Simpson's paradox with two treatments and two subgroups. The bars compare
 * success rates inside each subgroup and overall; the Baker-Kramer diagram
 * shows each treatment as a segment between its two subgroup rates, with
 * the overall rate as a point placed at the treatment's share of the harder
 * subgroup. Moving those shares moves the points and can reverse the order.
 */
export default function SimpsonParadox({ params, title }: VisualizationProps) {
  const config = params as unknown as SimpsonParadoxConfig;
  const groupA = config.subgrupos[0] ?? '';
  const groupB = config.subgrupos[1] ?? '';
  const treatments = config.tratamientos;
  const rates = treatments.map((t) => t.datos.map((cell) => cell.exitos / cell.total));
  const dataShares = treatments.map((t) => {
    const total = t.datos.reduce((sum, cell) => sum + cell.total, 0);
    return (t.datos[1]?.total ?? 0) / total;
  });
  const definitions = useMemo(
    () =>
      treatments.map((t, i) => ({
        type: 'number' as const,
        key: `mezcla${i}`,
        label: `Proporción de ${groupB} en ${t.nombre}`,
        min: 0,
        max: 1,
        step: 0.001,
        digits: 3,
        default: Number((dataShares[i] ?? 0.5).toFixed(3)),
      })),
    // Shares derive from the fixed data of the figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const shares = treatments.map((_, i) => values[`mezcla${i}`] ?? 0.5);
  const overall = rates.map(
    (r, i) => (1 - (shares[i] ?? 0)) * (r[0] ?? 0) + (shares[i] ?? 0) * (r[1] ?? 0),
  );

  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });

  const [t1, t2] = treatments;
  const name = (t?: { nombre: string }) => `\\text{${t?.nombre ?? ''}}`;
  const fr = (cell?: { exitos: number; total: number }) =>
    `\\tfrac{${cell?.exitos ?? 0}}{${cell?.total ?? 1}}`;
  const headers = [
    `\\text{Tasa de éxito por tratamiento y subgrupo}`,
    `\\text{${groupA}: } ${name(t1)}\\; ${fr(t1?.datos[0])} = ${pctTex(rates[0]?.[0] ?? 0)} \\quad ${name(t2)}\\; ${fr(t2?.datos[0])} = ${pctTex(rates[1]?.[0] ?? 0)}`,
    `\\text{${groupB}: } ${name(t1)}\\; ${fr(t1?.datos[1])} = ${pctTex(rates[0]?.[1] ?? 0)} \\quad ${name(t2)}\\; ${fr(t2?.datos[1])} = ${pctTex(rates[1]?.[1] ?? 0)}`,
    `\\text{Global: } ${name(t1)}\\; ${pctTex(overall[0] ?? 0)} \\quad ${name(t2)}\\; ${pctTex(overall[1] ?? 0)}`,
  ];
  const better = (a: number, b: number) => (a > b ? 0 : 1);
  const winners = [
    better(rates[0]?.[0] ?? 0, rates[1]?.[0] ?? 0),
    better(rates[0]?.[1] ?? 0, rates[1]?.[1] ?? 0),
    better(overall[0] ?? 0, overall[1] ?? 0),
  ];
  const reversal = winners[0] === winners[1] && winners[2] !== winners[0];
  const description =
    `${groupA}: ${t1?.nombre} ${pct(rates[0]?.[0] ?? 0)}, ${t2?.nombre} ${pct(rates[1]?.[0] ?? 0)}. ` +
    `${groupB}: ${t1?.nombre} ${pct(rates[0]?.[1] ?? 0)}, ${t2?.nombre} ${pct(rates[1]?.[1] ?? 0)}. ` +
    `Global con las proporciones actuales: ${t1?.nombre} ${pct(overall[0] ?? 0)}, ${t2?.nombre} ${pct(overall[1] ?? 0)}. ` +
    (reversal
      ? 'El orden global se invierte respecto al de los subgrupos.'
      : 'El orden global coincide con el de los subgrupos.');
  const columns = [groupA, groupB, 'Global'];
  const visibleColumns = stage === 0 ? 3 : Math.min(3, stage);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        ...treatments.map((t, i) => ({
          label: `${t.nombre}, global`,
          value: pct(overall[i] ?? 0),
          color: seriesColor(i),
        })),
        ...treatments.map((t, i) => ({
          label: `${t.nombre}, proporción de ${groupB}`,
          value: pct(shares[i] ?? 0),
        })),
        { label: 'Inversión de Simpson', value: reversal ? 'sí' : 'no' },
      ]}
      legend={treatments.map((t, i) => ({ label: t.nombre, color: seriesColor(i) }))}
      description={description}
      dataTable={{
        caption: config.exito ? `Éxitos (${config.exito}) entre casos` : 'Éxitos entre casos',
        columns: ['Tratamiento', groupA, groupB, 'Total'],
        rows: treatments.map((t) => {
          const exitos = t.datos.reduce((sum, cell) => sum + cell.exitos, 0);
          const total = t.datos.reduce((sum, cell) => sum + cell.total, 0);
          return [
            t.nombre,
            ...t.datos.map((cell) => `${cell.exitos}/${cell.total}`),
            `${exitos}/${total}`,
          ];
        }),
      }}
    >
      <FormulaLine tex={headers[stage] ?? ''} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.8} minHeight={240} maxHeight={320}>
          {(box) => {
            const slot = box.inner.width / columns.length;
            const values3 = [rates.map((r) => r[0] ?? 0), rates.map((r) => r[1] ?? 0), overall];
            const lowest = Math.min(...values3.flat());
            const y = scaleLinear()
              .domain([Math.max(0, Math.floor(lowest * 10) / 10 - 0.1), 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="tasa de éxito"
                  format={(v) => `${Math.round(v * 100)} %`}
                />
                <g aria-hidden="true">
                  {columns.map((column, c) => {
                    const active = stage === 0 || c === stage - 1;
                    return (
                      <g
                        key={column}
                        opacity={c < visibleColumns || stage === 0 ? (active ? 1 : 0.45) : 0.12}
                      >
                        {treatments.map((t, i) => {
                          const value = values3[c]?.[i] ?? 0;
                          const x = box.inner.left + c * slot + slot * (0.15 + i * 0.36);
                          return (
                            <g key={t.nombre}>
                              <rect
                                x={x}
                                y={y(value)}
                                width={slot * 0.32}
                                height={box.inner.top + box.inner.height - y(value)}
                                fill={seriesColor(i)}
                                fillOpacity={0.8}
                                stroke={winners[c] === i ? DATA_COLORS.text : 'none'}
                                strokeWidth={2}
                              />
                              <text
                                x={x + slot * 0.16}
                                y={y(value) - 5}
                                textAnchor="middle"
                                className={svgStyles.label}
                                style={{ fontSize: 11 }}
                              >
                                {Math.round(value * 100)}
                              </text>
                            </g>
                          );
                        })}
                        {/* Long subgroup names wrap after the first word to fit the column. */}
                        {[column.split(' ')[0] ?? '', column.split(' ').slice(1).join(' ')].map(
                          (line, row) => (
                            <text
                              key={row}
                              x={box.inner.left + (c + 0.5) * slot}
                              y={box.inner.top + box.inner.height + 15 + row * 13}
                              textAnchor="middle"
                              className={svgStyles.label}
                            >
                              {line}
                            </text>
                          ),
                        )}
                      </g>
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.8} minHeight={240} maxHeight={320}>
          {(box) => {
            const x = scaleLinear()
              .domain([0, 1])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const lowest = Math.min(...rates.flat());
            const y = scaleLinear()
              .domain([Math.max(0, Math.floor(lowest * 10) / 10 - 0.1), 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="tasa de éxito"
                  format={(v) => `${Math.round(v * 100)} %`}
                />
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label={`proporción de ${groupB}`}
                  format={(v) => `${Math.round(v * 100)} %`}
                />
                <g aria-hidden="true">
                  {treatments.map((t, i) => {
                    const r = rates[i] ?? [0, 0];
                    const share = shares[i] ?? 0;
                    return (
                      <g key={t.nombre}>
                        <line
                          x1={x(0)}
                          y1={y(r[0] ?? 0)}
                          x2={x(1)}
                          y2={y(r[1] ?? 0)}
                          stroke={seriesColor(i)}
                          strokeWidth={2.5}
                        />
                        {stage >= 3 || stage === 0 ? (
                          <>
                            <line
                              x1={x(share)}
                              x2={x(share)}
                              y1={y(overall[i] ?? 0)}
                              y2={box.inner.top + box.inner.height}
                              stroke={seriesColor(i)}
                              strokeDasharray="3 3"
                            />
                            <circle
                              cx={x(share)}
                              cy={y(overall[i] ?? 0)}
                              r={7}
                              fill={seriesColor(i)}
                              stroke="var(--color-surface)"
                              strokeWidth={2}
                            />
                          </>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        A la derecha, cada tratamiento es un segmento que va de su tasa en {groupA} (izquierda) a su
        tasa en {groupB} (derecha). La tasa global es el punto del segmento situado en la proporción
        de casos de {groupB} que recibió ese tratamiento.
      </p>
    </VizFrame>
  );
}
