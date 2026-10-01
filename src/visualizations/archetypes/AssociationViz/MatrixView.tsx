import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { correlationMatrix } from '../../../lib/stats/association.ts';
import { pearson } from '../../../lib/stats/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './AssociationViz.module.css';
import { paddedDomain } from './pairDomain.ts';
import { PairPlot } from './PairPlot.tsx';

const CELLS_PER_SECOND = 3;
const DOT_RADIUS = 4;
const MAX_TINT = 85;

interface MatrixViewProps {
  title: string;
  variables: readonly { nombre: string; valores: readonly number[] }[];
}

function tint(r: number): string {
  const percent = Math.round(Math.abs(r) * MAX_TINT);
  const color = r >= 0 ? 'var(--data-1)' : 'var(--data-2)';
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/**
 * The correlation matrix filled cell by cell; selecting a cell shows the
 * scatter plot behind that number.
 */
export function MatrixView({ title, variables }: MatrixViewProps) {
  const p = variables.length;
  const matrix = correlationMatrix(variables.map((v) => v.valores));
  const order: [number, number][] = [];
  for (let i = 0; i < p; i += 1) for (let j = i + 1; j < p; j += 1) order.push([i, j]);
  const reducedMotion = useReducedMotion();
  const [filled, setFilled] = useState(reducedMotion ? order.length : 0);
  const [selected, setSelected] = useState<[number, number]>(order[0] ?? [0, 1]);
  const playback = usePlayback({
    step: () => {
      const next = Math.min(order.length, filled + 1);
      const pair = order[next - 1];
      if (pair) setSelected(pair);
      setFilled(next);
    },
    reset: () => setFilled(0),
    rate: CELLS_PER_SECOND,
    done: filled >= order.length,
  });
  const isFilled = (i: number, j: number) => {
    if (i === j) return true;
    const [a, b] = i < j ? [i, j] : [j, i];
    return order.findIndex(([u, v]) => u === a && v === b) < filled;
  };
  const [si, sj] = selected;
  const vx = variables[sj]?.valores ?? [];
  const vy = variables[si]?.valores ?? [];
  const r = pearson(vx, vy);
  const description =
    `Matriz de correlación de ${p} variables. ` +
    order
      .map(
        ([i, j]) =>
          `${variables[i]?.nombre} y ${variables[j]?.nombre}: ${formatNumber(matrix[i]?.[j] ?? 0, 2)}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Celdas calculadas', value: `${filled} de ${order.length}` },
        { label: `Par seleccionado`, value: `${variables[si]?.nombre} y ${variables[sj]?.nombre}` },
        { label: 'Correlación del par', value: formatNumber(r, 3), color: DATA_COLORS.highlight },
      ]}
      legend={[
        { label: 'Correlación positiva', color: DATA_COLORS.primary },
        { label: 'Correlación negativa', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\mathbf{R}_{${si + 1}${sj + 1}} = r(\\text{${variables[si]?.nombre}}, \\text{${variables[sj]?.nombre}}) = ${formatNumber(r, 3)}`}
        />
      </p>
      <div className={styles.pair}>
        <div
          className={styles.tableScroll}
          role="region"
          aria-label="Matriz de correlación"
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" />
                {variables.map((v) => (
                  <th key={v.nombre} scope="col">
                    {v.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variables.map((row, i) => (
                <tr key={row.nombre}>
                  <th scope="row">{row.nombre}</th>
                  {variables.map((col, j) => {
                    const value = matrix[i]?.[j] ?? 0;
                    const shown = isFilled(i, j);
                    const active = (i === si && j === sj) || (i === sj && j === si);
                    return (
                      <td
                        key={col.nombre}
                        style={{
                          padding: 0,
                          background: shown ? tint(value) : undefined,
                          outline: active ? '2px solid var(--data-5)' : undefined,
                        }}
                      >
                        <button
                          type="button"
                          className={styles.matrixCell}
                          style={{ background: 'transparent' }}
                          aria-label={`${row.nombre} y ${col.nombre}: ${shown ? formatNumber(value, 2) : 'sin calcular'}`}
                          onClick={() => {
                            if (i === j) return;
                            playback.pause();
                            setSelected(i < j ? [i, j] : [j, i]);
                          }}
                        >
                          {shown ? formatNumber(value, 2) : ''}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PairPlot
          xDomain={paddedDomain(vx)}
          yDomain={paddedDomain(vy)}
          xLabel={variables[sj]?.nombre ?? ''}
          yLabel={variables[si]?.nombre ?? ''}
          label={`Dispersión de ${variables[si]?.nombre} frente a ${variables[sj]?.nombre}`}
          aspect={0.85}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {vx.map((value, k) => (
                <circle
                  key={k}
                  cx={x(value)}
                  cy={y(vy[k] ?? 0)}
                  r={DOT_RADIUS}
                  fill={DATA_COLORS.text}
                  fillOpacity={0.7}
                />
              ))}
            </g>
          )}
        </PairPlot>
      </div>
    </VizFrame>
  );
}
