import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { Latex } from '../../core/Latex.tsx';
import styles from './ChartGallery.module.css';

const VALUES_PER_SECOND = 2;

interface StemLeafViewProps {
  title: string;
  values: readonly number[];
  label: string;
  leafUnit: number;
}

function split(value: number, leafUnit: number): { stem: number; leaf: number } {
  const units = Math.round(value / leafUnit);
  return { stem: Math.floor(units / 10), leaf: units % 10 };
}

/**
 * A stem-and-leaf display built value by value: each datum adds its last
 * digit to the row of its leading digits. At the end the leaves are sorted,
 * and the display doubles as a sideways histogram that keeps every value.
 */
export function StemLeafView({ title, values, label, leafUnit }: StemLeafViewProps) {
  const total = values.length + 1;
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(reducedMotion ? total : 0);
  const playback = usePlayback({
    step: () => setStep((v) => Math.min(total, v + 1)),
    reset: () => setStep(0),
    rate: VALUES_PER_SECOND,
    done: step >= total,
  });
  const placed = values.slice(0, Math.min(step, values.length));
  const sortedLeaves = step >= total;
  const parts = values.map((v) => split(v, leafUnit));
  const stems = parts.map((p) => p.stem);
  const minStem = Math.min(...stems);
  const maxStem = Math.max(...stems);
  const rows = Array.from({ length: maxStem - minStem + 1 }, (_, k) => minStem + k);
  const current = step > 0 && step <= values.length ? parts[step - 1] : undefined;
  const leavesOf = (stem: number) => {
    const leaves = placed
      .map((v) => split(v, leafUnit))
      .filter((p) => p.stem === stem)
      .map((p) => p.leaf);
    return sortedLeaves ? [...leaves].sort((a, b) => a - b) : leaves;
  };
  const stemValue = leafUnit * 10;
  const header = current
    ? `${formatNumber(values[step - 1] ?? 0, 2)} \\;\\to\\; \\text{tallo } ${current.stem},\\ \\text{hoja } ${current.leaf}`
    : sortedLeaves
      ? `\\text{hojas ordenadas: } ${values.length} \\text{ datos}`
      : `\\text{tallo} = \\lfloor x / ${formatNumber(stemValue, 2)} \\rfloor,\\ \\text{hoja} = \\text{siguiente dígito}`;
  const description =
    `Diagrama de tallo y hojas de ${placed.length} datos de ${label}. ` +
    rows.map((stem) => `Tallo ${stem}: ${leavesOf(stem).join(' ') || 'sin hojas'}`).join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      readouts={[
        { label: 'Datos colocados', value: `${placed.length} de ${values.length}` },
        { label: 'Valor de un tallo', value: formatNumber(stemValue, 2) },
        { label: 'Valor de una hoja', value: formatNumber(leafUnit, 2) },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <table className={styles.stem} aria-label={`Tallo y hojas de ${label}`}>
        <tbody>
          {rows.map((stem) => {
            const leaves = leavesOf(stem);
            const active = current?.stem === stem;
            return (
              <tr key={stem} className={active ? styles.stemActive : undefined}>
                <td>{stem}</td>
                <td>
                  {leaves.map((leaf, k) => (
                    <span
                      key={k}
                      className={
                        active && !sortedLeaves && k === leaves.length - 1
                          ? styles.leafNew
                          : undefined
                      }
                    >
                      {leaf}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.caption}>
        Clave: el tallo {minStem} con hoja {parts[0]?.leaf ?? 0} representa{' '}
        {formatNumber((minStem * 10 + (parts[0]?.leaf ?? 0)) * leafUnit, 2)} en{' '}
        {label.toLowerCase()}.
      </p>
    </VizFrame>
  );
}
