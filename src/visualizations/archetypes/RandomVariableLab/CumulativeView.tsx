import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { cdfAt, quantileOf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from './PmfChart.tsx';
import styles from './RandomVariableLab.module.css';
import type { RandomVariableLabConfig } from './schema.ts';
import { niceStep, resolveSource } from './source.ts';

const SWEEP_STEPS = 60;
const STEPS_PER_SECOND = 8;

interface CumulativeViewProps {
  title: string;
  config: RandomVariableLabConfig;
}

/**
 * The distribution function F(x) = P(X <= x) linked to the mass or density:
 * the mass to the left of the marker is shaded and equals the height of the
 * cumulative curve at x. The survival view shades the right side instead,
 * and a second marker reads the quantile Q(p) off the cumulative curve.
 */
export function CumulativeView({ title, config }: CumulativeViewProps) {
  const source = resolveSource(config);
  const { pmf } = source;
  const [d0, d1] = source.domain;
  const survival = config.vista === 'supervivencia';
  const step = source.continuous ? niceStep(d1 - d0) : 0.5;
  // The sweep moves several slider steps per frame so it crosses the window in a few seconds.
  const sweepStep = source.continuous ? (d1 - d0) / SWEEP_STEPS : step;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'x',
        label: 'Punto x',
        symbol: 'x',
        min: Number(d0.toFixed(2)),
        max: Number(d1.toFixed(2)),
        step,
        digits: source.continuous ? 2 : 1,
        default: config.x ?? pmf.values[Math.floor(pmf.values.length / 2)] ?? 0,
      },
      {
        type: 'number' as const,
        key: 'p',
        label: 'Probabilidad para el cuantil',
        symbol: 'p',
        min: 0.01,
        max: 0.99,
        step: 0.01,
        digits: 2,
        default: config.p ?? 0.5,
      },
    ],
    // The window and step derive from the configuration, which is fixed per figure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const x = values.x ?? 0;
  const p = values.p ?? 0.5;
  const playback = usePlayback({
    step: () => parameters.set('x', Math.min(d1, x + sweepStep)),
    reset: () => parameters.set('x', d0),
    rate: STEPS_PER_SECOND,
    done: x >= d1 - sweepStep / 2,
    autoplay: false,
  });

  const exact = source.exact;
  const F = exact ? exact.cdf(x) : cdfAt(pmf, x);
  const S = 1 - F;
  const q = exact ? exact.quantile(p) : quantileOf(pmf, p);
  const s = source.symbol;
  const shownValue = survival ? S : F;
  const terms = pmf.values
    .map((value, index) => ({ value, p: pmf.probs[index] ?? 0 }))
    .filter((term) => (survival ? term.value > x : term.value <= x));
  const termText =
    !source.continuous && terms.length > 0 && terms.length <= 6
      ? ` = ${terms.map((term) => formatNumber(term.p, 3)).join(' + ')}`
      : '';
  const header = survival
    ? `S(${formatNumber(x, 2)}) = P(${s} > ${formatNumber(x, 2)}) = 1 - F(${formatNumber(x, 2)})${termText} = ${formatNumber(S, 4)}`
    : `F(${formatNumber(x, 2)}) = P(${s} \\le ${formatNumber(x, 2)})${termText} = ${formatNumber(F, 4)} \\qquad Q(${formatNumber(p, 2)}) = ${formatNumber(q, 2)}`;
  const description =
    `${source.label}. En x = ${formatNumber(x, 2)}: F(x) = ${formatNumber(F, 4)}, P(X > x) = ${formatNumber(S, 4)}. ` +
    `Cuantil de orden ${formatNumber(p, 2)}: ${formatNumber(q, 2)}.`;
  const inShade = (value: number) => (survival ? value > x : value <= x);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        {
          label: `P(${s.replace(/[_^{}]/g, '')} ≤ x)`,
          value: formatNumber(F, 4),
          color: DATA_COLORS.primary,
        },
        {
          label: `P(${s.replace(/[_^{}]/g, '')} > x)`,
          value: formatNumber(S, 4),
          color: DATA_COLORS.secondary,
        },
        {
          label: `Cuantil Q(${formatNumber(p, 2)})`,
          value: formatNumber(q, 2),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        {
          label: survival ? 'Masa a la derecha de x' : 'Masa a la izquierda de x',
          color: survival ? DATA_COLORS.secondary : DATA_COLORS.primary,
        },
        {
          label: survival ? 'Función de supervivencia' : 'Función de distribución',
          color: DATA_COLORS.text,
          shape: 'line',
        },
        { label: 'Cuantil', color: DATA_COLORS.highlight, shape: 'dashed' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <PmfChart
        source={source}
        label={description}
        aspect={0.34}
        color={(index) =>
          inShade(pmf.values[index] ?? 0)
            ? survival
              ? DATA_COLORS.secondary
              : DATA_COLORS.primary
            : DATA_COLORS.neutral
        }
        opacity={(index) => (inShade(pmf.values[index] ?? 0) ? 0.8 : 0.35)}
        markers={[{ x, label: `x = ${formatNumber(x, 2)}`, color: DATA_COLORS.text }]}
        showValues={pmf.values.length <= 8}
      />
      <ChartSvg label={description} aspect={0.34} minHeight={180} maxHeight={280}>
        {(box) => {
          const sx = scaleLinear()
            .domain([d0, d1])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const sy = scaleLinear()
            .domain([0, 1])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const curve = source.continuous
            ? Array.from({ length: SWEEP_STEPS * 2 + 1 }, (_, i) => {
                const t = d0 + ((d1 - d0) * i) / (SWEEP_STEPS * 2);
                const value = exact ? exact.cdf(t) : cdfAt(pmf, t);
                return { x: t, y: survival ? 1 - value : value };
              })
            : [
                { x: d0, y: survival ? 1 : 0 },
                ...pmf.values.map((value) => {
                  const cumulative = cdfAt(pmf, value);
                  return { x: value, y: survival ? 1 - cumulative : cumulative };
                }),
                { x: d1, y: survival ? 0 : 1 },
              ];
          return (
            <>
              <Axis
                scale={sy}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={4}
                label={survival ? 'S(x)' : 'F(x)'}
              />
              <Axis
                scale={sx}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="x"
              />
              <CurvePath
                points={curve}
                xScale={sx}
                yScale={sy}
                color={DATA_COLORS.text}
                step={!source.continuous}
                animate={false}
              />
              <g aria-hidden="true">
                {!source.continuous &&
                  pmf.values.map((value) => (
                    <circle
                      key={value}
                      cx={sx(value)}
                      cy={sy(survival ? 1 - cdfAt(pmf, value) : cdfAt(pmf, value))}
                      r={3.5}
                      fill={DATA_COLORS.text}
                    />
                  ))}
                <line
                  x1={sx(x)}
                  x2={sx(x)}
                  y1={sy(0)}
                  y2={sy(shownValue)}
                  stroke={survival ? DATA_COLORS.secondary : DATA_COLORS.primary}
                  strokeWidth={2.5}
                />
                <circle
                  cx={sx(x)}
                  cy={sy(shownValue)}
                  r={6}
                  fill={survival ? DATA_COLORS.secondary : DATA_COLORS.primary}
                />
                {!survival && (
                  <>
                    <line
                      x1={box.inner.left}
                      x2={sx(q)}
                      y1={sy(p)}
                      y2={sy(p)}
                      stroke={DATA_COLORS.highlight}
                      strokeDasharray="5 4"
                      strokeWidth={1.5}
                    />
                    <line
                      x1={sx(q)}
                      x2={sx(q)}
                      y1={sy(p)}
                      y2={sy(0)}
                      stroke={DATA_COLORS.highlight}
                      strokeDasharray="5 4"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        {survival
          ? 'La altura de la curva en x es el área o la masa a la derecha de x en la gráfica de arriba.'
          : 'La altura de la curva en x es la masa o el área a la izquierda de x. La línea punteada lee el cuantil: se sube a la altura p y se baja al eje.'}
      </p>
    </VizFrame>
  );
}
