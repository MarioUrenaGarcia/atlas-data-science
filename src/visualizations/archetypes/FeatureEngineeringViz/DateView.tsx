import { useState } from 'react';
import { dateParts, type DateParts } from '../../../lib/dataprep/features.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { HBars } from '../../shared/HBars.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { DateCaseId } from './schema.ts';

const STEPS_PER_SECOND = 0.8;
const WEEKDAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

interface DateColumn {
  key: string;
  name: string;
  tex: string;
  value: (p: DateParts) => string;
}

const COLUMNS: readonly DateColumn[] = [
  { key: 'hora', name: 'Hora', tex: '\\text{hora}(t)', value: (p) => String(p.hour) },
  {
    key: 'dia',
    name: 'Día de la semana',
    tex: '\\text{díasem}(t)',
    value: (p) => WEEKDAYS[p.weekday] ?? '',
  },
  {
    key: 'finde',
    name: 'Fin de semana',
    tex: '\\mathbf{1}\\{\\text{díasem}(t) \\ge 6\\}',
    value: (p) => (p.weekend ? '1' : '0'),
  },
  { key: 'mes', name: 'Mes', tex: '\\text{mes}(t)', value: (p) => String(p.month) },
  {
    key: 'diaAnio',
    name: 'Día del año',
    tex: '\\text{díaaño}(t)',
    value: (p) => String(p.dayOfYear),
  },
];

const CASES: Record<
  DateCaseId,
  {
    name: string;
    stamps: readonly string[];
    summary: { title: string; labels: string[]; values: number[] };
  }
> = {
  viajes: {
    name: 'Viajes en taxi por aplicación',
    stamps: [
      '2025-03-03 08:15',
      '2025-03-03 18:40',
      '2025-03-07 23:05',
      '2025-03-08 01:30',
      '2025-03-09 14:10',
      '2025-03-11 07:55',
      '2025-03-14 19:20',
      '2025-03-15 22:45',
    ],
    summary: {
      title: 'Viajes promedio por hora (un mes de datos)',
      labels: ['0 a 5 h', '6 a 9 h', '10 a 15 h', '16 a 20 h', '21 a 23 h'],
      values: [14, 61, 33, 72, 40],
    },
  },
  compras: {
    name: 'Compras en una tienda en línea',
    stamps: [
      '2024-11-29 10:02',
      '2024-12-01 21:17',
      '2024-12-12 13:40',
      '2024-12-20 22:05',
      '2024-12-24 09:30',
      '2025-01-06 11:45',
      '2025-01-15 16:20',
      '2025-02-14 20:10',
    ],
    summary: {
      title: 'Compras promedio por día de la semana (un año de datos)',
      labels: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
      values: [118, 112, 109, 121, 143, 96, 131],
    },
  },
};

/**
 * A timestamp is a single value that hides several useful variables. The
 * columns hour, weekday, weekend flag, month and day of the year are
 * extracted one at a time; the bars show the pattern a model can learn only
 * after the extraction.
 */
export function DateView({ title, caseId }: { title: string; caseId: DateCaseId }) {
  const item = CASES[caseId];
  const total = COLUMNS.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: shown >= total,
  });
  const parts = item.stamps.map(dateParts);
  const visible = COLUMNS.slice(0, shown);
  const current = visible[visible.length - 1];
  const first = parts[0];
  const header =
    current && first
      ? `${current.tex} = \\text{${current.value(first)}}\\quad (t = \\text{${item.stamps[0]}})`
      : `t = \\text{${item.stamps[0]}}`;
  const description =
    `${item.name}: de cada fecha y hora se extraen ${shown} columnas (${visible.map((c) => c.name.toLowerCase()).join(', ') || 'ninguna'}). ` +
    `${item.summary.title}: ${item.summary.labels.map((l, i) => `${l} ${item.summary.values[i]}`).join(', ')}.`;
  const peak = item.summary.values.indexOf(Math.max(...item.summary.values));

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Columnas extraídas', value: `${shown} de ${total}` },
        { label: 'Último paso', value: current?.name ?? 'ninguno' },
        {
          label: 'Grupo con más actividad',
          value: item.summary.labels[peak] ?? '',
          color: DATA_COLORS.highlight,
        },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.tableScroll} role="region" aria-label={item.name} tabIndex={0}>
        <table className={styles.table}>
          <caption className="visually-hidden">{item.name}</caption>
          <thead>
            <tr>
              <th scope="col">Fecha y hora</th>
              {visible.map((c) => (
                <th key={c.key} scope="col" className={c === current ? styles.ok : undefined}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i}>
                <td className={styles.mono}>{item.stamps[i]}</td>
                {visible.map((c) => (
                  <td key={c.key} className={`${styles.mono} ${c === current ? styles.ok : ''}`}>
                    {c.value(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className={styles.panelTitle}>{item.summary.title}</h4>
      <HBars
        labels={item.summary.labels}
        values={item.summary.values}
        highlight={peak}
        axisLabel="Promedio"
        decimals={0}
        label={description}
      />
    </VizFrame>
  );
}
