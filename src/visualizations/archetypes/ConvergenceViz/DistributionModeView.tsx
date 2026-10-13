import { useMemo, useState } from 'react';
import { formatNumber } from '../../../lib/format/number.ts';
import {
  DISTRIBUTION_SEQUENCES,
  maxCdfDistance,
  type DistributionSequenceId,
} from '../../../lib/limits/distributionSequences.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import type { ParameterDefinition } from '../../core/parameters.ts';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { useParameters } from '../../core/useParameters.ts';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import { SeriesChart } from '../../shared/SeriesChart.tsx';
import styles from './ConvergenceViz.module.css';

const STEPS_PER_SECOND = 4;
const PANEL_ASPECT = 0.45;
const DOT_RADIUS = 5;

interface DistributionModeViewProps {
  title: string;
  sequence: DistributionSequenceId;
  sequences: readonly DistributionSequenceId[];
  n: number;
  nMax: number;
  x0: number | undefined;
}

/**
 * Distribution functions F_n approaching F. A vertical line at x0 compares
 * F_n(x0) with F(x0); the lower panel tracks the largest gap over the
 * window as n grows, which only has to vanish when F is continuous.
 */
export function DistributionModeView({
  title,
  sequence,
  sequences,
  n: initialN,
  nMax,
  x0: initialX0,
}: DistributionModeViewProps) {
  const initial = DISTRIBUTION_SEQUENCES[sequence];
  const definitions = useMemo<ParameterDefinition[]>(() => {
    const [lo, hi] = initial.domain;
    return [
      ...(sequences.length > 1
        ? [
            {
              type: 'select' as const,
              key: 'sucesion',
              label: 'Sucesión',
              options: sequences.map((id) => ({
                value: id,
                label: DISTRIBUTION_SEQUENCES[id].label,
              })),
              default: sequence,
            },
          ]
        : []),
      {
        type: 'number' as const,
        key: 'n',
        label: 'Índice',
        symbol: 'n',
        min: 1,
        max: nMax,
        step: 1,
        default: Math.max(initial.minN, initialN),
        digits: 0,
      },
      {
        type: 'number' as const,
        key: 'x0',
        label: 'Punto de comparación',
        symbol: 'x₀',
        min: lo,
        max: hi,
        step: 0.01,
        default: initialX0 ?? lo + (hi - lo) * 0.45,
      },
    ];
  }, [sequences, sequence, initial, initialN, nMax, initialX0]);
  const parameters = useParameters(definitions);
  const values = parameters.values as Record<string, number | string>;
  const selected = (
    sequences.length > 1 ? String(values.sucesion) : sequence
  ) as DistributionSequenceId;
  const definition = DISTRIBUTION_SEQUENCES[selected];
  const [lo, hi] = definition.domain;
  const x0 = Math.min(hi, Math.max(lo, Number(values.x0)));

  const [sweep, setSweep] = useState<number | null>(null);
  const playback = usePlayback({
    step: () => setSweep((value) => Math.min(nMax, (value ?? definition.minN - 1) + 1)),
    reset: () => setSweep(null),
    rate: STEPS_PER_SECOND,
    done: sweep !== null && sweep >= nMax,
  });
  const n = Math.max(definition.minN, sweep ?? Number(values.n));

  const fn = definition.cdf(n, x0);
  const f = definition.limitCdf(x0);
  const continuousLimit = definition.jumps.length === 0;
  const atJump = definition.jumps.some((jump) => Math.abs(jump - x0) < 1e-9);
  const distances = useMemo(
    () =>
      Array.from({ length: nMax - definition.minN + 1 }, (_, i) => {
        const m = definition.minN + i;
        return { x: m, y: maxCdfDistance(definition, m, 400).distance };
      }),
    [definition, nMax],
  );
  const current = distances[n - definition.minN]?.y ?? 0;

  const description =
    `${definition.label}. Con n = ${n}, F_n(${formatNumber(x0, 2)}) = ${formatNumber(fn, 4)} y F(${formatNumber(x0, 2)}) = ${formatNumber(f, 4)}. ` +
    (atJump
      ? 'El punto elegido es un salto de F: ahí no se exige convergencia.'
      : `La diferencia en ese punto es ${formatNumber(Math.abs(fn - f), 4)}.`) +
    (continuousLimit
      ? ` La mayor diferencia en toda la ventana es ${formatNumber(current, 4)}.`
      : ' F tiene saltos, así que la mayor diferencia puede no tender a cero aunque haya convergencia en distribución.');

  return (
    <VizFrame
      title={title}
      playback={playback}
      parameters={{ ...parameters, values }}
      readouts={[
        { label: 'n', value: String(n) },
        { label: 'Fₙ(x₀)', value: formatNumber(fn, 4), color: DATA_COLORS.primary },
        { label: 'F(x₀)', value: formatNumber(f, 4), color: DATA_COLORS.secondary },
        { label: '|Fₙ(x₀) - F(x₀)|', value: formatNumber(Math.abs(fn - f), 4) },
        { label: 'x₀ es punto de continuidad de F', value: atJump ? 'no' : 'sí' },
        {
          label: 'Máximo de |Fₙ - F| en la ventana',
          value: formatNumber(current, 4),
          color: DATA_COLORS.highlight,
        },
      ]}
      legend={[
        { label: 'Fₙ, distribución de Xₙ', color: DATA_COLORS.primary, shape: 'line' },
        { label: 'F, distribución del límite', color: DATA_COLORS.secondary, shape: 'dashed' },
        { label: 'Máximo de |Fₙ - F|', color: DATA_COLORS.highlight, shape: 'line' },
      ]}
      description={description}
    >
      <FormulaLine tex={`${definition.latex}\\ \\xrightarrow{d}\\ ${definition.limitLatex}`} />
      <FormulaLine
        tex={`F_{${n}}(${formatNumber(x0, 2)}) = ${formatNumber(fn, 4)},\\qquad F(${formatNumber(x0, 2)}) = ${formatNumber(f, 4)}`}
      />
      <p className={styles.panelTitle}>Funciones de distribución</p>
      <FunctionPlot
        xDomain={definition.domain}
        yDomain={[-0.05, 1.08]}
        label={description}
        aspect={PANEL_ASPECT}
        curves={[
          {
            f: (x) => definition.limitCdf(x),
            color: DATA_COLORS.secondary,
            dashed: true,
            width: 2.5,
            breaks: definition.jumps,
          },
          { f: (x) => definition.cdf(n, x), color: DATA_COLORS.primary, width: 2.5 },
        ]}
      >
        {(s) => (
          <g aria-hidden="true">
            <line
              x1={s.x(x0)}
              x2={s.x(x0)}
              y1={s.box.inner.top}
              y2={s.box.inner.top + s.box.inner.height}
              stroke={DATA_COLORS.muted}
              strokeDasharray="4 4"
            />
            <circle cx={s.x(x0)} cy={s.y(f)} r={DOT_RADIUS} fill={DATA_COLORS.secondary} />
            <circle cx={s.x(x0)} cy={s.y(fn)} r={DOT_RADIUS} fill={DATA_COLORS.primary} />
          </g>
        )}
      </FunctionPlot>
      <p className={styles.panelTitle}>Mayor diferencia |Fₙ(x) - F(x)| en la ventana, según n</p>
      <SeriesChart
        series={[{ points: distances, color: DATA_COLORS.highlight, width: 2 }]}
        xDomain={[definition.minN, nMax]}
        yDomain={[0, 1]}
        label={`Mayor diferencia entre las funciones de distribución para cada n. ${description}`}
      >
        {(s) => (
          <circle
            aria-hidden="true"
            cx={s.x(n)}
            cy={s.y(current)}
            r={DOT_RADIUS}
            fill={DATA_COLORS.highlight}
          />
        )}
      </SeriesChart>
    </VizFrame>
  );
}
