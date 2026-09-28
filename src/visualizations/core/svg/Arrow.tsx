import { useId } from 'react';

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  dashed?: boolean;
}

/** Straight arrow with its own marker, so each color gets a matching head. */
export function Arrow({ x1, y1, x2, y2, color, width = 2, dashed = false }: ArrowProps) {
  const id = useId().replace(/:/g, '');
  return (
    <g aria-hidden="true">
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={`url(#arrow-${id})`}
      />
    </g>
  );
}
