import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import type { ContinuousDistribution } from '../../../lib/distributions/index.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { Bars, type Bar } from '../../core/svg/Bars.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath, type XY } from '../../core/svg/CurvePath.tsx';

interface StatisticHistogramProps {
  values: readonly number[];
  domain: [number, number];
  theory: ContinuousDistribution | null;
  label: string;
  axisLabel: string;
}

const BINS = 36;
const CURVE_POINTS = 200;

/** Histogram of the statistic over repeated samples, scaled as a density. */
export function StatisticHistogram({
  values,
  domain,
  theory,
  label,
  axisLabel,
}: StatisticHistogramProps) {
  const [lo, hi] = domain;
  const bars = useMemo<Bar[]>(() => {
    const width = (hi - lo) / BINS;
    const counts = new Array<number>(BINS).fill(0);
    for (const value of values) {
      if (value < lo || value > hi) continue;
      const index = Math.min(BINS - 1, Math.floor((value - lo) / width));
      counts[index] = (counts[index] ?? 0) + 1;
    }
    return counts.map((count, index) => ({
      x0: lo + index * width,
      x1: lo + (index + 1) * width,
      value: values.length === 0 ? 0 : count / (values.length * width),
    }));
  }, [values, lo, hi]);
  const curve = useMemo<XY[] | null>(() => {
    if (!theory) return null;
    return Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
      const x = lo + ((hi - lo) * i) / CURVE_POINTS;
      return { x, y: theory.pdf(x) };
    });
  }, [theory, lo, hi]);
  const yMax =
    Math.max(
      0.01,
      ...bars.map((bar) => bar.value),
      ...(curve ? curve.map((point) => (Number.isFinite(point.y) ? point.y : 0)) : []),
    ) * 1.1;

  return (
    <ChartSvg label={label} aspect={0.42} minHeight={220} maxHeight={380}>
      {(box) => {
        const x = scaleLinear()
          .domain([lo, hi])
          .range([box.inner.left, box.inner.left + box.inner.width]);
        const y = scaleLinear()
          .domain([0, yMax])
          .nice()
          .range([box.inner.top + box.inner.height, box.inner.top]);
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
              ticks={7}
              label={axisLabel}
            />
            <Bars
              bars={bars}
              xScale={x}
              yScale={y}
              color={DATA_COLORS.secondary}
              opacity={0.7}
              animate={false}
            />
            {curve && (
              <CurvePath
                points={curve}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                width={2.5}
              />
            )}
          </>
        );
      }}
    </ChartSvg>
  );
}
