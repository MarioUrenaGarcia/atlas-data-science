import { scaleBand, scaleLinear } from 'd3-scale';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import styles from '../../core/svg/svg.module.css';
import { useTween } from '../../core/useTween.ts';

interface DistributionBarsProps {
  states: readonly string[];
  empirical: readonly number[];
  theoretical: readonly number[];
  stationary: readonly number[];
  label: string;
}

/** For each state: visit frequency, probability after n steps and the stationary value. */
export function DistributionBars({
  states,
  empirical,
  theoretical,
  stationary,
  label,
}: DistributionBarsProps) {
  const shownEmpirical = useTween(empirical, 200);
  const shownTheoretical = useTween(theoretical, 200);
  return (
    <ChartSvg
      label={label}
      aspect={0.42}
      minHeight={200}
      maxHeight={320}
      margins={{ left: 44, bottom: 34 }}
    >
      {(box) => {
        const x = scaleBand<number>()
          .domain(states.map((_, index) => index))
          .range([box.inner.left, box.inner.left + box.inner.width])
          .padding(0.25);
        const y = scaleLinear()
          .domain([0, 1])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const band = x.bandwidth();
        const baseline = box.inner.top + box.inner.height;
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={4}
            />
            <line
              x1={box.inner.left}
              x2={box.inner.left + box.inner.width}
              y1={baseline}
              y2={baseline}
              stroke="var(--data-axis)"
            />
            {states.map((state, index) => {
              const left = x(index) ?? 0;
              const empiricalValue = shownEmpirical[index] ?? 0;
              const theoreticalValue = shownTheoretical[index] ?? 0;
              const stationaryValue = stationary[index] ?? 0;
              return (
                <g key={state} aria-hidden="true">
                  <rect
                    x={left}
                    y={y(empiricalValue)}
                    width={band / 2}
                    height={baseline - y(empiricalValue)}
                    fill={DATA_COLORS.secondary}
                    fillOpacity={0.8}
                  />
                  <rect
                    x={left + band / 2}
                    y={y(theoreticalValue)}
                    width={band / 2}
                    height={baseline - y(theoreticalValue)}
                    fill={DATA_COLORS.primary}
                    fillOpacity={0.8}
                  />
                  <line
                    x1={left - 4}
                    x2={left + band + 4}
                    y1={y(stationaryValue)}
                    y2={y(stationaryValue)}
                    stroke={DATA_COLORS.text}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={left + band / 2}
                    y={baseline + 16}
                    textAnchor="middle"
                    className={styles.label}
                  >
                    {state}
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
