import { useState } from 'react';
import { SEQUENCES, type SequenceCase } from '../../../lib/measure/index.ts';
import { formatNumber } from '../../../lib/format/number.ts';
import { DATA_COLORS } from '../../core/colors.ts';
import { FormulaLine } from '../../core/FormulaLine.tsx';
import { FunctionPlot } from '../../core/svg/FunctionPlot.tsx';
import { usePlayback } from '../../core/usePlayback.ts';
import { VizFrame } from '../../core/VizFrame.tsx';
import styles from './MeasureLab.module.css';

const MAX_N = 16;
const STEPS_PER_SECOND = 1.2;
const DOT_RADIUS = 4;
/** Terms drawn faintly behind the current one. */
const TRAIL = 3;

export type SequenceFocus = 'limite' | 'fatou';

interface SequenceViewProps {
  title: string;
  kind: SequenceCase;
  focus: SequenceFocus;
}

const CAPTIONS: Readonly<Record<SequenceCase, string>> = {
  potencias: 'f_n(x) = x^n',
  creciente: 'f_n(x) = \\min\\{n, 1/\\sqrt{x}\\}',
  'escalon-alto': 'f_n = n\\,\\mathbf{1}_{(0, 1/n)}',
  alternante: 'f_n = \\mathbf{1}_{[0, 1/2)} \\text{ o } \\mathbf{1}_{[1/2, 1)}',
};

/**
 * A sequence of functions on [0, 1], one term per step, next to the sequence
 * of their integrals. The convergence theorems say when the integral of the
 * limit equals the limit of the integrals: monotone increase or an integrable
 * bound are enough; without them the integrals may stay away from the integral
 * of the limit, and Fatou's lemma keeps only an inequality.
 */
export function SequenceView({ title, kind, focus }: SequenceViewProps) {
  const sequence = SEQUENCES[kind];
  const [n, setN] = useState(1);
  const playback = usePlayback({
    step: () => setN((value) => Math.min(MAX_N, value + 1)),
    reset: () => setN(1),
    rate: STEPS_PER_SECOND,
    done: n >= MAX_N,
  });
  const integral = sequence.integral(n);
  const liminfIntegrals = sequence.liminfIntegral;
  const fatou = focus === 'fatou';
  // The alternating sequence has no pointwise limit; its dashed curve is the lim inf.
  const converges = kind !== 'alternante';
  const pointwise = converges ? '\\lim_n f_n' : '\\liminf_n f_n';
  const header = fatou
    ? `\\int \\liminf_{n} f_n\\,d\\lambda = ${formatNumber(sequence.limitIntegral, 3)} \\;\\le\\; \\liminf_{n} \\int f_n\\,d\\lambda = ${formatNumber(liminfIntegrals, 3)}`
    : `${CAPTIONS[kind]}:\\ \\int_0^1 f_{${n}}\\,d\\lambda = ${formatNumber(integral, 4)},\\quad \\lim_n \\int_0^1 f_n\\,d\\lambda = ${formatNumber(
        liminfIntegrals,
        3,
      )},\\quad \\int_0^1 ${pointwise}\\,d\\lambda = ${formatNumber(sequence.limitIntegral, 3)}`;
  const description =
    `Término n = ${n}: su integral es ${formatNumber(integral, 4)}; la integral del ${converges ? 'límite' : 'límite inferior'} puntual es ${formatNumber(sequence.limitIntegral, 3)}. ` +
    (sequence.dominatingName
      ? `Todas las funciones están bajo la cota integrable ${sequence.dominatingName}.`
      : 'No hay una cota integrable común.');
  const trail = Array.from({ length: Math.min(TRAIL, n - 1) }, (_, i) => n - 1 - i);

  return (
    <VizFrame
      title={title}
      playback={playback}
      readouts={[
        { label: 'Término n', value: String(n) },
        { label: '∫ fₙ dλ', value: formatNumber(integral, 4), color: DATA_COLORS.highlight },
        { label: '∫ (límite) dλ', value: formatNumber(sequence.limitIntegral, 3) },
        ...(fatou
          ? [{ label: 'lím inf de las integrales', value: formatNumber(liminfIntegrals, 3) }]
          : []),
        { label: 'Cota integrable', value: sequence.dominatingName ?? 'no existe' },
      ]}
      legend={[
        { label: 'Término actual', color: DATA_COLORS.highlight, shape: 'line' },
        { label: 'Términos anteriores', color: DATA_COLORS.primary, shape: 'line' },
        {
          label: fatou || !converges ? 'lím inf puntual' : 'Límite puntual',
          color: DATA_COLORS.text,
          shape: 'dashed',
        },
        ...(sequence.dominating
          ? [{ label: 'Cota g', color: DATA_COLORS.muted, shape: 'dashed' as const }]
          : []),
      ]}
      description={description}
    >
      <FormulaLine tex={header} />
      <div className={styles.pair}>
        <FunctionPlot
          xDomain={[0, 1]}
          yDomain={[0, sequence.yMax]}
          label={`Funciones de la sucesión. ${description}`}
          curves={[
            ...(sequence.dominating
              ? [
                  {
                    f: sequence.dominating,
                    color: DATA_COLORS.muted,
                    width: 1.5,
                    dashed: true,
                    from: 0.002,
                  },
                ]
              : []),
            ...trail.map((k) => ({ f: sequence.term(k), color: DATA_COLORS.primary, width: 1.5 })),
            { f: sequence.limit, color: DATA_COLORS.text, width: 2, dashed: true, from: 0.002 },
            { f: sequence.term(n), color: DATA_COLORS.highlight, width: 3, from: 0.002 },
          ]}
        />
        <FunctionPlot
          xDomain={[0.5, MAX_N + 0.5]}
          yDomain={[0, Math.max(1.1, sequence.limitIntegral * 1.15, sequence.integral(1) * 1.15)]}
          xLabel="n"
          label={`Integrales de los términos. ${description}`}
          curves={[
            { f: () => sequence.limitIntegral, color: DATA_COLORS.text, width: 2, dashed: true },
          ]}
        >
          {({ x, y }) => (
            <g aria-hidden="true">
              {Array.from({ length: n }, (_, i) => (
                <circle
                  key={i}
                  cx={x(i + 1)}
                  cy={y(sequence.integral(i + 1))}
                  r={DOT_RADIUS}
                  fill={i + 1 === n ? DATA_COLORS.highlight : DATA_COLORS.primary}
                />
              ))}
            </g>
          )}
        </FunctionPlot>
      </div>
    </VizFrame>
  );
}
