import { scaleBand, scaleLinear } from 'd3-scale';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import svgStyles from '../../core/svg/svg.module.css';

/** Bars narrower than this drop their value label. */
const MIN_LABEL_WIDTH = 18;

interface CoefficientBarsProps {
  coefficients: readonly number[];
  previous?: readonly number[];
  highlight?: number;
  label: string;
  axisLabel: string;
}

/**
 * Coefficient of x^n for each n as a bar. The outline shows the coefficients
 * before the last multiplication, so the growth caused by one factor is visible.
 */
export function CoefficientBars({
  coefficients,
  previous,
  highlight,
  label,
  axisLabel,
}: CoefficientBarsProps) {
  return (
    <ChartSvg label={label} aspect={0.42} minHeight={220} maxHeight={340} margins={{ bottom: 40 }}>
      {(box) => {
        const band = scaleBand<number>()
          .domain(coefficients.map((_, index) => index))
          .range([box.inner.left, box.inner.left + box.inner.width])
          .padding(0.15);
        const y = scaleLinear()
          .domain([0, Math.max(1, ...coefficients)])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const labelEvery = Math.ceil(coefficients.length / 20);
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={5}
            />
            <g aria-hidden="true">
              {coefficients.map((value, index) => {
                const left = band(index) ?? 0;
                const before = previous?.[index] ?? 0;
                return (
                  <g key={index}>
                    {previous && (
                      <rect
                        x={left}
                        y={y(before)}
                        width={band.bandwidth()}
                        height={y(0) - y(before)}
                        fill="none"
                        stroke={DATA_COLORS.muted}
                        strokeDasharray="3 2"
                      />
                    )}
                    <rect
                      x={left}
                      y={y(value)}
                      width={band.bandwidth()}
                      height={y(0) - y(value)}
                      fill={index === highlight ? DATA_COLORS.highlight : DATA_COLORS.primary}
                      fillOpacity={0.75}
                    />
                    {band.bandwidth() >= MIN_LABEL_WIDTH && value > 0 && (
                      <text
                        x={left + band.bandwidth() / 2}
                        y={y(value) - 4}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                        style={{ fontSize: 10 }}
                      >
                        {value}
                      </text>
                    )}
                    {index % labelEvery === 0 && (
                      <text
                        x={left + band.bandwidth() / 2}
                        y={box.inner.top + box.inner.height + 14}
                        textAnchor="middle"
                        className={svgStyles.labelMuted}
                        style={{ fontSize: 10 }}
                      >
                        {index}
                      </text>
                    )}
                  </g>
                );
              })}
              <text
                x={box.inner.left + box.inner.width / 2}
                y={box.inner.top + box.inner.height + 32}
                textAnchor="middle"
                className={svgStyles.labelMuted}
              >
                {axisLabel}
              </text>
            </g>
          </>
        );
      }}
    </ChartSvg>
  );
}
