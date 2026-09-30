import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { gramSchmidt, rank } from '../../../lib/linalg/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { Arrow3D } from './Arrow3D.tsx';
import { CameraSliders } from './CameraSliders.tsx';
import { PlanePatch } from './PlanePatch.tsx';
import { det3, scale3, type Vec3 } from './projection.ts';
import { Scene3D } from './Scene3D.tsx';
import styles from './Space3D.module.css';
import { useCameraControls } from './useCameraControls.ts';

const EXTENT = 3;
const LINE_REACH = 8;
const PLANE_REACH = 3;
const VECTOR_COLORS = [DATA_COLORS.primary, DATA_COLORS.secondary, DATA_COLORS.highlight];
const NAMES = ['v₁', 'v₂', 'v₃'];

const SPAN_TEXT = [
  'solo el origen',
  'una recta que pasa por el origen',
  'un plano que pasa por el origen',
  'todo el espacio R³',
];

const vecText3 = (v: Vec3) => `(${v.map((value) => formatNumber(value, 2)).join(', ')})`;

interface SpanViewProps {
  title: string;
  sets: readonly { nombre: string; vectores: readonly Vec3[] }[];
}

/**
 * The span of one to three vectors in space: a line, a plane or all of R³.
 * The dimension of the span is the rank of the set; when it is smaller than
 * the number of vectors, some vector already lies in the span of the others
 * and the set is linearly dependent.
 */
export function SpanView({ title, sets }: SpanViewProps) {
  const definitions = useMemo(
    () =>
      sets.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'conjunto',
              label: 'Vectores',
              options: sets.map((set, index) => ({ value: String(index), label: set.nombre })),
              default: '0',
            },
          ]
        : [],
    [sets],
  );
  const parameters = useParameters(definitions);
  const chosen =
    sets[Number((parameters.values as Record<string, string>).conjunto ?? 0)] ?? sets[0];
  const vectors = useMemo(() => (chosen?.vectores ?? []).map((v) => [...v] as Vec3), [chosen]);
  const { camera, setCamera, playback } = useCameraControls();
  const dimension = rank(vectors.map((v) => [...v]));
  const basis = gramSchmidt(vectors.map((v) => [...v])) as Vec3[];
  const independent = dimension === vectors.length;
  const determinant =
    vectors.length === 3 ? det3(vectors[0] as Vec3, vectors[1] as Vec3, vectors[2] as Vec3) : null;
  const description =
    `${vectors.length} vector(es): ${vectors.map((v, i) => `${NAMES[i]} = ${vecText3(v)}`).join(', ')}. ` +
    `Generan ${SPAN_TEXT[dimension]}; dimensión ${dimension}. ${independent ? 'Son linealmente independientes.' : 'Son linealmente dependientes.'}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={
        definitions.length > 0
          ? { ...parameters, values: parameters.values as Record<string, unknown> }
          : undefined
      }
      controls={<CameraSliders camera={camera} setCamera={setCamera} />}
      readouts={[
        { label: 'Número de vectores', value: String(vectors.length) },
        { label: 'Dimensión del espacio generado (rango)', value: String(dimension) },
        { label: 'Espacio generado', value: SPAN_TEXT[dimension] ?? '' },
        {
          label: '¿Linealmente independientes?',
          value: independent ? 'sí' : 'no',
          color: independent ? DATA_COLORS.positive : DATA_COLORS.negative,
        },
        ...(determinant !== null
          ? [
              {
                label: 'det(v₁ v₂ v₃)',
                value: formatNumber(Math.abs(determinant) < 1e-9 ? 0 : determinant, 3),
              },
            ]
          : []),
      ]}
      legend={[
        ...vectors.map((_, i) => ({
          label: NAMES[i] ?? '',
          color: VECTOR_COLORS[i] ?? DATA_COLORS.primary,
          shape: 'line' as const,
        })),
        { label: 'Espacio generado', color: DATA_COLORS.tertiary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={`\\operatorname{gen}\\{${vectors.map((_, i) => `\\mathbf{v}_{${i + 1}}`).join(', ')}\\} = \\Big\\{ ${vectors.map((_, i) => `c_{${i + 1}}\\mathbf{v}_{${i + 1}}`).join(' + ')} \\Big\\},\\quad \\dim = ${dimension}`}
        />
      </p>
      <p className={styles.stage}>La escena gira al arrastrarla o con los controles de ángulo.</p>
      <Scene3D camera={camera} setCamera={setCamera} extent={EXTENT} label={description}>
        {(screen) => (
          <>
            {dimension === 1 && basis[0] && (
              <line
                aria-hidden="true"
                x1={screen.at(scale3(basis[0], -LINE_REACH)).x}
                y1={screen.at(scale3(basis[0], -LINE_REACH)).y}
                x2={screen.at(scale3(basis[0], LINE_REACH)).x}
                y2={screen.at(scale3(basis[0], LINE_REACH)).y}
                stroke={DATA_COLORS.tertiary}
                strokeWidth={4}
                strokeOpacity={0.7}
              />
            )}
            {dimension === 2 && basis[0] && basis[1] && (
              <PlanePatch
                screen={screen}
                u={basis[0]}
                v={basis[1]}
                reach={PLANE_REACH}
                color={DATA_COLORS.tertiary}
              />
            )}
            {dimension === 3 && (
              <rect
                aria-hidden="true"
                x={0}
                y={0}
                width="100%"
                height="100%"
                fill={DATA_COLORS.tertiary}
                fillOpacity={0.1}
              />
            )}
            {vectors.map((v, i) => (
              <Arrow3D
                key={i}
                screen={screen}
                to={v}
                color={VECTOR_COLORS[i] ?? DATA_COLORS.primary}
                label={NAMES[i]}
                width={3}
              />
            ))}
          </>
        )}
      </Scene3D>
    </VizFrame>
  );
}
