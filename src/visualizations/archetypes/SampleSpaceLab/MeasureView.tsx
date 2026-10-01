import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { experiment, findEvent, type ExperimentId } from '../../../lib/probability/sampleSpace.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { Button } from '../../../components/ui/Button.tsx';
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
import { eventLabel, eventOptions } from './labels.ts';
import styles from './SampleSpaceLab.module.css';
import type { SampleSpaceLabConfig } from './schema.ts';

const ATOMS_PER_SECOND = 1.2;
const TOLERANCE = 5e-4;
const DIGITS = 3;
/** Width of the stacked P(A) and P(A complement) columns, in outcome slots. */
const STACK_SLOTS = 1.4;
const Y_LEVELS = [1.1, 1.5, 2, 3, 4, 6, 8, 12, 16];

interface MeasureViewProps {
  title: string;
  config: SampleSpaceLabConfig;
}

function initialWeights(config: SampleSpaceLabConfig, size: number): number[] {
  const raw = config.pesos ?? Array.from({ length: size }, () => 1);
  const total = raw.reduce((sum, value) => sum + value, 0);
  const normalize = config.normalizar ?? true;
  return raw.map((value) => (normalize && total > 0 ? value / total : value));
}

/**
 * A probability assigned to each outcome, editable by dragging the bars. The
 * three axioms are checked live, and the probability of an event is built by
 * stacking the probabilities of its outcomes, one at a time, next to the
 * stack of its complement.
 */
export function MeasureView({ title, config }: MeasureViewProps) {
  const experimentId: ExperimentId = config.experimento ?? 'dado';
  const space = experiment(experimentId);
  const size = space.outcomes.length;
  const definitions = useMemo(() => {
    const options = eventOptions(experimentId, config.eventos);
    return [
      {
        type: 'select' as const,
        key: 'evento',
        label: 'Evento A',
        options,
        default: config.eventoA ?? options[0]?.value ?? '',
      },
    ];
  }, [config, experimentId]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, string>;
  const eventId = values.evento ?? '';
  const test = findEvent(experimentId, eventId)?.test ?? (() => false);
  const members = space.outcomes.flatMap((outcome, index) => (test(outcome) ? [index] : []));
  const others = space.outcomes.flatMap((outcome, index) => (test(outcome) ? [] : [index]));

  const [version, setVersion] = useState(0);
  const [weights, updateWeights] = useResettableState(`${experimentId}|${version}`, () =>
    initialWeights(config, size),
  );
  const [run, setRun] = useState(0);
  const [stacked, updateStacked] = useResettableState(`${eventId}|${run}`, () => 0);
  const playback = usePlayback({
    step: () => updateStacked((value) => Math.min(size, value + 1)),
    reset: () => setRun((value) => value + 1),
    rate: ATOMS_PER_SECOND,
    done: stacked >= size,
  });

  const total = weights.reduce((sum, value) => sum + value, 0);
  const pA = members.reduce((sum, index) => sum + (weights[index] ?? 0), 0);
  const pNotA = total - pA;
  const stackedA = members.slice(0, Math.min(stacked, members.length));
  const stackedNotA = others.slice(0, Math.max(0, stacked - members.length));
  const partialA = stackedA.reduce((sum, index) => sum + (weights[index] ?? 0), 0);
  const partialNotA = stackedNotA.reduce((sum, index) => sum + (weights[index] ?? 0), 0);
  const sumsToOne = Math.abs(total - 1) < TOLERANCE;
  const nonNegative = weights.every((value) => value >= 0);
  const p = (index: number) => formatNumber(weights[index] ?? 0, DIGITS);
  const outcomeName = (index: number) => space.format(space.outcomes[index] ?? []);

  const header = (() => {
    if (stacked === 0) return `P(A) = \\sum_{\\omega \\in A} P(\\{\\omega\\})`;
    if (stackedNotA.length === 0) {
      const terms = stackedA.map(p).join(' + ');
      return `P(A) = ${terms}${stackedA.length === members.length ? '' : ' + \\cdots'} = ${formatNumber(partialA, DIGITS)}`;
    }
    const terms = stackedNotA.map(p).join(' + ');
    const complete = stackedNotA.length === others.length;
    return complete
      ? `P(A) + P(A^{c}) = ${formatNumber(pA, DIGITS)} + ${formatNumber(pNotA, DIGITS)} = ${formatNumber(total, DIGITS)} = P(\\Omega)`
      : `P(A^{c}) = ${terms} + \\cdots = ${formatNumber(partialNotA, DIGITS)}`;
  })();

  const description =
    `${space.label}. Probabilidades asignadas: ${weights.map((value, index) => `${outcomeName(index)}, ${formatNumber(value, DIGITS)}`).join('; ')}. ` +
    `Suma total ${formatNumber(total, DIGITS)}. Evento A: ${eventLabel(experimentId, eventId)}, P(A) = ${formatNumber(pA, DIGITS)}.`;

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      controls={
        <div className={styles.panels}>
          <Button
            size="small"
            variant="ghost"
            disabled={total <= 0 || sumsToOne}
            onClick={() => updateWeights((previous) => previous.map((value) => value / total))}
          >
            Normalizar (dividir entre la suma)
          </Button>
          <Button size="small" variant="ghost" onClick={() => setVersion((value) => value + 1)}>
            Restablecer las probabilidades
          </Button>
        </div>
      }
      readouts={[
        { label: 'Suma de todas', value: formatNumber(total, DIGITS) },
        { label: 'P(A)', value: formatNumber(pA, DIGITS), color: DATA_COLORS.primary },
        { label: 'P(Aᶜ)', value: formatNumber(pNotA, DIGITS), color: DATA_COLORS.secondary },
      ]}
      legend={[
        { label: 'Resultados de A', color: DATA_COLORS.primary },
        { label: 'Resultados fuera de A', color: DATA_COLORS.secondary },
      ]}
      description={description}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ul className={styles.axioms}>
        <li className={`${styles.axiom} ${nonNegative ? styles.axiomOk : styles.axiomFail}`}>
          Axioma 1: toda probabilidad es mayor o igual que 0.
        </li>
        <li className={`${styles.axiom} ${sumsToOne ? styles.axiomOk : styles.axiomFail}`}>
          Axioma 2: P(Ω) = 1. Suma actual: {formatNumber(total, DIGITS)}.
        </li>
        <li className={`${styles.axiom} ${styles.axiomOk}`}>
          Axioma 3: la probabilidad de una unión disjunta es la suma; así se construye P(A).
        </li>
      </ul>
      <ChartSvg
        label={description}
        aspect={0.5}
        minHeight={260}
        maxHeight={380}
        interactive
        margins={{ top: 20, right: 12, bottom: 44, left: 48 }}
      >
        {(box) => {
          const slots = size + 2 * STACK_SLOTS + 1;
          const slot = box.inner.width / slots;
          // Discrete levels keep the scale still while a bar is being dragged.
          const yMax = Y_LEVELS.find((level) => level >= total) ?? size;
          const y = scaleLinear()
            .domain([0, yMax])
            .range([box.inner.top + box.inner.height, box.inner.top]);
          const barX = (index: number) => box.inner.left + index * slot + slot * 0.15;
          const barWidth = slot * 0.7;
          const stackLeft = box.inner.left + (size + 1) * slot;
          const stackWidth = STACK_SLOTS * slot * 0.8;
          const stack = (indices: number[], left: number, color: string) => {
            let base = 0;
            return indices.map((index) => {
              const value = weights[index] ?? 0;
              const top = base + value;
              const rect = (
                <rect
                  key={index}
                  x={left}
                  y={y(top)}
                  width={stackWidth}
                  height={Math.max(0, y(base) - y(top))}
                  fill={color}
                  fillOpacity={0.75}
                  stroke="var(--color-surface)"
                />
              );
              base = top;
              return rect;
            });
          };
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
              <line
                x1={box.inner.left}
                x2={box.inner.left + box.inner.width}
                y1={y(1)}
                y2={y(1)}
                stroke={DATA_COLORS.muted}
                strokeDasharray="4 4"
              />
              <g aria-hidden="true">
                {weights.map((value, index) => {
                  const inA = members.includes(index);
                  const moved = stackedA.includes(index) || stackedNotA.includes(index);
                  return (
                    <g key={index}>
                      <rect
                        x={barX(index)}
                        y={y(value)}
                        width={barWidth}
                        height={Math.max(0, y(0) - y(value))}
                        fill={inA ? DATA_COLORS.primary : DATA_COLORS.secondary}
                        fillOpacity={moved ? 0.25 : 0.7}
                      />
                      <text
                        x={barX(index) + barWidth / 2}
                        y={y(0) + 16}
                        textAnchor="middle"
                        className={svgStyles.label}
                      >
                        {outcomeName(index)}
                      </text>
                      <text
                        x={barX(index) + barWidth / 2}
                        y={y(value) - 12}
                        textAnchor="middle"
                        className={svgStyles.label}
                        style={{ fontSize: 10 }}
                      >
                        {formatNumber(value, 2)}
                      </text>
                    </g>
                  );
                })}
                {stack(stackedA, stackLeft, DATA_COLORS.primary)}
                {stack(stackedNotA, stackLeft + STACK_SLOTS * slot, DATA_COLORS.secondary)}
                <text
                  x={stackLeft + stackWidth / 2}
                  y={y(0) + 16}
                  textAnchor="middle"
                  className={svgStyles.label}
                >
                  P(A)
                </text>
                <text
                  x={stackLeft + STACK_SLOTS * slot + stackWidth / 2}
                  y={y(0) + 16}
                  textAnchor="middle"
                  className={svgStyles.label}
                >
                  P(Aᶜ)
                </text>
              </g>
              {weights.map((value, index) => (
                <DraggablePoint
                  key={index}
                  x={barX(index) + barWidth / 2}
                  y={y(value)}
                  radius={6}
                  axis="y"
                  color={members.includes(index) ? DATA_COLORS.primary : DATA_COLORS.secondary}
                  label={`Probabilidad del resultado ${outcomeName(index)}`}
                  valueText={formatNumber(value, DIGITS)}
                  onDrag={(_, py) => {
                    const next = Math.min(1, Math.max(0, y.invert(py)));
                    updateWeights((previous) =>
                      previous.map((old, i) =>
                        i === index ? Math.round(next * 1000) / 1000 : old,
                      ),
                    );
                  }}
                />
              ))}
            </>
          );
        }}
      </ChartSvg>
      <p className={styles.caption}>
        Al arrastrar un punto cambia la probabilidad de ese resultado. La línea punteada marca el
        valor 1.
      </p>
    </VizFrame>
  );
}
