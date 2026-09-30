import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SUBSETS, type PlaneSubset } from './closure.ts';
import type { Vec2 } from './schema.ts';
import { SubsetShape } from './SubsetShape.tsx';
import { useVectors } from './useVectors.ts';
import { add, scale, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

interface ClosureViewProps {
  title: string;
  subsets: readonly PlaneSubset[];
  u: Vec2;
  v: Vec2;
}

/**
 * The subspace test in the plane. Two vectors are kept inside a candidate set
 * while they are dragged; their sum and a scalar multiple are drawn in green
 * when they stay in the set and in orange when they leave it. A set is a
 * subspace exactly when it contains zero and nothing ever leaves.
 */
export function ClosureView({ title, subsets, u, v }: ClosureViewProps) {
  const definitions = useMemo(
    () => [
      {
        type: 'select' as const,
        key: 'conjunto',
        label: 'Conjunto W',
        options: subsets.map((subset) => ({ value: subset, label: SUBSETS[subset].label })),
        default: subsets[0] ?? 'recta-origen',
      },
      {
        type: 'number' as const,
        key: 'c',
        label: 'Escalar',
        symbol: 'c',
        min: -3,
        max: 3,
        step: 0.25,
        default: -1.5,
        digits: 2,
      },
    ],
    [subsets],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string | number>;
  const subset = (values.conjunto as PlaneSubset) ?? subsets[0] ?? 'recta-origen';
  const info = SUBSETS[subset];
  const c = Number(values.c);
  const initial = useMemo(() => [info.project(u), info.project(v)], [info, u, v]);
  const { vectors, set, reset } = useVectors(initial);
  const [a = initial[0] ?? u, b = initial[1] ?? v] = vectors;
  const sum = add(a, b);
  const multiple = scale(a, c);
  const sumInside = info.contains(sum);
  const multipleInside = info.contains(multiple);
  const zeroInside = info.contains([0, 0]);
  const color = (inside: boolean) => (inside ? DATA_COLORS.tertiary : DATA_COLORS.quaternary);
  const verdict = info.subspace
    ? 'W es un subespacio: contiene al cero y es cerrado bajo suma y producto por escalar.'
    : `W no es un subespacio. ${info.failure}`;
  const description =
    `${info.label}. u = ${vecText(a)}, v = ${vecText(b)}; u + v = ${vecText(sum)} ${sumInside ? 'está' : 'no está'} en W; ` +
    `${formatNumber(c, 2)} u = ${vecText(multiple)} ${multipleInside ? 'está' : 'no está'} en W. ${verdict}`;

  return (
    <VizFrame
      title={title}
      parameters={{
        ...parameters,
        values: values as Record<string, unknown>,
        reset: () => {
          parameters.reset();
          reset();
        },
      }}
      readouts={[
        { label: '¿0 está en W?', value: zeroInside ? 'sí' : 'no', color: color(zeroInside) },
        {
          label: 'u + v',
          value: `${vecText(sum)}: ${sumInside ? 'en W' : 'fuera de W'}`,
          color: color(sumInside),
        },
        {
          label: 'c u',
          value: `${vecText(multiple)}: ${multipleInside ? 'en W' : 'fuera de W'}`,
          color: color(multipleInside),
        },
        { label: '¿Subespacio?', value: info.subspace ? 'sí' : 'no' },
      ]}
      legend={[
        { label: 'Conjunto W', color: DATA_COLORS.neutral },
        { label: 'Resultado dentro de W', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Resultado fuera de W', color: DATA_COLORS.quaternary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`${info.latex},\\qquad \\mathbf{u}, \\mathbf{v} \\in W \\ \\overset{?}{\\Longrightarrow}\\ \\mathbf{u} + \\mathbf{v} \\in W,\\ c\\,\\mathbf{u} \\in W`}
        />
      </p>
      <p className={styles.stage}>{verdict}</p>
      <CartesianPlane extent={5} label={description} interactive>
        {(plane) => (
          <>
            <SubsetShape plane={plane} subset={subset} />
            <VectorArrow plane={plane} to={sum} color={color(sumInside)} label="u + v" width={3} />
            <VectorArrow
              plane={plane}
              to={multiple}
              color={color(multipleInside)}
              label="c u"
              width={3}
              dashed
            />
            <DraggableVector
              plane={plane}
              value={a}
              onChange={(value) => set(0, info.project(value))}
              color={DATA_COLORS.primary}
              label="u"
              handleLabel="Punta del vector u"
            />
            <DraggableVector
              plane={plane}
              value={b}
              onChange={(value) => set(1, info.project(value))}
              color={DATA_COLORS.secondary}
              label="v"
              handleLabel="Punta del vector v"
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
