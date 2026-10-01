import { scaleLinear } from 'd3-scale';
import { useId } from 'react';
import { covarianceEllipse, type Covariance } from '../../../lib/limits/bivariate.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

interface CloudPanelProps {
  points: readonly (readonly [number, number])[];
  covariance: Covariance;
  limits: [number, number, number, number];
  color: string;
  label: string;
  /** Direction of the projection, drawn as a line through the origin. */
  angle?: number;
  pointRadius?: number;
}

const RADII = [1, 2];

/** Scatter of centered vectors with the ellipses x^T S^-1 x = 1 and 4 of the covariance. */
export function CloudPanel({
  points,
  covariance,
  limits,
  color,
  label,
  angle,
  pointRadius = 2,
}: CloudPanelProps) {
  const [x0, x1, y0, y1] = limits;
  const clip = `cloud-clip-${useId().replace(/:/g, '')}`;
  return (
    <ChartSvg
      label={label}
      aspect={0.9}
      minHeight={220}
      maxHeight={360}
      margins={{ left: 44, right: 12, bottom: 34 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain([x0, x1])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([y0, y1])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const sx = box.inner.width / (x1 - x0);
        const sy = box.inner.height / (y1 - y0);
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={5}
            />
            <defs>
              <clipPath id={clip}>
                <rect
                  x={box.inner.left}
                  y={box.inner.top}
                  width={box.inner.width}
                  height={box.inner.height}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clip})`} aria-hidden="true">
              {points.map(([px, py], i) => (
                <circle
                  key={i}
                  cx={x(px)}
                  cy={y(py)}
                  r={pointRadius}
                  fill={color}
                  fillOpacity={0.45}
                />
              ))}
              {RADII.map((radius) => {
                const e = covarianceEllipse(covariance, radius);
                // Scale the ellipse into pixels by drawing it as a polygon, since the axes may differ in scale.
                const vertices = Array.from({ length: 73 }, (_, k) => {
                  const t = (2 * Math.PI * k) / 72;
                  const ux = e.rx * Math.cos(t);
                  const uy = e.ry * Math.sin(t);
                  const vx = ux * Math.cos(e.angle) - uy * Math.sin(e.angle);
                  const vy = ux * Math.sin(e.angle) + uy * Math.cos(e.angle);
                  return `${x(0) + vx * sx},${y(0) - vy * sy}`;
                });
                return (
                  <polyline
                    key={radius}
                    points={vertices.join(' ')}
                    fill="none"
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2}
                    strokeDasharray={radius === 1 ? undefined : '6 4'}
                  />
                );
              })}
              {angle !== undefined && (
                <line
                  x1={x(0) - Math.cos(angle) * 1000}
                  y1={y(0) + Math.sin(angle) * 1000 * (sy / sx)}
                  x2={x(0) + Math.cos(angle) * 1000}
                  y2={y(0) - Math.sin(angle) * 1000 * (sy / sx)}
                  stroke={DATA_COLORS.highlight}
                  strokeWidth={2}
                />
              )}
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
