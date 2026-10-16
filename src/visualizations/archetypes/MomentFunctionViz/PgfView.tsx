import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { expectationOf, pgfOf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { PmfChart } from '../RandomVariableLab/PmfChart.tsx';
import styles from './MomentFunctionViz.module.css';
import { momentSource } from './momentSource.ts';
import type { MomentFunctionVizConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.8;
const CURVE_POINTS = 100;

interface PgfViewProps {
  title: string;
  config: MomentFunctionVizConfig;
}

/**
 * The probability generating function G(s) = E[s^X] of a variable with
 * values 0, 1, 2, ...: a power series whose coefficients are the
 * probabilities. Each stage adds one more term p_k s^k, and the tangent at
 * s = 1 has slope G'(1) = E[X].
 */
export function PgfView({ title, config }: PgfViewProps) {
  const source = momentSource(config);
  const { pmf } = source;
  const support = pmf.values.filter((value, index) => value >= 0 && (pmf.probs[index] ?? 0) > 1e-9);
  const maxOrder = Math.min(config.orden ?? 6, Math.max(...support, 0));
  const p = (k: number) => {
    const index = pmf.values.indexOf(k);
    return index >= 0 ? (pmf.probs[index] ?? 0) : 0;
  };
  const mean = expectationOf(pmf);

  const [run, setRun] = useState(0);
  const [order, update] = useResettableState(`${run}`, () => -1);
  const playback = usePlayback({
    step: () => update((value) => Math.min(maxOrder + 1, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: order >= maxOrder + 1,
  });
  const partial = (s: number, k: number) =>
    Array.from({ length: k + 1 }, (_, j) => p(j) * s ** j).reduce((a, b) => a + b, 0);
  const f = (v: number) => formatNumber(v, 3);
  const finished = order > maxOrder;
  const header =
    order < 0
      ? `G(s) = \\mathbb{E}[s^X] = \\sum_{k \\ge 0} P(X = k)\\, s^k`
      : finished
        ? `G(1) = 1, \\quad G'(1) = \\mathbb{E}[X] = ${f(mean)}, \\quad G(0) = P(X = 0) = ${f(p(0))}`
        : `G(s) \\approx ${Array.from({ length: order + 1 }, (_, k) => (k === 0 ? f(p(0)) : k === 1 ? `${f(p(1))}\\,s` : `${f(p(k))}\\,s^{${k}}`)).join(' + ')}`;
  const description =
    `${source.label}. Probabilidades P(X = k) para k = 0 a ${maxOrder}: ${Array.from({ length: maxOrder + 1 }, (_, k) => f(p(k))).join(', ')}. ` +
    `G(0) = ${f(p(0))}, G'(1) = ${f(mean)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'G(0) = P(X = 0)', value: f(p(0)), color: DATA_COLORS.secondary },
        { label: "G'(1) = E[X]", value: f(mean), color: DATA_COLORS.primary },
        {
          label: 'Términos sumados',
          value: String(Math.max(0, Math.min(order + 1, maxOrder + 1))),
        },
      ]}
      legend={[
        { label: 'G(s)', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Suma parcial', color: DATA_COLORS.highlight, shape: 'dashed' },
        { label: 'Tangente en s = 1', color: DATA_COLORS.primary, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg label={description} aspect={0.85} minHeight={240} maxHeight={320}>
          {(box) => {
            const sx = scaleLinear()
              .domain([0, 1.05])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const sy = scaleLinear()
              .domain([0, 1.1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const ss = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => i / CURVE_POINTS);
            return (
              <>
                <Axis
                  scale={sy}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="G(s)"
                />
                <Axis
                  scale={sx}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="s"
                />
                <CurvePath
                  points={ss.map((s) => ({ x: s, y: pgfOf(pmf, s) }))}
                  xScale={sx}
                  yScale={sy}
                  color={DATA_COLORS.text}
                  width={2.5}
                  animate={false}
                />
                {order >= 0 && !finished && (
                  <CurvePath
                    points={ss.map((s) => ({ x: s, y: partial(s, order) }))}
                    xScale={sx}
                    yScale={sy}
                    color={DATA_COLORS.highlight}
                    dashed
                    animate={false}
                  />
                )}
                {finished && (
                  <line
                    aria-hidden="true"
                    x1={sx(1 - 0.3)}
                    x2={sx(1.05)}
                    y1={sy(Math.max(0, 1 - 0.3 * mean))}
                    y2={sy(Math.min(1.1, 1 + 0.05 * mean))}
                    stroke={DATA_COLORS.primary}
                    strokeWidth={2}
                  />
                )}
                <circle
                  cx={sx(0)}
                  cy={sy(p(0))}
                  r={5}
                  fill={DATA_COLORS.secondary}
                  aria-hidden="true"
                />
                <circle cx={sx(1)} cy={sy(1)} r={5} fill={DATA_COLORS.primary} aria-hidden="true" />
              </>
            );
          }}
        </ChartSvg>
        <PmfChart
          source={{ ...source, domain: [-0.5, Math.max(...support, 1) + 0.5] }}
          label={description}
          aspect={0.85}
          color={(index) =>
            (pmf.values[index] ?? 0) <= order ? DATA_COLORS.highlight : DATA_COLORS.neutral
          }
          showValues={support.length <= 10}
        />
      </div>
      <p className={styles.caption}>
        Cada término p_k s^k de la serie usa una barra de la derecha: la suma parcial sube hacia la
        curva conforme se agregan probabilidades. En s = 1 la serie vale 1 y su pendiente es la
        media.
      </p>
    </VizFrame>
  );
}
