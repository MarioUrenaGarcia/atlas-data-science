import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import svgStyles from '../../core/svg/svg.module.css';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './SampleSpaceLab.module.css';
import type { SampleSpaceLabConfig } from './schema.ts';

const STAGES_PER_SECOND = 0.5;
const LAST_STAGE = 3;
const TOLERANCE = 0.005;

interface BetsViewProps {
  title: string;
  config: SampleSpaceLabConfig;
}

/**
 * Degrees of belief as betting prices. A bet on an event pays 1 if it
 * happens; a person whose prices for A and for not A do not add up to 1 can
 * be offered both bets so that they lose money whatever happens, which is
 * the Dutch book argument for the additivity of subjective probabilities.
 */
export function BetsView({ title, config }: BetsViewProps) {
  const proposition = config.proposicion ?? 'mañana llueve en la ciudad';
  const definitions = useMemo(
    () => [
      {
        type: 'number' as const,
        key: 'creenciaA',
        label: 'Precio justo de la apuesta a A',
        symbol: 'q(A)',
        min: 0,
        max: 1,
        step: 0.01,
        digits: 2,
        default: config.creenciaA ?? 0.6,
      },
      {
        type: 'number' as const,
        key: 'creenciaNoA',
        label: 'Precio justo de la apuesta a no A',
        symbol: 'q(Aᶜ)',
        min: 0,
        max: 1,
        step: 0.01,
        digits: 2,
        default: config.creenciaNoA ?? 0.55,
      },
    ],
    [config.creenciaA, config.creenciaNoA],
  );
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number>;
  const qA = values.creenciaA ?? 0;
  const qN = values.creenciaNoA ?? 0;
  const total = qA + qN;
  const gap = total - 1;
  const coherent = Math.abs(gap) < TOLERANCE;
  // With prices above 1 in total the person buys both bets; below 1 they sell both.
  const buys = gap > 0;
  const loss = coherent ? 0 : Math.abs(gap);

  const [run, setRun] = useState(0);
  const [stage, updateStage] = useResettableState(`${qA}|${qN}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStage((value) => Math.min(LAST_STAGE, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: STAGES_PER_SECOND,
    done: stage >= LAST_STAGE,
  });
  const q = (value: number) => formatNumber(value, 2);
  const headers = coherent
    ? [
        `q(A) + q(A^{c}) = ${q(qA)} + ${q(qN)} = 1`,
        `\\text{Ninguna combinación de las dos apuestas garantiza una pérdida}`,
        `\\text{Si ocurre } A\\text{:}\\;\\text{ se paga } ${q(total)} \\text{ y se recibe } 1`,
        `\\text{Si no ocurre } A\\text{:}\\;\\text{ se paga } ${q(total)} \\text{ y se recibe } 1`,
      ]
    : [
        `q(A) + q(A^{c}) = ${q(qA)} + ${q(qN)} = ${q(total)} \\neq 1`,
        buys
          ? `\\text{La persona compra ambas apuestas y paga } ${q(total)}`
          : `\\text{La persona vende ambas apuestas y cobra } ${q(total)}`,
        buys
          ? `\\text{Si ocurre } A\\text{:}\\;1 - ${q(total)} = -${q(loss)}`
          : `\\text{Si ocurre } A\\text{:}\\;${q(total)} - 1 = -${q(loss)}`,
        buys
          ? `\\text{Si no ocurre } A\\text{:}\\;1 - ${q(total)} = -${q(loss)}`
          : `\\text{Si no ocurre } A\\text{:}\\;${q(total)} - 1 = -${q(loss)}`,
      ];
  const net = coherent ? 0 : -loss;
  const description =
    `Proposición A: ${proposition}. Precios: q(A) = ${q(qA)}, q(no A) = ${q(qN)}, suma ${q(total)}. ` +
    (coherent
      ? 'Las creencias son coherentes: no existe una combinación de apuestas que produzca pérdida segura.'
      : `Las creencias son incoherentes: ${buys ? 'comprando' : 'vendiendo'} ambas apuestas la persona pierde ${q(loss)} ocurra o no A.`);

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'q(A) + q(Aᶜ)', value: q(total) },
        {
          label: 'Pérdida segura',
          value: coherent ? 'ninguna' : q(loss),
          color: coherent ? DATA_COLORS.positive : DATA_COLORS.negative,
        },
      ]}
      legend={[
        { label: 'Creencias coherentes', color: DATA_COLORS.tertiary, shape: 'line' },
        { label: 'Creencias actuales', color: DATA_COLORS.primary, shape: 'circle' },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={headers[stage] ?? ''} />
      </p>
      <p className={styles.caption}>
        A: {proposition}. Cada apuesta paga 1 si ocurre lo apostado y 0 si no.
      </p>
      <div className={styles.panels}>
        <ChartSvg
          label={description}
          aspect={1}
          minHeight={240}
          maxHeight={320}
          interactive
          margins={{ top: 12, right: 16, bottom: 44, left: 52 }}
        >
          {(box) => {
            const side = Math.min(box.inner.width, box.inner.height);
            const x = scaleLinear()
              .domain([0, 1])
              .range([box.inner.left, box.inner.left + side]);
            const y = scaleLinear()
              .domain([0, 1])
              .range([box.inner.top + side, box.inner.top]);
            return (
              <>
                <Axis
                  scale={x}
                  orientation="bottom"
                  position={box.inner.top + side}
                  ticks={5}
                  label="q(A)"
                />
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={side}
                  ticks={5}
                  label="q(Aᶜ)"
                />
                <g aria-hidden="true">
                  <line
                    x1={x(0)}
                    y1={y(1)}
                    x2={x(1)}
                    y2={y(0)}
                    stroke={DATA_COLORS.tertiary}
                    strokeWidth={3}
                  />
                  <line
                    x1={x(qA)}
                    y1={y(qN)}
                    x2={x((qA - qN + 1) / 2)}
                    y2={y((qN - qA + 1) / 2)}
                    stroke={DATA_COLORS.negative}
                    strokeDasharray="4 3"
                    strokeWidth={coherent ? 0 : 1.5}
                  />
                </g>
                <DraggablePoint
                  x={x(qA)}
                  y={y(qN)}
                  color={DATA_COLORS.primary}
                  label="Creencias en A y en no A"
                  valueText={`q(A) = ${q(qA)}, q(no A) = ${q(qN)}`}
                  onDrag={(px, py) => {
                    parameters.set('creenciaA', Math.min(1, Math.max(0, x.invert(px))));
                    parameters.set('creenciaNoA', Math.min(1, Math.max(0, y.invert(py))));
                  }}
                />
              </>
            );
          }}
        </ChartSvg>
        <ChartSvg label={description} aspect={0.9} minHeight={240} maxHeight={320}>
          {(box) => {
            const y = scaleLinear()
              .domain([-1, 1])
              .range([box.inner.top + box.inner.height, box.inner.top]);
            const slot = box.inner.width / 2;
            const bars = [
              { label: 'ocurre A', value: net, shown: stage >= 2 },
              { label: 'no ocurre A', value: net, shown: stage >= 3 },
            ];
            return (
              <>
                <Axis
                  scale={y}
                  orientation="left"
                  position={box.inner.left}
                  gridLength={box.inner.width}
                  ticks={5}
                  label="ganancia neta de la persona"
                />
                <g aria-hidden="true">
                  {bars.map((bar, index) => {
                    const left = box.inner.left + index * slot + slot * 0.2;
                    const top = Math.min(y(0), y(bar.value));
                    return (
                      <g key={bar.label}>
                        {bar.shown && (
                          <rect
                            x={left}
                            y={top}
                            width={slot * 0.6}
                            height={Math.max(2, Math.abs(y(bar.value) - y(0)))}
                            fill={bar.value < 0 ? DATA_COLORS.negative : DATA_COLORS.positive}
                            fillOpacity={0.75}
                          />
                        )}
                        <text
                          x={left + slot * 0.3}
                          y={box.inner.top + box.inner.height + 18}
                          textAnchor="middle"
                          className={svgStyles.label}
                        >
                          {bar.label}
                        </text>
                        {bar.shown && (
                          <text
                            x={left + slot * 0.3}
                            y={bar.value < 0 ? y(bar.value) + 14 : y(bar.value) - 6}
                            textAnchor="middle"
                            className={svgStyles.label}
                          >
                            {q(bar.value)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={y(0)}
                    y2={y(0)}
                    stroke={DATA_COLORS.text}
                  />
                </g>
              </>
            );
          }}
        </ChartSvg>
      </div>
      <p className={styles.caption}>
        La recta diagonal contiene las creencias coherentes, con q(A) + q(Aᶜ) = 1. La distancia a
        esa recta determina la pérdida segura.
      </p>
    </VizFrame>
  );
}
