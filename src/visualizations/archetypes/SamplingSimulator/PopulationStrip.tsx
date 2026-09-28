import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { density, type Distribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath, type XY } from '../../core/svg/CurvePath.tsx';
import styles from '../../core/svg/svg.module.css';

interface PopulationStripProps {
  population: Distribution;
  domain: [number, number];
  sample: readonly number[];
  statistic: number | null;
  statisticLabel: string;
}

const POINTS = 240;
const MAX_DENSITY = 4;
const MAX_DOTS = 200;

/** Population density with the latest sample drawn as dots below it. */
export function PopulationStrip({
  population,
  domain,
  sample,
  statistic,
  statisticLabel,
}: PopulationStripProps) {
  const [lo, hi] = domain;
  const discrete = population.kind === 'discrete';
  const curve = useMemo<XY[]>(() => {
    if (discrete) return [];
    return Array.from({ length: POINTS + 1 }, (_, i) => {
      const x = lo + ((hi - lo) * i) / POINTS;
      const y = density(population, x);
      return { x, y: Number.isFinite(y) ? Math.min(y, MAX_DENSITY) : MAX_DENSITY };
    });
  }, [discrete, lo, hi, population]);
  const integers = useMemo(() => {
    if (!discrete) return [];
    const first = Math.ceil(Math.max(lo, population.support[0]));
    const last = Math.floor(Math.min(hi, population.support[1]));
    return Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => first + i);
  }, [discrete, lo, hi, population]);
  const yMax = discrete
    ? Math.max(0.05, ...integers.map((k) => density(population, k))) * 1.15
    : Math.max(0.05, ...curve.map((point) => point.y)) * 1.15;
  const dots = sample.slice(0, MAX_DOTS);

  return (
    <ChartSvg
      label="Población y última muestra extraída"
      aspect={0.28}
      minHeight={150}
      maxHeight={220}
      margins={{ bottom: 30 }}
    >
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const densityHeight = box.inner.height * 0.62;
        const y = scaleLinear()
          .domain([0, yMax])
          .range([box.inner.top + densityHeight, box.inner.top]);
        const dotsTop = box.inner.top + densityHeight + 8;
        const dotsHeight = box.inner.height - densityHeight - 12;
        const baseline = box.inner.top + box.inner.height;
        return (
          <>
            <Axis scale={x} orientation="bottom" position={baseline} ticks={7} />
            {discrete ? (
              <g aria-hidden="true">
                {integers.map((k) => (
                  <line
                    key={k}
                    x1={x(k)}
                    x2={x(k)}
                    y1={y(0)}
                    y2={y(density(population, k))}
                    stroke={DATA_COLORS.primary}
                    strokeWidth={Math.max(
                      2,
                      Math.min(10, box.inner.width / (integers.length * 2.5)),
                    )}
                  />
                ))}
              </g>
            ) : (
              <CurvePath
                points={curve}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                fill
                fillOpacity={0.15}
              />
            )}
            <text x={box.inner.left} y={box.inner.top + 10} className={styles.labelMuted}>
              Población
            </text>
            <g aria-hidden="true">
              {dots.map((value, index) => {
                // Deterministic vertical jitter separates coincident values.
                const jitter = ((index * 0.6180339887) % 1) * dotsHeight;
                return (
                  <circle
                    key={index}
                    cx={x(Math.min(hi, Math.max(lo, value)))}
                    cy={dotsTop + jitter}
                    r={3}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.7}
                  />
                );
              })}
            </g>
            {statistic !== null &&
              Number.isFinite(statistic) &&
              statistic >= lo &&
              statistic <= hi && (
                <g aria-hidden="true">
                  <line
                    x1={x(statistic)}
                    x2={x(statistic)}
                    y1={dotsTop - 4}
                    y2={baseline}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2}
                  />
                  <text x={x(statistic) + 4} y={dotsTop + 6} className={styles.label}>
                    {statisticLabel}
                  </text>
                </g>
              )}
          </>
        );
      }}
    </ChartSvg>
  );
}
