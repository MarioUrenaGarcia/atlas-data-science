import { useState } from 'react';
import { collisionPairs, fnv1a, hashBucket } from '../../../lib/dataprep/features.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './FeatureEngineeringViz.module.css';
import type { HashCaseId } from './schema.ts';

const ITEMS_PER_SECOND = 2;

const CASES: Record<HashCaseId, { column: string; values: readonly string[] }> = {
  municipios: {
    column: 'Municipio',
    values: [
      'Zapopan',
      'Tlaquepaque',
      'Tonalá',
      'Tlajomulco',
      'Guadalajara',
      'León',
      'Irapuato',
      'Celaya',
      'Querétaro',
      'Corregidora',
      'Toluca',
      'Metepec',
      'Puebla',
      'Cholula',
      'Mérida',
      'Kanasín',
      'Saltillo',
      'Torreón',
      'Monterrey',
      'Apodaca',
      'Oaxaca',
      'Tuxtla',
      'Morelia',
      'Uruapan',
    ],
  },
  navegadores: {
    column: 'Navegador y sistema',
    values: [
      'firefox/linux',
      'firefox/windows',
      'chrome/android',
      'chrome/windows',
      'chrome/mac',
      'safari/ios',
      'safari/mac',
      'edge/windows',
      'opera/windows',
      'samsung/android',
      'firefox/android',
      'chrome/linux',
      'brave/mac',
      'vivaldi/linux',
    ],
  },
};

/**
 * Each category is hashed to one of k columns without a dictionary. Two
 * categories that land in the same column collide; with signed hashing a
 * second hash gives each one a sign, so collisions tend to cancel instead
 * of adding up.
 */
export function HashView({
  title,
  caseId,
  buckets,
  signed,
}: {
  title: string;
  caseId: HashCaseId;
  buckets: number;
  signed: boolean;
}) {
  const item = CASES[caseId];
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'k',
      label: 'Número de columnas (cubetas)',
      min: 2,
      max: 64,
      step: 1,
      default: buckets,
      symbol: 'k',
    },
    { type: 'toggle', key: 'signo', label: 'Usar un signo por categoría', default: signed },
  ];
  const parameters = useParameters(definitions);
  const k = Number(parameters.values.k);
  const useSign = Boolean(parameters.values.signo);
  const total = item.values.length;
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [shown, update] = useResettableState<number>(`${caseId}|${k}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: ITEMS_PER_SECOND,
    done: shown >= total,
  });
  const placed = item.values.slice(0, shown).map((v) => ({ v, ...hashBucket(v, k) }));
  const byBucket = Array.from({ length: k }, (_, b) => placed.filter((p) => p.bucket === b));
  const collisions = collisionPairs(item.values.slice(0, shown), k);
  const expected = (shown * (shown - 1)) / (2 * k);
  const current = placed[placed.length - 1];
  const header = current
    ? `h(\\text{"${current.v}"}) \\bmod ${k} = ${fnv1a(current.v)} \\bmod ${k} = ${current.bucket}${useSign ? `,\\quad \\text{signo} = ${current.sign > 0 ? '+1' : '-1'}` : ''}`
    : `j(c) = h(c) \\bmod k`;
  const description =
    `${shown} de ${total} categorías de ${item.column.toLowerCase()} asignadas a ${k} columnas. ` +
    `Pares en colisión: ${collisions}; esperados al azar: ${formatNumber(expected, 1)}.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Categorías asignadas', value: `${shown} de ${total}` },
        { label: 'Columnas', value: String(k) },
        { label: 'Pares en colisión', value: String(collisions), color: DATA_COLORS.highlight },
        { label: 'Pares esperados al azar', value: formatNumber(expected, 1) },
      ]}
      description={description}
      dataTable={{
        caption: 'Columna asignada a cada categoría',
        columns: ['Categoría', 'Hash', 'Columna', 'Signo'],
        rows: item.values.map((v) => {
          const h = hashBucket(v, k);
          return [v, fnv1a(v), h.bucket, h.sign > 0 ? '+1' : '-1'];
        }),
      }}
    >
      <FormulaLine tex={header} />
      <div className={styles.buckets}>
        {byBucket.map((list, b) => (
          <div
            key={b}
            className={`${styles.bucket} ${list.length > 1 ? styles.bucketCollision : ''}`}
          >
            <span className={styles.bucketIndex}>{b}</span>
            {list.map((p) => (
              <span
                key={p.v}
                className={`${styles.bucketItem} ${p === current ? styles.bucketItemNew : ''}`}
              >
                {useSign ? (p.sign > 0 ? '+ ' : '- ') : ''}
                {p.v}
              </span>
            ))}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
