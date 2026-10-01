import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { contingencySummary } from '../../../lib/stats/association.ts';
import { seriesColor } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';

type Focus = 'tabla' | 'phi' | 'cramer' | 'informacion';
type Percent = 'conteos' | 'fila' | 'columna' | 'total';

const CELLS_PER_SECOND = 1;
const BAR_HEIGHT = 30;
const BAR_GAP = 12;
const LABEL_WIDTH = 120;

interface ContingencyViewProps {
  title: string;
  focus: Focus;
  rows: { nombre: string; categorias: readonly string[] };
  columns: { nombre: string; categorias: readonly string[] };
  counts: readonly (readonly number[])[];
}

/**
 * A two-way frequency table with the association measure computed cell by
 * cell: percentages, expected counts under independence, chi-square terms
 * or mutual information terms. The bars show each row as percentages of its
 * total; with no association all rows would look alike.
 */
export function ContingencyView({ title, focus, rows, columns, counts }: ContingencyViewProps) {
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'select',
        key: 'porcentaje',
        label: 'Valores de la tabla',
        options: [
          { value: 'conteos', label: 'Conteos' },
          { value: 'fila', label: 'Porcentaje por fila' },
          { value: 'columna', label: 'Porcentaje por columna' },
          { value: 'total', label: 'Porcentaje del total' },
        ],
        default: focus === 'tabla' ? 'fila' : 'conteos',
      },
    ],
    [focus],
  );
  const parameters = useParameters(definitions);
  const percent = String(parameters.values.porcentaje) as Percent;
  const summary = contingencySummary(counts);
  const r = counts.length;
  const c = counts[0]?.length ?? 0;
  const cells: [number, number][] = [];
  for (let i = 0; i < r; i += 1) for (let j = 0; j < c; j += 1) cells.push([i, j]);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(reducedMotion ? cells.length : 0);
  const playback = usePlayback({
    step: () => setStep((value) => Math.min(cells.length, value + 1)),
    reset: () => setStep(0),
    rate: CELLS_PER_SECOND,
    done: step >= cells.length,
  });
  const n = summary.total;
  const [ai, aj] = step > 0 ? (cells[step - 1] ?? [0, 0]) : [-1, -1];
  const observed = (i: number, j: number) => counts[i]?.[j] ?? 0;
  const expected = (i: number, j: number) => summary.expected[i]?.[j] ?? 0;
  const chiTerm = (i: number, j: number) => (observed(i, j) - expected(i, j)) ** 2 / expected(i, j);
  const miTerm = (i: number, j: number) =>
    observed(i, j) > 0 ? (observed(i, j) / n) * Math.log(observed(i, j) / expected(i, j)) : 0;
  const done = cells.slice(0, step);
  const partialChi = done.reduce((t, [i, j]) => t + chiTerm(i, j), 0);
  const partialMi = done.reduce((t, [i, j]) => t + miTerm(i, j), 0);
  const g = (v: number) => formatNumber(v, 3);
  const shown = (i: number, j: number) => {
    const o = observed(i, j);
    if (percent === 'conteos') return String(o);
    const base =
      percent === 'fila'
        ? (summary.rowTotals[i] ?? 1)
        : percent === 'columna'
          ? (summary.columnTotals[j] ?? 1)
          : n;
    return `${formatNumber((100 * o) / base, 1)} %`;
  };

  let header: string;
  const rowName = (i: number) => rows.categorias[i] ?? '';
  const colName = (j: number) => columns.categorias[j] ?? '';
  if (ai < 0) {
    header = `n = ${n}\\ \\text{observaciones en una tabla de } ${r} \\times ${c}`;
  } else if (focus === 'tabla') {
    header =
      percent === 'columna'
        ? `\\frac{n_{${ai + 1}${aj + 1}}}{n_{\\cdot ${aj + 1}}} = \\frac{${observed(ai, aj)}}{${summary.columnTotals[aj]}} = ${g(observed(ai, aj) / (summary.columnTotals[aj] ?? 1))}`
        : `\\frac{n_{${ai + 1}${aj + 1}}}{n_{${ai + 1}\\cdot}} = \\frac{${observed(ai, aj)}}{${summary.rowTotals[ai]}} = ${g(observed(ai, aj) / (summary.rowTotals[ai] ?? 1))}\\quad\\text{(${rowName(ai)}, ${colName(aj)})}`;
  } else if (focus === 'phi' && r === 2 && c === 2) {
    const [a, b, cc, d] = [observed(0, 0), observed(0, 1), observed(1, 0), observed(1, 1)];
    header =
      step < cells.length
        ? `E_{${ai + 1}${aj + 1}} = \\frac{${summary.rowTotals[ai]} \\cdot ${summary.columnTotals[aj]}}{${n}} = ${g(expected(ai, aj))},\\quad O = ${observed(ai, aj)}`
        : `\\phi = \\frac{ad - bc}{\\sqrt{(a+b)(c+d)(a+c)(b+d)}} = \\frac{${a} \\cdot ${d} - ${b} \\cdot ${cc}}{\\sqrt{${a + b} \\cdot ${cc + d} \\cdot ${a + cc} \\cdot ${b + d}}} = ${g(summary.phi)}`;
  } else if (focus === 'informacion') {
    header =
      step < cells.length
        ? `\\hat{I} \\mathrel{+}= \\frac{${observed(ai, aj)}}{${n}}\\log\\frac{${observed(ai, aj)}}{${g(expected(ai, aj))}} = ${g(miTerm(ai, aj))};\\quad \\text{acumulado } ${g(partialMi)}`
        : `\\hat{I}(X;Y) = \\sum_{i,j} \\hat{p}_{ij}\\log\\frac{\\hat{p}_{ij}}{\\hat{p}_{i\\cdot}\\,\\hat{p}_{\\cdot j}} = ${g(summary.mutualInformation)}\\ \\text{nats} = ${g(summary.mutualInformation / Math.LN2)}\\ \\text{bits}`;
  } else {
    header =
      step < cells.length
        ? `\\frac{(O - E)^2}{E} = \\frac{(${observed(ai, aj)} - ${g(expected(ai, aj))})^2}{${g(expected(ai, aj))}} = ${g(chiTerm(ai, aj))};\\quad \\chi^2 \\text{ acumulado} = ${g(partialChi)}`
        : `V = \\sqrt{\\frac{\\chi^2}{n\\,(k - 1)}} = \\sqrt{\\frac{${g(summary.chiSquare)}}{${n} \\cdot ${Math.min(r, c) - 1}}} = ${g(summary.cramersV)}`;
  }

  const description =
    `Tabla de ${rows.nombre} por ${columns.nombre} con ${n} observaciones. ` +
    `Chi cuadrada ${g(summary.chiSquare)}, ${r === 2 && c === 2 ? `phi ${g(summary.phi)}, ` : ''}V de Cramér ${g(summary.cramersV)}, información mutua ${g(summary.mutualInformation)} nats.`;

  return (
    <VizFrame
      title={title}
      graphic="svg"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Observaciones', value: String(n) },
        { label: 'Chi cuadrada', value: g(summary.chiSquare) },
        ...(r === 2 && c === 2 ? [{ label: 'Coeficiente phi', value: g(summary.phi) }] : []),
        { label: 'V de Cramér', value: g(summary.cramersV) },
        { label: 'Información mutua', value: `${g(summary.mutualInformation)} nats` },
      ]}
      legend={columns.categorias.map((category, j) => ({
        label: `${columns.nombre}: ${category}`,
        color: seriesColor(j),
      }))}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <div className={styles.stack}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Tabla de contingencia"
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{`${rows.nombre} / ${columns.nombre}`}</th>
                {columns.categorias.map((category) => (
                  <th key={category} scope="col">
                    {category}
                  </th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.categorias.map((category, i) => (
                <tr key={category}>
                  <th scope="row">{category}</th>
                  {columns.categorias.map((col, j) => (
                    <td key={col} className={i === ai && j === aj ? styles.cellActive : undefined}>
                      {shown(i, j)}
                      {focus !== 'tabla' &&
                        step > cells.findIndex(([u, v]) => u === i && v === j) && (
                          <span className={styles.expected}>
                            esperado {formatNumber(expected(i, j), 1)}
                          </span>
                        )}
                    </td>
                  ))}
                  <td>{summary.rowTotals[i]}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Total</th>
                {summary.columnTotals.map((total, j) => (
                  <td key={j}>{total}</td>
                ))}
                <td>{n}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ChartSvg
          label={description}
          aspect={0.6}
          minHeight={(r + 1) * (BAR_HEIGHT + BAR_GAP) + 30}
          maxHeight={(r + 1) * (BAR_HEIGHT + BAR_GAP) + 60}
          margins={{ top: 10, right: 16, bottom: 20, left: LABEL_WIDTH }}
        >
          {(box) => {
            const bars = [
              ...rows.categorias.map((category, i) => ({
                label: category,
                values: counts[i] ?? [],
                total: summary.rowTotals[i] ?? 1,
              })),
              { label: 'Todos', values: summary.columnTotals, total: n },
            ];
            return (
              <g>
                {bars.map((bar, k) => {
                  let offset = 0;
                  const y = box.inner.top + k * (BAR_HEIGHT + BAR_GAP);
                  return (
                    <g key={bar.label}>
                      <text
                        x={box.inner.left - 8}
                        y={y + BAR_HEIGHT / 2}
                        dy="0.32em"
                        textAnchor="end"
                        className={styles.chartLabel}
                      >
                        {bar.label}
                      </text>
                      {bar.values.map((value, j) => {
                        const width = (box.inner.width * value) / bar.total;
                        const x = box.inner.left + offset;
                        offset += width;
                        return (
                          <rect
                            key={j}
                            x={x}
                            y={y}
                            width={Math.max(0, width - 1)}
                            height={BAR_HEIGHT}
                            fill={seriesColor(j)}
                            fillOpacity={k === bars.length - 1 ? 0.5 : 0.85}
                            aria-hidden="true"
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        Cada barra reparte una fila en porcentajes de {columns.nombre.toLowerCase()}; sin
        asociación, todas se parecerían a la barra de todos.
      </p>
    </VizFrame>
  );
}
