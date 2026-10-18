import { useMemo, useState } from 'react';
import { correlationOnRows, listwiseRows, pairwiseRows } from '../../../lib/dataprep/missing.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Random } from '../../../lib/random/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';

const ROWS = 30;
const VARIABLES = ['Edad', 'Ingreso', 'Gasto', 'Ahorro'];
const LOADINGS = [0.6, 0.8, 0.7, 0.5];
const PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];
const STEPS_PER_SECOND = { lista: 6, pares: 0.8 };

/** Four variables driven by a common factor, with each cell deleted completely at random. */
function makeTable(rate: number, seed: number): number[][] {
  const random = new Random(seed);
  return Array.from({ length: ROWS }, () => {
    const factor = random.normal();
    return LOADINGS.map((l) => {
      const v = l * factor + Math.sqrt(1 - l * l) * random.normal();
      return random.next() < rate ? Number.NaN : v;
    });
  });
}

/**
 * The missingness map of a table (dark cells are missing). Listwise deletion
 * scans the rows and drops every incomplete one; pairwise deletion uses, for
 * each pair of variables, all rows where both are present.
 */
export function DeletionView({
  title,
  method,
  rate,
  seed: seed0,
}: {
  title: string;
  method: 'lista' | 'pares';
  rate: number;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'metodo',
      label: 'Método',
      options: [
        { value: 'lista', label: 'Eliminación por lista' },
        { value: 'pares', label: 'Eliminación por pares' },
      ],
      default: method,
    },
    {
      type: 'number',
      key: 'tasa',
      label: 'Proporción de celdas faltantes',
      min: 0.02,
      max: 0.4,
      step: 0.02,
      default: rate,
      digits: 2,
    },
  ];
  const parameters = useParameters(definitions);
  const current = String(parameters.values.metodo) as 'lista' | 'pares';
  const cellRate = Number(parameters.values.tasa);
  const seed = useSeed(seed0);
  const table = useMemo(() => makeTable(cellRate, seed.seed), [cellRate, seed.seed]);
  const total = current === 'lista' ? ROWS : PAIRS.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(
    `${current}|${seed.seed}|${cellRate}|${run}`,
    () => (reducedMotion ? total : 0),
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND[current],
    done: shown >= total,
  });
  const complete = listwiseRows(table);
  const pairInfo = PAIRS.map(([a, b]) => {
    const rows = pairwiseRows(table, a, b);
    return {
      a,
      b,
      rows,
      r: correlationOnRows(table, rows, a, b),
      rList: correlationOnRows(table, complete, a, b),
    };
  });
  const activePair = current === 'pares' && shown > 0 ? pairInfo[shown - 1] : undefined;
  const scannedRows = current === 'lista' ? shown : ROWS;
  const droppedSoFar = table.slice(0, scannedRows).filter((row) => row.some(Number.isNaN)).length;
  const ns = pairInfo.map((p) => p.rows.length);
  const g = (v: number) => formatNumber(v, 3);
  const header =
    current === 'lista'
      ? `n_{\\text{lista}} = ${scannedRows - droppedSoFar} \\text{ de } ${scannedRows} \\text{ filas revisadas}`
      : activePair
        ? `r_{${VARIABLES[activePair.a]?.toLowerCase()},\\,${VARIABLES[activePair.b]?.toLowerCase()}} = ${g(activePair.r)}\\quad (n = ${activePair.rows.length})`
        : `n_{jk} = |\\{ i : x_{ij} \\text{ y } x_{ik} \\text{ observados}\\}|`;
  const description =
    `${ROWS} filas y 4 variables con ${formatNumber(cellRate * 100, 0)} % de celdas faltantes al azar. ` +
    `Filas completas: ${complete.length}. Con eliminación por pares, cada correlación usa entre ${Math.min(...ns)} y ${Math.max(...ns)} filas.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        {
          label: 'Filas completas (por lista)',
          value: `${complete.length} de ${ROWS}`,
          color: DATA_COLORS.highlight,
        },
        {
          label: 'Filas por par (mínimo y máximo)',
          value: `${Math.min(...ns)} y ${Math.max(...ns)}`,
        },
        ...(activePair
          ? [
              { label: 'Correlación por pares', value: g(activePair.r) },
              { label: 'Misma correlación por lista', value: g(activePair.rList) },
            ]
          : []),
      ]}
      legend={[
        { label: 'Valor observado', color: 'color-mix(in srgb, var(--data-1) 30%, transparent)' },
        { label: 'Valor faltante', color: DATA_COLORS.text },
        {
          label: current === 'lista' ? 'Fila eliminada' : 'Fila usada en el par actual',
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
      dataTable={{
        caption: 'Filas usadas y correlación por par de variables',
        columns: [
          'Par',
          'Filas por pares',
          'Correlación por pares',
          'Filas por lista',
          'Correlación por lista',
        ],
        rows: pairInfo.map((p) => [
          `${VARIABLES[p.a]} y ${VARIABLES[p.b]}`,
          p.rows.length,
          g(p.r),
          complete.length,
          g(p.rList),
        ]),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <div>
          <h4 className={styles.panelTitle}>Mapa de valores faltantes</h4>
          <div
            className={styles.mapGrid}
            style={{ gridTemplateColumns: `repeat(${VARIABLES.length}, 1fr)` }}
            aria-hidden="true"
          >
            {VARIABLES.map((v) => (
              <div key={v} className={styles.mapHeader}>
                {v}
              </div>
            ))}
            {table.map((row, r) => {
              const incomplete = row.some(Number.isNaN);
              const dropped = current === 'lista' && r < scannedRows && incomplete;
              const usedInPair = activePair?.rows.includes(r);
              return row.map((v, c) => {
                const inActiveColumn = activePair && (c === activePair.a || c === activePair.b);
                const highlight = (dropped || (usedInPair && inActiveColumn)) ?? false;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`${styles.mapCell} ${Number.isNaN(v) ? styles.mapCellMissing : ''}`}
                    style={
                      highlight && !Number.isNaN(v) ? { background: 'var(--data-5)' } : undefined
                    }
                  />
                );
              });
            })}
          </div>
        </div>
        <div className={styles.tableScroll}>
          <h4 className={styles.panelTitle}>Filas usadas en cada correlación</h4>
          <table className={styles.table}>
            <caption className="visually-hidden">Número de filas por par de variables</caption>
            <thead>
              <tr>
                <th scope="col">Par</th>
                <th scope="col">Por lista</th>
                <th scope="col">Por pares</th>
              </tr>
            </thead>
            <tbody>
              {pairInfo.map((p, i) => (
                <tr key={i} className={activePair === p ? styles.activeRow : undefined}>
                  <td>
                    {VARIABLES[p.a]} y {VARIABLES[p.b]}
                  </td>
                  <td className={styles.mono}>
                    {complete.length} (r = {g(p.rList)})
                  </td>
                  <td className={styles.mono}>
                    {current === 'pares' && i >= shown ? '...' : `${p.rows.length} (r = ${g(p.r)})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VizFrame>
  );
}
