import { useMemo, useState } from 'react';
import { standardize, stringSimilarity } from '../../../lib/dataprep/quality.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './Quality.module.css';
import type { DuplicateCaseId } from './schema.ts';
import { CLEANING_STEPS, DUPLICATE_CASES } from './tableCases.ts';

const PAIRS_PER_SECOND = 4;

/**
 * Every pair of records is compared by the similarity of its key (name and
 * phone). Pairs above the threshold are linked, linked records form groups,
 * and the true identity of each record shows correct and wrong merges.
 */
export function DuplicatesView({
  title,
  caseId,
  threshold,
  normalize,
}: {
  title: string;
  caseId: DuplicateCaseId;
  threshold: number;
  normalize: boolean;
}) {
  const item = DUPLICATE_CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'umbral',
      label: 'Umbral de similitud',
      min: 0.5,
      max: 1,
      step: 0.01,
      default: threshold,
      symbol: 'τ',
      digits: 2,
    },
    {
      type: 'toggle',
      key: 'normalizar',
      label: 'Normalizar texto antes de comparar',
      default: normalize,
    },
  ];
  const parameters = useParameters(definitions);
  const tau = Number(parameters.values.umbral);
  const useNormal = Boolean(parameters.values.normalizar);
  const keys = useMemo(
    () =>
      item.records.map((r) => {
        const key = `${r.name} ${r.phone}`;
        return useNormal ? standardize(key, CLEANING_STEPS) : key;
      }),
    [item, useNormal],
  );
  const pairs = useMemo(() => {
    const list: { i: number; j: number; s: number }[] = [];
    for (let i = 0; i < keys.length; i += 1) {
      for (let j = i + 1; j < keys.length; j += 1)
        list.push({ i, j, s: stringSimilarity(keys[i] ?? '', keys[j] ?? '') });
    }
    return list;
  }, [keys]);
  const total = pairs.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${useNormal}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: PAIRS_PER_SECOND,
    done: shown >= total,
  });
  const compared = pairs.slice(0, shown);
  const parent = item.records.map((_, i) => i);
  const find = (i: number): number => {
    let r = i;
    while (parent[r] !== r) r = parent[r] ?? r;
    return r;
  };
  const linked = compared.filter((p) => p.s >= tau);
  for (const p of linked) {
    const a = find(p.i);
    const b = find(p.j);
    if (a !== b) parent[Math.max(a, b)] = Math.min(a, b);
  }
  const groups = item.records.map((_, i) => find(i));
  const groupIds = [...new Set(groups)];
  const sizes = new Map<number, number>();
  groups.forEach((g) => sizes.set(g, (sizes.get(g) ?? 0) + 1));
  const correct = linked.filter(
    (p) => item.records[p.i]?.entity === item.records[p.j]?.entity,
  ).length;
  const wrong = linked.length - correct;
  const truePairs = pairs.filter(
    (p) => item.records[p.i]?.entity === item.records[p.j]?.entity,
  ).length;
  const current = shown > 0 ? pairs[shown - 1] : undefined;
  const g = (v: number) => formatNumber(v, 3);
  const header = current
    ? `\\operatorname{sim}(r_{${current.i + 1}}, r_{${current.j + 1}}) = 1 - \\frac{d(r_{${current.i + 1}}, r_{${current.j + 1}})}{\\max(|r_{${current.i + 1}}|, |r_{${current.j + 1}}|)} = ${g(current.s)} ${current.s >= tau ? '\\ge' : '<'} ${formatNumber(tau, 2)}`
    : `\\operatorname{sim}(a, b) = 1 - \\frac{d(a, b)}{\\max(|a|, |b|)}`;
  const description =
    `${item.name}: ${item.records.length} registros, ${shown} de ${total} pares comparados con umbral ${formatNumber(tau, 2)}. ` +
    `${linked.length} pares unidos (${correct} correctos, ${wrong} equivocados), ${groupIds.length} grupos.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Pares comparados', value: `${shown} de ${total}` },
        {
          label: 'Pares unidos correctamente',
          value: `${correct} de ${truePairs}`,
          color: DATA_COLORS.positive,
        },
        { label: 'Pares unidos por error', value: String(wrong), color: DATA_COLORS.negative },
        { label: 'Registros tras depurar', value: String(groupIds.length) },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        {current
          ? `Comparando ${current.i + 1} y ${current.j + 1}: similitud ${g(current.s)}, ${current.s >= tau ? 'se unen' : 'quedan separados'}.`
          : 'Cada par de registros se compara por su nombre y teléfono.'}
      </p>
      <div className={styles.tableScroll} role="region" aria-label={item.name} tabIndex={0}>
        <table className={styles.table}>
          <caption className="visually-hidden">{item.name}</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Grupo</th>
              {item.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
              <th scope="col">Clave comparada</th>
            </tr>
          </thead>
          <tbody>
            {item.records.map((r, i) => {
              const inPair = current && (current.i === i || current.j === i);
              const group = groups[i] ?? i;
              const multi = (sizes.get(group) ?? 1) > 1;
              return (
                <tr key={i} className={inPair ? styles.activeRow : undefined}>
                  <td>{i + 1}</td>
                  <td>
                    {multi && (
                      <span
                        className={styles.swatch}
                        style={{ background: seriesColor(groupIds.indexOf(group)) }}
                        aria-hidden="true"
                      />
                    )}
                    {multi ? `G${groupIds.indexOf(group) + 1}` : 'solo'}
                  </td>
                  <td className={styles.pre}>{r.name}</td>
                  <td className={styles.mono}>{r.phone}</td>
                  <td>{r.city}</td>
                  <td className={`${styles.mono} ${styles.pre}`}>{keys[i]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}
