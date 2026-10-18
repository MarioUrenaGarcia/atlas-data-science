import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { marginalX, marginalY } from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { resolveJoint } from './source.ts';

/** Columns or rows added per second; dense grids sweep faster so the animation lasts a few seconds. */
const DISCRETE_RATE = 1.2;
const DENSE_RATE = 18;
const MAX_LISTED = 6;

interface MarginalsViewProps {
  title: string;
  config: JointDistribution2DConfig;
}

/**
 * Marginal distributions as sums of the joint table: the animation sweeps the
 * columns, adding each one into the bar of X above the grid, and then the
 * rows, adding each one into the bar of Y at the right. For densities the
 * sums become integrals over the other variable.
 */
export function MarginalsView({ title, config }: MarginalsViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const nx = joint.xs.length;
  const ny = joint.ys.length;
  const total = nx + ny;
  const px = marginalX(joint).probs;
  const py = marginalY(joint).probs;

  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: continuous ? DENSE_RATE : DISCRETE_RATE,
    done: stage >= total,
  });
  const doingX = stage <= nx;
  const current = doingX ? stage - 1 : stage - nx - 1;
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, 3);
  const density = (p: number, cell: number) => (continuous ? p / cell : p);

  const header = (() => {
    if (stage === 0) {
      return continuous
        ? `f_{${sx}}(x) = \\int f(x, y)\\, dy, \\qquad f_{${sy}}(y) = \\int f(x, y)\\, dx`
        : `p_{${sx}}(x) = \\sum_y p(x, y), \\qquad p_{${sy}}(y) = \\sum_x p(x, y)`;
    }
    if (doingX) {
      const xv = joint.xs[current] ?? 0;
      const row = joint.p[current] ?? [];
      if (continuous) {
        return `f_{${sx}}(${f(xv)}) = \\int f(${f(xv)}, y)\\, dy \\approx ${f(density(px[current] ?? 0, source.cellX))}`;
      }
      const terms = row.filter((p) => p > 0).map(f);
      const listed = terms.length > MAX_LISTED ? [...terms.slice(0, 3), '\\cdots'] : terms;
      return `p_{${sx}}(${f(xv)}) = ${listed.join(' + ')} = ${f(px[current] ?? 0)}`;
    }
    const yv = joint.ys[current] ?? 0;
    if (continuous) {
      return `f_{${sy}}(${f(yv)}) = \\int f(x, ${f(yv)})\\, dx \\approx ${f(density(py[current] ?? 0, source.cellY))}`;
    }
    const column = joint.xs
      .map((_, i) => joint.p[i]?.[current] ?? 0)
      .filter((p) => p > 0)
      .map(f);
    const listed = column.length > MAX_LISTED ? [...column.slice(0, 3), '\\cdots'] : column;
    return `p_{${sy}}(${f(yv)}) = ${listed.join(' + ')} = ${f(py[current] ?? 0)}`;
  })();
  const shownX = px.map((p, i) => (i < Math.min(stage, nx) ? p : 0));
  const shownY = py.map((p, j) => (j < Math.max(0, stage - nx) ? p : 0));
  const description =
    `Distribución conjunta de ${source.labelX} y ${source.labelY}. ` +
    `Marginal de X: ${px.slice(0, 12).map(f).join(', ')}${nx > 12 ? '...' : ''}. ` +
    `Marginal de Y: ${py.slice(0, 12).map(f).join(', ')}${ny > 12 ? '...' : ''}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        {
          label: 'Columnas sumadas',
          value: `${Math.min(stage, nx)} de ${nx}`,
          color: DATA_COLORS.primary,
        },
        {
          label: 'Filas sumadas',
          value: `${Math.max(0, stage - nx)} de ${ny}`,
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Suma de la marginal de X',
          value: f(shownX.reduce((a, b) => a + b, 0)),
        },
      ]}
      legend={[
        { label: 'Celda que se está sumando', color: DATA_COLORS.highlight },
        { label: 'Marginal de X (arriba)', color: DATA_COLORS.primary },
        { label: 'Marginal de Y (derecha)', color: DATA_COLORS.secondary },
      ]}
      description={description}
      dataTable={
        continuous
          ? undefined
          : {
              caption: 'Tabla conjunta con sus marginales',
              columns: [
                `${sx.replace(/[_^{}]/g, '')} \\ ${sy.replace(/[_^{}]/g, '')}`,
                ...joint.ys.map((v) => formatNumber(v, 2)),
                'marginal',
              ],
              rows: [
                ...joint.xs.map((xv, i) => [
                  formatNumber(xv, 2),
                  ...joint.ys.map((_, j) => f(joint.p[i]?.[j] ?? 0)),
                  f(px[i] ?? 0),
                ]),
                ['marginal', ...py.map(f), '1'],
              ],
            }
      }
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <JointGrid
        source={source}
        label={description}
        marginalX={shownX}
        marginalY={shownY}
        paint={(i, j) =>
          (doingX && i === current) || (!doingX && j === current)
            ? { color: DATA_COLORS.highlight }
            : { color: DATA_COLORS.primary }
        }
      />
      <p className={styles.caption}>
        {continuous
          ? 'Cada columna de la densidad se integra en la variable y para dar la altura de la marginal de X; cada fila, en x para la marginal de Y.'
          : 'Cada columna de la tabla se suma para dar la barra de X de arriba; cada fila, para la barra de Y de la derecha.'}
      </p>
    </VizFrame>
  );
}
