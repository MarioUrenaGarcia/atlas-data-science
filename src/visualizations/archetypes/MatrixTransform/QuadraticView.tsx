import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane, type PlaneScales } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { eigen, matLatex, vecText, type Mat2, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const LEVELS = [0.5, 1, 2, 4];
const ANGLE_SAMPLES = 360;
const FAR = 40;
/** Eigenvalues smaller than this in absolute value count as zero. */
const ZERO = 1e-9;

const quadratic = (s: Mat2, x: Vec2) =>
  s[0][0] * x[0] * x[0] + 2 * s[0][1] * x[0] * x[1] + s[1][1] * x[1] * x[1];

function classify(l1: number, l2: number): string {
  const sign = (value: number) => (Math.abs(value) < ZERO ? 0 : Math.sign(value));
  const a = sign(l1);
  const b = sign(l2);
  if (a > 0 && b > 0) return 'definida positiva';
  if (a < 0 && b < 0) return 'definida negativa';
  if (a * b < 0) return 'indefinida';
  if (a === 0 && b === 0) return 'nula';
  return a + b > 0 ? 'semidefinida positiva' : 'semidefinida negativa';
}

/** Polylines of the level set xᵀSx = c, traced along rays from the origin. */
function levelPaths(s: Mat2, level: number, plane: PlaneScales): string[] {
  const limit = Math.hypot(plane.xDomain[1], plane.yDomain[1]) * 1.2;
  const paths: string[] = [];
  let current: string[] = [];
  for (let index = 0; index <= ANGLE_SAMPLES; index += 1) {
    const theta = (2 * Math.PI * index) / ANGLE_SAMPLES;
    const direction: Vec2 = [Math.cos(theta), Math.sin(theta)];
    const q = quadratic(s, direction);
    const r = q * level > 0 ? Math.sqrt(level / q) : Infinity;
    if (r < limit) {
      current.push(`${plane.x(r * direction[0])},${plane.y(r * direction[1])}`);
    } else if (current.length > 0) {
      paths.push(current.join(' '));
      current = [];
    }
  }
  if (current.length > 0) paths.push(current.join(' '));
  return paths;
}

interface QuadraticViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * Level curves of q(x) = xᵀAx. Only the symmetric part of A matters, and
 * its eigenvalues decide the shape: ellipses when both are positive (or
 * both negative), hyperbolas when they have opposite signs and parallel
 * lines when one is zero. The eigenvectors are the axes of the curves.
 */
export function QuadraticView({ title, matrices }: QuadraticViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const offDiagonal = (matrix[0][1] + matrix[1][0]) / 2;
  const s: Mat2 = [
    [matrix[0][0], offDiagonal],
    [offDiagonal, matrix[1][1]],
  ];
  const [run, setRun] = useState(0);
  const [point, setPoint] = useResettableState<Vec2>(`${JSON.stringify(matrix)}|${run}`, () => [
    1, 1,
  ]);
  const { real, vectors } = eigen(s);
  const kind = classify(real[0], real[1]);
  const value = quadratic(s, point);
  const description =
    `La forma cuadrática es ${kind}: valores propios de la parte simétrica ${formatNumber(real[0], 3)} y ${formatNumber(real[1], 3)}. ` +
    `En x = ${vecText(point)} vale q(x) = ${formatNumber(value, 3)}.`;

  return (
    <VizFrame
      title={title}
      parameters={{
        ...parameters,
        values: values as Record<string, unknown>,
        reset: () => {
          parameters.reset();
          setRun((n) => n + 1);
        },
      }}
      readouts={[
        { label: 'x', value: vecText(point), color: DATA_COLORS.highlight },
        {
          label: 'q(x) = xᵀ A x',
          value: formatNumber(value, 3),
          color: value >= 0 ? DATA_COLORS.primary : DATA_COLORS.secondary,
        },
        {
          label: 'Valores propios de S',
          value: `${formatNumber(real[0], 3)} y ${formatNumber(real[1], 3)}`,
        },
        { label: 'Clasificación', value: kind },
      ]}
      legend={[
        { label: 'Curvas q(x) = c con c > 0', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Curvas q(x) = c con c < 0', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Ejes propios', color: DATA_COLORS.quaternary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`q(\\mathbf{x}) = \\mathbf{x}^\\top \\mathbf{S}\\,\\mathbf{x},\\quad \\mathbf{S} = \\tfrac{1}{2}(\\mathbf{A} + \\mathbf{A}^\\top) = ${matLatex(s)}`}
        />
      </p>
      <CartesianPlane extent={4} label={description} interactive>
        {(plane) => (
          <>
            <g aria-hidden="true">
              {LEVELS.flatMap((level) => [
                ...levelPaths(s, level, plane).map((path, index) => (
                  <polyline
                    key={`p${level}-${index}`}
                    points={path}
                    fill="none"
                    stroke={DATA_COLORS.primary}
                    strokeWidth={level === 1 ? 2.5 : 1.5}
                  />
                )),
                ...levelPaths(s, -level, plane).map((path, index) => (
                  <polyline
                    key={`n${level}-${index}`}
                    points={path}
                    fill="none"
                    stroke={DATA_COLORS.secondary}
                    strokeWidth={level === 1 ? 2.5 : 1.5}
                  />
                )),
              ])}
              {vectors?.map((vector, index) => (
                <line
                  key={index}
                  x1={plane.x(-(vector[0] ?? 0) * FAR)}
                  y1={plane.y(-(vector[1] ?? 0) * FAR)}
                  x2={plane.x((vector[0] ?? 0) * FAR)}
                  y2={plane.y((vector[1] ?? 0) * FAR)}
                  stroke={DATA_COLORS.quaternary}
                  strokeWidth={2}
                  strokeDasharray="8 5"
                />
              ))}
            </g>
            <DraggableVector
              plane={plane}
              value={point}
              onChange={(value) => setPoint(() => value)}
              color={DATA_COLORS.highlight}
              label="x"
              handleLabel="Punto x"
            />
          </>
        )}
      </CartesianPlane>
    </VizFrame>
  );
}
