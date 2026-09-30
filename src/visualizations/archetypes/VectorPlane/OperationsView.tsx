import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { CartesianPlane } from '../../core/svg/CartesianPlane.tsx';
import { DraggableVector } from '../../core/svg/DraggableVector.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import type { Vec2 } from './schema.ts';
import { useVectors } from './useVectors.ts';
import { add, length, scale, sub, vecLatex, vecText } from './vectors.ts';
import styles from './VectorPlane.module.css';

const STAGES = [
  'Los vectores u y v salen del origen.',
  'Se traslada v para que empiece en la punta de u.',
  'La suma u + v va del origen a la nueva punta: es la diagonal del paralelogramo.',
  'La resta u - v va de la punta de v a la punta de u.',
  'El múltiplo c u estira o encoge a u, y lo invierte si c es negativo.',
] as const;
const STAGES_PER_SECOND = 0.45;

/** Header formula of the operation shown at each stage of the animation. */
function stageFormula(stage: number, u: Vec2, v: Vec2, c: number): string {
  switch (stage) {
    case 0:
      return `\\mathbf{u} = ${vecLatex(u)},\\quad \\mathbf{v} = ${vecLatex(v)}`;
    case 1:
    case 2:
      return `\\mathbf{u} + \\mathbf{v} = ${vecLatex(u)} + ${vecLatex(v)} = ${vecLatex(add(u, v))}`;
    case 3:
      return `\\mathbf{u} - \\mathbf{v} = ${vecLatex(u)} - ${vecLatex(v)} = ${vecLatex(sub(u, v))}`;
    default:
      return `c\\,\\mathbf{u} = ${formatNumber(c, 2)} ${vecLatex(u)} = ${vecLatex(scale(u, c))}`;
  }
}

interface OperationsViewProps {
  title: string;
  u: Vec2;
  v: Vec2;
  scalar: number;
}

/**
 * Vector addition by the parallelogram rule, subtraction as the arrow that
 * joins the tips and multiplication by a scalar. The tips of u and v can be
 * dragged, and the animation goes through each operation in turn.
 */
export function OperationsView({ title, u, v, scalar }: OperationsViewProps) {
  const initial = useMemo(() => [u, v], [u, v]);
  const { vectors, set, reset } = useVectors(initial);
  const [a = u, b = v] = vectors;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'c',
        label: 'Escalar',
        symbol: 'c',
        min: -3,
        max: 3,
        step: 0.25,
        default: scalar,
        digits: 2,
      },
    ],
    [scalar],
  );
  const parameters = useParameters(definitions);
  const c = Number((parameters.values as Record<string, number>).c);
  const [stage, setStage] = useState(0);
  const playback = usePlayback({
    step: () => setStage((value) => (value + 1) % STAGES.length),
    reset: () => {
      setStage(0);
      reset();
    },
    rate: STAGES_PER_SECOND,
  });
  const sum = add(a, b);
  const difference = sub(a, b);
  const multiple = scale(a, c);
  const description =
    `u = ${vecText(a)}, v = ${vecText(b)}. ${STAGES[stage]} ` +
    `u + v = ${vecText(sum)}, u - v = ${vecText(difference)}, c u = ${vecText(multiple)} con c = ${formatNumber(c, 2)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values: parameters.values as Record<string, unknown> }}
      readouts={[
        { label: 'u', value: vecText(a), color: DATA_COLORS.primary },
        { label: 'v', value: vecText(b), color: DATA_COLORS.secondary },
        { label: 'u + v', value: vecText(sum), color: DATA_COLORS.tertiary },
        { label: 'u - v', value: vecText(difference), color: DATA_COLORS.quaternary },
        {
          label: `c u (c = ${formatNumber(c, 2)})`,
          value: vecText(multiple),
          color: DATA_COLORS.highlight,
        },
        {
          label: '‖u‖, ‖v‖, ‖u + v‖',
          value: `${formatNumber(length(a), 2)}, ${formatNumber(length(b), 2)}, ${formatNumber(length(sum), 2)}`,
        },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={stageFormula(stage, a, b, c)} />
      </p>
      <p className={styles.stage}>{STAGES[stage]}</p>
      <CartesianPlane extent={6} label={description} interactive>
        {(plane) => (
          <>
            {stage >= 1 && stage <= 2 && (
              <>
                <VectorArrow plane={plane} from={a} to={sum} color={DATA_COLORS.secondary} dashed />
                <VectorArrow plane={plane} from={b} to={sum} color={DATA_COLORS.primary} dashed />
              </>
            )}
            {stage === 2 && (
              <VectorArrow
                plane={plane}
                to={sum}
                color={DATA_COLORS.tertiary}
                label="u + v"
                width={3}
              />
            )}
            {stage === 3 && (
              <VectorArrow
                plane={plane}
                from={b}
                to={a}
                color={DATA_COLORS.quaternary}
                label="u - v"
                width={3}
              />
            )}
            {stage === 4 && (
              <VectorArrow
                plane={plane}
                to={multiple}
                color={DATA_COLORS.highlight}
                label="c u"
                width={4}
              />
            )}
            <DraggableVector
              plane={plane}
              value={a}
              onChange={(value) => set(0, value)}
              color={DATA_COLORS.primary}
              label="u"
              handleLabel="Punta del vector u"
            />
            <DraggableVector
              plane={plane}
              value={b}
              onChange={(value) => set(1, value)}
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
