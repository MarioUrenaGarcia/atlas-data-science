import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { characteristicOf } from '../../../lib/probability/randomVariable.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { CurvePath } from '../../core/svg/CurvePath.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MomentFunctionViz.module.css';
import { snapZero } from '../RandomVariableLab/source.ts';
import { momentSource } from './momentSource.ts';
import type { MomentFunctionVizConfig } from './schema.ts';

const STEPS = 120;
const STEPS_PER_SECOND = 15;

interface CharacteristicViewProps {
  title: string;
  config: MomentFunctionVizConfig;
}

/**
 * The characteristic function phi(t) = E[e^{itX}] as a path in the complex
 * plane: each value of X spins a point around the unit circle at its own
 * speed, and phi(t) is their weighted average. It always stays inside the
 * unit disc, starts at 1 and, for symmetric distributions, stays on the
 * real axis.
 */
export function CharacteristicView({ title, config }: CharacteristicViewProps) {
  const source = momentSource(config);
  const { pmf } = source;
  const length = config.t ?? 10;
  const [run, setRun] = useState(0);
  const [step, update] = useResettableState(`${run}`, () => 0);
  const playback = usePlayback({
    step: () => update((value) => Math.min(STEPS, value + 1)),
    stepMany: (count) => update((value) => Math.min(STEPS, value + count)),
    reset: () => setRun((value) => value + 1),
    rate: STEPS_PER_SECOND,
    done: step >= STEPS,
  });
  const t = (length * step) / STEPS;
  const path = Array.from({ length: step + 1 }, (_, i) => {
    const s = (length * i) / STEPS;
    const [re, im] = characteristicOf(pmf, s);
    return { t: s, re, im };
  });
  const [rawRe, rawIm] = characteristicOf(pmf, t);
  const re = snapZero(rawRe);
  const im = snapZero(rawIm);
  const modulus = Math.hypot(re, im);
  const f = (v: number) => formatNumber(v, 3);
  const header = `\\varphi(${f(t)}) = \\mathbb{E}[\\cos(${f(t)}X)] + i\\,\\mathbb{E}[\\sin(${f(t)}X)] = ${f(re)} ${im >= 0 ? '+' : '-'} ${f(Math.abs(im))}\\,i, \\quad |\\varphi| = ${f(modulus)}`;
  const showSpokes = pmf.values.length <= 8;
  const description = `${source.label}. En t = ${f(t)}, la función característica vale ${f(re)} más ${f(im)} i, con módulo ${f(modulus)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 't', value: f(t) },
        { label: 'Parte real', value: f(re), color: DATA_COLORS.primary },
        { label: 'Parte imaginaria', value: f(im), color: DATA_COLORS.secondary },
        { label: 'Módulo |φ(t)|', value: f(modulus) },
      ]}
      legend={[
        { label: 'Camino de φ(t)', color: DATA_COLORS.text, shape: 'line' },
        { label: 'Parte real', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'Parte imaginaria', color: DATA_COLORS.secondary, shape: 'line' },
        ...(showSpokes
          ? [
              {
                label: 'e^{itx} de cada valor',
                color: DATA_COLORS.highlight,
                shape: 'circle' as const,
              },
            ]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      {config.contexto && <p className={styles.caption}>{config.contexto}</p>}
      <div className={styles.panels}>
        <ChartSvg
          label={description}
          aspect={1}
          minHeight={240}
          maxHeight={320}
          margins={{ top: 12, right: 12, bottom: 36, left: 44 }}
        >
          {(box) => {
            const side = Math.min(box.inner.width, box.inner.height);
            const sx = scaleLinear()
              .domain([-1.1, 1.1])
              .range([box.inner.left, box.inner.left + side]);
            const sy = scaleLinear()
              .domain([-1.1, 1.1])
              .range([box.inner.top + side, box.inner.top]);
            return (
              <>
                <Axis
                  scale={sx}
                  orientation="bottom"
                  position={box.inner.top + side}
                  ticks={5}
                  label="parte real"
                />
                <Axis
                  scale={sy}
                  orientation="left"
                  position={box.inner.left}
                  ticks={5}
                  label="parte imaginaria"
                />
                <g aria-hidden="true">
                  <circle
                    cx={sx(0)}
                    cy={sy(0)}
                    r={sx(1) - sx(0)}
                    fill="none"
                    stroke={DATA_COLORS.muted}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={sx(-1.1)}
                    x2={sx(1.1)}
                    y1={sy(0)}
                    y2={sy(0)}
                    stroke={DATA_COLORS.grid}
                  />
                  <line
                    x1={sx(0)}
                    x2={sx(0)}
                    y1={sy(-1.1)}
                    y2={sy(1.1)}
                    stroke={DATA_COLORS.grid}
                  />
                  {showSpokes &&
                    pmf.values.map((value, index) => (
                      <circle
                        key={index}
                        cx={sx(Math.cos(t * value))}
                        cy={sy(Math.sin(t * value))}
                        r={3 + 10 * (pmf.probs[index] ?? 0)}
                        fill={DATA_COLORS.highlight}
                        fillOpacity={0.6}
                      />
                    ))}
                </g>
                {path.length > 1 && (
                  <CurvePath
                    points={path.map((p) => ({ x: p.re, y: p.im }))}
                    xScale={sx}
                    yScale={sy}
                    color={DATA_COLORS.text}
                    width={1.8}
                    animate={false}
                  />
                )}
                <circle cx={sx(re)} cy={sy(im)} r={6} fill={DATA_COLORS.text} aria-hidden="true" />
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.9} minHeight={240} maxHeight={320}>
          {(box) => {
            const sx = scaleLinear()
              .domain([0, length])
              .range([box.inner.left, box.inner.left + box.inner.width]);
            const sy = scaleLinear()
              .domain([-1.05, 1.05])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            return (
              <>
                <Axis
                  scale={sy}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="φ(t)"
                />
                <Axis
                  scale={sx}
                  orientation="bottom"
                  position={box.inner.top + box.inner.height}
                  ticks={5}
                  label="t"
                />
                {path.length > 1 && (
                  <>
                    <CurvePath
                      points={path.map((p) => ({ x: p.t, y: p.re }))}
                      xScale={sx}
                      yScale={sy}
                      color={DATA_COLORS.primary}
                      animate={false}
                    />
                    <CurvePath
                      points={path.map((p) => ({ x: p.t, y: p.im }))}
                      xScale={sx}
                      yScale={sy}
                      color={DATA_COLORS.secondary}
                      animate={false}
                    />
                  </>
                )}
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        {showSpokes
          ? 'Cada punto claro, de tamaño proporcional a su probabilidad, gira sobre el círculo unitario a la velocidad de su valor x; φ(t), el punto oscuro, es su promedio ponderado.'
          : 'φ(t) es el promedio de e^{itX}: siempre queda dentro del círculo unitario y vale 1 en t = 0.'}
      </p>
    </VizFrame>
  );
}
