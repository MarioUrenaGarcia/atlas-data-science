import { scaleBand, scaleLinear } from 'd3-scale';
import { formatNumber } from '../../../lib/format/number.ts';
import type { Atom } from '../../../lib/limits/mapping.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

interface AtomBarsProps {
  atoms: readonly Atom[];
  limit: readonly Atom[];
  label: string;
  axisLabel: string;
}

/** Paired bars for small discrete laws: the current one and the limit, at each value. */
export function AtomBars({ atoms, limit, label, axisLabel }: AtomBarsProps) {
  const keys = [...new Set([...atoms, ...limit].map((a) => Number(a.x.toPrecision(6))))].sort(
    (a, b) => a - b,
  );
  const mass = (list: readonly Atom[], key: number) =>
    list.filter((a) => Number(a.x.toPrecision(6)) === key).reduce((t, a) => t + a.p, 0);
  return (
    <ChartSvg label={label} aspect={0.7} minHeight={220} maxHeight={400}>
      {(box) => {
        const x = scaleBand<number>()
          .domain(keys)
          .range([box.inner.left, box.inner.left + box.inner.width])
          .padding(0.3);
        const y = scaleLinear()
          .domain([0, 1])
          .range([box.inner.top + box.inner.height, box.inner.top]);
        const half = x.bandwidth() / 2;
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
              {keys.map((key) => {
                const left = x(key) ?? 0;
                const current = mass(atoms, key);
                const target = mass(limit, key);
                return (
                  <g key={key}>
                    <rect
                      x={left}
                      y={y(current)}
                      width={half - 2}
                      height={y(0) - y(current)}
                      fill={DATA_COLORS.secondary}
                      fillOpacity={0.75}
                    />
                    <rect
                      x={left + half}
                      y={y(target)}
                      width={half - 2}
                      height={y(0) - y(target)}
                      fill={DATA_COLORS.primary}
                      fillOpacity={0.75}
                    />
                    <text
                      x={left + half}
                      y={box.inner.top + box.inner.height + 16}
                      textAnchor="middle"
                      fontSize={11}
                      fill="var(--color-text-muted)"
                    >
                      {formatNumber(key, 3)}
                    </text>
                  </g>
                );
              })}
              <text
                x={box.inner.left + box.inner.width / 2}
                y={box.inner.top + box.inner.height + 34}
                textAnchor="middle"
                fontSize={12}
                fontWeight={550}
                fill="var(--color-text-muted)"
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
