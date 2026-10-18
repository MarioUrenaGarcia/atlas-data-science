import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  marginalX,
  marginalY,
  productOfMarginals,
  summarizeJoint,
} from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { resolveJoint } from './source.ts';

const STAGES_PER_SECOND = 0.6;
const LAST_STAGE = 2;
/** Gaps below this are rounding, not dependence. */
const INDEPENDENCE_TOLERANCE = 1e-9;

interface IndependenceViewProps {
  title: string;
  config: JointDistribution2DConfig;
}

/**
 * Independence as a factorization: the joint table (left) is compared with
 * the product of its marginals (center), which is what the joint would be if
 * X and Y were independent. The right panel shows the difference cell by
 * cell, positive in one color and negative in the other; X and Y are
 * independent exactly when every difference is zero.
 */
export function IndependenceView({ title, config }: IndependenceViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const product = useMemo(() => productOfMarginals(joint), [joint]);
  const px = marginalX(joint).probs;
  const py = marginalY(joint).probs;
  const summary = summarizeJoint(joint);
  let worst = { i: 0, j: 0, gap: 0 };
  joint.xs.forEach((_x, i) =>
    joint.ys.forEach((_y, j) => {
      const gap = (joint.p[i]?.[j] ?? 0) - (product.p[i]?.[j] ?? 0);
      if (Math.abs(gap) > Math.abs(worst.gap)) worst = { i, j, gap };
    }),
  );
  const independent = Math.abs(worst.gap) < INDEPENDENCE_TOLERANCE;
  const pMax = Math.max(1e-12, ...joint.p.flat(), ...product.p.flat());
  const gapMax = Math.max(
    1e-12,
    ...joint.p.flat().map((p, k) => Math.abs(p - (product.p.flat()[k] ?? 0))),
  );

  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, continuous ? 5 : 4);
  const wx = formatNumber(joint.xs[worst.i] ?? 0, 2);
  const wy = formatNumber(joint.ys[worst.j] ?? 0, 2);
  const pw = joint.p[worst.i]?.[worst.j] ?? 0;
  const prodW = product.p[worst.i]?.[worst.j] ?? 0;
  const header = [
    `p(x, y) = P(${sx} = x,\\ ${sy} = y)`,
    `p_{${sx}}(${wx})\\, p_{${sy}}(${wy}) = ${f(px[worst.i] ?? 0)} \\cdot ${f(py[worst.j] ?? 0)} = ${f(prodW)}`,
    independent
      ? `p(x, y) = p_{${sx}}(x)\\, p_{${sy}}(y) \\text{ en todas las celdas: independientes}`
      : `p(${wx}, ${wy}) = ${f(pw)} \\ne ${f(prodW)} = p_{${sx}}(${wx})\\, p_{${sy}}(${wy})`,
  ][stage];
  const description =
    `${source.labelX} y ${source.labelY}: ${independent ? 'independientes' : 'dependientes'}. ` +
    `Mayor diferencia entre la conjunta y el producto de marginales: ${f(Math.abs(worst.gap))}, en x = ${wx}, y = ${wy}. ` +
    `Covarianza ${formatNumber(summary.covariance, 4)}.`;
  const shade = (p: number) => 0.06 + 0.9 * (p / pMax);

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Mayor diferencia', value: f(Math.abs(worst.gap)), color: DATA_COLORS.highlight },
        { label: 'Celda', value: `(${wx}, ${wy})` },
        { label: 'Covarianza', value: formatNumber(summary.covariance, 4) },
        { label: 'Conclusión', value: independent ? 'independientes' : 'dependientes' },
      ]}
      legend={[
        { label: 'Probabilidad', color: DATA_COLORS.primary },
        { label: 'Diferencia positiva', color: DATA_COLORS.positive },
        { label: 'Diferencia negativa', color: DATA_COLORS.negative },
      ]}
      description={description}
    >
      <FormulaLine tex={header ?? ''} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <figure className={styles.panel}>
          <JointGrid
            source={source}
            label={`Distribución conjunta. ${description}`}
            aspect={0.95}
            maxHeight={300}
            showMarginals={false}
            paint={(_i, _j, p) => ({ color: DATA_COLORS.primary, opacity: shade(p) })}
          />
          <figcaption className={styles.caption}>Conjunta p(x, y)</figcaption>
        </figure>
        <figure className={styles.panel} style={{ opacity: stage >= 1 ? 1 : 0.2 }}>
          <JointGrid
            source={source}
            probs={product.p}
            label={`Producto de las marginales. ${description}`}
            aspect={0.95}
            maxHeight={300}
            showMarginals={false}
            paint={(_i, _j, p) => ({ color: DATA_COLORS.primary, opacity: shade(p) })}
          />
          <figcaption className={styles.caption}>Producto de marginales</figcaption>
        </figure>
        <figure className={styles.panel} style={{ opacity: stage >= 2 ? 1 : 0.2 }}>
          <JointGrid
            source={source}
            probs={joint.p.map((row) => row.map(() => 1))}
            label={`Diferencia entre la conjunta y el producto. ${description}`}
            aspect={0.95}
            maxHeight={300}
            showMarginals={false}
            cellText={(i, j) => {
              const d = (joint.p[i]?.[j] ?? 0) - (product.p[i]?.[j] ?? 0);
              return Math.abs(d) < INDEPENDENCE_TOLERANCE ? '0' : formatNumber(d, 3);
            }}
            paint={(i, j) => {
              const d = (joint.p[i]?.[j] ?? 0) - (product.p[i]?.[j] ?? 0);
              return {
                color: d >= 0 ? DATA_COLORS.positive : DATA_COLORS.negative,
                opacity:
                  Math.abs(d) < INDEPENDENCE_TOLERANCE ? 0.04 : 0.15 + 0.8 * (Math.abs(d) / gapMax),
              };
            }}
          />
          <figcaption className={styles.caption}>Diferencia</figcaption>
        </figure>
      </div>
      <p className={styles.caption}>
        Si las variables fueran independientes, la conjunta coincidiría con el producto de sus
        marginales en cada celda y el panel de diferencias quedaría vacío.
      </p>
    </VizFrame>
  );
}
