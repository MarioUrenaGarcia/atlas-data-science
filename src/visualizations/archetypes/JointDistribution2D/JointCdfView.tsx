import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { cdfAt } from '../../../lib/probability/randomVariable.ts';
import { jointCdf, marginalX, marginalY } from '../../../lib/probability/joint.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { niceStep } from '../RandomVariableLab/source.ts';
import styles from './JointDistribution2D.module.css';
import { JointGrid } from './JointGrid.tsx';
import type { JointDistribution2DConfig } from './schema.ts';
import { resolveJoint } from './source.ts';

const SWEEP_STEPS = 40;
const STEPS_PER_SECOND = 6;
const MAX_LISTED = 6;

interface JointCdfViewProps {
  title: string;
  config: JointDistribution2DConfig;
}

/**
 * The joint distribution as a table or a density map, with the joint
 * distribution function F(x, y) = P(X <= x, Y <= y) as the mass of the lower
 * left quadrant at the chosen corner. The sweep moves the corner along the
 * diagonal so F grows from 0 to 1.
 */
export function JointCdfView({ title, config }: JointCdfViewProps) {
  const source = useMemo(() => resolveJoint(config), [config]);
  const { joint, continuous } = source;
  const [x0, x1] = source.xDomain;
  const [y0, y1] = source.yDomain;
  const stepX = continuous ? niceStep(x1 - x0) : 0.5;
  const stepY = continuous ? niceStep(y1 - y0) : 0.5;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Esquina en x',
        symbol: 'x',
        min: Number(x0.toFixed(2)),
        max: Number(x1.toFixed(2)),
        step: stepX,
        digits: continuous ? 2 : 1,
        default: config.x ?? (x0 + x1) / 2,
      },
      {
        type: 'number' as const,
        key: 'y',
        label: 'Esquina en y',
        symbol: 'y',
        min: Number(y0.toFixed(2)),
        max: Number(y1.toFixed(2)),
        step: stepY,
        digits: continuous ? 2 : 1,
        default: config.y ?? (y0 + y1) / 2,
      },
    ],
    [x0, x1, y0, y1, stepX, stepY, continuous, config.x, config.y],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const x = values.x ?? 0;
  const y = values.y ?? 0;
  const progress = (x - x0) / (x1 - x0);
  const playback = usePlayback({
    step: () => {
      const next = Math.min(1, progress + 1 / SWEEP_STEPS);
      parameters.set('x', x0 + next * (x1 - x0));
      parameters.set('y', y0 + next * (y1 - y0));
    },
    reset: () => {
      parameters.set('x', x0);
      parameters.set('y', y0);
    },
    rate: STEPS_PER_SECOND,
    done: x >= x1 - stepX / 2 && y >= y1 - stepY / 2,
    autoplay: false,
  });

  const F = jointCdf(joint, x, y);
  const Fx = cdfAt(marginalX(joint), x);
  const Fy = cdfAt(marginalY(joint), y);
  const sx = source.symbolX;
  const sy = source.symbolY;
  const inside: number[] = [];
  joint.xs.forEach((xv, i) =>
    joint.ys.forEach((yv, j) => {
      const p = joint.p[i]?.[j] ?? 0;
      if (xv <= x && yv <= y && p > 0) inside.push(p);
    }),
  );
  const f2 = (v: number) => formatNumber(v, 2);
  const terms =
    !continuous && inside.length > 0
      ? ` = ${(inside.length > MAX_LISTED ? [...inside.slice(0, 3), '\\cdots'] : inside)
          .map((p) => (typeof p === 'number' ? formatNumber(p, 3) : p))
          .join(' + ')}`
      : '';
  const header = `F(${f2(x)}, ${f2(y)}) = P(${sx} \\le ${f2(x)},\\ ${sy} \\le ${f2(y)})${terms} = ${formatNumber(F, 4)}`;
  const description =
    `Distribución conjunta de ${source.labelX} y ${source.labelY}. ` +
    `P(X ≤ ${f2(x)}, Y ≤ ${f2(y)}) = ${formatNumber(F, 4)}; P(X ≤ ${f2(x)}) = ${formatNumber(Fx, 4)}; P(Y ≤ ${f2(y)}) = ${formatNumber(Fy, 4)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'F(x, y)', value: formatNumber(F, 4), color: DATA_COLORS.highlight },
        { label: 'P(X ≤ x)', value: formatNumber(Fx, 4), color: DATA_COLORS.primary },
        { label: 'P(Y ≤ y)', value: formatNumber(Fy, 4), color: DATA_COLORS.secondary },
        { label: 'P(X ≤ x) P(Y ≤ y)', value: formatNumber(Fx * Fy, 4) },
      ]}
      legend={[
        { label: 'Probabilidad de cada celda', color: DATA_COLORS.primary },
        { label: 'Cuadrante X ≤ x, Y ≤ y', color: DATA_COLORS.highlight },
        { label: 'Marginal de X (arriba)', color: DATA_COLORS.primary },
        { label: 'Marginal de Y (derecha)', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <JointGrid
        source={source}
        label={description}
        paint={(i, j, p) => {
          const inQuadrant = (joint.xs[i] ?? 0) <= x && (joint.ys[j] ?? 0) <= y;
          return inQuadrant
            ? {
                color: DATA_COLORS.highlight,
                opacity: 0.25 + 0.7 * Math.min(1, p / maxCell(joint.p)),
              }
            : { color: DATA_COLORS.primary };
        }}
        marginalColorX={(i) =>
          (joint.xs[i] ?? 0) <= x ? DATA_COLORS.primary : DATA_COLORS.neutral
        }
        marginalColorY={(j) =>
          (joint.ys[j] ?? 0) <= y ? DATA_COLORS.secondary : DATA_COLORS.neutral
        }
        overlay={({ x: sxScale, y: syScale, left, bottom }) => (
          <g aria-hidden="true">
            <rect
              x={left}
              y={syScale(y)}
              width={Math.max(0, sxScale(x) - left)}
              height={Math.max(0, bottom - syScale(y))}
              fill="none"
              stroke={DATA_COLORS.highlight}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <circle cx={sxScale(x)} cy={syScale(y)} r={6} fill={DATA_COLORS.highlight} />
          </g>
        )}
      />
      <p className={styles.caption}>
        La esquina marca el punto (x, y); la probabilidad acumulada F(x, y) es la masa del
        rectángulo de abajo a la izquierda. Las barras de los bordes son las distribuciones
        marginales.
      </p>
    </VizFrame>
  );
}

function maxCell(p: readonly (readonly number[])[]): number {
  return Math.max(1e-12, ...p.flat());
}
