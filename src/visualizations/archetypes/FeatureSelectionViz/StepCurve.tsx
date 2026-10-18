import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { DATA_COLORS } from '../../core/colors.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';

/** Validation error against the number of selected features, revealed up to `shown` points. */
export function StepCurve({
  counts,
  errors,
  shown,
  best,
  label,
}: {
  counts: readonly number[];
  errors: readonly number[];
  shown: number;
  best: number;
  label: string;
}) {
  const finite = errors.filter(Number.isFinite);
  return (
    <ChartSvg
      label={label}
      aspect={0.6}
      minHeight={220}
      maxHeight={320}
      margins={{ top: 12, right: 16, bottom: 46, left: 56 }}
    >
      {(box) => {
        const { left, top, width, height } = box.inner;
        const x = scaleLinear()
          .domain([0, Math.max(1, ...counts)])
          .range([left, left + width]);
        const y = scaleLinear()
          .domain([Math.min(...finite) * 0.9, Math.max(...finite) * 1.05])
          .nice()
          .range([top + height, top]);
        const pts = counts.slice(0, shown).map((c, i) => [c, errors[i] ?? 0] as [number, number]);
        const path =
          line<[number, number]>()
            .x((p) => x(p[0]))
            .y((p) => y(p[1]))(pts) ?? '';
        return (
          <g>
            <Axis
              scale={y}
              orientation="left"
              position={left}
              gridLength={width}
              ticks={5}
              label="Error de validación"
            />
            <Axis
              scale={x}
              orientation="bottom"
              position={top + height}
              tickValues={[...new Set(counts)].sort((a, b) => a - b)}
              label="Número de variables"
            />
            <g aria-hidden="true">
              <path d={path} fill="none" stroke={DATA_COLORS.primary} strokeWidth={2.5} />
              {pts.map((p, i) => (
                <circle
                  key={i}
                  cx={x(p[0])}
                  cy={y(p[1])}
                  r={i === best && shown >= counts.length ? 7 : 4}
                  fill={
                    i === best && shown >= counts.length
                      ? DATA_COLORS.highlight
                      : DATA_COLORS.primary
                  }
                />
              ))}
            </g>
          </g>
        );
      }}
    </ChartSvg>
  );
}
