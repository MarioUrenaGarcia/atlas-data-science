import { scaleLinear, scaleLog } from 'd3-scale';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

const SAMPLES = 240;

export interface TailCurve {
  label: string;
  /** Probability to draw, such as P(X > t); values at or below the floor are cut. */
  f: (t: number) => number;
  color: string;
  dashed?: boolean;
  width?: number;
}

interface LogTailChartProps {
  curves: readonly TailCurve[];
  xDomain: [number, number];
  /** Smallest probability shown, a power of ten. */
  floor: number;
  /** Marked threshold. */
  marker?: number;
  label: string;
  xLabel: string;
}

const superscript = (value: number) =>
  String(value)
    .split('')
    .map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)] ?? (c === '-' ? '⁻' : c))
    .join('');

/**
 * Tail probabilities on a logarithmic vertical axis, where an exponential
 * tail is a straight line, a Gaussian tail bends down and a power-law tail
 * stays high.
 */
export function LogTailChart({ curves, xDomain, floor, marker, label, xLabel }: LogTailChartProps) {
  const decades = Math.round(-Math.log10(floor));
  const tickValues = Array.from({ length: decades + 1 }, (_, i) => 10 ** -i);
  return (
    <ChartSvg label={label} aspect={0.62}>
      {(box) => {
        const x = scaleLinear()
          .domain(xDomain)
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLog()
          .domain([floor, 1])
          .range([box.inner.top + box.inner.height, box.inner.top])
          .clamp(true);
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              tickValues={tickValues}
              format={(value) =>
                value === 1 ? '1' : `10${superscript(Math.round(Math.log10(value)))}`
              }
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              label={xLabel}
            />
            <g aria-hidden="true">
              {curves.map((curve) => {
                const points: string[] = [];
                const segments: string[] = [];
                for (let i = 0; i <= SAMPLES; i += 1) {
                  const t = xDomain[0] + ((xDomain[1] - xDomain[0]) * i) / SAMPLES;
                  const value = curve.f(t);
                  if (Number.isFinite(value) && value > floor) {
                    points.push(`${x(t)},${y(value)}`);
                  } else if (points.length > 0) {
                    segments.push(points.join(' '));
                    points.length = 0;
                  }
                }
                if (points.length > 0) segments.push(points.join(' '));
                return segments.map((segment, index) => (
                  <polyline
                    key={`${curve.label}-${index}`}
                    points={segment}
                    fill="none"
                    stroke={curve.color}
                    strokeWidth={curve.width ?? 2}
                    strokeDasharray={curve.dashed ? '6 4' : undefined}
                  />
                ));
              })}
              {marker !== undefined && (
                <line
                  x1={x(marker)}
                  x2={x(marker)}
                  y1={box.inner.top}
                  y2={box.inner.top + box.inner.height}
                  stroke="var(--color-text-muted)"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
