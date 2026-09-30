import { formatNumber } from '../../../lib/format/number.ts';
import type { PlaneScales } from './CartesianPlane.tsx';
import { DraggablePoint } from './DraggablePoint.tsx';
import { VectorArrow } from './VectorArrow.tsx';

/** Grid the tip snaps to, in plane units; keeps coordinates easy to read. */
const SNAP = 0.25;

interface DraggableVectorProps {
  plane: PlaneScales;
  value: readonly [number, number];
  onChange: (value: [number, number]) => void;
  color: string;
  label: string;
  /** Accessible name of the handle, such as "Punta del vector u". */
  handleLabel: string;
  snap?: number;
}

/** Vector from the origin whose tip can be dragged with pointer or keyboard. */
export function DraggableVector({
  plane,
  value,
  onChange,
  color,
  label,
  handleLabel,
  snap = SNAP,
}: DraggableVectorProps) {
  const round = (number: number) => Math.round(number / snap) * snap;
  const clampX = (number: number) => Math.max(plane.xDomain[0], Math.min(plane.xDomain[1], number));
  const clampY = (number: number) => Math.max(plane.yDomain[0], Math.min(plane.yDomain[1], number));
  return (
    <>
      <VectorArrow plane={plane} to={value} color={color} label={label} />
      <DraggablePoint
        x={plane.x(value[0])}
        y={plane.y(value[1])}
        color={color}
        label={handleLabel}
        valueText={`(${formatNumber(value[0], 2)}, ${formatNumber(value[1], 2)})`}
        step={plane.unit * snap}
        onDrag={(px, py) =>
          onChange([round(clampX(plane.x.invert(px))), round(clampY(plane.y.invert(py)))])
        }
      />
    </>
  );
}
