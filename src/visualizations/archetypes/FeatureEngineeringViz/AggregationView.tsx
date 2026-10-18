import { useMemo, useState } from 'react';
import { aggregateBy } from '../../../lib/dataprep/features.ts';
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
import { HBars } from '../../shared/HBars.tsx';
import styles from './FeatureEngineeringViz.module.css';

const CLIENTS = ['Andrea', 'Bruno', 'Celia', 'Darío', 'Eva'];
const VISITS = [6, 2, 4, 1, 5];
const TYPICAL = [180, 950, 320, 2400, 140];
const ROWS_PER_SECOND = 2;

type Stat = 'conteo' | 'suma' | 'media' | 'maximo';
const STAT_NAMES: Record<Stat, string> = {
  conteo: 'Número de compras',
  suma: 'Gasto total',
  media: 'Ticket promedio',
  maximo: 'Compra máxima',
};
const STAT_TEX: Record<Stat, string> = {
  conteo: 'n_c = |\\{i : c_i = c\\}|',
  suma: 'S_c = \\sum_{i:\\,c_i = c} m_i',
  media: '\\bar{m}_c = S_c / n_c',
  maximo: 'M_c = \\max_{i:\\,c_i = c} m_i',
};

/** Purchases of five customers with very different habits, in time order. */
function purchases(seed: number): { client: string; amount: number }[] {
  const random = new Random(seed);
  const list: { client: string; amount: number; key: number }[] = [];
  CLIENTS.forEach((c, i) => {
    for (let k = 0; k < (VISITS[i] ?? 1); k += 1) {
      list.push({
        client: c,
        amount: Math.round((TYPICAL[i] ?? 100) * random.uniform(0.6, 1.4)),
        key: random.next(),
      });
    }
  });
  return list.sort((a, b) => a.key - b.key).map(({ client, amount }) => ({ client, amount }));
}

/**
 * A transactions table has one row per purchase, but the model needs one
 * row per customer. Each purchase is added to its customer's summary as it
 * arrives: count, total, average and maximum become new features.
 */
export function AggregationView({
  title,
  statistic,
  seed: seed0,
}: {
  title: string;
  statistic: Stat;
  seed: number;
}) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'select',
      key: 'estadistico',
      label: 'Agregado que se grafica',
      options: (Object.keys(STAT_NAMES) as Stat[]).map((s) => ({ value: s, label: STAT_NAMES[s] })),
      default: statistic,
    },
  ];
  const parameters = useParameters(definitions);
  const stat = String(parameters.values.estadistico) as Stat;
  const seed = useSeed(seed0);
  const rows = useMemo(() => purchases(seed.seed), [seed.seed]);
  const total = rows.length;
  const reducedMotion = useReducedMotion();
  const [shownRun, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${seed.seed}|${shownRun}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: ROWS_PER_SECOND,
    done: shown >= total,
  });
  const seen = rows.slice(0, shown);
  const aggregates = aggregateBy(
    seen.map((r) => r.client),
    seen.map((r) => r.amount),
  );
  const byClient = CLIENTS.map((c) => aggregates.find((a) => a.key === c));
  const value = (c: (typeof byClient)[number]) =>
    !c
      ? 0
      : stat === 'conteo'
        ? c.count
        : stat === 'suma'
          ? c.sum
          : stat === 'media'
            ? c.mean
            : c.max;
  const current = seen[seen.length - 1];
  const g = (v: number) => formatNumber(v, 0);
  const cur = current ? byClient[CLIENTS.indexOf(current.client)] : undefined;
  const header =
    current && cur
      ? `${STAT_TEX[stat]}:\\quad \\text{${current.client}} \\to ${g(value(cur))}`
      : STAT_TEX[stat];
  const description =
    `${shown} de ${total} compras procesadas. ${STAT_NAMES[stat]} por cliente: ` +
    CLIENTS.map((c, i) => `${c} ${g(value(byClient[i]))}`).join(', ') +
    '.';

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Compras procesadas', value: `${shown} de ${total}` },
        { label: 'Filas de la tabla de clientes', value: String(CLIENTS.length) },
        { label: 'Columnas nuevas por cliente', value: '4' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <div className={styles.tableScroll} role="region" aria-label="Compras" tabIndex={0}>
          <table className={styles.table}>
            <caption className="visually-hidden">Compras en orden de llegada</caption>
            <thead>
              <tr>
                <th scope="col">Compra</th>
                <th scope="col">Cliente</th>
                <th scope="col">Monto (pesos)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className={
                    i === shown - 1 ? styles.activeRow : i >= shown ? styles.dropped : undefined
                  }
                >
                  <td>{i + 1}</td>
                  <td>{r.client}</td>
                  <td className={styles.mono}>{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Características por cliente"
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className="visually-hidden">Características agregadas por cliente</caption>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  {(Object.keys(STAT_NAMES) as Stat[]).map((s) => (
                    <th key={s} scope="col" className={s === stat ? styles.ok : undefined}>
                      {STAT_NAMES[s]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLIENTS.map((c, i) => {
                  const a = byClient[i];
                  return (
                    <tr key={c} className={current?.client === c ? styles.activeRow : undefined}>
                      <td>{c}</td>
                      <td className={styles.mono}>{a ? a.count : 0}</td>
                      <td className={styles.mono}>{a ? g(a.sum) : '0'}</td>
                      <td className={styles.mono}>{a ? g(a.mean) : '...'}</td>
                      <td className={styles.mono}>{a ? g(a.max) : '...'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <HBars
            labels={CLIENTS}
            values={byClient.map(value)}
            highlight={current ? CLIENTS.indexOf(current.client) : -1}
            axisLabel={STAT_NAMES[stat]}
            decimals={0}
            label={description}
            colors={CLIENTS.map(() => DATA_COLORS.primary)}
          />
        </div>
      </div>
    </VizFrame>
  );
}
