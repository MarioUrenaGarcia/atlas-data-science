import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { histogram } from '../../../lib/stats/index.ts';
import { type ColumnProfile, profileColumn } from '../../../lib/stats/eda.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Column } from './columns.ts';
import styles from './DataQualityTable.module.css';

const COLUMNS_PER_SECOND = 0.7;
const SPARK_WIDTH = 150;
const SPARK_HEIGHT = 36;
const SPARK_BINS = 12;
const TOP_SHOWN = 4;

function Spark({ column, profile }: { column: Column; profile: ColumnProfile }) {
  const present = column.valores.filter((v) => v !== null);
  if (profile.kind === 'numerica') {
    const bins = histogram(present as number[], SPARK_BINS);
    const top = Math.max(1, ...bins.map((b) => b.count));
    const w = SPARK_WIDTH / SPARK_BINS;
    return (
      <svg width={SPARK_WIDTH} height={SPARK_HEIGHT} aria-hidden="true">
        {bins.map((b, i) => {
          const h = (SPARK_HEIGHT * b.count) / top;
          return (
            <rect
              key={i}
              x={i * w}
              y={SPARK_HEIGHT - h}
              width={w - 1}
              height={h}
              fill={DATA_COLORS.primary}
              fillOpacity={0.7}
            />
          );
        })}
      </svg>
    );
  }
  const shown = profile.top.slice(0, TOP_SHOWN);
  const top = Math.max(1, ...shown.map((t) => t.count));
  const h = SPARK_HEIGHT / Math.max(1, shown.length);
  return (
    <svg width={SPARK_WIDTH} height={SPARK_HEIGHT} aria-hidden="true">
      {shown.map((t, i) => (
        <rect
          key={t.value}
          x={0}
          y={i * h}
          width={(SPARK_WIDTH * t.count) / top}
          height={h - 1}
          fill={DATA_COLORS.tertiary}
          fillOpacity={0.8}
        />
      ))}
    </svg>
  );
}

interface ProfileViewProps {
  title: string;
  columns: Column[];
  rows: number;
}

/**
 * A data table and, column by column, its profile: type, count, missing
 * values, distinct values and a numeric summary or the most frequent
 * categories, with a small distribution chart.
 */
export function ProfileView({ title, columns, rows }: ProfileViewProps) {
  const profiles = useMemo(() => columns.map((c) => profileColumn(c.nombre, c.valores)), [columns]);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, setShown] = useResettableState<number>(String(run), () =>
    reducedMotion ? columns.length : 0,
  );
  const playback = usePlayback({
    step: () => setShown((v) => Math.min(columns.length, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: COLUMNS_PER_SECOND,
    done: shown >= columns.length,
  });
  const n = columns[0]?.valores.length ?? 0;
  const current = profiles[shown - 1];
  const f = (v: number | undefined) => (v === undefined ? '' : formatNumber(v, 2));
  const header = current
    ? `\\text{${current.name}}:\\ n = ${current.count},\\ \\text{faltantes} = ${current.missing}\\ (${formatNumber((100 * current.missing) / current.count, 1)}\\,\\%),\\ \\text{distintos} = ${current.distinct}`
    : `${n}\\ \\text{filas} \\times ${columns.length}\\ \\text{columnas}`;
  const description =
    `Perfil de ${columns.length} columnas con ${n} filas. ` +
    profiles
      .slice(0, shown)
      .map(
        (p) =>
          `${p.name}: ${p.kind === 'numerica' ? 'numérica' : 'categórica'}, ${p.missing} faltantes, ${p.distinct} distintos` +
          (p.kind === 'numerica'
            ? `, de ${f(p.min)} a ${f(p.max)}, media ${f(p.mean)}`
            : `, moda ${p.mode.value}`),
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      graphic="html"
      readouts={[
        { label: 'Filas', value: String(n) },
        { label: 'Columnas perfiladas', value: `${shown} de ${columns.length}` },
        {
          label: 'Celdas faltantes',
          value: String(profiles.reduce((t, p) => t + p.missing, 0)),
          color: DATA_COLORS.secondary,
        },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Primeras {Math.min(rows, n)} filas</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.nombre} scope="col">
                  {c.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(rows, n) }, (_, r) => (
              <tr key={r}>
                {columns.map((c) => {
                  const v = c.valores[r];
                  return (
                    <td key={c.nombre} className={v === null ? styles.missing : undefined}>
                      {v === null || v === undefined
                        ? 'faltante'
                        : typeof v === 'number'
                          ? formatNumber(v, 2)
                          : v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.cards}>
        {profiles.slice(0, shown).map((p, i) => (
          <section
            key={p.name}
            className={`${styles.card} ${i === shown - 1 ? styles.cardActive : ''}`}
            aria-label={`Perfil de ${p.name}`}
          >
            <h4>{p.name}</h4>
            <dl>
              <dt>Tipo</dt>
              <dd>{p.kind === 'numerica' ? 'numérica' : 'categórica'}</dd>
              <dt>Faltantes</dt>
              <dd>
                {p.missing} ({formatNumber((100 * p.missing) / p.count, 1)} %)
              </dd>
              <dt>Distintos</dt>
              <dd>{p.distinct}</dd>
              {p.kind === 'numerica' ? (
                <>
                  <dt>Mínimo</dt>
                  <dd>{f(p.min)}</dd>
                  <dt>Máximo</dt>
                  <dd>{f(p.max)}</dd>
                  <dt>Media</dt>
                  <dd>{f(p.mean)}</dd>
                  <dt>Mediana</dt>
                  <dd>{f(p.median)}</dd>
                </>
              ) : (
                <>
                  <dt>Moda</dt>
                  <dd>
                    {p.mode.value} ({p.mode.count})
                  </dd>
                </>
              )}
            </dl>
            <Spark
              column={columns.find((c) => c.nombre === p.name) ?? { nombre: p.name, valores: [] }}
              profile={p}
            />
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
