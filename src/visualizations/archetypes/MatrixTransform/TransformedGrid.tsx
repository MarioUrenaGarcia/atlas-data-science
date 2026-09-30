import { DATA_COLORS } from '../../core/colors.ts';
import type { PlaneScales } from '../../core/svg/CartesianPlane.tsx';
import { VectorArrow } from '../../core/svg/VectorArrow.tsx';
import { apply, determinant, type Mat2, type Vec2 } from './matrix2.ts';

const GRID_LINES = 10;
const CIRCLE_SAMPLES = 96;

interface TransformedGridProps {
  plane: PlaneScales;
  matrix: Mat2;
  /** Shades the image of the unit square, whose area is |det|. */
  showSquare?: boolean;
  /** Draws the image of the unit circle, an ellipse for invertible matrices. */
  showCircle?: boolean;
  showBasis?: boolean;
  /** Name of the matrix in the basis labels, such as A or BA. */
  name?: string;
}

/**
 * The plane after a linear map: every grid line is sent to a line, the basis
 * vectors to the columns of the matrix, the unit square to a parallelogram and
 * the unit circle to an ellipse (or a segment when the matrix is singular).
 */
export function TransformedGrid({
  plane,
  matrix,
  showSquare = true,
  showCircle = false,
  showBasis = true,
  name = 'A',
}: TransformedGridProps) {
  const point = (v: Vec2) => {
    const image = apply(matrix, v);
    return `${plane.x(image[0])},${plane.y(image[1])}`;
  };
  const lines = Array.from({ length: 2 * GRID_LINES + 1 }, (_, index) => index - GRID_LINES);
  const det = determinant(matrix);
  const square: Vec2[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const circle = Array.from({ length: CIRCLE_SAMPLES + 1 }, (_, index) => {
    const angle = (2 * Math.PI * index) / CIRCLE_SAMPLES;
    return point([Math.cos(angle), Math.sin(angle)]);
  });
  return (
    <>
      <g aria-hidden="true">
        {lines.map((k) => (
          <g key={k}>
            <polyline
              points={`${point([k, -GRID_LINES])} ${point([k, GRID_LINES])}`}
              stroke={DATA_COLORS.primary}
              strokeOpacity={k === 0 ? 0.7 : 0.3}
              fill="none"
            />
            <polyline
              points={`${point([-GRID_LINES, k])} ${point([GRID_LINES, k])}`}
              stroke={DATA_COLORS.secondary}
              strokeOpacity={k === 0 ? 0.7 : 0.3}
              fill="none"
            />
          </g>
        ))}
        {showSquare && (
          <polygon
            points={square.map(point).join(' ')}
            fill={det >= 0 ? DATA_COLORS.highlight : DATA_COLORS.negative}
            fillOpacity={0.3}
            stroke={det >= 0 ? DATA_COLORS.highlight : DATA_COLORS.negative}
            strokeWidth={2}
          />
        )}
        {showCircle && (
          <polyline
            points={circle.join(' ')}
            fill="none"
            stroke={DATA_COLORS.tertiary}
            strokeWidth={2.5}
          />
        )}
      </g>
      {showBasis && (
        <>
          <VectorArrow
            plane={plane}
            to={apply(matrix, [1, 0])}
            color={DATA_COLORS.primary}
            label={`${name} e₁`}
            width={3}
          />
          <VectorArrow
            plane={plane}
            to={apply(matrix, [0, 1])}
            color={DATA_COLORS.secondary}
            label={`${name} e₂`}
            width={3}
          />
        </>
      )}
    </>
  );
}
