import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  centerMeasure,
  extremeIndices,
  winsorize,
  type CenterMeasure,
} from '../../../lib/stats/central.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { Latex } from '../../core/Latex.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { Axis } from '../../core/svg/Axis.tsx';
import { ChartSvg } from '../../core/svg/ChartSvg.tsx';
import { DraggablePoint } from '../../core/svg/DraggablePoint.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { useReducedMotion } from '../../core/useReducedMotion.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { useResettableState } from '../../core/useSeededRandom.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { centerFormula, MEASURE_NAMES } from './centerFormulas.ts';
import styles from './DataStrip.module.css';

const POINTS_PER_SECOND = 3;
const OUTLIER_STEPS = 16;
const DOT_RADIUS = 8;
const MIN_WEIGHTED_RADIUS = 5;
const MAX_WEIGHTED_RADIUS = 15;
const STACK_GAP = 3;
const LABEL_ROW = 16;
const FULCRUM_SIZE = 14;
const DOMAIN_PADDING = 0.08;

const MEASURE_COLORS: Record<CenterMeasure, string> = {
  media: DATA_COLORS.primary,
  ponderada: 'var(--data-8)',
  geometrica: DATA_COLORS.tertiary,
  armonica: DATA_COLORS.quaternary,
  cuadratica: DATA_COLORS.olive,
  recortada: DATA_COLORS.light,
  winsorizada: DATA_COLORS.olive,
  mediana: DATA_COLORS.highlight,
  moda: DATA_COLORS.secondary,
  'rango-medio': DATA_COLORS.neutral,
};

interface CenterViewProps {
  title: string;
  data: readonly number[];
  measures: readonly CenterMeasure[];
  weights?: readonly number[];
  proportion?: number;
  balance: boolean;
  outlier?: { indice: number; hasta: number };
  variable: string;
  unit: string;
  domain?: [number, number];
  decimals: number;
  labels?: readonly string[];
}

interface StripState {
  values: number[];
  revealed: number;
  outlierStep: number;
}

/**
 * Observations as draggable dots on a number line with live markers for
 * measures of central tendency. Points appear one at a time; an optional
 * outlier then slides away to show which measures it drags along.
 */
export function CenterView(props: CenterViewProps) {
  const { title, data, measures, weights, balance, outlier, variable, unit, decimals, labels } =
    props;
  const usesProportion = measures.includes('recortada') || measures.includes('winsorizada');
  const definitions = useMemo<ParameterDefinition[]>(
    () => [
      ...(usesProportion
        ? [
            {
              type: 'number' as const,
              key: 'proporcion',
              label: 'Proporción quitada o sustituida por lado',
              symbol: 'α',
              min: 0,
              max: 0.4,
              step: 0.05,
              default: props.proportion ?? 0.1,
              digits: 2,
            },
          ]
        : []),
      ...(measures.includes('media') || measures.includes('ponderada')
        ? [
            {
              type: 'toggle' as const,
              key: 'balanza',
              label: 'Balanza en la media',
              default: balance,
            },
          ]
        : []),
    ],
    [usesProportion, measures, props.proportion, balance],
  );
  const parameters = useParameters(definitions);
  const proportion = Number(parameters.values.proporcion ?? props.proportion ?? 0.1);
  const showBalance = Boolean(parameters.values.balanza ?? false);
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [state, update] = useResettableState<StripState>(`${data.join(',')}|${run}`, () => ({
    values: [...data],
    // Without animation the data are shown complete from the start.
    revealed: reducedMotion ? data.length : 0,
    outlierStep: 0,
  }));
  const outlierSteps = outlier ? OUTLIER_STEPS : 0;
  const done = state.revealed >= state.values.length && state.outlierStep >= outlierSteps;
  const playback = usePlayback({
    step: () =>
      update((previous) => {
        if (previous.revealed < previous.values.length) {
          return { ...previous, revealed: previous.revealed + 1 };
        }
        if (!outlier || previous.outlierStep >= OUTLIER_STEPS) return previous;
        const outlierStep = previous.outlierStep + 1;
        const start = data[outlier.indice] ?? 0;
        const values = previous.values.map((value, index) =>
          index === outlier.indice
            ? Number(
                (start + ((outlier.hasta - start) * outlierStep) / OUTLIER_STEPS).toFixed(decimals),
              )
            : value,
        );
        return { ...previous, values, outlierStep };
      }),
    reset: () => setRun((value) => value + 1),
    rate: state.revealed < state.values.length ? POINTS_PER_SECOND : POINTS_PER_SECOND * 2,
    done,
  });

  const visible = state.values.slice(0, state.revealed);
  const visibleWeights = weights?.slice(0, state.revealed);
  const options = {
    ...(visibleWeights ? { weights: visibleWeights } : {}),
    proportion,
  };
  const computed = measures.map((measure) => ({
    measure,
    value: centerMeasure(measure, visible, options),
  }));
  const principal = measures[0] ?? 'media';
  const header = centerFormula(principal, visible, { ...options, decimals });
  const extremes = usesProportion ? extremeIndices(visible, proportion) : { low: [], high: [] };
  const affected = new Set([...extremes.low, ...extremes.high]);
  const clamped = measures.includes('winsorizada') ? winsorize(visible, proportion) : null;
  const mean = centerMeasure(
    measures.includes('ponderada') ? 'ponderada' : 'media',
    visible,
    options,
  );

  const allValues = [...data, ...(outlier ? [outlier.hasta] : [])];
  const lo = props.domain?.[0] ?? Math.min(...allValues);
  const hi = props.domain?.[1] ?? Math.max(...allValues);
  const pad = props.domain ? 0 : (hi - lo) * DOMAIN_PADDING || 1;
  const domain: [number, number] = [lo - pad, hi + pad];
  const step = 10 ** -decimals;
  const maxWeight = Math.max(1, ...(weights ?? [1]));
  const unitText = unit ? ` ${unit}` : '';

  const leftMoment = visible.reduce(
    (total, x, i) => total + (x < mean ? (mean - x) * (visibleWeights?.[i] ?? 1) : 0),
    0,
  );
  const rightMoment = visible.reduce(
    (total, x, i) => total + (x > mean ? (x - mean) * (visibleWeights?.[i] ?? 1) : 0),
    0,
  );

  const description =
    `${visible.length} de ${state.values.length} observaciones de ${variable}. ` +
    computed
      .map(
        ({ measure, value }) =>
          `${MEASURE_NAMES[measure]}: ${Number.isNaN(value) ? 'no definida' : formatNumber(value, decimals + 2)}`,
      )
      .join('; ') +
    '.';

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={parameters}
      readouts={[
        { label: 'Observaciones', value: `${visible.length} de ${state.values.length}` },
        ...computed.map(({ measure, value }) => ({
          label: MEASURE_NAMES[measure],
          value: Number.isNaN(value)
            ? 'no definida'
            : `${formatNumber(value, decimals + 2)}${unitText}`,
          color: MEASURE_COLORS[measure],
        })),
        ...(showBalance && visible.length > 0
          ? [
              {
                label: 'Distancias a la izquierda de la media',
                value: formatNumber(leftMoment, decimals + 2),
              },
              {
                label: 'Distancias a la derecha de la media',
                value: formatNumber(rightMoment, decimals + 2),
              },
            ]
          : []),
      ]}
      legend={[
        { label: 'Observación (arrastrable)', color: DATA_COLORS.text, shape: 'circle' },
        ...measures.map((measure) => ({
          label: MEASURE_NAMES[measure],
          color: MEASURE_COLORS[measure],
          shape: 'line' as const,
        })),
      ]}
      description={description}
      dataTable={{
        caption: `Valores de ${variable}`,
        columns: [
          ...(labels ? ['Observación'] : ['Orden']),
          variable,
          ...(weights ? ['Peso'] : []),
        ],
        rows: visible.map((value, i) => [
          labels?.[i] ?? String(i + 1),
          formatNumber(value, decimals),
          ...(weights ? [formatNumber(weights[i] ?? 1, 2)] : []),
        ]),
      }}
    >
      <p className={styles.formula}>
        <Latex tex={header} />
      </p>
      <ChartSvg
        label={description}
        interactive
        aspect={0.42}
        minHeight={240}
        maxHeight={360}
        margins={{ top: 18 + LABEL_ROW * measures.length, right: 24, bottom: 52, left: 24 }}
      >
        {(box) => {
          const x = scaleLinear()
            .domain(domain)
            .range([box.inner.left, box.inner.left + box.inner.width]);
          const axisY = box.inner.top + box.inner.height - (showBalance ? FULCRUM_SIZE + 4 : 0);
          const stacks = new Map<string, number>();
          const radius = (i: number) =>
            weights
              ? MIN_WEIGHTED_RADIUS +
                (MAX_WEIGHTED_RADIUS - MIN_WEIGHTED_RADIUS) *
                  Math.sqrt((weights[i] ?? 1) / maxWeight)
              : DOT_RADIUS;
          const positions = visible.map((value, i) => {
            const key = value.toFixed(decimals);
            const level = stacks.get(key) ?? 0;
            stacks.set(key, level + 1);
            const r = radius(i);
            return { cx: x(value), cy: axisY - r - 4 - level * (2 * r + STACK_GAP), r };
          });
          return (
            <g>
              {computed.map(({ measure, value }, k) =>
                Number.isNaN(value) ? null : (
                  <g key={measure} aria-hidden="true">
                    <line
                      x1={x(value)}
                      x2={x(value)}
                      y1={box.inner.top - LABEL_ROW * (measures.length - k) + 4}
                      y2={axisY}
                      stroke={MEASURE_COLORS[measure]}
                      strokeWidth={2.5}
                      strokeDasharray={k === 0 ? undefined : '6 4'}
                    />
                    <text
                      x={x(value) + 5}
                      y={box.inner.top - LABEL_ROW * (measures.length - k) + 2}
                      className={styles.markerLabel}
                      fill={MEASURE_COLORS[measure]}
                    >
                      {MEASURE_NAMES[measure]}
                    </text>
                  </g>
                ),
              )}
              {clamped &&
                visible.map((value, i) =>
                  clamped[i] !== value ? (
                    <g key={`w${i}`} aria-hidden="true">
                      <line
                        x1={positions[i]?.cx ?? 0}
                        x2={x(clamped[i] ?? value)}
                        y1={positions[i]?.cy ?? 0}
                        y2={axisY + 14}
                        stroke={MEASURE_COLORS.winsorizada}
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={x(clamped[i] ?? value)}
                        cy={axisY + 14}
                        r={5}
                        fill={MEASURE_COLORS.winsorizada}
                      />
                    </g>
                  ) : null,
                )}
              <Axis
                scale={x}
                orientation="bottom"
                position={axisY}
                ticks={8}
                label={`${variable}${unit ? ` (${unit})` : ''}`}
              />
              {showBalance && visible.length > 0 && !Number.isNaN(mean) && (
                <g aria-hidden="true">
                  <line
                    x1={box.inner.left}
                    x2={box.inner.left + box.inner.width}
                    y1={axisY}
                    y2={axisY}
                    stroke={DATA_COLORS.text}
                    strokeWidth={4}
                  />
                  <path
                    d={`M ${x(mean)} ${axisY + 2} l ${-FULCRUM_SIZE / 2} ${FULCRUM_SIZE} l ${FULCRUM_SIZE} 0 z`}
                    fill={DATA_COLORS.text}
                  />
                </g>
              )}
              {visible.map((value, i) => {
                const position = positions[i];
                if (!position) return null;
                const faded = measures.includes('recortada') && affected.has(i);
                return (
                  <g key={i} opacity={faded ? 0.35 : 1}>
                    {(labels || weights) && (
                      <text
                        x={position.cx}
                        y={position.cy - position.r - 4}
                        textAnchor="middle"
                        className={styles.pointLabel}
                      >
                        {labels?.[i] ?? `w=${formatNumber(weights?.[i] ?? 1, 2)}`}
                      </text>
                    )}
                    <DraggablePoint
                      x={position.cx}
                      y={position.cy}
                      radius={position.r}
                      color={faded ? DATA_COLORS.neutral : DATA_COLORS.text}
                      axis="x"
                      label={`Observación ${labels?.[i] ?? i + 1}`}
                      valueText={`${formatNumber(value, decimals)}${unitText}`}
                      step={Math.max(2, Math.abs(x(domain[0] + step) - x(domain[0])))}
                      onDrag={(px) => {
                        const raw = Math.min(domain[1], Math.max(domain[0], x.invert(px)));
                        const snapped = Number((Math.round(raw / step) * step).toFixed(decimals));
                        playback.pause();
                        update((previous) => ({
                          ...previous,
                          values: previous.values.map((v, j) => (j === i ? snapped : v)),
                        }));
                      }}
                    />
                  </g>
                );
              })}
            </g>
          );
        }}
      </ChartSvg>
    </VizFrame>
  );
}
