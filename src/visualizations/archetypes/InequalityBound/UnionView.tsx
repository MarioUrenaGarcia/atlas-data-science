import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { birthdayCollision } from '../../../lib/probability/inequalities.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './InequalityBound.module.css';
import type { InequalityBoundConfig } from './schema.ts';

const MAX_PEOPLE = 100;
const STEPS_PER_SECOND = 4;

interface UnionViewProps {
  title: string;
  config: InequalityBoundConfig;
}

/**
 * The union bound on the birthday problem. The event "some pair shares a
 * birthday" is the union of n(n-1)/2 pair events, each with probability 1/d.
 * Adding their probabilities ignores the overlaps, so the bound
 * n(n-1)/(2d) always lies above the exact probability; it is close while the
 * events rarely overlap and useless once it passes 1.
 */
export function UnionView({ title, config }: UnionViewProps) {
  const days = config.dias ?? 365;
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'personas',
        label: 'Número de personas',
        symbol: 'n',
        min: 2,
        max: MAX_PEOPLE,
        step: 1,
        digits: 0,
        default: config.personas ?? 23,
      },
    ],
    [config.personas],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const n = Math.round(values.personas ?? 23);
  const playback = usePlayback({
    step: () => parameters.set('personas', Math.min(MAX_PEOPLE, n + 1)),
    reset: () => parameters.set('personas', 2),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_PEOPLE,
    autoplay: false,
  });
  const { exact, bound } = birthdayCollision(n, days);
  const pairs = (n * (n - 1)) / 2;
  const f = (v: number) => formatNumber(v, 3);
  const header = `P\\Big(\\bigcup_{i < j} A_{ij}\\Big) = ${f(exact)} \\;\\le\\; \\sum_{i < j} P(A_{ij}) = \\frac{\\binom{${n}}{2}}{${days}} = \\frac{${pairs}}{${days}} ${pairs / days > 1 ? '> 1' : `= ${f(bound)}`}`;
  const description =
    `${n} personas y ${days} fechas posibles: ${pairs} parejas. Probabilidad exacta de una coincidencia ${f(exact)}; ` +
    `cota de la unión ${formatNumber(pairs / days, 3)}${pairs / days > 1 ? ', mayor que 1 y por eso inútil' : ''}.`;
  const ns = Array.from({ length: MAX_PEOPLE - 1 }, (_, i) => i + 2);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'Parejas', value: String(pairs) },
        { label: 'Probabilidad exacta', value: f(exact), color: DATA_COLORS.highlight },
        {
          label: 'Suma de probabilidades',
          value: formatNumber(pairs / days, 3),
          color: DATA_COLORS.secondary,
        },
        { label: 'Exceso de la cota', value: f(Math.min(1, pairs / days) - exact) },
      ]}
      legend={[
        {
          label: 'Probabilidad exacta de alguna coincidencia',
          color: DATA_COLORS.highlight,
          shape: 'line',
        },
        { label: 'Cota de la unión', color: DATA_COLORS.secondary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <ChartSvg label={description} aspect={0.45} minHeight={240} maxHeight={340}>
        {(box) => {
          const x = scaleLinear()
            .domain([2, MAX_PEOPLE])
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const y = scaleLinear()
            .domain([0, 1.05])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          return (
            <>
              <Axis
                scale={y}
                orientation="left"
                position={box.inner.left}
                gridLength={box.inner.width}
                ticks={5}
                label="probabilidad"
              />
              <Axis
                scale={x}
                orientation="bottom"
                position={box.inner.top + box.inner.height}
                ticks={6}
                label="personas"
              />
              <CurvePath
                points={ns.map((k) => ({ x: k, y: birthdayCollision(k, days).bound }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.secondary}
                width={2.5}
                animate={false}
              />
              <CurvePath
                points={ns.map((k) => ({ x: k, y: birthdayCollision(k, days).exact }))}
                xScale={x}
                yScale={y}
                color={DATA_COLORS.highlight}
                width={2.5}
                animate={false}
              />
              <g aria-hidden="true">
                <line
                  x1={x(n)}
                  x2={x(n)}
                  y1={y(exact)}
                  y2={y(bound)}
                  stroke={DATA_COLORS.text}
                  strokeDasharray="3 3"
                />
                <circle cx={x(n)} cy={y(exact)} r={5} fill={DATA_COLORS.highlight} />
                <circle cx={x(n)} cy={y(bound)} r={5} fill={DATA_COLORS.secondary} />
              </g>
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Con pocas personas las coincidencias de distintas parejas casi nunca ocurren a la vez y la
        suma se parece a la probabilidad exacta. Con muchas, la suma cuenta varias veces los mismos
        casos y rebasa 1.
      </p>
    </VizFrame>
  );
}
