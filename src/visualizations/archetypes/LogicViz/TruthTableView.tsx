import { useMemo, useState } from 'react';
import {
  assignments,
  classify,
  evaluate,
  subformulas,
  toLatex,
  variables,
} from '../../../lib/logic/index.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { FORMULAS, type FormulaId } from './formulas.ts';
import styles from './LogicViz.module.css';

const CELLS_PER_SECOND = 4;

const CLASSIFICATION_LABEL = {
  tautologia: 'Tautología: verdadera en todas las filas',
  contradiccion: 'Contradicción: falsa en todas las filas',
  contingencia: 'Contingencia: depende de los valores de las variables',
} as const;

interface TruthTableViewProps {
  title: string;
  formula: FormulaId;
  formulas: readonly FormulaId[];
}

/** Truth table filled cell by cell, evaluating each subformula before the whole formula. */
export function TruthTableView({ title, formula, formulas }: TruthTableViewProps) {
  const definitions = useMemo(
    () =>
      formulas.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'formula',
              label: 'Fórmula',
              options: formulas.map((id) => ({ value: id, label: FORMULAS[id].label })),
              default: formula,
            },
          ]
        : [],
    [formulas, formula],
  );
  const parameters = useParameters(definitions);
  const selected = (
    formulas.length > 1 ? String((parameters.values as Record<string, unknown>).formula) : formula
  ) as FormulaId;
  const tree = FORMULAS[selected].formula;
  const names = useMemo(() => variables(tree), [tree]);
  const columns = useMemo(() => subformulas(tree), [tree]);
  const rows = useMemo(() => assignments(names), [names]);
  const totalCells = rows.length * columns.length;
  const [run, setRun] = useState(0);
  const [filled, update] = useResettableState<number>(`${selected}|${run}`, () => 0);

  const playback = usePlayback({
    step: () => update((value) => Math.min(totalCells, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: CELLS_PER_SECOND,
    done: filled >= totalCells,
  });

  const complete = filled >= totalCells;
  const classification = classify(tree);
  const trueRows = rows.filter((row) => evaluate(tree, row)).length;
  const description = complete
    ? `La fórmula ${FORMULAS[selected].label.toLowerCase()} es verdadera en ${trueRows} de ${rows.length} filas. ${CLASSIFICATION_LABEL[classification]}.`
    : `Se han evaluado ${filled} de ${totalCells} celdas de la tabla de verdad.`;

  return (
    <VizFrame
      title={title}
      graphic="html"
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      readouts={[
        { label: 'Filas', value: String(rows.length) },
        { label: 'Celdas evaluadas', value: `${filled} de ${totalCells}` },
        { label: 'Filas verdaderas', value: complete ? String(trueRows) : 'sin evaluar todavía' },
        {
          label: 'Clasificación',
          value: complete
            ? (CLASSIFICATION_LABEL[classification].split(':')[0] ?? '')
            : 'sin evaluar todavía',
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={toLatex(tree)} display />
      </p>
      <div className={styles.tableScroll} role="region" aria-label="Tabla de verdad" tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              {names.map((name) => (
                <th key={name} scope="col">
                  <Latex tex={name} />
                </th>
              ))}
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={index === columns.length - 1 ? styles.finalColumn : undefined}
                >
                  <Latex tex={toLatex(column)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {names.map((name) => (
                  <td key={name}>
                    <span className={row[name] ? styles.true : styles.false}>
                      {row[name] ? 'V' : 'F'}
                    </span>
                  </td>
                ))}
                {columns.map((column, columnIndex) => {
                  const cell = rowIndex * columns.length + columnIndex;
                  const shown = cell < filled;
                  const current = cell === filled - 1;
                  const value = evaluate(column, row);
                  return (
                    <td
                      key={columnIndex}
                      className={[
                        current ? styles.currentCell : '',
                        columnIndex === columns.length - 1 ? styles.finalColumn : '',
                      ].join(' ')}
                    >
                      {shown ? (
                        <span className={value ? styles.true : styles.false}>
                          {value ? 'V' : 'F'}
                        </span>
                      ) : (
                        <span className={styles.pending} role="img" aria-label="sin evaluar" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {complete && <p className={styles.verdict}>{CLASSIFICATION_LABEL[classification]}.</p>}
    </VizFrame>
  );
}
