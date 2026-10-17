import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { summarizeJoint } from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { normalParameters, resolveJoint } from './source.ts';

const DISCRETE_RATE = 1.2;
const DENSE_RATE = 16;
const MAX_LISTED = 4;

interface CovarianceViewProps {
  title: string;
  config: JointDistribution2DConfig;
}

/**
 * Covariance as a sum of signed contributions: the lines through the means
 * split the plane into four quadrants, and each cell adds
 * (x - mu_X)(y - mu_Y) p(x, y), positive in the upper right and lower left,
 * negative in the other two. The animation adds the columns one by one; at
 * the end the covariance is divided by both standard deviations to give the
 * correlation. For the bivariate normal the correlation can be moved with a
 * slider.
 */
export function CovarianceView({ title, config }: CovarianceViewProps) {
  const editable = Boolean(config.editable) && config.modelo === 'normal-bivariada';
  const definitions = useMemo(
    () =>
      editable
        ? [
            {
              type: 'number' as const,
              key: 'rho',
              label: 'Correlación del modelo',
              symbol: 'ρ',
              min: -0.95,
              max: 0.95,
              step: 0.05,
              digits: 2,
              default: normalParameters(config).rho,
            },
          ]
        : [],
    [editable, config],
  );
  const parameters = useParameters(definitions);
  const rho = (parameters.values as Record<string, number>).rho;
  const source = useMemo(
    () => resolveJoint(config, rho === undefined ? {} : { rho }),
    [config, rho],
  );
  const { joint, continuous } = source;
  const summary = useMemo(() => summarizeJoint(joint), [joint]);
  const { meanX, meanY, covariance, correlation } = summary;
  const sdX = Math.sqrt(summary.varX);
  const sdY = Math.sqrt(summary.varY);
  const contribution = (i: number, j: number) =>
    ((joint.xs[i] ?? 0) - meanX) * ((joint.ys[j] ?? 0) - meanY) * (joint.p[i]?.[j] ?? 0);
  const maxContribution = Math.max(
    1e-12,
    ...joint.xs.flatMap((_x, i) => joint.ys.map((_y, j) => Math.abs(contribution(i, j)))),
  );
  const columns = joint.xs.length;
  const total = columns + 1;

  const [run, setRun] = useState(0);
  const [stage, update] = useResettableState(`${run}|${rho ?? ''}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(total, value + 1)),
    stepMany: (count) => update((value) => Math.min(total, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: continuous ? DENSE_RATE : DISCRETE_RATE,
    done: stage >= total,
  });
  const added = Math.min(stage, columns);
  let partial = 0;
  let positive = 0;
  let negative = 0;
  joint.xs.forEach((_x, i) =>
    joint.ys.forEach((_y, j) => {
      const c = contribution(i, j);
      if (c > 0) positive += c;
      else negative += c;
      if (i < added) partial += c;
    }),
  );
  const sx = source.symbolX;
  const sy = source.symbolY;
  const f = (v: number) => formatNumber(v, 3);
  const header = (() => {
    if (stage > columns) {
      return `\\rho = \\frac{\\operatorname{Cov}(${sx}, ${sy})}{\\sigma_{${sx}}\\, \\sigma_{${sy}}} = \\frac{${f(covariance)}}{${f(sdX)} \\cdot ${f(sdY)}} = ${f(correlation)}`;
    }
    if (added === 0) {
      return `\\operatorname{Cov}(${sx}, ${sy}) = \\mathbb{E}\\big[(${sx} - \\mu_{${sx}})(${sy} - \\mu_{${sy}})\\big], \\quad \\mu_{${sx}} = ${f(meanX)},\\ \\mu_{${sy}} = ${f(meanY)}`;
    }
    if (continuous) {
      return `\\operatorname{Cov}(${sx}, ${sy}) \\approx ${f(partial)} \\quad (${added} \\text{ de } ${columns} \\text{ columnas})`;
    }
    const sums = joint.xs
      .slice(0, added)
      .map((_x, i) => joint.ys.reduce((s, _y, j) => s + contribution(i, j), 0));
    const terms = sums.map(f);
    const listed =
      terms.length > MAX_LISTED ? [...terms.slice(0, 2), '\\cdots', ...terms.slice(-1)] : terms;
    return `\\operatorname{Cov}(${sx}, ${sy}) ${added < columns ? '\\approx' : '='} ${listed.join(' + ')} = ${f(partial)}`;
  })();
  const description =
    `${source.labelX} y ${source.labelY}. Medias ${f(meanX)} y ${f(meanY)}. ` +
    `Contribuciones positivas ${f(positive)}, negativas ${f(negative)}; covarianza ${f(covariance)}, correlación ${f(correlation)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={editable ? { ...parameters, values: parameters.values } : undefined}
      readouts={[
        { label: 'Suma de positivas', value: f(positive), color: DATA_COLORS.positive },
        { label: 'Suma de negativas', value: f(negative), color: DATA_COLORS.negative },
        { label: 'Cov(X, Y)', value: f(covariance), color: DATA_COLORS.highlight },
        { label: 'σX, σY', value: `${f(sdX)}, ${f(sdY)}` },
        { label: 'Correlación ρ', value: f(correlation) },
      ]}
      legend={[
        { label: 'Contribución positiva', color: DATA_COLORS.positive },
        { label: 'Contribución negativa', color: DATA_COLORS.negative },
        { label: 'Medias de X y de Y', color: DATA_COLORS.text, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <JointGrid
        source={source}
        label={description}
        cellText={(i, j) => {
          const c = contribution(i, j);
          return Math.abs(c) < 1e-12 ? null : formatNumber(c, 3);
        }}
        paint={(i, j) => {
          const c = contribution(i, j);
          return {
            color: c >= 0 ? DATA_COLORS.positive : DATA_COLORS.negative,
            opacity:
              (i < added || stage === 0 ? 1 : 0.35) *
              (0.06 + 0.9 * (Math.abs(c) / maxContribution)),
          };
        }}
        overlay={({ x, y, left, right, top, bottom }) => (
          <g aria-hidden="true">
            <line
              x1={x(meanX)}
              x2={x(meanX)}
              y1={top}
              y2={bottom}
              stroke={DATA_COLORS.text}
              strokeDasharray="5 4"
            />
            <line
              x1={left}
              x2={right}
              y1={y(meanY)}
              y2={y(meanY)}
              stroke={DATA_COLORS.text}
              strokeDasharray="5 4"
            />
          </g>
        )}
      />
      <p className={styles.caption}>
        Las líneas punteadas pasan por las medias. Las celdas arriba a la derecha y abajo a la
        izquierda aportan positivo; las otras dos esquinas, negativo. La covarianza es el balance.
      </p>
    </VizFrame>
  );
}
