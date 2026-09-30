import { DATA_COLORS } from '../../core/colors.ts';
import type { PlaneScales } from '../../core/svg/CartesianPlane.tsx';
import { OriginLine } from '../../core/svg/OriginLine.tsx';
import type { PlaneSubset } from './closure.ts';

const FAR = 60;

/** A candidate subset of the plane, shaded so the vectors can be checked against it. */
export function SubsetShape({ plane, subset }: { plane: PlaneScales; subset: PlaneSubset }) {
  const fill = DATA_COLORS.neutral;
  switch (subset) {
    case 'recta-origen':
      return <OriginLine plane={plane} direction={[1, 2]} color={fill} width={5} />;
    case 'recta-desplazada':
      return (
        <OriginLine plane={plane} direction={[1, 2]} through={[0, 1]} color={fill} width={5} />
      );
    case 'primer-cuadrante':
      return (
        <rect
          aria-hidden="true"
          x={plane.x(0)}
          y={plane.y(FAR)}
          width={plane.x(FAR) - plane.x(0)}
          height={plane.y(0) - plane.y(FAR)}
          fill={fill}
          fillOpacity={0.18}
        />
      );
    case 'union-ejes':
      return (
        <>
          <OriginLine plane={plane} direction={[1, 0]} color={fill} width={5} />
          <OriginLine plane={plane} direction={[0, 1]} color={fill} width={5} />
        </>
      );
    case 'plano':
      return (
        <rect
          aria-hidden="true"
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill={fill}
          fillOpacity={0.12}
        />
      );
    case 'origen':
      return <circle aria-hidden="true" cx={plane.x(0)} cy={plane.y(0)} r={7} fill={fill} />;
  }
}
