import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { apply, matLatex, matText, vecText, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { OriginLine } from '../../core/svg/OriginLine.tsx';
import { fundamentalSubspaces, pseudoInverse2 } from './subspaces.ts';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const PLANE_EXTENT = 4;
const INITIAL_B: Vec2 = [1, 3];

interface PseudoViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * Ax = b with a matrix that may be singular. On the output side b is replaced
 * by its projection onto the column space, the closest vector that can be
 * reached. On the input side every x on a line reaches that projection; the
 * pseudoinverse picks the one closest to the origin, which lies in the row
 * space and is perpendicular to the null space.
 */
export function PseudoView({ title, matrices }: PseudoViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [run, setRun] = useState(0);
  const [b, setB] = useResettableState<Vec2>(`${JSON.stringify(matrix)}|${run}`, () => INITIAL_B);
  const spaces = fundamentalSubspaces(matrix);
  const plus = pseudoInverse2(matrix);
  const x = apply(plus, b);
  const reached = apply(matrix, x);
  const residual: Vec2 = [b[0] - reached[0], b[1] - reached[1]];
  const residualNorm = Math.hypot(residual[0], residual[1]);
  const exact = residualNorm < 1e-9;
  const description =
    `Rango ${spaces.rank}. b = ${vecText(b)}; lo más cercano que A puede alcanzar es ${vecText(reached)}, a distancia ${formatNumber(residualNorm, 3)}. ` +
    `x⁺ = A⁺ b = ${vecText(x)}` +
    (spaces.rank === 1
      ? ', el punto más cercano al origen de la recta de soluciones de mínimos cuadrados.'
      : '.');

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
        { label: 'Rango de A', value: String(spaces.rank) },
        { label: 'A⁺', value: matText(plus, 3) },
        { label: 'b', value: vecText(b), color: DATA_COLORS.highlight },
        { label: 'A x⁺ (proyección de b)', value: vecText(reached), color: DATA_COLORS.secondary },
        { label: '|b - A x⁺|', value: formatNumber(exact ? 0 : residualNorm, 3) },
        { label: 'x⁺ = A⁺ b', value: vecText(x), color: DATA_COLORS.primary },
        { label: '|x⁺|', value: formatNumber(Math.hypot(x[0], x[1]), 3) },
      ]}
      legend={[
        { label: 'Espacio columna', color: DATA_COLORS.secondary, shape: 'line' },
        {
          label: 'Soluciones de mínimos cuadrados',
          color: DATA_COLORS.quaternary,
          shape: 'dashed',
        },
        { label: 'Espacio fila', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A = ${matLatex(matrix)},\\quad A^{+} = V\\,\\Sigma^{+}\\,U^\\top = ${matLatex(plus, 3)}`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Salida: b y su proyección</p>
          <CartesianPlane
            extent={PLANE_EXTENT}
            label={description}
            interactive
            aspect={0.9}
            minHeight={240}
            maxHeight={380}
          >
            {(plane) => (
              <>
                {spaces.rank === 1 && (
                  <OriginLine
                    plane={plane}
                    direction={spaces.column}
                    color={DATA_COLORS.secondary}
                  />
                )}
                {spaces.rank === 2 && (
                  <rect
                    aria-hidden="true"
                    x={0}
                    y={0}
                    width="100%"
                    height="100%"
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.07}
                  />
                )}
                <VectorArrow
                  plane={plane}
                  to={reached}
                  color={DATA_COLORS.secondary}
                  label="A x⁺"
                  width={3}
                />
                {!exact && (
                  <VectorArrow
                    plane={plane}
                    from={reached}
                    to={b}
                    color={DATA_COLORS.muted}
                    width={1.5}
                    dashed
                  />
                )}
                <DraggableVector
                  plane={plane}
                  value={b}
                  onChange={(value) => setB(() => value)}
                  color={DATA_COLORS.highlight}
                  label="b"
                  handleLabel="Punta del vector b"
                />
              </>
            )}
          </CartesianPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>Entrada: la solución de norma mínima</p>
          <CartesianPlane
            extent={PLANE_EXTENT}
            label={description}
            aspect={0.9}
            minHeight={240}
            maxHeight={380}
          >
            {(plane) => (
              <>
                {spaces.rank === 1 && (
                  <>
                    <OriginLine
                      plane={plane}
                      direction={spaces.row}
                      color={DATA_COLORS.primary}
                      width={1.5}
                    />
                    <OriginLine
                      plane={plane}
                      direction={spaces.nullDirection}
                      color={DATA_COLORS.quaternary}
                      dashed
                      through={x}
                    />
                  </>
                )}
                <VectorArrow
                  plane={plane}
                  to={x}
                  color={DATA_COLORS.primary}
                  label="x⁺"
                  width={3}
                />
              </>
            )}
          </CartesianPlane>
        </div>
      </div>
    </VizFrame>
  );
}
