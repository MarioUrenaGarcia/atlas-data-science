import { scaleLinear } from 'd3-scale';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

interface ShareBarsProps {
  shares: readonly number[];
  tails: readonly number[];
  label: string;
}

/**
 * Each summand's share of the variance of the sum, with the part that comes
 * from values beyond eps s_n drawn on top. Lindeberg's condition asks the
 * total of those parts to vanish.
 */
export function ShareBars({ shares, tails, label }: ShareBarsProps) {
  const n = shares.length;
  const top = Math.max(0.05, ...shares) * 1.1;
  return (
    <ChartSvg label={label} aspect={0.3} minHeight={170} maxHeight={260}>
      {(box) => {
        const x = scaleLinear()
          .domain([0.5, n + 0.5])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, top])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const gap = n > 60 ? 0 : 1;
        return (
          <>
            <Axis
              scale={y}
              orientation="left"
              position={box.inner.left}
              gridLength={box.inner.width}
              ticks={4}
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={box.inner.top + box.inner.height}
              ticks={Math.min(8, n)}
              label="Sumando i"
            />
            <Bars
              bars={shares.map((value, i) => ({ x0: i + 0.5, x1: i + 1.5, value }))}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.neutral}
              opacity={0.45}
              gap={gap}
              animate={false}
            />
            <Bars
              bars={tails.map((value, i) => ({ x0: i + 0.5, x1: i + 1.5, value }))}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.highlight}
              opacity={0.95}
              gap={gap}
              animate={false}
            />
          </>
        );
      }}
    </ChartSvg>
  );
}
