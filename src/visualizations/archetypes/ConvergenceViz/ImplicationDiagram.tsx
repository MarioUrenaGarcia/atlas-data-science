import type { ConvergenceFlags } from '../../../lib/limits/sequences.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Arrow } from '../../core/svg/Arrow.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

type Mode = keyof ConvergenceFlags;

const NODES: Record<Mode, { label: string; x: number; y: number }> = {
  casiSegura: { label: 'Casi segura', x: 0.14, y: 0.14 },
  mediaCuadratica: { label: 'Media cuadrática', x: 0.14, y: 0.86 },
  probabilidad: { label: 'Probabilidad', x: 0.52, y: 0.5 },
  distribucion: { label: 'Distribución', x: 0.87, y: 0.5 },
};

/** Implications that always hold. */
const IMPLICATIONS: [Mode, Mode][] = [
  ['casiSegura', 'probabilidad'],
  ['mediaCuadratica', 'probabilidad'],
  ['probabilidad', 'distribucion'],
];

/** Implications that fail in general; a sequence refutes one when it has the first mode and not the second. */
const NON_IMPLICATIONS: [Mode, Mode][] = [
  ['probabilidad', 'casiSegura'],
  ['probabilidad', 'mediaCuadratica'],
  ['distribucion', 'probabilidad'],
  ['casiSegura', 'mediaCuadratica'],
  ['mediaCuadratica', 'casiSegura'],
];

const NODE_WIDTH = 132;
const NODE_HEIGHT = 44;
const OFFSET = 18;
const CROSS = 7;

interface ImplicationDiagramProps {
  flags: ConvergenceFlags;
  label: string;
}

/**
 * The four modes of convergence with the implications that always hold
 * (solid arrows). The selected sequence colors each mode by whether it
 * converges in that sense, and every implication it refutes appears as a
 * crossed dashed arrow.
 */
export function ImplicationDiagram({ flags, label }: ImplicationDiagramProps) {
  return (
    <ChartSvg
      label={label}
      aspect={0.5}
      minHeight={240}
      maxHeight={360}
      margins={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {(box) => {
        const position = (mode: Mode) => ({
          x: box.inner.left + NODES[mode].x * box.inner.width,
          y: box.inner.top + NODES[mode].y * box.inner.height,
        });
        const width = Math.min(NODE_WIDTH, box.inner.width * 0.27);
        // Endpoints on the border of the node rectangles, shifted sideways for parallel arrows.
        const segment = (from: Mode, to: Mode, shift: number) => {
          const a = position(from);
          const b = position(to);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.hypot(dx, dy) || 1;
          const nx = -dy / length;
          const ny = dx / length;
          const cut = Math.min(
            width / 2 / Math.abs(dx || 1e-9),
            NODE_HEIGHT / 2 / Math.abs(dy || 1e-9),
          );
          const t = Math.min(0.45, cut + 4 / length);
          return {
            x1: a.x + dx * t + nx * shift,
            y1: a.y + dy * t + ny * shift,
            x2: b.x - dx * t + nx * shift,
            y2: b.y - dy * t + ny * shift,
          };
        };
        const refuted = NON_IMPLICATIONS.filter(([from, to]) => flags[from] && !flags[to]);
        return (
          <>
            {IMPLICATIONS.map(([from, to]) => (
              <Arrow
                key={`${from}-${to}`}
                {...segment(from, to, -OFFSET)}
                color={DATA_COLORS.text}
                width={2}
              />
            ))}
            {refuted.map(([from, to]) => {
              const s = segment(from, to, OFFSET);
              const mx = (s.x1 + s.x2) / 2;
              const my = (s.y1 + s.y2) / 2;
              return (
                <g key={`${from}-${to}`} aria-hidden="true">
                  <Arrow {...s} color={DATA_COLORS.negative} width={2} dashed />
                  <path
                    d={`M${mx - CROSS},${my - CROSS} L${mx + CROSS},${my + CROSS} M${mx - CROSS},${my + CROSS} L${mx + CROSS},${my - CROSS}`}
                    stroke={DATA_COLORS.negative}
                    strokeWidth={2.5}
                  />
                </g>
              );
            })}
            {(Object.keys(NODES) as Mode[]).map((mode) => {
              const p = position(mode);
              const holds = flags[mode];
              return (
                <g key={mode} aria-hidden="true">
                  <rect
                    x={p.x - width / 2}
                    y={p.y - NODE_HEIGHT / 2}
                    width={width}
                    height={NODE_HEIGHT}
                    rx={10}
                    fill={holds ? DATA_COLORS.positive : DATA_COLORS.negative}
                    fillOpacity={0.18}
                    stroke={holds ? DATA_COLORS.positive : DATA_COLORS.negative}
                    strokeWidth={2}
                  />
                  <text
                    x={p.x}
                    y={p.y - 3}
                    textAnchor="middle"
                    fontSize={12.5}
                    fontWeight={600}
                    fill="var(--color-text)"
                  >
                    {NODES[mode].label}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 13}
                    textAnchor="middle"
                    fontSize={11.5}
                    fill="var(--color-text-muted)"
                  >
                    {holds ? 'converge' : 'no converge'}
                  </text>
                </g>
              );
            })}
          </>
        );
      }}
    </ChartSvg>
  );
}
