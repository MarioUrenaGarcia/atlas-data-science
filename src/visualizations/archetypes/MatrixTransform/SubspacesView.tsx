import { useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { apply, matLatex, vecText, type Vec2 } from './matrix2.ts';
import styles from './MatrixTransform.module.css';
import { OriginLine } from '../../core/svg/OriginLine.tsx';
import { along, fundamentalSubspaces } from './subspaces.ts';
import { useMatrixChoice, type NamedMatrix } from './useMatrixChoice.ts';

const PLANE_EXTENT = 4;
const INITIAL_X: Vec2 = [2, 1];

const SPACE_TEXT = {
  0: { row: 'solo el origen', null: 'todo el plano', column: 'solo el origen' },
  1: { row: 'una recta', null: 'una recta', column: 'una recta' },
  2: { row: 'todo el plano', null: 'solo el origen', column: 'todo el plano' },
} as const;

interface SubspacesViewProps {
  title: string;
  matrices: readonly NamedMatrix[];
}

/**
 * The four fundamental subspaces of a 2x2 matrix in two panels. On the input
 * side x splits into a row space part and a null space part; the null part is
 * sent to zero, so Ax only depends on the row part and always lands in the
 * column space. The dimensions of row space and null space add up to 2.
 */
export function SubspacesView({ title, matrices }: SubspacesViewProps) {
  const { parameters, values, matrix } = useMatrixChoice(matrices);
  const [run, setRun] = useState(0);
  const [x, setX] = useResettableState<Vec2>(`${JSON.stringify(matrix)}|${run}`, () => INITIAL_X);
  const spaces = fundamentalSubspaces(matrix);
  const { rank } = spaces;
  const nullity = 2 - rank;
  const rowPart: Vec2 = rank === 2 ? x : rank === 0 ? [0, 0] : along(x, spaces.row);
  const nullPart: Vec2 = [x[0] - rowPart[0], x[1] - rowPart[1]];
  const image = apply(matrix, x);
  const text = SPACE_TEXT[rank];
  const description =
    `Rango ${rank} y nulidad ${nullity}, que suman 2. Espacio fila: ${text.row}; espacio nulo: ${text.null}; espacio columna: ${text.column}. ` +
    `x = ${vecText(x)} se separa en ${vecText(rowPart)} del espacio fila más ${vecText(nullPart)} del espacio nulo, y A x = ${vecText(image)}.`;

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
        { label: 'Rango (dim. espacio columna = dim. espacio fila)', value: String(rank) },
        { label: 'Nulidad (dim. espacio nulo)', value: String(nullity) },
        { label: 'Rango + nulidad', value: `${rank + nullity} = número de columnas` },
        { label: 'x', value: vecText(x), color: DATA_COLORS.highlight },
        { label: 'Parte en el espacio fila', value: vecText(rowPart), color: DATA_COLORS.primary },
        {
          label: 'Parte en el espacio nulo',
          value: vecText(nullPart),
          color: DATA_COLORS.quaternary,
        },
        { label: 'A x', value: vecText(image), color: DATA_COLORS.secondary },
        { label: '|A x|', value: formatNumber(Math.hypot(image[0], image[1]), 3) },
      ]}
      legend={[
        { label: 'Espacio fila', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Espacio nulo', color: DATA_COLORS.quaternary, shape: 'dashed' },
        { label: 'Espacio columna', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`A = ${matLatex(matrix)},\\qquad \\operatorname{rango}(A) + \\operatorname{nulidad}(A) = ${rank} + ${nullity} = 2`}
        />
      </p>
      <div className={styles.pair}>
        <div>
          <p className={styles.panelTitle}>Entrada: x = parte fila + parte nula</p>
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
                {rank === 2 && (
                  <rect
                    aria-hidden="true"
                    x={0}
                    y={0}
                    width="100%"
                    height="100%"
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.07}
                  />
                )}
                {rank === 0 && (
                  <rect
                    aria-hidden="true"
                    x={0}
                    y={0}
                    width="100%"
                    height="100%"
                    fill={DATA_COLORS.quaternary}
                    fillOpacity={0.09}
                  />
                )}
                {rank === 1 && (
                  <>
                    <OriginLine plane={plane} direction={spaces.row} color={DATA_COLORS.primary} />
                    <OriginLine
                      plane={plane}
                      direction={spaces.nullDirection}
                      color={DATA_COLORS.quaternary}
                      dashed
                    />
                    <VectorArrow
                      plane={plane}
                      to={rowPart}
                      color={DATA_COLORS.primary}
                      width={2.5}
                    />
                    <VectorArrow
                      plane={plane}
                      from={rowPart}
                      to={x}
                      color={DATA_COLORS.quaternary}
                      width={2}
                      dashed
                    />
                  </>
                )}
                <DraggableVector
                  plane={plane}
                  value={x}
                  onChange={(value) => setX(() => value)}
                  color={DATA_COLORS.highlight}
                  label="x"
                  handleLabel="Punta del vector x"
                />
              </>
            )}
          </CartesianPlane>
        </div>
        <div>
          <p className={styles.panelTitle}>Salida: A x cae en el espacio columna</p>
          <CartesianPlane
            extent={PLANE_EXTENT}
            label={description}
            aspect={0.9}
            minHeight={240}
            maxHeight={380}
          >
            {(plane) => (
              <>
                {rank === 2 && (
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
                {rank === 1 && (
                  <OriginLine
                    plane={plane}
                    direction={spaces.column}
                    color={DATA_COLORS.secondary}
                  />
                )}
                {rank === 0 && (
                  <circle
                    aria-hidden="true"
                    cx={plane.x(0)}
                    cy={plane.y(0)}
                    r={6}
                    fill={DATA_COLORS.secondary}
                  />
                )}
                <VectorArrow
                  plane={plane}
                  to={image}
                  color={DATA_COLORS.secondary}
                  label="A x"
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
