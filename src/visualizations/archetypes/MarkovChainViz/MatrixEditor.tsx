import type { Matrix } from '../../../lib/linalg/index.ts';
import styles from './MatrixEditor.module.css';

interface MatrixEditorProps {
  states: readonly string[];
  weights: Matrix;
  normalized: Matrix;
  onChange: (row: number, column: number, value: number) => void;
}

/**
 * Editable transition weights. Each row is normalized automatically, so the
 * reader can type any nonnegative numbers and see the resulting probabilities.
 */
export function MatrixEditor({ states, weights, normalized, onChange }: MatrixEditorProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.caption} id="matriz-transicion">
        Pesos de transición (cada renglón se normaliza para sumar 1)
      </p>
      <div className={styles.scroll} role="region" aria-labelledby="matriz-transicion" tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Desde</span>
              </th>
              {states.map((state) => (
                <th key={state} scope="col">
                  {state}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((from, i) => (
              <tr key={from}>
                <th scope="row">{from}</th>
                {states.map((to, j) => (
                  <td key={to}>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.05}
                      value={weights[i]?.[j] ?? 0}
                      aria-label={`Peso de ${from} a ${to}; probabilidad ${(normalized[i]?.[j] ?? 0).toFixed(2)}`}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        if (Number.isFinite(value) && value >= 0) onChange(i, j, value);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
