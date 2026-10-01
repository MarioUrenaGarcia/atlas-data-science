import { formsTriangle } from '../../../lib/probability/geometric.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS, seriesColor } from '../../core/colors.ts';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';

interface StickViewProps {
  point?: { x: number; y: number };
}

const STICK_HEIGHT = 14;

/**
 * The unit stick of the broken-stick problem cut at the last sampled pair of
 * points, with its three pieces and whether they can form a triangle.
 */
export function StickView({ point }: StickViewProps) {
  const cuts = point ? [Math.min(point.x, point.y), Math.max(point.x, point.y)] : [1 / 3, 2 / 3];
  const pieces = [cuts[0] ?? 0, (cuts[1] ?? 0) - (cuts[0] ?? 0), 1 - (cuts[1] ?? 0)];
  const ok = point ? formsTriangle(point.x, point.y) : true;
  const label = point
    ? `Varilla cortada en ${formatNumber(cuts[0] ?? 0, 2)} y ${formatNumber(cuts[1] ?? 0, 2)}: piezas ${pieces.map((p) => formatNumber(p, 2)).join(', ')}. ${ok ? 'Forman un triángulo.' : 'No forman un triángulo: una pieza mide más de la mitad.'}`
    : 'Varilla de longitud 1 antes del primer corte.';
  return (
    <ChartSvg
      label={label}
      aspect={0}
      minHeight={64}
      maxHeight={64}
      margins={{ top: 8, right: 16, bottom: 8, left: 16 }}
    >
      {(box) => {
        const scale = (value: number) => box.inner.left + value * box.inner.width;
        let start = 0;
        return (
          <g aria-hidden="true">
            {pieces.map((length, index) => {
              const left = start;
              start += length;
              const tooLong = length >= 0.5;
              return (
                <g key={index}>
                  <rect
                    x={scale(left) + 1}
                    y={box.inner.top}
                    width={Math.max(0, scale(left + length) - scale(left) - 2)}
                    height={STICK_HEIGHT}
                    rx={3}
                    fill={tooLong ? DATA_COLORS.negative : seriesColor(index)}
                    fillOpacity={0.75}
                  />
                  <text
                    x={(scale(left) + scale(left + length)) / 2}
                    y={box.inner.top + STICK_HEIGHT + 14}
                    textAnchor="middle"
                    className={svgStyles.label}
                  >
                    {formatNumber(length, 2)}
                  </text>
                </g>
              );
            })}
            <line
              x1={scale(0.5)}
              x2={scale(0.5)}
              y1={box.inner.top - 4}
              y2={box.inner.top + STICK_HEIGHT + 4}
              stroke={DATA_COLORS.text}
              strokeDasharray="3 2"
            />
            {point && (
              <text
                x={box.inner.left + box.inner.width}
                y={box.inner.top + STICK_HEIGHT + 30}
                textAnchor="end"
                className={svgStyles.label}
                style={{ fill: ok ? DATA_COLORS.positive : DATA_COLORS.negative, fontWeight: 700 }}
              >
                {ok ? 'forman triángulo' : 'no forman triángulo'}
              </text>
            )}
          </g>
        );
      }}
    </ChartSvg>
  );
}
