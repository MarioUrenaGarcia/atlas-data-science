import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './PrecisionPlanner.module.css';
import type { FpcConfig } from './schema.ts';

const SWEEP_STEPS = 50;
const STEPS_PER_SECOND = 10;
const MAX_STRIP = 400;

/** Standard error of the mean with and without the finite population correction as n approaches N. */
export function FpcView({ config, title }: { config: FpcConfig; title: string }) {
  const { N, S } = config;
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      {
        type: 'number',
        key: 'n',
        label: 'Tamaño de muestra',
        symbol: 'n',
        min: 1,
        max: N,
        step: 1,
        default: Math.min(N, config.n),
      },
    ],
    // Static frontmatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const parameters = useParameters(definitions);
  const target = Number(parameters.values.n);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [sweep, update] = useResettableState<number>(`${target}|${run}`, () =>
    reducedMotion ? SWEEP_STEPS : 0,
  );
  const playback = usePlayback({
    step: () => update((v) => Math.min(SWEEP_STEPS, v + 1)),
    reset: () => setRun((v) => v + 1),
    rate: STEPS_PER_SECOND,
    done: sweep >= SWEEP_STEPS,
  });
  const n = Math.max(1, Math.round(1 + ((target - 1) * sweep) / SWEEP_STEPS));
  const factor = 1 - n / N;
  const seInfinite = S / Math.sqrt(n);
  const seFinite = Math.sqrt(factor) * seInfinite;
  const unit = config.unidad ? ` ${config.unidad}` : '';
  const header = `\\operatorname{EE}(\\bar{y}) = \\sqrt{1 - \\frac{n}{N}}\\,\\frac{S}{\\sqrt{n}} = \\sqrt{1 - \\frac{${n}}{${N}}} \\cdot \\frac{${formatNumber(S, 2)}}{\\sqrt{${n}}} = ${formatNumber(Math.sqrt(factor), 3)} \\cdot ${formatNumber(seInfinite, 3)} = ${formatNumber(seFinite, 3)}`;
  const points = (finite: boolean) =>
    Array.from({ length: Math.min(N, 300) }, (_, i) => {
      const k = 1 + ((N - 1) * i) / (Math.min(N, 300) - 1);
      return { x: k, y: (S / Math.sqrt(k)) * (finite ? Math.sqrt(Math.max(0, 1 - k / N)) : 1) };
    });
  const description =
    `Población de ${N} unidades con desviación estándar ${formatNumber(S, 2)}. Con n = ${n} (${formatNumber((n / N) * 100, 1)} % de la población), ` +
    `el error estándar sin corrección es ${formatNumber(seInfinite, 3)} y con corrección ${formatNumber(seFinite, 3)}.`;
  const showStrip = (config.franja ?? true) && N <= MAX_STRIP;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Fracción de muestreo n/N', value: formatNumber(n / N, 3) },
        { label: 'Factor 1 - n/N', value: formatNumber(factor, 3) },
        {
          label: 'Error estándar sin corrección',
          value: `${formatNumber(seInfinite, 3)}${unit}`,
          color: DATA_COLORS.secondary,
        },
        {
          label: 'Error estándar con corrección',
          value: `${formatNumber(seFinite, 3)}${unit}`,
          color: DATA_COLORS.primary,
        },
        {
          label: 'Reducción por la corrección',
          value: `${formatNumber((1 - Math.sqrt(factor)) * 100, 1)} %`,
        },
      ]}
      legend={[
        { label: 'Sin corrección: S/√n', color: DATA_COLORS.secondary, shape: 'line' },
        { label: 'Con corrección por población finita', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {showStrip && (
        <ChartSvg
          label={`${n} de ${N} unidades observadas`}
          aspect={0.08}
          minHeight={46}
          maxHeight={70}
          margins={{ top: 4, bottom: 4, left: 8, right: 8 }}
        >
          {(box) => {
            const columns = Math.ceil(N / Math.max(1, Math.floor(box.inner.height / 8)));
            const rows = Math.ceil(N / columns);
            const cw = box.inner.width / columns;
            const ch = box.inner.height / rows;
            return (
              <g aria-hidden="true">
                {Array.from({ length: N }, (_, i) => (
                  <rect
                    key={i}
                    x={box.inner.left + (i % columns) * cw + 0.5}
                    y={box.inner.top + Math.floor(i / columns) * ch + 0.5}
                    width={Math.max(0.5, cw - 1)}
                    height={Math.max(0.5, ch - 1)}
                    fill={i < n ? DATA_COLORS.highlight : DATA_COLORS.neutral}
                    fillOpacity={i < n ? 0.95 : 0.25}
                  />
                ))}
              </g>
            );
          }}
        </ChartSvg>
      )}
      <ChartSvg
        label={description}
        aspect={0.48}
        minHeight={240}
        maxHeight={360}
        margins={{ left: 56, bottom: 44 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain([1, N])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, S * 1.05])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <g>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label={`Error estándar${unit ? ` (${config.unidad})` : ''}`}
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="Tamaño de muestra n"
              />
              <CurvePath
                points={points(false)}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                width={2.5}
              />
              <CurvePath
                points={points(true)}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.primary}
                width={2.5}
              />
              <line
                x1={x(n)}
                x2={x(n)}
                y1={y(seInfinite)}
                y2={y(seFinite)}
                stroke={DATA_COLORS.highlight}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              <circle
                cx={x(n)}
                cy={y(seInfinite)}
                r={6}
                fill={DATA_COLORS.secondary}
                stroke={DATA_COLORS.text}
              />
              <circle
                cx={x(n)}
                cy={y(seFinite)}
                r={6}
                fill={DATA_COLORS.primary}
                stroke={DATA_COLORS.text}
              />
              <text
                x={Math.min(x(n) + 10, box.inner.left + box.inner.width - 80)}
                y={y(seFinite) + 18}
                className={styles.label}
              >
                {`n/N = ${formatNumber(n / N, 2)}`}
              </text>
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
