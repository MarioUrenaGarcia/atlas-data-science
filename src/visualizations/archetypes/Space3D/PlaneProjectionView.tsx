import { formatNumber } from '../../../lib/format/number.ts';
import { gramSchmidt } from '../../../lib/linalg/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { VizFrame } from '../../core/VizFrame.tsx';
import { Arrow3D } from './Arrow3D.tsx';
import { CameraSliders } from './CameraSliders.tsx';
import { PlanePatch } from './PlanePatch.tsx';
import { add3, dot3, norm3, scale3, sub3, type Vec3 } from './projection.ts';
import { Scene3D } from './Scene3D.tsx';
import styles from './Space3D.module.css';
import { useCameraControls } from './useCameraControls.ts';

const EXTENT = 3;
const PLANE_REACH = 3;

const vecText3 = (v: Vec3) =>
  `(${v.map((value) => formatNumber(Math.abs(value) < 1e-9 ? 0 : value, 2)).join(', ')})`;

interface PlaneProjectionViewProps {
  title: string;
  a1: Vec3;
  a2: Vec3;
  b: Vec3;
}

/**
 * Orthogonal projection of a vector of space onto a plane through the origin.
 * The projection p is the point of the plane closest to b, and the residual
 * b - p is perpendicular to every vector of the plane.
 */
export function PlaneProjectionView({ title, a1, a2, b }: PlaneProjectionViewProps) {
  const { camera, setCamera, playback } = useCameraControls();
  const [q1 = [1, 0, 0], q2 = [0, 1, 0]] = gramSchmidt([[...a1], [...a2]]) as Vec3[];
  const p = add3(scale3(q1, dot3(b, q1)), scale3(q2, dot3(b, q2)));
  const residual = sub3(b, p);
  const description =
    `b = ${vecText3(b)} se proyecta sobre el plano generado por a₁ = ${vecText3(a1)} y a₂ = ${vecText3(a2)}. ` +
    `Proyección p = ${vecText3(p)}, residuo b - p = ${vecText3(residual)} de longitud ${formatNumber(norm3(residual), 3)}, perpendicular al plano.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      controls={<CameraSliders camera={camera} setCamera={setCamera} />}
      readouts={[
        { label: 'b', value: vecText3(b), color: DATA_COLORS.highlight },
        { label: 'Proyección p', value: vecText3(p), color: DATA_COLORS.primary },
        { label: 'Residuo b - p', value: vecText3(residual), color: DATA_COLORS.secondary },
        { label: 'Distancia de b al plano', value: formatNumber(norm3(residual), 3) },
        {
          label: '(b - p) · a₁ y (b - p) · a₂',
          value: `${formatNumber(Math.abs(dot3(residual, a1)) < 1e-9 ? 0 : dot3(residual, a1), 3)} y ${formatNumber(Math.abs(dot3(residual, a2)) < 1e-9 ? 0 : dot3(residual, a2), 3)}`,
        },
      ]}
      legend={[
        { label: 'Plano generado por a₁ y a₂', color: DATA_COLORS.tertiary },
        { label: 'b', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Proyección p', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Residuo b - p', color: DATA_COLORS.secondary, shape: 'dashed' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex
          tex={
            '\\mathbf{p} = \\arg\\min_{\\mathbf{w} \\in W} \\lVert \\mathbf{b} - \\mathbf{w} \\rVert,\\qquad (\\mathbf{b} - \\mathbf{p}) \\perp W'
          }
        />
      </p>
      <p className={styles.stage}>La escena gira al arrastrarla o con los controles de ángulo.</p>
      <Scene3D camera={camera} setCamera={setCamera} extent={EXTENT} label={description}>
        {(screen) => (
          <>
            <PlanePatch
              screen={screen}
              u={q1}
              v={q2}
              reach={PLANE_REACH}
              color={DATA_COLORS.tertiary}
            />
            <Arrow3D screen={screen} to={a1} color={DATA_COLORS.neutral} label="a₁" width={2} />
            <Arrow3D screen={screen} to={a2} color={DATA_COLORS.neutral} label="a₂" width={2} />
            <Arrow3D screen={screen} to={p} color={DATA_COLORS.primary} label="p" width={3} />
            <Arrow3D
              screen={screen}
              from={p}
              to={b}
              color={DATA_COLORS.secondary}
              width={2}
              dashed
            />
            <Arrow3D screen={screen} to={b} color={DATA_COLORS.highlight} label="b" width={3} />
          </>
        )}
      </Scene3D>
    </VizFrame>
  );
}
