import svgStyles from '../../core/svg/svg.module.css';

const MAX_CELL = 26;

interface DiagramProps {
  parts: readonly number[];
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  caption: string;
}

/** Ferrers diagram: one row of dots per part, largest part on top. */
export function Ferrers({ parts, x, y, width, height, color, caption }: DiagramProps) {
  const columns = Math.max(1, parts[0] ?? 1);
  const rows = Math.max(1, parts.length);
  const cell = Math.min(MAX_CELL, width / columns, (height - 24) / rows);
  return (
    <g>
      {parts.map((part, row) =>
        Array.from({ length: part }, (_, column) => (
          <circle
            key={`${row}-${column}`}
            cx={x + (column + 0.5) * cell}
            cy={y + 24 + (row + 0.5) * cell}
            r={cell * 0.38}
            fill={color}
            fillOpacity={0.75}
          />
        )),
      )}
      <text x={x} y={y + 12} className={svgStyles.label} style={{ fontWeight: 700 }}>
        {caption}
      </text>
    </g>
  );
}
