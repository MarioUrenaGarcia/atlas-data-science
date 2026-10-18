import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { rationalCover } from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';

const STEPS_PER_SECOND = 2;
const DEFAULT_EPSILON = 0.5;
const DEFAULT_COUNT = 30;
/** Intervals are spread over a few rows so overlapping ones stay visible. */
const ROWS = 6;
const DOT_RADIUS = 3;

/** The gap epsilon 2^-n in scientific notation, so the strict inequality stays visible for large n. */
function slackTex(value: number): string {
  const [mantissa, exponent] = value.toExponential(2).split('e');
  return `${mantissa ?? '0'} \\times 10^{${Number(exponent ?? 0)}}`;
}

interface CoverViewProps {
  title: string;
  epsilon?: number;
  count?: number;
}

/**
 * The rationals of [0, 1], listed one after another, each covered by an
 * interval: the k-th gets length epsilon / 2^k. However many rationals are
 * covered, the total length stays below epsilon, and epsilon can be as small
 * as desired, so the rationals have Lebesgue measure zero.
 */
export function CoverView({
  title,
  epsilon = DEFAULT_EPSILON,
  count = DEFAULT_COUNT,
}: CoverViewProps) {
  const parameters = useParameters([
    {
      type: 'number',
      key: 'eps',
      label: 'Longitud total permitida ε',
      min: 0.05,
      max: 1,
      step: 0.05,
      default: epsilon,
      digits: 2,
    },
  ] as const);
  const eps = Number(parameters.values.eps);
  const cover = useMemo(() => rationalCover(count, eps), [count, eps]);
  const [shown, setShown] = useState(0);
  const playback = usePlayback({
    step: () => setShown((value) => Math.min(count, value + 1)),
    reset: () => setShown(0),
    rate: STEPS_PER_SECOND,
    done: shown >= count,
  });
  const visible = cover.slice(0, shown);
  const sum = visible.reduce((s, c) => s + c.length, 0);
  const latest = visible[visible.length - 1];
  const description =
    `${shown} racionales cubiertos con ε = ${formatNumber(eps, 2)}: la suma de longitudes es ${formatNumber(sum, 6)}, ` +
    `siempre menor que ε.${latest ? ` El último es ${latest.p}/${latest.q}, con un intervalo de longitud ${formatNumber(latest.length, 6)}.` : ''}`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Racionales cubiertos', value: String(shown) },
        { label: 'Último racional', value: latest ? `${latest.p}/${latest.q}` : 'ninguno' },
        { label: 'Longitud del último', value: latest ? formatNumber(latest.length, 6) : '0' },
        { label: 'Suma de longitudes', value: formatNumber(sum, 6), color: DATA_COLORS.highlight },
        { label: 'Cota ε', value: formatNumber(eps, 2) },
      ]}
      legend={[
        { label: 'Intervalo que cubre un racional', color: DATA_COLORS.primary },
        { label: 'Último agregado', color: DATA_COLORS.highlight },
      ]}
      description={description}
    >
      <FormulaLine
        tex={`\\sum_{k=1}^{${shown}} \\frac{\\varepsilon}{2^{k}} = \\varepsilon\\left(1 - 2^{-${shown}}\\right) = ${formatNumber(eps, 2)} - ${slackTex(eps * 2 ** -shown)} < \\varepsilon`}
      />
      <ChartSvg
        label={description}
        aspect={0.35}
        minHeight={180}
        maxHeight={320}
        margins={{ left: 20, right: 20, bottom: 36 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([-0.1, 1.1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, ROWS])
            .range([box.inner.top, box.inner.top + box.inner.height]);
          return (
            <>
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                tickValues={[0, 0.25, 0.5, 0.75, 1]}
              />
              <g aria-hidden="true">
                {visible.map((c, k) => {
                  const row = k % ROWS;
                  const isLast = k === visible.length - 1;
                  return (
                    <g key={k}>
                      <rect
                        x={x(c.interval[0])}
                        width={Math.max(1, x(c.interval[1]) - x(c.interval[0]))}
                        y={y(row + 0.25)}
                        height={y(0.5) - y(0)}
                        fill={isLast ? DATA_COLORS.highlight : DATA_COLORS.primary}
                        fillOpacity={isLast ? 0.9 : 0.55}
                      />
                      <circle
                        cx={x(c.value)}
                        cy={y(row + 0.5)}
                        r={DOT_RADIUS}
                        fill={DATA_COLORS.text}
                      />
                    </g>
                  );
                })}
              </g>
            </>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
