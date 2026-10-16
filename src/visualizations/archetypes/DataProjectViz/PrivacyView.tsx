import { useMemo, useState } from 'react';
import {
  anonymityK,
  equivalenceClasses,
  syntheticPatients,
  uniqueRecords,
  type QuasiIdentifier,
} from '../../../lib/dataprep/lifecycle.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState, useSeed } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './DataProjectViz.module.css';

const KEYS_PER_SECOND = 0.6;
const KEY_NAMES: Record<QuasiIdentifier, string> = {
  sex: 'sexo',
  age: 'edad',
  postal: 'código postal',
};
const DIAGNOSES = ['Asma', 'Diabetes', 'Hipertensión', 'Migraña', 'Gastritis'];

interface PrivacyViewProps {
  title: string;
  keys: readonly QuasiIdentifier[];
  postalDigits: number;
  ageBand: number;
  records: number;
  seed: number;
}

/**
 * A health table without names is joined, column by column, with public
 * quasi-identifiers. Each added column splits the records into smaller
 * groups; a record alone in its group is re-identified, and generalizing the
 * columns (fewer postal digits, age bands) merges the groups again.
 */
export function PrivacyView(props: PrivacyViewProps) {
  const definitions: ParameterDefinition[] = [
    {
      type: 'number',
      key: 'digitos',
      label: 'Dígitos del código postal conservados',
      min: 1,
      max: 5,
      step: 1,
      default: props.postalDigits,
    },
    {
      type: 'number',
      key: 'banda',
      label: 'Ancho de los grupos de edad',
      min: 1,
      max: 20,
      step: 1,
      default: props.ageBand,
      unit: 'años',
    },
  ];
  const parameters = useParameters(definitions);
  const generalization = {
    postalDigits: Number(parameters.values.digitos),
    ageBand: Number(parameters.values.banda),
  };
  const seed = useSeed(props.seed);
  const data = useMemo(
    () => syntheticPatients(props.records, seed.seed),
    [props.records, seed.seed],
  );
  const reducedMotion = useReducedMotion();
  const total = props.keys.length;
  const [run, setRun] = useState(0);
  const [added, update] = useResettableState(`${seed.seed}|${props.keys.join()}|${run}`, () =>
    reducedMotion ? total : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(total, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: KEYS_PER_SECOND,
    done: added >= total,
  });
  const keys = props.keys.slice(0, added);
  const classes = equivalenceClasses(data, keys, generalization);
  const k = anonymityK(classes);
  const unique = uniqueRecords(classes);
  const homogeneous = [...classes.values()].filter(
    (members) => members.length > 1 && new Set(members.map((i) => data[i]?.diagnosis)).size === 1,
  ).length;
  const sortedClasses = [...classes.entries()].sort(
    (a, b) => a[1].length - b[1].length || a[0].localeCompare(b[0]),
  );
  const header = `k = \\min_{\\text{clases}} |C_j| = ${k},\\quad \\text{registros únicos} = ${unique} \\text{ de } ${data.length}`;
  const keyText =
    keys.length === 0 ? 'ninguna columna' : keys.map((key) => KEY_NAMES[key]).join(', ');
  const description =
    `${data.length} registros de pacientes sin nombre. Columnas cruzadas con una lista pública: ${keyText}. ` +
    `Se forman ${classes.size} grupos; ${unique} registros quedan solos y pueden reidentificarse; k = ${k}.`;

  return (
    <VizFrame
      title={props.title}
      graphic="html"
      playback={playback}
      seed={seed}
      parameters={parameters}
      readouts={[
        { label: 'Columnas cruzadas', value: keyText },
        { label: 'Grupos formados', value: String(classes.size) },
        {
          label: 'Registros únicos (reidentificables)',
          value: String(unique),
          color: DATA_COLORS.negative,
        },
        { label: 'k de anonimato', value: String(k) },
        { label: 'Grupos con un solo diagnóstico', value: String(homogeneous) },
      ]}
      legend={DIAGNOSES.map((d, i) => ({
        label: d,
        color: seriesColor(i),
        shape: 'circle' as const,
      }))}
      description={description}
      dataTable={{
        caption: 'Registros con sus cuasiidentificadores',
        columns: ['Código postal', 'Edad', 'Sexo', 'Diagnóstico'],
        rows: data.map((r) => [r.postal, r.age, r.sex, r.diagnosis]),
      }}
    >
      <FormulaLine tex={header} />
      <p className={styles.stage}>
        Cada punto es un paciente y su color es el diagnóstico. Los recuadros reúnen a quienes
        comparten {keyText}; un recuadro rojo contiene a una sola persona.
      </p>
      <div className={styles.groups}>
        {sortedClasses.map(([key, members]) => (
          <div
            key={key}
            className={`${styles.group} ${members.length === 1 ? styles.groupUnique : ''}`}
          >
            <span className={styles.groupKey}>
              {key === '' ? 'Todos' : key.replace(/\|/g, ' · ')}
            </span>
            {members.map((i) => (
              <span
                key={i}
                className={styles.person}
                style={{ background: seriesColor(DIAGNOSES.indexOf(data[i]?.diagnosis ?? 'Asma')) }}
                aria-hidden="true"
              />
            ))}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
